import { showDiagramPopover, closeDiagramPopover, isDiagramPopoverAnchor } from './diagram-popover.js?v=6e59a476be74';
import { sourceTitle } from './source-links.js?v=12527b297d95';

const escape = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const pair = (zh, en) => ({zh, en});
const read = (value, t) => typeof value === 'string' ? value : t(value.zh, value.en);
const virtioSource = 'https://docs.oasis-open.org/virtio/virtio/v1.2/virtio-v1.2.html';
const armSource = 'https://developer.arm.com/-/media/Arm%20Developer%20Community/PDF/Learn%20the%20Architecture/Armv8-A%20virtualization.pdf';
const aospSource = 'https://source.android.com/docs/core/virtualization/architecture';
const qSource = 'https://docs.qualcomm.com/bundle/publicresource/topics/80-70022-3/virtualization.html';
const gunyahSource = 'https://github.com/quic/gunyah-hypervisor';

const nodes = [
  ['guest-app', 146, 76, 221, 60, pair('Guest 应用','Guest app'), pair('发起设备请求','Starts device I/O')],
  ['guest-os', 146, 209, 221, 60, pair('Guest 内核','Guest kernel'), pair('处理系统调用','Handles system calls')],
  ['virtio', 146, 338, 221, 60, pair('VirtIO 前端','VirtIO frontend'), pair('Guest 内核驱动','Guest kernel driver')],
  ['vmm', 434, 76, 199, 60, 'VMM', pair('管理虚拟机生命周期','Manages the VM lifecycle')],
  ['host-os', 735, 76, 218, 60, pair('VirtIO 后端','VirtIO backend'), pair('本例位于宿主用户态','Host userspace in this example')],
  ['shared', 435, 338, 200, 60, pair('共享队列与缓冲区','Shared queue and buffers'), pair('描述符引用数据缓冲区','Descriptors refer to buffers')],
  ['driver', 735, 338, 218, 60, pair('宿主驱动','Host driver'), pair('通过内核访问真实设备','Kernel access to real devices')],
  ['hypervisor', 434, 484, 199, 60, 'Hypervisor', pair('虚拟 CPU 与内存隔离','Virtual CPUs and isolation')],
  ['firmware', 434, 611, 199, 60, pair('安全监控固件','Secure monitor'), pair('平台启动与安全服务','Platform boot / services')],
  ['hardware', 735, 700, 218, 60, pair('物理设备','Physical device'), pair('设备控制器与 I/O','Device controller and I/O')]
].map(([id,x,y,w,h,title,sub]) => ({id,x,y,w,h,title,sub}));

const edges = [
  ['app-call','data','M256 136 V209',pair('系统调用','System call'),310,180,'guest-app','guest-os'],
  ['os-virtio','data','M256 269 V338',pair('设备请求','Device request'),310,308,'guest-os','virtio'],
  ['virtio-shared','data','M367 352 H435',pair('提交描述符','Post descriptors'),400,327,'virtio','shared'],
  ['shared-backend','data','M635 352 H675 V96 H735',pair('读取队列与缓冲区','Read queue and buffers'),760,174,'shared','host-os'],
  ['backend-driver','data','M844 136 V338',pair('宿主 I/O 请求','Host I/O request'),904,256,'host-os','driver'],
  ['driver-hardware','data','M844 398 V700',pair('设备访问','Device access'),888,521,'driver','hardware'],
  ['vm-create','control','M434 106 H405 V514 H434',pair('经宿主内核创建 VM','Create VM via host kernel'),500,186,'vmm','hypervisor'],
  ['memory','control','M534 484 V398',pair('Stage-2 映射','Stage-2 mapping'),595,447,'hypervisor','shared'],
  ['secure-boot','control','M534 611 V544',pair('平台启动与配置','Platform boot / setup'),608,582,'firmware','hypervisor'],
  ['reply','reply','M735 121 H699 V382 H635',pair('写回完成状态','Write completion'),685,413,'host-os','shared'],
  ['reply-guest','reply','M435 382 H367',pair('取回完成状态','Read completion'),394,420,'shared','virtio']
].map(([id,kind,path,label,lx,ly,from,to]) => ({id,kind,path,label,lx,ly,from,to}));

const explanations = {
  'guest-app': {title:'Guest App', text:pair('运行在 Guest OS 用户态的应用。它发起文件、网络、音频或其他设备请求，看到的是 Guest 提供的系统接口。','An application in the guest OS userspace. It starts file, network, audio or other device requests through guest-visible system interfaces.'), sources:[aospSource]},
  'guest-os': {title:'Guest OS kernel', text:pair('Guest 内核管理自己的进程、地址空间和驱动前端。访问虚拟设备时，它通过 VirtIO 或其他平台接口把请求交给宿主侧后端。','The guest kernel manages its processes, address space and frontend drivers. For virtual devices, it sends requests through VirtIO or another platform interface to the host-side backend.'), sources:[armSource,aospSource]},
  'virtio': {title:'VirtIO frontend', text:pair('Guest 内核中的虚拟设备前端。它遵循虚拟设备协议，将缓冲区的位置和长度写入队列描述符，供宿主后端访问。','The virtual-device frontend in the guest kernel. It follows the virtual-device protocol and publishes descriptors identifying buffers for the host backend to access.'), sources:[virtioSource]},
  'hypervisor': {title:'Hypervisor', text:pair('Hypervisor 位于比 Guest OS 更高的权限边界，负责 vCPU 运行、内存隔离、虚拟中断以及 VM 之间的基础通信机制。','The hypervisor sits at a higher privilege boundary than guest OSes and provides vCPU execution, memory isolation, virtual interrupts and primitives for inter-VM communication.'), sources:[armSource,gunyahSource,qSource]},
  'vmm': {title:'VMM', text:pair('VMM 或 Resource Manager 负责较高层的 VM 生命周期、虚拟设备配置和资源策略。它通过 Hypervisor 接口完成创建与启动，自己不等于 Hypervisor。','A VMM or Resource Manager handles higher-level VM lifecycle, virtual-device setup and resource policy. It creates and launches VMs through hypervisor interfaces and is not itself the hypervisor.'), sources:[aospSource,gunyahSource,qSource]},
  'shared': {title:'Shared queue / shared memory', text:pair('这是 Guest 与宿主后端交换请求、描述符和数据的通道。共享内存表示可访问的内存范围，队列协议决定双方怎样读写和通知。','A channel for exchanging requests, descriptors and data between the guest and host backend. Shared memory defines an accessible region, while the queue protocol defines how both sides read, write and notify.'), sources:[aospSource,qSource]},
  'host-os': {title:'VirtIO backend', text:pair('宿主侧后端把虚拟设备请求翻译为宿主服务、内核驱动或设备访问。它可能运行在宿主用户态或内核态，取决于实现。','The host-side backend translates virtual-device requests into host services, kernel drivers or device access. It may run in host userspace or kernel space depending on the implementation.'), sources:[aospSource,qSource]},
  'driver': {title:'Host driver', text:pair('驱动把宿主软件请求落实为真实设备接口、寄存器、DMA 或中断处理。驱动是软件，设备控制器和 DMA 引擎是硬件。','The driver turns host software requests into physical-device interfaces, register operations, DMA or interrupt handling. The driver is software, while the controller and DMA engine are hardware.'), sources:[qSource]},
  'firmware': {title:'Secure monitor / firmware', text:pair('EL3 的安全监控或固件参与启动信任和安全服务。它与 EL2 Hypervisor 的职责不同，具体启动链要看平台资料。','EL3 secure monitor or firmware participates in boot trust and secure services. Its responsibilities differ from an EL2 hypervisor, and the exact boot chain is platform-specific.'), sources:[armSource,'https://source.android.com/docs/core/virtualization/architecture']},
  'hardware': {title:'Physical device', text:pair('最终执行 CPU、内存和外设访问的物理资源。Hypervisor 或宿主后端负责决定哪些资源以虚拟设备、共享或直通方式提供给 Guest。','The physical CPU, memory and peripherals that ultimately execute access. The hypervisor or host backend decides whether resources are exposed through virtual devices, sharing or passthrough.'), sources:[qSource]},
  'app-call': {title:'系统调用 / 请求', text:pair('Guest App 通过 Guest OS 提供的接口发起请求。这里的箭头表示进入 Guest 内核的控制和数据请求，不表示直接调用 Hypervisor。','The guest app starts a request through the guest OS interface. This arrow represents a control or data request entering the guest kernel, not a direct hypervisor call.'), sources:[armSource]},
  'virtio-shared': {title:'队列与数据', text:pair('VirtIO 前端把描述符发布到共享队列。描述符记录缓冲区地址、长度和读写权限，后端据此访问缓冲区。','The VirtIO frontend publishes descriptors to a shared queue. They identify buffer addresses, lengths and access direction so the backend can access the buffers.'), sources:[virtioSource]},
  'os-virtio': {text:pair('Guest 内核把针对虚拟设备的操作交给对应的 VirtIO 前端驱动，由驱动按设备协议构造请求。','The guest kernel hands virtual device operations to the VirtIO frontend driver, which prepares requests using the device protocol.'), sources:[virtioSource]},
  'shared-backend': {text:pair('宿主后端读取可用描述符，再访问描述符引用的缓冲区。读写方向受描述符标志约束。','The host backend reads available descriptors and accesses their buffers in the direction allowed by the descriptor flags.'), sources:[virtioSource]},
  'backend-driver': {text:pair('本例的宿主用户态后端通过宿主内核的设备接口发起 I/O。后端也可以由内核或其他进程实现。','In this example the host userspace backend issues I/O through a host kernel device interface. A backend can also be implemented in the kernel or in another process.'), sources:[aospSource]},
  'driver-hardware': {text:pair('宿主驱动配置或访问控制器。寄存器操作、DMA 和中断的组合取决于实际设备。','The host driver configures or accesses the controller. Register accesses, DMA and interrupts depend on the actual device.'), sources:[qSource]},
  'secure-boot': {text:pair('安全监控固件与 Hypervisor 处于不同权限级。此线表达平台启动关系，镜像验证与启动细节由平台定义。','Secure monitor firmware and the hypervisor occupy different exception levels. This line represents platform boot; the platform defines image verification and boot details.'), sources:[armSource,aospSource]},
  'reply-guest': {text:pair('Guest 前端从队列读取完成信息，并在协议允许时收到通知，再按设备协议处理结果。','The guest frontend reads completion information from the queue, can receive a notification, and handles the result according to the device protocol.'), sources:[virtioSource]},
  'vm-create': {title:'创建 / 启动 / 资源配置', text:pair('VMM 或 Resource Manager 通过 Hypervisor 接口配置 Guest 的 vCPU、内存和虚拟设备，并启动 VM。','The VMM or Resource Manager configures guest vCPUs, memory and virtual devices through hypervisor interfaces, then launches the VM.'), sources:[aospSource,gunyahSource,qSource]},
  'memory': {title:'Stage-2 映射 / 共享授权', text:pair('Hypervisor 通过 Stage-2 地址转换限制 Guest 能访问的物理页。需要共享时，所有者明确授予另一方访问范围。','The hypervisor uses Stage-2 translation to restrict physical pages accessible to the guest. Sharing requires the owner to explicitly grant an access range.'), sources:[armSource,aospSource]},
  'reply': {title:'完成 / 事件 / 错误', text:pair('后端在队列里标记已处理的缓冲区，并按约定通知 Guest 前端。','The backend marks processed buffers in the queue and notifies the guest frontend according to the transport and negotiated features.'), sources:[virtioSource]}
};

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
let mode = 'both';
let playing = !reducedMotion.matches;
let selected = null;
let selectionType = 'node';
let translate;
const edgeColors = {data:'#25756b', control:'#a16c2c', reply:'#527d99'};

function graph(t) {
  const r = value => escape(read(value,t));
  return `<svg class="atlas-canvas hyper-canvas" viewBox="0 0 980 790" xmlns="http://www.w3.org/2000/svg" aria-labelledby="hyper-title hyper-desc">
    <title id="hyper-title">${t('虚拟机 I/O：权限边界与设备协作','VM I/O: privilege boundaries and device cooperation')}</title>
    <desc id="hyper-desc">${t('依权限级别分行。应用调用 Guest 内核，VirtIO 前端和宿主后端通过共享队列交互，后端经宿主驱动访问设备。EL2 Hypervisor 提供隔离。实线表示请求，虚线表示控制，点线表示返回。','Rows indicate exception levels. The app calls the guest kernel. The VirtIO frontend and host backend use a shared queue, and the backend accesses the device through the host driver. The EL2 hypervisor provides isolation. Solid lines show requests, dashed lines control, dotted lines replies.')}</desc>
    <defs>${Object.entries(edgeColors).map(([kind,color])=>`<marker id="hyper-${kind}" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M1 1 L9 5 L1 9" fill="none" stroke="${color}" stroke-width="1.5"/></marker>`).join('')}</defs>
    <text x="17" y="29" class="map-tier-label">${t('权限级别','EXCEPTION LEVEL')}</text>
    <text x="146" y="29" class="map-zone-label">${t('Guest 侧 · 虚拟机','GUEST · VIRTUAL MACHINE')}</text>
    <text x="434" y="29" class="map-zone-label">${t('虚拟化管理与共享通道','VM MANAGEMENT / SHARED CHANNEL')}</text>
    <text x="735" y="29" class="map-zone-label">${t('宿主与设备侧','HOST / DEVICE SIDE')}</text>
    <rect x="124" y="46" width="846" height="106" rx="12" class="map-band"/>
    <rect x="124" y="193" width="266" height="233" rx="12" class="map-band native-band"/>
    <rect x="722" y="193" width="248" height="233" rx="12" class="map-band native-band"/>
    <rect x="422" y="470" width="225" height="87" rx="12" class="map-band hal-band"/>
    <rect x="422" y="598" width="225" height="85" rx="12" class="map-band kernel-band"/>
    <rect x="722" y="687" width="247" height="85" rx="12" class="map-band hardware-band"/>
    <rect x="421" y="316" width="228" height="94" rx="10" class="map-band queue-band"/>
    ${[[86,'EL0',pair('用户态','USERSPACE')],[234,'EL1',pair('内核态','KERNEL')],[505,'EL2',pair('虚拟化','VIRTUALIZATION')],[630,'EL3',pair('安全固件','SECURE MONITOR')]].map(([y,n,label])=>`<text x="17" y="${y}" class="map-tier-number">${n}</text><text x="17" y="${y+23}" class="map-tier-label">${r(label)}</text>`).join('')}
    <text x="907" y="677" text-anchor="middle" class="map-zone-label">${t('物理硬件','PHYSICAL HARDWARE')}</text>
    ${edges.map(e=>{
      const related = selectionType==='edge' ? selected===e.id : e.from===selected||e.to===selected;
      return `<g role="button" tabindex="0" aria-haspopup="dialog" aria-expanded="false" aria-label="${r(e.label)}" aria-pressed="${selectionType==='edge'&&selected===e.id}" data-hyper-edge="${e.id}" class="map-edge ${e.kind} ${related?'selected':''}"><path d="${e.path}" class="edge-hit"/><path d="${e.path}" class="edge-line" marker-end="url(#hyper-${e.kind})"/><text x="${e.lx}" y="${e.ly}" class="edge-label" text-anchor="middle">${r(e.label)}</text>${playing&&e.kind==='data'&&mode!=='control'?`<circle r="3.4" class="map-particle"><animateMotion dur="3.5s" repeatCount="indefinite" path="${e.path}"/></circle>`:''}</g>`;
    }).join('')}
    ${nodes.map(n=>`<g role="button" tabindex="0" aria-haspopup="dialog" aria-expanded="false" aria-label="${r(n.title)} — ${r(n.sub)}" aria-pressed="${selectionType==='node'&&selected===n.id}" data-hyper-node="${n.id}" class="map-node ${selectionType==='node'&&selected===n.id?'selected':''}"><rect x="${n.x}" y="${n.y}" width="${n.w}" height="${n.h}" rx="9"/><text x="${n.x+n.w/2}" y="${n.y+25}" class="map-node-title" text-anchor="middle">${r(n.title)}</text><text x="${n.x+n.w/2}" y="${n.y+45}" class="map-node-sub" text-anchor="middle">${r(n.sub)}</text></g>`).join('')}
    </svg>`;
}

function detail(t) {
  const item = selectionType==='node' ? nodes.find(n=>n.id===selected) : edges.find(e=>e.id===selected);
  const explanation = explanations[item.id];
  return {label:t(selectionType==='node'?'组件解释':'连线解释',selectionType==='node'?'COMPONENT':'CONNECTION'),title:read(item.title??item.label,t),text:read(explanation.text,t),sources:explanation.sources.map(url=>({url,title:sourceTitle(url,url===virtioSource?'Virtual I/O Device (VIRTIO) Version 1.2':'')}))};
}

const playLabel = t => playing ? t('暂停动画','Pause animation') : t('继续动画','Resume animation');
const motionNote = t => reducedMotion.matches ? t('已遵循减少动态效果设置：静态阅读','Reduced-motion preference: static reading') : t('光点示意请求的方向。控制、返回与启动关系保持静态。','Dots show request direction. Control, reply and boot paths stay static.');

export function renderHypervisorReading(t) {
  translate = t;
  return `<div class="architecture-lab hypervisor-lab" id="hypervisor-flow" data-view="${mode}">
    <header class="architecture-intro"><h2>${t('虚拟机 I/O：从 Guest 到物理设备','VM I/O: from guest to physical device')}</h2><p>${t('ARM64 · VirtIO 示例。纵向读权限级别，横向看 Guest、共享通道与宿主怎样协作。','ARM64 · VirtIO example. Read exception levels vertically, and guest, shared channel and host cooperation horizontally.')}</p></header>
    <div class="map-toolbar">
      <div class="lab-options" role="group" aria-label="${t('流向视图','Flow view')}">${[['both','完整关系','All relationships'],['data','追踪数据','Trace data'],['control','追踪控制与返回','Trace control and replies']].map(([v,zh,en])=>`<button data-hyper-view="${v}" aria-pressed="${mode===v}">${t(zh,en)}</button>`).join('')}</div>
      <div class="map-actions" role="group" aria-label="${t('图操作','Diagram controls')}"><button data-hyper-action="play" aria-pressed="${playing}" ${reducedMotion.matches?'disabled':''}>${playLabel(t)}</button><button class="subtle-button" data-hyper-expand aria-expanded="false">${t('放大图 ↗','Expand diagram ↗')}</button></div>
    </div>
    <p class="motion-note">${motionNote(t)}</p>
    <p class="motion-note hyper-scroll-note">${t('横向滑动可查看宿主与物理设备，也可打开全屏。','Scroll sideways to see the host and device, or open the full-screen view.')}</p>
    <div class="map-legend"><span class="data">━▶ ${t('数据 / 设备请求','Data / device request')}</span><span class="control">┄▶ ${t('控制 / 配置','Control / setup')}</span><span class="reply">···▶ ${t('返回 / 事件','Reply / event')}</span></div>
    <div class="architecture-viewport hyper-viewport" tabindex="0" role="region" aria-label="${t('虚拟机 I/O 图，可滚动查看','VM I/O diagram, scroll to explore')}">${graph(t)}</div>
    <p class="map-scope">${t('本图采用宿主用户态 VirtIO 后端示例。共享队列与缓冲区是通信通道，横跨 Guest 和宿主。具体设备的直通、内核后端和启动方式取决于平台。','This example uses a host userspace VirtIO backend. The shared queue and buffers form a communication channel between guest and host. Passthrough, kernel backends and boot details depend on the platform.')}</p>
  </div>`;
}

function draw(root) {
  closeDiagramPopover();
  const viewport = root.querySelector('.hyper-viewport');
  const {scrollLeft,scrollTop} = viewport;
  viewport.innerHTML = graph(translate);
  viewport.scrollLeft = scrollLeft;
  viewport.scrollTop = scrollTop;
  root.dataset.view = mode;
  for (const button of root.querySelectorAll('[data-hyper-view]')) {
    button.setAttribute('aria-pressed', String(button.dataset.hyperView===mode));
  }
  const play = root.querySelector('[data-hyper-action]');
  play.textContent = playLabel(translate);
  play.setAttribute('aria-pressed', String(playing));
  play.disabled = reducedMotion.matches;
  root.querySelector('.motion-note').textContent = motionNote(translate);
}

function setExpanded(root, expanded) {
  closeDiagramPopover();
  let dialog = root.closest('.diagram-fullscreen');
  const button = root.querySelector('[data-hyper-expand]');
  if (expanded) {
    dialog = document.createElement('dialog');
    dialog.className = 'diagram-fullscreen hypervisor-fullscreen';
    dialog.setAttribute('aria-label', translate('虚拟化与隔离图 · 全屏','Virtualization and isolation · Full screen'));
    root.before(dialog);
    dialog.append(root);
    root.classList.add('expanded');
    dialog.addEventListener('cancel', event => {
      event.preventDefault();
      if (!dialog.querySelector('.term-popover:not([hidden]),.diagram-popover:not([hidden])')) setExpanded(root, false);
    });
    dialog.showModal();
  } else {
    const termPanel = dialog.querySelector('#term-popover');
    if (termPanel) document.body.append(termPanel);
    dialog.close();
    dialog.before(root);
    dialog.remove();
    root.classList.remove('expanded');
  }
  button.setAttribute('aria-expanded', String(expanded));
  button.textContent = expanded ? translate('退出全屏 ↙','Exit full screen ↙') : translate('放大图 ↗','Expand diagram ↗');
  button.focus({preventScroll:true});
}

export function handleHypervisorReading(target, annotate, t) {
  const root = target.closest('#hypervisor-flow');
  if (!root) return false;
  const {hyperNode,hyperEdge,hyperView,hyperAction} = target.dataset;
  if (hyperNode || hyperEdge) {
    if (isDiagramPopoverAnchor(target)) { closeDiagramPopover({restoreFocus:true}); return true; }
    selected = hyperNode || hyperEdge;
    selectionType = hyperNode ? 'node' : 'edge';
    draw(root);
    const anchor = root.querySelector(`[data-hyper-${selectionType}="${selected}"]`);
    showDiagramPopover(anchor, detail(t), annotate, t);
  } else if (hyperView) {
    mode = hyperView;
    selected = null;
    draw(root);
  } else if (hyperAction === 'play') {
    playing = !playing && !reducedMotion.matches;
    draw(root);
  } else if (target.hasAttribute('data-hyper-expand')) {
    setExpanded(root, !root.classList.contains('expanded'));
  } else {
    return false;
  }
  return true;
}

document.addEventListener('keydown', event => {
  const target = event.target.closest?.('[data-hyper-node],[data-hyper-edge]');
  if (target && ['Enter',' '].includes(event.key)) {
    event.preventDefault();
    target.dispatchEvent(new MouseEvent('click',{bubbles:true}));
  }
});

document.addEventListener('visibilitychange', () => {
  const svg = document.querySelector('.hyper-canvas');
  if (document.hidden) svg?.pauseAnimations();
  else svg?.unpauseAnimations();
});
reducedMotion.addEventListener('change', () => {
  if (reducedMotion.matches) playing = false;
  const root = document.querySelector('#hypervisor-flow');
  if (root) draw(root);
});

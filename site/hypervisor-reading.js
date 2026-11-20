import { showDiagramPopover, closeDiagramPopover, isDiagramPopoverAnchor } from './diagram-popover.js?v=cb7fe399353a';
import { sourceTitle } from './source-links.js?v=12527b297d95';

const escape = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const pair = (zh, en) => ({zh, en});
const read = (value, t) => typeof value === 'string' ? value : t(value.zh, value.en);
const armSource = 'https://developer.arm.com/-/media/Arm%20Developer%20Community/PDF/Learn%20the%20Architecture/Armv8-A%20virtualization.pdf';
const aospSource = 'https://source.android.com/docs/core/virtualization/architecture';
const qSource = 'https://docs.qualcomm.com/bundle/publicresource/topics/80-70022-3/virtualization.html';
const gunyahSource = 'https://github.com/quic/gunyah-hypervisor';

const nodes = [
  ['guest-app', 210, 92, 210, 70, pair('Guest App','Guest app'), pair('EL0 · 用户态','EL0 · userspace'), 'guest'],
  ['host-app', 900, 92, 210, 70, pair('Host service','Host service'), pair('EL0 · 用户态','EL0 · userspace'), 'host'],
  ['guest-os', 210, 235, 210, 78, pair('Guest OS kernel','Guest OS kernel'), pair('EL1 · Guest 内核','EL1 · guest kernel'), 'guest'],
  ['host-os', 900, 235, 210, 78, pair('Host OS / backend','Host OS / backend'), pair('EL1 · 宿主后端','EL1 · host backend'), 'host'],
  ['virtio', 210, 385, 210, 78, 'VirtIO front-end', pair('虚拟设备前端','Virtual-device frontend'), 'data'],
  ['hypervisor', 520, 385, 240, 92, pair('Hypervisor','Hypervisor'), pair('EL2 · 隔离与调度','EL2 · isolation / scheduling'), 'hypervisor'],
  ['vmm', 900, 385, 210, 78, pair('VMM / Resource Manager','VMM / Resource Manager'), pair('EL1 · 策略与生命周期','EL1 · policy / lifecycle'), 'host'],
  ['shared', 485, 565, 310, 72, pair('共享队列 / 共享内存','Shared queue / shared memory'), pair('请求、描述符与数据','Requests, descriptors and data'), 'data'],
  ['driver', 900, 565, 210, 78, pair('Host driver','Host driver'), pair('真实设备接口','Physical-device interface'), 'host'],
  ['firmware', 520, 705, 240, 70, pair('Secure monitor / firmware','Secure monitor / firmware'), pair('EL3 · 启动与安全服务','EL3 · boot / secure services'), 'secure'],
  ['hardware', 900, 705, 210, 70, pair('Physical device','Physical device'), pair('CPU · memory · I/O','CPU · memory · I/O'), 'hardware']
].map(([id,x,y,w,h,title,sub,kind]) => ({id,x,y,w,h,title,sub,kind}));

const edges = [
  ['app-call','data','M315 162 V235',pair('系统调用 / 请求','System call / request'),355,198,'guest-app','guest-os'],
  ['os-virtio','data','M315 313 V385',pair('virtqueue 描述符','Virtqueue descriptors'),355,355,'guest-os','virtio'],
  ['virtio-shared','data','M420 424 H485 V601',pair('队列与数据','Queue and data'),450,505,'virtio','shared'],
  ['shared-backend','data','M795 601 H900 V424',pair('后端读取 / 写回','Backend read / write-back'),850,550,'shared','host-os'],
  ['backend-driver','data','M1005 313 V565',pair('设备请求','Device request'),1045,450,'host-os','driver'],
  ['driver-hardware','data','M1005 643 V705',pair('寄存器 / DMA / 中断','Registers / DMA / interrupts'),1050,680,'driver','hardware'],
  ['vm-create','control','M1005 385 H760',pair('创建 / 启动 / 资源配置','Create / launch / resource setup'),880,370,'vmm','hypervisor'],
  ['trap','control','M760 431 H900 V235',pair('陷入 / 虚拟中断','Traps / virtual interrupts'),830,460,'hypervisor','host-os'],
  ['memory','control','M640 477 V565',pair('Stage-2 映射 / 共享授权','Stage-2 mapping / share grant'),690,535,'hypervisor','shared'],
  ['secure-boot','control','M640 705 V477',pair('启动验证 / 安全配置','Boot verification / secure setup'),690,625,'firmware','hypervisor'],
  ['reply','reply','M900 605 H820 V642 H420 V463',pair('完成 / 事件 / 错误','Completion / event / error'),610,625,'driver','virtio']
].map(([id,kind,path,label,lx,ly,from,to]) => ({id,kind,path,label,lx,ly,from,to}));

const explanations = {
  'guest-app': {title:'Guest App', text:pair('运行在 Guest OS 用户态的应用。它发起文件、网络、音频或其他设备请求，看到的是 Guest 提供的系统接口。','An application in the guest OS userspace. It starts file, network, audio or other device requests through guest-visible system interfaces.'), sources:[aospSource]},
  'guest-os': {title:'Guest OS kernel', text:pair('Guest 内核管理自己的进程、地址空间和驱动前端。访问虚拟设备时，它通过 VirtIO 或其他平台接口把请求交给宿主侧后端。','The guest kernel manages its processes, address space and frontend drivers. For virtual devices, it sends requests through VirtIO or another platform interface to the host-side backend.'), sources:[armSource,aospSource]},
  'virtio': {title:'VirtIO front-end', text:pair('Guest 内核中的虚拟设备前端。它遵循虚拟设备协议，把请求、描述符和数据放入队列，等待宿主后端处理。','The virtual-device frontend in the guest kernel. It follows the virtual-device protocol and places requests, descriptors and data in queues for the host backend.'), sources:['https://source.android.com/docs/automotive/sdv/workstreams/core/requirements']},
  'hypervisor': {title:'Hypervisor', text:pair('Hypervisor 位于比 Guest OS 更高的权限边界，负责 vCPU 运行、内存隔离、虚拟中断以及 VM 之间的基础通信机制。','The hypervisor sits at a higher privilege boundary than guest OSes and provides vCPU execution, memory isolation, virtual interrupts and primitives for inter-VM communication.'), sources:[armSource,gunyahSource,qSource]},
  'vmm': {title:'VMM / Resource Manager', text:pair('VMM 或 Resource Manager 负责较高层的 VM 生命周期、虚拟设备配置和资源策略。它通过 Hypervisor 接口完成创建与启动，自己不等于 Hypervisor。','A VMM or Resource Manager handles higher-level VM lifecycle, virtual-device setup and resource policy. It creates and launches VMs through hypervisor interfaces and is not itself the hypervisor.'), sources:[aospSource,gunyahSource,qSource]},
  'shared': {title:'Shared queue / shared memory', text:pair('这是 Guest 与宿主后端交换请求、描述符和数据的通道。共享内存表示可访问的内存范围，队列协议决定双方怎样读写和通知。','A channel for exchanging requests, descriptors and data between the guest and host backend. Shared memory defines an accessible region, while the queue protocol defines how both sides read, write and notify.'), sources:[aospSource,qSource]},
  'host-os': {title:'Host OS / backend', text:pair('宿主侧后端把虚拟设备请求翻译为宿主服务、内核驱动或设备访问。它可能运行在宿主用户态或内核态，取决于实现。','The host-side backend translates virtual-device requests into host services, kernel drivers or device access. It may run in host userspace or kernel space depending on the implementation.'), sources:[aospSource,qSource]},
  'driver': {title:'Host driver', text:pair('驱动把宿主软件请求落实为真实设备接口、寄存器、DMA 或中断处理。驱动是软件，设备控制器和 DMA 引擎是硬件。','The driver turns host software requests into physical-device interfaces, register operations, DMA or interrupt handling. The driver is software, while the controller and DMA engine are hardware.'), sources:[qSource]},
  'firmware': {title:'Secure monitor / firmware', text:pair('EL3 的安全监控或固件参与启动信任和安全服务。它与 EL2 Hypervisor 的职责不同，具体启动链要看平台资料。','EL3 secure monitor or firmware participates in boot trust and secure services. Its responsibilities differ from an EL2 hypervisor, and the exact boot chain is platform-specific.'), sources:[armSource,'https://source.android.com/docs/core/virtualization/architecture']},
  'hardware': {title:'Physical device', text:pair('最终执行 CPU、内存和外设访问的物理资源。Hypervisor 或宿主后端负责决定哪些资源以虚拟设备、共享或直通方式提供给 Guest。','The physical CPU, memory and peripherals that ultimately execute access. The hypervisor or host backend decides whether resources are exposed through virtual devices, sharing or passthrough.'), sources:[qSource]},
  'app-call': {title:'系统调用 / 请求', text:pair('Guest App 通过 Guest OS 提供的接口发起请求。这里的箭头表示进入 Guest 内核的控制和数据请求，不表示直接调用 Hypervisor。','The guest app starts a request through the guest OS interface. This arrow represents a control or data request entering the guest kernel, not a direct hypervisor call.'), sources:[armSource]},
  'virtio-shared': {title:'队列与数据', text:pair('VirtIO 前端把描述符和数据放入双方约定的队列或共享内存。数据是否复制、映射或直通由具体设备和实现决定。','The VirtIO frontend places descriptors and data into a shared queue or memory region. Whether data is copied, mapped or passed through depends on the device and implementation.'), sources:[aospSource]},
  'vm-create': {title:'创建 / 启动 / 资源配置', text:pair('VMM 或 Resource Manager 通过 Hypervisor 接口配置 Guest 的 vCPU、内存和虚拟设备，并启动 VM。','The VMM or Resource Manager configures guest vCPUs, memory and virtual devices through hypervisor interfaces, then launches the VM.'), sources:[aospSource,gunyahSource,qSource]},
  'memory': {title:'Stage-2 映射 / 共享授权', text:pair('Hypervisor 通过 Stage-2 地址转换限制 Guest 能访问的物理页。需要共享时，所有者明确授予另一方访问范围。','The hypervisor uses Stage-2 translation to restrict physical pages accessible to the guest. Sharing requires the owner to explicitly grant an access range.'), sources:[armSource,aospSource]},
  'reply': {title:'完成 / 事件 / 错误', text:pair('后端通过队列、虚拟中断或其他通信机制返回完成、事件或错误。返回表示软件路径收到反馈，不等于物理设备已经完成可见呈现。','The backend returns completion, events or errors through queues, virtual interrupts or other communication. A reply means the software path received feedback, not that the physical device has finished visible presentation.'), sources:[aospSource,qSource]}
};

let mode = 'both';
let playing = !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
let selected = 'hypervisor';
let selectionType = 'node';
let translate;
let afterDraw;

function marker(kind) { return `<marker id="hyper-${kind}" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M1 1 L9 5 L1 9" class="hyper-arrow ${kind}"/></marker>`; }
function graph(t) {
  const chosen = selectionType === 'edge' ? selected : null;
  const visible = edge => mode === 'both' || (mode === 'data' && edge.kind === 'data') || (mode === 'control' && edge.kind !== 'data');
  const node = n => `<g role="button" tabindex="0" aria-haspopup="dialog" aria-expanded="false" aria-pressed="${selectionType==='node'&&selected===n.id}" data-hyper-node="${n.id}" class="hyper-node ${n.kind} ${selectionType==='node'&&selected===n.id?'selected':''}"><rect x="${n.x}" y="${n.y}" width="${n.w}" height="${n.h}" rx="10"/><text x="${n.x+n.w/2}" y="${n.y+30}" text-anchor="middle" class="hyper-node-title">${escape(read(n.title,t))}</text><text x="${n.x+n.w/2}" y="${n.y+55}" text-anchor="middle" class="hyper-node-sub">${escape(read(n.sub,t))}</text></g>`;
  const edge = e => { if(!visible(e)) return ''; const related = chosen ? chosen === e.id : selectionType === 'node' && (e.from === selected || e.to === selected); return `<g role="button" tabindex="0" aria-haspopup="dialog" aria-expanded="false" data-hyper-edge="${e.id}" class="hyper-edge ${e.kind} ${related?'selected':''}"><path d="${e.path}" class="hyper-edge-hit"/><path d="${e.path}" class="hyper-edge-line" marker-end="url(#hyper-${e.kind})"/><text x="${e.lx}" y="${e.ly}" class="hyper-edge-label" text-anchor="middle">${escape(read(e.label,t))}</text></g>`; };
  const motionPaths = edges.filter(e=>visible(e)&&playing&&e.kind==='data').map(e=>`<circle r="4" class="hyper-particle"><animateMotion dur="4.2s" repeatCount="indefinite" path="${e.path}"/></circle>`).join('');
  return `<svg class="hyper-canvas" viewBox="0 0 1180 840" xmlns="http://www.w3.org/2000/svg" role="img" aria-labelledby="hyper-title hyper-desc"><title id="hyper-title">${t('虚拟机 I/O：权限边界与设备协作','VM I/O: privilege boundaries and device cooperation')}</title><desc id="hyper-desc">${t('纵向排列 EL0 到 EL3，横向连接 Guest、Hypervisor、宿主后端和物理设备。绿色表示数据，琥珀色表示控制，蓝色表示返回。','EL0 through EL3 are arranged vertically, while Guest, hypervisor, host backend and physical device cooperate horizontally. Green is data, amber is control, blue is reply.')}</desc><defs>${['data','control','reply'].map(marker).join('')}<filter id="hyper-soft"><feGaussianBlur stdDeviation="4"/></filter></defs>
  <rect x="18" y="42" width="142" height="732" rx="14" class="hyper-boundary"/><text x="89" y="76" text-anchor="middle" class="hyper-side-title">${t('权限边界','PRIVILEGE')}</text>
  ${[['EL0',118],['EL1',270],['EL2',426],['EL3',740]].map(([label,y])=>`<text x="89" y="${y}" text-anchor="middle" class="hyper-level">${label}</text>`).join('')}
  <path d="M30 174H148M30 335H148M30 500H148M30 770H1148" class="hyper-level-line"/>
  <text x="190" y="30" class="hyper-column">${t('Guest 侧','GUEST SIDE')}</text><text x="520" y="30" class="hyper-column">${t('隔离与虚拟化','ISOLATION')}</text><text x="895" y="30" class="hyper-column">${t('宿主与设备侧','HOST / DEVICE SIDE')}</text>
  <rect x="180" y="55" width="310" height="425" rx="14" class="hyper-zone guest-zone"/><rect x="860" y="55" width="290" height="590" rx="14" class="hyper-zone host-zone"/><rect x="500" y="345" width="280" height="145" rx="14" class="hyper-zone hypervisor-zone"/>
  <text x="205" y="82" class="hyper-zone-label">${t('一个 Guest 的视角','ONE GUEST VIEW')}</text><text x="885" y="82" class="hyper-zone-label">${t('后端与真实设备','BACKEND / PHYSICAL DEVICE')}</text>
  ${edges.map(edge).join('')}${motionPaths}${nodes.map(node).join('')}
  </svg>`;
}

function detail(t) {
  const item = explanations[selected];
  return {label:t(selectionType==='node'?'组件解释':'连接解释',selectionType==='node'?'COMPONENT':'CONNECTION'),title:item.title,text:read(item.text,t),sources:item.sources.map(url=>({url,title:sourceTitle(url)}))};
}

export function renderHypervisorReading(t) {
  translate = t;
  const tr = (zh,en) => t(zh,en);
  return `<section class="hypervisor-lab" id="hypervisor-flow"><header class="hypervisor-intro"><span class="reading-kicker">ARM64 · VM · ANDROID · QUALCOMM</span><h2>${tr('虚拟机 I/O：纵向看权限边界，横向看设备协作','VM I/O: privilege boundaries vertically, device cooperation horizontally')}</h2><p>${tr('先把 EL0–EL3 和 Guest/Host 分开，再跟随一次虚拟设备请求，看清 Hypervisor、共享通道、VMM 和真实驱动各自负责什么。','Separate EL0–EL3 from Guest/Host first, then follow one virtual-device request to see the roles of the hypervisor, shared channel, VMM and physical driver.')}</p></header><div class="hyper-toolbar"><div class="lab-options" role="group" aria-label="${tr('流向视图','Flow view')}">${[['both','完整关系','All relationships'],['data','追踪数据','Trace data'],['control','追踪控制与返回','Trace control and replies']].map(([v,zh,en])=>`<button data-hyper-view="${v}" aria-pressed="${mode===v}">${tr(zh,en)}</button>`).join('')}</div><div class="map-actions"><button data-hyper-action="play" aria-pressed="${playing}">${playing?tr('暂停动画','Pause animation'):tr('继续动画','Resume animation')}</button><button data-hyper-expand="true">${tr('放大图','Expand diagram')} ↗</button></div></div><p class="hyper-motion-note">${tr('绿色光点只表示数据方向；控制、返回和安全启动关系保持静态，不表示严格时序。','Green motion only shows data direction. Control, reply and secure-boot relationships stay static and do not imply strict timing.')}</p><div class="hyper-legend"><span class="data">━▶ ${tr('数据 / 设备请求','Data / device request')}</span><span class="control">┄▶ ${tr('控制 / 配置','Control / setup')}</span><span class="reply">···▶ ${tr('返回 / 事件','Reply / event')}</span></div><div class="hyper-viewport" tabindex="0" role="region" aria-label="${tr('Hypervisor 关系图，小屏可横向和纵向滚动','Hypervisor relationship diagram; scroll horizontally and vertically on small screens')}">${graph(t)}</div><p class="hyper-scope">${tr('这是一张通用教学图。它展示 Guest 通过虚拟设备访问宿主资源的关系，不把所有平台都约束成同一条数据路径。直通设备、共享内存、VirtIO、VMM 与 Resource Manager 的具体组合必须按产品资料确认。','This is a general teaching diagram. It shows a guest reaching host resources through a virtual device without forcing every platform into one data path. The exact combination of passthrough, shared memory, VirtIO, VMM and Resource Manager must be checked against product documentation.')}</p></section>`;
}

function draw(focus) {
  const root = document.querySelector('#hypervisor-flow');
  if (!root) return;
  closeDiagramPopover();
  const viewport = root.querySelector('.hyper-viewport');
  const left = viewport?.scrollLeft || 0;
  const top = viewport?.scrollTop || 0;
  root.querySelector('.hyper-canvas')?.remove();
  viewport.insertAdjacentHTML('afterbegin', graph(translate));
  viewport.scrollLeft = left;
  viewport.scrollTop = top;
  afterDraw?.(root);
  if (focus) root.querySelector(focus)?.focus({preventScroll:true});
}

function setExpanded(expanded) {
  const root = document.querySelector('#hypervisor-flow');
  if (!root) return;
  const current = root.closest('.diagram-fullscreen');
  if (expanded && !current) {
    const dialog = document.createElement('dialog');
    dialog.className = 'diagram-fullscreen hypervisor-fullscreen';
    dialog.setAttribute('aria-label', translate('虚拟化与隔离图 · 全屏','Virtualization and isolation · Full screen'));
    root.before(dialog); dialog.append(root); dialog.showModal();
    dialog.addEventListener('cancel', event => { event.preventDefault(); setExpanded(false); });
  } else if (!expanded && current) {
    current.close(); current.before(root); current.remove();
  }
  root.querySelector('[data-hyper-expand]').textContent = expanded ? translate('退出全屏 ↙','Exit full screen ↙') : translate('放大图','Expand diagram') + ' ↗';
}

export function handleHypervisorReading(target, annotate, t) {
  const isNode = target.dataset.hyperNode;
  const isEdge = target.dataset.hyperEdge;
  if (isNode || isEdge) {
    if (isDiagramPopoverAnchor(target)) { closeDiagramPopover({restoreFocus:true}); return true; }
    selected = isNode || isEdge;
    selectionType = isNode ? 'node' : 'edge';
    afterDraw = annotate;
    draw(isNode ? `[data-hyper-node="${selected}"]` : `[data-hyper-edge="${selected}"]`);
    showDiagramPopover(document.querySelector(isNode ? `[data-hyper-node="${selected}"]` : `[data-hyper-edge="${selected}"]`), detail(t), annotate, t);
    return true;
  }
  if (target.dataset.hyperView) { mode = target.dataset.hyperView; afterDraw = annotate; draw(`[data-hyper-view="${mode}"]`); return true; }
  if (target.dataset.hyperAction === 'play') { playing = !playing; afterDraw = annotate; draw('[data-hyper-action="play"]'); return true; }
  if (target.dataset.hyperExpand) { setExpanded(!document.querySelector('#hypervisor-flow')?.closest('.diagram-fullscreen')); return true; }
  return false;
}

document.addEventListener('keydown', event => {
  const target = event.target.closest?.('[data-hyper-node],[data-hyper-edge],[data-hyper-expand],[data-hyper-action]');
  if (target && ['Enter',' '].includes(event.key)) { event.preventDefault(); target.dispatchEvent(new MouseEvent('click',{bubbles:true})); }
  if (event.key === 'Escape' && document.querySelector('.hypervisor-fullscreen') && !document.querySelector('.diagram-popover:not([hidden]),.term-popover:not([hidden])')) setExpanded(false);
});

window.matchMedia('(prefers-reduced-motion: reduce)').addEventListener?.('change', event => { playing = !event.matches; if(document.querySelector('#hypervisor-flow')) draw(); });

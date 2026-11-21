import { showDiagramPopover, closeDiagramPopover, isDiagramPopoverAnchor } from './diagram-popover.js?v=6e59a476be74';

const arm = ['Armv8-A virtualization', 'https://developer.arm.com/-/media/Arm%20Developer%20Community/PDF/Learn%20the%20Architecture/Armv8-A%20virtualization.pdf'];
const dolby = ['Integrating Dolby Technologies into automotive platforms · Figure 9', 'https://www.qualcomm.com/content/dam/qcomm-martech/dm-assets/documents/dolby-qualcomm-white-paper.pdf#page=16'];
const sdv = ['Software defined vehicle', 'https://source.android.com/docs/automotive/sdv'];
const sdvArchitecture = ['AAOS SDV system architecture', 'https://source.android.com/docs/automotive/sdv/sdv-system-architecture'];

const nodes = {
  native: ['单一操作系统','Single operating system','Android 或 Linux','Android or Linux','在直跑方案中，一个操作系统通过自己的内核和驱动使用板上的设备。图中省略启动固件。','In the native configuration, one operating system uses onboard devices through its kernel and drivers. Boot firmware is omitted.',arm],
  'guest-one': ['Guest A','Guest A','操作系统与应用','OS and applications','这是一个虚拟机里的操作系统及其应用。它使用分配给这台虚拟机的 CPU、内存与设备资源。','This operating system and its apps run inside a virtual machine with assigned CPU, memory, and device resources.',arm],
  'guest-two': ['Guest B','Guest B','操作系统与应用','OS and applications','另一台虚拟机可以运行相同或不同的操作系统。资源和通信接口由平台配置。','A second virtual machine can run the same or a different OS. The platform configures resources and communication interfaces.',arm],
  hypervisor: ['Hypervisor','Hypervisor','分配资源与隔离','Resource isolation','这里选用直接运行在硬件上的 Type-1 模型。Hypervisor 让多台虚拟机共享处理器，同时为它们隔离内存等资源。','This view shows the Type-1 model running on hardware. The hypervisor lets multiple VMs share processors and isolates resources such as memory.',arm],
  'native-soc': ['SoC 与外设','SoC and peripherals','板级硬件','Board hardware','操作系统通过针对板级硬件的驱动访问设备。','The OS accesses devices using drivers for the board hardware.',arm],
  'virtual-soc': ['SoC 与外设','SoC and peripherals','共享的物理资源','Shared physical resources','多台虚拟机可以共享一颗 SoC。虚拟设备、共享资源或直通的具体配置由平台决定。','Several VMs can share one SoC. The platform chooses how to expose virtual, shared, or assigned devices.',arm],
  'audio-hal': ['Android Audio HAL','Android Audio HAL','对接 Android 音频框架','Connects the audio framework','白皮书的 AAOS Guest 通过 Audio HAL 对接 Android 音频框架，再通过 Guest 内核中的 VirtIO-Snd 接入车载音频方案。','The white paper’s AAOS guest connects the Android audio framework through Audio HAL and uses VirtIO-Snd in the guest kernel.',dolby],
  'audio-front': ['VirtIO-Snd 前端','VirtIO-Snd front end','Guest 内核','Guest kernel','图 9 的 AAOS Guest 通过 VirtIO-Snd 向 PVM 后端发控制请求。播放样本经共享内存交给 DSP 侧处理。','In Figure 9, VirtIO-Snd sends control requests from the AAOS guest to the PVM backend. Shared memory carries playback samples to DSP processing.',dolby],
  'audio-back': ['高通音频服务','Qualcomm Audio Service','包含 VirtIO-Snd 后端','Includes VirtIO-Snd backend','白皮书示例中，PVM 的主操作系统运行高通音频服务，负责初始化和音频流管理，并与 DSP 或 CPU 上的音频处理实例协作。','In this example the PVM runs Qualcomm Audio Service. It manages initialization and audio streams and works with audio-processing instances on DSPs or CPUs.',dolby],
  dsp: ['DSP 音频处理','DSP audio processing','读取样本并处理','Processes audio samples','图 9 分开绘制控制与样本路径。此处 DSP 读取共享内存中的样本并处理，再将输出送往车内音响。','Figure 9 separates control and sample paths. The DSP reads and processes shared-memory samples and sends the output to the cabin audio system.',dolby],
  output: ['车载功放与扬声器','Amplifier and speakers','车内声音输出','Cabin audio output','在白皮书图 9 中，处理过的音频经 TDM 接口到车载功放，再由扬声器发声。','In Figure 9, processed audio travels over TDM to the amplifier and then to the speakers.',dolby],
  core: ['SDV Core','SDV Core','车身与系统服务','Vehicle and system services','Core 提供不带图形界面的基础系统，可承载通信、服务管理、诊断集成与更新等车载服务。','Core is a headless foundation for services such as communication, service management, diagnostics integration, and updates.',sdv],
  media: ['SDV Media','SDV Media','座舱图形与媒体','Cockpit graphics and media','Media 以 Core 为基础，增加座舱图形和媒体能力。公开资料也将 Display Safety 放在这一执行配置中。','Media builds on Core and adds cockpit graphics and media capabilities. The published profile also includes Display Safety.',sdv],
  ivi: ['SDV IVI','SDV IVI','车载信息娱乐','In-vehicle infotainment','IVI 承载 AAOS 信息娱乐。AOSP 公开架构描述了它与其他 SDV 服务的集成。','IVI runs AAOS infotainment. AOSP describes its integration with other SDV services.',sdv],
  comms: ['跨虚拟机通信','Inter-VM communication','例如 vsock 或 Ethernet','Such as vsock or Ethernet','不同虚拟机中的服务可以按接口通信。AOSP 给出的传输方式包括 VirtIO sockets 和 Ethernet，具体由部署决定。','Services in separate VMs can communicate through defined interfaces. AOSP lists transports such as VirtIO sockets and Ethernet, depending on the deployment.',sdvArchitecture],
  'sdv-platform': ['支持 VirtIO 的虚拟化环境','VirtIO-capable virtual platform','为 Guest 提供虚拟设备','Provides virtual devices to guests','AOSP 描述的虚拟化环境为各个 Guest 提供 VirtIO 设备。车厂和平台集成方可以选择符合接口要求的实现。','The virtual environment described by AOSP exposes VirtIO devices to guests. Integrators choose compatible implementations.',sdvArchitecture]
};

export function handleScenarioHelp(target, annotate, t) {
  const item = nodes[target.dataset.scenarioHelp];
  if (!item) return false;
  if (isDiagramPopoverAnchor(target)) {
    closeDiagramPopover({restoreFocus:true});
    return true;
  }
  const [zh,en,,,textZh,textEn,[title,url]] = item;
  showDiagramPopover(target,{label:t('组件解释','COMPONENT'),title:t(zh,en),text:t(textZh,textEn),sources:[{title,url}]},annotate,t);
  return true;
}

export function renderHypervisorScenarios(t) {
  const node = (id,x,y,w,h=54,kind='') => {
    const [zh,en,subZh,subEn] = nodes[id];
    return `<g role="button" tabindex="0" aria-haspopup="dialog" aria-expanded="false" aria-label="${t(zh,en)} · ${t(subZh,subEn)}" data-scenario-help="${id}" class="map-node ${kind}"><rect x="${x}" y="${y}" width="${w}" height="${h}" rx="8"/><text class="map-node-title" x="${x+w/2}" y="${y+h/2-5}" text-anchor="middle">${t(zh,en)}</text><text class="map-node-sub" x="${x+w/2}" y="${y+h/2+14}" text-anchor="middle">${t(subZh,subEn)}</text></g>`;
  };
  const diagram = (id,title,desc,height,body) => `<div class="architecture-viewport scenario-scroll" role="region" tabindex="0" aria-label="${title}"><svg class="scenario-canvas" viewBox="0 0 704 ${height}" role="group" aria-labelledby="${id}-title ${id}-desc"><title id="${id}-title">${title}</title><desc id="${id}-desc">${desc}</desc>${body}</svg></div>`;
  const source = ([title,url]) => `<a href="${url}" target="_blank" rel="noopener noreferrer">${title} <span aria-hidden="true">↗</span></a>`;

  const iot = diagram('iot-layout',t('IoT 系统部署对照','IoT deployment comparison'),
    t('单系统直接使用板级硬件。多虚拟机方案中，两台 Guest 并列，共用 Hypervisor 和 SoC。','One OS uses board hardware directly. In the multi-VM configuration, peer guests share a hypervisor and SoC.'),263,`
    <rect class="map-band" x="12" y="12" width="314" height="239" rx="10"/>
    <rect class="map-band native-band" x="340" y="12" width="352" height="239" rx="10"/>
    <text class="scenario-zone" x="29" y="36">${t('单系统直跑','One OS on hardware')}</text>
    <text class="scenario-zone" x="357" y="36">${t('多虚拟机','Multiple virtual machines')}</text>
    <path class="scenario-relation" d="M169 104V192 M431 104V109H601V104 M516 109V120 M516 174V192"/>
    <text class="scenario-line-label" x="182" y="153">${t('通过内核与驱动','Via kernel and drivers')}</text>
    ${node('native',29,50,280)}
    ${node('guest-one',357,50,148)}${node('guest-two',527,50,148)}
    ${node('hypervisor',357,120,318)}
    ${node('native-soc',29,192,280,48,'scenario-hardware')}
    ${node('virtual-soc',357,192,318,48,'scenario-hardware')}`);

  const car = diagram('car-audio',t('高通车载跨虚拟机音频','Qualcomm automotive audio across VMs'),
    t('AAOS 的 Audio HAL 与 VirtIO-Snd 前端在 GVM。控制经过 PVM 中的音频服务与后端，样本由共享内存送往 DSP。DSP 输出送到功放与扬声器。','The AAOS Audio HAL and VirtIO-Snd front end run in the GVM. Control goes through the PVM audio service and backend. Shared memory carries samples to the DSP, whose output reaches the amplifier and speakers.'),412,`
    <defs>
      <marker id="vehicle-audio-data" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M1 1L9 5L1 9" fill="none" stroke="#25756b" stroke-width="1.5"/></marker>
      <marker id="vehicle-audio-control" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M1 1L9 5L1 9" fill="none" stroke="#a16c2c" stroke-width="1.5"/></marker>
    </defs>
    <rect class="map-band" x="12" y="12" width="220" height="200" rx="10"/>
    <rect class="map-band native-band" x="472" y="12" width="220" height="200" rx="10"/>
    <text class="scenario-zone" x="28" y="36">${t('GVM · AAOS 来宾系统','GVM · AAOS guest')}</text>
    <text class="scenario-zone" x="488" y="36">${t('PVM · 主操作系统','PVM · Primary HLOS')}</text>
    <path class="scenario-control" d="M572 193V254" marker-end="url(#vehicle-audio-control)"/>
    <path class="scenario-control" d="M112 105V135" marker-end="url(#vehicle-audio-control)"/>
    <path class="scenario-data" d="M132 105V135" marker-end="url(#vehicle-audio-data)"/>
    <path class="scenario-control" d="M216 151H488" marker-end="url(#vehicle-audio-control)"/>
    <path class="scenario-data" d="M216 177H353V282H488" marker-end="url(#vehicle-audio-data)"/>
    <path class="scenario-data" d="M582 308V354" marker-end="url(#vehicle-audio-data)"/>
    <text class="scenario-line-label scenario-control-text" x="352" y="138" text-anchor="middle">${t('跨 VM 控制请求','Cross-VM control')}</text>
    <text class="scenario-line-label scenario-data-text" x="245" y="220">${t('共享内存传样本','Shared-memory samples')}</text>
    <text class="scenario-line-label scenario-control-text" x="587" y="237">IPC</text>
    <text class="scenario-line-label scenario-data-text" x="595" y="336">TDM</text>
    ${node('audio-hal',28,51,188)}${node('audio-front',28,135,188,58)}
    ${node('audio-back',488,135,188,58)}${node('dsp',488,254,188)}
    ${node('output',488,354,188,48,'scenario-hardware')}`);

  const android = diagram('sdv-layout',t('AAOS SDV 多虚拟机分工','AAOS SDV virtual-machine profiles'),
    t('AOSP 列出 Core、Media、IVI 三种并列执行配置。服务可跨虚拟机通信，底部的虚拟化环境给各 Guest 提供 VirtIO 设备。','AOSP lists Core, Media, and IVI as peer execution profiles. Services can communicate between VMs, and the platform exposes VirtIO devices to guests.'),255,`
    <rect class="map-band" x="12" y="12" width="680" height="148" rx="10"/>
    <text class="scenario-zone" x="29" y="34">${t('并列的虚拟机执行配置','Peer virtual-machine profiles')}</text>
    <path class="scenario-relation" d="M124 98V121 M352 98V121 M580 98V121 M124 121H580 M352 121V135 M662 160V190"/>
    ${node('core',29,45,190,53)}${node('media',257,45,190,53)}${node('ivi',485,45,190,53)}
    ${node('comms',222,135,260,47,'scenario-channel')}
    <text class="scenario-line-label" x="651" y="180" text-anchor="end">${t('提供 VirtIO 设备','VirtIO device access')}</text>
    ${node('sdv-platform',12,190,680,54,'scenario-platform')}`);

  return `<section id="scenarios">
    <h2>${t('IoT 与车载怎样组织多个系统','How IoT and automotive systems are organized')}</h2>
    <div class="scenario-figures">
      <p class="scenario-scroll-note">${t('窄屏可横向滑动图解。','Scroll the diagrams sideways on narrow screens.')}</p>
      <figure class="scenario-figure">
        <figcaption><h3>${t('IoT：单系统与多虚拟机','IoT: one OS or multiple VMs')}</h3><p>${t('一个 OS 可以直接使用板级硬件。需要隔离工作负载时，可以在一个 Hypervisor 上运行多个 Guest。','One OS can use the board directly. When workloads need separation, multiple guests can run on one hypervisor.')}</p>${source(arm)}</figcaption>
        ${iot}
      </figure>
      <figure class="scenario-figure">
        <figcaption><h3>${t('车载音频：GVM 播放，PVM 管理','Vehicle audio: playback in the GVM, control in the PVM')}</h3><p>${t('高通与 Dolby 的案例中，AAOS 在来宾虚拟机发起播放。主虚拟机的音频服务管理音频流，DSP 从共享内存读取音频样本，再输出到车内音响。','In the Qualcomm and Dolby example, AAOS starts playback in the guest VM. The primary VM manages audio streams, and the DSP reads shared-memory samples for cabin playback.')}</p>${source(dolby)}</figcaption>
        ${car}
      </figure>
      <figure class="scenario-figure">
        <figcaption><h3>${t('AAOS SDV：Core、Media、IVI 分工','AAOS SDV: roles of Core, Media, and IVI')}</h3><p>${t('AOSP 在 Android 17 的公开基线列出三种执行配置。Core 跑车载后台服务，Media 提供座舱图形和显示能力，IVI 承载信息娱乐。具体部署由整车方案决定。','The public Android 17 baseline lists three profiles. Core runs background vehicle services, Media provides cockpit graphics and display capabilities, and IVI runs infotainment. The vehicle design determines deployment.')}</p>${source(sdv)}${source(sdvArchitecture)}</figcaption>
        ${android}
      </figure>
    </div>
    <p class="caption">${t('白皮书用 PVM / GVM 表示主虚拟机和来宾虚拟机。Android AVF 的 pVM 指受保护虚拟机。','The white paper uses PVM / GVM for its primary and guest virtual machines. In Android AVF, pVM means protected virtual machine.')}</p>
  </section>`;
}

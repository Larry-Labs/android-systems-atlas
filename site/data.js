import { audioExplanationSources } from './audio-explanations.js?v=344aee49d425';
import { sourceTitle } from './source-links.js?v=12527b297d95';
export const pair = (zh, en) => ({zh, en});
export const groups = [pair('系统基础','System foundations'),pair('硬件与体验','Hardware & experiences'),pair('平台工程','Platform engineering')];
export const domains = [
 ['framework','系统服务与 Framework','Framework & services','从一次应用启动，认识系统的协调者。','Meet the services coordinating an application launch.',0,'layers',['AMS / ATMS','WMS','PackageManager'],['组件与生命周期','进程和任务管理','窗口、包与资源'],['Components & lifecycle','Processes & tasks','Windows, packages & resources']],
 ['ipc','Binder 与进程通信','Binder & IPC','理解跨进程调用，以及调用之外的数据传递。','Understand remote calls and the data paths beside them.',0,'network',['Binder','AIDL','JNI'],['进程边界','服务发现与调用','共享内存与 JNI'],['Process boundaries','Service discovery & calls','Shared memory & JNI']],
 ['runtime','ART 与运行时','ART & runtime','应用代码如何加载、执行与管理内存。','How application code is loaded, executed and managed.',0,'code',['ART','DEX','Zygote'],['Zygote 与应用进程','DEX 与执行','垃圾回收'],['Zygote & app processes','DEX & execution','Garbage collection']],
 ['hal','HAL 与兼容性','HAL & compatibility','系统与硬件实现之间，如何约定接口。','The contracts between Android and hardware implementations.',0,'layers',['AIDL HAL','HIDL','VINTF'],['接口与实现','Treble 与 VINTF','AIDL / HIDL 演进'],['Interfaces & implementations','Treble & VINTF','AIDL / HIDL evolution']],
 ['audio','音频系统','Audio system','跟随一段声音，穿过策略、混音与硬件。','Follow sound through policy, mixing and hardware.',1,'audio',['AudioFlinger','AudioTrack','Audio HAL'],['播放与录音','策略与混音','HAL、驱动与 DSP'],['Playback & capture','Policy & mixing','HAL, drivers & DSP']],
 ['camera','相机与 ISP','Camera & ISP','分开看拍摄请求和图像缓冲区的旅程。','Trace capture requests separately from image buffers.',1,'camera',['Camera2','Camera HAL','ISP'],['请求与结果','图像 buffer 流','HAL 与 ISP'],['Requests & results','Image buffer flow','HAL & ISP']],
 ['graphics','图形与显示','Graphics & display','一帧画面如何从应用走到屏幕。','How an application frame reaches the display.',1,'display',['SurfaceFlinger','BufferQueue','HWC'],['渲染与 Surface','缓冲与同步','合成与显示'],['Rendering & surfaces','Buffers & synchronization','Composition & display']],
 ['media','媒体与编解码','Media & codecs','串起封装、编解码与音画同步。','Connect containers, codecs and audiovisual synchronization.',1,'play',['MediaCodec','Codec2','DRM'],['媒体管线','硬件编解码','同步与 DRM'],['Media pipelines','Hardware codecs','Synchronization & DRM']],
 ['input','输入与传感器','Input & sensors','从触摸、按键到事件分发与传感器。','From touch and keys to dispatch and sensors.',1,'touch',['InputReader','InputDispatcher','Sensors'],['输入事件分发','传感器框架','振动与反馈'],['Input dispatch','Sensor framework','Haptics & feedback']],
 ['connectivity','网络与连接','Networks & connectivity','认识联网、近距离连接与外设通信。','Explore networking, local connectivity and peripherals.',1,'network',['Wi-Fi','Bluetooth','USB','NFC'],['网络管理','Wi-Fi 与蓝牙','USB 与 NFC'],['Network management','Wi-Fi & Bluetooth','USB & NFC']],
 ['telephony','蜂窝与定位','Telephony & location','连接系统服务、无线电与定位能力。','Connect system services to radio and location capabilities.',1,'signal',['Telephony','Radio HAL','GNSS'],['电话与数据连接','Radio HAL','定位与 GNSS'],['Calls & data connectivity','Radio HAL','Location & GNSS']],
 ['kernel','Linux 内核与 BSP','Linux kernel & BSP','从熟悉的 Linux，走进 Android 硬件适配。','Connect Linux foundations to Android hardware integration.',2,'chip',['GKI','DMA-BUF','Device Tree'],['GKI 与驱动','设备树与硬件','内存、DMA 与调度'],['GKI & drivers','Device trees & hardware','Memory, DMA & scheduling']],
 ['power','电源与性能','Power & performance','理解唤醒、休眠、调度与温控的协作。','Understand wakefulness, suspend, scheduling and thermal control.',2,'power',['Power HAL','Thermal','Doze'],['唤醒与休眠','性能与调度','功耗与温控'],['Wakefulness & suspend','Performance & scheduling','Power & thermals']],
 ['storage','存储与数据','Storage & data','从分区与文件系统，到数据的访问边界。','From partitions and filesystems to data-access boundaries.',2,'database',['Partitions','FBE','Scoped Storage'],['分区与文件系统','加密与访问','存储服务'],['Partitions & filesystems','Encryption & access','Storage services']],
 ['security','安全与可信环境','Security & trust','看懂权限、隔离与启动信任链。','Understand permissions, isolation and the boot chain of trust.',2,'shield',['SELinux','AVB','Keystore'],['沙箱与权限','SELinux','可信启动与密钥'],['Sandbox & permissions','SELinux','Verified boot & keys']],
 ['build','构建、启动与更新','Build, boot & updates','从源码与镜像，到启动和系统升级。','From source and images to boot and system updates.',2,'box',['Soong','init','OTA','APEX'],['源码与构建','启动与 init','OTA 与模块更新'],['Source & build','Boot & init','OTA & modular updates']],
 ['debug','调试与系统验证','Diagnostics & validation','用日志、追踪和源码理解系统行为。','Understand behavior through logs, traces and source.',2,'search',['adb','dumpsys','Perfetto','CTS','VTS'],['日志与状态','追踪与性能','兼容性测试体系'],['Logs & state','Tracing & performance','Compatibility testing']],
 ['virtualization','虚拟化与隔离','Virtualization & isolation','认识虚拟机与系统隔离的基本边界。','Explore virtual machines and system isolation boundaries.',2,'layers',['AVF','pKVM'],['虚拟化架构','隔离与可信执行','平台支持边界'],['Virtualization architecture','Isolation & trusted execution','Platform support boundaries']]
].map(([id,zh,en,descZh,descEn,group,icon,terms,outlineZh,outlineEn])=>({id,title:pair(zh,en),desc:pair(descZh,descEn),group,icon,terms,outline:pair(outlineZh,outlineEn)}));
export const layers = [
 {id:'apps',n:'01',title:pair('应用与系统 API','Apps & system APIs'),sub:pair('从使用能力开始','Where a capability is requested'),chips:['App','Framework API'],desc:pair('应用通过框架 API 使用系统能力。许多 API 的客户端代码就在应用进程里；“Framework”不等于一个单独的进程。','Apps use framework APIs to access system capabilities. Much of the client-side framework runs inside the app process; the framework is not a single process.'),process:pair('应用进程','App process'),mechanism:pair('本地调用；按功能通过 Binder 等机制联系服务','Local calls; service communication such as Binder where needed'),domain:'framework'},
 {id:'services',n:'02',title:pair('系统服务与原生组件','System services & native components'),sub:pair('协调资源，提供系统能力','Coordinate resources and system capabilities'),chips:['system_server','Native services'],desc:pair('系统服务负责策略与资源协调。一部分运行在 system_server，音频、相机、显示等也有各自的原生服务进程。ART 与原生库支撑代码执行，不是每个请求都必须经过的串行一层。','System services coordinate policy and resources. Some run in system_server; audio, camera and display also have native service processes. ART and native libraries support execution, rather than forming a mandatory serial hop.'),process:pair('system_server / 独立原生进程','system_server / separate native processes'),mechanism:pair('Binder 等控制接口；缓冲区等数据通道','Control interfaces such as Binder; data channels such as buffers'),domain:'ipc'},
 {id:'hal',n:'03',title:pair('硬件抽象层 · HAL','Hardware abstraction layer · HAL'),sub:pair('定义契约，连接具体实现','Define contracts for hardware implementations'),chips:['AIDL HAL','Vendor implementation'],desc:pair('HAL 为特定硬件能力提供标准接口，具体实现由设备平台提供。接口形式和承载方式取决于子系统与版本，不应把所有历史 HAL 都画成同一种调用。','HALs expose standard interfaces for hardware capabilities, backed by device-specific implementations. Interface and hosting models depend on the subsystem and version; historical HALs do not all share one call pattern.'),process:pair('通常为独立 HAL 服务，具体取决于接口与版本','Often a separate HAL service; depends on interface and version'),mechanism:pair('接口调用、流描述符与相应的数据传输方式','Interface calls, stream descriptors and relevant data transport'),domain:'hal'},
 {id:'kernel',n:'04',title:pair('Linux 内核与驱动','Linux kernel & drivers'),sub:pair('管理资源，驱动设备','Manage resources and operate devices'),chips:['GKI','Drivers'],desc:pair('内核负责进程调度、内存与设备访问等基础能力。用户空间通过系统调用访问内核，驱动再与设备协作。并非所有系统功能都需要经过 HAL。','The kernel provides scheduling, memory management and device access. Userspace enters it through system calls, and drivers interact with devices. Not every system feature passes through a HAL.'),process:pair('内核态','Kernel space'),mechanism:pair('系统调用、设备接口、中断与 DMA（视场景而定）','System calls, device interfaces, interrupts and DMA as applicable'),domain:'kernel'},
 {id:'hardware',n:'05',title:pair('芯片与硬件','Silicon & hardware'),sub:pair('把能力变成真实世界的输入输出','Turn capabilities into physical inputs and outputs'),chips:['CPU · GPU · DSP','Devices'],desc:pair('处理器、协处理器和外设完成具体计算与输入输出。固件、拓扑及能力随芯片和设备而变，需要具体平台资料才能确认。','Processors, coprocessors and peripherals perform computation and I/O. Firmware, topology and capabilities vary by chip and device and require platform-specific evidence.'),process:pair('硬件及其固件执行环境','Hardware and firmware execution environments'),mechanism:pair('总线、共享内存或平台定义的通信方式','Buses, shared memory or platform-defined communication'),domain:'kernel'}
];
export const sources = [
 {name:'AOSP · Software stack',url:'https://source.android.com/docs/core/architecture',desc:pair('整体架构与平台组件','Architecture and platform components')},
 {name:'AOSP · Audio architecture',url:'https://source.android.com/docs/core/audio',desc:pair('音频架构与关键组件','Audio architecture and key components')},
 {name:'AOSP · Audio HAL interfaces',url:'https://source.android.com/docs/core/audio/implement',desc:pair('Audio HAL 接口与版本演进','Audio HAL interfaces and version evolution')},
 {name:'AAOS · Multi-zone audio',url:'https://source.android.com/docs/automotive/audio/audio-multizone-routing',desc:pair('车载音频区域与路由','Automotive audio zones and routing')}
];

// Sources used by the audio article and its main and local diagrams.
const baseAudioSources = [
  {
    "name": "AudioTrack",
    "url": "https://developer.android.com/reference/android/media/AudioTrack"
  },
  {
    "name": "USB Audio",
    "url": "https://source.android.com/docs/core/audio/usb"
  },
  {
    "name": "AIDL and HIDL Audio HAL comparison",
    "url": "https://source.android.com/docs/core/audio/aidl-hidl-comp"
  },
  {
    "name": "Configurable Audio Policy support in AIDL HAL",
    "url": "https://source.android.com/docs/core/audio/aidl-cap"
  },
  {
    "name": "AOSP · Audio HAL interfaces",
    "url": "https://source.android.com/docs/core/audio/implement"
  },
  {
    "name": "Audio control HAL",
    "url": "https://source.android.com/docs/automotive/audio/audio-control-hal"
  },
  {
    "name": "AAOS · Multi-zone audio",
    "url": "https://source.android.com/docs/automotive/audio/audio-multizone-routing"
  },
  {
    "name": "Audio",
    "url": "https://source.android.com/docs/core/audio"
  },
  {
    "name": "Design for reduced latency",
    "url": "https://source.android.com/docs/core/audio/latency/design"
  },
  {
    "name": "AIDL Audio HAL",
    "url": "https://source.android.com/docs/core/audio/aidl-implement"
  },
  {
    "name": "StreamHalAidl.cpp · Android 17 r1",
    "url": "https://android.googlesource.com/platform/frameworks/av/+/refs/tags/android-17.0.0_r1/media/libaudiohal/impl/StreamHalAidl.cpp"
  },
  {
    "name": "IModule.aidl · Android 17 r1",
    "url": "https://android.googlesource.com/platform/hardware/interfaces/+/refs/tags/android-17.0.0_r1/audio/aidl/android/hardware/audio/core/IModule.aidl"
  },
  {
    "name": "StreamDescriptor.aidl · Android 17 r1",
    "url": "https://android.googlesource.com/platform/hardware/interfaces/+/refs/tags/android-17.0.0_r1/audio/aidl/android/hardware/audio/core/StreamDescriptor.aidl"
  },
  {
    "name": "ALSA SoC Layer Overview",
    "url": "https://docs.kernel.org/sound/soc/overview.html"
  },
  {
    "name": "Dynamic Audio Power Management for Portable Devices",
    "url": "https://docs.kernel.org/sound/soc/dapm.html"
  },
  {
    "name": "Writing an ALSA Driver",
    "url": "https://docs.kernel.org/sound/kernel-api/writing-an-alsa-driver.html"
  },
  {
    "name": "ASoC Machine Driver",
    "url": "https://docs.kernel.org/sound/soc/machine.html"
  },
  {
    "name": "ASoC Platform Driver",
    "url": "https://docs.kernel.org/sound/soc/platform.html"
  },
  {
    "name": "ASoC Codec Class Driver",
    "url": "https://docs.kernel.org/sound/soc/codec.html"
  },
  {
    "name": "q6asm-dai.c · Linux v6.12",
    "url": "https://github.com/torvalds/linux/blob/v6.12/sound/soc/qcom/qdsp6/q6asm-dai.c"
  },
  {
    "name": "q6routing.c · Linux v6.12",
    "url": "https://github.com/torvalds/linux/blob/v6.12/sound/soc/qcom/qdsp6/q6routing.c"
  },
  {
    "name": "q6adm.c · Linux v6.12",
    "url": "https://github.com/torvalds/linux/blob/v6.12/sound/soc/qcom/qdsp6/q6adm.c"
  },
  {
    "name": "q6apm.c · Linux v6.12",
    "url": "https://github.com/torvalds/linux/blob/v6.12/sound/soc/qcom/qdsp6/q6apm.c"
  },
  {
    "name": "soc-pcm.c · Linux v6.12",
    "url": "https://github.com/torvalds/linux/blob/v6.12/sound/soc/soc-pcm.c"
  },
  {
    "name": "q6asm.c · Linux v6.12",
    "url": "https://github.com/torvalds/linux/blob/v6.12/sound/soc/qcom/qdsp6/q6asm.c"
  }
];

// Include every diagram citation in the chapter bibliography.
export const audioSources=[...new Map([...baseAudioSources,...audioExplanationSources.map(url=>({name:sourceTitle(url),url}))].map(item=>[item.url,item])).values()];

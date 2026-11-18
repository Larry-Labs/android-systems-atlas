// Original bilingual explanations. Claim/source review: docs/AUDIO-EXPLANATION-REVIEW-2026-11-18.md.
// Keep content separate from geometry; every connection has its own mechanism.
const core='https://android.googlesource.com/platform/hardware/interfaces/+/refs/tags/android-17.0.0_r1/audio/aidl/android/hardware/audio/core/';
const av='https://android.googlesource.com/platform/frameworks/av/+/refs/tags/android-17.0.0_r1/';
const linux='https://github.com/torvalds/linux/blob/v6.12/';
const qcom=linux+'sound/soc/qcom/qdsp6/';
export const audioReferences={
 track:'https://developer.android.com/reference/android/media/AudioTrack',
 overview:'https://source.android.com/docs/core/audio',
 terminology:'https://source.android.com/docs/core/audio/terminology',
 latency:'https://source.android.com/docs/core/audio/latency/design',
 aidl:'https://source.android.com/docs/core/audio/aidl-implement',
 jni:'https://developer.android.com/ndk/guides/jni-tips',
 fmq:'https://source.android.com/docs/core/architecture/aidl/fmq',
 module:core+'IModule.aidl',descriptor:core+'StreamDescriptor.aidl',
 transfer:av+'media/libaudiohal/impl/StreamHalAidl.cpp',
 native:'https://android.googlesource.com/platform/frameworks/av/+/master/media/libaudioclient/AudioTrack.cpp',
 policy:'https://android.googlesource.com/platform/frameworks/av/+/master/services/audiopolicy/managerdefault/AudioPolicyManager.cpp',
 policyService:'https://android.googlesource.com/platform/frameworks/av/+/master/services/audiopolicy/service/AudioPolicyService.cpp',
 flinger:'https://android.googlesource.com/platform/frameworks/av/+/master/services/audioflinger/AudioFlinger.cpp',
 threads:'https://android.googlesource.com/platform/frameworks/av/+/master/services/audioflinger/Threads.cpp',
 alsa:'https://docs.kernel.org/sound/kernel-api/writing-an-alsa-driver.html',
 pcm:'https://www.alsa-project.org/alsa-doc/alsa-lib/pcm.html',
 soc:'https://docs.kernel.org/sound/soc/overview.html',
 machine:'https://docs.kernel.org/sound/soc/machine.html',
 platform:'https://docs.kernel.org/sound/soc/platform.html',
 codec:'https://docs.kernel.org/sound/soc/codec.html',
 dapm:'https://docs.kernel.org/sound/soc/dapm.html',
 socPcm:linux+'sound/soc/soc-pcm.c',
 tinyPcm:'https://github.com/tinyalsa/tinyalsa/blob/master/src/pcm.c',
 tinyMixer:'https://github.com/tinyalsa/tinyalsa/blob/master/src/mixer.c',
 asmFront:qcom+'q6asm-dai.c',asm:qcom+'q6asm.c',routing:qcom+'q6routing.c',
 adm:qcom+'q6adm.c',apm:qcom+'q6apm.c'
};
const R=audioReferences;
const explain=(zh,en,...sources)=>({text:{zh,en},sources});

export const audioNodeExplanations={
 policy:explain(
  'AudioPolicyService 提供系统音频策略服务，内部的 AudioPolicyManager 根据音频用途、设备能力与配置选择输出和路由，再经策略客户端请求 AudioFlinger 落实开输出、连接 audio patch 等操作。它决定声音送往哪里；PCM 样本由数据路径传递。图中合并了服务内部的转发关系。',
  'AudioPolicyService provides the system audio policy service. Its AudioPolicyManager selects outputs and routes using audio attributes, device capabilities and configuration, then requests output and audio-patch operations from AudioFlinger through the policy client. It decides destinations; the data path carries PCM. Internal forwarding is grouped here.',R.policyService,R.policy,R.aidl),
 pcm:explain(
  'PCM 用按时间排列的数值样本表示声音。采样率说明每秒多少帧，声道数说明每帧含几个声道的样本，采样格式说明数值如何存储。这里应用已经持有 PCM，再交给 AudioTrack；媒体文件如何解码成这些样本属于前一步。',
  'PCM represents sound as samples ordered in time. The sample rate gives frames per second, the channel count gives samples per frame, and the sample format defines their storage. Here the app already has PCM to give AudioTrack; decoding a media file into these samples is an earlier operation.',R.pcm,R.track),
 java:explain(
  'AudioTrack 是应用播放一条音频数据流的 Java / Kotlin API。应用配置格式与缓冲，通过 write 提交数据，用 play、pause、stop 控制播放。这里采用 MODE_STREAM 持续补充 PCM；write 返回已接收的数量，并不表示这些样本已经从扬声器发声。',
  'AudioTrack is the Java / Kotlin API for playing an audio data stream. The app configures its format and buffer, submits data with write, and controls playback with play, pause and stop. This MODE_STREAM path continually supplies PCM. A write reports accepted data, not completed speaker output.',R.track),
 native:explain(
  'Native AudioTrack 是应用进程中的 C++ 音频客户端：承接 Java API 经 JNI 发来的操作，管理客户端缓冲访问，并与服务端音轨协作。本例 PCM 经共享音轨缓冲供 AudioFlinger 读取；创建音轨、启停等控制使用 Binder 接口。它与 HAL 边界的 FMQ 是两套通信关系。',
  'Native AudioTrack is the C++ audio client in the app process. It handles Java operations through JNI, manages client buffer access and coordinates with the server track. Here AudioFlinger reads PCM from a shared track buffer; track creation and start/stop controls use Binder interfaces. This is separate from HAL FMQ transport.',R.overview,R.native,R.jni),
 flinger:explain(
  'AudioFlinger 是系统侧的原生音频服务组件，管理音轨及播放线程。在这条普通 PCM 路径中，它读取应用音轨的样本，按配置完成混音、音量处理及必要的重采样，再通过 HAL 适配层输出。输出与路由由音频策略选择；FastMixer、direct、offload 是不同处理组织，不能串成全部音频必经的步骤。',
  'AudioFlinger is a native system audio service component managing tracks and playback threads. On this ordinary PCM path it reads app-track samples, mixes them, applies configured volume and any required resampling, then outputs through the HAL adapter. Audio policy selects outputs and routes. FastMixer, direct and offload are different processing arrangements, not universal serial steps.',R.terminology,R.threads,R.flinger),
 adapter:explain(
  'libaudiohal 是框架音频服务访问 Audio HAL 的适配库。它把框架侧的模块、流和读写操作接到具体 HAL 接口：AIDL 管理调用使用 Binder，所示非 MMAP 流的数据及命令通过 FMQ 交换。它运行在框架客户端一侧，设备访问由 HAL 实现负责。',
  'libaudiohal adapts framework audio-service module, stream and I/O operations to the Audio HAL interface. AIDL management calls use Binder; this non-MMAP stream exchanges data and commands through FMQs. The adapter is on the framework client side; the HAL implementation handles device access.',R.aidl,R.transfer),
 reply:explain(
  'reply FMQ 是 HAL 向框架回复流命令的队列。回复包含操作状态、流状态，以及 burst 实际消费的字节数 reply.fmqByteCount；还能报告位置与延迟，无法取得的位置有 UNKNOWN 表示。消费字节数说明本次接收了多少数据，与声音呈现位置是不同字段。',
  'The reply FMQ returns HAL stream-command results to the framework: operation status, stream state and the bytes actually consumed by a burst in reply.fmqByteCount. It can also report positions and latency, with UNKNOWN for unavailable positions. Consumed bytes and presentation position are distinct fields.',R.descriptor),
 data:explain(
  'audio.fmq 是非 MMAP 流逐次 burst 使用的共享内存字节队列，本例承载 PCM。框架先写数据；HAL 在处理 burst 时取空队列，以 reply.fmqByteCount 报告实际消费量。未消费部分由框架在下次传输重送；队列不跨 burst 留存待播放数据，也不同于驱动的播放环形缓冲。',
  'audio.fmq is the shared-memory byte queue used for each burst on a non-MMAP stream, carrying PCM here. The framework writes first; the HAL empties the queue for the burst and reports actual consumption in reply.fmqByteCount. The framework re-sends unconsumed bytes next time. It is transient, unlike the driver playback ring buffer.',R.descriptor,R.transfer),
 command:explain(
  'command FMQ 把框架的流命令交给 HAL 的流工作线程，例如 start、burst、pause 和 getStatus。burst 的参数指定这次请求传输的字节数，音频字节另放在 audio.fmq。输出先写数据再发 burst；HAL 按流状态处理命令，并经 reply FMQ 回复。',
  'The command FMQ sends framework stream commands such as start, burst, pause and getStatus to the HAL stream worker. A burst specifies a requested byte count; audio bytes are in audio.fmq. Output data is written before burst. The HAL handles the command according to stream state and returns a reply FMQ result.',R.descriptor,R.transfer),
 stream:explain(
  'HAL 输出流是 HAL 为一次输出配置建立的流对象，向框架提供 IStreamOut 与相应流控制能力。所示非 MMAP 工作线程读取命令和数据，调用设备后端送出样本，并回复状态、消费量及位置。设备连接由模块的端口配置与 audio patch 管理，流对象和物理扬声器不是同一事物。',
  'A HAL output stream is a stream object created for an output configuration, exposed through IStreamOut and associated stream controls. Its non-MMAP worker handles commands and data, submits samples to the backend and replies with status, consumption and position. Module port configurations and audio patches manage device connections; a stream object is not a physical speaker.',R.aidl,R.module,R.descriptor),
 module:explain(
  'IModule 是 AIDL Core Audio HAL 的模块管理入口，负责查询与配置音频端口、管理 audio patch，并打开输入或输出流。openOutputStream 返回 IStreamOut 和 StreamDescriptor，后者描述数据及命令通道。开流与连接设备是不同操作，端口配置和 patch 共同确定连接。',
  'IModule is the module-management entry point for the AIDL Core Audio HAL. It queries/configures audio ports, manages audio patches and opens streams. openOutputStream returns IStreamOut and a StreamDescriptor describing the transport channels. Opening a stream and connecting a device are separate operations; port configurations and a patch establish the connection.',R.aidl,R.module),
 backend:explain(
  'HAL 后端把 HAL 流操作落实为设备访问。本例用 tinyalsa 在用户空间打开、配置 ALSA PCM 设备并写入样本，也可通过控制接口设置路由。tinyalsa 是访问库，内核中的 ALSA 与驱动执行另一侧工作。这里选择非 mmap 写入；AIDL 接口本身不规定必须使用 tinyalsa 或该后端。',
  'A HAL backend implements stream operations through device access. This example uses the userspace tinyalsa library to open/configure an ALSA PCM device and write samples, with control interfaces for routing. Kernel ALSA and drivers handle the other side. Non-mmap writes are selected here; AIDL does not require tinyalsa or this backend.',R.tinyPcm,R.tinyMixer,R.aidl),
 'pcm-core':explain(
  'ALSA PCM 是内核声音子系统管理数字音频流的接口与核心机制：检查格式、采样率、声道及缓冲参数，维护流状态、缓冲位置，并调用驱动操作。hw_params 配置参数，prepare 准备传输，trigger 启停。PCM 在这里既是接口名称，也与实际音频样本的 PCM 表示有关。',
  'ALSA PCM is the kernel sound interface and core machinery for digital audio streams. It validates format, rate, channels and buffers, maintains stream state/positions, and invokes driver operations. hw_params configures parameters, prepare readies transfer and trigger starts/stops it. Here PCM names both a stream interface and the sample representation.',R.alsa,R.pcm),
 card:explain(
  '这个框组合两类协作职责：Machine 驱动把 CPU DAI、平台与 Codec 等组件连接成声卡，并提供板级配置；DAPM 根据流活动、mixer 设置及路由图，为需要工作的音频部件协调供电。它们管理连接与电源，样本由缓冲和硬件数据通路传送。',
  'This groups two coordinating roles. The machine driver connects CPU DAI, platform and codec components into a card and supplies board configuration. DAPM uses stream activity, mixer settings and a routing graph to power the required audio parts. They manage connectivity and power; buffers and hardware paths carry samples.',R.machine,R.dapm),
 ring:explain(
  '播放环形缓冲是在内存中循环使用的 PCM 存储区。ALSA 用户态客户端在可用区域补数据，硬件按播放节奏取走数据；appl_ptr 与 hw_ptr 记录双方位置，用于计算可写空间。本图客户端是 HAL 后端。供数跟不上消费可发生 underrun；它与 HAL 传输用的临时 FMQ 不同。',
  'The playback ring buffer is reusable circular storage for PCM in memory. The ALSA userspace client fills available space while hardware consumes data at the playback rate; appl_ptr and hw_ptr track both sides to calculate writable space. The client here is the HAL backend. Starvation can cause an underrun. This is separate from transient HAL FMQ transport.',R.pcm,R.alsa),
 'dai-driver':explain(
  '这里合并 DMA 与 CPU DAI 驱动职责：前者准备缓冲传输并处理进度，后者配置 SoC 数字音频接口的格式、时钟等。驱动执行配置与启停，DMA 引擎和音频控制器执行硬件传输。CPU DAI 中的 CPU 表示 SoC 一侧的接口角色，不表示 CPU 逐样本搬运。',
  'This groups DMA and CPU DAI driver roles. One prepares buffer transfers and handles progress; the other configures the SoC digital audio interface, including format and clocks. Drivers configure and start/stop; DMA and the audio controller execute hardware transfers. CPU DAI identifies the SoC-side interface, not CPU copying of every sample.',R.platform,R.alsa),
 'codec-driver':explain(
  'Codec 驱动是内核中配置音频 Codec 硬件的代码，提供数字接口、音量、路由与电源等操作，并参与 ASoC 声卡协作。寄存器常通过 I²C 或 SPI 控制；本例 PCM 走另一条 I²S 数据接口。配置寄存器和传输音频样本是两种不同工作。',
  'The codec driver configures audio codec hardware in the kernel. It provides interface, gain, routing and power operations within an ASoC card. Registers are often controlled over I²C or SPI, while this example carries PCM over a separate I²S data interface. Register control and sample transport are different tasks.',R.codec),
 dma:explain(
  'DMA 引擎是执行内存与外设数据搬运的硬件。本例由驱动先配置源缓冲、目标及传输参数，再由 DMA 持续把播放缓冲中的样本送到音频控制器。驱动根据传输事件更新 ALSA 进展；这只说明缓冲被消费，不能当作扬声器已经呈现这些声音。',
  'A DMA engine is hardware that moves data between memory and peripherals. Drivers first configure source buffers, destinations and transfer parameters; DMA then supplies playback-buffer samples to the audio controller. The driver updates ALSA progress from transfer events. Buffer consumption is distinct from speaker presentation.',R.platform,R.alsa),
 'dai-hw':explain(
  'SoC 音频控制器是发送或接收数字音频的硬件。本例它接收 DMA 送来的样本，按选定的 I²S 格式与时钟送给 Codec；两端的采样格式、时钟关系需匹配。CPU DAI 驱动负责配置这个接口。I²S 是本例总线，USB、SoundWire 等路径有不同接口组织。',
  'The SoC audio controller sends or receives digital audio. Here it accepts DMA samples and transmits them to the codec with the selected I²S format and clocks; both ends must agree on format and clocking. The CPU DAI driver configures the interface. USB, SoundWire and other paths use different interface arrangements.',R.soc,R.platform),
 'codec-hw':explain(
  '这里的 Codec 是音频硬件器件，其播放通路中的 DAC 将数字采样转换为模拟信号，供后续放大与输出。器件也可能提供录音、音量、混音等功能，集成范围依芯片而定。它与 AAC 等压缩音频的软件解码器属于不同语境。',
  'Here the codec is an audio hardware device. Its playback DAC converts digital samples into an analog signal for amplification and output. The device may also provide capture, gain or mixing; integration varies. This is a different use of codec from a software decoder for compressed audio such as AAC.',R.codec,R.dapm),
 speaker:explain(
  '功放提供驱动负载所需的功率，扬声器把电信号转为声学振动，声音才从物理设备输出。图中选择 Codec 模拟输出接功放的功能关系；Codec 与功放可以集成，数字功放的输入接口也可能不同。',
  'The power amplifier supplies the power needed by the load, and the speaker converts electrical signals into acoustic vibration. This diagram selects an analog codec output feeding amplification. Codec and amplifier may be integrated, and a digital amplifier can use a different input interface.',R.machine,R.dapm)
};

export const audioEdgeExplanations={
 'policy-output':explain(
  'AudioPolicyManager 经策略客户端请求 AudioFlinger 打开输出、配置设备连接或建立 audio patch。请求携带输出、端口与设备相关参数，PCM 另走数据通路。箭头概括服务内部的转发和执行关系，不代表一次直接跨进程调用。',
  'AudioPolicyManager uses its policy client to request output opening, device connections or audio-patch creation from AudioFlinger. Requests concern outputs, ports and devices; PCM uses the data path. The arrow groups internal forwarding and execution rather than one direct IPC call.',R.terminology,R.policy,R.flinger),
 'hal-operations':explain(
  'AudioFlinger 经 libaudiohal 发起 HAL 模块及输出流操作，例如打开输出、应用端口配置和创建 audio patch。适配层转换到对应 HAL 接口；这里是管理与配置关系，连续 PCM 写入由上方数据线单独表示。',
  'AudioFlinger uses libaudiohal for HAL module/output operations such as opening an output, applying port configurations and creating audio patches. The adapter maps these to HAL interfaces. Continuous PCM writes use the separate data connection.',R.aidl,R.module,R.flinger),
 write:explain(
  '应用调用 AudioTrack.write，把已有 PCM 按配置的采样格式和声道布局提交给音轨。返回值说明这次接受了多少数据；阻塞或非阻塞方式由所用重载与参数决定，写入完成与物理出声是不同时间点。',
  'The app calls AudioTrack.write to submit PCM matching the configured format and channel layout. Its return value reports accepted data. Blocking behavior depends on the overload and mode; completing a write and audible output occur at different times.',R.track),
 jni:explain(
  'AudioTrack 的 Java 方法通过 JNI 调用应用进程内的原生实现，传递写入参数、缓冲访问与控制操作。JNI 连接 Java 与 C/C++，不会因这一步自动切换到服务进程；服务端协作发生在后续音轨接口与共享缓冲处。',
  'Java AudioTrack methods call native code in the app process through JNI, passing write parameters, buffer access and controls. JNI bridges Java and C/C++; it does not itself move execution into a service process. Server coordination occurs through track interfaces and shared buffers.',R.jni,R.overview,R.native),
 buffer:explain(
  'Native AudioTrack 把样本写入客户端与服务端共享的音轨缓冲，AudioFlinger 的服务端音轨读取可用帧。双方用控制信息协调可写与可读区域。这里传的是 PCM 帧，创建音轨、启停等请求另走 Binder；该缓冲不是 HAL 的 audio.fmq。',
  'Native AudioTrack writes samples into a track buffer shared with the server, where AudioFlinger reads available frames. Control information coordinates writable/readable regions. PCM frames use this buffer; track creation and start/stop use Binder. This buffer is separate from HAL audio.fmq.',R.native,R.overview),
 'track-control':explain(
  '原生客户端通过音频 Binder 接口请求创建服务端音轨，并对该音轨发起 start、pause、stop 等控制。传输的是调用参数和结果；持续 PCM 样本由共享音轨缓冲供给服务端，不能理解为每批样本都装进这些控制调用。',
  'The native client uses audio Binder interfaces to create a server track and issue start, pause or stop controls. Calls carry parameters and results; continuous PCM is supplied through the shared track buffer rather than embedded in each control transaction.',R.native,R.overview),
 mix:explain(
  '所示普通混音线程读取活动音轨，按配置处理音量、必要的采样率转换及混合，再把输出 PCM 交给 HAL 流写接口。单个应用音轨和设备输出流不是一一等同的概念；多个音轨可以汇入同一混音输出。',
  'The ordinary mixer reads active tracks, applies configured gain, required rate conversion and mixing, then writes output PCM through the HAL stream interface. An app track and a device output stream are distinct concepts; several tracks can feed one mixed output.',R.latency,R.terminology),
 'to-data':explain(
  '框架侧 StreamHalAidl 将本次待写的音频字节放进 audio.fmq，再发送带请求字节数的 burst 命令。这一步写的是共享内存队列；请求与实际消费字节数由命令及回复配合确认。',
  'Framework StreamHalAidl places this transfer’s audio bytes in audio.fmq, then sends burst with the requested byte count. This writes a shared-memory queue; command and reply coordinate the request and actual consumption.',R.transfer,R.descriptor),
 'from-data':explain(
  'HAL 工作线程处理 burst 时从 audio.fmq 取出本批 PCM，交给所选后端。即使后端只能消费一部分，协议也要求取空队列；HAL 回复实际消费量，框架下次重送未消费部分。',
  'For a burst, the HAL worker retrieves PCM from audio.fmq for its backend. It must empty the queue even if the backend consumes only part. The HAL replies with actual consumption so the framework can re-send the remainder next time.',R.descriptor),
 'to-command':explain(
  'libaudiohal 向 command FMQ 写入流命令。burst 携带请求传输的字节数，start、pause 等命令改变流状态；音频字节在另一条队列中。适配实现从 standby 传输时先执行 start，再处理 burst。',
  'libaudiohal writes a stream command to the command FMQ. burst carries a requested byte count; commands such as start and pause change stream state. Audio bytes use a separate queue. When transferring from standby, the adapter starts the stream before its burst.',R.transfer,R.descriptor),
 'from-command':explain(
  'HAL 流工作线程读取 command FMQ，按当前状态检查并执行命令。收到 burst 后才按约定处理数据队列，执行结果写入 reply FMQ。命令、数据和回复共同组成一次传输协议，而不是三层音频处理。',
  'The HAL stream worker reads command FMQ and validates/executes the command against its current state. A burst triggers data-queue handling; the result goes to reply FMQ. Commands, data and replies form a transfer protocol, not three audio-processing layers.',R.descriptor),
 'to-reply':explain(
  'HAL 处理命令后向 reply FMQ 写回操作状态及流状态；burst 还返回 fmqByteCount，表示实际消费的字节数。位置字段另描述帧位置和时间，不能用“回复成功”代替声音呈现完成。',
  'After a command, the HAL writes operation status and stream state into reply FMQ. A burst also reports actual consumed bytes in fmqByteCount. Separate position fields describe frames and time; a successful command is not completed sound presentation.',R.descriptor),
 'from-reply':explain(
  '框架适配层读取与命令对应的 reply，检查错误与流状态，并根据实际消费字节数更新传输结果。后端未消费的字节需要后续重送；可用的位置与延迟信息另用于相应查询。',
  'The framework adapter reads the command’s reply, checks errors/state and updates transfer results using the actual consumed byte count. Bytes the backend did not consume must be sent again later; available position and latency fields serve their respective queries.',R.transfer,R.descriptor),
 open:explain(
  '框架适配层通过 Binder 调用 IModule，查询或配置端口、设置 audio patch，并为选定 mix port 配置打开输出流。开流传入端口配置标识、元数据和缓冲需求等；这些管理操作与后续逐批 PCM 传输分开。',
  'The framework adapter calls IModule over Binder to query/configure ports, set audio patches and open a stream for a selected mix-port configuration. Opening supplies its configuration ID, metadata and buffer requirements. These management operations are separate from later PCM transfers.',R.module,R.aidl),
 'open-result':explain(
  'openOutputStream 返回 IStreamOut 接口和 StreamDescriptor。前者提供输出流能力，后者携带队列或 MMAP 缓冲的描述信息；本例使用三条 FMQ。返回的是接口与通道描述，不是一批 PCM，也不代表已经开始出声。',
  'openOutputStream returns IStreamOut and StreamDescriptor: a stream interface plus descriptions of queues or an MMAP buffer. This example uses three FMQs. The result describes interfaces/transport rather than a PCM batch or completed playback.',R.module,R.descriptor),
 create:explain(
  'HAL 模块根据 openOutputStream 的参数建立输出流及其传输资源，并把流对象和描述符交回框架。新流初始处于 STANDBY，之后按状态机响应 start、burst 等命令；创建对象不等于每批 PCM 都重新开流。',
  'The HAL module creates the output stream and transport resources from openOutputStream arguments, returning the stream and descriptor. A new stream starts in STANDBY and subsequently handles start, burst and other commands according to its state machine.',R.module,R.descriptor),
 backend:explain(
  'HAL 流把取到的 PCM 交给设备后端执行写入。本例后端采用 tinyalsa 访问 ALSA；格式与缓冲需先配置，再持续供数。HAL 接口没有规定必须使用这套库，其他硬件可由相应后端对接。',
  'The HAL stream submits PCM to its device backend. This example uses tinyalsa to access ALSA, configuring format/buffers before supplying samples. The HAL interface does not mandate this library; other hardware can use its own backend.',R.tinyPcm,R.aidl),
 'pcm-submit':explain(
  '本例 tinyalsa 后端以 pcm_writei 等非 mmap 操作提交交错 PCM 帧，经 ALSA PCM 的内核接口进入驱动栈。它传的是样本及帧数；控制路由用另一套控制接口，tinyalsa 本身也不是内核驱动。',
  'This tinyalsa backend submits interleaved PCM frames with non-mmap operations such as pcm_writei, entering the driver stack through the ALSA PCM kernel interface. Routing uses a separate control interface; tinyalsa itself is a userspace library.',R.tinyPcm,R.alsa),
 'buffer-fill':explain(
  '在本例非 mmap 写入方式下，ALSA 的写入处理把用户态提供的 PCM 复制到可写的播放缓冲区域，并推进客户端位置 appl_ptr。缓冲写满时需等待或返回相应结果；硬件消费推进后才腾出新的可写空间。',
  'For this non-mmap path, ALSA write handling copies user-provided PCM into writable playback-buffer space and advances appl_ptr. A full buffer requires waiting or the corresponding return result; hardware consumption frees more writable space.',R.pcm,R.alsa),
 'pcm-ops':explain(
  'ALSA / ASoC 根据流生命周期调用组件的 PCM 操作：hw_params 应用参数，prepare 准备缓冲与硬件，trigger 负责启停，pointer 查询播放位置。它们是不同事件对应的驱动回调，不是每批 PCM 必须依次经过的模块。',
  'ALSA / ASoC invokes PCM operations as stream events occur: hw_params applies parameters, prepare readies buffers/hardware, trigger starts/stops and pointer reports position. These are driver callbacks for different lifecycle events, not serial sample-processing modules.',R.alsa,R.platform),
 'card-dai':explain(
  'Machine 驱动通过 DAI link 等板级描述，把 CPU DAI、平台组件与 Codec 组织成声卡连接，并提供板级时钟、格式等配置。组件随后按对应回调协作；这条线描述绑定与配置关系，不承载 PCM。',
  'The machine driver uses board descriptions such as DAI links to connect CPU DAI, platform and codec components into a card, with board clock/format configuration. Components then cooperate through their callbacks. This connection describes binding/configuration, not PCM transport.',R.machine,R.platform),
 'card-codec':explain(
  '声卡的路由与 DAPM 图关联 Codec 中可开关的部件。DAPM 结合活动流及 mixer / mux 设置，确定哪些部件需要供电，并调用相应组件控制。它表达实际有效路径的电源协作，不能当成样本先经过一个 DAPM 软件盒子。',
  'The card’s routing/DAPM graph connects switchable codec parts. DAPM combines active streams with mixer/mux settings to power required parts through component controls. This coordinates power along the active route; samples do not pass through a DAPM software box.',R.dapm,R.codec),
 'dma-config':explain(
  'DMA 相关驱动准备传输所需的缓冲地址、大小与周期等参数，在启动或停止回调中控制 DMA 工作。参数在准备和配置阶段设置，传输期间由 DMA 硬件搬运样本，驱动还需处理相应进度事件。',
  'DMA-related drivers prepare buffer addresses, sizes and period parameters, then control DMA from start/stop operations. Setup supplies the parameters; hardware moves samples during transfer and the driver handles progress events.',R.platform,R.alsa),
 'dai-config':explain(
  'CPU DAI 驱动配置音频控制器的数字接口格式、时钟角色及相关参数，使其与 Codec 端匹配。此处选择 I²S 输出；具体时钟来源和寄存器设置依控制器及板级连接确定。',
  'The CPU DAI driver configures the audio controller’s digital format, clocking role and related parameters to match the codec. I²S output is selected here; clock sources and registers depend on the controller and board connection.',R.platform,R.machine),
 'codec-config':explain(
  'Codec 驱动通过寄存器访问设置数字接口、增益、路由和电源等，常用 I²C / SPI 控制总线。这里发送控制值；PCM 数字样本从另一条 I²S 接口进入 Codec。',
  'The codec driver sets interface, gain, routing and power registers, often over I²C / SPI. This link carries control values; digital PCM samples enter through the separate I²S interface.',R.codec),
 'dma-fetch':explain(
  '配置完成后，DMA 从内存播放缓冲中取出尚未消费的 PCM，按传输设置送向音频外设。样本仍受生产与消费位置约束，驱动须协调缓冲使用；这不是 CPU 为每个样本执行一次拷贝调用。',
  'Once configured, DMA fetches unconsumed PCM from the memory playback buffer for the audio peripheral. Producer/consumer positions and driver coordination still govern buffer use; the CPU does not issue one copy call per sample.',R.platform,R.alsa),
 period:explain(
  '本例的传输进展经驱动通知 ALSA，例如调用 snd_pcm_period_elapsed。ALSA 再经 pointer 回调查询硬件位置、更新可用空间并唤醒等待者。period 是缓冲进展的通知粒度，不保证每次中断恰好一个 period；这条反馈也不表示样本已从扬声器呈现。',
  'In this example the driver reports transfer progress to ALSA, for example with snd_pcm_period_elapsed. ALSA queries hardware position through pointer, updates available space and wakes waiters. A period is notification granularity, not necessarily one interrupt, and this feedback does not mean speaker presentation.',R.alsa),
 'dma-out':explain(
  'DMA 把从播放缓冲取出的样本写入 SoC 音频控制器的数据通路，由控制器继续组织数字输出。具体 FIFO、握手与 DMA 请求机制取决于外设；这条关系说明内存搬运与串行接口输出由不同硬件职责完成。',
  'DMA supplies playback-buffer samples to the SoC audio controller’s data path for digital output. FIFOs, handshaking and DMA requests depend on the peripheral. Memory transfer and serial audio output are distinct hardware roles.',R.platform,R.alsa),
 i2s:explain(
  '音频控制器按选定 I²S 格式和时钟把数字样本送到 Codec。接收端按相同约定识别样本；这里仍是数字信号。Codec 寄存器配置走另一条控制连接，后续 DAC 才把数字采样转换为模拟信号。',
  'The controller sends digital samples to the codec with the selected I²S format and clocks. The receiver interprets them using the same configuration. Register control uses a separate connection; analog conversion happens later in the DAC.',R.soc,R.codec),
 analog:explain(
  '所选 Codec 播放路径经 DAC 输出模拟音频，再由功放提供驱动扬声器所需的功率，扬声器转换为声学振动。这段传递的是模拟电信号，不再是内存中的 PCM 字节；器件是否集成依硬件而定。',
  'The selected codec path outputs analog audio through its DAC. Amplification supplies speaker-driving power and the speaker produces acoustic vibration. This segment carries an analog electrical signal rather than memory PCM bytes; integration depends on the hardware.',R.codec,R.dapm,R.machine),
 'stream-power':explain(
  'ASoC 在流启动、停止等生命周期事件中把活动状态交给 DAPM。DAPM 再结合已选择的路由与 mixer 设置，为需要工作的部件协调电源；这不是每批 PCM 都重新配置电源的通知。',
  'ASoC passes stream activity to DAPM at lifecycle events such as start/stop. DAPM combines it with selected routes and mixer settings to power required parts. Power is not reconfigured for every PCM batch.',R.socPcm,R.dapm),
 'mixer-config':explain(
  'HAL 后端通过 ALSA 控制接口设置声卡暴露的 mixer / mux 等控件，例如选择输出路径。所示 tinyalsa mixer 操作用控制 ioctl 写入控件值；与 PCM 写入通道分开。DAPM 根据关联控件和路由图重新评估所需部件。',
  'The HAL backend uses ALSA controls to set card mixer/mux elements, for example selecting an output path. tinyalsa mixer operations write control values through control ioctls, separately from PCM writes. DAPM reevaluates required parts using associated controls and its route graph.',R.tinyMixer,R.dapm)
};

export const audioLocalExplanations={
 'dread-alsa':{title:'ALSA PCM',...explain(
  'ALSA PCM 管理音频流的参数、状态及缓冲位置，并把设备操作交给驱动。本例非 mmap 写入把用户态 PCM 放入播放缓冲，硬件消费后腾出可写空间。供数未跟上可产生 underrun，需要调用方处理。',
  'ALSA PCM manages stream parameters, state and buffer positions, delegating device operations to drivers. Here non-mmap writes place userspace PCM into the playback buffer; hardware consumption frees writable space. Starvation can cause an underrun that the caller must handle.',R.alsa,R.pcm)},
 'dread-asoc':{title:'ASoC / DAPM',...explain(
  'ASoC 组织 SoC 音频的组件协作：Machine 把接口、平台与 Codec 绑定成声卡；DAPM 根据路由、mixer 设置及流活动协调电源。本框合并这些管理职责，PCM 样本由下方缓冲和硬件通路传送。',
  'ASoC organizes SoC audio components. The machine driver binds interfaces, platform and codec into a card; DAPM coordinates power from routes, mixer settings and stream activity. This groups management roles; buffers and hardware below carry PCM.',R.soc,R.machine,R.dapm)},
 'dread-drivers':{title:'组件驱动 / Component drivers',...explain(
  '本框合并 DMA、CPU DAI 与 Codec 的驱动职责：准备缓冲传输、配置数字接口与时钟、设置 Codec 寄存器及电源。它们按 ALSA / ASoC 回调协作，实际搬运与转换由相应硬件执行；不是一个独立的“组件驱动”模块。',
  'This groups DMA, CPU DAI and codec drivers: preparing buffer transfers, configuring interfaces/clocks and setting codec registers/power. They cooperate through ALSA / ASoC callbacks; hardware performs transfer/conversion. It is not one separate module named component drivers.',R.platform,R.codec)},
 'dread-ring':{title:'播放环形缓冲 / Playback ring buffer',...explain(
  '播放环形缓冲保存等待消费的 PCM。ALSA 用户态客户端持续填入可写区域，硬件逐步消费，双方位置用于计算剩余数据和可用空间。本图的用户态客户端是 HAL 后端；这个缓冲与 HAL 边界的临时 FMQ 分开。',
  'The playback ring holds PCM awaiting consumption. The ALSA userspace client fills writable regions while hardware consumes data; both positions track queued data and available space. The client here is the HAL backend. This buffer is separate from transient HAL FMQ transport.',R.pcm,R.alsa)},
 'dread-dma':{title:'DMA 引擎 / DMA engine',...explain(
  'DMA 是实际搬运数据的硬件：按驱动预先设置的地址与传输参数，从内存缓冲向音频控制器送样本。驱动把传输进展通知 ALSA，用于更新空间与唤醒供数方；这一步不测量扬声器的声学呈现。',
  'DMA is hardware moving samples from memory to the audio controller using addresses and parameters set by the driver. The driver reports progress to ALSA to update space and wake producers. This does not measure acoustic speaker presentation.',R.platform,R.alsa)},
 'dread-output':{title:'音频控制器与 Codec / Controller and Codec',...explain(
  '所示硬件输出段由音频控制器经 I²S 发送数字样本，Codec 播放路径的 DAC 转为模拟信号，再经功率放大驱动扬声器。本框合并连续的硬件功能；控制这些硬件的驱动属于上方软件职责。',
  'Here the controller sends digital samples over I²S, the codec playback DAC converts them to analog, and amplification drives the speaker. This groups successive hardware functions; their drivers are software roles shown above.',R.soc,R.codec,R.dapm)},
 'qread-asm-front':{title:'q6asm-dai',...explain(
  'q6asm-dai 是 Linux v6.12 的 ALSA 前端适配驱动，把 PCM 流操作接到 q6asm。播放准备阶段映射共享缓冲，写完成事件更新前端记录的缓冲位置，并通知 snd_pcm_period_elapsed；完成事件描述传输进展。',
  'q6asm-dai is the Linux v6.12 ALSA front-end driver connecting PCM operations to q6asm. Playback preparation maps shared buffers; write-completion events advance the front-end position and call snd_pcm_period_elapsed. These events describe transfer progress.',R.asmFront)},
 'qread-asm-client':{title:'q6asm',...explain(
  'q6asm 是运行在主处理器 Linux 内核中的 ASM 客户端，封装流管理、缓冲映射及读写请求，并分发 DSP 事件。所读写请求经 APR 携带缓冲地址、长度和映射句柄；PCM 字节保存在共享缓冲内。',
  'q6asm is the ASM client in the host Linux kernel. It packages stream management, buffer mapping and I/O requests and dispatches DSP events. The checked APR write request carries a buffer address, length and mapping handle; PCM bytes reside in shared memory.',R.asm)},
 'qread-asm-dsp':{title:'ASM 服务 / ASM service',...explain(
  'ASM 是主机 q6asm 所请求的 DSP 音频流管理服务。主机用流命令管理其状态，并提交引用共享缓冲的写请求；服务通过响应和完成事件反馈。这里依据主机协议解释可见职责，未把固件内部处理画成已知模块。',
  'ASM is the DSP audio stream service addressed by host q6asm. Host commands manage stream state and submit writes referencing shared buffers; replies and completion events return results. This describes roles visible in the host protocol, without inventing firmware internals.',R.asm)},
 'qread-asm-buffer':{title:'共享样本缓冲 / Shared sample buffer',...explain(
  '这块内存保存主机与 DSP 交换的音频样本。q6asm 建立映射，写请求用地址、长度与映射句柄指向相应区域；完成事件帮助主机推进缓冲使用。APR 命令中放的是缓冲引用，共享映射仍需遵守传输与同步约定。',
  'This memory stores samples exchanged by host and DSP. q6asm establishes mapping; write requests identify regions by address, length and mapping handle. Completion events advance host buffer use. APR commands carry references, and mapping still requires transfer/synchronization rules.',R.asm,R.asmFront)},
 'qread-routing':{title:'q6routing',...explain(
  'q6routing 是 Linux 的音频路由配置组件，记录流与后端端口的选择。建立所示路径时，它调用 q6adm 打开设备处理路径并提交会话到设备的矩阵映射。它配置样本应送往哪里，样本本身不经这个软件框逐块转发。',
  'q6routing tracks Linux audio stream/backend port selections. To establish this path it calls q6adm to open device processing paths and submit session-to-device matrix mappings. It configures destinations rather than forwarding PCM blocks through this software box.',R.routing,R.adm)},
 'qread-adm-client':{title:'q6adm',...explain(
  'q6adm 是主处理器内核中的 ADM 客户端，提供设备路径的打开、关闭和矩阵映射等操作，经 APR 把请求发往 DSP 并等待或处理结果。q6routing 调用它落实路由；主机客户端与 DSP 服务分别执行两侧职责。',
  'q6adm is the host kernel ADM client. It opens/closes device paths and configures matrix mappings, sending APR requests to the DSP and handling results. q6routing uses it to implement routing; the host client and DSP service have separate roles.',R.adm,R.routing)},
 'qread-adm-dsp':{title:'ADM 服务 / ADM service',...explain(
  'ADM 是所示 DSP 方案的设备管理服务，响应主机的设备路径与会话映射请求。打开设备处理路径和矩阵映射让流关联到选定端口；该虚线表示控制关系，共享缓冲样本不沿 q6routing → q6adm → ADM 逐块转发。',
  'ADM is the device-management service in this DSP arrangement. It handles host device-path and session-mapping requests, associating streams with selected ports. The dashed connection is control; shared-buffer samples are not forwarded through q6routing, q6adm and ADM as serial stages.',R.adm,R.routing)},
 'qread-apm-client':{title:'q6apm',...explain(
  'q6apm 是 Linux 的 AudioReach 客户端，管理处理图的打开、准备、启动与停止，并经 GPR 向管理服务及图端点发送相应请求。音频写请求引用共享缓冲，反馈由回调处理。这里的 APM 指 Audio Process Manager，与 Android AudioPolicyManager 分属不同职责。',
  'q6apm is the Linux AudioReach client. It opens, prepares, starts and stops processing graphs, sending GPR requests to management services and graph endpoints. Audio writes reference shared buffers and callbacks handle results. APM means Audio Process Manager here, distinct from Android AudioPolicyManager.',R.apm)},
 'qread-apm-dsp':{title:'APM / 图端点 / Graph endpoints',...explain(
  '本框合并两种 DSP 接收方：APM 服务管理处理图的结构与生命周期；相应共享内存端点接收图的音频读写请求。请求按目标服务或端口分发，并非全部由同一个模块处理。具体图中的模块与连接由拓扑及固件决定。',
  'This groups two DSP recipient roles. APM manages processing-graph structure/lifecycle; corresponding shared-memory endpoints handle graph audio I/O requests. Service/port targets route requests to different recipients. Topology and firmware determine the actual graph modules and connections.',R.apm)},
 'qread-apm-buffer':{title:'共享音频缓冲 / Shared audio buffer',...explain(
  '共享音频缓冲保存供 AudioReach 图端点访问的样本。所读 q6apm 写请求经 GPR 携带缓冲地址、有效长度及映射句柄，完成事件反馈缓冲处理结果。图中实线表达样本访问，虚线表达请求，两者共同完成一次协作。',
  'The shared audio buffer stores samples for AudioReach graph endpoints. The checked q6apm write request carries its address, valid length and mapping handle over GPR; completion events report handling. Solid sample-access and dashed request connections describe cooperating mechanisms.',R.apm)}
};

export const audioExplanationSources=[...new Set(
 [...Object.values(audioNodeExplanations),...Object.values(audioEdgeExplanations),...Object.values(audioLocalExplanations)].flatMap(item=>item.sources)
)];

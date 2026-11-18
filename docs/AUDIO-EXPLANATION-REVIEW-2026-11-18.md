# 音频图内解释与术语一致性审查

日期：2026-11-17 开始，2026-11-18 完成内容修订。范围：当前音频页的 21 个主图节点、32 条主图连线、16 个驱动/高通局部节点，以及当前 34 条术语的定义、问答与边界一致性。没有增加新播放路径或具体设备支持结论。

## 结论与修订原则

原先 AudioFlinger 弹层以“本例选择软件混音”和路径排除为主，缺少服务本身的工作。相同问题还见于 PCM、AudioTrack、HAL 后端等节点。多数连线按颜色或阶段套用同一段说明，无法回答“这条连接具体做什么”。

现在组件先说明身份、职责及协作，再解释所选场景；连线各自说明动作、载荷与读写/调用机制。必要的技术边界保留，但不能代替定义。原图布局和交互沿用，解释集中在 `site/audio-explanations.js`，与几何数据分开；不再有连线通用套话回退。

一次实点检查还确认：`policy-output` 的标签受共享音轨缓冲连线点击区遮挡，打开了 `buffer` 的解释。仅将该标签纵坐标从 230 调到 240，路径和端点不变；验收必须同时比对实际打开的锚点标识。

## 证据与版本边界

| 证据组 | 实际核对内容 | 本次读取与支持范围 |
| --- | --- | --- |
| [AudioTrack](https://developer.android.com/reference/android/media/AudioTrack) | 单条音轨、STREAM/STATIC、write 与播放控制、阻塞模式与返回值 | 已读 API 文档；不将 write 完成当作声音呈现 |
| [AudioTrack.cpp · AOSP main](https://android.googlesource.com/platform/frameworks/av/+/master/media/libaudioclient/AudioTrack.cpp) | `createTrack_l`、服务端音轨、共享控制块/缓冲、`AudioTrackClientProxy`、`write` / `releaseBuffer` | 已读关键片段；页面解析到 main，blob `dec8641d03c91c48b19f8d930f922aff71a243fe`。支持通用客户端机制，不冒充 Android 17 标签 |
| [AudioPolicyService.cpp · AOSP main](https://android.googlesource.com/platform/frameworks/av/+/master/services/audiopolicy/service/AudioPolicyService.cpp) 与 [AudioPolicyManager.cpp · AOSP main](https://android.googlesource.com/platform/frameworks/av/+/master/services/audiopolicy/managerdefault/AudioPolicyManager.cpp) | 服务内部建立策略管理器、策略客户端提交 patch 操作 | 已读关键片段；blob 分别为 `4c506e867c04f7734f3c9fa52bebc84801e47a53`、`8c24b3e31b136a37c1f481a6d750e3a4cea3229a`；不把概括箭头称为一次直接 IPC |
| [Audio terminology](https://source.android.com/docs/core/audio/terminology)、[Design for reduced latency](https://source.android.com/docs/core/audio/latency/design)、[AudioFlinger.cpp · AOSP main](https://android.googlesource.com/platform/frameworks/av/+/master/services/audioflinger/AudioFlinger.cpp)、[Threads.cpp · AOSP main](https://android.googlesource.com/platform/frameworks/av/+/master/services/audioflinger/Threads.cpp) | 混音、音量、重采样；普通/直出/offload 输出线程的选择；FastMixer 的内部组织 | 已读关键片段。当前 main 的 AF / Threads blob 为 `c67fa134158a6cd2585c6e81624543f564ad1426` / `0085b81c8aa60f7c0dcfb6282128182099257e9e`；未照抄术语页的历史 mediaserver 归属，也未把设计文档示例时序当性能保证 |
| [AIDL Audio HAL](https://source.android.com/docs/core/audio/aidl-implement)、[Fast Message Queue with AIDL](https://source.android.com/docs/core/architecture/aidl/fmq) | libaudiohal 适配职责、模块/流接口、共享队列描述符 | 已读官方说明；限定文中选定的 AIDL 非 MMAP PCM 场景 |
| [StreamDescriptor.aidl · main](https://android.googlesource.com/platform/hardware/interfaces/+/refs/heads/main/audio/aidl/android/hardware/audio/core/StreamDescriptor.aidl) | Command/Reply、`fmqByteCount`、位置字段、临时数据队列、取空与重送约定 | 本次 main 可读，blob `9b7fea24c00bfbf96900a85d2d9f75f6a38e7c1d`。仅作机制交叉核对，不替代正式标签记录 |
| [IModule.aidl · main](https://android.googlesource.com/platform/hardware/interfaces/+/refs/heads/main/audio/aidl/android/hardware/audio/core/IModule.aidl) | `openOutputStream` 返回接口与描述符、初始 STANDBY、端口配置与 patch 连接 | 已读定义；audio patch 术语引用此接口，替换旧 Android 30 类说明作为主要依据 |
| [ALSA PCM](https://www.alsa-project.org/alsa-doc/alsa-lib/pcm.html)、[Writing an ALSA Driver](https://docs.kernel.org/sound/kernel-api/writing-an-alsa-driver.html) | 帧与采样、环形缓冲双方位置、驱动回调、period 与 XRUN | 已读对应说明；区分内核缓冲消费与扬声器呈现，HAL 客户端与 Android 应用不是同一个概念 |
| [ASoC overview](https://docs.kernel.org/sound/soc/overview.html)、[Machine](https://docs.kernel.org/sound/soc/machine.html)、[Platform](https://docs.kernel.org/sound/soc/platform.html)、[Codec](https://docs.kernel.org/sound/soc/codec.html)、[DAPM](https://docs.kernel.org/sound/soc/dapm.html) | 组件绑定、DMA/DAI 软件职责、Codec 控制、路由图与供电 | 已读相关章节；配置路径与样本路径分开，硬件集成不等于软件框的一一对应 |
| tinyalsa [pcm.c](https://github.com/tinyalsa/tinyalsa/blob/master/src/pcm.c) / [mixer.c](https://github.com/tinyalsa/tinyalsa/blob/master/src/mixer.c) | `pcm_writei` / 非 mmap 传输、mixer 控制 ioctl | 通过上游 GitHub API 读取正文，blob 为 `e7e0672fc50871a756479ffe380fce62c9833543` / `baaab1b93cb3ffe23b13e23998db7899745b3f7e`；这是库的当前 master，不是 Android 17 出货实现 |
| Linux v6.12 `q6asm-dai.c`、`q6asm.c`、`q6routing.c`、`q6adm.c`、`q6apm.c`、`audioreach.c`、`apr.c`、`qcom,apr.yaml`、`soc-pcm.c` | 主机驱动/DSP 服务分工、流/路由控制、共享缓冲引用、GPR 分发、流活动交给 DAPM | 已读取上游正文并检查相关函数；下表映射到具体节点，不推断 Android BSP、芯片覆盖或固件内部拓扑 |

Android 17 的 `android-17.0.0_r1` 标签仍由[官方 build numbers](https://source.android.com/docs/setup/reference/build-numbers)确认，构建 `CP2A.260605.016`。本次若干 17 标签文件重读失败，不能解释为标签/文件不存在。HAL 三队列、`transfer`/`sendCommand` 与 `IModule` 的正式标签依据沿用 [2026-11-08 的文件级记录](AUDIO-SOURCE-VERIFICATION.md)，其中包含当时读取的三个 blob；本次没有把 main 改名成 17，也不宣称完成 Android 17 完整调用链复核。原生客户端/策略/AF 的解释引用现在明确显示 AOSP main。

## 主图节点：21 / 21

| ID | 审查后重点 | 主要依据 |
| --- | --- | --- |
| policy | 策略服务内部管理器、选择输出/路由与落实操作的分工 | APS / APM、AIDL Audio HAL |
| pcm | 采样、帧、声道与存储格式，先定义数据再限定已有样本 | ALSA PCM、AudioTrack |
| java | AudioTrack 类的职责、write 与 play/pause/stop、MODE_STREAM | AudioTrack API |
| native | 应用内 C++ 客户端、共享音轨缓冲与 Binder 控制 | AudioTrack.cpp、JNI tips |
| flinger | 服务组件、音轨/线程、普通混音处理、输出与策略分工 | Audio terminology、AF / Threads |
| adapter | 框架侧库把管理调用及流 I/O 接到 HAL | AIDL Audio HAL、StreamHalAidl |
| reply | 状态、消费量与位置字段分别表示什么 | StreamDescriptor |
| data | 临时 burst 字节队列、取空、消费量和未消费重送 | StreamDescriptor、StreamHalAidl |
| command | 命令/参数/工作线程，音频字节另走数据队列 | StreamDescriptor |
| stream | HAL 输出流对象、工作线程及后端协作 | IModule、StreamDescriptor |
| module | 模块入口、端口/patch/开流、返回对象 | IModule、AIDL Audio HAL |
| backend | 用户态库访问 PCM / 控件；所选后端不等于接口要求 | tinyalsa PCM / mixer |
| pcm-core | 内核管理参数/缓冲/状态与驱动回调 | ALSA 驱动文档 |
| card | Machine 绑定与 DAPM 路由供电两类职责 | Machine、DAPM |
| ring | 生产/消费位置；本图用户态客户端是 HAL 后端 | ALSA PCM、驱动文档 |
| dai-driver | 软件配置与硬件搬运分开，CPU DAI 的角色含义 | Platform、ALSA 驱动文档 |
| codec-driver | 控制寄存器、接口/音量/路由/电源，控制总线与 I²S 分开 | Codec |
| dma | DMA 硬件执行、预先配置与消费进展 | Platform、ALSA 驱动文档 |
| dai-hw | 数字接口输出及两端匹配，I²S 是所选实例 | Overview、Platform |
| codec-hw | Codec 硬件与 DAC 职责，保留解码器语境区别 | Codec、DAPM |
| speaker | 功率驱动与声学转换，功能和器件集成边界 | Machine、DAPM |

## 主图连线：32 / 32

| ID | 这条连接现在解释什么 | 主要依据 |
| --- | --- | --- |
| policy-output | 策略客户端提交输出/patch 操作，概括内部转发 | APM / AF |
| hal-operations | AF 经适配层做模块/输出管理，与 PCM 写入分开 | AIDL Audio HAL、IModule、AF |
| write | 按格式提交 PCM，接受量和阻塞方式 | AudioTrack API |
| jni | 同应用进程的语言接口调用 | JNI tips、AudioTrack.cpp |
| buffer | 客户端写共享帧、服务端读取、缓冲协调 | AudioTrack.cpp |
| track-control | 创建服务端音轨与 start/pause/stop 请求 | AudioTrack.cpp |
| mix | 活动音轨到混音输出，按配置处理后交 HAL | 延迟设计、音频术语 |
| to-data | 框架先放本批字节，再请求 burst | StreamHalAidl、StreamDescriptor |
| from-data | HAL 取空队列、实际消费可能较少 | StreamDescriptor |
| to-command | 写命令/字节数，standby 时先 start | StreamHalAidl、StreamDescriptor |
| from-command | 工作线程按状态处理命令并配合数据队列 | StreamDescriptor |
| to-reply | HAL 写状态、消费量、位置 | StreamDescriptor |
| from-reply | 框架检查结果、更新消费量和后续重送 | StreamHalAidl、StreamDescriptor |
| open | Binder 管理调用的参数与端口/patch | IModule |
| open-result | 流接口与传输描述符的返回 | IModule、StreamDescriptor |
| create | 创建输出流与初始 STANDBY | IModule、StreamDescriptor |
| backend | 流提交样本给选定设备后端 | tinyalsa PCM、AIDL Audio HAL |
| pcm-submit | `pcm_writei` 非 mmap 交错帧提交 | tinyalsa PCM |
| buffer-fill | 非 mmap 写入可用环形区域并推进 appl_ptr | ALSA PCM、驱动文档 |
| pcm-ops | hw_params/prepare/trigger/pointer 生命周期回调 | ALSA 驱动文档、Platform |
| card-dai | DAI link、板级绑定与接口配置 | Machine、Platform |
| card-codec | DAPM 控件/路由决定需要工作的部件 | DAPM、Codec |
| dma-config | 地址、缓冲及周期准备与启停 | Platform、ALSA 驱动文档 |
| dai-config | CPU DAI 配置格式和时钟角色 | Platform、Machine |
| codec-config | I²C/SPI 寄存器控制，与 PCM 数据总线分开 | Codec |
| dma-fetch | DMA 硬件从内存取待消费样本 | Platform、ALSA 驱动文档 |
| period | 驱动通知 → pointer 查询 → 空间/唤醒，非声学完成 | ALSA 驱动文档 |
| dma-out | DMA 给控制器供数，内存搬运与串行输出分工 | Platform、ALSA 驱动文档 |
| i2s | 控制器按格式/时钟发送数字样本给 Codec | Overview、Codec |
| analog | DAC 模拟输出、功率放大和扬声器转换 | Codec、DAPM、Machine |
| stream-power | ASoC 生命周期事件交给 DAPM | soc-pcm.c v6.12、DAPM |
| mixer-config | 控制 ioctl 设置 mixer/mux，触发关联电源评估 | tinyalsa mixer、DAPM |

## 局部节点：16 / 16

| ID | 复核的定义或边界 | 主要依据 |
| --- | --- | --- |
| dread-alsa | PCM 管理、非 mmap 写入及欠载 | ALSA PCM、驱动文档 |
| dread-asoc | Machine 与 DAPM 管理职责合并 | Overview、Machine、DAPM |
| dread-drivers | DMA / CPU DAI / Codec 配置职责合并 | Platform、Codec |
| dread-ring | 客户端/硬件位置、HAL 后端与 FMQ 区别 | ALSA PCM、驱动文档 |
| dread-dma | 驱动配置、DMA 实际执行、进展反馈 | Platform、驱动文档 |
| dread-output | 数字接口、DAC、放大和输出功能 | Overview、Codec、DAPM |
| qread-asm-front | 前端映射缓冲、WRITE_DONE 更新 pcm_irq_pos 并通知 period | q6asm-dai.c v6.12 |
| qread-asm-client | 主机内核客户端、APR 请求及缓冲引用 | q6asm.c v6.12 |
| qread-asm-dsp | ASM 服务与主机客户端分开，仅根据可见协议解释 | q6asm.c v6.12 |
| qread-asm-buffer | 样本在共享内存、映射与请求引用 | q6asm.c / q6asm-dai.c v6.12 |
| qread-routing | `q6adm_open` 与 `q6adm_matrix_map`，不是样本转发 | q6routing.c / q6adm.c v6.12 |
| qread-adm-client | ADM 主机客户端及请求/结果 | q6adm.c v6.12 |
| qread-adm-dsp | DSP 设备路径与会话映射服务 | q6adm.c / q6routing.c v6.12 |
| qread-apm-client | 图生命周期与图端点写入；APM 原名按源码 Audio Process Manager | q6apm.c v6.12 |
| qread-apm-dsp | 管理服务与共享内存端点是不同接收角色 | q6apm.c v6.12 |
| qread-apm-buffer | GPR 地址、长度、映射句柄引用共享样本 | q6apm.c v6.12 |

## 术语：34 / 34 的一致性检查

此次是解释内容一致性复核，结合[音频术语来源](GLOSSARY-AUDIO-SOURCES.md)、[平台术语来源](GLOSSARY-PLATFORM-SOURCES.md)和[驱动核验](AUDIO-DRIVER-VERIFICATION.md)已有依据；不把“读过当前条目”称为本次重新读取了每条术语全部历史外链。

| 条目 | 结果 |
| --- | --- |
| ALSA、ASoC、DMA、DAI、DAPM、DAC、Codec、I²S、DSP | 逐条比对后保留定义：内核/用户态、软件/硬件、配置/样本和转换边界已区分；主图与局部图改用相同表述 |
| FMQ | 修订短定义，明确“三队列”用于本页 AIDL **非 MMAP** 场景；临时队列/重送问答保留 |
| AOSP、HAL、AIDL、HIDL、Binder、IPC、JNI、ART | 保留身份与职责定义；不把层级、进程、语言边界画等号；HIDL 的弃用与设备移除继续分开 |
| PCM、AudioTrack | 保留定义及 STREAM/STATIC、write/控制、设备能力边界；与新节点解释一致 |
| AudioFlinger | 修订定义、易混点与第三问；补音轨/线程、音量/重采样/混音职责，明确 FastMixer/direct/offload 不是必经串行步骤，绕过普通混音不等于绕过整个 AF；新增 AF / Threads 的 main 源码依据 |
| AAOS | 保留车机原生系统与 Android Auto 的区别 |
| ALSA period、tinyalsa、mmap | 保留帧数通知、用户态库、Linux 映射与 Android MMAP 路径的不同语境；AAudio 官方说明支持 Android 8.0/8.1 与独占/共享区别 |
| q6asm、q6routing、q6apm、ADM、AudioReach、GPR、APR | 保留所核对的 v6.12 主机/DSP、路由/缓冲引用/协议职责，和新局部解释一致；不推广 BSP 或固件实现 |
| AudioPatch | 修订为关联端口配置；主要依据从 Android 30 framework 类说明改为当前 AIDL IModule 的端口/patch 管理，公开 SDK 与 HAL 接口继续分开 |
| underrun | 保留常见 XRUN 停止模式、恢复和 period 区别，不把任意反馈当欠载 |

## 验证记录

内容修改、结构自动检查与浏览器呈现分别记录。结构脚本不验证技术陈述本身，准确性结论以上述逐项资料比对为限。

- `node tests/audio-explanation-content-check.mjs`：主图几何入口、全部局部入口与 69 份解释一一对应，双语与参考资料集合检查通过；连线无重复通用文本。
- `node tests/term-content-check.mjs`：34 条术语的双语字段、问答、来源与关系图结构通过。
- JavaScript 语法、静态模块版本和现有 Python 检查脚本语法检查通过。Python 浏览器脚本本轮未执行，实际浏览器检查经 CUA 完成。
- 浏览器逐项实点：69 个入口 × 中英两种语言，共 138 项，实际打开的锚点、正文和来源 URL 与相应记录精确比对通过（节点与连线同名 `backend` 分别比对）。本地结果：`/private/tmp/atlas-explanation-browser-20261118.json`。
- 768 / 390px、900px 高视口 × 中英 × 主图节点/两类连线/驱动节点/高通节点，共 20 项：没有卡片越界或整页横向溢出，关闭按钮可见。默认 609×1033 视口已恢复，修订后的 AF 说明及三项来源完整可见。
- 390×600 下长解释出现内部溢出区域，关闭按钮仍可见；本轮工具未得到原生滚动输入的可确认结果，不能把“已声明 overflow:auto”记作真实触屏滚动通过。未更改已有滚动交互。
- 全屏内组件说明 → 短术语 → 完整词条 → 返回组件说明正常；Esc 先关组件、再退出全屏并回焦放大按钮。AudioFlinger、AudioPatch、FMQ 三条修订词条的短释义、完整解释与来源已在网页读取并比对。
- 减少动态效果模式下无主图流动光点、动画按钮禁用，环形缓冲说明可读。一次重载只出现空白页面壳，未捕获异常；随后重载恢复，静态检查及最终预览通过。该现象未证明与本次内容变更存在因果关系，不能记作已定位/修复的代码问题。
- 最终控制台错误记录为空。截图：本地可视化目录 `audio-explanations-reviewed-20261118.jpg`。截图及临时结果不纳入源码提交。

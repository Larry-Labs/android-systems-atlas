# 首批来源与结论对应表

核验：2026-11-08。此表记录本批实际读取的来源与支持范围；网页更新时间不等于适用 Android 版本。所有文案、图示重新编写绘制。来源不是“整篇背书”，具体结论应引用对应编号。

| ID | 官方来源 | 本批支持的结论 | 限制 |
|---|---|---|---|
| B01 | [Android 17 is here — Google 官方镜像](https://developer.android.google.cn/blog/posts/android-17-is-here?hl=en) | Android17 于2026-06-16正式发布 | 不代表所有OEM设备升级 |
| B02 | [Codenames, tags, and build numbers](https://source.android.com/docs/setup/reference/build-numbers) | API37；r1与构建、补丁日期映射 | 正式大版本、QPR、安全标签分开 |
| B03 | [Android17 r1 manifest](https://android.googlesource.com/platform/manifest/+/refs/tags/android-17.0.0_r1/default.xml) | 固定源码修订为该tag | manifest已读不等于各文件已读 |
| F01 | [Architecture overview](https://source.android.com/docs/core/architecture) | 应用、Framework、服务、HAL、内核的职责 | 教学分组不等于进程或严格调用顺序 |
| F02 | [Binder overview](https://source.android.com/docs/core/architecture/ipc/binder-overview) | 客户端/服务端跨进程调用 | 不能推断所有数据用Binder搬运 |
| F03 | [AIDL overview](https://source.android.com/docs/core/architecture/aidl) | 接口描述、生成绑定、Stable AIDL | AIDL不是进程名 |
| F04 | [JNI tips](https://developer.android.com/ndk/guides/jni-tips) | 托管代码与C/C++的接口 | JNI本身不是IPC |
| F05 | [ART](https://source.android.com/docs/core/runtime) | 执行DEX的运行时 | 不是每个请求必经的独立服务 |
| A01 | [AudioTrack API](https://developer.android.com/reference/android/media/AudioTrack) | MODE_STREAM、write/play与缓冲语义 | API能力不保证采用普通混音路径 |
| A02 | [Audio HAL implementation](https://source.android.com/docs/core/audio/implement) | Android14起AIDL方向；14+新增HAL API仅进入AIDL | 不证明所有升级设备立即移除HIDL |
| A03 | [AIDL Audio HAL](https://source.android.com/docs/core/audio/aidl-implement) | IModule、单向IStreamOut/In、APM配置来源 | 默认实现仅参考；开发接口与冻结API不同 |
| A04 | [Audio overview](https://source.android.com/docs/core/audio) | Java/JNI/native与HAL/驱动职责；驱动实现非单一固定方案 | 仍有mediaserver、旧路径与.hal描述，不作为当前进程拓扑证据 |
| D01 | [Car audio configuration](https://source.android.com/docs/automotive/audio/audio-policy-configuration) | 音区、音量组、路由策略与启用条件；Android14 CAP扩展 | 不把示例XML当全部版本统一读取链 |
| D02 | [Multi-zone audio routing](https://source.android.com/docs/automotive/audio/audio-multizone-routing) | AAOS多音区及乘员区域关系 | 多音区须产品配置支持，不代表所有AAOS设备 |

## 补充来源与源码证据状态

| ID | 来源 | 支持范围与状态 |
|---|---|---|
| A05 | [Design for reduced latency](https://source.android.com/docs/core/audio/latency/design) | 已读；normal/fast mixer的职责与条件。页面描述持续演进的初始设计，不拿其中示例时延当设备实测。 |
| A06 | [AIDL and HIDL Audio HAL comparison](https://source.android.com/docs/core/audio/aidl-hidl-comp) | 已读；迁移边界、接口映射、HAL内部可继续使用XML。 |
| D03 | [Audio control HAL](https://source.android.com/docs/automotive/audio/audio-control-hal) | 已读；车辆控制职责，区分Core Audio HAL。 |
| S01 | [Android16 r1 StreamDescriptor.aidl](https://android.googlesource.com/platform/hardware/interfaces/+/refs/tags/android-16.0.0_r1/audio/aidl/android/hardware/audio/core/StreamDescriptor.aidl) | 独立调研通过目录导航读取关键声明，报告blob `9b7fea24c00bfbf96900a85d2d9f75f6a38e7c1d`；主审复读访问失败，暂列待复核。不是Android17实现证据。 |
| S02 | [Android16 r1 StreamHalAidl.cpp](https://android.googlesource.com/platform/frameworks/av/+/refs/tags/android-16.0.0_r1/media/libaudiohal/impl/StreamHalAidl.cpp) | 独立调研读取transfer/sendCommand关键片段，报告blob `89dbee3fb25fb89bdde5234426693a3cbc0af43d`；主审复读访问失败，暂列待复核。不是设备实测。 |

## 失败读取与未完成事项

Android17下部分实现文件网页读取失败，本地Gitiles下载超时；没有把搜索摘要、旧版本或main分支冒充成已核实的17实现。具体函数、线程、进程启动与完整PCM共享缓冲实现仍需固定标签证据。不存在“没有读到，所以已移除”的结论。

后续来源登记至少包含：URL、适用版本/标签、核验日期、支持的结论、对应图节点/连线、读取状态。后续高通材料还须注明产品、OS、分支与公开范围。

## 后续补核：Android17固定标签（已读取关键片段）

- S03：Android17 `StreamDescriptor.aidl`，command/reply/audio.fmq定义。
- S04：Android17 `StreamHalAidl.cpp`，transfer/sendCommand关键顺序。
- S05：Android17 `IModule.aidl`，openOutputStream返回对象。
- F06：[AIDL FMQ](https://source.android.com/docs/core/architecture/aidl/fmq)，共享内存队列机制；用于FMQ术语卡。

精确URL、blob、读取方法、网页映射和未验证范围见 [AUDIO-SOURCE-VERIFICATION.md](AUDIO-SOURCE-VERIFICATION.md)。S01/S02保留为历史16版调研记录，网页HAL图改用S03–S05，不再依赖未完成主审的16版候选证据。

## 驱动与高通公开机制补充

本轮K01–K09与Q01–Q03的逐项来源、实际核验范围和限制见 [音频驱动核验](AUDIO-DRIVER-VERIFICATION.md)。高通材料是Linux v6.12上游证据，不代表Android17或特定手机BSP。

AudioTrack释义补核（2026-11-08）：英文原站本轮超时，实际读取Google官方镜像 https://developer.android.google.cn/reference/android/media/AudioTrack 的类说明、MODE_STREAM/MODE_STATIC、play、缓冲及压缩格式相关API说明。本站中英文字为重新概括，不是官方引文；不将类说明中简化的阻塞write描述推广到所有write重载。

## 全量术语来源

22项术语已按两层呈现重写，具体来源与限制分别见 [音频术语](GLOSSARY-AUDIO-SOURCES.md)、[平台术语](GLOSSARY-PLATFORM-SOURCES.md)。主审复读DMAengine、DAI、AIDL FMQ及HIDL/HAL专页；HIDL两处官方年份表述差异已在条目范围中保留，不自行编造统一移除日期。技术来源与页面布局验证分别记录。

## 2026-11-09：源码组件名与播放反馈

新增8项，术语总数30：q6asm、q6routing、q6apm、ADM、AudioReach、GPR、tinyalsa、ALSA period。组件源码依据Linux v6.12固定标签，驱动机制依据Linux文档，用户态库依据TinyALSA项目。详细事实映射和限制见[GLOSSARY-QUALCOMM-SOURCES.md](GLOSSARY-QUALCOMM-SOURCES.md)与[GLOSSARY-DRIVER-SOURCES.md](GLOSSARY-DRIVER-SOURCES.md)。不能从Android版本或高通品牌推断某款设备采用哪套DSP实现。

## 2026-11-09：audio整体复核

[AUDIO-REVIEW-2026-11-09.md](AUDIO-REVIEW-2026-11-09.md)记录策略到AudioFlinger的控制关系、共享音轨缓冲、开流与patch区别、ALSA非mmap写入、DAPM流活动及period通知模式的复核依据。Google固定标签与Linux/TinyALSA证据分别限定适用范围。

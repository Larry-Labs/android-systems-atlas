# Audio图文复核 — 2026-11-09

范围：当前普通AudioTrack MODE_STREAM、软件混音、AIDL非MMAP示范的连续图、节点/连线说明、音频正文及关联术语。不是完整Android音频功能、全部调用链或设备验收。

## 确认的问题与修订

| 问题 | 修订 | 依据 |
| --- | --- | --- |
| 应用→服务端的数据缓冲仅标“缓冲PCM”，难以区别三种缓冲 | 明确共享音轨缓冲：客户端写、服务端读；区别于HAL FMQ及ALSA播放缓冲 | Android17固定标签AudioTrack.cpp的createTrack_l/write |
| IModule→输出流标“创建/返回”，返回动作方向错误 | 改为创建输出流，返回接口/描述符只保留在IModule→框架的返回边 | IModule.openOutputStream返回定义 |
| 开流易被理解成已经连接输出设备 | IModule解释补端口配置与audio patch；策略/路由职责纳入图文 | AOSP AIDL Audio HAL、IModule端口/patch接口 |
| HAL→ALSA→缓冲画法未限定访问模式 | 下半图明确采用ALSA非mmap写入；AIDL非MMAP与ALSA mmap分别解释 | TinyALSA v2.0.0 pcm_generic_transfer区分mmap与writei分支 |
| DAPM只有路由输入，漏了流活动影响 | 补充PCM流活动→ASoC/DAPM电源协调关系，不表示PCM经过DAPM | Linux v6.12 __soc_pcm_prepare发送DAPM流事件 |
| period通知定义写成无条件发生 | 限定常见周期通知模式，说明不包含no_period_wakeup配置 | Linux v6.12 pcm_dmaengine.c条件设置DMA_PREP_INTERRUPT |
| 英文反馈边丢失driver、英文标题仍暗示分步播放 | 对齐中英文，改成数据方向示意 | 当前交互设计与图文一致性 |
| 基线文档仍称双视图/手动播放 | 更新为连续图、筛选、默认动画及暂停/继续 | 当前实现与已确认设计 |

## 来源

- [AOSP AIDL Audio HAL](https://source.android.com/docs/core/audio/aidl-implement)
- [IModule · android-17.0.0_r1](https://android.googlesource.com/platform/hardware/interfaces/+/refs/tags/android-17.0.0_r1/audio/aidl/android/hardware/audio/core/IModule.aidl)
- [AudioTrack.cpp · android-17.0.0_r1](https://android.googlesource.com/platform/frameworks/av/+/refs/tags/android-17.0.0_r1/media/libaudioclient/AudioTrack.cpp)
- [StreamHalAidl.cpp · android-17.0.0_r1](https://android.googlesource.com/platform/frameworks/av/+/refs/tags/android-17.0.0_r1/media/libaudiohal/impl/StreamHalAidl.cpp)
- [TinyALSA pcm.c · v2.0.0](https://github.com/tinyalsa/tinyalsa/blob/v2.0.0/src/pcm.c)
- [ASoC soc-pcm.c · v6.12](https://github.com/torvalds/linux/blob/v6.12/sound/soc/soc-pcm.c)
- [pcm_dmaengine.c · v6.12](https://github.com/torvalds/linux/blob/v6.12/sound/core/pcm_dmaengine.c)

上层审查通过目录逐级导航读取固定标签代码；主审直接打开两个完整Gitiles URL失败，未把失败当不存在，以审查中已取得的函数片段及可访问官方资料交叉核对。下层主审重新读取上述TinyALSA和Linux文件，定位传输分支、DAPM事件与no_period_wakeup条件。

## 保留的结论与限制

FMQ三队列、AudioTrack与驱动的区别、消费量不等于声音呈现、AIDL/HIDL迁移范围、AAOS多区域依赖配置及AudioControl不承载普通PCM等表述可保留。高通q6asm/q6routing/q6apm说明仍以Linux v6.12上游实现为界，不推断实际出货BSP。

主图仍不覆盖录音、蓝牙、通话、offload、直通、完整AudioPolicy状态机和全部异步回调；跨越若干适配函数的关系必须标成概览，不冒充逐函数时序。源码核验和页面测试均不是硬件测量。

## 策略控制关系的补核

固定android-17.0.0_r1：AudioPolicyManager::installPatch调用mpClientInterface->createAudioPatch；AudioPolicyClientImpl转发到AudioPolicyService::clientCreateAudioPatch，CREATE_AUDIO_PATCH命令调用AudioFlinger::createAudioPatch。开输出同样由策略客户端调用AudioFlinger::openOutput。图仅概括职责，将内部转发/命令线程折叠，不画成一次直接IPC。

- [AudioPolicyManager.cpp](https://android.googlesource.com/platform/frameworks/av/+/refs/tags/android-17.0.0_r1/services/audiopolicy/managerdefault/AudioPolicyManager.cpp)
- [AudioPolicyClientImpl.cpp](https://android.googlesource.com/platform/frameworks/av/+/refs/tags/android-17.0.0_r1/services/audiopolicy/service/AudioPolicyClientImpl.cpp)
- [AudioPolicyService.cpp](https://android.googlesource.com/platform/frameworks/av/+/refs/tags/android-17.0.0_r1/services/audiopolicy/service/AudioPolicyService.cpp)
- [AudioFlinger.cpp](https://android.googlesource.com/platform/frameworks/av/+/refs/tags/android-17.0.0_r1/services/audioflinger/AudioFlinger.cpp)

主图新增策略→AudioFlinger、AudioFlinger→HAL适配控制关系，以及PCM流活动→DAPM关系；现为21节点、32条边。HAL侧的开流/端口/patch关系仍是概览，不是严格调用时序。中英文静态SVG已从当前网页重新导出，移除动画，避免文档继续展示旧分层。

## 完成验证

悬停意图延时约350ms，实测355.3ms；五种取消路径及点击/键盘即时打开通过。六组双语桌面/手机布局及全屏回归、21节点/32条边几何检查、30项词条结构、原有85项浏览器断言通过。上/下半图截图目视检查，两份文档SVG已同步并通过XML解析。浏览器会话与首次悬停测试的问题及重试依据保留在IMPLEMENTATION-PLAN.md本轮记录中。

## 后续复核修复（2026-11-09）

本轮修复范围仅限用户确认的五项：

1. FMQ 主图节点与词条补充：audio.fmq 是单次 burst 的临时传输队列；HAL 取出全部队列数据，实际消费量通过 reply.fmqByteCount 报告，客户端重送未消费部分。没有把“读队列”与“消费数据”混为一谈。
2. 高通上泳道增加 q6routing → q6adm → ADM 独立控制支线；不连接到样本实线，不把两套方案串联。
3. 新增 audio patch、APR、underrun 三项双语完整词条；16 个局部图节点支持点击、Enter/Space读取本图职责，说明内保留术语悬浮入口。合并节点采用上下文解释，避免将 DSP 服务与主机客户端混成同一词条。
4. period 算式显式显示帧、帧/秒、秒和毫秒；原时长结果无误，本轮修的是量纲表达。
5. 删除页面中返回404的 sound/designs/pcm_interface.html 来源，改为 Linux Writing an ALSA Driver（缓冲/period/pointer相关内容）。

### 本轮依据和边界

- [StreamDescriptor.aidl · main](https://android.googlesource.com/platform/hardware/interfaces/+/refs/heads/main/audio/aidl/android/hardware/audio/core/StreamDescriptor.aidl)：2026-11-09读取，页面blob为9b7fea24c00bfbf96900a85d2d9f75f6a38e7c1d。AudioBuffer.fmq注释描述临时性、清空与重送；Reply.fmqByteCount区分实际消费量。main会变化，不能冒充Android17固定标签验证；本次补充对应节点/词条来源已使用实际核验的main并标明日期。
- [Linux v6.12 q6routing.c](https://github.com/torvalds/linux/blob/v6.12/sound/soc/qcom/qdsp6/q6routing.c)：q6routing_stream_open调用q6adm_open/q6adm_matrix_map；[q6adm.c](https://github.com/torvalds/linux/blob/v6.12/sound/soc/qcom/qdsp6/q6adm.c)区分客户端与DSP服务。
- [Writing an ALSA Driver](https://docs.kernel.org/sound/kernel-api/writing-an-alsa-driver.html)：实际读取正文且HTTP200；该文以PCI驱动讲解通用ALSA接口，并非本例SoC电路证明。ASoC overview/platform/codec及新增q6adm来源也均实测HTTP200。
- 新词条来源见glossary-audio-extra.js：AudioPatch用AOSP Android30源码解释稳定连接概念，明确隐藏API；APR用Linux v6.12绑定/协议客户端；underrun用ALSA官方PCM状态说明，限定常见XRUN停止模式。

没有编译Android/内核，没有验证具体高通产品或固件；其他Android17固定标签的本轮访问限制仍保留，不将主干核验扩写为全部固定版本复核。

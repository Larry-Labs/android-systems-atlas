# 音频专题内容审查（2026-11-17）

## 结论

当前页面的整体教学结构可以作为后续领域页的基础：先用一张跨层关系图建立联系，再拆分数据、控制和返回关系，随后展开驱动细节、版本差异、设备形态差异和来源。图中节点、连线、术语入口和双语交互已经通过现有回归检查。

下面记录修正前发现的四项问题。本轮修正及来源整理已完成，实际范围与验证见文末收尾记录。

## 审查时发现的问题

### 1. 版本区间没有对齐项目基线

当前版本区只显示“Android 13 → Android 14+”。项目基线已经记录为 Android 17（`android-17.0.0_r1`），因此后续读者会看不出 Android 15、16、17 与前面两段的关系。

建议改为：Android 13 作为 Audio HAL 7.1 历史基线；Android 14–15 说明 Stable AIDL 作为新能力入口及 HIDL 兼容残留；Android 16 补充 AIDL Audio HAL 对 Configurable Audio Policy（CAP）的支持变化；Android 17 标出当前源码核对基线。

不要把“Android 14 以后使用 AIDL”写成“所有 Android 14 及以后设备都已经没有 HIDL”。AOSP 官方明确说明，框架仍支持厂商在 vendor 分区提供 HIDL 或 AIDL 实现；Android 14 及以后新增的 HAL API 只加入 AIDL。

依据：[AOSP Audio HAL](https://source.android.com/docs/core/audio/implement)、[AIDL 与 HIDL Audio HAL 对照](https://source.android.com/docs/core/audio/aidl-hidl-comp)、[Android 16 CAP](https://source.android.com/docs/core/audio/aidl-cap)。

### 2. AudioPolicyManager 不能单独作为“系统音频组件”呈现

主图目前把 `AudioPolicyManager` 作为节点，并直接画出它向 AudioFlinger 发请求。对初学者来说，这容易把 `AudioPolicyManager`（策略实现/管理对象）理解成独立进程或 Binder 服务。

建议节点写成 `AudioPolicyService`，副标题写成“内部包含 AudioPolicyManager · 输出与路由决策”。图中再标注它与 AudioFlinger 位于 `audioserver` 的服务侧关系；如果为了简化不画完整进程边界，应在节点说明中明确省略了服务内部对象和线程。

AOSP Android 17 的 `main_audioserver.cpp` 同时创建并注册 AudioFlinger 和 AudioPolicyService；这支持将两者作为服务侧组件呈现，而不是把 AudioPolicyManager 单独当作进程。

依据：[AOSP android17-release audioserver 初始化源码](https://android.googlesource.com/platform/frameworks/av/+/android17-release/media/audioserver/main_audioserver.cpp)、[AOSP Audio terminology](https://source.android.com/docs/core/audio/terminology)。

### 3. 驱动图需要进一步强调“这是一个板载直连示例”

当前驱动图已经写了“本例”和“不代表所有 Android 或高通设备”，边界方向是对的。但图上的“直接 DMA”“I²S → 模拟信号 → 输出”仍然容易被读成通用 Android 音频链路。

建议统一改成：标题为“板载 PCM 播放示例：ALSA / ASoC / DMA / I²S”；“直接 DMA”改成“DMA 搬运示例”；“音频控制器 → Codec”下方明确“本例：I²S → Codec/DAC → 模拟输出”；并在图旁说明 USB、SoundWire、DSP/PCM 路径、蓝牙和数字功放需要分别建图。

Linux ALSA 文档支持 period 通知、硬件位置、DMA 缓冲等通用机制，但不能从这些机制推导出所有设备都采用同一物理接口。

依据：[Linux ALSA driver API](https://docs.kernel.org/sound/kernel-api/writing-an-alsa-driver.html)、[Linux ASoC overview](https://docs.kernel.org/sound/soc/overview.html)、[Linux DAPM](https://docs.kernel.org/sound/soc/dapm.html)。

### 4. 音频 FMQ 的源码链接没有固定到 Android 17

`audio.fmq / DataMQ` 节点当前链接到 AOSP `refs/heads/main` 的 `StreamDescriptor.aidl`，而页面其他核心源码大多已经固定到 `android-17.0.0_r1`。这会导致同一张图的依据随主分支变化。

建议改为 Android 17 固定标签，并在后续页面统一执行：所有作为版本证据的 AOSP 源码链接必须带明确 tag；只有明确标注“当前主线参考”的链接才允许使用 `main`。

## 可以保留的内容

- 普通 `AudioTrack MODE_STREAM`、软件混音、AIDL/非 MMAP 作为入门场景，范围选择合理。
- 将应用共享音轨缓冲、HAL 侧 FMQ、ALSA 播放环形缓冲分开，避免把所有共享内存画成同一个通道。
- period 只解释为缓冲进度通知粒度，不把它等同于端到端延迟或扬声器已经播放完成。
- q6asm、q6routing、q6adm、q6apm 分成两套独立高通上游模型，并标注 Linux v6.12，不把两套图画成串行链路。
- 术语采用“正文短释义 → 悬浮解释 → 完整词条、关系图和来源”的三级呈现。
- 数据路径有动画，控制和返回路径静态；动画只表达方向，不表达真实时序、速度和性能。

## 后续领域页应沿用的模板

1. 先明确本页选择的场景和排除的路径。
2. 先画职责、进程和通信边界，再画具体数据流。
3. 首次出现的类、服务、库、接口、协议、缓冲和硬件都登记术语。
4. 版本差异至少写清“从哪个版本开始、变化是什么、旧实现是否仍可存在、替代接口是什么”。
5. 设备形态差异与厂商实现差异分开写，不能用高通示例代替手机、车载等形态比较。
6. 每一张图的源码和官方资料链接固定版本；未做设备实测的内容不写成设备已验证行为。

## 当前验证

- `tests/audio-reading-smoke.py`：通过。
- `tests/audio-review-fixes-smoke.py`：通过。
- `tests/term-detail-smoke.py`：通过。
- `node tests/term-content-check.mjs`：通过，34 条双语术语记录、来源和关系图结构通过。
- 未做真实 Android 设备、DSP 固件或具体高通出货 BSP 验证。
- 本文是内容审查及修正记录。后续领域复用教学组织与交互规范，其技术事实独立核验。


## 修正状态（2026-11-17）

- [x] 版本区扩展到 Android 13、14–15、16、17，并加入 CAP 与 Android 17 基线说明。
- [x] 主图节点改为 AudioPolicyService，并在说明中解释 AudioPolicyManager 的内部职责。
- [x] 驱动图改为板载 PCM 示例，统一使用“DMA 搬运”和“Codec/DAC”表述。
- [x] audio.fmq / DataMQ 依据固定到 android-17.0.0_r1。
- [x] 四段版本卡片增加桌面四列与小屏两列布局。

## 本轮收尾记录

- 当前完成范围：普通AudioTrack MODE_STREAM、软件混音、AIDL非MMAP播放；选定的ALSA/ASoC板载DMA/I²S驱动示例；独立的Linux v6.12高通DSP机制对照；版本、设备形态差异与术语入口。
- 音频页尾集中列出正文、主图及局部图解释所用的28项来源；与从页面实际采集的引用集合完全对应。完整术语的延伸资料继续在各词条内列出。
- FMQ完整词条的StreamDescriptor.aidl链接与主图同步为android-17.0.0_r1，复用已记录的S03来源证据。本轮网页工具直接读取标签文件未成功；未把此结果解释为文件不存在，也未宣称本轮重新读取或审计了该文件。
- 来源覆盖四种语言/宽度组合、音频六组布局、136次术语完整解释渲染、34条术语结构、JavaScript语法与资源哈希检查通过。此前记录的图与术语交互验证仍按其实际范围引用。
- 录音、蓝牙、通话、direct/offload、AAudio MMAP以及具体产品BSP和设备测试仍为后续独立工作，本次不计入完成项。
- 后续领域沿用本页的图解组织、边界表达、术语与引用规则，不能直接复制音频的组件、版本结论或物理链路。

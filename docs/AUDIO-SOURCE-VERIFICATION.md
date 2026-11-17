# Android 17 音频 HAL 关键源码复核

核验日期：2026-11-08。通过 Gitiles 固定标签目录逐级导航读取源码正文；独立调研与主代理均读取关键定义/函数片段，blob 一致。未下载整个仓库、未逐行审计全部文件、未编译、未实测设备。

## 精确来源

| ID | 文件 | 已核对 blob（文件对象，非提交ID） |
|---|---|---|
| S03 | [StreamDescriptor.aidl](https://android.googlesource.com/platform/hardware/interfaces/+/refs/tags/android-17.0.0_r1/audio/aidl/android/hardware/audio/core/StreamDescriptor.aidl) | `d1aa0741aee0f64fca85e9704af8e1e07cae7911` |
| S04 | [StreamHalAidl.cpp](https://android.googlesource.com/platform/frameworks/av/+/refs/tags/android-17.0.0_r1/media/libaudiohal/impl/StreamHalAidl.cpp) | `ddab2bd4482167cf2a50275fa8ac7b2170e4af25` |
| S05 | [IModule.aidl](https://android.googlesource.com/platform/hardware/interfaces/+/refs/tags/android-17.0.0_r1/audio/aidl/android/hardware/audio/core/IModule.aidl) | `ca7af88853b7550fe1febb5db1de9f5794b70c6b` |

全部来源均为 `android-17.0.0_r1`，没有将Android16证据改名为17。直接打开路径曾失败；逐级导航成功，不把失败解释成文件移除。

## 结论 → 网页映射

| 网页通道 | 关键定义/函数 | 原创解释与适用范围 |
|---|---|---|
| Binder开流及返回 | S05 `OpenOutputStreamReturn` / `openOutputStream` | 返回输出流接口和描述符；不是PCM字节通道。开流返回后仍需正确状态控制。 |
| 数据FMQ | S03 `AudioBuffer.fmq`；S04 `transfer` 的输出分支 | 非MMAP输出先写入字节队列，本场景选择PCM格式。 |
| 命令FMQ | S03 `command`；S04 `sendCommand` | 写入流命令；传输使用burst。standby状态下transfer先发送start。 |
| 响应FMQ | S03 `reply` / `fmqByteCount`；S04 `sendCommand` | 框架读响应，获得状态与消费量；不可把消费量等同扬声器呈现量。 |

网页 `site/learning.js` 的 `halSteps` 和 `halLearning` 对应上述四行。管理调用与流传输是不同阶段，不表示每批数据都重新开流。命令/响应与数据FMQ分开，不宣传端到端零拷贝。

## 不在本次证据内

- Android17应用端完整共享缓冲实现、全部进程启动/注册、AudioPolicy完整调用关系。
- 完整流状态机、失败路径、异步回调路径；网页有明确省略说明。
- 具体厂商HAL是否采用该路径、DSP/总线/驱动实现、设备性能与时延。

因此本次关闭的是**HAL三队列与关键传输顺序**缺口，不是完整Android17音频系统审计。

# 播放反馈与用户态库核验

核验日期：2026-11-09。原文重述，不是官方引文。此次增补ALSA period与tinyalsa，原有图的直接DMA/I²S场景不变。

## ALSA period与图中的播放进展

依据：Linux《Writing an ALSA Driver》的pointer callback、PCM Interrupt Handler、On calling snd_pcm_period_elapsed章节：
https://docs.kernel.org/sound/kernel-api/writing-an-alsa-driver.html

驱动报告period进展，PCM核心读取硬件位置并计算可用空间。文档同时描述周期边界中断、定时器中断及跨越多个period只需通知一次的情况，因此不能把period等同于一中断，更不能等同于扬声器已出声。图中的反馈箭头折叠了驱动处理，传递通知而不是PCM数据。48kHz、240帧对应5ms为单位换算示例，不是设备配置或中断时序承诺。

## tinyalsa

依据：项目维护者README与AOSP Audio HAL职责说明：
https://github.com/tinyalsa/tinyalsa
https://source.android.com/docs/core/audio/implement

tinyalsa提供访问ALSA内核的基础PCM和mixer API，是用户态库。它不是内核驱动、完整HAL或AudioFlinger式的软件混音器。图中的HAL后端选用它，不意味着所有Android产品必须如此实现。

## 本次范围

高通源码组件名另见GLOSSARY-QUALCOMM-SOURCES.md。此次针对当前音频章节暴露出的组件名与反馈机制补齐，不声称未编写的所有技术领域术语已经完备。

## mmap（2026-11-09）
- Linux man-pages mmap(2): https://man7.org/linux/man-pages/man2/mmap.2.html —— 虚拟地址映射、文件/设备及匿名映射。
- AOSP AAudio and MMAP: https://source.android.com/docs/core/audio/aaudio —— Android音频MMAP路径、独占/共享模式、8.0/8.1背景和设备支持条件。页面含历史HAL实现信息，本词条不照搬为最新产品配置建议。
- 区分ALSA非mmap访问与Android非MMAP路径；不把共享内存一概称为AAudio MMAP，不宣称端到端零拷贝。

# Android Systems Atlas

面向新手的中英双语 Android 系统图解学习网站。

当前阶段：本地双语图解预览。首页已有职责、执行边界与场景三种视角；音频页采用纵向分层、横向协作的连续架构图，支持沿线演示与正文术语悬浮解释。其他领域仍以目录为主，完整教材尚未完成。

代码仓库：https://github.com/Larry-Labs/android-systems-atlas 。

提交约定：每完成并验证一个独立改动，及时提交相关代码与文档并同步仓库，避免跨功能积攒；遵守[项目执行约束](AGENTS.md)。

运行：`python3 -m http.server 4173 --bind 127.0.0.1 --directory site`，然后访问 http://127.0.0.1:4173 。详见 [预览说明](docs/PREVIEW.md)。

## 文档入口

- [项目执行约束](AGENTS.md)：开始工作前阅读；设计决策同轮同步，后续严格遵守。
- [专题设计与呈现规范](docs/CONTENT-AND-DIAGRAMS.md)：后续专题的统一执行依据，包含页面结构、必要深度、图、交互、视觉、双语、差异、来源与验收。
- [专题编写与验收模板](docs/TOPIC-TEMPLATE.md)：新专题从这里开始，包含页面骨架、证据与术语覆盖表、验收清单和交付记录。
- [术语解释设计规范](docs/GLOSSARY-DESIGN.md)：原位短释义、完整词条、关系图、三问、范围与来源。

- [Android17 HAL源码复核](docs/AUDIO-SOURCE-VERIFICATION.md)：固定标签、blob、关键片段和网页对应关系。
- [正式内容基线](docs/CONTENT-BASELINE.md)：Android17发布证据、固定源码标签与未关闭的核验缺口。
- [首批来源登记](docs/SOURCE-REGISTER.md)：结论与来源对应、已读与待复核分开。
- [三张入门图](docs/content/FOUNDATIONS.md)：职责、执行边界、播放场景的双语原创图稿。
- [音频播放样板设计](docs/content/AUDIO-PLAYBACK.md)：连续架构首图、连线含义、动画脚本、版本与形态差异。

- [大框验证记录](docs/PREVIEW-VALIDATION.md)：浏览器检查结果与验证边界。
- [需求规格](docs/REQUIREMENTS.md)：当前需求基线，优先于历史草稿。
- [实施计划](docs/IMPLEMENTATION-PLAN.md)：已完成预览与待实施内容分开记录。
- [前期项目调研](docs/OPEN-SOURCE-RESEARCH.md)：现有学习项目、高通公开资源、适配边界。
- [决策与待定事项](docs/DECISIONS.md)：已经确认的范围、建议默认值、尚未决定的实施事项。
- [迁入记录](docs/MIGRATION.md)：来源、复制范围和核验方式。
- [迁入文件校验清单](docs/migration-manifest.json)：原文件及副本 SHA-256。

## 目录

```text
site/                           当前可运行的预览站点
tests/                          浏览器检查
artifacts/                      本地截图与验证结果
docs/                           当前需求、调研、决策与迁入记录
references/legacy-prototype/    暂停开发前的历史页面骨架和目录草案
references/architecture-blog/   前期架构文章、图源、导出图及核验记录
```

历史文件仅作参考。不得以旧 PLAN、旧网页、旧图示覆盖当前需求，也不得把历史核验结论当作最新版本的验证结果。

音频领域现展开ALSA/ASoC直接DMA/I²S驱动例子，并注明DSP/高通公开实现边界；数据方向默认循环，保留暂停/继续与全屏查看（退出按钮或Esc返回）。核验依据见 [音频驱动核验](docs/AUDIO-DRIVER-VERIFICATION.md)。这仍是限定场景的示范章节。

术语解释：现有词条提供双语短释义、架构位置、原创关系图、三个关键问答、适用范围与来源。正文悬浮保留简短解释，完整阅读在原释义弹层展开。维护规则见 [术语解释设计规范](docs/GLOSSARY-DESIGN.md)。

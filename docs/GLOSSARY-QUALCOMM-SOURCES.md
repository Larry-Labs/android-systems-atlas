# 高通音频组件术语：来源与边界

核验日期：2026-11-09。对象：`site/glossary-qualcomm.js` 中 q6asm、q6routing、q6apm、ADM、AudioReach、GPR 六项。中英文及关系图为本站原创重述。

模块独立导出 `metadata` 数组与 `termEntries` 对象。正文合并、来源资源版本、别名搜索与原位释义接入由主任务负责。别名包括相关源文件/函数检索词，不表示这些文件、服务和客户端完全等同；例如 q6asm 条目明确区分 q6asm-dai 适配代码、q6asm 客户端和 DSP ASM 服务。

## 本轮实际读取的一手源码

以下均为 torvalds/linux 的 **v6.12 标签**，实际通过网页工具读取 raw.githubusercontent.com 正文与指定函数片段。并非 main 分支、厂商 BSP 或 DSP 固件源码。表中源码文件名对应词条内 GitHub 固定标签浏览链接，raw 链接为本轮读取地址。

| 已读取 URL | 直接支持的内容与检查位置 | 使用限制 |
| --- | --- | --- |
| [q6asm.c](https://raw.githubusercontent.com/torvalds/linux/v6.12/sound/soc/qcom/qdsp6/q6asm.c) | `MODULE_DESCRIPTION` 给出 Audio Stream Manager；`q6asm_write_async` 组装地址、长度、映射句柄并 `apr_send_pkt`；`q6asm_cmd` 与驱动注册区分内核客户端和服务 | 不把 Linux 文件当 DSP 服务本体；写缓冲示例不覆盖所有格式和失败状态 |
| [q6asm-dai.c](https://raw.githubusercontent.com/torvalds/linux/v6.12/sound/soc/qcom/qdsp6/q6asm-dai.c) | `DRV_NAME` 为 q6asm-fe-dai；PCM `event_handler` 收到写完成后更新 pcm_irq_pos、调用 snd_pcm_period_elapsed；调用 q6asm_write_async | 图使用 PCM 分支；不把该事件解释为扬声器呈现完成 |
| [q6routing.c](https://raw.githubusercontent.com/torvalds/linux/v6.12/sound/soc/qcom/qdsp6/q6routing.c) | `q6routing_stream_open` 依据端口/会话状态调用 q6adm_open、q6adm_matrix_map；`DRV_NAME` 为 q6routing-component | 这是路由配置，不是样本转发；没有声称所有配置或错误分支均已审计 |
| [q6adm.c](https://raw.githubusercontent.com/torvalds/linux/v6.12/sound/soc/qcom/qdsp6/q6adm.c) | `MODULE_DESCRIPTION` 给出 Audio Device Manager；device open/close、matrix map 组装 APR 命令；`q6adm_callback` 处理命令状态及返回路径标识 | ADM 指 DSP 服务语境，q6adm 指主机客户端；不拓展为通用 Android 设备管理 |
| [q6apm.c](https://raw.githubusercontent.com/torvalds/linux/v6.12/sound/soc/qcom/qdsp6/q6apm.c) | Audio Process Manager 名称；graph open/prepare/start/stop；`q6apm_write_async` 的共享内存端点目标、地址/长度/句柄、gpr_send_port_pkt；graph_callback 与 apm_callback 分工 | 管理命令面向 APM；缓冲请求面向图的共享内存端点，不混为所有请求都发给 APM 服务 |
| [audioreach.c](https://raw.githubusercontent.com/torvalds/linux/v6.12/sound/soc/qcom/qdsp6/audioreach.c) | `audioreach_alloc_graph_pkt` 组织子图、容器、模块、模块属性和端口连接；`audioreach_send_cmd_sync` 发送并等待回应 | 支持上游客户端的图描述模型，不证明特定固件的全部模块或调度行为 |
| [topology.c](https://raw.githubusercontent.com/torvalds/linux/v6.12/sound/soc/qcom/qdsp6/topology.c) | 图信息及子图/容器/模块的分配与关联；容器持有所属子图、模块由容器组织 | AudioReach 小图是组成关系，省略模块间实际音频链接，不是样本按层级依次流动 |
| [apr.c](https://raw.githubusercontent.com/torvalds/linux/v6.12/drivers/soc/qcom/apr.c) | GPR 分配端口、gpr_send_pkt/gpr_send_port_pkt；发送经 rpmsg_trysend；接收按 dest_port 查找并调用注册回调 | GPR 小图折叠底层传输；不是 Binder IPC、网络路由器或音频解码器 |
| [qcom,apr.yaml](https://raw.githubusercontent.com/torvalds/linux/v6.12/Documentation/devicetree/bindings/soc/qcom/qcom,apr.yaml) | 标题明确 APR/GPR 为 Asynchronous/Generic Packet Router；描述 AP—QDSP IPC；列出服务兼容项 | GPR 使用 **Generic Packet Router**，不臆造 General Purpose Router；不从兼容项推断出货设备支持 |
| [qcom,q6apm.yaml](https://raw.githubusercontent.com/torvalds/linux/v6.12/Documentation/devicetree/bindings/sound/qcom,q6apm.yaml) | 标题明确 **Audio Process Manager**，并给出 GPR 下 APM 服务的绑定示例 | 按该版本名称书写，不替换成 Android AudioPolicyManager，也不把示例当所有板卡配置 |
| [sound/soc/qcom/Kconfig](https://raw.githubusercontent.com/torvalds/linux/v6.12/sound/soc/qcom/Kconfig) | QDSP6 相关组件配置与其他 Qualcomm 音频驱动选项并存 | 支持“不能从 Qualcomm 名称推出统一实现”的边界，不推断具体平台或 BSP 版本 |

## 关系图审校要点

- q6asm：ALSA 前端 → 内核客户端 → DSP ASM 是调用/协议关系；共享内存 → DSP 单独标为样本访问。APR 未另占节点，其通信方式在控制边标明。
- q6routing、ADM：只画路由调用、命令与结果。没有 PCM 数据边，不暗示 q6routing 是音频转发站。q6routing 的 full 是描述性文件/组件名称，不发明缩写展开。
- q6apm：内核图信息与客户端用非定向关系线；GPR 命令与响应跨 DSP 边界；共享缓冲数据另画。DSP 节点明确合并 APM 与图端点，问答解释两类请求的区别。
- AudioReach：graph → subgraph → container → module 为非定向包含关系；不是实际执行顺序，不宣称每个产品拓扑相同。
- GPR：请求与响应都是协议消息，不以 `data` 边暗示 PCM 填入消息包。发送成功、操作反馈、扬声器呈现分开理解；不承诺端到端零拷贝。

## 读取失败与证据等级

曾尝试直接通过本地 Python HTTPS 并行读取，均超时；没有将超时当成源码不存在，也没有写入下载缓存。随后上述正文与关键函数均通过网页工具读到。

探索的 `sound/soc/qcom/qdsp6/Kconfig`、独立 `qcom,gpr.yaml` 路径返回404，未作为来源；采用实际存在且已读取的 `sound/soc/qcom/Kconfig` 和 `qcom,apr.yaml`。`include/linux/soc/qcom/apr.h` 网页读取返回429，未作为已核验依据。`drivers/soc/qcom/Kconfig` 可读但没有用于最终术语结论。

既有 [AUDIO-DRIVER-VERIFICATION.md](AUDIO-DRIVER-VERIFICATION.md) 用于定位线索和确认教学边界，本轮六项新增事实依赖上述重新读取的固定标签代码。没有使用旧 Android17 基线替代 Linux v6.12 实现核验；没有设备实测、内核/Android 编译、厂商 DSP 固件审计或具体手机拓扑验证。

## 已执行检查与未完成项

Node 导入及语法检查通过。一次性断言核对：6个指定 ID；metadata 与内容逐项对应且 domain 为 audio；内容顶层字段与 glossary-audio.js 一致；中英字段非空；每项3组问答；中文定义2句、55–110字符；note 不超过65字符；21个图节点、22条边；节点位于3列×2行且格位和 ID 唯一；英文标题≤22、副标题≤27、边标签≤20字符；边端点存在且类型合法；节点中心直连不穿过第三个节点；来源链接均使用 Linux v6.12 固定标签。

检查仅证明独立模块的数据结构和基本几何约束；不证明合并后的别名搜索、渲染器实际折线路由、双语手机布局、键盘与浮层交互。上述页面验证由主任务在接入后完成。本分工仅新增指定两个文件，未修改集成、CSS、测试或原内容模块，也未提交 Git。

## 主任务复核与接入

主任务复读v6.12 q6asm-dai.c的event_handler（写完成更新pcm_irq_pos并通知ALSA）、q6apm.c的q6apm_write_async（地址/长度/映射句柄及GPR发送），并读取qcom,apr.yaml复核Generic Packet Router名称。六项并入统一词典，正文识别与搜索支持登记的相关代码名称；源码链接继续直接打开来源。固定标签代码不代表出货设备实测。

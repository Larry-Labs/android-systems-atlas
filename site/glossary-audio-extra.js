// Original bilingual explanations. Sources support concepts, not product/BSP validation.
export const metadata = [
  {
    id: 'audio-patch', term: 'AudioPatch', aliases: ['audio patch', 'audio patches'],
    full: 'Audio patch', name: { zh: '音频端口连接', en: 'Audio port connection' }, domain: 'audio', reviewedAt: '2026-11-09',
    source: 'https://android.googlesource.com/platform/prebuilts/fullsdk/sources/android-30/+/refs/heads/androidx-room-release/android/media/AudioPatch.java'
  },
  {
    id: 'apr', term: 'APR', full: 'Asynchronous Packet Router',
    name: { zh: '异步包路由通信', en: 'Asynchronous packet routing' }, domain: 'audio', reviewedAt: '2026-11-09',
    source: 'https://github.com/torvalds/linux/blob/v6.12/Documentation/devicetree/bindings/soc/qcom/qcom,apr.yaml'
  },
  {
    id: 'underrun', term: 'underrun', aliases: ['underruns'], full: 'Playback buffer underrun',
    name: { zh: '播放缓冲欠载', en: 'Playback buffer underrun' }, domain: 'audio', reviewedAt: '2026-11-09',
    source: 'https://www.alsa-project.org/alsa-doc/alsa-lib/pcm.html'
  }
];

export const termEntries = {
  'audio-patch': {
    definition: {
      zh: 'audio patch 是 Android 音频系统中描述源端口与目标端口连接的对象，包含双方的端口配置。播放时可用它描述输出混音端到扬声器设备端的连接，帮助系统表达声音要送往哪里。',
      en: 'An audio patch describes a connection between source and sink audio ports in Android, including their configurations. For playback, it can describe an output mix connected to a speaker device.'
    },
    note: {
      zh: '这里的 patch 不是代码补丁，也不是存放 PCM 样本的缓冲区。',
      en: 'Here, a patch is neither a code change nor a buffer containing PCM samples.'
    },
    position: {
      zh: 'Android 音频端口与路由连接模型。',
      en: 'Android audio port and routing connection model.'
    },
    diagram: {
      caption: {
        zh: '连接描述示例：非定向线表示 patch 关联的源／目标配置，不表示样本经过 patch 对象。',
        en: 'Connection model: undirected lines associate source/sink configurations with a patch; samples do not pass through this object.'
      },
      nodes: [
        { id: 'source', col: 0, row: 0, label: { zh: '源端口配置', en: 'Source port config' }, sub: { zh: '例：输出混音端', en: 'Example: output mix' } },
        { id: 'patch', col: 1, row: 0, label: { zh: 'audio patch', en: 'Audio patch' }, sub: { zh: '描述端口连接', en: 'Describes a connection' }, focus: true },
        { id: 'sink', col: 2, row: 0, label: { zh: '目标端口配置', en: 'Sink port config' }, sub: { zh: '例：扬声器设备端', en: 'Example: speaker device' } }
      ],
      edges: [
        { from: 'source', to: 'patch', kind: 'relation', label: { zh: '源配置', en: 'Source config' } },
        { from: 'patch', to: 'sink', kind: 'relation', label: { zh: '目标配置', en: 'Sink config' } }
      ]
    },
    questions: [
      { q: { zh: '为什么需要它？', en: 'Why is it useful?' }, a: { zh: '系统需要明确连接的两端。patch 把源、目标的配置及连接标识组织起来，便于管理这条连接。', en: 'The system needs to identify both ends. A patch groups their configurations and a connection ID for management.' } },
      { q: { zh: '源和目标一定是两块硬件吗？', en: 'Are both ends hardware?' }, a: { zh: '不是。源可以是输出混音端或麦克风设备端；目标可以是扬声器设备端或录音混音端。', en: 'No. A source can be an output mix or microphone device; a sink can be a speaker device or capture mix.' } },
      { q: { zh: '有 patch 就能知道样本怎么搬运吗？', en: 'Does a patch specify sample transport?' }, a: { zh: '不能。它描述端口连接；实际样本访问与硬件传输还要查看相应音频路径的实现。', en: 'No. It describes port connections; sample access and hardware transport require examining the corresponding implementation.' } }
    ],
    scope: {
      zh: '依据 AOSP AudioPatch 类说明连接概念，图仅举播放连接；不承诺任意端口组合可连接，也不把隐藏的框架接口视为普通应用公开 API。',
      en: 'Based on the AOSP AudioPatch class; the diagram illustrates playback only. It promises neither arbitrary port combinations nor a public app API for hidden framework interfaces.'
    },
    sources: [
      { title: 'AOSP AudioPatch.java: connection, port configurations and hidden API (Android 30 sources)', url: 'https://android.googlesource.com/platform/prebuilts/fullsdk/sources/android-30/+/refs/heads/androidx-room-release/android/media/AudioPatch.java' }
    ]
  },
  apr: {
    definition: {
      zh: 'APR 是高通主处理器与 DSP 服务之间的包通信机制，Linux 内核客户端用它发送请求并接收响应或事件。在本页 ASM 示例中，它传递流操作和缓冲引用，使主机能与 DSP 音频服务协作。',
      en: 'APR is a packet communication mechanism between the Qualcomm application processor and DSP services, used by Linux clients for requests, replies and events. In this ASM example, it carries stream operations and buffer references.'
    },
    note: {
      zh: 'q6asm 的共享缓冲写请求引用样本地址、长度和映射句柄，不把整块音频样本装入 APR 包。',
      en: 'A q6asm shared-buffer write references an address, length and mapping handle; it does not pack the audio block into the APR message.'
    },
    position: {
      zh: 'Linux 主机客户端与高通 DSP 服务之间；此处以 q6asm / ASM 为例。',
      en: 'Between Linux host clients and Qualcomm DSP services; q6asm / ASM is the example here.'
    },
    diagram: {
      caption: {
        zh: 'APR 服务通信示例：请求与事件走包通信；样本另存共享缓冲，绿色线表示 DSP 访问样本。',
        en: 'APR service communication: requests/events use packets; samples reside in a shared buffer and the green edge represents DSP sample access.'
      },
      nodes: [
        { id: 'client', col: 0, row: 0, label: { zh: 'q6asm', en: 'q6asm' }, sub: { zh: '主机内核客户端', en: 'Host kernel client' } },
        { id: 'apr', col: 1, row: 0, label: { zh: 'APR', en: 'APR' }, sub: { zh: '包通信与服务分发', en: 'Packets / service dispatch' }, focus: true },
        { id: 'asm', col: 2, row: 0, label: { zh: 'ASM 服务', en: 'ASM service' }, sub: { zh: 'DSP 侧服务', en: 'DSP service' } },
        { id: 'buffer', col: 2, row: 1, label: { zh: '共享缓冲', en: 'Shared buffer' }, sub: { zh: 'PCM 样本', en: 'PCM samples' } }
      ],
      edges: [
        { from: 'client', to: 'apr', kind: 'control', label: { zh: '请求／缓冲引用', en: 'Request / buffer ref' } },
        { from: 'apr', to: 'asm', kind: 'control', label: { zh: '发送服务请求', en: 'Service request' } },
        { from: 'asm', to: 'apr', kind: 'reply', label: { zh: '响应／事件', en: 'Reply / event' } },
        { from: 'apr', to: 'client', kind: 'reply', label: { zh: '分发回调', en: 'Dispatch callback' } },
        { from: 'buffer', to: 'asm', kind: 'data', label: { zh: '样本访问', en: 'Sample access' } }
      ]
    },
    questions: [
      { q: { zh: 'APR 解决什么问题？', en: 'What does APR provide?' }, a: { zh: '让主机客户端把请求送到相应 DSP 服务，并把返回的消息交给对应客户端处理。', en: 'It carries host requests to DSP services and dispatches received messages to the corresponding client.' } },
      { q: { zh: '样本为什么没有画在请求线上？', en: 'Why are samples separate from requests?' }, a: { zh: 'Linux v6.12 的 q6asm_write_async 发送缓冲地址、长度及映射句柄，样本仍位于共享缓冲。', en: 'Linux v6.12 q6asm_write_async sends the buffer address, length and mapping handle; samples stay in shared memory.' } },
      { q: { zh: '它就是 DSP 或 Audio HAL 吗？', en: 'Is APR the DSP or Audio HAL?' }, a: { zh: '都不是。APR 负责包通信；q6asm 是主机客户端，ASM 是 DSP 服务，三者职责不同。', en: 'Neither. APR handles packet communication; q6asm is a host client and ASM is a DSP service.' } }
    ],
    scope: {
      zh: '限定 Linux v6.12 的 APR / q6asm 示例；不代表全部高通产品或所有包类型。不能把 APR 与本页另一套 AudioReach 路径使用的 GPR 当成同一协议。',
      en: 'Linux v6.12 APR / q6asm example, not all Qualcomm products or all packet types. APR and the GPR protocol used by the separate AudioReach example are not interchangeable.'
    },
    sources: [
      { title: 'Linux v6.12: APR/GPR binding, expansion and communication scope', url: 'https://github.com/torvalds/linux/blob/v6.12/Documentation/devicetree/bindings/soc/qcom/qcom,apr.yaml' },
      { title: 'Linux v6.12: APR send and receive service dispatch', url: 'https://github.com/torvalds/linux/blob/v6.12/drivers/soc/qcom/apr.c' },
      { title: 'Linux v6.12: q6asm_write_async shared-buffer request', url: 'https://github.com/torvalds/linux/blob/v6.12/sound/soc/qcom/qdsp6/q6asm.c' }
    ]
  },
  underrun: {
    definition: {
      zh: 'underrun 是播放中的缓冲欠载：消费端需要继续取样本时，供数方未及时补上可用数据。在 ALSA PCM 中，它属于 XRUN 异常，区别于正常的周期进展通知，调用方需要处理恢复。',
      en: 'An underrun occurs when playback needs more samples but its producer has not supplied them in time. In ALSA PCM it is an XRUN condition requiring recovery, distinct from normal period progress.'
    },
    note: {
      zh: 'underrun 是播放供数不足；录音数据未及时取走导致的溢出叫 overrun，两者均属于 XRUN。',
      en: 'Underrun means insufficient playback data; unread capture data causes overrun. Both are XRUN conditions.'
    },
    position: {
      zh: '播放供数与 PCM 缓冲消费之间的异常状态；本条以 ALSA 为范围。',
      en: 'A fault between playback supply and PCM buffer consumption; ALSA is the scope here.'
    },
    diagram: {
      caption: {
        zh: '播放欠载条件示意：缓冲到消费端用关联线表示“无新样本可用”，不是仍在传输样本。',
        en: 'Playback underrun condition: the buffer-to-consumer association means no new samples are available, not continuing sample transfer.'
      },
      nodes: [
        { id: 'producer', col: 0, row: 0, label: { zh: '供数方', en: 'Producer' }, sub: { zh: '未及时补充', en: 'Refill arrives late' } },
        { id: 'buffer', col: 1, row: 0, label: { zh: '播放缓冲', en: 'Playback buffer' }, sub: { zh: '待播放数据耗尽', en: 'Queued samples exhausted' }, focus: true },
        { id: 'consumer', col: 2, row: 0, label: { zh: '播放消费端', en: 'Playback consumer' }, sub: { zh: '仍需要新样本', en: 'Needs more samples' } }
      ],
      edges: [
        { from: 'producer', to: 'buffer', kind: 'relation', label: { zh: '补充不及时', en: 'Late supply' } },
        { from: 'buffer', to: 'consumer', kind: 'relation', label: { zh: '无新样本可用', en: 'No new samples' } }
      ]
    },
    questions: [
      { q: { zh: '为什么会发生？', en: 'Why does it happen?' }, a: { zh: '生产者没有赶上播放端的消费需求，例如应用未及时提交下一批样本。', en: 'The producer fails to keep up with playback consumption, for example by submitting the next samples too late.' } },
      { q: { zh: 'ALSA 怎样让调用方知道？', en: 'How does ALSA report it?' }, a: { zh: '在常见 XRUN 停止模式下，PCM 进入 XRUN 状态，I/O 可返回 -EPIPE；使用 alsa-lib 的程序可通过 snd_pcm_recover 处理。', en: 'In the usual XRUN stop mode, PCM enters XRUN and I/O can return -EPIPE; alsa-lib programs can use snd_pcm_recover.' } },
      { q: { zh: '它和 period 通知有什么不同？', en: 'How does it differ from a period notification?' }, a: { zh: 'period 通知报告正常缓冲进展；underrun 表示供数未跟上消费，并非每次通知都会发生。', en: 'A period notification reports buffer progress; an underrun means supply fell behind consumption, not that each notification is an error.' } }
    ],
    scope: {
      zh: '本条解释 ALSA 播放欠载及常见 XRUN 停止模式；停止阈值、补静音策略会改变行为，不据此推断所有 Android 层的统计或具体听感。',
      en: 'ALSA playback underrun and the usual XRUN stop mode. Stop thresholds and silence policies affect behavior; this does not define every Android-layer counter or audible outcome.'
    },
    sources: [
      { title: 'ALSA PCM: XRUN state, -EPIPE, recovery and software thresholds', url: 'https://www.alsa-project.org/alsa-doc/alsa-lib/pcm.html' },
      { title: 'Linux: PCM period notifications and pointer callback', url: 'https://docs.kernel.org/sound/kernel-api/writing-an-alsa-driver.html' }
    ]
  }
};

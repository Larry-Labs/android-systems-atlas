// Original bilingual summaries of upstream Linux v6.12; see docs/GLOSSARY-QUALCOMM-SOURCES.md.
export const metadata = [
  {
    "id": "q6asm",
    "term": "q6asm",
    "full": "q6asm — Linux client for Audio Stream Manager",
    "name": {
      "zh": "ASM 内核客户端",
      "en": "Kernel client for ASM"
    },
    "domain": "audio",
    "source": "https://github.com/torvalds/linux/blob/v6.12/sound/soc/qcom/qdsp6/q6asm.c",
    "aliases": [
      "q6asm.c",
      "q6asm-dai",
      "q6asm-dai.c",
      "q6asm-fe-dai"
    ]
  },
  {
    "id": "q6routing",
    "term": "q6routing",
    "full": "q6routing (Linux routing component)",
    "name": {
      "zh": "DSP 音频路由配置组件",
      "en": "DSP audio routing component"
    },
    "domain": "audio",
    "source": "https://github.com/torvalds/linux/blob/v6.12/sound/soc/qcom/qdsp6/q6routing.c",
    "aliases": [
      "q6routing.c",
      "q6routing-component"
    ]
  },
  {
    "id": "q6apm",
    "term": "q6apm",
    "full": "q6apm — Linux client for Audio Process Manager",
    "name": {
      "zh": "AudioReach APM 内核客户端",
      "en": "Kernel client for AudioReach APM"
    },
    "domain": "audio",
    "source": "https://github.com/torvalds/linux/blob/v6.12/sound/soc/qcom/qdsp6/q6apm.c",
    "aliases": [
      "q6apm.c",
      "qcom-apm"
    ]
  },
  {
    "id": "adm",
    "term": "ADM",
    "full": "Audio Device Manager",
    "name": {
      "zh": "DSP 音频设备管理服务",
      "en": "DSP audio device management service"
    },
    "domain": "audio",
    "source": "https://github.com/torvalds/linux/blob/v6.12/sound/soc/qcom/qdsp6/q6adm.c",
    "aliases": [
      "q6adm",
      "q6adm.c"
    ]
  },
  {
    "id": "audioreach",
    "term": "AudioReach",
    "full": "AudioReach",
    "name": {
      "zh": "按处理图组织的音频框架",
      "en": "Graph-based audio framework"
    },
    "domain": "audio",
    "source": "https://github.com/torvalds/linux/blob/v6.12/sound/soc/qcom/qdsp6/audioreach.c",
    "aliases": [
      "audioreach.c"
    ]
  },
  {
    "id": "gpr",
    "term": "GPR",
    "full": "Generic Packet Router",
    "name": {
      "zh": "通用报文路由机制",
      "en": "Generic packet routing"
    },
    "domain": "audio",
    "source": "https://github.com/torvalds/linux/blob/v6.12/Documentation/devicetree/bindings/soc/qcom/qcom,apr.yaml",
    "aliases": [
      "gpr_send_pkt",
      "gpr_send_port_pkt"
    ]
  }
];

export const termEntries = {
  "q6asm": {
    "definition": {
      "zh": "q6asm 是 Linux 内核中与高通 DSP 音频流管理服务 ASM 通信的客户端。它发送流控制和共享缓冲请求，并把 DSP 返回的事件交给上层音频驱动。",
      "en": "q6asm is a Linux kernel client for the Qualcomm DSP Audio Stream Manager service (ASM). It sends stream-control and shared-buffer requests and passes DSP events to the audio driver above it."
    },
    "note": {
      "zh": "q6asm 是主处理器上的内核代码，不是 DSP 本体，也不是 DSP 中的 ASM 服务。",
      "en": "q6asm is host kernel code, not the DSP itself or the ASM service running on it."
    },
    "position": {
      "zh": "主处理器 Linux 内核，连接音频前端驱动与 DSP 的 ASM 服务。",
      "en": "Host Linux kernel, between the audio front-end driver and DSP ASM service."
    },
    "diagram": {
      "caption": {
        "zh": "Linux v6.12 播放示意：APR 请求引用共享缓冲，样本不画进命令包。",
        "en": "Linux v6.12 playback example: APR requests reference shared buffers; commands are not sample packets."
      },
      "nodes": [
        {
          "id": "front",
          "col": 0,
          "row": 0,
          "label": {
            "zh": "q6asm-dai",
            "en": "q6asm-dai"
          },
          "sub": {
            "zh": "ALSA 前端适配",
            "en": "ALSA front-end adapter"
          }
        },
        {
          "id": "client",
          "col": 1,
          "row": 0,
          "label": {
            "zh": "q6asm",
            "en": "q6asm"
          },
          "sub": {
            "zh": "主处理器内核客户端",
            "en": "Host kernel client"
          },
          "focus": true
        },
        {
          "id": "dsp",
          "col": 2,
          "row": 0,
          "label": {
            "zh": "DSP / ASM",
            "en": "DSP / ASM"
          },
          "sub": {
            "zh": "DSP 音频流服务",
            "en": "DSP stream service"
          }
        },
        {
          "id": "buffer",
          "col": 2,
          "row": 1,
          "label": {
            "zh": "共享缓冲",
            "en": "Shared buffer"
          },
          "sub": {
            "zh": "内存中的音频样本",
            "en": "Audio samples in memory"
          }
        }
      ],
      "edges": [
        {
          "from": "front",
          "to": "client",
          "kind": "control",
          "label": {
            "zh": "流与缓冲操作",
            "en": "Stream / buffer ops"
          }
        },
        {
          "from": "client",
          "to": "dsp",
          "kind": "control",
          "label": {
            "zh": "APR 请求",
            "en": "APR requests"
          }
        },
        {
          "from": "dsp",
          "to": "client",
          "kind": "reply",
          "label": {
            "zh": "状态与完成事件",
            "en": "Status / completion"
          }
        },
        {
          "from": "client",
          "to": "front",
          "kind": "reply",
          "label": {
            "zh": "客户端事件",
            "en": "Client events"
          }
        },
        {
          "from": "buffer",
          "to": "dsp",
          "kind": "data",
          "label": {
            "zh": "供 DSP 访问样本",
            "en": "Sample access"
          }
        }
      ]
    },
    "questions": [
      {
        "q": {
          "zh": "为什么还需要 q6asm？",
          "en": "Why is q6asm needed?"
        },
        "a": {
          "zh": "Linux 的声音驱动需要用 DSP 理解的协议管理音频流；q6asm 封装这类请求。",
          "en": "Linux sound drivers need DSP protocol requests to manage streams; q6asm packages them."
        }
      },
      {
        "q": {
          "zh": "q6asm-dai 是同一个东西吗？",
          "en": "Is q6asm-dai identical?"
        },
        "a": {
          "zh": "它是相关的 ALSA 前端适配代码，调用 q6asm；PCM 写完成事件在这里更新进度并通知 ALSA。",
          "en": "It is the related ALSA front-end adapter that calls q6asm; PCM write-completion events update progress and notify ALSA there."
        }
      },
      {
        "q": {
          "zh": "写请求里装的是样本吗？",
          "en": "Does a write request contain samples?"
        },
        "a": {
          "zh": "所核对请求携带缓冲地址、长度和映射句柄。样本在共享缓冲中，完成通知也不等于已被扬声器呈现。",
          "en": "The checked request carries a buffer address, length and mapping handle. Samples reside in shared memory; completion is not speaker presentation."
        }
      }
    ],
    "scope": {
      "zh": "依据上游 Linux v6.12 的 q6asm 与 q6asm-dai，图仅选 PCM 播放；不代表所有高通设备或 Android BSP。",
      "en": "Based on upstream Linux v6.12 q6asm and q6asm-dai; the diagram selects PCM playback, not every Qualcomm device or Android BSP."
    },
    "sources": [
      {
        "title": "Linux v6.12 · q6asm.c",
        "url": "https://github.com/torvalds/linux/blob/v6.12/sound/soc/qcom/qdsp6/q6asm.c"
      },
      {
        "title": "Linux v6.12 · q6asm-dai.c",
        "url": "https://github.com/torvalds/linux/blob/v6.12/sound/soc/qcom/qdsp6/q6asm-dai.c"
      },
      {
        "title": "Linux v6.12 · qcom,apr.yaml",
        "url": "https://github.com/torvalds/linux/blob/v6.12/Documentation/devicetree/bindings/soc/qcom/qcom,apr.yaml"
      }
    ]
  },
  "q6routing": {
    "definition": {
      "zh": "q6routing 是 Linux 音频驱动中的路由配置组件，记录音频流与后端端口的连接选择。开流时，它调用 q6adm 建立设备路径和映射，让 DSP 知道该流连接到哪里。",
      "en": "q6routing is a Linux audio routing component that tracks stream-to-backend port choices. During stream setup it calls q6adm to open device paths and configure mappings on the DSP."
    },
    "note": {
      "zh": "q6routing 配置连接关系，不是 PCM 样本逐次经过的转发盒。",
      "en": "q6routing configures connections; it is not a PCM sample-forwarding stage."
    },
    "position": {
      "zh": "Linux ASoC 组件，协同流前端、端口配置与 ADM 客户端。",
      "en": "Linux ASoC component coordinating stream front ends, port settings and the ADM client."
    },
    "diagram": {
      "caption": {
        "zh": "路由控制示意：内核组件经 q6adm 向 DSP ADM 配置连接。",
        "en": "Routing control: the kernel component configures DSP ADM through q6adm."
      },
      "nodes": [
        {
          "id": "route",
          "col": 0,
          "row": 0,
          "label": {
            "zh": "q6routing",
            "en": "q6routing"
          },
          "sub": {
            "zh": "内核路由选择",
            "en": "Kernel route selection"
          },
          "focus": true
        },
        {
          "id": "client",
          "col": 1,
          "row": 0,
          "label": {
            "zh": "q6adm",
            "en": "q6adm"
          },
          "sub": {
            "zh": "内核 ADM 客户端",
            "en": "Kernel ADM client"
          }
        },
        {
          "id": "service",
          "col": 2,
          "row": 0,
          "label": {
            "zh": "DSP / ADM",
            "en": "DSP / ADM"
          },
          "sub": {
            "zh": "DSP 设备管理服务",
            "en": "DSP device management"
          }
        }
      ],
      "edges": [
        {
          "from": "route",
          "to": "client",
          "kind": "control",
          "label": {
            "zh": "打开路径与映射",
            "en": "Open / map routes"
          }
        },
        {
          "from": "client",
          "to": "service",
          "kind": "control",
          "label": {
            "zh": "APR 路由命令",
            "en": "APR route commands"
          }
        },
        {
          "from": "service",
          "to": "client",
          "kind": "reply",
          "label": {
            "zh": "命令结果",
            "en": "Command results"
          }
        }
      ]
    },
    "questions": [
      {
        "q": {
          "zh": "为什么开流还要设置路由？",
          "en": "Why configure routes when opening?"
        },
        "a": {
          "zh": "有音频流不等于已选好设备端口，路由组件把流与选定的后端关联起来。",
          "en": "An audio stream alone does not select a device port; routing associates it with the chosen backend."
        }
      },
      {
        "q": {
          "zh": "源码中怎样落实连接？",
          "en": "How is the connection configured?"
        },
        "a": {
          "zh": "q6routing_stream_open 调用 q6adm_open，再通过 q6adm_matrix_map 提交会话与设备路径的映射。",
          "en": "q6routing_stream_open calls q6adm_open, then q6adm_matrix_map submits session-to-device-path mappings."
        }
      },
      {
        "q": {
          "zh": "它与 Android 音频策略相同吗？",
          "en": "Is this Android audio policy?"
        },
        "a": {
          "zh": "不同。这里是内核中的具体后端配置，不能把它当成 Android 系统服务或所有设备通用的路由规则。",
          "en": "No. This is kernel backend configuration, not an Android system service or a universal device-routing policy."
        }
      }
    ],
    "scope": {
      "zh": "限定 Linux v6.12 的 ASM/ADM 相关实现；不把它串到所有 AudioReach 路径中，也不推断实际板卡的端口选择。",
      "en": "Limited to the Linux v6.12 ASM/ADM implementation; not a mandatory stage in AudioReach paths or evidence of a board’s selected ports."
    },
    "sources": [
      {
        "title": "Linux v6.12 · q6routing.c",
        "url": "https://github.com/torvalds/linux/blob/v6.12/sound/soc/qcom/qdsp6/q6routing.c"
      },
      {
        "title": "Linux v6.12 · q6adm.c",
        "url": "https://github.com/torvalds/linux/blob/v6.12/sound/soc/qcom/qdsp6/q6adm.c"
      },
      {
        "title": "Linux v6.12 · Kconfig",
        "url": "https://github.com/torvalds/linux/blob/v6.12/sound/soc/qcom/Kconfig"
      }
    ]
  },
  "q6apm": {
    "definition": {
      "zh": "q6apm 是 Linux 内核连接 AudioReach 音频处理管理器 APM 的客户端。它管理处理图的生命周期，并借助 GPR 发送配置和共享缓冲请求、接收 DSP 反馈。",
      "en": "q6apm is the Linux kernel client for AudioReach’s Audio Process Manager (APM). It manages graph lifecycles and uses GPR for configuration, shared-buffer requests and DSP feedback."
    },
    "note": {
      "zh": "q6apm 不是 Android 的 AudioPolicyManager；也不能把写缓冲请求画成 PCM 本体。",
      "en": "q6apm is not Android AudioPolicyManager; a buffer-write request is not the PCM payload."
    },
    "position": {
      "zh": "主处理器 Linux 内核，与 DSP 上的 APM 及处理图端点通信。",
      "en": "Host Linux kernel, communicating with DSP APM and graph endpoints."
    },
    "diagram": {
      "caption": {
        "zh": "控制与缓冲访问示例：管理命令到 APM，写缓冲请求到图端点。",
        "en": "Control and buffer access: management targets APM; buffer requests target graph endpoints."
      },
      "nodes": [
        {
          "id": "graph",
          "col": 0,
          "row": 0,
          "label": {
            "zh": "图描述",
            "en": "Graph description"
          },
          "sub": {
            "zh": "模块与连接信息",
            "en": "Modules and connections"
          }
        },
        {
          "id": "client",
          "col": 1,
          "row": 0,
          "label": {
            "zh": "q6apm",
            "en": "q6apm"
          },
          "sub": {
            "zh": "内核客户端",
            "en": "Kernel client"
          },
          "focus": true
        },
        {
          "id": "dsp",
          "col": 2,
          "row": 0,
          "label": {
            "zh": "DSP / AudioReach",
            "en": "DSP / AudioReach"
          },
          "sub": {
            "zh": "APM 与图端点",
            "en": "APM and graph endpoints"
          }
        },
        {
          "id": "buffer",
          "col": 2,
          "row": 1,
          "label": {
            "zh": "共享缓冲",
            "en": "Shared buffer"
          },
          "sub": {
            "zh": "实际音频字节",
            "en": "Actual audio bytes"
          }
        }
      ],
      "edges": [
        {
          "from": "graph",
          "to": "client",
          "kind": "relation",
          "label": {
            "zh": "按图描述管理",
            "en": "Graph description"
          }
        },
        {
          "from": "client",
          "to": "dsp",
          "kind": "control",
          "label": {
            "zh": "GPR 命令／请求",
            "en": "GPR commands"
          }
        },
        {
          "from": "dsp",
          "to": "client",
          "kind": "reply",
          "label": {
            "zh": "响应与事件",
            "en": "Replies / events"
          }
        },
        {
          "from": "buffer",
          "to": "dsp",
          "kind": "data",
          "label": {
            "zh": "供图端点访问",
            "en": "Endpoint access"
          }
        }
      ]
    },
    "questions": [
      {
        "q": {
          "zh": "这里的处理图是什么？",
          "en": "What is a processing graph?"
        },
        "a": {
          "zh": "它描述音频模块及其连接；q6apm 使用这些信息打开、准备、启动或停止相应图。",
          "en": "It describes audio modules and their connections; q6apm uses that information to open, prepare, start or stop a graph."
        }
      },
      {
        "q": {
          "zh": "怎样告诉 DSP 去读哪块缓冲？",
          "en": "How is a buffer identified?"
        },
        "a": {
          "zh": "所核对写请求填写地址、长度和映射句柄，经 GPR 送往共享内存端点。",
          "en": "The checked write request supplies an address, length and mapping handle over GPR to a shared-memory endpoint."
        }
      },
      {
        "q": {
          "zh": "它和 q6asm 能直接互换吗？",
          "en": "Is it interchangeable with q6asm?"
        },
        "a": {
          "zh": "不能按名称互换。这里使用 AudioReach 图和 GPR；所核对 q6asm 使用 ASM 流协议与 APR。",
          "en": "Not by renaming: this path uses AudioReach graphs and GPR, while the checked q6asm path uses ASM stream commands over APR."
        }
      }
    ],
    "scope": {
      "zh": "仅依据 Linux v6.12 的客户端行为；DSP 内部处理由相应固件实现，未核验具体 Android 产品或端到端零拷贝。",
      "en": "Describes the Linux v6.12 client only. DSP internals depend on firmware; no specific Android product or end-to-end zero-copy was verified."
    },
    "sources": [
      {
        "title": "Linux v6.12 · q6apm.c",
        "url": "https://github.com/torvalds/linux/blob/v6.12/sound/soc/qcom/qdsp6/q6apm.c"
      },
      {
        "title": "Linux v6.12 · qcom,q6apm.yaml",
        "url": "https://github.com/torvalds/linux/blob/v6.12/Documentation/devicetree/bindings/sound/qcom,q6apm.yaml"
      },
      {
        "title": "Linux v6.12 · audioreach.c",
        "url": "https://github.com/torvalds/linux/blob/v6.12/sound/soc/qcom/qdsp6/audioreach.c"
      },
      {
        "title": "Linux v6.12 · q6asm.c",
        "url": "https://github.com/torvalds/linux/blob/v6.12/sound/soc/qcom/qdsp6/q6asm.c"
      }
    ]
  },
  "adm": {
    "definition": {
      "zh": "ADM 是所述高通 DSP 音频方案中的设备管理服务，负责设备路径及音频流到这些路径的映射。Linux 侧的 q6adm 客户端通过 APR 发送请求，q6routing 使用它设置路由。",
      "en": "ADM is the device-management service in the described Qualcomm DSP audio design, managing device paths and stream mappings. Linux q6adm sends APR requests, and q6routing uses that client for route setup."
    },
    "note": {
      "zh": "ADM 服务在 DSP 一侧；q6adm 是 Linux 客户端，二者不是同一个执行组件。",
      "en": "The ADM service is on the DSP; q6adm is its Linux client, not the same execution component."
    },
    "position": {
      "zh": "DSP 音频服务边界；Linux 通过 q6adm 与其通信。",
      "en": "DSP audio service boundary, accessed from Linux through q6adm."
    },
    "diagram": {
      "caption": {
        "zh": "服务调用关系：q6routing 调用客户端，客户端通过 APR 请求 ADM。",
        "en": "Service calls: q6routing invokes the client, which requests ADM over APR."
      },
      "nodes": [
        {
          "id": "route",
          "col": 0,
          "row": 0,
          "label": {
            "zh": "q6routing",
            "en": "q6routing"
          },
          "sub": {
            "zh": "内核路由组件",
            "en": "Kernel routing"
          }
        },
        {
          "id": "client",
          "col": 1,
          "row": 0,
          "label": {
            "zh": "q6adm",
            "en": "q6adm"
          },
          "sub": {
            "zh": "主处理器内核",
            "en": "Host kernel"
          }
        },
        {
          "id": "adm",
          "col": 2,
          "row": 0,
          "label": {
            "zh": "ADM 服务",
            "en": "ADM service"
          },
          "sub": {
            "zh": "DSP 侧",
            "en": "DSP side"
          },
          "focus": true
        }
      ],
      "edges": [
        {
          "from": "route",
          "to": "client",
          "kind": "control",
          "label": {
            "zh": "设备路径／映射",
            "en": "Paths / mappings"
          }
        },
        {
          "from": "client",
          "to": "adm",
          "kind": "control",
          "label": {
            "zh": "APR 命令",
            "en": "APR commands"
          }
        },
        {
          "from": "adm",
          "to": "client",
          "kind": "reply",
          "label": {
            "zh": "状态与路径标识",
            "en": "Status / path IDs"
          }
        }
      ]
    },
    "questions": [
      {
        "q": {
          "zh": "它管理的是手机设置界面吗？",
          "en": "Does it manage phone settings?"
        },
        "a": {
          "zh": "不是。这里的“设备”指 DSP 音频路径关联的端口与处理路径，不是 Android 设置应用。",
          "en": "No. Here, device management concerns DSP audio ports and processing paths, not the Android Settings app."
        }
      },
      {
        "q": {
          "zh": "内核如何使用 ADM？",
          "en": "How does Linux use ADM?"
        },
        "a": {
          "zh": "q6adm 打包打开、关闭和映射命令，并处理返回结果，供 q6routing 等调用。",
          "en": "q6adm packages open, close and mapping commands and handles results for callers such as q6routing."
        }
      },
      {
        "q": {
          "zh": "设置路由就是搬运样本吗？",
          "en": "Is route setup sample transfer?"
        },
        "a": {
          "zh": "不是。映射说明流应该连到哪个设备路径，不能把配置命令当成音频样本。",
          "en": "No. A mapping identifies the device path for a stream; configuration commands are not audio samples."
        }
      }
    ],
    "scope": {
      "zh": "本条采用 Linux v6.12 q6adm 所对应的 DSP 服务语境，不把 ADM 视为所有高通或 AudioReach 平台必有的服务。",
      "en": "Uses the DSP service context of Linux v6.12 q6adm; ADM is not asserted to exist on every Qualcomm or AudioReach platform."
    },
    "sources": [
      {
        "title": "Linux v6.12 · q6adm.c",
        "url": "https://github.com/torvalds/linux/blob/v6.12/sound/soc/qcom/qdsp6/q6adm.c"
      },
      {
        "title": "Linux v6.12 · q6routing.c",
        "url": "https://github.com/torvalds/linux/blob/v6.12/sound/soc/qcom/qdsp6/q6routing.c"
      },
      {
        "title": "Linux v6.12 · qcom,apr.yaml",
        "url": "https://github.com/torvalds/linux/blob/v6.12/Documentation/devicetree/bindings/soc/qcom/qcom,apr.yaml"
      }
    ]
  },
  "audioreach": {
    "definition": {
      "zh": "AudioReach 是按处理图组织音频模块及连接的音频框架，这里关注上游 Linux 对 DSP 音频的支持。内核用图描述配置 DSP 中的处理结构，并通过相应客户端管理运行。",
      "en": "AudioReach organizes audio modules and connections as processing graphs; here the focus is upstream Linux support for DSP audio. The kernel describes graphs and uses clients to configure and manage their execution on the DSP."
    },
    "note": {
      "zh": "AudioReach 是框架名称，不是一颗 DSP，也不是全部高通设备统一采用的实现。",
      "en": "AudioReach is a framework name, not a DSP chip or a universal Qualcomm implementation."
    },
    "position": {
      "zh": "跨主处理器驱动与 DSP 音频处理的软件框架。",
      "en": "Software framework spanning host drivers and DSP audio processing."
    },
    "diagram": {
      "caption": {
        "zh": "组成关系图：图、子图、容器与模块的描述层次，不表示样本依次经过它们。",
        "en": "Composition hierarchy: graph, subgraph, container and module, not successive sample-processing stages."
      },
      "nodes": [
        {
          "id": "graph",
          "col": 0,
          "row": 0,
          "label": {
            "zh": "AudioReach 图",
            "en": "AudioReach graph"
          },
          "sub": {
            "zh": "一组音频处理关系",
            "en": "Audio processing structure"
          },
          "focus": true
        },
        {
          "id": "subgraph",
          "col": 1,
          "row": 0,
          "label": {
            "zh": "子图",
            "en": "Subgraph"
          },
          "sub": {
            "zh": "图内的组织单元",
            "en": "Grouping within a graph"
          }
        },
        {
          "id": "container",
          "col": 2,
          "row": 0,
          "label": {
            "zh": "容器",
            "en": "Container"
          },
          "sub": {
            "zh": "组织模块",
            "en": "Groups modules"
          }
        },
        {
          "id": "module",
          "col": 2,
          "row": 1,
          "label": {
            "zh": "模块",
            "en": "Module"
          },
          "sub": {
            "zh": "具有端口与连接",
            "en": "Ports and connections"
          }
        }
      ],
      "edges": [
        {
          "from": "graph",
          "to": "subgraph",
          "kind": "relation",
          "label": {
            "zh": "包含子图",
            "en": "Contains subgraphs"
          }
        },
        {
          "from": "subgraph",
          "to": "container",
          "kind": "relation",
          "label": {
            "zh": "包含容器",
            "en": "Contains containers"
          }
        },
        {
          "from": "container",
          "to": "module",
          "kind": "relation",
          "label": {
            "zh": "包含模块",
            "en": "Contains modules"
          }
        }
      ]
    },
    "questions": [
      {
        "q": {
          "zh": "为什么需要“图”的描述？",
          "en": "Why describe a graph?"
        },
        "a": {
          "zh": "仅列出模块名字还不够；需要同时指定模块间端口怎样连接。",
          "en": "Module names alone are insufficient; connections between their ports must also be described."
        }
      },
      {
        "q": {
          "zh": "Linux 侧怎样配置它？",
          "en": "How does Linux configure it?"
        },
        "a": {
          "zh": "拓扑代码建立图信息，辅助代码组织模块与连接配置，q6apm 通过 GPR 与 DSP 协作。",
          "en": "Topology code builds graph information, helpers package module and connection settings, and q6apm communicates with the DSP over GPR."
        }
      },
      {
        "q": {
          "zh": "看到高通芯片就能套用这张图吗？",
          "en": "Does a Qualcomm chip imply this model?"
        },
        "a": {
          "zh": "不能。应先核对设备驱动、拓扑和固件；本条只解释已读上游实现的组织方式。",
          "en": "No. Check the device drivers, topology and firmware first; this entry describes only the inspected upstream model."
        }
      }
    ],
    "scope": {
      "zh": "图是 Linux v6.12 AudioReach 支持代码中的结构抽象，省略模块之间的实际音频连接；不是产品覆盖表或完整固件设计。",
      "en": "A structural abstraction from Linux v6.12 AudioReach support, omitting actual audio links between modules; not a product-support matrix or complete firmware design."
    },
    "sources": [
      {
        "title": "Linux v6.12 · audioreach.c",
        "url": "https://github.com/torvalds/linux/blob/v6.12/sound/soc/qcom/qdsp6/audioreach.c"
      },
      {
        "title": "Linux v6.12 · topology.c",
        "url": "https://github.com/torvalds/linux/blob/v6.12/sound/soc/qcom/qdsp6/topology.c"
      },
      {
        "title": "Linux v6.12 · q6apm.c",
        "url": "https://github.com/torvalds/linux/blob/v6.12/sound/soc/qcom/qdsp6/q6apm.c"
      },
      {
        "title": "Linux v6.12 · Kconfig",
        "url": "https://github.com/torvalds/linux/blob/v6.12/sound/soc/qcom/Kconfig"
      }
    ]
  },
  "gpr": {
    "definition": {
      "zh": "GPR 是高通处理器间通信使用的报文路由机制，名称为 Generic Packet Router。在这里，Linux 音频客户端用它向 DSP 服务或端口发请求，并接收响应与事件。",
      "en": "GPR means Generic Packet Router, a Qualcomm interprocessor packet-routing mechanism. Here Linux audio clients use it to request DSP services or ports and receive replies and events."
    },
    "note": {
      "zh": "GPR 路由协议消息；所示共享缓冲请求中的地址和句柄不是 PCM 样本本体。",
      "en": "GPR routes protocol messages; buffer addresses and handles in the illustrated requests are not PCM samples."
    },
    "position": {
      "zh": "主处理器与 DSP 的通信边界，位于音频客户端和消息传输之间。",
      "en": "Host–DSP communication boundary, connecting audio clients to message transport."
    },
    "diagram": {
      "caption": {
        "zh": "消息通路示例：省略底层传输，箭头均表示请求或反馈，不表示 PCM 搬运。",
        "en": "Message path with transport abstracted: arrows show requests or feedback, not PCM transfer."
      },
      "nodes": [
        {
          "id": "client",
          "col": 0,
          "row": 0,
          "label": {
            "zh": "q6apm 客户端",
            "en": "q6apm client"
          },
          "sub": {
            "zh": "Linux 内核",
            "en": "Linux kernel"
          }
        },
        {
          "id": "gpr",
          "col": 1,
          "row": 0,
          "label": {
            "zh": "GPR",
            "en": "GPR"
          },
          "sub": {
            "zh": "消息路由与分发",
            "en": "Routes protocol packets"
          },
          "focus": true
        },
        {
          "id": "dsp",
          "col": 2,
          "row": 0,
          "label": {
            "zh": "DSP 端口",
            "en": "DSP port"
          },
          "sub": {
            "zh": "服务或图端点",
            "en": "Service or graph endpoint"
          }
        }
      ],
      "edges": [
        {
          "from": "client",
          "to": "gpr",
          "kind": "control",
          "label": {
            "zh": "提交请求包",
            "en": "Submit request"
          }
        },
        {
          "from": "gpr",
          "to": "dsp",
          "kind": "control",
          "label": {
            "zh": "传输请求包",
            "en": "Request packet"
          }
        },
        {
          "from": "dsp",
          "to": "gpr",
          "kind": "reply",
          "label": {
            "zh": "响应／事件包",
            "en": "Reply / event"
          }
        },
        {
          "from": "gpr",
          "to": "client",
          "kind": "reply",
          "label": {
            "zh": "分发回调",
            "en": "Dispatch callback"
          }
        }
      ]
    },
    "questions": [
      {
        "q": {
          "zh": "报文如何找到接收方？",
          "en": "How are recipients selected?"
        },
        "a": {
          "zh": "协议带有目标信息；所读 Linux 接收代码按目标端口查找注册对象，再调用其回调。",
          "en": "Packets identify destinations; the inspected Linux receiver looks up the registered destination port and invokes its callback."
        }
      },
      {
        "q": {
          "zh": "它和 q6apm 各负责什么？",
          "en": "How do GPR and q6apm differ?"
        },
        "a": {
          "zh": "q6apm 知道音频图和缓冲操作的含义，GPR 提供报文发送与分发机制。",
          "en": "q6apm understands audio graphs and buffer operations; GPR provides packet sending and dispatch."
        }
      },
      {
        "q": {
          "zh": "GPR 发包成功就表示播放结束吗？",
          "en": "Does sending a packet finish playback?"
        },
        "a": {
          "zh": "不是。发包、收到操作响应及最终声音呈现属于不同阶段。",
          "en": "No. Packet transmission, an operation response and audible presentation are separate stages."
        }
      }
    ],
    "scope": {
      "zh": "名称与职责据 Linux v6.12 APR/GPR 绑定和 apr.c；所示缓冲请求据 q6apm.c，不推广到所有 GPR 载荷或 Android IPC。",
      "en": "Name and roles follow Linux v6.12 APR/GPR bindings and apr.c; the buffer example follows q6apm.c, not all GPR payloads or Android IPC."
    },
    "sources": [
      {
        "title": "Linux v6.12 · qcom,apr.yaml",
        "url": "https://github.com/torvalds/linux/blob/v6.12/Documentation/devicetree/bindings/soc/qcom/qcom,apr.yaml"
      },
      {
        "title": "Linux v6.12 · apr.c",
        "url": "https://github.com/torvalds/linux/blob/v6.12/drivers/soc/qcom/apr.c"
      },
      {
        "title": "Linux v6.12 · q6apm.c",
        "url": "https://github.com/torvalds/linux/blob/v6.12/sound/soc/qcom/qdsp6/q6apm.c"
      }
    ]
  }
};

// Original bilingual summaries; evidence and limits: docs/GLOSSARY-AUDIO-SOURCES.md.
export const termEntries = {
  "alsa": {
    "definition": {
      "zh": "ALSA 是 Linux 的声音子系统，为用户态程序提供播放、录音和控制接口。在内核中，它管理音频流的参数、缓冲与状态，并让具体驱动对接硬件。",
      "en": "ALSA is the Linux sound subsystem, exposing playback, capture and control interfaces to user space. Its kernel facilities manage stream parameters, buffers and state while device drivers connect to hardware."
    },
    "note": {
      "zh": "ALSA 不是 Android Audio HAL；HAL 可以采用它作为设备后端。",
      "en": "ALSA is not the Android Audio HAL; a HAL may use it as its device backend."
    },
    "position": {
      "zh": "用户态声音接口与 Linux 内核声音子系统。",
      "en": "User-space sound interfaces and the Linux kernel sound subsystem."
    },
    "diagram": {
      "caption": {
        "zh": "职责关系图：采用 ALSA 的后端，不表示样本经过每个软件节点。",
        "en": "Role relationships for an ALSA backend, not a sample pipeline."
      },
      "nodes": [
        {
          "id": "user",
          "col": 0,
          "row": 0,
          "label": {
            "zh": "用户态后端",
            "en": "User-space backend"
          },
          "sub": {
            "zh": "如 HAL 的实现",
            "en": "E.g. a HAL implementation"
          }
        },
        {
          "id": "alsa",
          "col": 1,
          "row": 0,
          "label": {
            "zh": "ALSA",
            "en": "ALSA"
          },
          "sub": {
            "zh": "接口与流状态",
            "en": "Interfaces and stream state"
          },
          "focus": true
        },
        {
          "id": "driver",
          "col": 2,
          "row": 0,
          "label": {
            "zh": "声音驱动",
            "en": "Sound driver"
          },
          "sub": {
            "zh": "设备相关操作",
            "en": "Device operations"
          }
        }
      ],
      "edges": [
        {
          "to": "alsa",
          "kind": "relation",
          "label": {
            "zh": "使用声音接口",
            "en": "Uses sound API"
          },
          "from": "user"
        },
        {
          "to": "driver",
          "kind": "relation",
          "label": {
            "zh": "委托设备操作",
            "en": "Device operations"
          },
          "from": "alsa"
        }
      ]
    },
    "questions": [
      {
        "q": {
          "zh": "为什么需要统一接口？",
          "en": "Why a common interface?"
        },
        "a": {
          "zh": "上层可以用共同的流操作，而不必理解每块声卡的寄存器。",
          "en": "Callers use common stream operations without knowing each sound card’s registers."
        }
      },
      {
        "q": {
          "zh": "播放时管理什么？",
          "en": "What does it manage?"
        },
        "a": {
          "zh": "包括参数、缓冲及启停状态；驱动报告播放位置和进度。",
          "en": "Parameters, buffers and start/stop state; drivers report playback position and progress."
        }
      },
      {
        "q": {
          "zh": "它与 ASoC 什么关系？",
          "en": "How does ASoC fit?"
        },
        "a": {
          "zh": "ASoC 是 ALSA 面向片上系统音频的框架，负责组合可复用的驱动组件。",
          "en": "ASoC is the ALSA framework that combines reusable components for SoC audio."
        }
      }
    ],
    "scope": {
      "zh": "这里聚焦 PCM 及内核驱动职责；不表示所有 Android HAL 都使用 ALSA。",
      "en": "Focuses on PCM and kernel-driver roles; not every Android HAL is required to use ALSA."
    },
    "sources": [
      {
        "title": "Writing an ALSA Driver",
        "url": "https://docs.kernel.org/sound/kernel-api/writing-an-alsa-driver.html"
      },
      {
        "title": "ASoC overview",
        "url": "https://docs.kernel.org/sound/soc/overview.html"
      },
      {
        "title": "AOSP audio architecture",
        "url": "https://source.android.com/docs/core/audio"
      }
    ]
  },
  "asoc": {
    "definition": {
      "zh": "ASoC 是 ALSA 中面向片上系统音频的框架，将接口、Codec 和板级连接等职责分开。它把可复用的驱动组件组合成声卡，让不同硬件协同播放或录音。",
      "en": "ASoC is ALSA’s framework for SoC audio, separating interface, codec and board roles. It combines reusable driver components into a sound card for playback or capture."
    },
    "note": {
      "zh": "组件的组织关系不是 PCM 依次经过每个驱动的路线。",
      "en": "Component organization is not a serial PCM path through every driver."
    },
    "position": {
      "zh": "Linux 内核 ALSA 内的 SoC 音频框架。",
      "en": "SoC audio framework within kernel ALSA."
    },
    "diagram": {
      "caption": {
        "zh": "组成关系图：板级描述将组件组织为 ASoC 声卡。",
        "en": "Composition: board descriptions connect components into an ASoC card."
      },
      "nodes": [
        {
          "id": "soc",
          "col": 0,
          "row": 0,
          "label": {
            "zh": "SoC 组件",
            "en": "SoC components"
          },
          "sub": {
            "zh": "接口与搬运职责",
            "en": "Interface and transfer"
          }
        },
        {
          "id": "asoc",
          "col": 1,
          "row": 0,
          "label": {
            "zh": "ASoC 声卡",
            "en": "ASoC sound card"
          },
          "sub": {
            "zh": "组件协作",
            "en": "Component integration"
          },
          "focus": true
        },
        {
          "id": "codec",
          "col": 2,
          "row": 0,
          "label": {
            "zh": "Codec 组件",
            "en": "Codec component"
          },
          "sub": {
            "zh": "转换与控制职责",
            "en": "Conversion and controls"
          }
        },
        {
          "id": "board",
          "col": 1,
          "row": 1,
          "label": {
            "zh": "板级描述",
            "en": "Board description"
          },
          "sub": {
            "zh": "连接与板级配置",
            "en": "Links and board settings"
          }
        }
      ],
      "edges": [
        {
          "to": "asoc",
          "kind": "relation",
          "label": {
            "zh": "参与组成",
            "en": "Component"
          },
          "from": "soc"
        },
        {
          "to": "codec",
          "kind": "relation",
          "label": {
            "zh": "参与组成",
            "en": "Component"
          },
          "from": "asoc"
        },
        {
          "to": "asoc",
          "kind": "relation",
          "label": {
            "zh": "描述连接",
            "en": "Describes links"
          },
          "from": "board"
        }
      ]
    },
    "questions": [
      {
        "q": {
          "zh": "为什么拆成组件？",
          "en": "Why split components?"
        },
        "a": {
          "zh": "同一 Codec 可用于不同板子；独立驱动减少重复实现。",
          "en": "A codec can serve different boards; separate drivers reduce duplication."
        }
      },
      {
        "q": {
          "zh": "谁知道板子怎样连接？",
          "en": "Who knows board wiring?"
        },
        "a": {
          "zh": "Machine 层描述组件间连接及板级配置，再将组件绑定为声卡。",
          "en": "The machine layer describes links and board settings, binding components into a card."
        }
      },
      {
        "q": {
          "zh": "它负责逐样本处理吗？",
          "en": "Does it process every sample?"
        },
        "a": {
          "zh": "框架主要组织与控制组件；实际数据通路要看 DMA、DSP 和接口硬件。",
          "en": "It organizes and controls components; the data path depends on DMA, DSP and interface hardware."
        }
      }
    ],
    "scope": {
      "zh": "这是职责划分，不限定驱动文件数量或某个 Android BSP 的拓扑。",
      "en": "A role model, not a driver-file count or a particular Android BSP topology."
    },
    "sources": [
      {
        "title": "ASoC overview",
        "url": "https://docs.kernel.org/sound/soc/overview.html"
      },
      {
        "title": "ASoC machine driver",
        "url": "https://docs.kernel.org/sound/soc/machine.html"
      },
      {
        "title": "ASoC platform driver",
        "url": "https://docs.kernel.org/sound/soc/platform.html"
      }
    ]
  },
  "dma": {
    "definition": {
      "zh": "DMA 是由硬件搬运数据、减少 CPU 逐次复制负担的机制。在直接 DMA 音频播放中，驱动设置缓冲和传输，DMA 引擎把内存中的样本送给音频控制器。",
      "en": "DMA uses hardware to move data, reducing CPU copying. In direct-DMA playback, a driver configures buffers and transfers while the DMA engine feeds memory samples to an audio controller."
    },
    "note": {
      "zh": "DMA 搬运进度不等于扬声器已发声，也不能证明整条链路零拷贝。",
      "en": "DMA progress is not audible presentation and does not prove end-to-end zero-copy."
    },
    "position": {
      "zh": "内核驱动控制硬件搬运；数据跨内存与设备边界。",
      "en": "Kernel drivers control hardware transfers between memory and devices."
    },
    "diagram": {
      "caption": {
        "zh": "直接 DMA 播放示例：配置、样本搬运与进度分开。",
        "en": "Direct-DMA playback example: configuration, samples and progress are separate."
      },
      "nodes": [
        {
          "id": "driver",
          "col": 1,
          "row": 0,
          "label": {
            "zh": "内核驱动",
            "en": "Kernel driver"
          },
          "sub": {
            "zh": "配置并处理进度",
            "en": "Setup and progress"
          }
        },
        {
          "id": "buffer",
          "col": 0,
          "row": 1,
          "label": {
            "zh": "内存缓冲",
            "en": "Memory buffer"
          },
          "sub": {
            "zh": "待播放 PCM",
            "en": "PCM to play"
          }
        },
        {
          "id": "dma",
          "col": 1,
          "row": 1,
          "label": {
            "zh": "DMA 引擎",
            "en": "DMA engine"
          },
          "sub": {
            "zh": "硬件执行搬运",
            "en": "Hardware transfer"
          },
          "focus": true
        },
        {
          "id": "controller",
          "col": 2,
          "row": 1,
          "label": {
            "zh": "音频控制器",
            "en": "Audio controller"
          },
          "sub": {
            "zh": "接收数字样本",
            "en": "Receives samples"
          }
        }
      ],
      "edges": [
        {
          "to": "dma",
          "kind": "control",
          "label": {
            "zh": "配置并启动",
            "en": "Configure / start"
          },
          "from": "driver"
        },
        {
          "to": "dma",
          "kind": "data",
          "label": {
            "zh": "读取 PCM",
            "en": "Read PCM"
          },
          "from": "buffer"
        },
        {
          "to": "controller",
          "kind": "data",
          "label": {
            "zh": "送入样本",
            "en": "Feed samples"
          },
          "from": "dma"
        },
        {
          "to": "driver",
          "kind": "reply",
          "label": {
            "zh": "传输进度",
            "en": "Transfer progress"
          },
          "from": "dma"
        }
      ]
    },
    "questions": [
      {
        "q": {
          "zh": "CPU 还要做什么？",
          "en": "What does the CPU still do?"
        },
        "a": {
          "zh": "驱动准备缓冲、配置并启停传输，也处理进度；硬件承担搬运。",
          "en": "The driver prepares buffers, configures and starts/stops transfers, and handles progress; hardware moves data."
        }
      },
      {
        "q": {
          "zh": "进度反馈有什么用？",
          "en": "Why report progress?"
        },
        "a": {
          "zh": "帮助驱动跟踪缓冲消耗并通知声音子系统继续供数。",
          "en": "It helps drivers track buffer consumption and notify the sound subsystem to supply more data."
        }
      },
      {
        "q": {
          "zh": "为什么不代表已经听到？",
          "en": "Why is progress not sound?"
        },
        "a": {
          "zh": "数据可能仍在控制器或后续硬件内，搬运与最终输出是不同环节。",
          "en": "Data may remain in the controller or downstream hardware; transfer and presentation are separate stages."
        }
      }
    ],
    "scope": {
      "zh": "仅示意内存直接供给音频控制器的路径；反馈折叠了底层中断或回调处理，不是所有 DSP/设备的实现。",
      "en": "Only a memory-to-controller example. Feedback abstracts interrupt or callback handling; DSP and device paths may differ."
    },
    "sources": [
      {
        "title": "DMAengine client API",
        "url": "https://docs.kernel.org/driver-api/dmaengine/client.html"
      },
      {
        "title": "Writing an ALSA Driver",
        "url": "https://docs.kernel.org/sound/kernel-api/writing-an-alsa-driver.html"
      },
      {
        "title": "ASoC platform driver",
        "url": "https://docs.kernel.org/sound/soc/platform.html"
      },
      {
        "title": "Dynamic PCM",
        "url": "https://docs.kernel.org/sound/soc/dpcm.html"
      }
    ]
  },
  "dai": {
    "definition": {
      "zh": "DAI 是数字音频接口；在 ASoC 中，也指描述该接口能力与操作的软件抽象。SoC 侧与 Codec 侧分别声明支持的格式、采样率等参数，由驱动协商配置。",
      "en": "A DAI is a digital audio interface; in ASoC it also denotes the software abstraction for interface capabilities and operations. SoC and codec sides expose supported formats and rates for driver configuration."
    },
    "note": {
      "zh": "CPU DAI 指 SoC 侧接口，不是 CPU 必须逐个处理音频样本。",
      "en": "CPU DAI means the SoC-side interface, not per-sample CPU processing."
    },
    "position": {
      "zh": "ASoC 组件驱动中的数字接口描述与配置边界。",
      "en": "Digital-interface descriptions and configuration in ASoC component drivers."
    },
    "diagram": {
      "caption": {
        "zh": "接口关系图：DAI link 描述两端连接，不是新增数据处理器。",
        "en": "Interface relationships: a DAI link describes endpoints, not another processor."
      },
      "nodes": [
        {
          "id": "cpu",
          "col": 0,
          "row": 0,
          "label": {
            "zh": "CPU DAI",
            "en": "CPU DAI"
          },
          "sub": {
            "zh": "SoC 侧接口",
            "en": "SoC endpoint"
          }
        },
        {
          "id": "link",
          "col": 1,
          "row": 0,
          "label": {
            "zh": "DAI link",
            "en": "DAI link"
          },
          "sub": {
            "zh": "连接关系",
            "en": "Endpoint connection"
          },
          "focus": true
        },
        {
          "id": "codec",
          "col": 2,
          "row": 0,
          "label": {
            "zh": "Codec DAI",
            "en": "Codec DAI"
          },
          "sub": {
            "zh": "Codec 侧接口",
            "en": "Codec endpoint"
          }
        }
      ],
      "edges": [
        {
          "to": "link",
          "kind": "relation",
          "label": {
            "zh": "连接端点",
            "en": "Endpoint"
          },
          "from": "cpu"
        },
        {
          "to": "codec",
          "kind": "relation",
          "label": {
            "zh": "连接端点",
            "en": "Endpoint"
          },
          "from": "link"
        }
      ]
    },
    "questions": [
      {
        "q": {
          "zh": "为什么要声明能力？",
          "en": "Why declare capabilities?"
        },
        "a": {
          "zh": "配置流时需要找到两端都支持的参数，接口能连接不代表所有格式都可用。",
          "en": "Stream setup needs compatible endpoint parameters; a link does not imply support for every format."
        }
      },
      {
        "q": {
          "zh": "DAI 和 I²S 相同吗？",
          "en": "Is DAI the same as I²S?"
        },
        "a": {
          "zh": "I²S 是一种数字音频接口形式；DAI 是更广的概念。",
          "en": "I²S is one digital audio interface type; DAI is broader."
        }
      },
      {
        "q": {
          "zh": "谁描述两端关系？",
          "en": "Who describes the link?"
        },
        "a": {
          "zh": "ASoC 的板级声卡描述包含 DAI link，把相应组件端点连接起来。",
          "en": "The ASoC board/card description includes DAI links joining component endpoints."
        }
      }
    ],
    "scope": {
      "zh": "图是简单 SoC—Codec 连接；不声称所有链路都为一对一或使用 I²S。",
      "en": "Shows a simple SoC–codec link; not all links are one-to-one or use I²S."
    },
    "sources": [
      {
        "title": "ASoC codec driver",
        "url": "https://docs.kernel.org/sound/soc/codec.html"
      },
      {
        "title": "ASoC platform driver",
        "url": "https://docs.kernel.org/sound/soc/platform.html"
      },
      {
        "title": "ASoC machine driver",
        "url": "https://docs.kernel.org/sound/soc/machine.html"
      },
      {
        "title": "ASoC digital audio interfaces",
        "url": "https://docs.kernel.org/sound/soc/dai.html"
      }
    ]
  },
  "dapm": {
    "definition": {
      "zh": "DAPM 是 ASoC 的动态音频电源管理机制，根据活动音频流和已选路由判断哪些硬件需要开启。驱动描述功能块及连接，框架据此协调供电，减少闲置部分的耗电。",
      "en": "DAPM is ASoC’s audio power-management mechanism, using active streams and selected routes to decide which hardware is needed. Drivers describe blocks and connections so the framework can power down unused parts."
    },
    "note": {
      "zh": "DAPM 管理电源状态，不是让 PCM 样本通过的软件处理通道。",
      "en": "DAPM manages power state; it is not a software PCM-processing channel."
    },
    "position": {
      "zh": "Linux ASoC 核心与组件、板级路由描述。",
      "en": "Linux ASoC core plus component and board routing descriptions."
    },
    "diagram": {
      "caption": {
        "zh": "控制关系图：状态与路由参与电源决策，线不承载 PCM。",
        "en": "Control relationships: state and routes inform power decisions, not PCM transport."
      },
      "nodes": [
        {
          "id": "state",
          "col": 0,
          "row": 0,
          "label": {
            "zh": "流与路由状态",
            "en": "Stream / route state"
          },
          "sub": {
            "zh": "活动流和通路选择",
            "en": "Activity and route choice"
          }
        },
        {
          "id": "dapm",
          "col": 1,
          "row": 0,
          "label": {
            "zh": "DAPM",
            "en": "DAPM"
          },
          "sub": {
            "zh": "判断需要的功能块",
            "en": "Select needed blocks"
          },
          "focus": true
        },
        {
          "id": "blocks",
          "col": 2,
          "row": 0,
          "label": {
            "zh": "音频硬件块",
            "en": "Audio hardware blocks"
          },
          "sub": {
            "zh": "如 DAC 与功放",
            "en": "E.g. DAC and amplifier"
          }
        },
        {
          "id": "graph",
          "col": 1,
          "row": 1,
          "label": {
            "zh": "驱动路由图",
            "en": "Driver route graph"
          },
          "sub": {
            "zh": "功能块与连接",
            "en": "Blocks and connections"
          }
        }
      ],
      "edges": [
        {
          "to": "dapm",
          "kind": "control",
          "label": {
            "zh": "更新状态",
            "en": "Update state"
          },
          "from": "state"
        },
        {
          "to": "dapm",
          "kind": "relation",
          "label": {
            "zh": "提供连接模型",
            "en": "Connection model"
          },
          "from": "graph"
        },
        {
          "to": "blocks",
          "kind": "control",
          "label": {
            "zh": "管理电源状态",
            "en": "Manage power"
          },
          "from": "dapm"
        }
      ]
    },
    "questions": [
      {
        "q": {
          "zh": "为什么不是整颗芯片一直开着？",
          "en": "Why not leave everything on?"
        },
        "a": {
          "zh": "播放只需部分路径；关闭闲置功能块可以减少耗电。",
          "en": "Playback may need only part of a device; unused blocks can be powered down."
        }
      },
      {
        "q": {
          "zh": "它怎样知道哪些块相关？",
          "en": "How are relevant blocks found?"
        },
        "a": {
          "zh": "驱动提供功能块和路由图，DAPM 结合流活动及混音器设置判断。",
          "en": "Drivers supply blocks and routes; DAPM combines them with stream activity and mixer settings."
        }
      },
      {
        "q": {
          "zh": "它会混音或改变样本吗？",
          "en": "Does it mix or alter samples?"
        },
        "a": {
          "zh": "不会因为经过电源决策就处理样本；混音与转换由相应音频功能块承担。",
          "en": "Power decisions do not process samples; audio blocks perform mixing and conversion."
        }
      }
    ],
    "scope": {
      "zh": "这是 ASoC 电源职责示意，不是完整开关电顺序；实际功能块及供电约束由声卡描述决定。",
      "en": "Shows ASoC power roles, not a complete switching sequence; card descriptions determine blocks and supply constraints."
    },
    "sources": [
      {
        "title": "Dynamic Audio Power Management",
        "url": "https://docs.kernel.org/sound/soc/dapm.html"
      },
      {
        "title": "ASoC overview",
        "url": "https://docs.kernel.org/sound/soc/overview.html"
      }
    ]
  },
  "dac": {
    "definition": {
      "zh": "DAC 是把数字音频样本转换成模拟信号的硬件功能块，位于数字处理与模拟输出之间。它可以集成在音频 Codec 等器件中，为后续模拟输出电路提供信号。",
      "en": "A DAC converts digital audio samples to an analog signal at the digital-to-analog boundary. It can be integrated into an audio codec and feed downstream analog output circuitry."
    },
    "note": {
      "zh": "DAC 做数模转换，不等于媒体文件解码器或驱动扬声器的功放。",
      "en": "A DAC performs conversion; it is neither a media-file decoder nor a speaker power amplifier."
    },
    "position": {
      "zh": "音频硬件中的数字到模拟边界。",
      "en": "The digital-to-analog boundary in audio hardware."
    },
    "diagram": {
      "caption": {
        "zh": "模拟输出示例：DAC 前是数字样本，之后是模拟信号。",
        "en": "Analog-output example: digital samples before the DAC, analog signal after it."
      },
      "nodes": [
        {
          "id": "samples",
          "col": 0,
          "row": 0,
          "label": {
            "zh": "数字样本",
            "en": "Digital samples"
          },
          "sub": {
            "zh": "数字音频输入",
            "en": "Digital audio input"
          }
        },
        {
          "id": "dac",
          "col": 1,
          "row": 0,
          "label": {
            "zh": "DAC",
            "en": "DAC"
          },
          "sub": {
            "zh": "数模转换",
            "en": "Digital to analog"
          },
          "focus": true
        },
        {
          "id": "analog",
          "col": 2,
          "row": 0,
          "label": {
            "zh": "模拟输出电路",
            "en": "Analog output stage"
          },
          "sub": {
            "zh": "后续放大等电路",
            "en": "Downstream amplification"
          }
        }
      ],
      "edges": [
        {
          "to": "dac",
          "kind": "data",
          "label": {
            "zh": "数字样本",
            "en": "Digital samples"
          },
          "from": "samples"
        },
        {
          "to": "analog",
          "kind": "data",
          "label": {
            "zh": "模拟信号",
            "en": "Analog signal"
          },
          "from": "dac"
        }
      ]
    },
    "questions": [
      {
        "q": {
          "zh": "为什么需要它？",
          "en": "Why is it needed?"
        },
        "a": {
          "zh": "数字样本与模拟电路使用的信号形式不同，DAC 负责这一转换。",
          "en": "Digital samples and analog circuits use different signal representations; the DAC converts between them."
        }
      },
      {
        "q": {
          "zh": "它一定是独立芯片吗？",
          "en": "Must it be a separate chip?"
        },
        "a": {
          "zh": "不一定。图中画的是功能边界，不是芯片封装数量。",
          "en": "No. The diagram shows functional boundaries, not chip-package counts."
        }
      },
      {
        "q": {
          "zh": "USB 播放也在手机内转换吗？",
          "en": "Must USB output convert in the phone?"
        },
        "a": {
          "zh": "不一定；USB 数字音频可以送到外设，由外设完成模拟转换。",
          "en": "No; USB digital audio can reach a peripheral that performs the analog conversion."
        }
      }
    ],
    "scope": {
      "zh": "仅解释模拟输出的转换环节；数字输出的转换位置取决于终端设备。",
      "en": "Explains analog-output conversion; digital-output conversion location depends on the endpoint device."
    },
    "sources": [
      {
        "title": "AOSP audio terminology",
        "url": "https://source.android.com/docs/core/audio/terminology"
      },
      {
        "title": "Dynamic Audio Power Management",
        "url": "https://docs.kernel.org/sound/soc/dapm.html"
      },
      {
        "title": "AOSP USB digital audio",
        "url": "https://source.android.com/docs/core/audio/usb"
      }
    ]
  },
  "codec": {
    "definition": {
      "zh": "这里的 Codec 指音频硬件组件，常把数字音频接口、数模或模数转换及音量控制等功能组合起来。内核驱动配置它的参数与路由，芯片内的功能块实际处理信号。",
      "en": "Here, codec means audio hardware combining a digital interface, conversion and controls. Kernel drivers configure parameters and routes; hardware blocks handle the signals."
    },
    "note": {
      "zh": "音频 Codec 硬件与 AAC 等媒体压缩编解码算法不是同一个概念。",
      "en": "Audio codec hardware is distinct from media-compression codecs such as AAC."
    },
    "position": {
      "zh": "硬件音频路径及其内核组件驱动。",
      "en": "Hardware audio path and its kernel component driver."
    },
    "diagram": {
      "caption": {
        "zh": "带模拟输出的 Codec 示例：控制接口与音频输入分开。",
        "en": "Codec with analog output: separate control and audio inputs."
      },
      "nodes": [
        {
          "id": "driver",
          "col": 1,
          "row": 0,
          "label": {
            "zh": "Codec 驱动",
            "en": "Codec driver"
          },
          "sub": {
            "zh": "内核中的配置代码",
            "en": "Kernel configuration"
          }
        },
        {
          "id": "soc",
          "col": 0,
          "row": 1,
          "label": {
            "zh": "音频控制器",
            "en": "Audio controller"
          },
          "sub": {
            "zh": "数字音频输出",
            "en": "Digital audio output"
          }
        },
        {
          "id": "codec",
          "col": 1,
          "row": 1,
          "label": {
            "zh": "Codec 硬件",
            "en": "Codec hardware"
          },
          "sub": {
            "zh": "接口与转换功能",
            "en": "Interface and conversion"
          },
          "focus": true
        },
        {
          "id": "output",
          "col": 2,
          "row": 1,
          "label": {
            "zh": "模拟输出",
            "en": "Analog output"
          },
          "sub": {
            "zh": "后续输出电路",
            "en": "Output circuitry"
          }
        }
      ],
      "edges": [
        {
          "to": "codec",
          "kind": "control",
          "label": {
            "zh": "配置寄存器",
            "en": "Configure registers"
          },
          "from": "driver"
        },
        {
          "to": "codec",
          "kind": "data",
          "label": {
            "zh": "数字样本",
            "en": "Digital samples"
          },
          "from": "soc"
        },
        {
          "to": "output",
          "kind": "data",
          "label": {
            "zh": "模拟信号",
            "en": "Analog signal"
          },
          "from": "codec"
        }
      ]
    },
    "questions": [
      {
        "q": {
          "zh": "驱动与芯片各做什么？",
          "en": "Driver versus chip?"
        },
        "a": {
          "zh": "驱动设置控制项；硬件按配置处理音频信号。",
          "en": "The driver sets controls; hardware handles signals according to that configuration."
        }
      },
      {
        "q": {
          "zh": "控制和样本共用接口吗？",
          "en": "Do controls share the sample interface?"
        },
        "a": {
          "zh": "不一定；常见设计用 I²C 或 SPI 配置寄存器，另用数字音频接口传样本。",
          "en": "Not necessarily: common designs use I²C or SPI for registers and a digital audio interface for samples."
        }
      },
      {
        "q": {
          "zh": "每个 Codec 都有相同功能吗？",
          "en": "Do all codecs have the same features?"
        },
        "a": {
          "zh": "没有。输入输出、转换器和控制能力需要查看具体器件资料。",
          "en": "No. Inputs, outputs, converters and controls depend on the device."
        }
      }
    ],
    "scope": {
      "zh": "图选带 DAC 的硬件 Codec；ASoC 的 codec 组件类别更广，不保证对应一颗独立转换芯片。",
      "en": "Shows hardware with a DAC. ASoC’s codec component category is broader and need not identify a separate converter chip."
    },
    "sources": [
      {
        "title": "ASoC codec driver",
        "url": "https://docs.kernel.org/sound/soc/codec.html"
      },
      {
        "title": "ASoC overview",
        "url": "https://docs.kernel.org/sound/soc/overview.html"
      },
      {
        "title": "AOSP audio terminology",
        "url": "https://source.android.com/docs/core/audio/terminology"
      }
    ]
  },
  "i2s": {
    "definition": {
      "zh": "I²S 是芯片之间传送数字音频的接口，常连接 SoC 音频控制器与 Codec。发送端提供样本，接收端按双方约定的时钟与格式接收，控制配置则是另一项职责。",
      "en": "I²S carries digital audio between chips, often an SoC audio controller and a codec. A receiver accepts samples using agreed clocks and format; control configuration is a separate role."
    },
    "note": {
      "zh": "I²S 传音频样本，不能与常用于寄存器控制的 I²C 混为一谈。",
      "en": "I²S carries audio samples; it is distinct from I²C register control."
    },
    "position": {
      "zh": "音频硬件之间的数字接口。",
      "en": "Digital interface between audio hardware components."
    },
    "diagram": {
      "caption": {
        "zh": "I²S 播放连接示例：直接连接端点；上方为驱动配置。",
        "en": "I²S playback example: directly connected endpoints with driver configuration above."
      },
      "nodes": [
        {
          "id": "driver",
          "col": 1,
          "row": 0,
          "label": {
            "zh": "接口驱动",
            "en": "Interface drivers"
          },
          "sub": {
            "zh": "配置两端参数",
            "en": "Configure endpoints"
          }
        },
        {
          "id": "soc",
          "col": 0,
          "row": 1,
          "label": {
            "zh": "SoC 控制器",
            "en": "SoC controller"
          },
          "sub": {
            "zh": "发送端",
            "en": "Transmitter"
          }
        },
        {
          "id": "codec",
          "col": 1,
          "row": 1,
          "label": {
            "zh": "Codec 接口",
            "en": "Codec interface"
          },
          "sub": {
            "zh": "接收端",
            "en": "Receiver"
          },
          "focus": true
        }
      ],
      "edges": [
        {
          "to": "soc",
          "kind": "control",
          "label": {
            "zh": "配置接口",
            "en": "Configure interface"
          },
          "from": "driver"
        },
        {
          "to": "codec",
          "kind": "control",
          "label": {
            "zh": "配置接口",
            "en": "Configure interface"
          },
          "from": "driver"
        },
        {
          "to": "codec",
          "kind": "data",
          "label": {
            "zh": "I²S 数字音频",
            "en": "I²S digital audio"
          },
          "from": "soc"
        }
      ]
    },
    "questions": [
      {
        "q": {
          "zh": "它负责传什么？",
          "en": "What does it carry?"
        },
        "a": {
          "zh": "这里传数字音频样本，不是模拟声波，也不是播放文件的路径名。",
          "en": "Here it carries digital audio samples, not analog sound or a media-file pathname."
        }
      },
      {
        "q": {
          "zh": "接上数据线就能播放吗？",
          "en": "Is a data wire enough?"
        },
        "a": {
          "zh": "两端还需使用兼容的格式和时钟配置，才能正确解释样本。",
          "en": "Endpoints also need compatible format and clock settings to interpret samples."
        }
      },
      {
        "q": {
          "zh": "所有设备都用它吗？",
          "en": "Does every device use it?"
        },
        "a": {
          "zh": "不是；其他数字接口和 USB 音频等路径有不同的连接方式。",
          "en": "No; other digital interfaces and USB audio use different connections."
        }
      }
    ],
    "scope": {
      "zh": "只画一个播放方向，不规定哪端提供时钟，也不包含完整引脚或电气时序。",
      "en": "Shows one playback direction; does not prescribe the clock provider or show pin-level timing."
    },
    "sources": [
      {
        "title": "ASoC digital audio interfaces",
        "url": "https://docs.kernel.org/sound/soc/dai.html"
      },
      {
        "title": "ASoC codec driver",
        "url": "https://docs.kernel.org/sound/soc/codec.html"
      },
      {
        "title": "AOSP USB digital audio",
        "url": "https://source.android.com/docs/core/audio/usb"
      }
    ]
  },
  "dsp": {
    "definition": {
      "zh": "DSP 是用于数字信号处理的处理器，在音频系统中可承担处理及路由任务，减轻应用处理器的负担。它运行的固件与硬件能力决定具体功能，并非每条播放路径都需要它。",
      "en": "A DSP is a processor for digital signal processing; audio systems may use it for processing and routing to reduce application-processor work. Hardware and firmware determine its capabilities, and it is not required on every path."
    },
    "note": {
      "zh": "音频经过 DSP，不代表传入的一定是压缩数据或启用了压缩音频卸载。",
      "en": "A DSP path does not imply compressed input or compressed-audio offload."
    },
    "position": {
      "zh": "可选音频处理硬件及固件，由对应驱动协作控制。",
      "en": "Optional audio hardware and firmware coordinated by device drivers."
    },
    "diagram": {
      "caption": {
        "zh": "PCM 经过 DSP 的示例：路由控制与样本路径分开。",
        "en": "Example PCM path through a DSP, with routing control separate from samples."
      },
      "nodes": [
        {
          "id": "driver",
          "col": 1,
          "row": 0,
          "label": {
            "zh": "DSP 驱动",
            "en": "DSP driver"
          },
          "sub": {
            "zh": "配置处理与路由",
            "en": "Configure processing"
          }
        },
        {
          "id": "pcm",
          "col": 0,
          "row": 1,
          "label": {
            "zh": "PCM 输入",
            "en": "PCM input"
          },
          "sub": {
            "zh": "未压缩样本",
            "en": "Uncompressed samples"
          }
        },
        {
          "id": "dsp",
          "col": 1,
          "row": 1,
          "label": {
            "zh": "DSP",
            "en": "DSP"
          },
          "sub": {
            "zh": "固件处理或路由",
            "en": "Firmware processing"
          },
          "focus": true
        },
        {
          "id": "dai",
          "col": 2,
          "row": 1,
          "label": {
            "zh": "输出接口",
            "en": "Output interface"
          },
          "sub": {
            "zh": "连接音频端点",
            "en": "Connects audio endpoint"
          }
        }
      ],
      "edges": [
        {
          "to": "dsp",
          "kind": "control",
          "label": {
            "zh": "配置路由",
            "en": "Configure routing"
          },
          "from": "driver"
        },
        {
          "to": "dsp",
          "kind": "data",
          "label": {
            "zh": "PCM 样本",
            "en": "PCM samples"
          },
          "from": "pcm"
        },
        {
          "to": "dai",
          "kind": "data",
          "label": {
            "zh": "输出样本",
            "en": "Output samples"
          },
          "from": "dsp"
        }
      ]
    },
    "questions": [
      {
        "q": {
          "zh": "为什么让 DSP 参与？",
          "en": "Why use a DSP?"
        },
        "a": {
          "zh": "它可承担专门的信号处理，让应用处理器减少相应工作。",
          "en": "It can handle dedicated signal processing, reducing work on the application processor."
        }
      },
      {
        "q": {
          "zh": "它怎样接入 ALSA？",
          "en": "How can it connect to ALSA?"
        },
        "a": {
          "zh": "一种方式是驱动暴露前端 PCM，再把 DSP 路径连接到后端数字接口。",
          "en": "One model exposes front-end PCMs and connects DSP paths to back-end digital interfaces."
        }
      },
      {
        "q": {
          "zh": "它总在做媒体解码吗？",
          "en": "Is it always decoding media?"
        },
        "a": {
          "zh": "不是。输入可以已经是 PCM；处理、路由和压缩解码不是同一项工作。",
          "en": "No. Input may already be PCM; processing, routing and compressed decoding are distinct tasks."
        }
      }
    ],
    "scope": {
      "zh": "图参考 ASoC Dynamic PCM 的概念模型，不证明某个高通 Android BSP 的固件或实际拓扑。",
      "en": "Uses the ASoC Dynamic PCM model; it does not establish firmware behavior or topology for a Qualcomm Android BSP."
    },
    "sources": [
      {
        "title": "AOSP audio terminology",
        "url": "https://source.android.com/docs/core/audio/terminology"
      },
      {
        "title": "Dynamic PCM",
        "url": "https://docs.kernel.org/sound/soc/dpcm.html"
      },
      {
        "title": "ASoC platform driver",
        "url": "https://docs.kernel.org/sound/soc/platform.html"
      }
    ]
  },
  "fmq": {
    "reviewedAt": "2026-11-09",
    "definition": {
      "zh": "FMQ 是进程之间通过共享内存队列交换消息的机制，用来减少频繁传输的通信开销。本页的 AIDL 非 MMAP 音频流分别用命令、响应和音频字节队列，双方按约定读写。",
      "en": "FMQ exchanges messages between processes through shared-memory queues to reduce frequent-transfer overhead. The AIDL non-MMAP audio stream shown here uses separate command, reply and audio-byte queues."
    },
    "note": {
      "zh": "FMQ 是通信机制，不是音频格式；数据队列也不是硬件播放缓冲。",
      "en": "FMQ is a communication mechanism, not an audio format or hardware playback buffer."
    },
    "position": {
      "zh": "原生进程之间的共享内存通信边界。",
      "en": "Shared-memory communication between native processes."
    },
    "diagram": {
      "caption": {
        "zh": "AIDL 非 MMAP 输出示例：三类队列是共享通道，不是处理层。",
        "en": "AIDL non-MMAP output: three shared channels, not processing layers."
      },
      "nodes": [
        {
          "id": "fw",
          "col": 0,
          "row": 0,
          "label": {
            "zh": "框架端",
            "en": "Framework side"
          },
          "sub": {
            "zh": "读写流队列",
            "en": "Reads / writes queues"
          }
        },
        {
          "id": "data",
          "col": 1,
          "row": 0,
          "label": {
            "zh": "数据 FMQ",
            "en": "Audio FMQ"
          },
          "sub": {
            "zh": "音频字节",
            "en": "Audio bytes"
          },
          "focus": true
        },
        {
          "id": "hal",
          "col": 2,
          "row": 0,
          "label": {
            "zh": "HAL 端",
            "en": "HAL side"
          },
          "sub": {
            "zh": "读写流队列",
            "en": "Reads / writes queues"
          }
        },
        {
          "id": "cmd",
          "col": 1,
          "row": 1,
          "label": {
            "zh": "命令／响应 FMQ",
            "en": "Command / reply FMQs"
          },
          "sub": {
            "zh": "两条独立队列",
            "en": "Two separate queues"
          }
        }
      ],
      "edges": [
        {
          "to": "data",
          "kind": "data",
          "label": {
            "zh": "写 PCM",
            "en": "Write PCM"
          },
          "from": "fw"
        },
        {
          "to": "hal",
          "kind": "data",
          "label": {
            "zh": "读 PCM",
            "en": "Read PCM"
          },
          "from": "data"
        },
        {
          "to": "cmd",
          "kind": "control",
          "label": {
            "zh": "写命令",
            "en": "Write commands"
          },
          "from": "fw"
        },
        {
          "to": "hal",
          "kind": "control",
          "label": {
            "zh": "读命令",
            "en": "Read commands"
          },
          "from": "cmd"
        },
        {
          "to": "cmd",
          "kind": "reply",
          "label": {
            "zh": "写响应",
            "en": "Write replies"
          },
          "from": "hal"
        },
        {
          "to": "fw",
          "kind": "reply",
          "label": {
            "zh": "读响应",
            "en": "Read replies"
          },
          "from": "cmd"
        }
      ]
    },
    "questions": [
      {
        "q": {
          "zh": "为何不把每批样本当作普通调用？",
          "en": "Why a queue for repeated transfers?"
        },
        "a": {
          "zh": "共享队列适合持续交换数据；接口可先传递队列描述符，让两端访问同一队列。",
          "en": "Shared queues suit repeated transfers; an interface can pass a descriptor so both sides access a queue."
        }
      },
      {
        "q": {
          "zh": "命令与样本是什么关系？",
          "en": "How do commands relate to samples?"
        },
        "a": {
          "zh": "输出时先写 audio.fmq，再发送 burst 并读取回复。该数据队列只供本次传输使用，HAL 取出全部队列数据；实际消费量由 reply.fmqByteCount 报告，未消费部分由框架客户端在后续传输重送。",
          "en": "Output writes audio.fmq, sends burst and reads the reply. This data queue is transient: HAL drains it, reports actual consumption through reply.fmqByteCount, and the framework client re-sends unconsumed bytes in a later transfer."
        }
      },
      {
        "q": {
          "zh": "响应表示声音已经播出吗？",
          "en": "Does a reply mean sound was heard?"
        },
        "a": {
          "zh": "不能仅凭消费量判断扬声器呈现量；HAL 后面还有设备路径。",
          "en": "Consumption alone is not speaker presentation; the device path continues beyond the HAL."
        }
      }
    ],
    "scope": {
      "zh": "本图限定已核对的 AIDL 非 MMAP PCM 输出，省略完整状态机和异步回调；不推断端到端零拷贝。",
      "en": "Limited to the checked AIDL non-MMAP PCM output; omits the full state machine and asynchronous callbacks, and implies no end-to-end zero-copy."
    },
    "sources": [
      {
        "title": "Fast Message Queue with AIDL",
        "url": "https://source.android.com/docs/core/architecture/aidl/fmq"
      },
      {
        "title": "StreamDescriptor.aidl · Android 17 r1",
        "url": "https://android.googlesource.com/platform/hardware/interfaces/+/refs/tags/android-17.0.0_r1/audio/aidl/android/hardware/audio/core/StreamDescriptor.aidl"
      }
    ]
  },
  "pcm": {
    "definition": {
      "zh": "PCM 用定期采样并量化的数值表示声音，是音频缓冲和处理链路中常见的数据形式。解释这些数值还需要采样率、声道数与采样格式等信息，只有字节并不足以还原含义。",
      "en": "PCM represents sound as regularly sampled, quantized values, commonly used in audio buffers and processing. Sample rate, channels and sample format are needed to interpret the bytes."
    },
    "note": {
      "zh": "PCM 是声音数据的表示方式，不是播放器、共享队列或传输协议。",
      "en": "PCM is an audio representation, not a player, shared queue or transport protocol."
    },
    "position": {
      "zh": "跨软件缓冲与数字音频链路的数据表示。",
      "en": "Data representation in software buffers and digital audio paths."
    },
    "diagram": {
      "caption": {
        "zh": "数据与格式关系图：参数解释样本，不代表三个串行处理阶段。",
        "en": "Data/format relationships, not three serial processing stages."
      },
      "nodes": [
        {
          "id": "params",
          "col": 0,
          "row": 0,
          "label": {
            "zh": "格式参数",
            "en": "Format parameters"
          },
          "sub": {
            "zh": "采样率／声道／格式",
            "en": "Rate / channels / format"
          }
        },
        {
          "id": "pcm",
          "col": 1,
          "row": 0,
          "label": {
            "zh": "PCM 样本",
            "en": "PCM samples"
          },
          "sub": {
            "zh": "表示各时刻的声音",
            "en": "Values over time"
          },
          "focus": true
        },
        {
          "id": "buffer",
          "col": 2,
          "row": 0,
          "label": {
            "zh": "音频缓冲",
            "en": "Audio buffer"
          },
          "sub": {
            "zh": "存放样本字节",
            "en": "Stores sample bytes"
          }
        }
      ],
      "edges": [
        {
          "to": "pcm",
          "kind": "relation",
          "label": {
            "zh": "约定解释方式",
            "en": "Defines meaning"
          },
          "from": "params"
        },
        {
          "to": "buffer",
          "kind": "relation",
          "label": {
            "zh": "存放于缓冲",
            "en": "Stored in buffer"
          },
          "from": "pcm"
        }
      ]
    },
    "questions": [
      {
        "q": {
          "zh": "一个样本和一帧一样吗？",
          "en": "Is a sample a frame?"
        },
        "a": {
          "zh": "样本是一个声道在一个时刻的值；一帧含该时刻各声道的样本。",
          "en": "A sample is one channel’s value at one time; a frame contains the channels’ samples at that time."
        }
      },
      {
        "q": {
          "zh": "为什么要知道格式？",
          "en": "Why know the format?"
        },
        "a": {
          "zh": "同样的字节按不同位宽或数值格式解释，会得到不同的样本值。",
          "en": "Different widths or numeric formats interpret the same bytes as different sample values."
        }
      },
      {
        "q": {
          "zh": "与 AAC 等压缩音频有何区别？",
          "en": "How does it differ from AAC?"
        },
        "a": {
          "zh": "这里的 PCM 直接表示样本；压缩媒体通常需解码成样本后再进行相应处理。",
          "en": "PCM here directly represents samples; compressed media is typically decoded into samples for processing."
        }
      }
    ],
    "scope": {
      "zh": "本条聚焦常用线性 PCM；不展开所有 PCM 变体、存储布局或压缩直通路径。",
      "en": "Focuses on common linear PCM, not all PCM variants, storage layouts or compressed passthrough paths."
    },
    "sources": [
      {
        "title": "AOSP audio terminology",
        "url": "https://source.android.com/docs/core/audio/terminology"
      },
      {
        "title": "AOSP audio data formats",
        "url": "https://source.android.com/docs/core/audio/data_formats"
      }
    ]
  }
};

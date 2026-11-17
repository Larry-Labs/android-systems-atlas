// Original explanations; source boundaries recorded in docs/GLOSSARY-DRIVER-SOURCES.md.
export const metadata = [
  {
    "id": "period",
    "term": "ALSA period",
    "aliases": [
      "period",
      "snd_pcm_period_elapsed"
    ],
    "full": "ALSA PCM period",
    "name": {
      "zh": "PCM进度通知粒度",
      "en": "PCM progress notification unit"
    },
    "domain": "audio",
    "source": "https://docs.kernel.org/sound/kernel-api/writing-an-alsa-driver.html"
  },
  {
    "id": "tinyalsa",
    "term": "tinyalsa",
    "full": "TinyALSA",
    "name": {
      "zh": "ALSA用户态访问库",
      "en": "ALSA user-space access library"
    },
    "domain": "audio",
    "source": "https://github.com/tinyalsa/tinyalsa"
  },
  {
    "id": "mmap",
    "term": "mmap",
    "aliases": [
      "mmap()"
    ],
    "full": "Memory mapping",
    "name": {
      "zh": "内存映射与音频 MMAP 路径",
      "en": "Memory mapping and audio MMAP paths"
    },
    "domain": "audio",
    "source": "https://man7.org/linux/man-pages/man2/mmap.2.html"
  }
];
export const termEntries = {
  "period": {
    "definition": {
      "zh": "ALSA period 是PCM缓冲配置中的一段帧数，用作进度通知的粒度。在常见的周期通知模式下，播放位置越过相应边界时驱动通知ALSA，后者更新位置、可用空间并唤醒等待者。",
      "en": "An ALSA period is a configured number of PCM frames used as a progress-notification unit. In the common period-notification mode, drivers notify ALSA of progress across period boundaries so it can update position, available space and waiting clients."
    },
    "note": {
      "zh": "period通知不等于扬声器已经出声，也不能假定一次中断永远对应一个period。",
      "en": "A period notification does not prove audible output; one interrupt need not equal one period."
    },
    "position": {
      "zh": "Linux内核ALSA PCM缓冲管理；连接硬件进展、驱动通知和内核状态更新。",
      "en": "Linux ALSA PCM buffering: hardware progress, driver notification and core state updates."
    },
    "diagram": {
      "caption": {
        "zh": "反馈关系：图中没有传输PCM样本。硬件位置由驱动提供。",
        "en": "Feedback relationships, not PCM sample transfer. The driver supplies hardware position."
      },
      "nodes": [
        {
          "id": "hw",
          "col": 0,
          "row": 0,
          "label": {
            "zh": "硬件位置",
            "en": "Hardware position"
          },
          "sub": {
            "zh": "缓冲消费进展",
            "en": "Buffer consumption"
          },
          "focus": false
        },
        {
          "id": "driver",
          "col": 1,
          "row": 0,
          "label": {
            "zh": "驱动",
            "en": "Driver"
          },
          "sub": {
            "zh": "通知period进展",
            "en": "Notify period progress"
          },
          "focus": true
        },
        {
          "id": "alsa",
          "col": 2,
          "row": 0,
          "label": {
            "zh": "ALSA PCM",
            "en": "ALSA PCM"
          },
          "sub": {
            "zh": "更新位置与空间",
            "en": "Position and free space"
          },
          "focus": false
        }
      ],
      "edges": [
        {
          "from": "hw",
          "to": "driver",
          "kind": "reply",
          "label": {
            "zh": "进展事件",
            "en": "Progress event"
          }
        },
        {
          "from": "driver",
          "to": "alsa",
          "kind": "reply",
          "label": {
            "zh": "period通知",
            "en": "Period notification"
          }
        }
      ]
    },
    "questions": [
      {
        "q": {
          "zh": "进度具体是什么？",
          "en": "What progresses?"
        },
        "a": {
          "zh": "播放时硬件在缓冲中消费样本的位置向前推进，释放出的空间可用于继续供数。",
          "en": "During playback, the hardware position advances through the buffer, making space available for more samples."
        }
      },
      {
        "q": {
          "zh": "驱动怎样通知？",
          "en": "How does the driver notify?"
        },
        "a": {
          "zh": "常见方式是调用snd_pcm_period_elapsed；ALSA通过pointer回调取得硬件位置。中断或定时机制取决于实现。",
          "en": "Commonly via snd_pcm_period_elapsed; ALSA obtains position through the pointer callback. Interrupt or timer mechanisms vary."
        }
      },
      {
        "q": {
          "zh": "通知一次就播放完了吗？",
          "en": "Does one notification mean playback finished?"
        },
        "a": {
          "zh": "不是。它是持续播放中的缓冲进展，后续硬件路径还可能存在延迟。",
          "en": "No. It reports buffer progress during ongoing playback; downstream hardware may add delay."
        }
      }
    ],
    "scope": {
      "zh": "说明ALSA PCM的常见周期通知机制，不涵盖关闭周期唤醒（no_period_wakeup）的配置，也不规定设备中断频率或DSP协议。",
      "en": "Common ALSA PCM period notifications; configurations disabling period wakeups (no_period_wakeup) are outside this example. Interrupt rates and DSP protocols vary."
    },
    "sources": [
      {
        "title": "Linux: PCM interrupt handler and pointer callback",
        "url": "https://docs.kernel.org/sound/kernel-api/writing-an-alsa-driver.html"
      }
    ]
  },
  "tinyalsa": {
    "definition": {
      "zh": "tinyalsa是用户空间中访问Linux ALSA内核接口的小型库，提供PCM播放/录音和混音器控制API。采用ALSA后端的Audio HAL可以调用它完成设备访问。",
      "en": "tinyalsa is a small user-space library for Linux ALSA kernel interfaces, providing PCM playback/capture and mixer-control APIs. An Audio HAL using an ALSA backend can call it for device access."
    },
    "note": {
      "zh": "tinyalsa不是内核驱动，也不是完整的Android Audio HAL；mixer控制API不等于软件混音引擎。",
      "en": "tinyalsa is neither a kernel driver nor a complete Android Audio HAL; mixer controls are not a software mixing engine."
    },
    "position": {
      "zh": "用户空间的设备访问库；在本图中由HAL实现侧使用。",
      "en": "User-space device-access library, used by the HAL implementation in this diagram."
    },
    "diagram": {
      "caption": {
        "zh": "调用关系示例：HAL经用户态库访问ALSA内核接口，具体硬件路径在下游。",
        "en": "Example call relationships: the HAL accesses ALSA kernel interfaces through a user-space library."
      },
      "nodes": [
        {
          "id": "hal",
          "col": 0,
          "row": 0,
          "label": {
            "zh": "HAL后端",
            "en": "HAL backend"
          },
          "sub": {
            "zh": "调用设备访问API",
            "en": "Device-access calls"
          },
          "focus": false
        },
        {
          "id": "tiny",
          "col": 1,
          "row": 0,
          "label": {
            "zh": "tinyalsa",
            "en": "tinyalsa"
          },
          "sub": {
            "zh": "用户态库",
            "en": "User-space library"
          },
          "focus": true
        },
        {
          "id": "kernel",
          "col": 2,
          "row": 0,
          "label": {
            "zh": "ALSA内核接口",
            "en": "ALSA kernel API"
          },
          "sub": {
            "zh": "内核侧设备访问",
            "en": "Kernel device access"
          },
          "focus": false
        }
      ],
      "edges": [
        {
          "from": "hal",
          "to": "tiny",
          "kind": "control",
          "label": {
            "zh": "调用API",
            "en": "API calls"
          }
        },
        {
          "from": "tiny",
          "to": "kernel",
          "kind": "control",
          "label": {
            "zh": "访问内核接口",
            "en": "Kernel access"
          }
        }
      ]
    },
    "questions": [
      {
        "q": {
          "zh": "它解决什么问题？",
          "en": "What does it provide?"
        },
        "a": {
          "zh": "为调用者提供基础PCM和混音器控制接口，减少直接处理ALSA内核接口的工作。",
          "en": "Basic PCM and mixer APIs reduce direct handling of ALSA kernel interfaces."
        }
      },
      {
        "q": {
          "zh": "在音频链路中负责什么？",
          "en": "What is its role here?"
        },
        "a": {
          "zh": "HAL后端可借助它打开和配置PCM设备、提交音频，并读取或设置混音器控件。",
          "en": "A HAL backend can open/configure PCM devices, submit audio and read or set mixer controls."
        }
      },
      {
        "q": {
          "zh": "所有Android设备都必须用吗？",
          "en": "Must every Android device use it?"
        },
        "a": {
          "zh": "不能这样推断。HAL的标准接口与内部后端实现是不同层面的约定，应查看具体产品代码。",
          "en": "No such inference follows. HAL interfaces and internal backends are different concerns; check the product code."
        }
      }
    ],
    "scope": {
      "zh": "说明库的基础职责及本图选定的ALSA后端；不代表每个厂商HAL或DSP方案的实现。",
      "en": "Library responsibilities and this diagram’s selected ALSA backend, not every vendor HAL or DSP implementation."
    },
    "sources": [
      {
        "title": "TinyALSA: project README and API scope",
        "url": "https://github.com/tinyalsa/tinyalsa"
      },
      {
        "title": "AOSP: Audio HAL",
        "url": "https://source.android.com/docs/core/audio/implement"
      }
    ]
  },
  "mmap": {
    "definition": {
      "zh": "mmap 在进程虚拟地址空间建立映射，可映射文件／设备区域，也可建立匿名映射，让程序通过内存地址访问该区域。在音频里，它可用于访问 PCM 缓冲；Android 的 MMAP 音频路径还需要相应服务、HAL 和驱动配合。",
      "en": "mmap establishes a mapping in a process’s virtual address space, backed by a file/device or anonymous memory, for access through memory addresses. Audio can use it to access PCM buffers; Android’s MMAP audio path also requires service, HAL and driver support."
    },
    "note": {
      "zh": "“非 MMAP 音频路径”不等于整条链路没有共享内存；普通 AudioTrack 缓冲与 FMQ 也可使用共享内存。内存映射本身不保证端到端零拷贝或固定低延迟。",
      "en": "A non-MMAP audio path can still use shared memory, including ordinary AudioTrack buffers and FMQs. Mapping alone guarantees neither end-to-end zero-copy nor fixed low latency."
    },
    "position": {
      "zh": "Linux：进程虚拟内存与文件／设备之间的映射机制。Android 音频：MMAP 是利用映射缓冲的特定数据路径，不能与任意共享缓冲画等号。",
      "en": "Linux: a mapping mechanism between process virtual memory and files/devices. Android audio: MMAP names a specific mapped-buffer data path, not any shared buffer."
    },
    "diagram": {
      "caption": {
        "zh": "映射关系示意，不是依次转发样本的三层链路。音频映射对象可以是 PCM 缓冲，建立映射与后续读写是不同操作。",
        "en": "Mapping relationships, not three sequential sample-forwarding layers. Audio may map a PCM buffer; establishing the mapping and later accessing it are distinct operations."
      },
      "nodes": [
        {
          "id": "process",
          "col": 0,
          "row": 0,
          "label": {
            "zh": "进程",
            "en": "Process"
          },
          "sub": {
            "zh": "请求建立映射",
            "en": "Requests a mapping"
          },
          "focus": false
        },
        {
          "id": "mapping",
          "col": 1,
          "row": 0,
          "label": {
            "zh": "虚拟地址区间",
            "en": "Virtual address range"
          },
          "sub": {
            "zh": "通过地址访问",
            "en": "Access via addresses"
          },
          "focus": true
        },
        {
          "id": "backing",
          "col": 2,
          "row": 0,
          "label": {
            "zh": "文件／设备区域",
            "en": "File / device region"
          },
          "sub": {
            "zh": "音频例：PCM 缓冲",
            "en": "Audio example: PCM buffer"
          },
          "focus": false
        }
      ],
      "edges": [
        {
          "from": "process",
          "to": "mapping",
          "kind": "control",
          "label": {
            "zh": "mmap() 建立",
            "en": "mmap() establishes"
          }
        },
        {
          "from": "mapping",
          "to": "backing",
          "kind": "relation",
          "label": {
            "zh": "映射关联",
            "en": "Mapping relationship"
          }
        }
      ]
    },
    "questions": [
      {
        "q": {
          "zh": "它解决什么问题？",
          "en": "What problem does it solve?"
        },
        "a": {
          "zh": "程序获得一段可访问的虚拟地址，用普通内存访问操作读取或写入映射区域。它仍需遵守权限、缓冲位置与同步约定，并非可以随意覆盖正在播放的数据。",
          "en": "A program obtains virtual addresses for reading or writing the mapped region with memory accesses. Permissions, buffer positions and synchronization still apply; data currently playing cannot simply be overwritten."
        }
      },
      {
        "q": {
          "zh": "ALSA mmap 与 Android MMAP 是同一层含义吗？",
          "en": "Do ALSA mmap and Android MMAP mean the same thing?"
        },
        "a": {
          "zh": "ALSA mmap 指 PCM 缓冲的一种访问方式；AAudio MMAP 是 Android 的一条音频路径。其独占模式可让应用直接写映射缓冲，共享模式则由 audioserver 中的混音器使用该缓冲。",
          "en": "ALSA mmap is a PCM buffer access mode; AAudio MMAP is an Android audio path. Exclusive mode can let the app write the mapped buffer directly; shared mode uses it from a mixer in audioserver."
        }
      },
      {
        "q": {
          "zh": "本页为什么写“非 mmap”？",
          "en": "Why does this page say “non-mmap”?"
        },
        "a": {
          "zh": "主图选择普通 AudioTrack / 非 MMAP 路径；驱动例子另选 ALSA 非 mmap 写入。前者限定 Android 音频路径，后者限定内核缓冲访问方式，不能凭前者推断所有 HAL 后端都采用后者。",
          "en": "The main diagram selects ordinary AudioTrack / non-MMAP playback, while the driver example separately selects ALSA non-mmap writes. These constrain the Android path and kernel buffer access respectively; the former does not determine every HAL backend’s access mode."
        }
      }
    ],
    "scope": {
      "zh": "适用于理解 Linux 映射机制及本页两种语境。AAudio 在 Android 8.0 引入，MMAP 支持从 Android 8.1 增强；实际是否使用该路径需检查设备支持、策略与流配置，不能仅看 Android 版本。",
      "en": "Covers Linux mapping and the two contexts on this page. AAudio arrived in Android 8.0, with MMAP enhancements in 8.1. Actual use depends on device support, policy and stream configuration, not the Android version alone."
    },
    "sources": [
      {
        "title": "Linux man-pages: mmap(2)",
        "url": "https://man7.org/linux/man-pages/man2/mmap.2.html"
      },
      {
        "title": "AOSP: AAudio and MMAP",
        "url": "https://source.android.com/docs/core/audio/aaudio"
      }
    ]
  }
};

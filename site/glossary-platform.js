// Original bilingual teaching summaries; evidence and limits: docs/GLOSSARY-PLATFORM-SOURCES.md.
export const termEntries = {
  "aosp": {
    "definition": {
      "zh": "AOSP 是公开提供 Android 平台源代码的开源项目，包含框架、系统服务等基础实现。开发者和设备厂商可在此基础上修改、适配并构建自己的系统。",
      "en": "AOSP provides the public source code for Android, including framework and system-service implementations. Developers and device makers adapt it to build systems."
    },
    "note": {
      "zh": "AOSP 源码不等于某款设备出厂系统的全部软件。",
      "en": "AOSP source is not the complete software shipped on a particular device."
    },
    "position": {
      "zh": "平台源码基础，不是运行中的一层服务。",
      "en": "Platform source base, not a running service layer."
    },
    "diagram": {
      "caption": {
        "zh": "源码组成关系示意；连线不表示运行时调用。",
        "en": "Source relationships, not runtime calls."
      },
      "nodes": [
        {
          "id": "aosp",
          "col": 1,
          "row": 0,
          "label": {
            "zh": "AOSP",
            "en": "AOSP"
          },
          "sub": {
            "zh": "公开平台源码",
            "en": "Public platform source"
          },
          "focus": true
        },
        {
          "id": "framework",
          "col": 0,
          "row": 0,
          "label": {
            "zh": "框架",
            "en": "Framework"
          },
          "sub": {
            "zh": "应用使用的接口",
            "en": "App-facing APIs"
          }
        },
        {
          "id": "services",
          "col": 2,
          "row": 0,
          "label": {
            "zh": "系统服务",
            "en": "System services"
          },
          "sub": {
            "zh": "提供系统能力",
            "en": "System capabilities"
          }
        },
        {
          "id": "vendor",
          "col": 1,
          "row": 1,
          "label": {
            "zh": "设备实现",
            "en": "Device implementation"
          },
          "sub": {
            "zh": "适配与集成",
            "en": "Adaptation and integration"
          }
        }
      ],
      "edges": [
        {
          "from": "aosp",
          "to": "framework",
          "kind": "relation",
          "label": {
            "zh": "包含",
            "en": "includes"
          }
        },
        {
          "from": "aosp",
          "to": "services",
          "kind": "relation",
          "label": {
            "zh": "包含",
            "en": "includes"
          }
        },
        {
          "from": "aosp",
          "to": "vendor",
          "kind": "relation",
          "label": {
            "zh": "源码基础",
            "en": "source base"
          }
        }
      ]
    },
    "questions": [
      {
        "q": {
          "zh": "为什么需要共同源码？",
          "en": "Why a common source base?"
        },
        "a": {
          "zh": "设备可以复用平台能力，再实现各自的硬件适配。",
          "en": "Devices reuse platform capabilities and add hardware adaptation."
        }
      },
      {
        "q": {
          "zh": "源码和运行层级是什么关系？",
          "en": "How does source relate to layers?"
        },
        "a": {
          "zh": "源码构建出多个不同职责的组件；AOSP 本身不是调用途中的进程。",
          "en": "Source builds components with different roles; AOSP itself is not a process hop."
        }
      },
      {
        "q": {
          "zh": "改完源码就算兼容 Android 吗？",
          "en": "Does modifying AOSP ensure compatibility?"
        },
        "a": {
          "zh": "不能据此判断；Android 兼容性计划另有要求。",
          "en": "No. The Android Compatibility Program imposes separate requirements."
        }
      }
    ],
    "scope": {
      "zh": "仅展示平台源码与设备实现的关系，不列全组件或某厂商的软件清单。",
      "en": "Shows platform-source relationships, not every component or an OEM software inventory."
    },
    "sources": [
      {
        "title": "AOSP architecture overview",
        "url": "https://source.android.com/docs/core/architecture"
      },
      {
        "title": "AOSP FAQ — compatibility",
        "url": "https://source.android.com/docs/setup/about/faqs"
      }
    ]
  },
  "hal": {
    "definition": {
      "zh": "HAL 是 Android 系统使用硬件能力的接口边界，由设备厂商提供相应实现。系统侧按约定调用，厂商侧处理设备差异，使上层不必跟着每种驱动一起改动。",
      "en": "A HAL provides an interface boundary for Android hardware capabilities, implemented by device vendors. It keeps upper layers independent of device-specific details."
    },
    "note": {
      "zh": "HAL 不等于内核驱动；两者承担不同的适配职责。",
      "en": "A HAL is not a kernel driver; they have different adaptation roles."
    },
    "position": {
      "zh": "系统服务与设备相关实现之间。",
      "en": "Between system services and device-specific implementations."
    },
    "diagram": {
      "caption": {
        "zh": "接口职责关系；不是所有 HAL 的固定进程或数据通路。",
        "en": "Interface roles, not a universal process or data path."
      },
      "nodes": [
        {
          "id": "client",
          "col": 0,
          "row": 0,
          "label": {
            "zh": "系统侧调用方",
            "en": "System client"
          },
          "sub": {
            "zh": "使用硬件能力",
            "en": "Uses hardware features"
          }
        },
        {
          "id": "hal",
          "col": 1,
          "row": 0,
          "label": {
            "zh": "HAL 接口",
            "en": "HAL interface"
          },
          "sub": {
            "zh": "共同约定",
            "en": "Shared contract"
          },
          "focus": true
        },
        {
          "id": "impl",
          "col": 2,
          "row": 0,
          "label": {
            "zh": "厂商实现",
            "en": "Vendor implementation"
          },
          "sub": {
            "zh": "设备相关代码",
            "en": "Device-specific code"
          }
        }
      ],
      "edges": [
        {
          "from": "client",
          "to": "hal",
          "kind": "relation",
          "label": {
            "zh": "使用",
            "en": "uses"
          }
        },
        {
          "from": "hal",
          "to": "impl",
          "kind": "relation",
          "label": {
            "zh": "由其实现",
            "en": "implemented by"
          }
        }
      ]
    },
    "questions": [
      {
        "q": {
          "zh": "为什么不让上层直接适配每种芯片？",
          "en": "Why abstract device details?"
        },
        "a": {
          "zh": "统一接口让系统侧复用调用方式，厂商负责具体硬件差异。",
          "en": "A common interface lets system clients reuse calls while vendors handle hardware differences."
        }
      },
      {
        "q": {
          "zh": "接口和实现有什么不同？",
          "en": "Contract or implementation?"
        },
        "a": {
          "zh": "接口规定可用操作和数据；实现完成这些操作。",
          "en": "The contract specifies operations and data; the implementation performs them."
        }
      },
      {
        "q": {
          "zh": "HAL 一定单独运行吗？",
          "en": "Must a HAL run separately?"
        },
        "a": {
          "zh": "不能只看名字判断；既有跨进程 HAL，也有受限制的同进程 HAL。",
          "en": "No. Binderized HALs and restricted same-process HALs both exist."
        }
      }
    ],
    "scope": {
      "zh": "按具体子系统核对接口和进程安排；图不规定内核后端或厂商 BSP。",
      "en": "Check interface and process arrangements per subsystem; no kernel backend or vendor BSP is prescribed."
    },
    "sources": [
      {
        "title": "HAL overview",
        "url": "https://source.android.com/docs/core/architecture/hal"
      },
      {
        "title": "AOSP architecture overview",
        "url": "https://source.android.com/docs/core/architecture"
      }
    ]
  },
  "aidl": {
    "definition": {
      "zh": "AIDL 用接口文件描述双方约定的方法和数据类型，常用于 Android 跨进程服务。构建工具据此生成绑定代码，让调用方和服务方按相同约定交换参数与结果。",
      "en": "AIDL describes methods and data types for Android interfaces, commonly used across processes. Build tools generate bindings so clients and services share a contract."
    },
    "note": {
      "zh": "AIDL 是接口描述和生成工具，不是搬运请求的内核驱动。",
      "en": "AIDL describes interfaces and generates bindings; it is not the kernel transport."
    },
    "position": {
      "zh": "接口源码与生成的调用代码之间。",
      "en": "Between interface source and generated call bindings."
    },
    "diagram": {
      "caption": {
        "zh": "构建关系：接口生成绑定；图中没有运行时数据流。",
        "en": "Build relationships: generated bindings, not runtime data flow."
      },
      "nodes": [
        {
          "id": "client",
          "col": 0,
          "row": 0,
          "label": {
            "zh": "客户端绑定",
            "en": "Client binding"
          },
          "sub": {
            "zh": "构建生成",
            "en": "Build output"
          }
        },
        {
          "id": "aidl",
          "col": 1,
          "row": 0,
          "label": {
            "zh": "AIDL 接口",
            "en": "AIDL interface"
          },
          "sub": {
            "zh": "方法与数据类型",
            "en": "Methods and data types"
          },
          "focus": true
        },
        {
          "id": "service",
          "col": 2,
          "row": 0,
          "label": {
            "zh": "服务端绑定",
            "en": "Service binding"
          },
          "sub": {
            "zh": "连接服务实现",
            "en": "Connects service code"
          }
        }
      ],
      "edges": [
        {
          "from": "aidl",
          "to": "client",
          "kind": "relation",
          "label": {
            "zh": "生成依据",
            "en": "generated from"
          }
        },
        {
          "from": "aidl",
          "to": "service",
          "kind": "relation",
          "label": {
            "zh": "生成依据",
            "en": "generated from"
          }
        }
      ]
    },
    "questions": [
      {
        "q": {
          "zh": "它省去了什么工作？",
          "en": "What work does it save?"
        },
        "a": {
          "zh": "生成代码处理约定的数据封装，让双方不必各写一套消息格式。",
          "en": "Generated code handles agreed data packaging instead of separate hand-written message formats."
        }
      },
      {
        "q": {
          "zh": "AIDL 和 Binder 谁负责什么？",
          "en": "How does Binder fit in?"
        },
        "a": {
          "zh": "AIDL 定义接口并生成绑定；跨进程调用使用 Binder 机制。",
          "en": "AIDL defines the contract and bindings; Binder provides cross-process calls."
        }
      },
      {
        "q": {
          "zh": "写好接口就有服务功能了吗？",
          "en": "Does an interface implement the service?"
        },
        "a": {
          "zh": "没有，仍需编写方法实现；生成的绑定只连接调用与实现。",
          "en": "No. Service methods still need implementation; bindings connect calls to that code."
        }
      }
    ],
    "scope": {
      "zh": "这是构建概念图；应用服务与平台 HAL 的接口稳定性要求须分别核对。",
      "en": "A build concept diagram; app services and platform HALs have different stability requirements."
    },
    "sources": [
      {
        "title": "AIDL overview",
        "url": "https://source.android.com/docs/core/architecture/aidl"
      },
      {
        "title": "AIDL app-service guide — official mirror",
        "url": "https://developer.android.google.cn/develop/background-work/services/aidl"
      }
    ]
  },
  "hidl": {
    "definition": {
      "zh": "HIDL 是描述 HAL 方法与数据类型的接口语言，用共同约定连接系统侧代码和硬件实现。阅读已有设备或较早的 Android 接口时，仍可能遇到它定义的服务。",
      "en": "HIDL describes HAL methods and data types, connecting system clients with hardware implementations. Its interfaces remain relevant when reading existing devices and older code."
    },
    "note": {
      "zh": "HIDL 专页标明 Android 10 起弃用、转向 AIDL；弃用不等于所有设备立即移除。",
      "en": "The HIDL page marks deprecation from Android 10 in favor of AIDL; this is not immediate removal everywhere."
    },
    "position": {
      "zh": "已有 HAL 的接口定义与绑定。",
      "en": "Interface definitions and bindings for existing HALs."
    },
    "diagram": {
      "caption": {
        "zh": "HIDL 接口关系；不是具体传输方式或迁移时间表。",
        "en": "HIDL contract relationships, not a transport or migration timeline."
      },
      "nodes": [
        {
          "id": "client",
          "col": 0,
          "row": 0,
          "label": {
            "zh": "HAL 调用方",
            "en": "HAL client"
          },
          "sub": {
            "zh": "按接口使用",
            "en": "Uses the contract"
          }
        },
        {
          "id": "hidl",
          "col": 1,
          "row": 0,
          "label": {
            "zh": "HIDL 定义",
            "en": "HIDL definition"
          },
          "sub": {
            "zh": "方法和类型",
            "en": "Methods and types"
          },
          "focus": true
        },
        {
          "id": "impl",
          "col": 2,
          "row": 0,
          "label": {
            "zh": "HAL 实现",
            "en": "HAL implementation"
          },
          "sub": {
            "zh": "遵守接口",
            "en": "Implements the contract"
          }
        }
      ],
      "edges": [
        {
          "from": "client",
          "to": "hidl",
          "kind": "relation",
          "label": {
            "zh": "共同约定",
            "en": "shared contract"
          }
        },
        {
          "from": "hidl",
          "to": "impl",
          "kind": "relation",
          "label": {
            "zh": "共同约定",
            "en": "shared contract"
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
          "zh": "分别编译的系统侧与 HAL 代码，需要一致的方法签名和数据结构。",
          "en": "Separately compiled clients and HALs need consistent method signatures and data structures."
        }
      },
      {
        "q": {
          "zh": "看到 HIDL 就一定跨进程吗？",
          "en": "Does HIDL always mean IPC?"
        },
        "a": {
          "zh": "常见 binderized HAL 跨进程；另有 passthrough 模式，不能混为一谈。",
          "en": "Binderized HALs cross processes; passthrough mode is a distinct arrangement."
        }
      },
      {
        "q": {
          "zh": "为何旧接口仍值得读？",
          "en": "Why read old interfaces?"
        },
        "a": {
          "zh": "维护现有设备仍会遇到它；新开发方向是 AIDL，迁移须按子系统核对。",
          "en": "Existing devices still need maintenance; AIDL is the new-development direction, with subsystem-specific migration."
        }
      }
    ],
    "scope": {
      "zh": "弃用年份按 HIDL 专页表述；HAL 总览另写 Android 13。两者不能当作所有 HAL 的移除日期。",
      "en": "Deprecation wording follows the HIDL page; HAL overview instead says Android 13. Neither establishes universal HAL removal dates."
    },
    "sources": [
      {
        "title": "HIDL",
        "url": "https://source.android.com/docs/core/architecture/hidl"
      },
      {
        "title": "HAL overview",
        "url": "https://source.android.com/docs/core/architecture/hal"
      }
    ]
  },
  "binder": {
    "definition": {
      "zh": "Binder 是 Android 的进程间通信机制，让调用方通过代理请求另一进程中的服务执行操作。请求和参数经内核驱动送达服务端，同步调用的结果再沿通信机制返回。",
      "en": "Binder lets a proxy request work from a service in another Android process. Its kernel driver carries transactions, with replies for synchronous calls."
    },
    "note": {
      "zh": "跨进程调用像本地调用，不代表所有音视频样本都经 Binder 搬运。",
      "en": "Local-looking calls do not mean all audiovisual samples travel through Binder."
    },
    "position": {
      "zh": "进程中的通信代码与内核 Binder 驱动协作。",
      "en": "Process-side bindings cooperate with the kernel Binder driver."
    },
    "diagram": {
      "caption": {
        "zh": "同步远程调用示意；请求与返回不是连续媒体数据流。",
        "en": "One synchronous remote call; requests and replies are not a media stream."
      },
      "nodes": [
        {
          "id": "client",
          "col": 0,
          "row": 0,
          "label": {
            "zh": "客户端代理",
            "en": "Client proxy"
          },
          "sub": {
            "zh": "进程 A",
            "en": "Process A"
          }
        },
        {
          "id": "binder",
          "col": 1,
          "row": 0,
          "label": {
            "zh": "Binder 驱动",
            "en": "Binder driver"
          },
          "sub": {
            "zh": "内核",
            "en": "Kernel"
          },
          "focus": true
        },
        {
          "id": "server",
          "col": 2,
          "row": 0,
          "label": {
            "zh": "服务端",
            "en": "Service endpoint"
          },
          "sub": {
            "zh": "进程 B",
            "en": "Process B"
          }
        }
      ],
      "edges": [
        {
          "from": "client",
          "to": "binder",
          "kind": "control",
          "label": {
            "zh": "请求与参数",
            "en": "request + arguments"
          }
        },
        {
          "from": "binder",
          "to": "server",
          "kind": "control",
          "label": {
            "zh": "派发请求",
            "en": "dispatch request"
          }
        },
        {
          "from": "server",
          "to": "binder",
          "kind": "reply",
          "label": {
            "zh": "调用结果",
            "en": "call result"
          }
        },
        {
          "from": "binder",
          "to": "client",
          "kind": "reply",
          "label": {
            "zh": "返回结果",
            "en": "return result"
          }
        }
      ]
    },
    "questions": [
      {
        "q": {
          "zh": "为什么需要代理？",
          "en": "Why a proxy?"
        },
        "a": {
          "zh": "它把调用封装成事务，由服务端解包并执行目标方法。",
          "en": "It packages calls into transactions that the service unpacks and executes."
        }
      },
      {
        "q": {
          "zh": "谁真正执行服务方法？",
          "en": "Who executes the method?"
        },
        "a": {
          "zh": "服务所在进程的线程；内核驱动负责跨进程传递事务。",
          "en": "A service-process thread; the kernel driver transports the transaction."
        }
      },
      {
        "q": {
          "zh": "媒体大数据也必须这样传吗？",
          "en": "Must media payloads use this path?"
        },
        "a": {
          "zh": "不必；接口可结合共享内存队列，将数据通道与调用分开。",
          "en": "No. Interfaces can combine calls with shared-memory queues for data."
        }
      }
    ],
    "scope": {
      "zh": "仅画同步远程调用；不覆盖单向调用、回调或完整线程调度。",
      "en": "Only synchronous remote calls are drawn, not oneway calls, callbacks or full thread scheduling."
    },
    "sources": [
      {
        "title": "Binder overview",
        "url": "https://source.android.com/docs/core/architecture/ipc/binder-overview"
      },
      {
        "title": "Fast Message Queue with AIDL",
        "url": "https://source.android.com/docs/core/architecture/aidl/fmq"
      }
    ]
  },
  "ipc": {
    "definition": {
      "zh": "IPC 是不同进程之间交换请求、结果或数据的统称，并不是某一个 Android 服务。进程各自运行，通过约定的通信机制协作；Binder 和共享内存队列是不同的例子。",
      "en": "IPC means communication between processes, not a particular Android service. Processes cooperate using mechanisms such as Binder calls or shared-memory queues."
    },
    "note": {
      "zh": "同一进程内跨 Java 与 C++ 的 JNI 调用，本身不属于 IPC。",
      "en": "A JNI call between Java and C++ in one process is not itself IPC."
    },
    "position": {
      "zh": "跨越进程边界的协作机制。",
      "en": "Mechanisms that cross process boundaries."
    },
    "diagram": {
      "caption": {
        "zh": "IPC 机制分类关系；不是必须串联的传输路径。",
        "en": "IPC mechanism relationships, not a serial transport pipeline."
      },
      "nodes": [
        {
          "id": "binder",
          "col": 0,
          "row": 0,
          "label": {
            "zh": "Binder",
            "en": "Binder"
          },
          "sub": {
            "zh": "跨进程调用",
            "en": "Cross-process calls"
          }
        },
        {
          "id": "ipc",
          "col": 1,
          "row": 0,
          "label": {
            "zh": "IPC",
            "en": "IPC"
          },
          "sub": {
            "zh": "进程间协作",
            "en": "Process communication"
          },
          "focus": true
        },
        {
          "id": "queue",
          "col": 2,
          "row": 0,
          "label": {
            "zh": "共享内存队列",
            "en": "Shared-memory queue"
          },
          "sub": {
            "zh": "例如 FMQ",
            "en": "For example, FMQ"
          }
        }
      ],
      "edges": [
        {
          "from": "ipc",
          "to": "binder",
          "kind": "relation",
          "label": {
            "zh": "一种机制",
            "en": "one mechanism"
          }
        },
        {
          "from": "ipc",
          "to": "queue",
          "kind": "relation",
          "label": {
            "zh": "一种机制",
            "en": "one mechanism"
          }
        }
      ]
    },
    "questions": [
      {
        "q": {
          "zh": "为什么不能当普通函数调用看？",
          "en": "Why not an ordinary call?"
        },
        "a": {
          "zh": "接收方在另一个进程，需要约定如何传递和解释信息。",
          "en": "The receiver is in another process, requiring a way to transfer and interpret information."
        }
      },
      {
        "q": {
          "zh": "调用和数据能走不同通道吗？",
          "en": "Can calls and data use different paths?"
        },
        "a": {
          "zh": "可以，例如先建立通信关系，再用共享内存队列传数据。",
          "en": "Yes: establish communication first, then exchange data through a shared-memory queue."
        }
      },
      {
        "q": {
          "zh": "IPC 和 Binder 是同义词吗？",
          "en": "Are IPC and Binder synonyms?"
        },
        "a": {
          "zh": "不是。IPC 是类别，Binder 是 Android 使用的一种具体机制。",
          "en": "No. IPC is the category; Binder is one Android mechanism."
        }
      }
    ],
    "scope": {
      "zh": "仅列本站涉及的两类例子，不是所有 IPC 机制的清单。",
      "en": "These are two relevant examples, not an exhaustive IPC catalogue."
    },
    "sources": [
      {
        "title": "Binder overview",
        "url": "https://source.android.com/docs/core/architecture/ipc/binder-overview"
      },
      {
        "title": "Fast Message Queue with AIDL",
        "url": "https://source.android.com/docs/core/architecture/aidl/fmq"
      },
      {
        "title": "JNI tips — Google official mirror",
        "url": "https://developer.android.google.cn/ndk/guides/jni-tips"
      }
    ]
  },
  "jni": {
    "definition": {
      "zh": "JNI 是 Android 中让 Java 或 Kotlin 对应的托管代码与 C/C++ 原生代码交互的接口。它连接同一进程内的两种代码环境，让应用或系统代码使用原生库的能力。",
      "en": "JNI lets managed code originating from Java or Kotlin interact with native C/C++ code. It connects these code environments within a process to use native libraries."
    },
    "note": {
      "zh": "JNI 跨语言与运行时边界，本身不是 Binder 式跨进程通信。",
      "en": "JNI crosses language/runtime boundaries; it is not Binder-style IPC."
    },
    "position": {
      "zh": "同一进程内，托管代码与原生库之间。",
      "en": "Between managed code and native libraries in one process."
    },
    "diagram": {
      "caption": {
        "zh": "同进程接口关系；连线不代表跨进程消息。",
        "en": "Same-process interface relationships, not interprocess messages."
      },
      "nodes": [
        {
          "id": "managed",
          "col": 0,
          "row": 0,
          "label": {
            "zh": "托管代码",
            "en": "Managed code"
          },
          "sub": {
            "zh": "Java / Kotlin",
            "en": "Java / Kotlin"
          }
        },
        {
          "id": "jni",
          "col": 1,
          "row": 0,
          "label": {
            "zh": "JNI",
            "en": "JNI"
          },
          "sub": {
            "zh": "语言接口边界",
            "en": "Language interface"
          },
          "focus": true
        },
        {
          "id": "native",
          "col": 2,
          "row": 0,
          "label": {
            "zh": "原生代码",
            "en": "Native code"
          },
          "sub": {
            "zh": "C / C++ 库",
            "en": "C / C++ libraries"
          }
        }
      ],
      "edges": [
        {
          "from": "managed",
          "to": "jni",
          "kind": "relation",
          "label": {
            "zh": "通过接口交互",
            "en": "interface access"
          }
        },
        {
          "from": "jni",
          "to": "native",
          "kind": "relation",
          "label": {
            "zh": "通过接口交互",
            "en": "interface access"
          }
        }
      ]
    },
    "questions": [
      {
        "q": {
          "zh": "为什么要用 JNI？",
          "en": "Why use JNI?"
        },
        "a": {
          "zh": "已有的 C/C++ 库可以通过它与托管代码协作。",
          "en": "It connects existing C/C++ libraries with managed code."
        }
      },
      {
        "q": {
          "zh": "只能从 Java 调 C++ 吗？",
          "en": "Only Java calling C++?"
        },
        "a": {
          "zh": "不是，原生代码也可通过 JNI 访问托管对象并调用方法。",
          "en": "No. Native code can also access managed objects and invoke methods through JNI."
        }
      },
      {
        "q": {
          "zh": "用了 JNI 就调用了远程服务吗？",
          "en": "Does JNI imply a remote service?"
        },
        "a": {
          "zh": "没有；原生代码如需联系另一进程，还要使用 Binder 等 IPC 机制。",
          "en": "No. Native code needs an IPC mechanism such as Binder to reach another process."
        }
      }
    ],
    "scope": {
      "zh": "这里说明 Android 同进程交互；不展开引用生命周期、线程附着或性能优化。",
      "en": "Covers Android same-process interaction, not reference lifetimes, thread attachment or performance tuning."
    },
    "sources": [
      {
        "title": "JNI tips — Google official mirror",
        "url": "https://developer.android.google.cn/ndk/guides/jni-tips"
      },
      {
        "title": "Binder overview",
        "url": "https://source.android.com/docs/core/architecture/ipc/binder-overview"
      }
    ]
  },
  "art": {
    "definition": {
      "zh": "ART 是 Android 应用及部分系统服务执行托管代码的运行环境，负责执行 DEX 代码。它还管理对象内存和垃圾回收，使代码在进程内运行，而不是充当硬件请求的转发站。",
      "en": "ART runs DEX code for Android apps and some system services. It also manages objects and garbage collection rather than forwarding hardware requests."
    },
    "note": {
      "zh": "ART 是代码的运行支撑，不是每次硬件调用必经的独立服务层。",
      "en": "ART supports execution; it is not a mandatory separate service hop for hardware calls."
    },
    "position": {
      "zh": "执行托管代码的进程内部。",
      "en": "Inside processes executing managed code."
    },
    "diagram": {
      "caption": {
        "zh": "运行时职责关系；不是三个串行处理步骤。",
        "en": "Runtime responsibilities, not three serial processing steps."
      },
      "nodes": [
        {
          "id": "dex",
          "col": 0,
          "row": 0,
          "label": {
            "zh": "DEX 代码",
            "en": "DEX code"
          },
          "sub": {
            "zh": "应用及部分服务",
            "en": "Apps and some services"
          }
        },
        {
          "id": "art",
          "col": 1,
          "row": 0,
          "label": {
            "zh": "ART",
            "en": "ART"
          },
          "sub": {
            "zh": "托管运行环境",
            "en": "Managed runtime"
          },
          "focus": true
        },
        {
          "id": "heap",
          "col": 2,
          "row": 0,
          "label": {
            "zh": "托管对象内存",
            "en": "Managed object heap"
          },
          "sub": {
            "zh": "对象与垃圾回收",
            "en": "Objects and GC"
          }
        }
      ],
      "edges": [
        {
          "from": "art",
          "to": "dex",
          "kind": "relation",
          "label": {
            "zh": "执行支撑",
            "en": "executes"
          }
        },
        {
          "from": "art",
          "to": "heap",
          "kind": "relation",
          "label": {
            "zh": "内存管理",
            "en": "manages"
          }
        }
      ]
    },
    "questions": [
      {
        "q": {
          "zh": "它执行什么？",
          "en": "What does it execute?"
        },
        "a": {
          "zh": "DEX 格式的托管代码；DEX 不是处理器直接使用的机器指令。",
          "en": "DEX managed code, which is not the processor’s native instruction format."
        }
      },
      {
        "q": {
          "zh": "它只是解释器吗？",
          "en": "Is it only an interpreter?"
        },
        "a": {
          "zh": "不是。ART 也有提前编译与即时编译机制，具体策略随版本和配置变化。",
          "en": "No. ART also supports ahead-of-time and just-in-time compilation; policies vary."
        }
      },
      {
        "q": {
          "zh": "它怎样与原生库合作？",
          "en": "How does it work with native libraries?"
        },
        "a": {
          "zh": "托管代码可以通过 JNI 与同进程的 C/C++ 库交互。",
          "en": "Managed code can use JNI to interact with C/C++ libraries in the same process."
        }
      }
    ],
    "scope": {
      "zh": "只解释运行时职责，不承诺某版本的编译时机、回收算法或性能。",
      "en": "Explains runtime responsibilities, not version-specific compilation timing, GC algorithms or performance."
    },
    "sources": [
      {
        "title": "Android runtime and Dalvik",
        "url": "https://source.android.com/docs/core/runtime"
      },
      {
        "title": "ART JIT compiler",
        "url": "https://source.android.com/docs/core/runtime/jit-compiler"
      },
      {
        "title": "JNI tips — Google official mirror",
        "url": "https://developer.android.google.cn/ndk/guides/jni-tips"
      }
    ]
  },
  "audiotrack": {
    "definition": {
      "zh": "AudioTrack 是应用侧创建和控制单条播放音轨的 Android 类。应用用 write() 提供音频数据，用 play() 等操作控制播放；普通 PCM 场景会把采样数据先写入播放缓冲。",
      "en": "AudioTrack is an Android class for an individual playback track. Apps supply audio using write() and control playback with play() and related methods; ordinary PCM goes into a playback buffer."
    },
    "note": {
      "zh": "write() 成功只说明接收了数据，不表示扬声器已播出。",
      "en": "A successful write() means data was accepted, not that it has been heard."
    },
    "position": {
      "zh": "应用侧播放 API，连接系统音频能力。",
      "en": "App-side playback API connected to system audio facilities."
    },
    "diagram": {
      "caption": {
        "zh": "普通 PCM 供数示例；缓冲不是一个新进程。",
        "en": "Ordinary PCM supply example; the buffer is not a process."
      },
      "nodes": [
        {
          "id": "app",
          "col": 0,
          "row": 0,
          "label": {
            "zh": "应用",
            "en": "App"
          },
          "sub": {
            "zh": "准备音频数据",
            "en": "Prepares audio"
          }
        },
        {
          "id": "track",
          "col": 1,
          "row": 0,
          "label": {
            "zh": "AudioTrack",
            "en": "AudioTrack"
          },
          "sub": {
            "zh": "应用侧音轨对象",
            "en": "App-side track object"
          },
          "focus": true
        },
        {
          "id": "buffer",
          "col": 2,
          "row": 0,
          "label": {
            "zh": "播放缓冲",
            "en": "Playback buffer"
          },
          "sub": {
            "zh": "待播放的 PCM",
            "en": "PCM awaiting playback"
          }
        }
      ],
      "edges": [
        {
          "from": "app",
          "to": "track",
          "kind": "data",
          "label": {
            "zh": "write：PCM",
            "en": "write: PCM"
          }
        },
        {
          "from": "track",
          "to": "buffer",
          "kind": "data",
          "label": {
            "zh": "写入样本",
            "en": "buffer samples"
          }
        },
        {
          "from": "app",
          "to": "track",
          "kind": "control",
          "label": {
            "zh": "播放 / 暂停",
            "en": "play / pause"
          }
        }
      ]
    },
    "questions": [
      {
        "q": {
          "zh": "STREAM 和 STATIC 怎么选？",
          "en": "STREAM or STATIC?"
        },
        "a": {
          "zh": "MODE_STREAM 在播放时持续供数；MODE_STATIC 在开始前装入可驻留内存的一段声音。",
          "en": "MODE_STREAM supplies data during playback; MODE_STATIC preloads a memory-resident clip."
        }
      },
      {
        "q": {
          "zh": "谁决定开始和暂停？",
          "en": "What starts and pauses playback?"
        },
        "a": {
          "zh": "应用调用 play()、pause()、stop() 控制音轨；write() 负责供数。",
          "en": "The app uses play(), pause() and stop() for control; write() supplies data."
        }
      },
      {
        "q": {
          "zh": "只能写 PCM、一定软件混音吗？",
          "en": "PCM and software mixing only?"
        },
        "a": {
          "zh": "不是。设备和路径支持时也可使用压缩数据；不能把所有音轨当普通混音。",
          "en": "No. Supported paths can accept compressed data; not all tracks use ordinary mixing."
        }
      }
    ],
    "scope": {
      "zh": "图只画 PCM 供数，不画文件解析或完整输出链；格式、直出及 offload 能力须查询设备支持。",
      "en": "The diagram covers PCM supply, not file parsing or the output chain; query device support for formats, direct output and offload."
    },
    "sources": [
      {
        "title": "AudioTrack API — Google official mirror",
        "url": "https://developer.android.google.cn/reference/android/media/AudioTrack"
      },
      {
        "title": "Audio terminology",
        "url": "https://source.android.com/docs/core/audio/terminology"
      }
    ]
  },
  "audioflinger": {
    "definition": {
      "zh": "AudioFlinger 是 Android 原生音频服务中的核心组件，管理音轨处理并连接 Audio HAL。普通混音输出时，它将多条音轨的 PCM 组合成输出数据，但其他播放路径的处理方式不同。",
      "en": "AudioFlinger is a core native audio-service component that handles tracks and connects to the Audio HAL. On ordinary mixed outputs it combines PCM tracks; other paths behave differently."
    },
    "note": {
      "zh": "AudioFlinger 不等于“所有声音都要经过的普通软件混音器”。",
      "en": "AudioFlinger does not mean every sound must pass through ordinary software mixing."
    },
    "position": {
      "zh": "应用音轨与 Audio HAL 之间的原生音频服务侧。",
      "en": "Native audio-service side, between client tracks and the Audio HAL."
    },
    "diagram": {
      "caption": {
        "zh": "普通混音输出示例；省略内部线程与队列。",
        "en": "Ordinary mixed-output example; internal threads and queues omitted."
      },
      "nodes": [
        {
          "id": "a",
          "col": 0,
          "row": 0,
          "label": {
            "zh": "音轨 A",
            "en": "Track A"
          },
          "sub": {
            "zh": "PCM 样本",
            "en": "PCM samples"
          }
        },
        {
          "id": "b",
          "col": 0,
          "row": 1,
          "label": {
            "zh": "音轨 B",
            "en": "Track B"
          },
          "sub": {
            "zh": "PCM 样本",
            "en": "PCM samples"
          }
        },
        {
          "id": "flinger",
          "col": 1,
          "row": 0,
          "label": {
            "zh": "AudioFlinger",
            "en": "AudioFlinger"
          },
          "sub": {
            "zh": "本例执行混音",
            "en": "Mixing in this example"
          },
          "focus": true
        },
        {
          "id": "hal",
          "col": 2,
          "row": 0,
          "label": {
            "zh": "Audio HAL",
            "en": "Audio HAL"
          },
          "sub": {
            "zh": "设备输出接口",
            "en": "Device output interface"
          }
        }
      ],
      "edges": [
        {
          "from": "a",
          "to": "flinger",
          "kind": "data",
          "label": {
            "zh": "PCM 样本",
            "en": "PCM samples"
          }
        },
        {
          "from": "b",
          "to": "flinger",
          "kind": "data",
          "label": {
            "zh": "PCM 样本",
            "en": "PCM samples"
          }
        },
        {
          "from": "flinger",
          "to": "hal",
          "kind": "data",
          "label": {
            "zh": "混合后的 PCM",
            "en": "mixed PCM"
          }
        }
      ]
    },
    "questions": [
      {
        "q": {
          "zh": "为什么要混音？",
          "en": "Why mix tracks?"
        },
        "a": {
          "zh": "多条音轨共享一个输出时，需要把各自样本组合为输出数据。",
          "en": "Tracks sharing an output need their samples combined."
        }
      },
      {
        "q": {
          "zh": "它也决定所有路由策略吗？",
          "en": "Does it decide all routing policy?"
        },
        "a": {
          "zh": "不是。音频策略负责路由等决策；AudioFlinger 负责音轨与输出处理。",
          "en": "No. Audio policy handles routing decisions; AudioFlinger handles tracks and outputs."
        }
      },
      {
        "q": {
          "zh": "其他路径能直接套这张图吗？",
          "en": "Does this diagram cover other paths?"
        },
        "a": {
          "zh": "不能。direct、offload 和 AAudio MMAP 等路径需要分别解释。",
          "en": "No. Direct, offload and AAudio MMAP paths require separate explanations."
        }
      }
    ],
    "scope": {
      "zh": "仅普通 PCM 混音职责图；不沿用旧文档的 mediaserver 进程名，也不宣称完整函数调用链。",
      "en": "An ordinary PCM mixing diagram, not an exact call chain; legacy mediaserver naming is not reused."
    },
    "sources": [
      {
        "title": "Audio terminology",
        "url": "https://source.android.com/docs/core/audio/terminology"
      },
      {
        "title": "Audio HAL",
        "url": "https://source.android.com/docs/core/audio/implement"
      },
      {
        "title": "Mixer design",
        "url": "https://source.android.com/docs/core/audio/latency/design"
      },
      {
        "title": "AAudio and MMAP",
        "url": "https://source.android.com/docs/core/audio/aaudio"
      },
      {
        "title": "AudioTrack API — Google official mirror",
        "url": "https://developer.android.google.cn/reference/android/media/AudioTrack"
      }
    ]
  },
  "aaos": {
    "definition": {
      "zh": "AAOS 是直接在车辆硬件上运行的 Android 操作系统，用于车载信息娱乐等场景。它复用 Android 平台能力并增加车载需求支持，厂商据此集成自己的车辆系统与体验。",
      "en": "AAOS is Android running directly on vehicle hardware for experiences such as infotainment. It reuses Android capabilities and adds automotive support for vehicle integration."
    },
    "note": {
      "zh": "AAOS 不等于由手机运行并投射到车机的 Android Auto。",
      "en": "AAOS differs from phone-based Android Auto projection."
    },
    "position": {
      "zh": "设备形态的平台扩展，不是音频链中的单个组件。",
      "en": "An automotive platform, not a component in an audio pipeline."
    },
    "diagram": {
      "caption": {
        "zh": "平台组成关系；车载音频是其中一个领域。",
        "en": "Platform relationships; automotive audio is one domain."
      },
      "nodes": [
        {
          "id": "android",
          "col": 0,
          "row": 0,
          "label": {
            "zh": "Android 基础",
            "en": "Android base"
          },
          "sub": {
            "zh": "通用平台能力",
            "en": "Shared platform features"
          }
        },
        {
          "id": "aaos",
          "col": 1,
          "row": 0,
          "label": {
            "zh": "AAOS",
            "en": "AAOS"
          },
          "sub": {
            "zh": "运行在车辆硬件",
            "en": "Runs on vehicle hardware"
          },
          "focus": true
        },
        {
          "id": "audio",
          "col": 2,
          "row": 0,
          "label": {
            "zh": "车载音频",
            "en": "Car audio"
          },
          "sub": {
            "zh": "音区与车载策略",
            "en": "Zones and car policies"
          }
        }
      ],
      "edges": [
        {
          "from": "android",
          "to": "aaos",
          "kind": "relation",
          "label": {
            "zh": "复用并扩展",
            "en": "reuses and extends"
          }
        },
        {
          "from": "aaos",
          "to": "audio",
          "kind": "relation",
          "label": {
            "zh": "车载领域之一",
            "en": "one car domain"
          }
        }
      ]
    },
    "questions": [
      {
        "q": {
          "zh": "必须连接手机才能运行吗？",
          "en": "Does it require a connected phone?"
        },
        "a": {
          "zh": "AAOS 本身在车载硬件运行；Android Auto 则依靠手机提供投射体验。",
          "en": "AAOS itself runs on vehicle hardware; Android Auto provides a phone-based projected experience."
        }
      },
      {
        "q": {
          "zh": "多音区解决什么问题？",
          "en": "What are audio zones for?"
        },
        "a": {
          "zh": "支持的配置可让不同乘员同时听不同内容，并分别管理音量和焦点。",
          "en": "Supported configurations let occupants hear different content with separate volume and focus."
        }
      },
      {
        "q": {
          "zh": "每辆 AAOS 车都有相同服务吗？",
          "en": "Do all AAOS vehicles include the same services?"
        },
        "a": {
          "zh": "不一定。厂商可定制；Google Automotive Services 是另行选择许可和集成的服务集合。",
          "en": "No. OEMs customize systems; Google Automotive Services is an optional licensed integration."
        }
      }
    ],
    "scope": {
      "zh": "本站以信息娱乐与多音区为例；多音区依赖硬件和配置，不代表所有车型默认启用。",
      "en": "Infotainment and multi-zone audio are examples; zones depend on hardware and configuration, not universal defaults."
    },
    "sources": [
      {
        "title": "What is Android Automotive?",
        "url": "https://source.android.com/docs/automotive/start/what_automotive"
      },
      {
        "title": "Multi-zone audio routing",
        "url": "https://source.android.com/docs/automotive/audio/audio-multizone-routing"
      }
    ]
  }
};

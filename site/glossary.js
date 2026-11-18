import {termEntries as extraTerms, metadata as extraMetadata} from './glossary-audio-extra.js?v=22c4d708d315';
import {termEntries as qualcommTerms, metadata as qualcommMetadata} from './glossary-qualcomm.js?v=f01293196faf';
import {termEntries as driverTerms, metadata as driverMetadata} from './glossary-driver.js?v=8b37b1897416';
import { termEntries as audioTerms } from './glossary-audio.js?v=ac7d110e6bcc';
import { termEntries as platformTerms } from './glossary-platform.js?v=79238f3dff43';

// Short help and full explanations share one verified record per term.
const metadata = [
  {
    "id": "alsa",
    "term": "ALSA",
    "full": "Advanced Linux Sound Architecture",
    "name": {
      "zh": "Linux声音子系统",
      "en": "Linux sound subsystem"
    },
    "domain": "audio",
    "source": "https://docs.kernel.org/sound/kernel-api/writing-an-alsa-driver.html"
  },
  {
    "id": "asoc",
    "term": "ASoC",
    "full": "ALSA System on Chip",
    "name": {
      "zh": "面向SoC的音频框架",
      "en": "ALSA for SoC audio"
    },
    "domain": "audio",
    "source": "https://docs.kernel.org/sound/soc/overview.html"
  },
  {
    "id": "dma",
    "term": "DMA",
    "full": "Direct Memory Access",
    "name": {
      "zh": "直接内存访问",
      "en": "Direct memory access"
    },
    "domain": "audio",
    "source": "https://docs.kernel.org/sound/soc/platform.html"
  },
  {
    "id": "dai",
    "term": "DAI",
    "full": "Digital Audio Interface",
    "name": {
      "zh": "数字音频接口",
      "en": "Digital audio interface"
    },
    "domain": "audio",
    "source": "https://docs.kernel.org/sound/soc/platform.html"
  },
  {
    "id": "dapm",
    "term": "DAPM",
    "full": "Dynamic Audio Power Management",
    "name": {
      "zh": "动态音频电源管理",
      "en": "Dynamic audio power management"
    },
    "domain": "audio",
    "source": "https://docs.kernel.org/sound/soc/dapm.html"
  },
  {
    "id": "dac",
    "term": "DAC",
    "full": "Digital-to-Analog Converter",
    "name": {
      "zh": "数模转换器",
      "en": "Digital-to-analog converter"
    },
    "domain": "audio",
    "source": "https://docs.kernel.org/sound/soc/dapm.html"
  },
  {
    "id": "codec",
    "term": "Codec",
    "full": "Audio codec hardware (in this diagram)",
    "name": {
      "zh": "音频Codec硬件",
      "en": "Audio codec hardware"
    },
    "domain": "audio",
    "source": "https://docs.kernel.org/sound/soc/codec.html"
  },
  {
    "id": "i2s",
    "term": "I²S",
    "full": "Inter-IC Sound",
    "name": {
      "zh": "芯片间数字音频接口",
      "en": "Inter-chip digital audio interface"
    },
    "domain": "audio",
    "source": "https://docs.kernel.org/sound/soc/overview.html"
  },
  {
    "id": "dsp",
    "term": "DSP",
    "full": "Digital Signal Processor",
    "name": {
      "zh": "数字信号处理器",
      "en": "Digital signal processor"
    },
    "domain": "audio",
    "source": "https://docs.kernel.org/sound/soc/dpcm.html"
  },
  {
    "id": "fmq",
    "reviewedAt": "2026-11-18",
    "term": "FMQ",
    "full": "Fast Message Queue",
    "name": {
      "zh": "快速消息队列",
      "en": "Fast message queue"
    },
    "domain": "audio",
    "source": "https://source.android.com/docs/core/architecture/aidl/fmq"
  },
  {
    "id": "aosp",
    "term": "AOSP",
    "full": "Android Open Source Project",
    "name": {
      "zh": "Android 开源项目",
      "en": "Android Open Source Project"
    },
    "domain": "framework",
    "source": "https://source.android.com/docs/core/architecture"
  },
  {
    "id": "hal",
    "term": "HAL",
    "full": "Hardware Abstraction Layer",
    "name": {
      "zh": "硬件抽象层",
      "en": "Hardware abstraction layer"
    },
    "domain": "hal",
    "source": "https://source.android.com/docs/core/architecture"
  },
  {
    "id": "aidl",
    "term": "AIDL",
    "full": "Android Interface Definition Language",
    "name": {
      "zh": "Android 接口定义语言",
      "en": "Android interface definition language"
    },
    "domain": "ipc",
    "source": "https://source.android.com/docs/core/architecture/aidl"
  },
  {
    "id": "hidl",
    "term": "HIDL",
    "full": "HAL Interface Definition Language",
    "name": {
      "zh": "HAL 接口定义语言",
      "en": "HAL interface definition language"
    },
    "domain": "hal",
    "deprecated": true,
    "source": "https://source.android.com/docs/core/architecture/hidl"
  },
  {
    "id": "binder",
    "term": "Binder",
    "full": "Binder",
    "name": {
      "zh": "Binder 跨进程通信机制",
      "en": "Binder interprocess communication"
    },
    "domain": "ipc",
    "source": "https://source.android.com/docs/core/architecture/ipc/binder-overview"
  },
  {
    "id": "ipc",
    "term": "IPC",
    "full": "Interprocess Communication",
    "name": {
      "zh": "进程间通信",
      "en": "Interprocess communication"
    },
    "domain": "ipc",
    "source": "https://source.android.com/docs/core/architecture/ipc/binder-overview"
  },
  {
    "id": "jni",
    "term": "JNI",
    "full": "Java Native Interface",
    "name": {
      "zh": "Java 原生接口",
      "en": "Java Native Interface"
    },
    "domain": "runtime",
    "source": "https://developer.android.com/ndk/guides/jni-tips"
  },
  {
    "id": "art",
    "term": "ART",
    "full": "Android Runtime",
    "name": {
      "zh": "Android 运行时",
      "en": "Android runtime"
    },
    "domain": "runtime",
    "source": "https://source.android.com/docs/core/runtime"
  },
  {
    "id": "pcm",
    "term": "PCM",
    "full": "Pulse-Code Modulation",
    "name": {
      "zh": "脉冲编码调制",
      "en": "Pulse-code modulation"
    },
    "domain": "audio",
    "source": "https://source.android.com/docs/core/audio/terminology"
  },
  {
    "id": "audiotrack",
    "term": "AudioTrack",
    "full": "android.media.AudioTrack",
    "name": {
      "zh": "应用侧音轨播放类",
      "en": "Application-side audio track class"
    },
    "domain": "audio",
    "source": "https://developer.android.com/reference/android/media/AudioTrack"
  },
  {
    "id": "audioflinger",
    "reviewedAt": "2026-11-18",
    "term": "AudioFlinger",
    "full": "AudioFlinger",
    "name": {
      "zh": "原生音频服务组件",
      "en": "Native audio service component"
    },
    "domain": "audio",
    "source": "https://source.android.com/docs/core/audio/terminology"
  },
  {
    "id": "aaos",
    "term": "AAOS",
    "full": "Android Automotive OS",
    "name": {
      "zh": "Android 车载操作系统",
      "en": "Android Automotive OS"
    },
    "domain": "audio",
    "source": "https://source.android.com/docs/automotive/start/what_automotive"
  }
];
const content = {...audioTerms,...platformTerms,...driverTerms,...qualcommTerms,...extraTerms};
export const glossary = [...metadata,...driverMetadata,...qualcommMetadata,...extraMetadata].map(item => ({...item,...content[item.id]}));

export function findTerms(query = '') {
 const q = query.trim().toLocaleLowerCase();
 return glossary.filter(item => [item.term,...(item.aliases||[]),item.full,item.name.zh,item.name.en,item.definition.zh,item.definition.en].join(' ').toLocaleLowerCase().includes(q));
}

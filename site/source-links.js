// Original document titles; keep references readable without fetching pages at runtime.
const documentTitles = new Map([
 ['source.android.com/docs/core/audio', 'Audio'],
 ['source.android.com/docs/core/audio/latency/design', 'Design for reduced latency'],
 ['source.android.com/docs/core/audio/aidl-implement', 'AIDL Audio HAL'],
 ['source.android.com/docs/core/audio/implement', 'Audio HAL'],
 ['source.android.com/docs/core/audio/aidl-hidl-comp', 'AIDL and HIDL Audio HAL comparison'],
 ['source.android.com/docs/core/audio/aidl-cap', 'Configurable Audio Policy support in AIDL HAL'],
 ['source.android.com/docs/automotive/audio/audio-control-hal', 'Audio control HAL'],
 ['source.android.com/docs/automotive/audio/audio-multizone-routing', 'Multi-zone audio routing'],
 ['source.android.com/docs/core/audio/terminology', 'Audio terminology'],
 ['source.android.com/docs/core/audio/usb', 'USB digital audio'],
 ['developer.android.com/reference/android/media/AudioTrack', 'AudioTrack'],
 ['developer.android.google.cn/reference/android/media/AudioTrack', 'AudioTrack'],
 ['developer.android.com/ndk/guides/jni-tips', 'JNI tips'],
 ['docs.kernel.org/sound/kernel-api/writing-an-alsa-driver.html', 'Writing an ALSA Driver'],
 ['docs.kernel.org/sound/soc/overview.html', 'ALSA SoC Layer Overview'],
 ['docs.kernel.org/sound/soc/machine.html', 'ASoC Machine Driver'],
 ['docs.kernel.org/sound/soc/platform.html', 'ASoC Platform Driver'],
 ['docs.kernel.org/sound/soc/codec.html', 'ASoC Codec Class Driver'],
 ['docs.kernel.org/sound/soc/dapm.html', 'Dynamic Audio Power Management for Portable Devices']
]);

export function sourceTitle(href, fallback = '') {
 const url = new URL(href);
 const title = documentTitles.get(url.hostname + url.pathname.replace(/\/$/, ''));
 if (title) return title;
 const filename = decodeURIComponent(url.pathname.split('/').pop());
 if (['android.googlesource.com', 'github.com', 'raw.githubusercontent.com'].includes(url.hostname) && /\.(?:aidl|cpp|h|c|java|yaml)$/.test(filename)) {
  const android = url.pathname.match(/\/(android-(\d+)(?:\.\d+)*_r(\d+))\//);
  const linux = url.pathname.match(/\/torvalds\/linux\/(?:blob\/)?(v\d+(?:\.\d+)+)\//);
  return filename + (android ? ` · Android ${android[2]} r${android[3]}` : linux ? ` · Linux ${linux[1]}` : '');
 }
 return fallback || filename || url.hostname;
}

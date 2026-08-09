// 중국어 발음(TTS) 지원 여부를 엄격히 확인해서, 중국어 음성이 없는 기기에서는
// 엉뚱한 음성(영어/한국어 등)으로 한자를 억지로 읽지 않도록 처리한다.

let cachedVoice = null;
let voicesReady = false;
let listeners = [];

function pickVoice() {
  if (typeof window === 'undefined' || !window.speechSynthesis) return null;
  const voices = window.speechSynthesis.getVoices();
  if (!voices || voices.length === 0) return null;
  voicesReady = true;
  // zh-CN, zh-TW, cmn-Hans-CN 등 중국어 계열 음성만 후보로 인정
  const zh = voices.filter((v) => v.lang && /^(zh|cmn)/i.test(v.lang));
  const preferred =
    zh.find((v) => v.lang.toLowerCase() === 'zh-cn') ||
    zh.find((v) => v.name.toLowerCase().includes('mandarin')) ||
    zh.find((v) => v.lang.toLowerCase().startsWith('cmn')) ||
    zh[0];
  return preferred || null;
}

function logVoices() {
  if (typeof window === 'undefined' || !window.speechSynthesis) return;
  try {
    const voices = window.speechSynthesis.getVoices();
    // eslint-disable-next-line no-console
    console.log(
      '[새싹중국어 TTS] 사용 가능한 음성 목록:',
      voices.map((v) => `${v.name} (${v.lang})${v.default ? ' [default]' : ''}`)
    );
    // eslint-disable-next-line no-console
    console.log(
      '[새싹중국어 TTS] 선택된 중국어 음성:',
      cachedVoice ? `${cachedVoice.name} (${cachedVoice.lang})` : '없음 → 발음 버튼 비활성화'
    );
  } catch {
    // ignore
  }
}

function notify() {
  listeners.forEach((fn) => fn(cachedVoice));
}

if (typeof window !== 'undefined' && window.speechSynthesis) {
  cachedVoice = pickVoice();
  if (voicesReady) logVoices();
  window.speechSynthesis.onvoiceschanged = () => {
    cachedVoice = pickVoice();
    logVoices();
    notify();
  };
}

export function isTtsSupported() {
  return typeof window !== 'undefined' && !!window.speechSynthesis;
}

export function hasChineseVoice() {
  if (!voicesReady) cachedVoice = pickVoice();
  return !!cachedVoice;
}

export function onVoiceChange(fn) {
  listeners.push(fn);
  return () => {
    listeners = listeners.filter((l) => l !== fn);
  };
}

// 발음 재생: 중국어 음성이 확인된 경우에만 재생한다.
// 음성이 없으면 아무 것도 하지 않고 false를 반환한다(엉뚱한 발음 방지).
export function speakChinese(text, { rate = 1 } = {}) {
  if (!isTtsSupported() || !text) return false;
  if (!voicesReady) cachedVoice = pickVoice();
  if (!cachedVoice) return false;

  const synth = window.speechSynthesis;
  synth.cancel();
  const utter = new SpeechSynthesisUtterance(text);
  utter.lang = cachedVoice.lang || 'zh-CN';
  utter.voice = cachedVoice;
  utter.rate = rate;
  utter.pitch = 1;
  synth.speak(utter);
  return true;
}

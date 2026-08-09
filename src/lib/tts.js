let cachedVoice = null;
let voicesReady = false;

function pickVoice() {
  if (typeof window === 'undefined' || !window.speechSynthesis) return null;
  const voices = window.speechSynthesis.getVoices();
  if (!voices || voices.length === 0) return null;
  voicesReady = true;
  const zh = voices.filter((v) => v.lang && v.lang.toLowerCase().startsWith('zh'));
  const preferred =
    zh.find((v) => v.lang.toLowerCase() === 'zh-cn') ||
    zh.find((v) => v.name.toLowerCase().includes('mandarin')) ||
    zh[0];
  return preferred || null;
}

if (typeof window !== 'undefined' && window.speechSynthesis) {
  cachedVoice = pickVoice();
  window.speechSynthesis.onvoiceschanged = () => {
    cachedVoice = pickVoice();
  };
}

export function isTtsSupported() {
  return typeof window !== 'undefined' && !!window.speechSynthesis;
}

export function speakChinese(text, { rate = 1 } = {}) {
  if (!isTtsSupported() || !text) return;
  const synth = window.speechSynthesis;
  synth.cancel();
  if (!voicesReady) cachedVoice = pickVoice();

  const utter = new SpeechSynthesisUtterance(text);
  utter.lang = 'zh-CN';
  if (cachedVoice) utter.voice = cachedVoice;
  utter.rate = rate;
  utter.pitch = 1;
  synth.speak(utter);
}

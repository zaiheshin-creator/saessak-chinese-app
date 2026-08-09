// 병음 성조 부호 -> [기본 모음, 성조 숫자] 매핑
const TONE_MAP = {
  ā: ['a', 1], á: ['a', 2], ǎ: ['a', 3], à: ['a', 4],
  ē: ['e', 1], é: ['e', 2], ě: ['e', 3], è: ['e', 4],
  ī: ['i', 1], í: ['i', 2], ǐ: ['i', 3], ì: ['i', 4],
  ō: ['o', 1], ó: ['o', 2], ǒ: ['o', 3], ò: ['o', 4],
  ū: ['u', 1], ú: ['u', 2], ǔ: ['u', 3], ù: ['u', 4],
  ǖ: ['ü', 1], ǘ: ['ü', 2], ǚ: ['ü', 3], ǜ: ['ü', 4],
};

// 병음 문자열을 음절(공백 기준) 배열로 분리
export function splitPinyinSyllables(pinyin) {
  return pinyin.trim().split(/\s+/).filter(Boolean);
}

// 한 음절의 성조(1~4), 성조 부호가 없으면 0(경성)
export function getSyllableTone(syllable) {
  for (const ch of syllable) {
    if (TONE_MAP[ch]) return TONE_MAP[ch][1];
  }
  return 0;
}

// 성조 부호를 제거한 기본 음절(예: nǐ -> ni, mǎ -> ma)
export function toBaseSyllable(syllable) {
  return [...syllable]
    .map((ch) => (TONE_MAP[ch] ? TONE_MAP[ch][0] : ch))
    .join('')
    .toLowerCase();
}

// 병음 문자열 전체를 성조 없이(기본 음절만 공백으로 이어붙여) 반환
export function toBasePinyin(pinyin) {
  return splitPinyinSyllables(pinyin).map(toBaseSyllable).join(' ');
}

// 힌트 표시용: [{ text, tone }] 형태로 음절 목록 반환
export function analyzePinyin(pinyin) {
  return splitPinyinSyllables(pinyin).map((syllable) => ({
    text: syllable,
    tone: getSyllableTone(syllable),
  }));
}

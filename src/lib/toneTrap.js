import { splitPinyinSyllables, toBaseSyllable, toBasePinyin, getSyllableTone } from './pinyin.js';

// pool(전체 단어 배열) 안에서 correctIdx 단어와 병음은 비슷하지만 성조가 다른
// "성조 함정" 단어의 인덱스를 찾는다. 없으면 null.
export function findToneTrapIndex(pool, correctIdx) {
  const correct = pool[correctIdx];
  if (!correct) return null;

  const correctSyllables = splitPinyinSyllables(correct.pinyin);
  const correctBase = toBasePinyin(correct.pinyin);
  const correctFirstBase = toBaseSyllable(correctSyllables[0] || '');
  const correctFirstTone = getSyllableTone(correctSyllables[0] || '');

  const tierA = []; // 병음 전체가 성조 무시하면 동일 + 실제 성조가 다름
  const tierB = []; // 첫 음절이 성조 무시하면 동일 + 그 음절의 성조가 다름

  pool.forEach((w, idx) => {
    if (idx === correctIdx) return;
    if (w.meaning === correct.meaning) return;

    const base = toBasePinyin(w.pinyin);
    if (base === correctBase && w.pinyin !== correct.pinyin) {
      tierA.push(idx);
      return;
    }

    const syllables = splitPinyinSyllables(w.pinyin);
    const firstBase = toBaseSyllable(syllables[0] || '');
    if (firstBase && firstBase === correctFirstBase) {
      const firstTone = getSyllableTone(syllables[0] || '');
      if (firstTone !== correctFirstTone) tierB.push(idx);
    }
  });

  const candidates = tierA.length ? tierA : tierB;
  if (!candidates.length) return null;
  return candidates[Math.floor(Math.random() * candidates.length)];
}

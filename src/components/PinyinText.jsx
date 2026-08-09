import { TONE_COLOR_VAR } from '../data/colors';

export function PinyinSyllable({ syllable, size }) {
  return (
    <span
      className="pinyin-syllable"
      style={{ color: TONE_COLOR_VAR[syllable.tone], fontSize: size }}
    >
      {syllable.py}
    </span>
  );
}

export default function PinyinText({ word, size, className = '' }) {
  return (
    <span className={`pinyin-text ${className}`}>
      {word.syllables.map((s, i) => (
        <span key={i}>
          <PinyinSyllable syllable={s} size={size} />
          {i < word.syllables.length - 1 ? ' ' : ''}
        </span>
      ))}
    </span>
  );
}

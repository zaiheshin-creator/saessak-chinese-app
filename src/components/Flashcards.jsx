import { useState } from 'react';
import PinyinText from './PinyinText';
import { speakChinese } from '../lib/tts';

export default function Flashcards({ unit, onComplete }) {
  const words = unit.words;
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [seen, setSeen] = useState(() => new Set());

  const word = words[index];
  const isLast = index === words.length - 1;

  function markSeen(i) {
    setSeen((prev) => {
      const next = new Set(prev);
      next.add(i);
      return next;
    });
  }

  function handleFlip() {
    setFlipped((f) => !f);
    markSeen(index);
  }

  function goTo(nextIndex) {
    setIndex(nextIndex);
    setFlipped(false);
  }

  function handleNext() {
    markSeen(index);
    if (isLast) {
      onComplete();
    } else {
      goTo(index + 1);
    }
  }

  function handlePrev() {
    if (index > 0) goTo(index - 1);
  }

  function handleSpeak(e, rate) {
    e.stopPropagation();
    speakChinese(word.hanzi, { rate });
  }

  return (
    <div className="screen flashcards-screen">
      <div className="dots">
        {words.map((_, i) => (
          <span
            key={i}
            className={`dot ${i === index ? 'now' : ''} ${seen.has(i) ? 'done' : ''}`}
          />
        ))}
      </div>

      <div className="cardzone">
        <div className={`flashcard ${flipped ? 'flipped' : ''}`} onClick={handleFlip}>
          <div className="flashcard-inner">
            <div className="face front">
              <div className="word-hanzi">{word.hanzi}</div>
              <PinyinText word={word} size="20px" className="word-pinyin" />
              <div className="speak-row">
                <button type="button" className="speak-btn" onClick={(e) => handleSpeak(e, 1)}>
                  {'\u{1F50A}'} 빠르게
                </button>
                <button type="button" className="speak-btn slow" onClick={(e) => handleSpeak(e, 0.5)}>
                  {'\u{1F422}'} 천천히
                </button>
              </div>
              <div className="flip-hint">👆 카드를 눌러 뜻 보기</div>
            </div>
            <div className="face back">
              <div className="word-meaning">{word.meaning}</div>
              <div className="word-hanzi small">{word.hanzi}</div>
              <PinyinText word={word} size="15px" />
            </div>
          </div>
        </div>
      </div>

      <div className="card-nav-row">
        <button type="button" className="cta secondary" onClick={handlePrev} disabled={index === 0}>
          이전
        </button>
        <button type="button" className="cta" onClick={handleNext}>
          {isLast ? '학습 완료' : '다음'}
        </button>
      </div>
    </div>
  );
}

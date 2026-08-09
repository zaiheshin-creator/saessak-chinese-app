import { useState } from 'react';
import { findWordByHanzi } from '../data/units';
import PinyinText from './PinyinText';
import { speakChinese } from '../lib/tts';

export default function WrongNoteReview({ dueEntries, onAssess, onFinish }) {
  const [index, setIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);

  const entry = dueEntries[index];
  const word = entry ? findWordByHanzi(entry.hanzi) : null;

  function handleAssess(knewIt) {
    onAssess(entry.hanzi, knewIt);
    if (index === dueEntries.length - 1) {
      onFinish();
    } else {
      setIndex((i) => i + 1);
      setRevealed(false);
    }
  }

  if (!word) return null;

  return (
    <div className="screen wrongnote-review-screen">
      <div className="review-zone">
        <div className="review-progress">
          {index + 1} / {dueEntries.length}
        </div>
        <div className={`review-card ${revealed ? 'revealed' : ''}`} onClick={() => setRevealed(true)}>
          <div className="word-hanzi">{word.hanzi}</div>
          {revealed && (
            <>
              <PinyinText word={word} size="16px" />
              <div className="word-meaning">{word.meaning}</div>
            </>
          )}
          {!revealed && <div className="review-hint">👆 눌러서 뜻 확인하기</div>}
        </div>
        <button type="button" className="speak-btn" onClick={() => speakChinese(word.hanzi, { rate: 1 })}>
          {'\u{1F50A}'} 발음 듣기
        </button>

        {revealed && (
          <div className="assess-row">
            <button type="button" className="assess-btn hard" onClick={() => handleAssess(false)}>
              아직 헷갈려요
              <small>내일 다시 만나요</small>
            </button>
            <button type="button" className="assess-btn easy" onClick={() => handleAssess(true)}>
              이제 알겠어요
              <small>다음 간격으로!</small>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

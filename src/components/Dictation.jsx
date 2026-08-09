import { useEffect, useMemo, useState } from 'react';
import { TONE_COLOR_VAR } from '../data/colors';
import { pickOther, shuffle } from '../lib/random';
import { speakChinese } from '../lib/tts';

function buildQuestions(unit) {
  const words = unit.words;
  const numB = Math.round(words.length * (unit.dictationMixB ?? 0.5));
  const types = shuffle([
    ...Array(numB).fill('choice'),
    ...Array(words.length - numB).fill('tiles'),
  ]);
  return shuffle(words).map((word, i) => ({ word, type: types[i] }));
}

function TileQuestion({ word, onAnswered }) {
  const correctOrder = word.syllables.map((s) => s.py);
  const [bank, setBank] = useState(() => shuffle(word.syllables.map((s, i) => ({ ...s, uid: i }))));
  const [filled, setFilled] = useState([]);
  const [locked, setLocked] = useState(false);
  const [result, setResult] = useState(null);

  useEffect(() => {
    setBank(shuffle(word.syllables.map((s, i) => ({ ...s, uid: i }))));
    setFilled([]);
    setLocked(false);
    setResult(null);
  }, [word]);

  function handleTileTap(tile) {
    if (locked) return;
    setFilled((prev) => [...prev, tile]);
    setBank((prev) => prev.filter((t) => t.uid !== tile.uid));
  }

  function handleUndo() {
    if (locked || filled.length === 0) return;
    const last = filled[filled.length - 1];
    setFilled((prev) => prev.slice(0, -1));
    setBank((prev) => shuffle([...prev, last]));
  }

  useEffect(() => {
    if (filled.length === correctOrder.length && filled.length > 0 && !locked) {
      setLocked(true);
      const isCorrect = filled.every((t, i) => t.py === correctOrder[i]);
      setResult(isCorrect);
      const timer = setTimeout(() => onAnswered(isCorrect), 900);
      return () => clearTimeout(timer);
    }
  }, [filled]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="dict-tiles">
      <div className="blanks">
        {word.syllables.map((_, i) => {
          const tile = filled[i];
          return (
            <div
              key={i}
              className={`blank ${tile ? 'filled' : ''} ${i === filled.length ? 'cursor' : ''}`}
              onClick={i === filled.length - 1 ? handleUndo : undefined}
              style={tile ? { color: TONE_COLOR_VAR[tile.tone], borderColor: TONE_COLOR_VAR[tile.tone] } : undefined}
            >
              {tile ? tile.py : ''}
            </div>
          );
        })}
      </div>
      <div className="letterbank">
        {bank.map((tile) => (
          <button
            type="button"
            key={tile.uid}
            className="letter-tile"
            style={{ color: TONE_COLOR_VAR[tile.tone] }}
            onClick={() => handleTileTap(tile)}
            data-py={tile.py}
          >
            {tile.py}
          </button>
        ))}
      </div>
      {filled.length > 0 && !locked && (
        <button type="button" className="cta secondary small" onClick={handleUndo}>
          되돌리기
        </button>
      )}
      {result !== null && (
        <div className={`feedback ${result ? 'ok' : 'no'}`}>
          {result ? '\u{1F389} 정답이에요!' : `괜찮아요, 정답은 ${correctOrder.join(' ')} 이에요`}
        </div>
      )}
    </div>
  );
}

function ChoiceQuestion({ word, pool, onAnswered }) {
  const options = useMemo(() => {
    const distractors = pickOther(pool, word, 3);
    return shuffle([word, ...distractors]);
  }, [word, pool]);
  const [pickedHanzi, setPickedHanzi] = useState(null);

  useEffect(() => {
    setPickedHanzi(null);
  }, [word]);

  function handlePick(opt) {
    if (pickedHanzi) return;
    setPickedHanzi(opt.hanzi);
    const isCorrect = opt.hanzi === word.hanzi;
    setTimeout(() => onAnswered(isCorrect), 700);
  }

  return (
    <div className="dict-choice">
      <div className="options">
        {options.map((opt, i) => {
          const isPicked = pickedHanzi === opt.hanzi;
          const showCorrect = pickedHanzi && opt.hanzi === word.hanzi;
          const showWrong = pickedHanzi && isPicked && opt.hanzi !== word.hanzi;
          return (
            <button
              type="button"
              key={opt.hanzi}
              className={`option ${showCorrect ? 'correct' : ''} ${showWrong ? 'wrong' : ''}`}
              onClick={() => handlePick(opt)}
              disabled={!!pickedHanzi}
              data-hanzi={opt.hanzi}
              data-is-correct={opt.hanzi === word.hanzi}
            >
              <span className="letter">{String.fromCharCode(65 + i)}</span>
              <span className="option-hanzi">{opt.hanzi}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default function Dictation({ unit, onComplete, onWrongWord }) {
  const questions = useMemo(() => buildQuestions(unit), [unit]);
  const [index, setIndex] = useState(0);

  const q = questions[index];

  useEffect(() => {
    if (q) speakChinese(q.word.hanzi, { rate: 1 });
  }, [q]);

  function handleAnswered(isCorrect) {
    if (!isCorrect) onWrongWord(q.word.hanzi);
    if (index === questions.length - 1) {
      onComplete();
    } else {
      setIndex((i) => i + 1);
    }
  }

  if (!q) return null;

  return (
    <div className="screen dictation-screen">
      <div className="qprogress">
        <span style={{ width: `${((index + 1) / questions.length) * 100}%` }} />
      </div>
      <div className="qcount">
        문제 <b>{index + 1}</b> / {questions.length}
      </div>

      <div className="listen-row">
        <button type="button" className="listen-btn" onClick={() => speakChinese(q.word.hanzi, { rate: 1 })}>
          {'\u{1F50A}'}
        </button>
        <button type="button" className="listen-btn slow" onClick={() => speakChinese(q.word.hanzi, { rate: 0.5 })}>
          {'\u{1F422}'}
        </button>
      </div>
      <div className="dict-hint">
        {q.type === 'tiles' ? '들려주는 발음의 병음 타일을 순서대로 놓아보세요' : '들려주는 발음에 맞는 한자를 골라보세요'}
      </div>

      {q.type === 'tiles' ? (
        <TileQuestion key={q.word.hanzi} word={q.word} onAnswered={handleAnswered} />
      ) : (
        <ChoiceQuestion key={q.word.hanzi} word={q.word} pool={unit.words} onAnswered={handleAnswered} />
      )}
    </div>
  );
}

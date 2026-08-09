import { useEffect, useMemo, useState } from 'react';
import { shuffle } from '../lib/random';

const ROUND_SIZE = 6;

function buildRound(words) {
  const hanziChips = words.map((word) => ({
    id: `h-${word.hanzi}`,
    kind: 'hanzi',
    hanzi: word.hanzi,
    text: word.hanzi,
    matched: false,
  }));
  const meaningChips = words.map((word) => ({
    id: `m-${word.hanzi}`,
    kind: 'meaning',
    hanzi: word.hanzi,
    text: word.meaning,
    matched: false,
  }));
  return shuffle([...hanziChips, ...meaningChips]);
}

export default function MatchingGame({ unit, onComplete, onWrongWord }) {
  const rounds = useMemo(() => {
    const chunks = [];
    for (let i = 0; i < unit.words.length; i += ROUND_SIZE) {
      chunks.push(unit.words.slice(i, i + ROUND_SIZE));
    }
    return chunks;
  }, [unit]);

  const [roundIndex, setRoundIndex] = useState(0);
  const [chips, setChips] = useState(() => buildRound(rounds[0]));
  const [selected, setSelected] = useState([]);
  const [shakeIds, setShakeIds] = useState([]);
  const [matchedCount, setMatchedCount] = useState(0);

  useEffect(() => {
    setChips(buildRound(rounds[roundIndex] || []));
    setSelected([]);
    setMatchedCount(0);
  }, [roundIndex, rounds]);

  const round = rounds[roundIndex] || [];
  const isLastRound = roundIndex === rounds.length - 1;

  function handleSelect(chip) {
    if (chip.matched || shakeIds.length > 0) return;
    if (selected.some((c) => c.id === chip.id)) return;

    if (selected.length === 0) {
      setSelected([chip]);
      return;
    }

    const other = selected[0];
    if (other.kind === chip.kind) {
      setSelected([chip]);
      return;
    }

    if (other.hanzi === chip.hanzi) {
      setChips((prev) =>
        prev.map((c) => (c.id === other.id || c.id === chip.id ? { ...c, matched: true } : c))
      );
      setSelected([]);
      setMatchedCount((n) => {
        const next = n + 1;
        if (next === round.length) {
          setTimeout(() => {
            if (isLastRound) {
              onComplete();
            } else {
              setRoundIndex((r) => r + 1);
            }
          }, 500);
        }
        return next;
      });
    } else {
      const hanziChip = other.kind === 'hanzi' ? other : chip;
      onWrongWord(hanziChip.hanzi);
      setShakeIds([other.id, chip.id]);
      setTimeout(() => {
        setShakeIds([]);
        setSelected([]);
      }, 450);
    }
  }

  return (
    <div className="screen matching-screen">
      <div className="match-progress">
        라운드 {roundIndex + 1} / {rounds.length} ·{' '}
        <b>
          {matchedCount} / {round.length}
        </b>{' '}
        짝 맞춤
      </div>
      <div className="match-grid">
        {chips.map((chip) => (
          <button
            type="button"
            key={chip.id}
            className={[
              'chip',
              chip.kind === 'hanzi' ? 'hanzi' : 'meaning',
              selected.some((c) => c.id === chip.id) ? 'selected' : '',
              chip.matched ? 'matched' : '',
              shakeIds.includes(chip.id) ? 'shake' : '',
            ]
              .filter(Boolean)
              .join(' ')}
            onClick={() => handleSelect(chip)}
            disabled={chip.matched}
            data-hanzi={chip.hanzi}
            data-kind={chip.kind}
          >
            {chip.text}
          </button>
        ))}
      </div>
    </div>
  );
}

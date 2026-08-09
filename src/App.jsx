import { useEffect, useRef, useState } from 'react';
import './App.css';
import TopBar from './components/TopBar';
import LevelScreen from './components/LevelScreen';
import QuizScreen from './components/QuizScreen';
import DoneScreen from './components/DoneScreen';
import { LEVELS, getLevel, poolForLevel } from './data/units';
import {
  loadState,
  newState,
  saveState,
  roundWords,
  totalRoundsFor,
  totalMasteredFor,
} from './lib/levelProgress';
import { shuffle } from './lib/random';
import { speakChinese, isTtsSupported, hasChineseVoice, onVoiceChange } from './lib/tts';

function pickChoiceIdxs(pool, correctIdx) {
  const options = new Set([correctIdx]);
  while (options.size < 4 && options.size < pool.length) {
    options.add(Math.floor(Math.random() * pool.length));
  }
  return shuffle([...options]);
}

function computeSummaries() {
  const out = {};
  LEVELS.forEach((lv) => {
    const pool = poolForLevel(lv.id);
    const saved = loadState(lv.id, pool.length);
    const mastered = saved ? totalMasteredFor(saved) : 0;
    const wrongCount = saved ? saved.wrongEver.length : 0;
    const totalRounds = totalRoundsFor(pool.length);
    const roundNo = saved ? Math.min(saved.currentRoundIndex + 1, totalRounds) : 1;
    out[lv.id] = { mastered, total: pool.length, wrongCount, roundNo, totalRounds };
  });
  return out;
}

export default function App() {
  const [, setTick] = useState(0);
  const rerender = () => setTick((n) => n + 1);

  const screenRef = useRef('level'); // 'level' | 'quiz' | 'done'
  const levelIdRef = useRef(null);
  const poolRef = useRef([]);
  const stateRef = useRef(null);
  const currentRef = useRef(null);
  const choiceIdxsRef = useRef([]);
  const lockedRef = useRef(false);
  const feedbackRef = useRef(null);
  const hintUsedRef = useRef(false);
  const reviewModeRef = useRef(false);
  const reviewQueueRef = useRef([]);
  const reviewTotalRef = useRef(0);
  const roundClearRef = useRef(false);

  const [ttsOk, setTtsOk] = useState(isTtsSupported() && hasChineseVoice());

  useEffect(() => {
    const off = onVoiceChange(() => setTtsOk(isTtsSupported() && hasChineseVoice()));
    return off;
  }, []);

  function goLevelScreen() {
    screenRef.current = 'level';
    reviewModeRef.current = false;
    rerender();
  }

  function loadQuestion() {
    roundClearRef.current = false;
    const pool = poolRef.current;

    if (reviewModeRef.current) {
      if (reviewQueueRef.current.length === 0) {
        screenRef.current = 'done';
        rerender();
        return;
      }
      currentRef.current = reviewQueueRef.current[0];
    } else {
      const st = stateRef.current;
      if (st.roundQueue.length === 0) {
        handleRoundComplete();
        return;
      }
      currentRef.current = st.roundQueue[0];
    }

    choiceIdxsRef.current = pickChoiceIdxs(pool, currentRef.current);
    lockedRef.current = false;
    hintUsedRef.current = false;
    feedbackRef.current = null;
    speakChinese(pool[currentRef.current].hanzi);
    rerender();
  }

  function handleRoundComplete() {
    const levelId = levelIdRef.current;
    const pool = poolRef.current;
    const st = stateRef.current;
    const totalRounds = totalRoundsFor(pool.length);
    if (st.currentRoundIndex + 1 < totalRounds) {
      roundClearRef.current = true;
      rerender();
      setTimeout(() => {
        st.currentRoundIndex += 1;
        st.roundQueue = shuffle([...roundWords(st.order, st.currentRoundIndex)]);
        st.roundMasteredCount = 0;
        saveState(levelId, st);
        loadQuestion();
      }, 1300);
    } else {
      screenRef.current = 'done';
      rerender();
    }
  }

  function startLevel(levelId) {
    const pool = poolForLevel(levelId);
    levelIdRef.current = levelId;
    poolRef.current = pool;
    stateRef.current = loadState(levelId, pool.length) || newState(pool.length);
    saveState(levelId, stateRef.current);
    reviewModeRef.current = false;
    screenRef.current = 'quiz';
    loadQuestion();
  }

  function startReview(levelId) {
    const pool = poolForLevel(levelId);
    levelIdRef.current = levelId;
    poolRef.current = pool;
    stateRef.current = loadState(levelId, pool.length) || newState(pool.length);
    if (!stateRef.current.wrongEver.length) return;
    reviewModeRef.current = true;
    reviewQueueRef.current = shuffle([...stateRef.current.wrongEver]);
    reviewTotalRef.current = reviewQueueRef.current.length;
    screenRef.current = 'quiz';
    loadQuestion();
  }

  function handleAnswer(selectedIdx) {
    if (lockedRef.current) return;
    lockedRef.current = true;

    const pool = poolRef.current;
    const correctIdx = currentRef.current;
    const isCorrect = selectedIdx === correctIdx;

    if (isCorrect) {
      feedbackRef.current = { type: 'correct', selected: selectedIdx, text: '정답이에요! \u{1F389}' };
      if (reviewModeRef.current) {
        reviewQueueRef.current = reviewQueueRef.current.slice(1);
        const st = stateRef.current;
        st.wrongEver = st.wrongEver.filter((i) => i !== correctIdx);
        saveState(levelIdRef.current, st);
      } else {
        const st = stateRef.current;
        st.roundQueue = st.roundQueue.slice(1);
        st.roundMasteredCount += 1;
        saveState(levelIdRef.current, st);
      }
    } else {
      feedbackRef.current = {
        type: 'wrong',
        selected: selectedIdx,
        text: `틀렸어요. 정답: ${pool[correctIdx].meaning}`,
      };
      if (reviewModeRef.current) {
        const q = reviewQueueRef.current.slice(1);
        const reinsertAt = Math.min(q.length, 3 + Math.floor(Math.random() * 5));
        q.splice(reinsertAt, 0, correctIdx);
        reviewQueueRef.current = q;
      } else {
        const st = stateRef.current;
        st.mistakeCount += 1;
        if (!st.wrongEver.includes(correctIdx)) st.wrongEver = [...st.wrongEver, correctIdx];
        const q = st.roundQueue.slice(1);
        const reinsertAt = Math.min(q.length, 3 + Math.floor(Math.random() * 5));
        q.splice(reinsertAt, 0, correctIdx);
        st.roundQueue = q;
        saveState(levelIdRef.current, st);
      }
    }

    rerender();
    setTimeout(loadQuestion, isCorrect ? 700 : 1300);
  }

  function handleHint() {
    if (hintUsedRef.current || currentRef.current === null) return;
    hintUsedRef.current = true;
    rerender();
  }

  function handleRestart() {
    const levelId = levelIdRef.current;
    stateRef.current = newState(poolRef.current.length);
    saveState(levelId, stateRef.current);
    reviewModeRef.current = false;
    screenRef.current = 'quiz';
    loadQuestion();
  }

  function handleResetLevel() {
    if (reviewModeRef.current) return;
    // eslint-disable-next-line no-alert
    if (window.confirm('이 레벨을 처음부터 다시 시작할까요? 진행 상황이 초기화됩니다.')) {
      handleRestart();
    }
  }

  const screen = screenRef.current;
  const levelId = levelIdRef.current;
  const level = levelId ? getLevel(levelId) : null;

  const title = screen === 'level' ? '새싹중국어' : level?.name || '새싹중국어';
  const showBack = screen !== 'level';
  const showReset = screen === 'quiz' && !reviewModeRef.current;

  let roundLabel = '';
  let progressCurrent = 0;
  let progressTotal = 0;
  if (screen === 'quiz' && stateRef.current) {
    if (reviewModeRef.current) {
      const done = reviewTotalRef.current - reviewQueueRef.current.length;
      roundLabel = '\u{1F4DD} 오답노트 복습';
      progressCurrent = done;
      progressTotal = reviewTotalRef.current;
    } else {
      const st = stateRef.current;
      const totalRounds = totalRoundsFor(poolRef.current.length);
      const roundSize = roundWords(st.order, st.currentRoundIndex).length;
      roundLabel = `회차 ${st.currentRoundIndex + 1} / ${totalRounds}`;
      progressCurrent = st.roundMasteredCount;
      progressTotal = roundSize;
    }
  }

  const pool = poolRef.current;
  const current = currentRef.current;
  const choices =
    screen === 'quiz' && current !== null
      ? choiceIdxsRef.current.map((idx) => ({ idx, meaning: pool[idx].meaning }))
      : [];

  return (
    <div className="app">
      <TopBar
        title={title}
        onBack={showBack ? goLevelScreen : undefined}
        onReset={showReset ? handleResetLevel : undefined}
      />

      {screen === 'level' && (
        <LevelScreen
          levels={LEVELS}
          summaries={computeSummaries()}
          onSelect={startLevel}
          onReview={startReview}
        />
      )}

      {screen === 'quiz' && current !== null && (
        <QuizScreen
          roundLabel={roundLabel}
          progressCurrent={progressCurrent}
          progressTotal={progressTotal}
          hanzi={pool[current].hanzi}
          pinyin={pool[current].pinyin}
          hintUsed={hintUsedRef.current}
          onWordClick={() => speakChinese(pool[current].hanzi)}
          onSlow={() => speakChinese(pool[current].hanzi, { rate: 0.5 })}
          ttsOk={ttsOk}
          onHint={handleHint}
          choices={choices}
          onChoose={handleAnswer}
          locked={lockedRef.current}
          feedback={feedbackRef.current}
          correctMeaning={pool[current]?.meaning}
          roundClear={roundClearRef.current}
        />
      )}

      {screen === 'done' && (
        <DoneScreen
          title={
            reviewModeRef.current
              ? '오답노트를 모두 복습했어요!'
              : `${level?.name || '이 레벨'} 단어를 모두 마스터했어요!`
          }
          stats={
            reviewModeRef.current
              ? ''
              : `총 오답 횟수: ${stateRef.current?.mistakeCount ?? 0}회`
          }
          showRestart={!reviewModeRef.current}
          onRestart={handleRestart}
          onBack={goLevelScreen}
        />
      )}
    </div>
  );
}

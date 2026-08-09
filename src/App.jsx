import { useState } from 'react';
import './App.css';
import TopBar from './components/TopBar';
import HomeScreen from './components/HomeScreen';
import UnitIntro from './components/UnitIntro';
import Flashcards from './components/Flashcards';
import MatchingGame from './components/MatchingGame';
import Dictation from './components/Dictation';
import UnitComplete from './components/UnitComplete';
import MyPage from './components/MyPage';
import WrongNoteList from './components/WrongNoteList';
import WrongNoteReview from './components/WrongNoteReview';
import { getUnit } from './data/units';
import {
  addWrongWord,
  completeStage,
  getDueWrongWords,
  getUnitProgress,
  loadProgress,
  reviewWrongWord,
} from './lib/progress';

const STAGE_EXP = { flashcards: 15, matching: 15, dictation: 20 };

const SCREEN_TITLES = {
  home: '새싹중국어',
  unitIntro: '유닛',
  flashcards: '카드 뒤집기',
  matching: '매칭 게임',
  dictation: '딕테이션',
  unitComplete: '학습 완료',
  mypage: '마이페이지',
  wrongnoteList: '오답노트',
  wrongnoteReview: '오답노트 복습',
};

export default function App() {
  const [progress, setProgress] = useState(loadProgress);
  const [screen, setScreen] = useState('home');
  const [currentUnitId, setCurrentUnitId] = useState(null);
  const [lastBadge, setLastBadge] = useState(null);
  const [reviewQueue, setReviewQueue] = useState([]);

  function refresh() {
    setProgress(loadProgress());
  }

  const currentUnit = currentUnitId ? getUnit(currentUnitId) : null;
  const dueCount = getDueWrongWords(progress).length;

  function handleOpenUnit(unitId) {
    setCurrentUnitId(unitId);
    setScreen('unitIntro');
  }

  function handleStartStage(stage) {
    setScreen(stage);
  }

  function handleWrongWord(hanzi) {
    addWrongWord(progress, currentUnitId, hanzi);
    refresh();
  }

  function handleStageComplete(stage) {
    const { badgeEarned } = completeStage(progress, currentUnitId, stage, STAGE_EXP[stage]);
    refresh();
    if (stage === 'dictation') {
      setLastBadge(badgeEarned);
      setScreen('unitComplete');
    } else {
      setScreen('unitIntro');
    }
  }

  function handleAssessWrongWord(hanzi, knewIt) {
    reviewWrongWord(progress, hanzi, knewIt);
    refresh();
  }

  function startWrongNoteReview() {
    setReviewQueue(getDueWrongWords(progress));
    setScreen('wrongnoteReview');
  }

  function goHome() {
    setCurrentUnitId(null);
    setScreen('home');
  }

  const title = screen === 'unitIntro' || ['flashcards', 'matching', 'dictation'].includes(screen)
    ? currentUnit?.title || SCREEN_TITLES[screen]
    : SCREEN_TITLES[screen];

  const showBack = screen !== 'home';

  function handleBack() {
    if (['flashcards', 'matching', 'dictation'].includes(screen)) {
      setScreen('unitIntro');
    } else if (screen === 'unitComplete') {
      goHome();
    } else if (screen === 'wrongnoteReview') {
      setScreen('wrongnoteList');
    } else {
      goHome();
    }
  }

  return (
    <div className="app">
      <TopBar
        title={title}
        onBack={showBack ? handleBack : undefined}
        exp={progress.exp}
        streak={progress.streak.count}
      />

      {screen === 'home' && (
        <HomeScreen
          progress={progress}
          dueCount={dueCount}
          onOpenUnit={handleOpenUnit}
          onOpenWrongNote={() => setScreen('wrongnoteList')}
          onOpenMyPage={() => setScreen('mypage')}
        />
      )}

      {screen === 'unitIntro' && currentUnit && (
        <UnitIntro
          unit={currentUnit}
          unitProgress={getUnitProgress(progress, currentUnitId)}
          onStart={handleStartStage}
        />
      )}

      {screen === 'flashcards' && currentUnit && (
        <Flashcards unit={currentUnit} onComplete={() => handleStageComplete('flashcards')} />
      )}

      {screen === 'matching' && currentUnit && (
        <MatchingGame
          unit={currentUnit}
          onComplete={() => handleStageComplete('matching')}
          onWrongWord={handleWrongWord}
        />
      )}

      {screen === 'dictation' && currentUnit && (
        <Dictation
          unit={currentUnit}
          onComplete={() => handleStageComplete('dictation')}
          onWrongWord={handleWrongWord}
        />
      )}

      {screen === 'unitComplete' && currentUnit && (
        <UnitComplete
          unit={currentUnit}
          badgeEarned={lastBadge}
          dueCount={dueCount}
          onHome={goHome}
          onReviewWrongNote={startWrongNoteReview}
        />
      )}

      {screen === 'mypage' && <MyPage progress={progress} />}

      {screen === 'wrongnoteList' && (
        <WrongNoteList progress={progress} onStartReview={startWrongNoteReview} />
      )}

      {screen === 'wrongnoteReview' &&
        (reviewQueue.length > 0 ? (
          <WrongNoteReview
            dueEntries={reviewQueue}
            onAssess={handleAssessWrongWord}
            onFinish={() => setScreen('wrongnoteList')}
          />
        ) : (
          <WrongNoteList progress={progress} onStartReview={startWrongNoteReview} />
        ))}
    </div>
  );
}

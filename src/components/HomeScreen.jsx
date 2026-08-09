import { UNITS } from '../data/units';
import { getUnitProgress, isUnitFullyComplete } from '../lib/progress';

const STAGE_LABELS = [
  { key: 'flashcards', label: '카드' },
  { key: 'matching', label: '매칭' },
  { key: 'dictation', label: '딕테이션' },
];

export default function HomeScreen({ progress, dueCount, onOpenUnit, onOpenWrongNote, onOpenMyPage }) {
  return (
    <div className="screen home-screen">
      <div className="greet-bubble">
        <span className="mascot-emoji">{'\u{1F331}'}</span>
        <div className="bubble">
          안녕! 오늘은 어떤 중국어를 배워볼까?
        </div>
      </div>

      {dueCount > 0 && (
        <button type="button" className="wrongnote-card" onClick={onOpenWrongNote}>
          <span className="wrongnote-emoji">{'\u{1F4DD}'}</span>
          <span className="wrongnote-text">
            <b>오늘 복습할 단어가 있어요</b>
            <span>오답노트 {dueCount}개 다시 만나보기</span>
          </span>
          <span className="wrongnote-arrow">{'→'}</span>
        </button>
      )}

      <div className="section-label">Lv.1 HSK1 · 유닛 지도</div>
      <div className="level-map">
        {UNITS.map((unit, idx) => {
          const prevUnit = UNITS[idx - 1];
          const unlocked = !prevUnit || isUnitFullyComplete(progress, prevUnit.id);
          const up = getUnitProgress(progress, unit.id);
          const complete = isUnitFullyComplete(progress, unit.id);

          return (
            <button
              type="button"
              key={unit.id}
              className={`unit-card ${!unlocked ? 'locked' : ''} ${complete ? 'complete' : ''}`}
              onClick={() => unlocked && onOpenUnit(unit.id)}
              disabled={!unlocked}
            >
              <span className="unit-badge">{unlocked ? unit.emoji : '\u{1F512}'}</span>
              <span className="unit-info">
                <span className="unit-name">{unit.title}</span>
                <span className="unit-sub">{unit.subtitle}</span>
                <span className="unit-stage-dots">
                  {STAGE_LABELS.map((s) => (
                    <span key={s.key} className={`stage-dot ${up[s.key] ? 'done' : ''}`}>
                      {s.label}
                    </span>
                  ))}
                </span>
              </span>
              {complete && <span className="unit-check">{'✓'}</span>}
              {!unlocked && <span className="unit-lock-hint">이전 유닛을 먼저 완료하세요</span>}
            </button>
          );
        })}
        <div className="unit-card coming-soon" aria-hidden="true">
          <span className="unit-badge">{'✨'}</span>
          <span className="unit-info">
            <span className="unit-name">다음 유닛 준비 중</span>
            <span className="unit-sub">더 많은 HSK1 단어가 곧 추가돼요</span>
          </span>
        </div>
      </div>

      <button type="button" className="cta secondary" onClick={onOpenMyPage}>
        마이페이지 보기
      </button>
    </div>
  );
}

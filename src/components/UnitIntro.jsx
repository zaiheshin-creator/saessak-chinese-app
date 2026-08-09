const STAGES = [
  { key: 'flashcards', num: 1, label: '카드 뒤집기', desc: '한자와 병음, 뜻을 익혀요' },
  { key: 'matching', num: 2, label: '매칭 게임', desc: '한자와 뜻을 짝지어요' },
  { key: 'dictation', num: 3, label: '딕테이션', desc: '듣고 병음/한자를 맞혀요' },
];

export default function UnitIntro({ unit, unitProgress, onStart }) {
  const nextStage = STAGES.find((s) => !unitProgress[s.key]);

  return (
    <div className="screen unit-intro-screen">
      <div className="unit-intro-hero">
        <span className="unit-intro-emoji">{unit.emoji}</span>
        <h2>{unit.title}</h2>
        <p>{unit.subtitle}</p>
        <p className="unit-word-count">이번 유닛 단어 {unit.words.length}개</p>
      </div>

      <div className="stage-list">
        {STAGES.map((s) => {
          const done = unitProgress[s.key];
          const isNext = nextStage && nextStage.key === s.key;
          const locked = !done && !isNext;
          return (
            <button
              type="button"
              key={s.key}
              className={`stage-row ${done ? 'done' : ''} ${isNext ? 'next' : ''} ${locked ? 'locked' : ''}`}
              onClick={() => !locked && onStart(s.key)}
              disabled={locked}
            >
              <span className="stage-num">{done ? '✓' : s.num}</span>
              <span className="stage-text">
                <b>{s.label}</b>
                <span>{s.desc}</span>
              </span>
              {done && <span className="stage-replay">다시 하기</span>}
            </button>
          );
        })}
      </div>

      {!nextStage && (
        <div className="unit-done-banner">
          {'\u{1F389}'} 이 유닛을 모두 완료했어요! 원하는 단계를 다시 눌러 복습할 수 있어요.
        </div>
      )}
    </div>
  );
}

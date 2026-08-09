import { analyzePinyin } from '../lib/pinyin';

export default function QuizScreen({
  roundLabel,
  progressCurrent,
  progressTotal,
  hanzi,
  pinyin,
  hintUsed,
  onWordClick,
  onSlow,
  ttsOk,
  onHint,
  choices,
  onChoose,
  locked,
  feedback,
  correctMeaning,
  roundClear,
}) {
  const pct = progressTotal ? Math.round((progressCurrent / progressTotal) * 100) : 0;

  return (
    <>
      <div className="progress-wrap">
        <div className="round-label">{roundLabel}</div>
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${pct}%` }} />
        </div>
        <div className="progress-text">
          {progressCurrent} / {progressTotal}
        </div>
      </div>

      <main className="card quiz-card">
        {roundClear ? (
          <div className="round-clear-msg">{'\u{1F389}'} 회차 클리어! 다음 회차로 넘어가요</div>
        ) : (
          <>
            <div
              className={`word-area${!ttsOk ? ' no-audio' : ''}`}
              onClick={ttsOk ? onWordClick : undefined}
            >
              <div
                className={`word-text${
                  locked && feedback?.type === 'correct' ? ' word-text-correct' : ''
                }`}
              >
                {hanzi}
              </div>
              {ttsOk ? (
                <div className="hint">{'\u{1F446}'} 한자를 클릭하면 발음을 들려줘요</div>
              ) : (
                <div className="hint no-audio-hint">
                  {'\u{1F507}'} 이 기기에서는 중국어 음성을 지원하지 않아요
                </div>
              )}
            </div>

            {ttsOk && (
              <button type="button" className="slow-btn" onClick={onSlow}>
                {'\u{1F422}'} 천천히 듣기
              </button>
            )}

            <div className="hint-row">
              <button type="button" className="hint-btn" disabled={hintUsed} onClick={onHint}>
                {'\u{1F4A1}'} 병음 힌트
              </button>
              {hintUsed && (
                <div className="hint-text">
                  병음:{' '}
                  {analyzePinyin(pinyin).map((syl, i) => (
                    <span key={i} className={`pinyin-tone-${syl.tone}`}>
                      {syl.text}
                      {i < analyzePinyin(pinyin).length - 1 ? ' ' : ''}
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="choices">
              {choices.map((c) => {
                let cls = 'choice-btn';
                if (locked && feedback) {
                  if (c.meaning === correctMeaning) cls += ' correct';
                  else if (c.idx === feedback.selected) cls += ' wrong';
                }
                if (locked) cls += ' disabled';
                return (
                  <button
                    key={c.idx}
                    type="button"
                    className={cls}
                    onClick={() => onChoose(c.idx)}
                    disabled={locked}
                  >
                    {c.meaning}
                  </button>
                );
              })}
            </div>

            <div className={`feedback${feedback ? ` ${feedback.type}-msg` : ''}`}>
              {feedback ? feedback.text : ''}
            </div>
          </>
        )}
      </main>
    </>
  );
}

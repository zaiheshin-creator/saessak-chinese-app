import { findWordByHanzi } from '../data/units';
import { daysUntil, getDueWrongWords, getUpcomingWrongWords } from '../lib/progress';

export default function WrongNoteList({ progress, onStartReview }) {
  const due = getDueWrongWords(progress);
  const upcoming = getUpcomingWrongWords(progress);
  const total = due.length + upcoming.length;

  if (total === 0) {
    return (
      <div className="screen wrongnote-screen">
        <div className="empty-state">
          <span className="empty-emoji">{'\u{1F38A}'}</span>
          <p>아직 오답노트가 비어있어요. 학습을 하다 틀린 단어가 있으면 여기 자동으로 모여요!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="screen wrongnote-screen">
      <p className="wrongnote-intro">
        라이트너 간격 반복(1일 → 3일 → 7일)으로 틀린 단어를 다시 만나요. 총 {total}단어.
      </p>

      {due.length > 0 && (
        <>
          <div className="section-label">오늘 복습 ({due.length})</div>
          {due.map((entry) => {
            const word = findWordByHanzi(entry.hanzi);
            if (!word) return null;
            return (
              <div className="wordrow" key={entry.hanzi}>
                <div className="hanzi">{word.hanzi}</div>
                <div className="kr">{word.meaning}</div>
                <div className="missbadge">오답 {entry.misses}회</div>
              </div>
            );
          })}
          <button type="button" className="cta" onClick={onStartReview}>
            오늘 복습 시작하기 ({due.length})
          </button>
        </>
      )}

      {upcoming.length > 0 && (
        <>
          <div className="section-label later">다가오는 복습</div>
          {upcoming.map((entry) => {
            const word = findWordByHanzi(entry.hanzi);
            if (!word) return null;
            const d = daysUntil(entry.nextReview);
            return (
              <div className="wordrow later" key={entry.hanzi}>
                <div className="hanzi">{word.hanzi}</div>
                <div className="kr">{word.meaning}</div>
                <div className="duebadge">{d}일 후</div>
              </div>
            );
          })}
        </>
      )}
    </div>
  );
}

import { shuffle } from './random';

const STORAGE_PREFIX = 'saessak-chinese-progress-v2-level-';
export const ROUND_SIZE = 30;

function storageKey(levelId) {
  return STORAGE_PREFIX + levelId;
}

export function totalRoundsFor(poolLength) {
  return Math.ceil(poolLength / ROUND_SIZE) || 1;
}

export function roundWords(order, roundIdx) {
  return order.slice(roundIdx * ROUND_SIZE, (roundIdx + 1) * ROUND_SIZE);
}

export function totalMasteredFor(state) {
  return state.currentRoundIndex * ROUND_SIZE + state.roundMasteredCount;
}

export function loadState(levelId, poolLength) {
  try {
    const raw = localStorage.getItem(storageKey(levelId));
    if (raw) {
      const parsed = JSON.parse(raw);
      if (
        Array.isArray(parsed.order) &&
        parsed.order.length === poolLength &&
        Array.isArray(parsed.roundQueue) &&
        Array.isArray(parsed.wrongEver) &&
        typeof parsed.currentRoundIndex === 'number'
      ) {
        return parsed;
      }
    }
  } catch {
    // ignore corrupted storage
  }
  return null;
}

export function newState(poolLength) {
  const order = shuffle([...Array(poolLength).keys()]);
  return {
    order,
    currentRoundIndex: 0,
    roundQueue: shuffle([...roundWords(order, 0)]),
    roundMasteredCount: 0,
    mistakeCount: 0,
    wrongEver: [],
  };
}

export function saveState(levelId, state) {
  localStorage.setItem(storageKey(levelId), JSON.stringify(state));
}

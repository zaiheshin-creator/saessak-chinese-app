// 유닛/단어 데이터
// 성조(tone): 1~4 = 1~4성, 0 = 경성(neutral)
// dictationMixB: 딕테이션에서 4지선다(B) 방식 비중 (0~1). 나머지는 병음 타일 배열(A) 방식.

function w(hanzi, syllables, meaning) {
  return { hanzi, syllables, meaning };
}

export const UNITS = [
  {
    id: 'greetings-intro',
    level: 1,
    order: 1,
    title: '인사·자기소개',
    subtitle: '안녕하세요, 제 이름은…',
    emoji: '\u{1F44B}',
    dictationMixB: 0.7,
    words: [
      w('你好', [{ py: 'nǐ', tone: 3 }, { py: 'hǎo', tone: 3 }], '안녕하세요'),
      w('谢谢', [{ py: 'xiè', tone: 4 }, { py: 'xie', tone: 0 }], '고마워요'),
      w('不客气', [{ py: 'bù', tone: 4 }, { py: 'kè', tone: 4 }, { py: 'qi', tone: 0 }], '천만에요'),
      w('对不起', [{ py: 'duì', tone: 4 }, { py: 'bu', tone: 0 }, { py: 'qǐ', tone: 3 }], '미안해요'),
      w('没关系', [{ py: 'méi', tone: 2 }, { py: 'guān', tone: 1 }, { py: 'xi', tone: 0 }], '괜찮아요'),
      w('再见', [{ py: 'zài', tone: 4 }, { py: 'jiàn', tone: 4 }], '안녕히 가세요'),
      w('我', [{ py: 'wǒ', tone: 3 }], '나, 저'),
      w('你', [{ py: 'nǐ', tone: 3 }], '너'),
      w('他', [{ py: 'tā', tone: 1 }], '그(남자)'),
      w('她', [{ py: 'tā', tone: 1 }], '그녀'),
      w('是', [{ py: 'shì', tone: 4 }], '~이다'),
      w('叫', [{ py: 'jiào', tone: 4 }], '(이름이) ~이다'),
      w('名字', [{ py: 'míng', tone: 2 }, { py: 'zi', tone: 0 }], '이름'),
      w('朋友', [{ py: 'péng', tone: 2 }, { py: 'you', tone: 0 }], '친구'),
      w('老师', [{ py: 'lǎo', tone: 3 }, { py: 'shī', tone: 1 }], '선생님'),
      w('学生', [{ py: 'xué', tone: 2 }, { py: 'sheng', tone: 0 }], '학생'),
      w('请', [{ py: 'qǐng', tone: 3 }], '~해 주세요'),
      w('认识', [{ py: 'rèn', tone: 4 }, { py: 'shi', tone: 0 }], '(사람을) 알다'),
    ],
  },
  {
    id: 'numbers-family',
    level: 1,
    order: 2,
    title: '숫자·가족',
    subtitle: '하나, 둘, 셋… 우리 가족',
    emoji: '\u{1F46A}',
    dictationMixB: 0.7,
    words: [
      w('一', [{ py: 'yī', tone: 1 }], '1, 하나'),
      w('二', [{ py: 'èr', tone: 4 }], '2, 둘'),
      w('三', [{ py: 'sān', tone: 1 }], '3, 셋'),
      w('四', [{ py: 'sì', tone: 4 }], '4, 넷'),
      w('五', [{ py: 'wǔ', tone: 3 }], '5, 다섯'),
      w('六', [{ py: 'liù', tone: 4 }], '6, 여섯'),
      w('七', [{ py: 'qī', tone: 1 }], '7, 일곱'),
      w('八', [{ py: 'bā', tone: 1 }], '8, 여덟'),
      w('九', [{ py: 'jiǔ', tone: 3 }], '9, 아홉'),
      w('十', [{ py: 'shí', tone: 2 }], '10, 열'),
      w('爸爸', [{ py: 'bà', tone: 4 }, { py: 'ba', tone: 0 }], '아빠'),
      w('妈妈', [{ py: 'mā', tone: 1 }, { py: 'ma', tone: 0 }], '엄마'),
      w('儿子', [{ py: 'ér', tone: 2 }, { py: 'zi', tone: 0 }], '아들'),
      w('女儿', [{ py: 'nǚ', tone: 3 }, { py: 'ér', tone: 2 }], '딸'),
      w('家', [{ py: 'jiā', tone: 1 }], '집, 가족'),
    ],
  },
];

export function getUnit(unitId) {
  return UNITS.find((u) => u.id === unitId);
}

export function allWords() {
  return UNITS.flatMap((u) => u.words.map((word) => ({ ...word, unitId: u.id })));
}

export function findWordByHanzi(hanzi) {
  return allWords().find((w) => w.hanzi === hanzi);
}

export function pinyinDisplay(word) {
  return word.syllables.map((s) => s.py).join(' ');
}

export function pinyinPlain(word) {
  return word.syllables.map((s) => s.py).join('');
}

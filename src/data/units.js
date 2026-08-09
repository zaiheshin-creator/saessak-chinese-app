// 레벨별 단어 데이터 (한자 / 병음 / 한국어 뜻)

function w(hanzi, pinyin, meaning) {
  return { hanzi, pinyin, meaning };
}

export const LEVELS = [
  {
    id: 1,
    name: '인사·자기소개',
    sub: '안녕하세요, 제 이름은…',
    emoji: '\u{1F44B}',
    words: [
      w('你好', 'nǐ hǎo', '안녕하세요'),
      w('谢谢', 'xiè xie', '고마워요'),
      w('不客气', 'bù kè qi', '천만에요'),
      w('对不起', 'duì bu qǐ', '미안해요'),
      w('没关系', 'méi guān xi', '괜찮아요'),
      w('再见', 'zài jiàn', '안녕히 가세요'),
      w('我', 'wǒ', '나, 저'),
      w('你', 'nǐ', '너'),
      w('他', 'tā', '그(남자)'),
      w('她', 'tā', '그녀'),
      w('是', 'shì', '~이다'),
      w('叫', 'jiào', '(이름이) ~이다'),
      w('名字', 'míng zi', '이름'),
      w('朋友', 'péng you', '친구'),
      w('老师', 'lǎo shī', '선생님'),
      w('学生', 'xué sheng', '학생'),
      w('请', 'qǐng', '~해 주세요'),
      w('认识', 'rèn shi', '(사람을) 알다'),
    ],
  },
  {
    id: 2,
    name: '숫자·가족',
    sub: '하나, 둘, 셋… 우리 가족',
    emoji: '\u{1F46A}',
    words: [
      w('一', 'yī', '1, 하나'),
      w('二', 'èr', '2, 둘'),
      w('三', 'sān', '3, 셋'),
      w('四', 'sì', '4, 넷'),
      w('五', 'wǔ', '5, 다섯'),
      w('六', 'liù', '6, 여섯'),
      w('七', 'qī', '7, 일곱'),
      w('八', 'bā', '8, 여덟'),
      w('九', 'jiǔ', '9, 아홉'),
      w('十', 'shí', '10, 열'),
      w('爸爸', 'bà ba', '아빠'),
      w('妈妈', 'mā ma', '엄마'),
      w('儿子', 'ér zi', '아들'),
      w('女儿', 'nǚ ér', '딸'),
      w('家', 'jiā', '집, 가족'),
    ],
  },
];

export function getLevel(levelId) {
  return LEVELS.find((lv) => lv.id === levelId);
}

export function poolForLevel(levelId) {
  const lv = getLevel(levelId);
  return lv ? lv.words : [];
}

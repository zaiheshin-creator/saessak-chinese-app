// 상황별 회화 문장 레벨. 레벨1(HSK1급)에서 이미 배운 단어를 조합한
// 짧은 인사·자기소개·감사 표현 16문장. 데이터 구조(hanzi/pinyin/meaning)는
// units.js의 단어 데이터와 동일하게 유지해서 기존 퀴즈 화면/로직을 그대로 재사용한다.

function s(hanzi, pinyin, meaning) {
  return { hanzi, pinyin, meaning };
}

export const SENTENCES = [
  // --- 인사 ---
  s('你好!', 'nǐ hǎo', '안녕하세요!'),
  s('早上好!', 'zǎo shang hǎo', '좋은 아침이에요!'),
  s('晚上好!', 'wǎn shang hǎo', '안녕하세요(저녁 인사)!'),
  s('你好吗?', 'nǐ hǎo ma', '잘 지내세요?'),
  s('我很好，谢谢。', 'wǒ hěn hǎo xiè xie', '저는 잘 지내요, 고마워요.'),
  // --- 감사·사과 ---
  s('谢谢你!', 'xiè xie nǐ', '고마워요!'),
  s('不客气。', 'bù kè qi', '천만에요.'),
  s('对不起。', 'duì bu qǐ', '미안해요.'),
  s('没关系。', 'méi guān xi', '괜찮아요.'),
  // --- 자기소개 ---
  s('我叫小明。', 'wǒ jiào xiǎo míng', '제 이름은 샤오밍이에요.'),
  s('你叫什么名字?', 'nǐ jiào shén me míng zi', '이름이 뭐예요?'),
  s('我是学生。', 'wǒ shì xué sheng', '저는 학생이에요.'),
  s('认识你很高兴。', 'rèn shi nǐ hěn gāo xìng', '만나서 반가워요.'),
  s('他是我的朋友。', 'tā shì wǒ de péng you', '그는 제 친구예요.'),
  // --- 작별 ---
  s('再见!', 'zài jiàn', '안녕히 가세요!'),
  s('明天见!', 'míng tiān jiàn', '내일 만나요!'),
];

// 상황별 회화 문장 확장(주제별 유닛). 레벨1~3(HSK1~3) 어휘를 최대한 재사용해
// 새로 작문한 예문이며, 특정 교재의 문장을 그대로 옮긴 것이 아니다.

export const TIME_SENTENCES = [
  s('现在几点?', 'xiàn zài jǐ diǎn', '지금 몇 시예요?'),
  s('现在三点。', 'xiàn zài sān diǎn', '지금 3시예요.'),
  s('今天星期几?', 'jīn tiān xīng qī jǐ', '오늘 무슨 요일이에요?'),
  s('今天星期五。', 'jīn tiān xīng qī wǔ', '오늘은 금요일이에요.'),
  s('今天几月几号?', 'jīn tiān jǐ yuè jǐ hào', '오늘 몇 월 며칠이에요?'),
  s('今天八月九号。', 'jīn tiān bā yuè jiǔ hào', '오늘은 8월 9일이에요.'),
  s('你几岁?', 'nǐ jǐ suì', '몇 살이에요?'),
  s('我十岁。', 'wǒ shí suì', '저는 열 살이에요.'),
  s('明天是我的生日。', 'míng tiān shì wǒ de shēng rì', '내일은 제 생일이에요.'),
  s('现在是上午还是下午?', 'xiàn zài shì shàng wǔ hái shi xià wǔ', '지금 오전이에요, 아니면 오후예요?'),
  s('我们几点见面?', 'wǒ men jǐ diǎn jiàn miàn', '우리 몇 시에 만나요?'),
  s('现在是晚上八点。', 'xiàn zài shì wǎn shang bā diǎn', '지금은 저녁 8시예요.'),
];

export const SHOPPING_SENTENCES = [
  s('这个多少钱?', 'zhè ge duō shao qián', '이거 얼마예요?'),
  s('五块钱。', 'wǔ kuài qián', '5위안이에요.'),
  s('太贵了。', 'tài guì le', '너무 비싸요.'),
  s('可以便宜一点吗?', 'kě yǐ pián yi yì diǎn ma', '좀 싸게 해줄 수 있어요?'),
  s('我要买这件衣服。', 'wǒ yào mǎi zhè jiàn yī fu', '저는 이 옷을 사고 싶어요.'),
  s('这个颜色很漂亮。', 'zhè ge yán sè hěn piào liang', '이 색깔 예뻐요.'),
  s('你要什么颜色?', 'nǐ yào shén me yán sè', '무슨 색을 원하세요?'),
  s('我喜欢红色。', 'wǒ xǐ huan hóng sè', '저는 빨간색을 좋아해요.'),
  s('这双鞋很便宜。', 'zhè shuāng xié hěn pián yi', '이 신발은 싸요.'),
  s('我想买一个苹果。', 'wǒ xiǎng mǎi yī gè píng guǒ', '사과 한 개를 사고 싶어요.'),
  s('这本书多少钱?', 'zhè běn shū duō shao qián', '이 책은 얼마예요?'),
  s('我没有钱。', 'wǒ méi yǒu qián', '저는 돈이 없어요.'),
];

export const RESTAURANT_SENTENCES = [
  s('我饿了。', 'wǒ è le', '저는 배고파요.'),
  s('服务员，请给我菜单。', 'fú wù yuán, qǐng gěi wǒ cài dān', '저기요, 메뉴 주세요.'),
  s('我要米饭。', 'wǒ yào mǐ fàn', '밥 주세요.'),
  s('这个菜很好吃。', 'zhè ge cài hěn hǎo chī', '이 요리는 맛있어요.'),
  s('我要喝水。', 'wǒ yào hē shuǐ', '저는 물을 마시고 싶어요.'),
  s('我要喝茶。', 'wǒ yào hē chá', '저는 차를 마시고 싶어요.'),
  s('我要一个苹果。', 'wǒ yào yī gè píng guǒ', '사과 하나 주세요.'),
  s('谢谢，很好吃!', 'xiè xie, hěn hǎo chī', '고마워요, 정말 맛있어요!'),
  s('你想吃什么?', 'nǐ xiǎng chī shén me', '뭘 먹고 싶어요?'),
  s('我想吃水果。', 'wǒ xiǎng chī shuǐ guǒ', '저는 과일이 먹고 싶어요.'),
  s('这个菜多少钱?', 'zhè ge cài duō shao qián', '이 요리는 얼마예요?'),
  s('我不饿。', 'wǒ bù è', '저는 배고프지 않아요.'),
];

export const DIRECTIONS_SENTENCES = [
  s('洗手间在哪里?', 'xǐ shǒu jiān zài nǎ lǐ', '화장실이 어디예요?'),
  s('学校在哪里?', 'xué xiào zài nǎ lǐ', '학교가 어디예요?'),
  s('学校在前面。', 'xué xiào zài qián miàn', '학교는 앞쪽에 있어요.'),
  s('商店在后面。', 'shāng diàn zài hòu mian', '가게는 뒤쪽에 있어요.'),
  s('银行在右边。', 'yín háng zài yòu bian', '은행은 오른쪽에 있어요.'),
  s('公园在左边。', 'gōng yuán zài zuǒ bian', '공원은 왼쪽에 있어요.'),
  s('医院离这里远吗?', 'yī yuàn lí zhè lǐ yuǎn ma', '병원이 여기서 멀어요?'),
  s('不远，很近。', 'bù yuǎn, hěn jìn', '안 멀어요, 가까워요.'),
  s('火车站在附近。', 'huǒ chē zhàn zài fù jìn', '기차역이 근처에 있어요.'),
  s('请问，怎么走?', 'qǐng wèn, zěn me zǒu', '실례합니다, 어떻게 가요?'),
  s('一直走，就到了。', 'yī zhí zǒu, jiù dào le', '쭉 가면 바로 도착해요.'),
  s('火车站离这里很近。', 'huǒ chē zhàn lí zhè lǐ hěn jìn', '기차역은 여기서 가까워요.'),
];

export const WEATHER_SENTENCES = [
  s('今天天气怎么样?', 'jīn tiān tiān qì zěn me yàng', '오늘 날씨 어때요?'),
  s('今天天气很好。', 'jīn tiān tiān qì hěn hǎo', '오늘 날씨가 좋아요.'),
  s('今天很热。', 'jīn tiān hěn rè', '오늘 더워요.'),
  s('今天很冷。', 'jīn tiān hěn lěng', '오늘 추워요.'),
  s('今天下雨了。', 'jīn tiān xià yǔ le', '오늘 비가 와요.'),
  s('明天会下雪吗?', 'míng tiān huì xià xuě ma', '내일 눈이 올까요?'),
  s('今天很晴。', 'jīn tiān hěn qíng', '오늘은 맑아요.'),
  s('昨天是阴天。', 'zuó tiān shì yīn tiān', '어제는 흐린 날이었어요.'),
  s('我不喜欢下雨天。', 'wǒ bù xǐ huan xià yǔ tiān', '저는 비 오는 날을 안 좋아해요.'),
  s('今天太热了，我想喝水。', 'jīn tiān tài rè le, wǒ xiǎng hē shuǐ', '오늘 너무 더워서, 저는 물을 마시고 싶어요.'),
];

export const HOBBY_SENTENCES = [
  s('你喜欢做什么?', 'nǐ xǐ huan zuò shén me', '뭐 하는 걸 좋아해요?'),
  s('我喜欢唱歌。', 'wǒ xǐ huan chàng gē', '저는 노래 부르는 걸 좋아해요.'),
  s('我喜欢跳舞。', 'wǒ xǐ huan tiào wǔ', '저는 춤추는 걸 좋아해요.'),
  s('我喜欢游泳。', 'wǒ xǐ huan yóu yǒng', '저는 수영을 좋아해요.'),
  s('我喜欢打篮球。', 'wǒ xǐ huan dǎ lán qiú', '저는 농구를 좋아해요.'),
  s('我喜欢跑步。', 'wǒ xǐ huan pǎo bù', '저는 달리기를 좋아해요.'),
  s('你喜欢什么运动?', 'nǐ xǐ huan shén me yùn dòng', '무슨 운동을 좋아해요?'),
  s('我周末喜欢看电影。', 'wǒ zhōu mò xǐ huan kàn diàn yǐng', '저는 주말에 영화 보는 걸 좋아해요.'),
  s('我喜欢听音乐。', 'wǒ xǐ huan tīng yīn yuè', '저는 음악 듣는 걸 좋아해요.'),
  s('我喜欢看书。', 'wǒ xǐ huan kàn shū', '저는 책 읽는 걸 좋아해요.'),
  s('周末我想休息。', 'zhōu mò wǒ xiǎng xiū xi', '주말에는 쉬고 싶어요.'),
  s('我们一起玩吧。', 'wǒ men yī qǐ wán ba', '우리 같이 놀아요.'),
  s('你会游泳吗?', 'nǐ huì yóu yǒng ma', '수영할 줄 알아요?'),
];

export const SCHOOL_SENTENCES = [
  s('你今天有作业吗?', 'nǐ jīn tiān yǒu zuò yè ma', '오늘 숙제 있어요?'),
  s('我今天有很多作业。', 'wǒ jīn tiān yǒu hěn duō zuò yè', '저는 오늘 숙제가 많아요.'),
  s('你是几年级?', 'nǐ shì jǐ nián jí', '몇 학년이에요?'),
  s('我是三年级学生。', 'wǒ shì sān nián jí xué sheng', '저는 3학년 학생이에요.'),
  s('我们的老师很好。', 'wǒ men de lǎo shī hěn hǎo', '우리 선생님은 좋으세요.'),
  s('我喜欢我的同学。', 'wǒ xǐ huan wǒ de tóng xué', '저는 제 반 친구를 좋아해요.'),
  s('教室里有很多学生。', 'jiào shì lǐ yǒu hěn duō xué sheng', '교실에 학생이 많아요.'),
  s('明天有考试。', 'míng tiān yǒu kǎo shì', '내일 시험이 있어요.'),
  s('我要认真学习。', 'wǒ yào rèn zhēn xué xí', '저는 열심히 공부할 거예요.'),
  s('我每天努力学习汉语。', 'wǒ měi tiān nǔ lì xué xí hàn yǔ', '저는 매일 열심히 중국어를 공부해요.'),
  s('下课了!', 'xià kè le', '수업이 끝났어요!'),
  s('我在学校学习汉语。', 'wǒ zài xué xiào xué xí hàn yǔ', '저는 학교에서 중국어를 배워요.'),
];

export const FAMILY_SENTENCES = [
  s('你家有几口人?', 'nǐ jiā yǒu jǐ kǒu rén', '가족이 몇 명이에요?'),
  s('我家有五口人。', 'wǒ jiā yǒu wǔ kǒu rén', '저희 가족은 다섯 명이에요.'),
  s('这是我爸爸。', 'zhè shì wǒ bà ba', '이분은 저희 아빠예요.'),
  s('这是我妈妈。', 'zhè shì wǒ mā ma', '이분은 저희 엄마예요.'),
  s('我有一个哥哥。', 'wǒ yǒu yī gè gē ge', '저는 형(오빠)이 한 명 있어요.'),
  s('我有一个姐姐。', 'wǒ yǒu yī gè jiě jie', '저는 누나(언니)가 한 명 있어요.'),
  s('我没有弟弟。', 'wǒ méi yǒu dì di', '저는 남동생이 없어요.'),
  s('我没有妹妹。', 'wǒ méi yǒu mèi mei', '저는 여동생이 없어요.'),
  s('他是我爸爸的朋友。', 'tā shì wǒ bà ba de péng you', '그는 저희 아빠의 친구예요.'),
  s('我爱我家。', 'wǒ ài wǒ jiā', '저는 우리 가족을 사랑해요.'),
  s('我家人都很健康。', 'wǒ jiā rén dōu hěn jiàn kāng', '우리 가족은 모두 건강해요.'),
  s('我家很快乐。', 'wǒ jiā hěn kuài lè', '저희 가족은 행복해요.'),
];

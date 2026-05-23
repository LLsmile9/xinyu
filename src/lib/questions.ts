// ============ Question Types ============
export type QuestionType = 'color' | 'nature' | 'symbol' | 'sensation' | 'shadow' | 'spirit';

export interface QuestionOption {
  value: string;
  display: string;
}

export interface Question {
  id: string;
  title: string;
  subtitle: string;
  type: QuestionType;
  options: QuestionOption[];
}

// ============ 6 Categories × 30 Questions = 180 Total ============
const QUESTION_POOL: Question[] = [

  // ═══════════════════════════════════════════
  // 色彩 Color (30)
  // ═══════════════════════════════════════════
  { id: 'c01', title: '此刻你的内心是什么颜色？', subtitle: '闭上眼，感受那个颜色', type: 'color', options: [{ value: '深蓝', display: '🔵' },{ value: '暖橙', display: '🟠' },{ value: '嫩绿', display: '🟢' },{ value: '灰白', display: '⚪' }] },
  { id: 'c02', title: '你现在最需要的颜色是？', subtitle: '直觉选择', type: 'color', options: [{ value: '金色', display: '🟡' },{ value: '湖蓝', display: '💎' },{ value: '粉红', display: '💗' },{ value: '银灰', display: '🪞' }] },
  { id: 'c03', title: '如果今天是一种渐变色？', subtitle: '感受色彩的流动', type: 'color', options: [{ value: '暖到冷', display: '🌅➡️🌊' },{ value: '暗到明', display: '🌑➡️☀️' },{ value: '灰到彩', display: '🌫️➡️🌈' },{ value: '冷到暖', display: '❄️➡️🔥' }] },
  { id: 'c04', title: '你此刻需要什么光？', subtitle: '光也有颜色', type: 'color', options: [{ value: '烛光', display: '🕯️' },{ value: '晨曦', display: '🌅' },{ value: '月光', display: '🌙' },{ value: '极光', display: '💚' }] },
  { id: 'c05', title: '你的心事是什么色调？', subtitle: '不是开心或难过，是色调', type: 'color', options: [{ value: '暖调', display: '🧡' },{ value: '冷调', display: '💙' },{ value: '灰调', display: '🩶' },{ value: '彩调', display: '🌈' }] },
  { id: 'c06', title: '如果给今天画一幅画，主色是？', subtitle: '想象那幅画', type: 'color', options: [{ value: '蔚蓝', display: '🫐' },{ value: '赭红', display: '🧱' },{ value: '鹅黄', display: '🌻' },{ value: '墨绿', display: '🌲' }] },
  { id: 'c07', title: '此刻你最想被什么颜色包围？', subtitle: '一个颜色的拥抱', type: 'color', options: [{ value: '天蓝', display: '🦋' },{ value: '橘红', display: '🍊' },{ value: '薄荷绿', display: '🍃' },{ value: '薰衣草紫', display: '💐' }] },
  { id: 'c08', title: '你的情绪此刻是什么饱和度？', subtitle: '浓烈还是淡雅', type: 'color', options: [{ value: '高饱和', display: '🔴' },{ value: '低饱和', display: '🩷' },{ value: '黑白', display: '⬛' },{ value: '透明', display: '💧' }] },
  { id: 'c09', title: '如果心事有颜色，它今天偏？', subtitle: '靠近哪个方向', type: 'color', options: [{ value: '红橙', display: '🔥' },{ value: '蓝紫', display: '🔮' },{ value: '黄绿', display: '🍋' },{ value: '白灰', display: '☁️' }] },
  { id: 'c10', title: '你最想穿什么颜色的衣服出门？', subtitle: '衣服颜色反映内心', type: 'color', options: [{ value: '白', display: '⬜' },{ value: '黑', display: '⬛' },{ value: '红', display: '🟥' },{ value: '蓝', display: '🟦' }] },
  { id: 'c11', title: '如果心情是一杯饮品，它是什么色？', subtitle: '想象那杯饮品', type: 'color', options: [{ value: '琥珀', display: '🫖' },{ value: '碧绿', display: '🍵' },{ value: '酒红', display: '🍷' },{ value: '奶白', display: '🥛' }] },
  { id: 'c12', title: '你现在更像日出还是日落？', subtitle: '同为光，温度不同', type: 'color', options: [{ value: '日出', display: '🌅' },{ value: '日落', display: '🌇' },{ value: '正午', display: '☀️' },{ value: '极夜', display: '🌌' }] },
  { id: 'c13', title: '你此刻的能量是什么颜色？', subtitle: '能量有颜色', type: 'color', options: [{ value: '金色', display: '✨' },{ value: '银色', display: '🪙' },{ value: '铜色', display: '🥉' },{ value: '暗色', display: '🌑' }] },
  { id: 'c14', title: '如果选一种颜色代表你的今天？', subtitle: '为今天选一个颜色', type: 'color', options: [{ value: '珊瑚', display: '🪸' },{ value: '靛蓝', display: '🫐' },{ value: '苔绿', display: '🌿' },{ value: '烟灰', display: '🌫️' }] },
  { id: 'c15', title: '此刻你的灵魂在哪个色环位置？', subtitle: '想象一个色环', type: 'color', options: [{ value: '暖色区', display: '🟠' },{ value: '冷色区', display: '🔵' },{ value: '中性区', display: '🟢' },{ value: '无色区', display: '⚪' }] },
  { id: 'c16', title: '你想要哪种颜色的窗帘？', subtitle: '窗帘隔开世界', type: 'color', options: [{ value: '米白', display: '🪟' },{ value: '深蓝', display: '🧿' },{ value: '暖黄', display: '💡' },{ value: '浅粉', display: '🌸' }] },
  { id: 'c17', title: '如果今天是一种宝石？', subtitle: '宝石有颜色和光泽', type: 'color', options: [{ value: '红宝石', display: '❤️' },{ value: '蓝宝石', display: '💙' },{ value: '翡翠', display: '💚' },{ value: '月光石', display: '🤍' }] },
  { id: 'c18', title: '你的沉默是什么颜色？', subtitle: '沉默并非无色', type: 'color', options: [{ value: '深蓝', display: '🌊' },{ value: '灰色', display: '🌫️' },{ value: '白色', display: '❄️' },{ value: '黑色', display: '🕳️' }] },
  { id: 'c19', title: '此刻你的呼吸是什么颜色？', subtitle: '呼吸也有色彩', type: 'color', options: [{ value: '透明', display: '🫧' },{ value: '浅蓝', display: '💨' },{ value: '暖橙', display: '🌤️' },{ value: '淡绿', display: '🌬️' }] },
  { id: 'c20', title: '你希望明天的天空是什么色？', subtitle: '对未来的色彩期待', type: 'color', options: [{ value: '晴蓝', display: '🌤️' },{ value: '霞红', display: '🌅' },{ value: '雾灰', display: '🌫️' },{ value: '星紫', display: '💜' }] },
  { id: 'c21', title: '此刻你像哪种花的颜色？', subtitle: '花的语言是色彩', type: 'color', options: [{ value: '向日葵黄', display: '🌻' },{ value: '薰衣草紫', display: '💜' },{ value: '白玫瑰', display: '🌹' },{ value: '红山茶', display: '🌺' }] },
  { id: 'c22', title: '你现在的状态更接近？', subtitle: '选择最贴近的', type: 'color', options: [{ value: '暖色调', display: '🧣' },{ value: '冷色调', display: '🧊' },{ value: '大地色', display: '🏔️' },{ value: '荧光色', display: '🪩' }] },
  { id: 'c23', title: '如果给此刻的你涂一层底色？', subtitle: '底色决定一切', type: 'color', options: [{ value: '暖金', display: '🫶' },{ value: '清蓝', display: '🫧' },{ value: '柔粉', display: '🩷' },{ value: '深灰', display: '🪨' }] },
  { id: 'c24', title: '你最想看到什么颜色的信封？', subtitle: '信封里有消息', type: 'color', options: [{ value: '牛皮纸', display: '📜' },{ value: '天蓝', display: '✉️' },{ value: '红色', display: '🧧' },{ value: '黑色', display: '🖤' }] },
  { id: 'c25', title: '此刻你的眼睛想看什么颜色？', subtitle: '眼睛会饿', type: 'color', options: [{ value: '绿色', display: '🌿' },{ value: '蓝色', display: '🌊' },{ value: '橙色', display: '🍊' },{ value: '白色', display: '☁️' }] },
  { id: 'c26', title: '你今天的底气和什么颜色共振？', subtitle: '底气是有颜色的', type: 'color', options: [{ value: '正红', display: '🔴' },{ value: '藏青', display: '🟦' },{ value: '翠绿', display: '🟩' },{ value: '土黄', display: '🟨' }] },
  { id: 'c27', title: '你的疲惫是什么颜色？', subtitle: '疲惫也有色彩', type: 'color', options: [{ value: '铅灰', display: '🪨' },{ value: '枯黄', display: '🍂' },{ value: '惨白', display: '👻' },{ value: '暗紫', display: '🟣' }] },
  { id: 'c28', title: '此刻你最想点亮什么色的灯？', subtitle: '灯色改变氛围', type: 'color', options: [{ value: '暖黄', display: '💡' },{ value: '冷白', display: '🔦' },{ value: '粉紫', display: '🪩' },{ value: '橘红', display: '🏮' }] },
  { id: 'c29', title: '如果你的直觉是一种颜色？', subtitle: '直觉的色彩', type: 'color', options: [{ value: '靛蓝', display: '🔮' },{ value: '橙黄', display: '🔶' },{ value: '翠绿', display: '🟢' },{ value: '银白', display: '🪞' }] },
  { id: 'c30', title: '你此刻最想融入哪种色彩的世界？', subtitle: '完全沉浸', type: 'color', options: [{ value: '海洋蓝', display: '🌊' },{ value: '森林绿', display: '🌲' },{ value: '沙漠金', display: '🏜️' },{ value: '极光紫', display: '💜' }] },

  // ═══════════════════════════════════════════
  // 自然 Nature (30)
  // ═══════════════════════════════════════════
  { id: 'n01', title: '你的灵魂此刻更接近哪种元素？', subtitle: '感受你内在的流动', type: 'nature', options: [{ value: '水', display: '💧' },{ value: '火', display: '🔥' },{ value: '风', display: '🌬️' },{ value: '土', display: '🪨' }] },
  { id: 'n02', title: '你的内心正处在什么季节？', subtitle: '不是外面的季节', type: 'nature', options: [{ value: '初春', display: '🌱' },{ value: '盛夏', display: '🌻' },{ value: '深秋', display: '🍂' },{ value: '寒冬', display: '❄️' }] },
  { id: 'n03', title: '如果此刻是一天中的某个时辰？', subtitle: '不是现在几点', type: 'nature', options: [{ value: '黎明', display: '🌅' },{ value: '正午', display: '🌤️' },{ value: '黄昏', display: '🌇' },{ value: '深夜', display: '🌑' }] },
  { id: 'n04', title: '你最想待在什么样的地方？', subtitle: '想象那个画面', type: 'nature', options: [{ value: '海边', display: '🏖️' },{ value: '森林', display: '🌲' },{ value: '山顶', display: '⛰️' },{ value: '小屋', display: '🏡' }] },
  { id: 'n05', title: '如果此刻你是一种自然现象？', subtitle: '不是天气，是更大的力量', type: 'nature', options: [{ value: '潮汐', display: '🌊' },{ value: '花开', display: '🌸' },{ value: '落叶', display: '🍂' },{ value: '融雪', display: '🫠' }] },
  { id: 'n06', title: '此刻你最缺少哪种力量？', subtitle: '诚实面对匮乏', type: 'nature', options: [{ value: '温柔', display: '🌊' },{ value: '勇气', display: '🔥' },{ value: '轻盈', display: '🍃' },{ value: '安定', display: '🏔️' }] },
  { id: 'n07', title: '你的心情像什么天气？', subtitle: '用天气描绘内心', type: 'nature', options: [{ value: '晴天', display: '☀️' },{ value: '小雨', display: '🌦️' },{ value: '薄雾', display: '🌫️' },{ value: '雷暴', display: '⛈️' }] },
  { id: 'n08', title: '你现在更像植物的哪个部分？', subtitle: '感受你成长的状态', type: 'nature', options: [{ value: '根', display: '🫚' },{ value: '叶', display: '🍃' },{ value: '花', display: '🌺' },{ value: '种子', display: '🌰' }] },
  { id: 'n09', title: '透过一扇窗，你看到了什么？', subtitle: '那扇窗框住了什么', type: 'nature', options: [{ value: '大海', display: '🌊' },{ value: '雪原', display: '🏔️' },{ value: '花园', display: '🌷' },{ value: '荒野', display: '🏜️' }] },
  { id: 'n10', title: '你正站在一座桥上，桥下是？', subtitle: '桥连接着两个世界', type: 'nature', options: [{ value: '河流', display: '🏞️' },{ value: '深渊', display: '🕳️' },{ value: '云海', display: '☁️' },{ value: '花田', display: '🌾' }] },
  { id: 'n11', title: '你的情绪此刻是什么形态的水？', subtitle: '水会随容器改变', type: 'nature', options: [{ value: '溪流', display: '🏞️' },{ value: '深海', display: '🌊' },{ value: '冰面', display: '🧊' },{ value: '蒸汽', display: '💨' }] },
  { id: 'n12', title: '此刻你的内心是什么温度？', subtitle: '不是体温，是心的温度', type: 'nature', options: [{ value: '冰冷', display: '🧊' },{ value: '微凉', display: '🎐' },{ value: '温暖', display: '🫖' },{ value: '灼热', display: '🔥' }] },
  { id: 'n13', title: '你最想回到哪个年龄的午后？', subtitle: '那个午后在做什么', type: 'nature', options: [{ value: '童年', display: '🧒' },{ value: '少年', display: '🎒' },{ value: '青年', display: '🎓' },{ value: '此刻', display: '🪞' }] },
  { id: 'n14', title: '如果此刻你是一棵树？', subtitle: '树有自己的姿态', type: 'nature', options: [{ value: '老树', display: '🌳' },{ value: '新苗', display: '🌱' },{ value: '弯曲', display: '🌴' },{ value: '枯木', display: '🪵' }] },
  { id: 'n15', title: '你此刻的风向是？', subtitle: '风带着消息', type: 'nature', options: [{ value: '南风', display: '🌬️' },{ value: '北风', display: '🧊' },{ value: '无风', display: '🤫' },{ value: '旋风', display: '🌀' }] },
  { id: 'n16', title: '如果此刻是大海的一个状态？', subtitle: '海有千百种面孔', type: 'nature', options: [{ value: '平静', display: '🏖️' },{ value: '波涛', display: '🌊' },{ value: '退潮', display: '🐚' },{ value: '深海', display: '🐋' }] },
  { id: 'n17', title: '你此刻更像哪种地形？', subtitle: '内心地貌', type: 'nature', options: [{ value: '平原', display: '🌾' },{ value: '峡谷', display: '🏔️' },{ value: '沙漠', display: '🏜️' },{ value: '沼泽', display: '🐸' }] },
  { id: 'n18', title: '如果此刻是一道光？', subtitle: '光穿越一切', type: 'nature', options: [{ value: '晨光', display: '🌅' },{ value: '暮光', display: '🌇' },{ value: '星光', display: '✨' },{ value: '萤火', display: '🪲' }] },
  { id: 'n19', title: '你的内心此刻是什么声音？', subtitle: '自然之声', type: 'nature', options: [{ value: '溪水', display: '💧' },{ value: '风声', display: '🌬️' },{ value: '鸟鸣', display: '🐦' },{ value: '寂静', display: '🤫' }] },
  { id: 'n20', title: '你此刻最想走进哪个场景？', subtitle: '想象那个画面', type: 'nature', options: [{ value: '雨林', display: '🌴' },{ value: '雪原', display: '❄️' },{ value: '星空', display: '🌌' },{ value: '湖畔', display: '🏞️' }] },
  { id: 'n21', title: '此刻你最像哪种云？', subtitle: '云是天空的表情', type: 'nature', options: [{ value: '白云', display: '☁️' },{ value: '乌云', display: '⛈️' },{ value: '彩云', display: '🌈' },{ value: '无云', display: '☀️' }] },
  { id: 'n22', title: '如果你的心是一片土地？', subtitle: '土地承载一切', type: 'nature', options: [{ value: '沃土', display: '🌱' },{ value: '沙地', display: '🏜️' },{ value: '冻土', display: '🧊' },{ value: '湿地', display: '🌿' }] },
  { id: 'n23', title: '此刻你的节奏更像？', subtitle: '自然的律动', type: 'nature', options: [{ value: '潮起', display: '🌊' },{ value: '潮落', display: '🏖️' },{ value: '静止', display: '🪨' },{ value: '奔涌', display: ' Rapids' }] },
  { id: 'n24', title: '你此刻最想闻到什么气息？', subtitle: '气息唤醒记忆', type: 'nature', options: [{ value: '雨后泥土', display: '🌧️' },{ value: '松木', display: '🌲' },{ value: '海风', display: '🌊' },{ value: '花香', display: '🌸' }] },
  { id: 'n25', title: '如果此刻是一年的第几天？', subtitle: '不是日历上的', type: 'nature', options: [{ value: '第一天', display: '🌅' },{ value: '中间', display: '☀️' },{ value: '最后', display: '🌇' },{ value: '某一天', display: '📅' }] },
  { id: 'n26', title: '你的内心此刻是什么地貌？', subtitle: '俯瞰内心', type: 'nature', options: [{ value: '群岛', display: '🏝️' },{ value: '火山', display: '🌋' },{ value: '冰川', display: '🧊' },{ value: '草原', display: '🌾' }] },
  { id: 'n27', title: '如果此刻你的心是一片天空？', subtitle: '天空包容一切', type: 'nature', options: [{ value: '晴空', display: '🌤️' },{ value: '阴天', display: '☁️' },{ value: '暴雨', display: '⛈️' },{ value: '极光', display: '💚' }] },
  { id: 'n28', title: '此刻你最想触摸什么自然之物？', subtitle: '自然的触感', type: 'nature', options: [{ value: '树皮', display: '🌳' },{ value: '溪水', display: '💧' },{ value: '细沙', display: '🏖️' },{ value: '雪花', display: '❄️' }] },
  { id: 'n29', title: '如果你的成长是一棵树，现在？', subtitle: '树不会着急', type: 'nature', options: [{ value: '扎根', display: '🫚' },{ value: '抽枝', display: '🌿' },{ value: '繁茂', display: '🌳' },{ value: '落叶', display: '🍂' }] },
  { id: 'n30', title: '此刻你更需要阳光还是雨水？', subtitle: '万物各有所需', type: 'nature', options: [{ value: '阳光', display: '☀️' },{ value: '雨水', display: '🌧️' },{ value: '微风', display: '🌬️' },{ value: '雪花', display: '❄️' }] },

  // ═══════════════════════════════════════════
  // 象征 Symbol (30)
  // ═══════════════════════════════════════════
  { id: 's01', title: '如果抽一张灵魂牌，它会是？', subtitle: '凭直觉选择', type: 'symbol', options: [{ value: '月亮', display: '🌙' },{ value: '星星', display: '⭐' },{ value: '塔', display: '🗼' },{ value: '太阳', display: '☀️' }] },
  { id: 's02', title: '你觉得自己正站在哪扇门前？', subtitle: '想象那扇门的模样', type: 'symbol', options: [{ value: '半开', display: '🚪' },{ value: '紧闭', display: '🔒' },{ value: '敞开', display: '🏛️' },{ value: '隐形', display: '✨' }] },
  { id: 's03', title: '如果此刻手中握着一件信物？', subtitle: '它代表你现在的状态', type: 'symbol', options: [{ value: '钥匙', display: '🔑' },{ value: '镜子', display: '🪞' },{ value: '罗盘', display: '🧭' },{ value: '羽毛', display: '🪶' }] },
  { id: 's04', title: '你面前出现了几条路？', subtitle: '想象那个路口', type: 'symbol', options: [{ value: '直行', display: '⬆️' },{ value: '岔路', display: '🔀' },{ value: '回旋', display: '🔄' },{ value: '断桥', display: '🌉' }] },
  { id: 's05', title: '如果此刻你是一种容器？', subtitle: '容器决定能装什么', type: 'symbol', options: [{ value: '杯子', display: '🥛' },{ value: '瓶子', display: '🫙' },{ value: '碗', display: '🥣' },{ value: '壶', display: '🫖' }] },
  { id: 's06', title: '你的灵魂此刻是什么形状？', subtitle: '形状暗示状态', type: 'symbol', options: [{ value: '圆形', display: '⭕' },{ value: '方形', display: '⬜' },{ value: '三角形', display: '🔺' },{ value: '不规则', display: '🫠' }] },
  { id: 's07', title: '如果此刻你是一件乐器？', subtitle: '你发出什么声音', type: 'symbol', options: [{ value: '钢琴', display: '🎹' },{ value: '吉他', display: '🎸' },{ value: '笛子', display: '🪈' },{ value: '鼓', display: '🥁' }] },
  { id: 's08', title: '你觉得自己正拿着什么武器？', subtitle: '武器代表力量', type: 'symbol', options: [{ value: '盾牌', display: '🛡️' },{ value: '剑', display: '⚔️' },{ value: '弓', display: '🏹' },{ value: '空手', display: '🤲' }] },
  { id: 's09', title: '如果此刻你是一本书？', subtitle: '书有不同状态', type: 'symbol', options: [{ value: '翻开', display: '📖' },{ value: '合上', display: '📕' },{ value: '空白', display: '📓' },{ value: '旧书', display: '📚' }] },
  { id: 's10', title: '你的心此刻是一栋什么建筑？', subtitle: '建筑是心灵的容器', type: 'symbol', options: [{ value: '小屋', display: '🏡' },{ value: '城堡', display: '🏰' },{ value: '废墟', display: '🏚️' },{ value: '寺庙', display: '⛩️' }] },
  { id: 's11', title: '如果此刻你是一盏灯？', subtitle: '灯照亮不同范围', type: 'symbol', options: [{ value: '明灯', display: '💡' },{ value: '烛火', display: '🕯️' },{ value: '暗灯', display: '🔦' },{ value: '熄灭', display: '🌑' }] },
  { id: 's12', title: '此刻你最像哪种交通工具？', subtitle: '速度与方向', type: 'symbol', options: [{ value: '船', display: '⛵' },{ value: '火车', display: '🚂' },{ value: '步行', display: '🚶' },{ value: '飞机', display: '✈️' }] },
  { id: 's13', title: '如果此刻你是一个数字？', subtitle: '数字有象征', type: 'symbol', options: [{ value: '一', display: '1️⃣' },{ value: '零', display: '0️⃣' },{ value: '无限', display: '♾️' },{ value: '未知', display: '❓' }] },
  { id: 's14', title: '你的此刻更像哪种游戏？', subtitle: '人生如戏', type: 'symbol', options: [{ value: '迷宫', display: '🌀' },{ value: '棋局', display: '♟️' },{ value: '捉迷藏', display: '🙈' },{ value: '搭积木', display: '🧱' }] },
  { id: 's15', title: '如果此刻你是一个季节的仪式？', subtitle: '仪式标记时间', type: 'symbol', options: [{ value: '播种', display: '🌱' },{ value: '丰收', display: '🌾' },{ value: '祭祀', display: '🕯️' },{ value: '庆典', display: '🎉' }] },
  { id: 's16', title: '你此刻更像哪种线？', subtitle: '线连接一切', type: 'symbol', options: [{ value: '直线', display: '➡️' },{ value: '曲线', display: '〰️' },{ value: '断线', display: '✂️' },{ value: '缠绕', display: '🧶' }] },
  { id: 's17', title: '如果此刻你是一个钟表？', subtitle: '时间有不同状态', type: 'symbol', options: [{ value: '快走', display: '⏩' },{ value: '慢走', display: '🐌' },{ value: '停摆', display: '⏸️' },{ value: '倒转', display: '⏪' }] },
  { id: 's18', title: '你的内心此刻像哪种镜子？', subtitle: '镜子映照真实', type: 'symbol', options: [{ value: '清晰', display: '🪞' },{ value: '模糊', display: '🌫️' },{ value: '碎裂', display: '💔' },{ value: '哈哈镜', display: '🤡' }] },
  { id: 's19', title: '如果此刻你是一封信？', subtitle: '信有不同的命运', type: 'symbol', options: [{ value: '已寄出', display: '✉️' },{ value: '未写完', display: '✍️' },{ value: '被退回', display: '↩️' },{ value: '从未拆开', display: '💌' }] },
  { id: 's20', title: '你此刻更像哪种门？', subtitle: '门是界限也是通道', type: 'symbol', options: [{ value: '城门', display: '🏯' },{ value: '房门', display: '🚪' },{ value: '心门', display: '❤️‍🩹' },{ value: '天门', display: '⛩️' }] },
  { id: 's21', title: '如果此刻你是一把钥匙？', subtitle: '钥匙开启什么', type: 'symbol', options: [{ value: '开新门', display: '🔑' },{ value: '锁住', display: '🔒' },{ value: '遗失', display: '🕳️' },{ value: '万能', display: '🗝️' }] },
  { id: 's22', title: '你此刻最像哪种地图？', subtitle: '地图指引方向', type: 'symbol', options: [{ value: '清晰', display: '🗺️' },{ value: '残缺', display: '📜' },{ value: '空白', display: '📄' },{ value: '藏宝图', display: '🏴‍☠️' }] },
  { id: 's23', title: '如果此刻你是一枚硬币？', subtitle: '硬币有两面', type: 'symbol', options: [{ value: '正面', display: '🪙' },{ value: '反面', display: '🔄' },{ value: '立着', display: '⚖️' },{ value: '旋转中', display: '🌀' }] },
  { id: 's24', title: '你的内心此刻像什么桥？', subtitle: '桥连接两端', type: 'symbol', options: [{ value: '石桥', display: '🌉' },{ value: '吊桥', display: '⛓️' },{ value: '断桥', display: '💔' },{ value: '隐形桥', display: '✨' }] },
  { id: 's25', title: '如果此刻你是一种仪式感？', subtitle: '仪式给生活重量', type: 'symbol', options: [{ value: '点燃蜡烛', display: '🕯️' },{ value: '闭眼许愿', display: '🌠' },{ value: '深呼吸', display: '🌬️' },{ value: '拥抱', display: '🤗' }] },
  { id: 's26', title: '你此刻的状态更像？', subtitle: '选择一个象征', type: 'symbol', options: [{ value: '种子', display: '🌰' },{ value: '茧', display: '🦋' },{ value: '翅膀', display: '🪽' },{ value: '巢', display: '🪺' }] },
  { id: 's27', title: '如果此刻你是一张牌？', subtitle: '牌有不同的位置', type: 'symbol', options: [{ value: '正面朝上', display: '🃏' },{ value: '背面朝上', display: '🂠' },{ value: '在手中', display: '✋' },{ value: '在桌上', display: '♠️' }] },
  { id: 's28', title: '你的此刻更像哪种仪式？', subtitle: '仪式让人安定', type: 'symbol', options: [{ value: '独行', display: '🚶' },{ value: '守望', display: '👁️' },{ value: '告别', display: '👋' },{ value: '迎接', display: '🤲' }] },
  { id: 's29', title: '如果此刻你是一把尺子？', subtitle: '你在衡量什么', type: 'symbol', options: [{ value: '量距离', display: '📏' },{ value: '量时间', display: '⏳' },{ value: '量心', display: '❤️' },{ value: '已经折断', display: '✂️' }] },
  { id: 's30', title: '此刻你最像哪种光的状态？', subtitle: '光有不同形态', type: 'symbol', options: [{ value: '聚焦', display: '🔦' },{ value: '散开', display: '💡' },{ value: '闪烁', display: '✨' },{ value: '熄灭', display: '🌑' }] },

  // ═══════════════════════════════════════════
  // 感知 Sensation (30)
  // ═══════════════════════════════════════════
  { id: 'b01', title: '你的身体此刻最想做什么？', subtitle: '倾听身体的信号', type: 'sensation', options: [{ value: '蜷缩', display: '🧘' },{ value: '奔跑', display: '🏃' },{ value: '漂浮', display: '🫧' },{ value: '拥抱', display: '🤗' }] },
  { id: 'b02', title: '此刻你的心感觉有多重？', subtitle: '心的重量无法称量', type: 'sensation', options: [{ value: '羽毛', display: '🪶' },{ value: '石头', display: '🪨' },{ value: '水滴', display: '💧' },{ value: '铅块', display: '🧱' }] },
  { id: 'b03', title: '此刻你最想触摸的质感？', subtitle: '用触觉感知情绪', type: 'sensation', options: [{ value: '毛毯', display: '🧶' },{ value: '石面', display: '🪨' },{ value: '水流', display: '💧' },{ value: '丝绸', display: '🎀' }] },
  { id: 'b04', title: '此刻你的心情是什么味道？', subtitle: '用味觉感知情绪', type: 'sensation', options: [{ value: '甘甜', display: '🍯' },{ value: '微苦', display: '☕' },{ value: '辛辣', display: '🌶️' },{ value: '清淡', display: '🍵' }] },
  { id: 'b05', title: '此刻你最想以什么方式移动？', subtitle: '移动方式反映内心节奏', type: 'sensation', options: [{ value: '飞翔', display: '🦅' },{ value: '游泳', display: '🐬' },{ value: '漫步', display: '🐢' },{ value: '奔跑', display: '🐎' }] },
  { id: 'b06', title: '你的身体此刻最紧绷的部位？', subtitle: '身体记得一切', type: 'sensation', options: [{ value: '肩膀', display: '💆' },{ value: '胸口', display: '🫀' },{ value: '拳头', display: '✊' },{ value: '全身放松', display: '🧘' }] },
  { id: 'b07', title: '此刻你最想听到的声音？', subtitle: '声音能治愈', type: 'sensation', options: [{ value: '雨声', display: '🌧️' },{ value: '琴声', display: '🎹' },{ value: '人声', display: '🗣️' },{ value: '沉默', display: '🤫' }] },
  { id: 'b08', title: '如果此刻你能闻到一种气味？', subtitle: '气味直通记忆', type: 'sensation', options: [{ value: '咖啡', display: '☕' },{ value: '花香', display: '🌸' },{ value: '泥土', display: '🌱' },{ value: '旧书', display: '📚' }] },
  { id: 'b09', title: '你的呼吸此刻是？', subtitle: '关注呼吸', type: 'sensation', options: [{ value: '急促', display: '😮‍💨' },{ value: '缓慢', display: '🧘' },{ value: '浅', display: '🫁' },{ value: '深', display: '🌬️' }] },
  { id: 'b10', title: '此刻你的皮肤感受到什么？', subtitle: '皮肤是最大的器官', type: 'sensation', options: [{ value: '温暖', display: '☀️' },{ value: '寒冷', display: '❄️' },{ value: '酥麻', display: '✨' },{ value: '麻木', display: '🧊' }] },
  { id: 'b11', title: '此刻你最想被什么包裹？', subtitle: '安全感来自包裹', type: 'sensation', options: [{ value: '毯子', display: '🛏️' },{ value: '阳光', display: '☀️' },{ value: '海水', display: '🌊' },{ value: '风', display: '🌬️' }] },
  { id: 'b12', title: '你的双手此刻最想做什么？', subtitle: '手是心灵的延伸', type: 'sensation', options: [{ value: '握住', display: '🤝' },{ value: '放开', display: '🫳' },{ value: '创造', display: '🎨' },{ value: '祈祷', display: '🙏' }] },
  { id: 'b13', title: '此刻你的心跳在说什么？', subtitle: '倾听心跳', type: 'sensation', options: [{ value: '平静', display: '🫀' },{ value: '加速', display: '💓' },{ value: '沉重', display: '🥁' },{ value: '轻盈', display: '🫧' }] },
  { id: 'b14', title: '你最想此刻感受到什么触感？', subtitle: '触摸世界', type: 'sensation', options: [{ value: '柔软', display: '🧸' },{ value: '坚硬', display: '🪨' },{ value: '温热', display: '🫕' },{ value: '清凉', display: '🧊' }] },
  { id: 'b15', title: '如果此刻你的身体是一种乐器？', subtitle: '身体在演奏', type: 'sensation', options: [{ value: '弦乐', display: '🎻' },{ value: '打击', display: '🥁' },{ value: '管乐', display: '🎺' },{ value: '无声', display: '🤫' }] },
  { id: 'b16', title: '此刻你最需要的身体动作？', subtitle: '动一下就好了', type: 'sensation', options: [{ value: '伸展', display: '🤸' },{ value: '蜷缩', display: '🧘' },{ value: '跳跃', display: '🤾' },{ value: '静止', display: '🧍' }] },
  { id: 'b17', title: '你的胃此刻是什么感觉？', subtitle: '胃是第二大脑', type: 'sensation', options: [{ value: '温暖', display: '🍲' },{ value: '紧缩', display: '🪢' },{ value: '空荡', display: '🫙' },{ value: '充实', display: '🍚' }] },
  { id: 'b18', title: '此刻你最想喝什么？', subtitle: '饮品抚慰身心', type: 'sensation', options: [{ value: '热茶', display: '🍵' },{ value: '冰水', display: '🧊' },{ value: '甜饮', display: '🧋' },{ value: '清水', display: '💧' }] },
  { id: 'b19', title: '你的肩膀此刻是什么状态？', subtitle: '肩膀承载重量', type: 'sensation', options: [{ value: '沉重', display: '🏋️' },{ value: '轻松', display: '🧘' },{ value: '紧绷', display: '🪢' },{ value: '放松', display: '💆' }] },
  { id: 'b20', title: '此刻你更想被触碰还是独处？', subtitle: '身体知道答案', type: 'sensation', options: [{ value: '被拥抱', display: '🤗' },{ value: '独处', display: '🚶' },{ value: '轻触', display: '🪶' },{ value: '按摩', display: '💆' }] },
  { id: 'b21', title: '你的眼睛此刻需要什么？', subtitle: '眼睛也会累', type: 'sensation', options: [{ value: '闭眼', display: '🙈' },{ value: '远眺', display: '🏔️' },{ value: '绿意', display: '🌿' },{ value: '黑暗', display: '🌑' }] },
  { id: 'b22', title: '此刻你最想处在什么温度？', subtitle: '温度影响情绪', type: 'sensation', options: [{ value: '微凉', display: '🎐' },{ value: '温暖', display: '🫖' },{ value: '凉爽', display: '🌊' },{ value: '炎热', display: '🔥' }] },
  { id: 'b23', title: '你的脚步此刻想怎样走？', subtitle: '脚步是心的节奏', type: 'sensation', options: [{ value: '快步', display: '🏃' },{ value: '慢走', display: '🚶' },{ value: '停步', display: '🧍' },{ value: '跳舞', display: '💃' }] },
  { id: 'b24', title: '此刻你最想吃什么质感的东西？', subtitle: '口感的渴望', type: 'sensation', options: [{ value: '酥脆', display: '🥐' },{ value: '软糯', display: '🍡' },{ value: '爽滑', display: '🍜' },{ value: '温热', display: '🍲' }] },
  { id: 'b25', title: '你的下巴此刻是什么状态？', subtitle: '下巴透露紧张', type: 'sensation', options: [{ value: '紧咬', display: '😬' },{ value: '放松', display: '😊' },{ value: '微张', display: '😮' },{ value: '紧贴胸口', display: '🧘' }] },
  { id: 'b26', title: '此刻你最想做的微小动作？', subtitle: '小动作大意义', type: 'sensation', options: [{ value: '叹气', display: '😮‍💨' },{ value: '伸懒腰', display: '🤸' },{ value: '闭眼', display: '🙈' },{ value: '搓手', display: '🤲' }] },
  { id: 'b27', title: '如果此刻你是一种呼吸方式？', subtitle: '呼吸是生命的节奏', type: 'sensation', options: [{ value: '深长', display: '🧘' },{ value: '浅快', display: '😮‍💨' },{ value: '屏住', display: '🫁' },{ value: '叹息', display: '💨' }] },
  { id: 'b28', title: '你的脊椎此刻是什么姿态？', subtitle: '脊椎支撑一切', type: 'sensation', options: [{ value: '挺直', display: '🧍' },{ value: '弯曲', display: '🧎' },{ value: '放松', display: '🛋️' },{ value: '颤抖', display: '🥶' }] },
  { id: 'b29', title: '此刻你最想感受到什么？', subtitle: '身体知道你缺什么', type: 'sensation', options: [{ value: '温暖', display: '🔥' },{ value: '安全', display: '🛡️' },{ value: '自由', display: '🕊️' },{ value: '安静', display: '🤫' }] },
  { id: 'b30', title: '你的身体此刻像什么状态的水？', subtitle: '水随形变', type: 'sensation', options: [{ value: '冰', display: '🧊' },{ value: '温水', display: '🫖' },{ value: '蒸汽', display: '💨' },{ value: '流水', display: '💧' }] },

  // ═══════════════════════════════════════════
  // 阴影 Shadow (30)
  // ═══════════════════════════════════════════
  { id: 'd01', title: '此刻你最想逃避的是？', subtitle: '选择最接近的感受', type: 'shadow', options: [{ value: '喧嚣', display: '📢' },{ value: '期待', display: '🎯' },{ value: '责任', display: '⚖️' },{ value: '独处', display: '🚶' }] },
  { id: 'd02', title: '此刻最让你不安的是？', subtitle: '选一个最贴近的', type: 'shadow', options: [{ value: '未知', display: '❓' },{ value: '失去', display: '💔' },{ value: '停滞', display: '🫥' },{ value: '评判', display: '👁️' }] },
  { id: 'd03', title: '今天你戴的是哪副面具？', subtitle: '我们都戴着面具生活', type: 'shadow', options: [{ value: '微笑', display: '😊' },{ value: '坚强', display: '🛡️' },{ value: '无所谓', display: '😑' },{ value: '没戴', display: '🫥' }] },
  { id: 'd04', title: '你此刻最害怕面对的真相是？', subtitle: '真相让人自由', type: 'shadow', options: [{ value: '脆弱', display: '💔' },{ value: '孤独', display: '🌫️' },{ value: '渴望', display: '🌊' },{ value: '愤怒', display: '🔥' }] },
  { id: 'd05', title: '此刻你最想藏起来的是什么？', subtitle: '每个人都有秘密', type: 'shadow', options: [{ value: '眼泪', display: '😢' },{ value: '疲惫', display: '😮‍💨' },{ value: '需要', display: '🤲' },{ value: '柔软', display: '🧸' }] },
  { id: 'd06', title: '你的阴影此刻在说什么？', subtitle: '阴影也有声音', type: 'shadow', options: [{ value: '还不够好', display: '📉' },{ value: '你不配', display: '🚫' },{ value: '小心点', display: '⚠️' },{ value: '沉默', display: '🤐' }] },
  { id: 'd07', title: '此刻你最不愿意承认的是？', subtitle: '对自己诚实', type: 'shadow', options: [{ value: '害怕', display: '😨' },{ value: '嫉妒', display: '💚' },{ value: '依赖', display: '🪢' },{ value: '疲惫', display: '😮‍💨' }] },
  { id: 'd08', title: '你最想向谁证明什么？', subtitle: '证明的冲动', type: 'shadow', options: [{ value: '父母', display: '👨‍👩‍👧' },{ value: '自己', display: '🪞' },{ value: '前任', display: '💔' },{ value: '无人', display: '🚶' }] },
  { id: 'd09', title: '此刻你最深的匮乏感来自？', subtitle: '匮乏驱动行为', type: 'shadow', options: [{ value: '被爱', display: '💕' },{ value: '被看见', display: '👁️' },{ value: '被认可', display: '🏆' },{ value: '安全感', display: '🏠' }] },
  { id: 'd10', title: '你此刻最想对谁说"不"？', subtitle: '拒绝是力量', type: 'shadow', options: [{ value: '权威', display: '👔' },{ value: '期待', display: '🎯' },{ value: '习惯', display: '🔄' },{ value: '自己', display: '🪞' }] },
  { id: 'd11', title: '此刻你最不敢做的事？', subtitle: '恐惧的背后是渴望', type: 'shadow', options: [{ value: '表达', display: '🗣️' },{ value: '放手', display: '🕊️' },{ value: '开始', display: '🚀' },{ value: '停下来', display: '🛑' }] },
  { id: 'd12', title: '你的内心冲突此刻更像？', subtitle: '冲突是两个自我', type: 'shadow', options: [{ value: '拉锯', display: '⚔️' },{ value: '冷战', display: '🧊' },{ value: '和解', display: '🤝' },{ value: '混战', display: '🌪️' }] },
  { id: 'd13', title: '你最想放下的执念是？', subtitle: '执念让人沉重', type: 'shadow', options: [{ value: '完美', display: '💎' },{ value: '控制', display: '🎮' },{ value: '比较', display: '⚖️' },{ value: '过去', display: '⏪' }] },
  { id: 'd14', title: '此刻你最不想被打扰的角落？', subtitle: '每个人都有角落', type: 'shadow', options: [{ value: '悲伤', display: '😢' },{ value: '愤怒', display: '🔥' },{ value: '空无', display: '🕳️' },{ value: '回忆', display: '📷' }] },
  { id: 'd15', title: '你最害怕失去的是什么？', subtitle: '失去定义拥有', type: 'shadow', options: [{ value: '自由', display: '🕊️' },{ value: '关系', display: '💞' },{ value: '自我', display: '🪞' },{ value: '希望', display: '🌟' }] },
  { id: 'd16', title: '此刻你的自我怀疑在说什么？', subtitle: '怀疑也有价值', type: 'shadow', options: [{ value: '不够好', display: '📉' },{ value: '来不及了', display: '⏰' },{ value: '没人在意', display: '🌫️' },{ value: '安静的', display: '🤫' }] },
  { id: 'd17', title: '你最想撕掉的一个标签？', subtitle: '标签束缚灵魂', type: 'shadow', options: [{ value: '好人', display: '😇' },{ value: '坚强', display: '💪' },{ value: '懂事', display: '📖' },{ value: '成功', display: '🏆' }] },
  { id: 'd18', title: '此刻你最抗拒的改变？', subtitle: '抗拒指向恐惧', type: 'shadow', options: [{ value: '关系', display: '💑' },{ value: '身份', display: '🪪' },{ value: '习惯', display: '🔄' },{ value: '衰老', display: '⏳' }] },
  { id: 'd19', title: '你最不愿让别人看到的一面？', subtitle: '隐藏的也是珍贵的', type: 'shadow', options: [{ value: '软弱', display: '💔' },{ value: '需要', display: '🤲' },{ value: '野心', display: '🎯' },{ value: '天真', display: '🧒' }] },
  { id: 'd20', title: '此刻你最深的孤独来自？', subtitle: '孤独是灵魂的对话', type: 'shadow', options: [{ value: '不被理解', display: '🌫️' },{ value: '不被需要', display: '🕳️' },{ value: '不被看见', display: '👁️‍🗨️' },{ value: '自选的', display: '🚶' }] },
  { id: 'd21', title: '你最想对过去说的一句话？', subtitle: '与过去和解', type: 'shadow', options: [{ value: '对不起', display: '🙇' },{ value: '谢谢', display: '🙏' },{ value: '再见', display: '👋' },{ value: '没关系', display: '🤍' }] },
  { id: 'd22', title: '此刻你最无法原谅的是什么？', subtitle: '原谅需要勇气', type: 'shadow', options: [{ value: '他人', display: '👤' },{ value: '自己', display: '🪞' },{ value: '命运', display: '🎲' },{ value: '已原谅', display: '🕊️' }] },
  { id: 'd23', title: '你此刻最想回避的对话？', subtitle: '回避的对话最重要', type: 'shadow', options: [{ value: '关于未来', display: '🔮' },{ value: '关于感受', display: '💬' },{ value: '关于边界', display: '🚧' },{ value: '关于真心', display: '❤️' }] },
  { id: 'd24', title: '你此刻最紧抓不放的是什么？', subtitle: '紧抓也是一种恐惧', type: 'shadow', options: [{ value: '确定性', display: '🔒' },{ value: '一个人', display: '🤝' },{ value: '旧身份', display: '🪪' },{ value: '已松手', display: '🕊️' }] },
  { id: 'd25', title: '你最害怕在深夜面对的？', subtitle: '深夜最诚实', type: 'shadow', options: [{ value: '空虚', display: '🕳️' },{ value: '欲望', display: '🔥' },{ value: '遗憾', display: '⏪' },{ value: '自己', display: '🪞' }] },
  { id: 'd26', title: '你此刻最想关上的门？', subtitle: '关上也是选择', type: 'shadow', options: [{ value: '过去', display: '⏪' },{ value: '期待', display: '🎯' },{ value: '比较', display: '⚖️' },{ value: '一切', display: '🔒' }] },
  { id: 'd27', title: '你此刻最想对内心的小孩说？', subtitle: '内在小孩需要你', type: 'shadow', options: [{ value: '别怕', display: '🛡️' },{ value: '我在', display: '🤗' },{ value: '对不起', display: '🙇' },{ value: '你可以', display: '🌟' }] },
  { id: 'd28', title: '你最不想承认的依赖？', subtitle: '依赖不是软弱', type: 'shadow', options: [{ value: '被需要', display: '💞' },{ value: '被赞美', display: '🏆' },{ value: '被照顾', display: '🤱' },{ value: '无依赖', display: '🚶' }] },
  { id: 'd29', title: '此刻你最想切断的连接？', subtitle: '有些连接在消耗', type: 'shadow', options: [{ value: '期待', display: '🎯' },{ value: '愧疚', display: '😔' },{ value: '比较', display: '⚖️' },{ value: '幻想', display: '💭' }] },
  { id: 'd30', title: '你此刻最需要的勇气是？', subtitle: '勇气有多种形态', type: 'shadow', options: [{ value: '开始的勇气', display: '🚀' },{ value: '放手的勇气', display: '🕊️' },{ value: '示弱的勇气', display: '💔' },{ value: '做自己的勇气', display: '🪞' }] },

  // ═══════════════════════════════════════════
  // 灵性 Spirit (30)
  // ═══════════════════════════════════════════
  { id: 'p01', title: '如果此刻变成一种动物？', subtitle: '直觉选择', type: 'spirit', options: [{ value: '猫', display: '🐱' },{ value: '鸟', display: '🐦' },{ value: '鱼', display: '🐟' },{ value: '鹿', display: '🦌' }] },
  { id: 'p02', title: '如果心情是一首音乐，它的节奏是？', subtitle: '感受你内心的律动', type: 'spirit', options: [{ value: '低沉', display: '🎵' },{ value: '轻快', display: '🎶' },{ value: '激烈', display: '🥁' },{ value: '安静', display: '🤫' }] },
  { id: 'p03', title: '此刻你最想遇见谁？', subtitle: '那个人可能不存在', type: 'spirit', options: [{ value: '未来的自己', display: '🔮' },{ value: '过去的自己', display: '🪞' },{ value: '一个陌生人', display: '👤' },{ value: '只想独处', display: '🚶' }] },
  { id: 'p04', title: '你的灵魂此刻在做什么？', subtitle: '灵魂有自己的节奏', type: 'spirit', options: [{ value: '沉睡', display: '😴' },{ value: '舞蹈', display: '💃' },{ value: '等待', display: '⏳' },{ value: '飞翔', display: '🪽' }] },
  { id: 'p05', title: '如果此刻你是一种花？', subtitle: '花有自己的语言', type: 'spirit', options: [{ value: '玫瑰', display: '🌹' },{ value: '莲花', display: '🪷' },{ value: '向日葵', display: '🌻' },{ value: '蒲公英', display: '🌾' }] },
  { id: 'p06', title: '你的梦最近在说什么？', subtitle: '梦是灵魂的信', type: 'spirit', options: [{ value: '飞翔', display: '🪽' },{ value: '坠落', display: '⬇️' },{ value: '迷路', display: '🌀' },{ value: '无梦', display: '🌑' }] },
  { id: 'p07', title: '如果此刻你是一颗星？', subtitle: '星星各有位置', type: 'spirit', options: [{ value: '北极星', display: '⭐' },{ value: '流星', display: '☄️' },{ value: '暗星', display: '🌑' },{ value: '星云', display: '🌌' }] },
  { id: 'p08', title: '你此刻最想写下一个什么字？', subtitle: '一个字概括一切', type: 'spirit', options: [{ value: '静', display: '🧘' },{ value: '动', display: '🏃' },{ value: '空', display: '🫧' },{ value: '爱', display: '💕' }] },
  { id: 'p09', title: '如果此刻你是一种香气？', subtitle: '香气是灵魂的语言', type: 'spirit', options: [{ value: '檀香', display: '🪵' },{ value: '花香', display: '🌸' },{ value: '雨后', display: '🌧️' },{ value: '旧纸', display: '📜' }] },
  { id: 'p10', title: '你的直觉此刻在指引你？', subtitle: '直觉知道答案', type: 'spirit', options: [{ value: '向前', display: '⬆️' },{ value: '等待', display: '⏸️' },{ value: '回头', display: '↩️' },{ value: '沉默', display: '🤫' }] },
  { id: 'p11', title: '如果此刻你是一幅画？', subtitle: '画是灵魂的投影', type: 'spirit', options: [{ value: '水墨', display: '🖌️' },{ value: '油画', display: '🎨' },{ value: '素描', display: '✏️' },{ value: '空白', display: '⬜' }] },
  { id: 'p12', title: '你此刻最想和什么对话？', subtitle: '对话带来理解', type: 'spirit', options: [{ value: '大海', display: '🌊' },{ value: '月亮', display: '🌙' },{ value: '自己', display: '🪞' },{ value: '风', display: '🌬️' }] },
  { id: 'p13', title: '如果此刻你是一种舞蹈？', subtitle: '身体是灵魂的表达', type: 'spirit', options: [{ value: '旋转', display: '💃' },{ value: '静止', display: '🧍' },{ value: '摇摆', display: '🕺' },{ value: '独舞', display: '🩰' }] },
  { id: 'p14', title: '你此刻最需要的祝福是？', subtitle: '祝福是力量', type: 'spirit', options: [{ value: '勇气', display: '🦁' },{ value: '平静', display: '🧘' },{ value: '自由', display: '🕊️' },{ value: '被爱', display: '💕' }] },
  { id: 'p15', title: '如果此刻你是一种宝石？', subtitle: '宝石历经锻造', type: 'spirit', options: [{ value: '钻石', display: '💎' },{ value: '翡翠', display: '🟢' },{ value: '琥珀', display: '🟠' },{ value: '原石', display: '🪨' }] },
  { id: 'p16', title: '你的灵魂此刻想去哪里旅行？', subtitle: '灵魂的旅途', type: 'spirit', options: [{ value: '星空', display: '🌌' },{ value: '深海', display: '🐋' },{ value: '山林', display: '🌲' },{ value: '回家', display: '🏡' }] },
  { id: 'p17', title: '如果此刻你是一个神话人物？', subtitle: '神话映照内心', type: 'spirit', options: [{ value: '英雄', display: '⚔️' },{ value: '智者', display: '🧙' },{ value: '游者', display: '🚶' },{ value: '隐者', display: '🏔️' }] },
  { id: 'p18', title: '你最想此刻拥有的超能力？', subtitle: '超能力揭示渴望', type: 'spirit', options: [{ value: '飞行', display: '🦅' },{ value: '隐身', display: '👻' },{ value: '读心', display: '🔮' },{ value: '治愈', display: '💚' }] },
  { id: 'p19', title: '如果此刻你是一种诗歌？', subtitle: '诗是灵魂的母语', type: 'spirit', options: [{ value: '俳句', display: '🎋' },{ value: '十四行诗', display: '📜' },{ value: '自由诗', display: '🍃' },{ value: '沉默', display: '🤫' }] },
  { id: 'p20', title: '你最想此刻看到什么奇迹？', subtitle: '奇迹不嫌多', type: 'spirit', options: [{ value: '花开', display: '🌸' },{ value: '星辰', display: '✨' },{ value: '重逢', display: '🤝' },{ value: '宁静', display: '🧘' }] },
  { id: 'p21', title: '如果此刻你是一种仪式？', subtitle: '仪式连接天地', type: 'spirit', options: [{ value: '冥想', display: '🧘' },{ value: '祈祷', display: '🙏' },{ value: '书写', display: '✍️' },{ value: '呼吸', display: '🌬️' }] },
  { id: 'p22', title: '你此刻最像哪种季节的鸟？', subtitle: '鸟随季节迁徙', type: 'spirit', options: [{ value: '候鸟', display: '🦅' },{ value: '留鸟', display: '🐦' },{ value: '迷鸟', display: '🌀' },{ value: '雏鸟', display: '🐣' }] },
  { id: 'p23', title: '如果此刻你是一种墨色？', subtitle: '墨分五色', type: 'spirit', options: [{ value: '浓墨', display: '⬛' },{ value: '淡墨', display: '🩶' },{ value: '干墨', display: '🏜️' },{ value: '湿墨', display: '💧' }] },
  { id: 'p24', title: '你最想此刻听到的诗句类型？', subtitle: '诗治愈人心', type: 'spirit', options: [{ value: '温柔', display: '🌸' },{ value: '壮阔', display: '🏔️' },{ value: '孤寂', display: '🌙' },{ value: '豁达', display: '🍃' }] },
  { id: 'p25', title: '如果此刻你是一道光的方向？', subtitle: '光永远有方向', type: 'spirit', options: [{ value: '向上', display: '⬆️' },{ value: '向内', display: '🫀' },{ value: '向外', display: '🌞' },{ value: '四散', display: '✨' }] },
  { id: 'p26', title: '你的灵魂此刻最想和什么融合？', subtitle: '融合是回归', type: 'spirit', options: [{ value: '大海', display: '🌊' },{ value: '星空', display: '🌌' },{ value: '风', display: '🌬️' },{ value: '大地', display: '🏔️' }] },
  { id: 'p27', title: '如果此刻你是一种时间？', subtitle: '时间有不同质感', type: 'spirit', options: [{ value: '永恒', display: '♾️' },{ value: '此刻', display: '⏰' },{ value: '循环', display: '🔄' },{ value: '停滞', display: '⏸️' }] },
  { id: 'p28', title: '你最想此刻种下什么种子？', subtitle: '种子是未来的承诺', type: 'spirit', options: [{ value: '希望', display: '🌱' },{ value: '勇气', display: '🔥' },{ value: '爱', display: '💕' },{ value: '平静', display: '🍃' }] },
  { id: 'p29', title: '如果此刻你是一个寓言故事？', subtitle: '寓言映射真相', type: 'spirit', options: [{ value: '破茧成蝶', display: '🦋' },{ value: '愚公移山', display: '⛰️' },{ value: '守株待兔', display: '🌳' },{ value: '大鹏展翅', display: '🦅' }] },
  { id: 'p30', title: '你此刻最想和宇宙交换什么？', subtitle: '宇宙总是回应', type: 'spirit', options: [{ value: '困惑换智慧', display: '🔮' },{ value: '痛苦换成长', display: '🌱' },{ value: '恐惧换勇气', display: '🦁' },{ value: '什么都不换', display: '🤍' }] },
];

export default QUESTION_POOL;

// ============ Category definitions for non-repeat tracking ============
export const QUESTION_CATEGORIES: QuestionType[] = ['color', 'nature', 'symbol', 'sensation', 'shadow', 'spirit'];
export const CATEGORY_LABELS: Record<QuestionType, string> = {
  color: '色彩',
  nature: '自然',
  symbol: '象征',
  sensation: '感知',
  shadow: '阴影',
  spirit: '灵性',
};

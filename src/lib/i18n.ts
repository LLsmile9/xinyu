// ============ i18n System ============

export type Lang = 'zh' | 'en';

type TranslationMap = Record<string, Record<Lang, string>>;

const translations: TranslationMap = {
  // Greeting view
  'greeting.lateNight': { zh: '夜深了', en: 'Late night' },
  'greeting.morning': { zh: '早安', en: 'Good morning' },
  'greeting.forenoon': { zh: '上午好', en: 'Good morning' },
  'greeting.noon': { zh: '中午好', en: 'Good afternoon' },
  'greeting.afternoon': { zh: '下午好', en: 'Good afternoon' },
  'greeting.evening': { zh: '晚上好', en: 'Good evening' },
  'greeting.subtitle': { zh: '花一分钟，温柔地问候自己的内心', en: 'Take a minute to gently greet your inner self' },
  'greeting.startToday': { zh: '开始今天', en: 'Start Today' },
  'greeting.chatAgain': { zh: '再聊一次', en: 'Chat Again' },
  'greeting.viewLast': { zh: '查看上一次心语', en: 'View Last Heart Word' },

  // Weekdays
  'weekday.sun': { zh: '周日', en: 'Sunday' },
  'weekday.mon': { zh: '周一', en: 'Monday' },
  'weekday.tue': { zh: '周二', en: 'Tuesday' },
  'weekday.wed': { zh: '周三', en: 'Wednesday' },
  'weekday.thu': { zh: '周四', en: 'Thursday' },
  'weekday.fri': { zh: '周五', en: 'Friday' },
  'weekday.sat': { zh: '周六', en: 'Saturday' },

  // Questions view
  'questions.previous': { zh: '上一步', en: 'Previous' },
  'questions.back': { zh: '返回', en: 'Back' },

  // Generating view
  'generating.listening': { zh: '正在倾听你的心声...', en: 'Listening to your heart...' },

  // Result view
  'result.wordsForYou': { zh: '给你的话', en: 'Words for You' },
  'result.chatAgain': { zh: '再聊一次', en: 'Chat Again' },
  'result.saveShare': { zh: '保存分享图', en: 'Save & Share' },
  'result.generating': { zh: '生成中...', en: 'Generating...' },
  'result.buyTea': { zh: '打赏碎银子', en: 'Buy me a tea' },
  'result.back': { zh: '返回', en: 'Back' },
  'result.imageSaved': { zh: '图片已保存', en: 'Image saved' },
  'result.longPressSave': { zh: '请长按图片保存', en: 'Long press to save image' },
  'result.saveToAlbum': { zh: '保存到相册', en: 'Save to Album' },
  'result.close': { zh: '关闭', en: 'Close' },
  'result.longPressTip': { zh: '长按图片也可保存到相册', en: 'Long press image to save' },
  'result.shareCard': { zh: '分享卡片', en: 'Share card' },

  // History view
  'history.title': { zh: '心语记录', en: 'Heart Word Records' },
  'history.noRecords': { zh: '还没有记录', en: 'No records yet' },
  'history.everyMoment': { zh: '每一刻都值得被温柔地记住', en: 'Every moment deserves to be gently remembered' },
  'history.visits': { zh: '访问', en: 'Visits' },
  'history.words': { zh: '心语', en: 'Words' },
  'history.today': { zh: '今日', en: 'Today' },
  'history.back': { zh: '返回', en: 'Back' },

  // Tip modal
  'tip.title': { zh: '打赏碎银子', en: 'Buy me a tea' },
  'tip.subtitle': { zh: '如果心语温暖了你，可以赏点碎银子', en: 'If heart words warmed you, buy me a tea' },
  'tip.wechat': { zh: '微信扫码 · 任意金额 · 感谢你的心意', en: 'WeChat Pay · Any amount · Thank you' },

  // Header
  'header.brand': { zh: '心语', en: 'Xinyu' },

  // Footer
  'footer.tagline': { zh: '温柔地对待每一刻', en: 'Treat every moment gently' },

  // Error messages
  'error.generateFailed': { zh: '生成失败，请稍后再试', en: 'Generation failed, please try again' },
  'error.imageFailed': { zh: '生成图片失败，请稍后再试', en: 'Image generation failed' },

  // Share image text
  'share.brandTitle': { zh: '晨  间  心  语', en: 'Morning  Heart  Words' },
  'share.wordsForYou': { zh: '♡  给你的话  ♡', en: '♡  Words for You  ♡' },
  'share.tagline': { zh: '温柔地对待每一刻', en: 'Treat every moment gently' },

  // Misc
  'misc.unselected': { zh: '未选择', en: 'Not selected' },

  // Aria labels
  'aria.toggleHeartCursor': { zh: '切换爱心鼠标', en: 'Toggle heart cursor' },
  'aria.viewHistory': { zh: '查看历史记录', en: 'View history' },
  'aria.toggleDarkMode': { zh: '切换深色模式', en: 'Toggle dark mode' },
  'aria.toggleLanguage': { zh: '切换语言', en: 'Toggle language' },
};

export function t(lang: Lang, key: string): string {
  const entry = translations[key];
  if (!entry) return key;
  return entry[lang] || entry.zh || key;
}

// Helper for weekday by index (0=Sunday)
const weekdayKeys = ['weekday.sun', 'weekday.mon', 'weekday.tue', 'weekday.wed', 'weekday.thu', 'weekday.fri', 'weekday.sat'];

export function getWeekday(lang: Lang, date?: Date): string {
  const d = date || new Date();
  return t(lang, weekdayKeys[d.getDay()]);
}

// Helper for greeting based on hour
export function getGreetingText(lang: Lang): string {
  const hour = new Date().getHours();
  if (hour < 6) return t(lang, 'greeting.lateNight');
  if (hour < 9) return t(lang, 'greeting.morning');
  if (hour < 12) return t(lang, 'greeting.forenoon');
  if (hour < 14) return t(lang, 'greeting.noon');
  if (hour < 18) return t(lang, 'greeting.afternoon');
  return t(lang, 'greeting.evening');
}

// Format date based on language
export function formatDate(lang: Lang, dateStr: string): string {
  const d = new Date(dateStr + 'T00:00:00');
  if (lang === 'en') {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return `${months[d.getMonth()]} ${d.getDate()} ${weekdays[d.getDay()]}`;
  }
  const weekdays = ['日', '一', '二', '三', '四', '五', '六'];
  return `${d.getMonth() + 1}月${d.getDate()}日 周${weekdays[d.getDay()]}`;
}

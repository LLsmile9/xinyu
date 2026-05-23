'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import {
  Sun,
  Moon,
  History,
  ChevronRight,
  ArrowLeft,
  Sparkles,
  Leaf,
  Heart,
  Coffee,
  BookOpen,
} from 'lucide-react';
import { toast } from 'sonner';

// ============ Types ============
type AppView = 'greeting' | 'questions' | 'generating' | 'result' | 'history';
type QuestionType = 'color' | 'element' | 'tarot' | 'season' | 'landscape' | 'metaphor' | 'shadow' | 'body' | 'animal' | 'texture';

interface QuestionOption {
  value: string;
  display: string; // emoji
}

interface Question {
  id: string;
  title: string;
  subtitle: string;
  type: QuestionType;
  options: QuestionOption[];
}

interface AnswerPair {
  question: string;
  answer: string;
}

interface CheckInRecord {
  id: string;
  date: string;
  time: string;
  answersJson: string;
  summary: string;
  encouragement: string;
  book: string;
  createdAt: string;
}

// ============ Question Pool ============
const QUESTION_POOL: Question[] = [
  // Color psychology
  {
    id: 'color-mood',
    title: '此刻你的内心是什么颜色？',
    subtitle: '闭上眼，感受那个颜色',
    type: 'color',
    options: [
      { value: '深蓝', display: '🔵' },
      { value: '暖橙', display: '🟠' },
      { value: '嫩绿', display: '🟢' },
      { value: '浅紫', display: '🟣' },
      { value: '灰白', display: '⚪' },
      { value: '深红', display: '🔴' },
    ],
  },
  {
    id: 'color-need',
    title: '你现在最需要的颜色是？',
    subtitle: '直觉选择，不要思考',
    type: 'color',
    options: [
      { value: '金色', display: '🟡' },
      { value: '湖蓝', display: '💎' },
      { value: '翠绿', display: '🌿' },
      { value: '粉红', display: '💗' },
      { value: '银灰', display: '🪞' },
      { value: '赤红', display: '🔥' },
    ],
  },
  // Tarot / Symbol
  {
    id: 'tarot-card',
    title: '如果抽一张灵魂牌，它会是？',
    subtitle: '凭直觉选择',
    type: 'tarot',
    options: [
      { value: '月亮', display: '🌙' },
      { value: '星星', display: '⭐' },
      { value: '塔', display: '🗼' },
      { value: '太阳', display: '☀️' },
      { value: '隐者', display: '🧙' },
      { value: '愚者', display: '🃏' },
    ],
  },
  {
    id: 'tarot-journey',
    title: '你觉得自己正站在哪扇门前？',
    subtitle: '想象那扇门的模样',
    type: 'tarot',
    options: [
      { value: '半开的门', display: '🚪' },
      { value: '紧闭的门', display: '🔒' },
      { value: '敞开的门', display: '🏛️' },
      { value: '隐形的门', display: '✨' },
      { value: '旋转的门', display: '🌀' },
      { value: '画中的门', display: '🖼️' },
    ],
  },
  // Nature element
  {
    id: 'element-soul',
    title: '你的灵魂此刻更接近哪种元素？',
    subtitle: '感受你内在的流动',
    type: 'element',
    options: [
      { value: '水', display: '💧' },
      { value: '火', display: '🔥' },
      { value: '风', display: '🌬️' },
      { value: '土', display: '🪨' },
    ],
  },
  {
    id: 'element-need',
    title: '此刻你最缺少哪种力量？',
    subtitle: '诚实面对匮乏',
    type: 'element',
    options: [
      { value: '水的温柔', display: '🌊' },
      { value: '火的勇气', display: '🔥' },
      { value: '风的轻盈', display: '🍃' },
      { value: '土的安定', display: '🏔️' },
    ],
  },
  // Season / Time
  {
    id: 'season-soul',
    title: '你的内心正处在什么季节？',
    subtitle: '不是外面的季节',
    type: 'season',
    options: [
      { value: '初春', display: '🌱' },
      { value: '盛夏', display: '🌻' },
      { value: '深秋', display: '🍂' },
      { value: '寒冬', display: '❄️' },
    ],
  },
  {
    id: 'time-day',
    title: '如果此刻是一天中的某个时辰？',
    subtitle: '不是现在几点',
    type: 'season',
    options: [
      { value: '黎明', display: '🌅' },
      { value: '正午', display: '🌤️' },
      { value: '黄昏', display: '🌇' },
      { value: '深夜', display: '🌑' },
    ],
  },
  // Landscape
  {
    id: 'landscape-place',
    title: '你最想待在什么样的地方？',
    subtitle: '想象那个画面',
    type: 'landscape',
    options: [
      { value: '海边', display: '🏖️' },
      { value: '森林', display: '🌲' },
      { value: '山顶', display: '⛰️' },
      { value: '小屋', display: '🏡' },
      { value: '雨中', display: '🌧️' },
      { value: '星空下', display: '🌌' },
    ],
  },
  // Shadow (converted from text to selection)
  {
    id: 'shadow-self',
    title: '此刻你最想逃避的是？',
    subtitle: '选择最接近的感受',
    type: 'shadow',
    options: [
      { value: '喧嚣', display: '📢' },
      { value: '期待', display: '🎯' },
      { value: '责任', display: '⚖️' },
      { value: '独处', display: '🚶' },
      { value: '选择', display: '🔀' },
      { value: '沉默', display: '🤐' },
    ],
  },
  {
    id: 'shadow-fear',
    title: '此刻最让你不安的是？',
    subtitle: '选一个最贴近的',
    type: 'shadow',
    options: [
      { value: '未知', display: '❓' },
      { value: '失去', display: '💔' },
      { value: '停滞', display: '🫥' },
      { value: '评判', display: '👁️' },
      { value: '孤独', display: '🌫️' },
      { value: '改变', display: '🌀' },
    ],
  },
  // Metaphor
  {
    id: 'metaphor-weather',
    title: '你的心情像什么天气？',
    subtitle: '用天气描绘内心',
    type: 'metaphor',
    options: [
      { value: '晴天', display: '☀️' },
      { value: '多云', display: '⛅' },
      { value: '小雨', display: '🌦️' },
      { value: '雷暴', display: '⛈️' },
      { value: '薄雾', display: '🌫️' },
      { value: '彩虹', display: '🌈' },
    ],
  },
  {
    id: 'metaphor-music',
    title: '如果心情是一首音乐，它的节奏是？',
    subtitle: '感受你内心的律动',
    type: 'metaphor',
    options: [
      { value: '缓慢低沉', display: '🎵' },
      { value: '轻快跳跃', display: '🎶' },
      { value: '激烈急促', display: '🥁' },
      { value: '安静留白', display: '🤫' },
      { value: '悠远回响', display: '🎻' },
    ],
  },
  // Body sensation
  {
    id: 'body-sense',
    title: '你的身体此刻最想做什么？',
    subtitle: '倾听身体的信号',
    type: 'body',
    options: [
      { value: '蜷缩', display: '🧘' },
      { value: '奔跑', display: '🏃' },
      { value: '漂浮', display: '🫧' },
      { value: '拥抱', display: '🤗' },
      { value: '深呼吸', display: '💨' },
      { value: '沉睡', display: '😴' },
    ],
  },
  // Animal spirit
  {
    id: 'animal-spirit',
    title: '如果此刻变成一种动物？',
    subtitle: '直觉选择',
    type: 'animal',
    options: [
      { value: '猫', display: '🐱' },
      { value: '鸟', display: '🐦' },
      { value: '鱼', display: '🐟' },
      { value: '鹿', display: '🦌' },
      { value: '熊', display: '🐻' },
      { value: '蝴蝶', display: '🦋' },
    ],
  },
  // Texture
  {
    id: 'texture-feel',
    title: '此刻你最想触摸的质感？',
    subtitle: '用触觉感知情绪',
    type: 'texture',
    options: [
      { value: '柔软毛毯', display: '🧶' },
      { value: '冰凉石面', display: '🪨' },
      { value: '温热水流', display: '💧' },
      { value: '粗糙树皮', display: '🌳' },
      { value: '光滑丝绸', display: '🎀' },
      { value: '干燥沙粒', display: '🏜️' },
    ],
  },
];

// Shuffle and pick N questions ensuring diversity
function pickRandomQuestions(count: number): Question[] {
  const shuffled = [...QUESTION_POOL].sort(() => Math.random() - 0.5);
  const picked: Question[] = [];
  const usedTypes = new Set<string>();

  // First pass: ensure type diversity
  for (const q of shuffled) {
    if (picked.length >= count) break;
    const typeKey = q.type;
    if (!usedTypes.has(typeKey)) {
      picked.push(q);
      usedTypes.add(typeKey);
    }
  }

  // Second pass: fill remaining with any
  for (const q of shuffled) {
    if (picked.length >= count) break;
    if (!picked.includes(q)) {
      picked.push(q);
    }
  }

  return picked.slice(0, count);
}

// ============ Helper ============
function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 6) return '夜深了';
  if (hour < 9) return '早安';
  if (hour < 12) return '上午好';
  if (hour < 14) return '中午好';
  if (hour < 18) return '下午好';
  return '晚上好';
}

function getTodayDate(): string {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function getCurrentTime(): string {
  const now = new Date();
  return `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
}

function formatDateChinese(dateStr: string): string {
  const d = new Date(dateStr + 'T00:00:00');
  const weekdays = ['日', '一', '二', '三', '四', '五', '六'];
  return `${d.getMonth() + 1}月${d.getDate()}日 周${weekdays[d.getDay()]}`;
}

// ============ Heart Cursor Component ============
function HeartCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const [hearts, setHearts] = useState<Array<{ id: number; x: number; y: number }>>([]);
  const heartsIdRef = useRef(0);

  useEffect(() => {
    let mouseX = 0;
    let mouseY = 0;
    let curX = 0;
    let curY = 0;

    document.body.classList.add('heart-cursor-active');

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    const handleClick = (e: MouseEvent) => {
      const id = heartsIdRef.current++;
      setHearts((prev) => [...prev, { id, x: e.clientX, y: e.clientY }]);
      setTimeout(() => {
        setHearts((prev) => prev.filter((h) => h.id !== id));
      }, 900);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('click', handleClick);

    let animId: number;
    const animate = () => {
      curX += (mouseX - curX) * 0.18;
      curY += (mouseY - curY) * 0.18;

      if (cursorRef.current) {
        cursorRef.current.style.left = `${curX}px`;
        cursorRef.current.style.top = `${curY}px`;
      }

      animId = requestAnimationFrame(animate);
    };
    animId = requestAnimationFrame(animate);

    return () => {
      document.body.classList.remove('heart-cursor-active');
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('click', handleClick);
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <>
      <div
        ref={cursorRef}
        className="fixed pointer-events-none z-[9999] -translate-x-1/2 -translate-y-1/2"
      >
        <Heart className="w-5 h-5 text-sage/60 fill-sage/30 transition-transform duration-200 hover:scale-110" />
      </div>
      {hearts.map((h) => (
        <div
          key={h.id}
          className="fixed pointer-events-none z-[9997] -translate-x-1/2 -translate-y-1/2 heart-float"
          style={{ left: h.x, top: h.y }}
        >
          <Heart className="w-4 h-4 text-sage/50 fill-sage/25" />
        </div>
      ))}
    </>
  );
}

// ============ Tip / Reward Modal ============
function TipButton() {
  const [showTip, setShowTip] = useState(false);

  return (
    <>
      <button
        onClick={() => setShowTip(true)}
        className="inline-flex items-center gap-1 text-muted-foreground/40 hover:text-sage/70 transition-colors duration-300 font-light text-xs tracking-wider mt-2"
        aria-label="请我喝杯咖啡"
      >
        <Coffee className="w-3 h-3" />
        <span>请我喝杯咖啡</span>
      </button>

      <AnimatePresence>
        {showTip && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[10000] flex items-center justify-center bg-foreground/20 backdrop-blur-sm"
            onClick={() => setShowTip(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className="bg-card border border-border rounded-3xl p-8 max-w-xs w-full mx-4 shadow-xl space-y-6 text-center"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="space-y-2">
                <div className="flex items-center justify-center gap-2">
                  <Coffee className="w-5 h-5 text-sage/70" />
                  <h3 className="text-lg font-light text-foreground tracking-wider">感谢你的心意</h3>
                </div>
                <p className="text-sm font-light text-muted-foreground leading-relaxed">
                  你的每一份支持，都是继续创作的温暖动力
                </p>
              </div>

              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-sage/5 border border-sage/10 space-y-3">
                  <p className="text-xs font-light text-muted-foreground tracking-wider">微信支付</p>
                  <div className="w-32 h-32 mx-auto bg-white rounded-xl flex items-center justify-center border border-border/50">
                    <div className="text-center space-y-1">
                      <div className="text-3xl">💚</div>
                      <p className="text-[10px] text-gray-500 font-light">微信扫码支持</p>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-sage/5 border border-sage/10 space-y-2">
                  <p className="text-xs font-light text-muted-foreground tracking-wider">支付宝</p>
                  <div className="w-32 h-32 mx-auto bg-white rounded-xl flex items-center justify-center border border-border/50">
                    <div className="text-center space-y-1">
                      <div className="text-3xl">💙</div>
                      <p className="text-[10px] text-gray-500 font-light">支付宝扫码支持</p>
                    </div>
                  </div>
                </div>
              </div>

              <Button
                variant="ghost"
                onClick={() => setShowTip(false)}
                className="text-muted-foreground hover:text-foreground font-light text-sm"
              >
                关闭
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

// ============ Main Component ============
export default function Home() {
  const [view, setView] = useState<AppView>('greeting');
  const [step, setStep] = useState(0);
  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });
  const [currentQuestions, setCurrentQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [result, setResult] = useState<{ summary: string; encouragement: string; book: string } | null>(null);
  const [history, setHistory] = useState<CheckInRecord[]>([]);
  const [todayCheckIns, setTodayCheckIns] = useState<CheckInRecord[]>([]);
  const [showCursor, setShowCursor] = useState(true);

  // Apply dark mode on mount
  useEffect(() => {
    if (isDark) document.documentElement.classList.add('dark');
  }, []);

  // Load history on mount
  useEffect(() => {
    fetch('/api/checkin')
      .then((r) => r.json())
      .then((data: CheckInRecord[]) => {
        setHistory(data);
        const today = getTodayDate();
        const todayRecords = data.filter((r) => r.date === today);
        setTodayCheckIns(todayRecords);
        if (todayRecords.length > 0) {
          const latest = todayRecords[todayRecords.length - 1];
          setResult({ summary: latest.summary, encouragement: latest.encouragement, book: latest.book || '' });
        }
      })
      .catch(() => {});
  }, []);

  const toggleDark = useCallback(() => {
    setIsDark((prev) => {
      const next = !prev;
      document.documentElement.classList.toggle('dark', next);
      return next;
    });
  }, []);

  const handleStart = useCallback(() => {
    const questions = pickRandomQuestions(5);
    setCurrentQuestions(questions);
    setAnswers({});
    setStep(0);
    setView('questions');
  }, []);

  const handleNext = useCallback(() => {
    if (step < currentQuestions.length - 1) {
      setStep((s) => s + 1);
    } else {
      const answerPairs: AnswerPair[] = currentQuestions.map((q) => ({
        question: q.title,
        answer: answers[q.id] || '未选择',
      }));

      setView('generating');
      fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          answers: answerPairs,
          previousCheckIns: todayCheckIns.map((c) => ({
            time: c.time,
            summary: c.summary,
          })),
        }),
      })
        .then((r) => r.json())
        .then(async (data) => {
          if (data.error) {
            toast.error(data.error);
            setView('questions');
            return;
          }
          setResult({ summary: data.summary, encouragement: data.encouragement, book: data.book || '' });

          const today = getTodayDate();
          const time = getCurrentTime();
          try {
            await fetch('/api/checkin', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                date: today,
                time,
                answersJson: JSON.stringify(answerPairs),
                summary: data.summary,
                encouragement: data.encouragement,
                book: data.book || '',
              }),
            });
            const [todayRes, histRes] = await Promise.all([
              fetch(`/api/checkin?date=${today}`),
              fetch('/api/checkin'),
            ]);
            const todayData = await todayRes.json();
            const histData = await histRes.json();
            setTodayCheckIns(todayData);
            setHistory(histData);
          } catch {
            // Silently fail
          }

          setView('result');
        })
        .catch(() => {
          toast.error('生成失败，请稍后再试');
          setView('questions');
        });
    }
  }, [step, currentQuestions, answers, todayCheckIns]);

  const canProceed = useCallback(() => {
    const q = currentQuestions[step];
    if (!q) return false;
    return !!answers[q.id];
  }, [step, currentQuestions, answers]);

  const handleHistory = useCallback(() => {
    fetch('/api/checkin')
      .then((r) => r.json())
      .then((data) => setHistory(data))
      .catch(() => {});
    setView('history');
  }, []);

  // ============ Render ============
  return (
    <div className="min-h-screen flex flex-col bg-background transition-colors duration-700 relative overflow-hidden">
      {showCursor && <HeartCursor />}

      {/* Decorative background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        <div className="absolute -top-32 -right-32 w-80 h-80 rounded-full bg-sage/[0.04] blur-3xl" />
        <div className="absolute top-1/3 -left-40 w-96 h-96 rounded-full bg-warm/[0.04] blur-3xl" />
        <div className="absolute -bottom-20 right-1/4 w-72 h-72 rounded-full bg-sage/[0.03] blur-3xl" />
      </div>

      {/* Header */}
      <header className="relative z-10 flex items-center justify-between px-6 py-4 sm:px-8">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Leaf className="w-4 h-4 text-sage" />
          <span className="text-sm tracking-widest font-light">心语</span>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowCursor((p) => !p)}
            className="rounded-full w-9 h-9 text-muted-foreground hover:text-foreground"
            aria-label="切换爱心鼠标"
          >
            <Heart className={`w-4 h-4 ${showCursor ? 'fill-sage/40 text-sage' : ''}`} />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleHistory}
            className="rounded-full w-9 h-9 text-muted-foreground hover:text-foreground"
            aria-label="查看历史记录"
          >
            <History className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleDark}
            className="rounded-full w-9 h-9 text-muted-foreground hover:text-foreground"
            aria-label="切换深色模式"
          >
            {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 flex-1 flex items-center justify-center px-6 pb-8">
        <div className="w-full max-w-md">
          <AnimatePresence mode="wait">
            {/* ======== Greeting View ======== */}
            {view === 'greeting' && (
              <motion.div
                key="greeting"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
                className="flex flex-col items-center text-center gap-8"
              >
                <div className="relative">
                  <div className="absolute inset-0 w-24 h-24 rounded-full bg-sage/10 animate-breathe scale-150" />
                  <div className="relative w-24 h-24 rounded-full bg-sage/10 flex items-center justify-center">
                    <Sun className="w-10 h-10 text-sage/70" />
                  </div>
                </div>

                <div className="space-y-3">
                  <h1 className="text-3xl sm:text-4xl font-light tracking-wide text-foreground">
                    {getGreeting()}
                  </h1>
                  <p className="text-muted-foreground font-light text-lg">
                    {formatDateChinese(getTodayDate())}
                  </p>
                </div>

                <p className="text-muted-foreground/80 font-light text-base max-w-xs leading-relaxed">
                  花一分钟，温柔地问候自己的内心
                </p>

                <Button
                  onClick={handleStart}
                  className="mt-4 rounded-full px-8 py-6 text-base font-light tracking-wider bg-sage hover:bg-sage/90 text-sage-foreground transition-all duration-300 hover:shadow-lg hover:shadow-sage/20"
                >
                  {todayCheckIns.length > 0 ? '再聊一次' : '开始今天'}
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Button>

                {todayCheckIns.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-xs text-muted-foreground/60 font-light">
                      今天已经记录了 {todayCheckIns.length} 次
                    </p>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        const latest = todayCheckIns[todayCheckIns.length - 1];
                        setResult({ summary: latest.summary, encouragement: latest.encouragement, book: latest.book || '' });
                        setView('result');
                      }}
                      className="text-xs text-sage/60 hover:text-sage font-light"
                    >
                      查看上一次心语
                    </Button>
                  </div>
                )}
              </motion.div>
            )}

            {/* ======== Questions View ======== */}
            {view === 'questions' && (
              <motion.div
                key="questions"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
                className="space-y-8"
              >
                {/* Progress dots */}
                <div className="flex justify-center gap-2" role="progressbar" aria-valuenow={step + 1} aria-valuemin={1} aria-valuemax={5}>
                  {currentQuestions.map((_, i) => (
                    <div
                      key={i}
                      className={`h-2 rounded-full transition-all duration-500 ${
                        i === step
                          ? 'bg-sage w-6'
                          : i < step
                          ? 'bg-sage/50 w-2'
                          : 'bg-muted-foreground/20 w-2'
                      }`}
                    />
                  ))}
                </div>

                <AnimatePresence mode="wait">
                  {currentQuestions[step] && (
                    <motion.div
                      key={step}
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -16 }}
                      transition={{ duration: 0.4, ease: 'easeOut' }}
                      className="space-y-8"
                    >
                      <div className="text-center space-y-2">
                        <h2 className="text-2xl sm:text-3xl font-light text-foreground">
                          {currentQuestions[step].title}
                        </h2>
                        <p className="text-sm text-muted-foreground font-light">
                          {currentQuestions[step].subtitle}
                        </p>
                      </div>

                      {/* Option buttons */}
                      <div className="min-h-[180px] flex items-center justify-center">
                        <div className="flex flex-wrap justify-center gap-3">
                          {currentQuestions[step].options.map((opt) => (
                            <button
                              key={opt.value}
                              onClick={() =>
                                setAnswers((a) => ({ ...a, [currentQuestions[step].id]: opt.value }))
                              }
                              className={`flex flex-col items-center gap-1.5 px-5 py-4 rounded-2xl border transition-all duration-300 cursor-pointer ${
                                answers[currentQuestions[step].id] === opt.value
                                  ? 'border-sage bg-sage/10 shadow-sm scale-105'
                                  : 'border-border hover:border-sage/40 hover:bg-sage/5'
                              }`}
                            >
                              <span className="text-2xl">{opt.display}</span>
                              <span className="text-xs font-light text-muted-foreground whitespace-nowrap">
                                {opt.value}
                              </span>
                            </button>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Navigation */}
                <div className="flex justify-between items-center pt-4">
                  <Button
                    variant="ghost"
                    onClick={() => {
                      if (step > 0) setStep((s) => s - 1);
                      else setView('greeting');
                    }}
                    className="text-muted-foreground hover:text-foreground font-light"
                  >
                    <ArrowLeft className="w-4 h-4 mr-1" />
                    {step > 0 ? '上一步' : '返回'}
                  </Button>

                  <Button
                    onClick={handleNext}
                    disabled={!canProceed()}
                    className="rounded-full px-6 font-light tracking-wider bg-sage hover:bg-sage/90 text-sage-foreground disabled:opacity-30 disabled:hover:bg-sage transition-all duration-300"
                  >
                    {step === currentQuestions.length - 1 ? '生成心语' : '下一步'}
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              </motion.div>
            )}

            {/* ======== Generating View ======== */}
            {view === 'generating' && (
              <motion.div
                key="generating"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.6 }}
                className="flex flex-col items-center text-center gap-8 py-12"
              >
                <div className="relative">
                  <div className="absolute inset-0 w-20 h-20 rounded-full bg-sage/10 animate-breathe scale-150" />
                  <div className="relative w-20 h-20 rounded-full bg-sage/10 flex items-center justify-center">
                    <Sparkles className="w-8 h-8 text-sage/70" />
                  </div>
                </div>
                <div className="space-y-4">
                  <p className="text-lg font-light text-foreground">正在倾听你的心声...</p>
                  <div className="flex justify-center gap-1.5 dot-pulse">
                    <span className="w-2 h-2 rounded-full bg-sage/60" />
                    <span className="w-2 h-2 rounded-full bg-sage/60" />
                    <span className="w-2 h-2 rounded-full bg-sage/60" />
                  </div>
                </div>
              </motion.div>
            )}

            {/* ======== Result View ======== */}
            {view === 'result' && result && (
              <motion.div
                key="result"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
                className="flex flex-col items-center text-center gap-8 py-4"
              >
                {/* Date & time */}
                <div className="space-y-1">
                  <p className="text-sm font-light text-muted-foreground tracking-wider">
                    {formatDateChinese(getTodayDate())}
                  </p>
                  {todayCheckIns.length > 1 && (
                    <p className="text-xs font-light text-muted-foreground/50">
                      今日第 {todayCheckIns.length} 次心语
                    </p>
                  )}
                </div>

                {/* Summary */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.8 }}
                  className="space-y-6"
                >
                  <div className="flex items-center gap-4 justify-center">
                    <div className="w-8 h-px bg-sage/30" />
                    <Leaf className="w-3.5 h-3.5 text-sage/40" />
                    <div className="w-8 h-px bg-sage/30" />
                  </div>
                  <p className="text-2xl sm:text-3xl font-light text-foreground leading-relaxed tracking-wide max-w-xs">
                    {result.summary}
                  </p>
                  <div className="flex items-center gap-4 justify-center">
                    <div className="w-8 h-px bg-sage/30" />
                    <Leaf className="w-3.5 h-3.5 text-sage/40" />
                    <div className="w-8 h-px bg-sage/30" />
                  </div>
                </motion.div>

                {/* Encouragement + Book */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1, duration: 1 }}
                  className="space-y-4 max-w-sm"
                >
                  <div className="flex items-center justify-center gap-2 text-sage/60">
                    <Heart className="w-3.5 h-3.5" />
                    <span className="text-xs tracking-widest font-light">给你的话</span>
                    <Heart className="w-3.5 h-3.5" />
                  </div>
                  <p className="text-base font-light text-muted-foreground leading-relaxed">
                    {result.encouragement}
                  </p>

                  {/* Book recommendation */}
                  {result.book && (
                    <div className="flex items-center justify-center gap-2 pt-2">
                      <BookOpen className="w-3 h-3 text-sage/40" />
                      <p className="text-xs font-light text-sage/50 tracking-wide italic">
                        {result.book}
                      </p>
                    </div>
                  )}
                </motion.div>

                {/* Today's journey */}
                {todayCheckIns.length > 1 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.3, duration: 0.8 }}
                    className="space-y-3 max-w-sm w-full"
                  >
                    <p className="text-xs tracking-widest font-light text-sage/50">今日心迹</p>
                    <div className="space-y-2">
                      {todayCheckIns.map((c, i) => (
                        <div
                          key={c.id}
                          className="flex items-start gap-3 text-left"
                        >
                          <span className="text-xs font-light text-muted-foreground/50 mt-0.5 shrink-0 w-10">
                            {c.time}
                          </span>
                          <p className="text-sm font-light text-muted-foreground/70 leading-relaxed">
                            {c.summary}
                          </p>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* Actions + Tip */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.5, duration: 0.6 }}
                  className="flex flex-col items-center gap-3 pt-2"
                >
                  <Button
                    onClick={handleStart}
                    className="rounded-full px-6 font-light tracking-wider bg-sage/80 hover:bg-sage text-sage-foreground transition-all duration-300"
                  >
                    再聊一次
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={() => setView('greeting')}
                    className="text-muted-foreground hover:text-foreground font-light"
                  >
                    <ArrowLeft className="w-4 h-4 mr-1" />
                    返回
                  </Button>
                  <TipButton />
                </motion.div>
              </motion.div>
            )}

            {/* ======== History View ======== */}
            {view === 'history' && (
              <motion.div
                key="history"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="space-y-6"
              >
                <div className="flex items-center justify-between">
                  <Button
                    variant="ghost"
                    onClick={() => setView('greeting')}
                    className="text-muted-foreground hover:text-foreground font-light -ml-2"
                  >
                    <ArrowLeft className="w-4 h-4 mr-1" />
                    返回
                  </Button>
                  <h2 className="text-lg font-light text-foreground tracking-wider">心语记录</h2>
                  <div className="w-16" />
                </div>

                {history.length === 0 ? (
                  <div className="text-center py-16 space-y-4">
                    <Leaf className="w-8 h-8 text-sage/30 mx-auto" />
                    <p className="text-muted-foreground font-light">还没有记录</p>
                    <p className="text-sm text-muted-foreground/60 font-light">
                      每一刻都值得被温柔地记住
                    </p>
                  </div>
                ) : (
                  <ScrollArea className="max-h-[65vh]">
                    <div className="space-y-6 pr-2 custom-scrollbar">
                      {Object.entries(
                        history.reduce<Record<string, CheckInRecord[]>>((acc, r) => {
                          if (!acc[r.date]) acc[r.date] = [];
                          acc[r.date].push(r);
                          return acc;
                        }, {})
                      ).map(([date, records]) => (
                        <div key={date} className="space-y-3">
                          <p className="text-sm font-light text-muted-foreground tracking-wider px-1">
                            {formatDateChinese(date)}
                          </p>
                          {records.map((record) => (
                            <motion.div
                              key={record.id}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="p-5 rounded-2xl border border-border bg-card/50 space-y-3"
                            >
                              <div className="flex items-center justify-between">
                                <span className="text-xs font-light text-muted-foreground/50">
                                  {record.time}
                                </span>
                              </div>
                              <p className="text-base font-light text-foreground leading-relaxed">
                                {record.summary}
                              </p>
                              <Separator className="bg-border/50" />
                              <p className="text-sm font-light text-muted-foreground leading-relaxed">
                                {record.encouragement}
                              </p>
                              {record.book && (
                                <div className="flex items-center gap-1.5 pt-1">
                                  <BookOpen className="w-3 h-3 text-sage/30" />
                                  <p className="text-xs font-light text-sage/40 italic">{record.book}</p>
                                </div>
                              )}
                            </motion.div>
                          ))}
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 mt-auto py-4 text-center">
        <p className="text-xs font-light text-muted-foreground/40 tracking-wider">
          温柔地对待每一刻
        </p>
      </footer>
    </div>
  );
}

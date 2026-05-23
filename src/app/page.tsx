'use client';

import { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Textarea } from '@/components/ui/textarea';
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
} from 'lucide-react';
import { toast } from 'sonner';

// ============ Types ============
type AppView = 'greeting' | 'questions' | 'generating' | 'result' | 'history';

interface CheckInRecord {
  id: string;
  date: string;
  sleepQuality: number;
  mood: string;
  trouble: string | null;
  expectation: string | null;
  word: string | null;
  summary: string;
  encouragement: string;
  createdAt: string;
}

// ============ Questions Config ============
const SLEEP_OPTIONS = [
  { value: 1, label: '很糟糕', emoji: '😫' },
  { value: 2, label: '不太好', emoji: '😔' },
  { value: 3, label: '一般般', emoji: '😐' },
  { value: 4, label: '还不错', emoji: '🙂' },
  { value: 5, label: '非常好', emoji: '😴' },
];

const MOOD_OPTIONS = [
  { value: '低落', emoji: '🌧️' },
  { value: '平静', emoji: '🍃' },
  { value: '焦虑', emoji: '🌪️' },
  { value: '愉悦', emoji: '☀️' },
  { value: '迷茫', emoji: '🌫️' },
];

const QUESTIONS = [
  {
    id: 'sleep',
    title: '昨晚休息得怎么样？',
    subtitle: '如实回答就好',
    type: 'sleep' as const,
  },
  {
    id: 'mood',
    title: '此刻的心情更接近？',
    subtitle: '选择最贴切的那个',
    type: 'mood' as const,
  },
  {
    id: 'trouble',
    title: '最近有什么在困扰你吗？',
    subtitle: '随便说说，也可以跳过',
    type: 'text' as const,
  },
  {
    id: 'expectation',
    title: '今天有什么让你期待的事？',
    subtitle: '哪怕很小的事也好',
    type: 'text' as const,
  },
  {
    id: 'word',
    title: '用一个词形容此刻的你',
    subtitle: '一个词就够了',
    type: 'word' as const,
  },
];

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

function formatDateChinese(dateStr: string): string {
  const d = new Date(dateStr);
  const weekdays = ['日', '一', '二', '三', '四', '五', '六'];
  return `${d.getMonth() + 1}月${d.getDate()}日 周${weekdays[d.getDay()]}`;
}

// ============ Component ============
export default function Home() {
  const [view, setView] = useState<AppView>('greeting');
  const [step, setStep] = useState(0);
  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });
  const [answers, setAnswers] = useState({
    sleepQuality: 0,
    mood: '',
    trouble: '',
    expectation: '',
    word: '',
  });
  const [result, setResult] = useState<{ summary: string; encouragement: string } | null>(null);
  const [history, setHistory] = useState<CheckInRecord[]>([]);
  const [todayCheckIn, setTodayCheckIn] = useState<CheckInRecord | null>(null);

  // Apply dark mode on mount
  useEffect(() => {
    if (isDark) document.documentElement.classList.add('dark');
  }, []);

  // Check today's check-in & load history on mount
  useEffect(() => {
    const today = getTodayDate();
    fetch('/api/checkin')
      .then((r) => r.json())
      .then((data: CheckInRecord[]) => {
        setHistory(data);
        const todayRecord = data.find((r) => r.date === today);
        if (todayRecord) {
          setTodayCheckIn(todayRecord);
          setResult({ summary: todayRecord.summary, encouragement: todayRecord.encouragement });
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
    if (todayCheckIn) {
      setView('result');
    } else {
      setView('questions');
      setStep(0);
      setAnswers({ sleepQuality: 0, mood: '', trouble: '', expectation: '', word: '' });
    }
  }, [todayCheckIn]);

  const handleNext = useCallback(() => {
    if (step < QUESTIONS.length - 1) {
      setStep((s) => s + 1);
    } else {
      // Generate AI response
      setView('generating');
      fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(answers),
      })
        .then((r) => r.json())
        .then(async (data) => {
          if (data.error) {
            toast.error(data.error);
            setView('questions');
            return;
          }
          setResult({ summary: data.summary, encouragement: data.encouragement });

          // Save to database
          const today = getTodayDate();
          try {
            const saveRes = await fetch('/api/checkin', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                date: today,
                ...answers,
                summary: data.summary,
                encouragement: data.encouragement,
              }),
            });
            const saved = await saveRes.json();
            setTodayCheckIn(saved);
            // Refresh history
            const histRes = await fetch('/api/checkin');
            const histData = await histRes.json();
            setHistory(histData);
          } catch {
            // Silently fail - result is still shown
          }

          setView('result');
        })
        .catch(() => {
          toast.error('生成失败，请稍后再试');
          setView('questions');
        });
    }
  }, [step, answers]);

  const canProceed = useCallback(() => {
    const q = QUESTIONS[step];
    if (q.type === 'sleep') return answers.sleepQuality > 0;
    if (q.type === 'mood') return answers.mood !== '';
    return true;
  }, [step, answers]);

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
      {/* Decorative background elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        <div className="absolute -top-32 -right-32 w-80 h-80 rounded-full bg-sage/[0.04] blur-3xl" />
        <div className="absolute top-1/3 -left-40 w-96 h-96 rounded-full bg-warm/[0.04] blur-3xl" />
        <div className="absolute -bottom-20 right-1/4 w-72 h-72 rounded-full bg-sage/[0.03] blur-3xl" />
      </div>

      {/* Header */}
      <header className="relative z-10 flex items-center justify-between px-6 py-4 sm:px-8">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Leaf className="w-4 h-4 text-sage" />
          <span className="text-sm tracking-widest font-light">晨间心语</span>
        </div>
        <div className="flex items-center gap-2">
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
                {/* Decorative circle with breathing animation */}
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
                  {todayCheckIn ? '查看今日心语' : '开始今天'}
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Button>

                {todayCheckIn && (
                  <p className="text-xs text-muted-foreground/60 font-light">
                    今天已经记录过了
                  </p>
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
                  {QUESTIONS.map((_, i) => (
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
                        {QUESTIONS[step].title}
                      </h2>
                      <p className="text-sm text-muted-foreground font-light">
                        {QUESTIONS[step].subtitle}
                      </p>
                    </div>

                    {/* Question Content */}
                    <div className="min-h-[180px] flex items-center justify-center">
                      {QUESTIONS[step].type === 'sleep' && (
                        <div className="flex flex-wrap justify-center gap-3">
                          {SLEEP_OPTIONS.map((opt) => (
                            <button
                              key={opt.value}
                              onClick={() =>
                                setAnswers((a) => ({ ...a, sleepQuality: opt.value }))
                              }
                              className={`flex flex-col items-center gap-1.5 px-5 py-4 rounded-2xl border transition-all duration-300 cursor-pointer ${
                                answers.sleepQuality === opt.value
                                  ? 'border-sage bg-sage/10 shadow-sm scale-105'
                                  : 'border-border hover:border-sage/40 hover:bg-sage/5'
                              }`}
                            >
                              <span className="text-2xl">{opt.emoji}</span>
                              <span className="text-xs font-light text-muted-foreground">
                                {opt.label}
                              </span>
                            </button>
                          ))}
                        </div>
                      )}

                      {QUESTIONS[step].type === 'mood' && (
                        <div className="flex flex-wrap justify-center gap-3">
                          {MOOD_OPTIONS.map((opt) => (
                            <button
                              key={opt.value}
                              onClick={() => setAnswers((a) => ({ ...a, mood: opt.value }))}
                              className={`flex flex-col items-center gap-1.5 px-5 py-4 rounded-2xl border transition-all duration-300 cursor-pointer ${
                                answers.mood === opt.value
                                  ? 'border-sage bg-sage/10 shadow-sm scale-105'
                                  : 'border-border hover:border-sage/40 hover:bg-sage/5'
                              }`}
                            >
                              <span className="text-2xl">{opt.emoji}</span>
                              <span className="text-xs font-light text-muted-foreground">
                                {opt.value}
                              </span>
                            </button>
                          ))}
                        </div>
                      )}

                      {QUESTIONS[step].type === 'text' && (
                        <div className="w-full max-w-sm">
                          <Textarea
                            value={QUESTIONS[step].id === 'trouble' ? answers.trouble : answers.expectation}
                            onChange={(e) =>
                              QUESTIONS[step].id === 'trouble'
                                ? setAnswers((a) => ({ ...a, trouble: e.target.value }))
                                : setAnswers((a) => ({ ...a, expectation: e.target.value }))
                            }
                            placeholder="写点什么..."
                            className="w-full min-h-[120px] rounded-2xl border-border bg-card/50 font-light text-base resize-none focus:ring-sage/30 focus:border-sage/50 placeholder:text-muted-foreground/40"
                            maxLength={200}
                          />
                        </div>
                      )}

                      {QUESTIONS[step].type === 'word' && (
                        <div className="w-full max-w-sm">
                          <input
                            type="text"
                            value={answers.word}
                            onChange={(e) => setAnswers((a) => ({ ...a, word: e.target.value }))}
                            placeholder="一个词..."
                            maxLength={10}
                            className="w-full text-center text-2xl font-light bg-transparent border-b-2 border-border focus:border-sage/60 focus:outline-none py-4 transition-colors duration-300 placeholder:text-muted-foreground/30"
                          />
                        </div>
                      )}
                    </div>
                  </motion.div>
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
                    {step === QUESTIONS.length - 1 ? '生成心语' : '下一步'}
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
                className="flex flex-col items-center text-center gap-10 py-4"
              >
                {/* Date */}
                <div className="space-y-1">
                  <p className="text-sm font-light text-muted-foreground tracking-wider">
                    {formatDateChinese(getTodayDate())}
                  </p>
                </div>

                {/* Summary - the poetic line */}
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

                {/* Encouragement - the philosophical line */}
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
                </motion.div>

                {/* Actions */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.5, duration: 0.6 }}
                  className="flex flex-col items-center gap-3 pt-4"
                >
                  <Button
                    variant="ghost"
                    onClick={() => setView('greeting')}
                    className="text-muted-foreground hover:text-foreground font-light"
                  >
                    <ArrowLeft className="w-4 h-4 mr-1" />
                    返回
                  </Button>
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
                    onClick={() => setView(todayCheckIn ? 'result' : 'greeting')}
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
                      每一天都值得被温柔地记住
                    </p>
                  </div>
                ) : (
                  <ScrollArea className="max-h-[65vh]">
                    <div className="space-y-4 pr-2 custom-scrollbar">
                      {history.map((record, i) => (
                        <motion.div
                          key={record.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.05 }}
                          className="p-5 rounded-2xl border border-border bg-card/50 space-y-3"
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-light text-muted-foreground">
                              {formatDateChinese(record.date)}
                            </span>
                            <span className="text-lg">
                              {MOOD_OPTIONS.find((m) => m.value === record.mood)?.emoji || '🌿'}
                            </span>
                          </div>
                          <p className="text-base font-light text-foreground leading-relaxed">
                            {record.summary}
                          </p>
                          <Separator className="bg-border/50" />
                          <p className="text-sm font-light text-muted-foreground leading-relaxed">
                            {record.encouragement}
                          </p>
                        </motion.div>
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
          温柔地对待每一天
        </p>
      </footer>
    </div>
  );
}

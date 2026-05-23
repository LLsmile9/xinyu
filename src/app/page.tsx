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
  BookOpen,
  Download,
  Users,
} from 'lucide-react';
import { toast } from 'sonner';
// html2canvas removed - using Canvas API for reliable image generation

// ============ Types ============
type AppView = 'greeting' | 'questions' | 'generating' | 'result' | 'history';

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

interface Stats {
  totalVisitors: number;
  totalCheckIns: number;
  todayVisitors: number;
  todayCheckIns: number;
}

// ============ Import Questions ============
import QUESTION_POOL, { QUESTION_CATEGORIES, type QuestionType, type Question } from '@/lib/questions';

// ============ Answer pair type ============
interface AnswerPair {
  question: string;
  answer: string;
}

// ============ Per-category non-repeat tracking ============
const USED_QUESTIONS_KEY = 'xinyu_used_questions_v3';

type UsedMap = Record<string, string[]>; // category -> list of used question IDs

function getUsedMap(): UsedMap {
  try {
    const stored = localStorage.getItem(USED_QUESTIONS_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch {
    return {};
  }
}

function saveUsedMap(map: UsedMap): void {
  try {
    localStorage.setItem(USED_QUESTIONS_KEY, JSON.stringify(map));
  } catch {
    // Silently fail
  }
}

// Pick `count` questions, one from each of `count` different categories, avoiding repeats
function pickRandomQuestions(count: number): Question[] {
  const usedMap = getUsedMap();
  const picked: Question[] = [];
  const usedCategories = new Set<QuestionType>();

  // Shuffle categories for variety
  const shuffledCategories = [...QUESTION_CATEGORIES].sort(() => Math.random() - 0.5);

  for (const cat of shuffledCategories) {
    if (picked.length >= count) break;
    if (usedCategories.has(cat)) continue;

    const usedIds = new Set(usedMap[cat] || []);
    const poolQuestions = QUESTION_POOL.filter((q) => q.type === cat);
    const unused = poolQuestions.filter((q) => !usedIds.has(q.id));

    let question: Question;
    if (unused.length > 0) {
      // Pick a random unused question from this category
      question = unused[Math.floor(Math.random() * unused.length)];
    } else {
      // All questions in this category have been used — reset this category
      question = poolQuestions[Math.floor(Math.random() * poolQuestions.length)];
      usedMap[cat] = []; // Reset tracking for this category
    }

    picked.push(question);
    usedCategories.add(cat);

    // Track the used ID
    if (!usedMap[cat]) usedMap[cat] = [];
    usedMap[cat].push(question.id);
  }

  // If we still need more questions (edge case: fewer categories than count)
  if (picked.length < count) {
    const remaining = QUESTION_POOL.filter((q) => !picked.includes(q));
    const shuffled = remaining.sort(() => Math.random() - 0.5);
    for (const q of shuffled) {
      if (picked.length >= count) break;
      picked.push(q);
    }
  }

  saveUsedMap(usedMap);
  return picked;
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

function getWeekdayChinese(): string {
  const d = new Date();
  const weekdays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
  return weekdays[d.getDay()];
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



// ============ Canvas-based Share Image Generator ============
async function generateShareImage(
  result: { summary: string; encouragement: string; book: string },
  weekday: string
): Promise<string> {
  // Wait for fonts to load
  await document.fonts.ready;

  const DPR = 2;
  const W = 360; // card width in CSS px
  const PAD = 40; // padding in CSS px
  const CW = W - PAD * 2; // content width

  // Get the actual serif font from CSS variable
  const serifVar = getComputedStyle(document.documentElement).getPropertyValue('--font-serif').trim();
  const FF = serifVar ? `'${serifVar}', serif` : '"Noto Serif SC", serif';

  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d')!;

  // Font helper
  const setFont = (size: number, weight = '300') => {
    ctx.font = `${weight} ${size * DPR}px ${FF}`;
  };

  // Chinese text wrapping → returns array of lines
  function wrapText(text: string, maxPx: number, fontSize: number, fontWeight = '300'): string[] {
    setFont(fontSize, fontWeight);
    const lines: string[] = [];
    let line = '';
    for (const char of text) {
      if (char === '\n') { lines.push(line); line = ''; continue; }
      const test = line + char;
      if (ctx.measureText(test).width > maxPx && line) {
        lines.push(line);
        line = char;
      } else {
        line = test;
      }
    }
    if (line) lines.push(line);
    return lines;
  }

  // --- First pass: measure to get total height ---
  const sLines = wrapText(result.summary, (CW - 20) * DPR, 15);
  const eLines = wrapText(result.encouragement, (CW - 10) * DPR, 20);

  const SECTION_GAP = 28; // gap between major sections
  let totalH = PAD; // top padding
  totalH += 32; // top branding area
  totalH += SECTION_GAP;
  totalH += 18; // weekday
  totalH += SECTION_GAP;
  totalH += 24; // divider
  totalH += 20; // gap
  totalH += sLines.length * 28; // summary lines
  totalH += SECTION_GAP;
  totalH += 24; // divider
  totalH += SECTION_GAP;
  totalH += 22; // label
  totalH += 20; // gap
  totalH += eLines.length * 38; // encouragement lines
  totalH += 20; // gap
  if (result.book) totalH += 22;
  totalH += 40; // bottom branding area
  totalH += PAD; // bottom padding

  canvas.width = W * DPR;
  canvas.height = totalH * DPR;

  // --- Draw background with rounded corners ---
  const R = 16 * DPR;
  ctx.fillStyle = '#FAF8F5';
  ctx.beginPath();
  ctx.moveTo(R, 0);
  ctx.lineTo(canvas.width - R, 0);
  ctx.quadraticCurveTo(canvas.width, 0, canvas.width, R);
  ctx.lineTo(canvas.width, canvas.height - R);
  ctx.quadraticCurveTo(canvas.width, canvas.height, canvas.width - R, canvas.height);
  ctx.lineTo(R, canvas.height);
  ctx.quadraticCurveTo(0, canvas.height, 0, canvas.height - R);
  ctx.lineTo(0, R);
  ctx.quadraticCurveTo(0, 0, R, 0);
  ctx.closePath();
  ctx.fill();

  // --- Helper functions ---
  ctx.textBaseline = 'top';
  ctx.textAlign = 'left';

  function drawCenteredText(text: string, y: number) {
    const w = ctx.measureText(text).width;
    ctx.fillText(text, (canvas.width - w) / 2, y);
  }

  // Draw decorative line-text-line pattern, all vertically centered at y
  function drawLineTextLine(text: string, y: number, fontSize: number, color: string, lineW: number, lineColor = 'rgba(124,154,142,0.25)') {
    setFont(fontSize);
    const textW = ctx.measureText(text).width;
    const gap = 12 * DPR;
    const linePx = lineW * DPR;
    const totalW = linePx * 2 + gap * 2 + textW;
    const sx = (canvas.width - totalW) / 2;
    const textY = y;
    const lineY = y + fontSize * DPR * 0.4; // vertically center line with text

    // Left line
    ctx.fillStyle = lineColor;
    ctx.fillRect(sx, lineY, linePx, DPR);
    // Right line
    ctx.fillRect(sx + linePx + gap * 2 + textW, lineY, linePx, DPR);
    // Text
    ctx.fillStyle = color;
    ctx.fillText(text, sx + linePx + gap, textY);
  }

  // --- Second pass: draw content ---
  let y = PAD * DPR;

  // Top branding: —— 晨间心语 ——
  drawLineTextLine('晨  间  心  语', y, 12, 'rgba(124,154,142,0.5)', 40);
  y += 32 * DPR;

  // Weekday
  y += SECTION_GAP * DPR;
  setFont(13);
  ctx.fillStyle = 'rgba(124,154,142,0.6)';
  drawCenteredText(weekday, y);
  y += 18 * DPR;

  // Divider 1
  y += SECTION_GAP * DPR;
  drawLineTextLine('·  ·  ·', y, 8, 'rgba(124,154,142,0.35)', 28, 'rgba(124,154,142,0.2)');
  y += 24 * DPR;

  // Summary
  y += 20 * DPR;
  setFont(15, '300');
  ctx.fillStyle = 'rgba(80,80,80,0.75)';
  for (const line of sLines) {
    drawCenteredText(line, y);
    y += 28 * DPR;
  }

  // Divider 2
  y += SECTION_GAP * DPR;
  drawLineTextLine('·  ·  ·', y, 8, 'rgba(124,154,142,0.35)', 28, 'rgba(124,154,142,0.2)');
  y += 24 * DPR;

  // "给你的话" label
  y += SECTION_GAP * DPR;
  setFont(12, '300');
  ctx.fillStyle = 'rgba(124,154,142,0.7)';
  drawCenteredText('♡  给你的话  ♡', y);
  y += 22 * DPR;

  // Encouragement
  y += 20 * DPR;
  setFont(20, '300');
  ctx.fillStyle = 'rgba(40,40,40,0.9)';
  for (const line of eLines) {
    drawCenteredText(line, y);
    y += 38 * DPR;
  }

  // Book
  y += 20 * DPR;
  if (result.book) {
    setFont(11, '300');
    ctx.fillStyle = 'rgba(124,154,142,0.45)';
    drawCenteredText(result.book, y);
    y += 22 * DPR;
  }

  // Bottom branding
  y += 40 * DPR - 12 * DPR; // gap before branding
  drawLineTextLine('温柔地对待每一刻', y, 10, 'rgba(124,154,142,0.35)', 60, 'rgba(124,154,142,0.15)');

  return canvas.toDataURL('image/png');
}

// ============ Visitor ID helper ============
const VISITOR_KEY = 'xinyu_visitor_id';

function getOrCreateVisitorId(): string {
  try {
    const existing = localStorage.getItem(VISITOR_KEY);
    if (existing) return existing;
  } catch {}
  // Generate anonymous ID: v_ + timestamp + random
  const id = 'v_' + Date.now().toString(36) + '_' + Math.random().toString(36).slice(2, 8);
  try {
    localStorage.setItem(VISITOR_KEY, id);
  } catch {}
  return id;
}

// ============ Main Component ============
export default function Home() {
  const [view, setView] = useState<AppView>('greeting');
  const [step, setStep] = useState(0);
  const [isDark, setIsDark] = useState(false);
  const [currentQuestions, setCurrentQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [result, setResult] = useState<{ summary: string; encouragement: string; book: string } | null>(null);
  const [history, setHistory] = useState<CheckInRecord[]>([]);
  const [todayCheckIns, setTodayCheckIns] = useState<CheckInRecord[]>([]);
  const [showCursor, setShowCursor] = useState(() => {
    if (typeof window !== 'undefined') {
      // Disable heart cursor by default on touch devices
      return window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    }
    return false;
  });

  // Ref for auto-advance timer
  const autoAdvanceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [shareImageUri, setShareImageUri] = useState<string | null>(null);
  const [stats, setStats] = useState<Stats | null>(null);

  // Visitor ID (generated once, stored in localStorage)
  const visitorIdRef = useRef<string>('');

  // Dark mode is off by default - user can toggle manually

  // Load history on mount + register visit
  useEffect(() => {
    // Generate visitor ID and register this visit
    const vid = getOrCreateVisitorId();
    visitorIdRef.current = vid;
    fetch('/api/visit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ visitorId: vid }),
    }).catch(() => {});

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
            encouragement: c.encouragement,
            book: c.book,
          })),
          allPreviousEncouragements: history.map((c) => ({
            encouragement: c.encouragement,
            book: c.book,
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
                visitorId: visitorIdRef.current,
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
  }, [step, currentQuestions, answers, todayCheckIns, history]);

  const handleHistory = useCallback(() => {
    fetch('/api/checkin')
      .then((r) => r.json())
      .then((data) => setHistory(data))
      .catch(() => {});
    fetch('/api/stats')
      .then((r) => r.json())
      .then((data: Stats) => setStats(data))
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
      <header className="relative z-10 flex items-center justify-between px-4 py-3 sm:px-8 sm:py-4 pt-safe">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Leaf className="w-4 h-4 text-sage" />
          <span className="text-sm tracking-widest font-light">心语</span>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowCursor((p) => !p)}
            className="rounded-full w-10 h-10 sm:w-9 sm:h-9 text-muted-foreground hover:text-foreground active:bg-sage/10"
            aria-label="切换爱心鼠标"
          >
            <Heart className={`w-4.5 h-4.5 sm:w-4 sm:h-4 ${showCursor ? 'fill-sage/40 text-sage' : ''}`} />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleHistory}
            className="rounded-full w-10 h-10 sm:w-9 sm:h-9 text-muted-foreground hover:text-foreground active:bg-sage/10"
            aria-label="查看历史记录"
          >
            <History className="w-4.5 h-4.5 sm:w-4 sm:h-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleDark}
            className="rounded-full w-10 h-10 sm:w-9 sm:h-9 text-muted-foreground hover:text-foreground active:bg-sage/10"
            aria-label="切换深色模式"
          >
            {isDark ? <Sun className="w-4.5 h-4.5 sm:w-4 sm:h-4" /> : <Moon className="w-4.5 h-4.5 sm:w-4 sm:h-4" />}
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 flex-1 flex items-start sm:items-center justify-center px-4 sm:px-6 pb-8 pt-2 sm:pt-0">
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
                className="flex flex-col items-center text-center gap-6 sm:gap-8"
              >
                <div className="relative">
                  <div className="absolute inset-0 w-24 h-24 rounded-full bg-sage/10 animate-breathe scale-150" />
                  <div className="relative w-24 h-24 rounded-full bg-sage/10 flex items-center justify-center">
                    <Sun className="w-10 h-10 text-sage/70" />
                  </div>
                </div>

                <div className="space-y-3">
                  <h1 className="text-3xl sm:text-4xl font-light tracking-wide text-foreground font-serif">
                    {getGreeting()}
                  </h1>
                  <p className="text-muted-foreground font-light text-lg">
                    {getWeekdayChinese()}
                  </p>
                </div>

                <p className="text-muted-foreground/80 font-light text-base max-w-xs leading-relaxed">
                  花一分钟，温柔地问候自己的内心
                </p>

                <Button
                  onClick={handleStart}
                  className="mt-2 sm:mt-4 rounded-full px-8 py-5 sm:py-6 text-base font-light tracking-wider bg-sage hover:bg-sage/90 text-sage-foreground transition-all duration-300 hover:shadow-lg hover:shadow-sage/20 active:scale-95"
                >
                  {todayCheckIns.length > 0 ? '再聊一次' : '开始今天'}
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Button>

                {todayCheckIns.length > 0 && (
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
                        <h2 className="text-xl sm:text-3xl font-light text-foreground leading-snug">
                          {currentQuestions[step].title}
                        </h2>
                        <p className="text-xs sm:text-sm text-muted-foreground font-light">
                          {currentQuestions[step].subtitle}
                        </p>
                      </div>

                      {/* Option buttons - adaptive grid layout */}
                      <div className="min-h-[160px] sm:min-h-[180px] flex items-center justify-center">
                        <div className={`grid gap-3 w-full max-w-sm mx-auto ${
                          currentQuestions[step].options.length <= 2 ? 'grid-cols-2' :
                          currentQuestions[step].options.length === 3 ? 'grid-cols-3' :
                          currentQuestions[step].options.length === 4 ? 'grid-cols-2' :
                          'grid-cols-3'
                        }`}>
                          {currentQuestions[step].options.map((opt) => (
                            <button
                              key={opt.value}
                              onClick={() => {
                                const qId = currentQuestions[step].id;
                                setAnswers((a) => ({ ...a, [qId]: opt.value }));
                                // Auto-advance after a short delay so user sees the selection
                                // Clear any pending advance first
                                if (autoAdvanceRef.current) clearTimeout(autoAdvanceRef.current);
                                autoAdvanceRef.current = setTimeout(() => {
                                  setStep((currentStep) => {
                                    if (currentStep < currentQuestions.length - 1) {
                                      return currentStep + 1;
                                    } else {
                                      handleNext();
                                      return currentStep;
                                    }
                                  });
                                }, 450);
                              }}
                              className={`flex flex-col items-center justify-center gap-1.5 py-4 sm:py-5 rounded-2xl border transition-all duration-300 cursor-pointer active:scale-95 ${
                                answers[currentQuestions[step].id] === opt.value
                                  ? 'border-sage bg-sage/10 shadow-sm scale-[1.02]'
                                  : 'border-border hover:border-sage/40 hover:bg-sage/5 active:bg-sage/5'
                              }`}
                            >
                              <span className="text-2xl">{opt.display}</span>
                              <span className="text-[11px] sm:text-xs font-light text-muted-foreground whitespace-nowrap">
                                {opt.value}
                              </span>
                            </button>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Navigation - back only */}
                <div className="flex justify-start items-center pt-2 sm:pt-4">
                  <Button
                    variant="ghost"
                    onClick={() => {
                      if (step > 0) setStep((s) => s - 1);
                      else setView('greeting');
                    }}
                    className="text-muted-foreground hover:text-foreground font-light h-11 sm:h-9 active:bg-sage/5"
                  >
                    <ArrowLeft className="w-4 h-4 mr-1" />
                    {step > 0 ? '上一步' : '返回'}
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
                className="flex flex-col items-center text-center gap-6 sm:gap-8 py-2 sm:py-4"
              >
                {/* Date & time */}
                <div className="space-y-1">
                  <p className="text-sm font-light text-muted-foreground tracking-wider">
                    {getWeekdayChinese()}
                  </p>
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
                  <p className="text-sm sm:text-base font-light text-muted-foreground/80 leading-relaxed tracking-wide max-w-xs font-serif">
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
                  <div className="flex items-center justify-center gap-2 text-sage/70">
                    <Heart className="w-4 h-4" />
                    <span className="text-sm tracking-widest font-light">给你的话</span>
                    <Heart className="w-4 h-4" />
                  </div>
                  <p className="text-xl sm:text-2xl font-light text-foreground leading-relaxed font-serif">
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

                {/* Actions */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.5, duration: 0.6 }}
                  className="flex flex-col items-center gap-3 pt-2"
                >
                  <Button
                    onClick={handleStart}
                    className="rounded-full px-6 h-11 sm:h-9 font-light tracking-wider bg-sage/80 hover:bg-sage text-sage-foreground transition-all duration-300 active:scale-95"
                  >
                    再聊一次
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                  <Button
                    onClick={async () => {
                      if (!result) return;
                      setIsGeneratingImage(true);
                      try {
                        const dataUrl = await generateShareImage(result, getWeekdayChinese());
                        setShareImageUri(dataUrl);
                      } catch (err) {
                        console.error('Share image error:', err);
                        toast.error('生成图片失败，请稍后再试');
                      } finally {
                        setIsGeneratingImage(false);
                      }
                    }}
                    disabled={isGeneratingImage}
                    className="rounded-full px-6 h-11 sm:h-9 font-light tracking-wider bg-warm/80 hover:bg-warm text-warm-foreground transition-all duration-300 active:scale-95 disabled:opacity-50"
                  >
                    {isGeneratingImage ? (
                      <>
                        <Sparkles className="w-4 h-4 mr-1.5 animate-spin" />
                        生成中...
                      </>
                    ) : (
                      <>
                        <Download className="w-4 h-4 mr-1.5" />
                        保存分享图
                      </>
                    )}
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={() => setView('greeting')}
                    className="text-muted-foreground hover:text-foreground font-light h-11 sm:h-9 active:bg-sage/5"
                  >
                    <ArrowLeft className="w-4 h-4 mr-1" />
                    返回
                  </Button>
                </motion.div>

                {/* Share Preview Modal */}
                <AnimatePresence>
                  {shareImageUri && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="fixed inset-0 z-[10000] flex flex-col items-center justify-center bg-foreground/30 backdrop-blur-sm p-4"
                      onClick={() => setShareImageUri(null)}
                    >
                      <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        transition={{ duration: 0.3, ease: 'easeOut' }}
                        className="flex flex-col items-center gap-4 max-h-[90vh]"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {/* Preview image */}
                        <div className="max-h-[70vh] overflow-auto">
                          <img
                            src={shareImageUri}
                            alt="分享卡片"
                            className="max-w-full rounded-2xl shadow-lg"
                            style={{ maxHeight: '60vh' }}
                          />
                        </div>

                        <p className="text-xs text-muted-foreground/60 font-light text-center">
                          长按图片也可保存到相册
                        </p>

                        {/* Action buttons */}
                        <div className="flex gap-3">
                          <Button
                            onClick={() => {
                              try {
                                const link = document.createElement('a');
                                link.download = `心语_${getWeekdayChinese()}.png`;
                                link.href = shareImageUri;
                                document.body.appendChild(link);
                                link.click();
                                document.body.removeChild(link);
                                toast.success('图片已保存');
                              } catch {
                                // Fallback for mobile: open in new tab
                                window.open(shareImageUri, '_blank');
                                toast.success('请长按图片保存');
                              }
                            }}
                            className="rounded-full px-6 h-11 font-light tracking-wider bg-sage hover:bg-sage/90 text-sage-foreground transition-all duration-300 active:scale-95"
                          >
                            <Download className="w-4 h-4 mr-1.5" />
                            保存到相册
                          </Button>
                          <Button
                            variant="outline"
                            onClick={() => setShareImageUri(null)}
                            className="rounded-full px-6 h-11 font-light tracking-wider"
                          >
                            关闭
                          </Button>
                        </div>
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>
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

                {/* Stats card */}
                {stats && (
                  <div className="flex items-center justify-center gap-6 py-3 px-4 rounded-2xl border border-sage/10 bg-sage/[0.03]">
                    <div className="flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5 text-sage/50" />
                      <span className="text-xs text-muted-foreground/60 font-light">访问</span>
                      <span className="text-sm text-sage/70 font-light">{stats.totalVisitors}</span>
                    </div>
                    <div className="w-px h-3 bg-sage/10" />
                    <div className="flex items-center gap-1.5">
                      <Heart className="w-3.5 h-3.5 text-sage/50" />
                      <span className="text-xs text-muted-foreground/60 font-light">心语</span>
                      <span className="text-sm text-sage/70 font-light">{stats.totalCheckIns}</span>
                    </div>
                    <div className="w-px h-3 bg-sage/10" />
                    <div className="flex items-center gap-1.5">
                      <Sun className="w-3.5 h-3.5 text-sage/50" />
                      <span className="text-xs text-muted-foreground/60 font-light">今日</span>
                      <span className="text-sm text-sage/70 font-light">{stats.todayVisitors}</span>
                    </div>
                  </div>
                )}

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
      <footer className="relative z-10 mt-auto py-4 pb-safe text-center">
        <p className="text-xs font-light text-muted-foreground/40 tracking-wider">
          温柔地对待每一刻
        </p>
      </footer>
    </div>
  );
}

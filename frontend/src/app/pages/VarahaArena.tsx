import { useState, useEffect, useRef, useCallback } from 'react';
import logo from '@/imports/2carvnlogo2.png';

const COLORS = {
  bg: '#0D0A1A',
  card: '#1A1535',
  surface: '#251E45',
  purple: '#7C3AED',
  pink: '#EC4899',
  cyan: '#06B6D4',
  yellow: '#FBBF24',
  green: '#10B981',
  orange: '#F97316',
  red: '#EF4444',
  text: '#F8FAFC',
  muted: '#94A3B8',
};

const WORD_QUESTIONS = [
  { q: "What does 'ENORMOUS' mean?", options: ['Very tiny', 'Very huge', 'Very fast', 'Very quiet'], answer: 1, emoji: '🐘' },
  { q: "Choose the SYNONYM for 'Happy':", options: ['Sad', 'Angry', 'Joyful', 'Tired'], answer: 2, emoji: '😊' },
  { q: "Fill in: 'The sun _____ in the east.'", options: ['sets', 'rises', 'falls', 'runs'], answer: 1, emoji: '🌅' },
  { q: "What does 'COURAGEOUS' mean?", options: ['Fearful', 'Brave', 'Lazy', 'Clever'], answer: 1, emoji: '🦁' },
  { q: "Opposite of 'Ancient' is:", options: ['Old', 'Big', 'Modern', 'Slow'], answer: 2, emoji: '⏰' },
  { q: "What does 'TRANSPARENT' mean?", options: ['Dark', 'You can see through it', 'Very hard', 'Very soft'], answer: 1, emoji: '🔍' },
  { q: "Fill in: 'She has a ___ for music.'", options: ['talent', 'tooth', 'fear', 'dream'], answer: 0, emoji: '🎵' },
  { q: "SYNONYM for 'Difficult':", options: ['Easy', 'Challenging', 'Simple', 'Clear'], answer: 1, emoji: '🧩' },
  { q: "What does 'PECULIAR' mean?", options: ['Normal', 'Strange/Unusual', 'Beautiful', 'Strong'], answer: 1, emoji: '🦄' },
  { q: "Opposite of 'Generous':", options: ['Kind', 'Selfish', 'Brave', 'Honest'], answer: 1, emoji: '💰' },
  { q: "What does 'VIBRANT' mean?", options: ['Dull', 'Quiet', 'Full of energy/color', 'Heavy'], answer: 2, emoji: '🌈' },
  { q: "Fill in: 'He spoke with great ___.'", options: ['silence', 'confidence', 'fear', 'speed'], answer: 1, emoji: '🎤' },
  { q: "SYNONYM for 'Begin':", options: ['End', 'Stop', 'Commence', 'Finish'], answer: 2, emoji: '🚀' },
  { q: "What does 'FRAGILE' mean?", options: ['Very strong', 'Easily broken', 'Very fast', 'Very loud'], answer: 1, emoji: '🏺' },
  { q: "Opposite of 'Victory':", options: ['Win', 'Game', 'Defeat', 'Play'], answer: 2, emoji: '🏆' },
];

const CODE_QUESTIONS = {
  easy: [
    { q: "What will print?\n```\nprint(2 + 3)\n```", options: ['23', '5', '2+3', 'Error'], answer: 1, explain: '2 + 3 = 5. Python adds the numbers!', emoji: '🐍' },
    { q: "What is stored in x?\n```\nx = 10 * 2\n```", options: ['10', '2', '102', '20'], answer: 3, explain: '10 × 2 = 20. x stores the result!', emoji: '📦' },
    { q: "What type is this?\n```\nname = 'Arjun'\n```", options: ['Number', 'String', 'Boolean', 'List'], answer: 1, explain: 'Text in quotes is called a String!', emoji: '📝' },
    { q: "What does this print?\n```\nfor i in range(3):\n  print(i)\n```", options: ['1 2 3', '0 1 2', '0 1 2 3', '1 2'], answer: 1, explain: 'range(3) gives 0, 1, 2. Loops start from 0!', emoji: '🔄' },
    { q: "What is the output?\n```\nprint(10 > 5)\n```", options: ['10', '5', 'True', 'False'], answer: 2, explain: '10 > 5 is True! Comparisons give True or False.', emoji: '✅' },
    { q: "What does len() do?\n```\nlen('Hello')\n```", options: ['Prints Hello', 'Returns 5', 'Returns 4', 'Deletes text'], answer: 1, explain: "'Hello' has 5 characters so len() returns 5!", emoji: '📏' },
  ],
  medium: [
    { q: "What prints?\n```\nnums = [1,2,3]\nprint(nums[1])\n```", options: ['1', '2', '3', 'Error'], answer: 1, explain: 'Lists start at index 0! So index 1 = second item = 2', emoji: '📋' },
    { q: "What is the output?\n```\nx = 5\nif x > 3:\n  print('Big')\nelse:\n  print('Small')\n```", options: ['Small', 'Big', '5', 'Error'], answer: 1, explain: "5 > 3 is True, so it prints 'Big'!", emoji: '🔀' },
    { q: "What does this return?\n```\ndef double(n):\n  return n * 2\ndouble(4)\n```", options: ['4', '2', '8', '42'], answer: 2, explain: 'double(4) returns 4 × 2 = 8!', emoji: '⚡' },
    { q: "Find the bug:\n```\nname = input()\nprint('Hello' + name)\n```", options: ['No bug here!', 'Missing space in Hello', 'input() is wrong', 'print is wrong'], answer: 1, explain: "Output would be 'HelloArjun' — needs a space: 'Hello '!", emoji: '🐛' },
    { q: "What prints?\n```\nfor i in range(1, 4):\n  print(i * i)\n```", options: ['1 4 9', '1 2 3', '2 3 4', '4 9 16'], answer: 0, explain: '1²=1, 2²=4, 3²=9. range(1,4) gives 1,2,3!', emoji: '🔢' },
  ],
  hard: [
    { q: "What's the output?\n```\ndef mystery(lst):\n  return lst[-1]\nprint(mystery([10,20,30]))\n```", options: ['10', '20', '30', 'Error'], answer: 2, explain: 'lst[-1] gets the LAST element of a list = 30!', emoji: '🔮' },
    { q: "What does this create?\n```\nsquares = [x**2 for x in range(5)]\n```", options: ['[1,4,9,16,25]', '[0,1,4,9,16]', '[0,1,2,3,4]', 'Error'], answer: 1, explain: 'List comprehension! 0²=0, 1²=1, 2²=4, 3²=9, 4²=16', emoji: '🎯' },
    { q: "What's wrong?\n```\nscores = {}\nscores['math'] = 95\nprint(scores[0])\n```", options: ['Nothing wrong', "Wrong key — use 'math'", 'scores is wrong type', '95 is invalid'], answer: 1, explain: "Dictionary key is 'math' not 0! Use scores['math']", emoji: '🗺️' },
  ],
};

const PITCH_SCENARIOS = [
  {
    scenario: "📧 Your teacher asks why you didn't submit homework. You forgot. What do you say?",
    options: [
      "I don't know, I just didn't do it.",
      "It's not fair, others also didn't submit!",
      "I apologize, sir. I forgot to submit it. Can I send it tonight?",
      "My dog ate my notebook.",
    ],
    answer: 2,
    explain: 'Taking responsibility + offering a solution is the most professional response! 🌟',
    emoji: '✉️',
  },
  {
    scenario: "🤝 You're presenting a group project but your teammate did very little work. What do you do?",
    options: [
      'Call them out publicly during the presentation.',
      'Do all the work yourself and stay quiet.',
      'After class, privately talk about dividing work better next time.',
      'Complain to everyone in class.',
    ],
    answer: 2,
    explain: 'Private, calm conversations solve team issues better than public embarrassment! 💪',
    emoji: '👥',
  },
  {
    scenario: "📱 A classmate shares wrong information in the group chat. How do you respond?",
    options: [
      "Reply: 'You're so wrong lol 😂'",
      'Politely share the correct information with a reliable source.',
      'Ignore it — not your problem.',
      'Forward it to everyone.',
    ],
    answer: 1,
    explain: 'Correcting misinformation politely with evidence is a communication superpower! 🦸',
    emoji: '💬',
  },
  {
    scenario: "🎤 You need to present in class but feel nervous. What's the best first step?",
    options: [
      "Skip the presentation saying you're sick.",
      'Read everything from your notes.',
      'Take a deep breath, make eye contact, speak slowly.',
      'Speak as fast as possible to finish quickly.',
    ],
    answer: 2,
    explain: 'Deep breathing + eye contact + slow speech = confident presentation! 🌟',
    emoji: '🎤',
  },
  {
    scenario: "🏫 You disagree with your teacher's grading. What do you do?",
    options: [
      'Argue loudly in class.',
      'Accept it silently even if wrong.',
      'Politely ask to discuss it after class with specific reasons.',
      'Tell all your friends the teacher is unfair.',
    ],
    answer: 2,
    explain: 'Respectful, private, specific conversations with teachers show maturity! 📚',
    emoji: '🏫',
  },
  {
    scenario: "🆘 Your friend is being bullied online. What do you do?",
    options: [
      "Like the bully's posts.",
      'Mind your own business.',
      'Screenshot, support your friend, and report to a trusted adult.',
      'Fight the bully online.',
    ],
    answer: 2,
    explain: "Document, support, and involve trusted adults — that's real courage! 💙",
    emoji: '🛡️',
  },
  {
    scenario: "💼 You want to join the school quiz team but don't know how to ask. You:",
    options: [
      'Wait and hope someone invites you.',
      'Approach the teacher confidently, explain your interest and skills.',
      'Boast loudly about how smart you are.',
      "Give up — it's too scary.",
    ],
    answer: 1,
    explain: 'Confidently expressing interest + your skills = opportunity creator! 🚀',
    emoji: '🧠',
  },
  {
    scenario: "🎮 Your team loses a competition. As team captain, you:",
    options: [
      'Blame your teammates.',
      'Cry and leave.',
      'Thank the team, acknowledge what went wrong, plan to improve.',
      'Say the judges were unfair.',
    ],
    answer: 2,
    explain: 'Great leaders thank, reflect, and improve — even in defeat! 🏅',
    emoji: '🎮',
  },
];

const PARTICLE_COUNT = 18;

type VarahaArenaProps = {
  onFinish: (score: number, duration: number) => void;
};

type WordQuestion = typeof WORD_QUESTIONS[number];
type CodeQuestion = typeof CODE_QUESTIONS.easy[number] & { explain: string };
type PitchScenario = typeof PITCH_SCENARIOS[number];

function Particles() {
  const particles = Array.from({ length: PARTICLE_COUNT }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 4 + 2,
    duration: Math.random() * 8 + 6,
    delay: Math.random() * 5,
    color: [COLORS.purple, COLORS.pink, COLORS.cyan, COLORS.yellow][Math.floor(Math.random() * 4)],
  }));

  return (
    <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0, overflow: 'hidden' }}>
      <style>{`
        @keyframes floatUp { 0%{transform:translateY(0) scale(1);opacity:0.7} 100%{transform:translateY(-110vh) scale(0.3);opacity:0} }
        @keyframes pulse { 0%,100%{transform:scale(1)} 50%{transform:scale(1.15)} }
        @keyframes slideIn { from{opacity:0;transform:translateY(30px)} to{opacity:1;transform:translateY(0)} }
        @keyframes bounceIn { 0%{transform:scale(0.5);opacity:0} 60%{transform:scale(1.15)} 80%{transform:scale(0.95)} 100%{transform:scale(1);opacity:1} }
        @keyframes shake { 0%,100%{transform:translateX(0)} 20%{transform:translateX(-8px)} 40%{transform:translateX(8px)} 60%{transform:translateX(-5px)} 80%{transform:translateX(5px)} }
        @keyframes correctFlash { 0%{background:transparent} 30%{background:rgba(16,185,129,0.25)} 100%{background:transparent} }
        @keyframes wrongFlash { 0%{background:transparent} 30%{background:rgba(239,68,68,0.2)} 100%{background:transparent} }
        @keyframes timerPulse { 0%,100%{transform:scale(1)} 50%{transform:scale(1.04)} }
        @keyframes xpBounce { 0%{transform:translateY(0);opacity:1} 100%{transform:translateY(-60px);opacity:0} }
        @keyframes starSpin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        @keyframes gradientShift { 0%{background-position:0% 50%} 50%{background-position:100% 50%} 100%{background-position:0% 50%} }
        @keyframes wiggle { 0%,100%{transform:rotate(-3deg)} 50%{transform:rotate(3deg)} }
        @keyframes popIn { 0%{transform:scale(0);opacity:0} 70%{transform:scale(1.1)} 100%{transform:scale(1);opacity:1} }
        .game-btn { transition: all 0.15s ease; cursor: pointer; }
        .game-btn:hover { transform: translateY(-3px) scale(1.02); }
        .game-btn:active { transform: scale(0.97); }
        .opt-btn { transition: all 0.15s ease; cursor: pointer; border: 2px solid rgba(255,255,255,0.1); }
        .opt-btn:hover { transform: translateY(-2px); border-color: rgba(255,255,255,0.4); }
      `}</style>
      {particles.map((p) => (
        <div
          key={p.id}
          style={{
            position: 'absolute',
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            borderRadius: '50%',
            background: p.color,
            animation: `floatUp ${p.duration}s ${p.delay}s infinite linear`,
            opacity: 0.6,
          }}
        />
      ))}
    </div>
  );
}

function XPPopup({ amount, onDone }: { amount: number; onDone: () => void }) {
  useEffect(() => {
    const t = setTimeout(onDone, 1200);
    return () => clearTimeout(t);
  }, [onDone]);
  return (
    <div
      style={{
        position: 'fixed',
        top: '20%',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 9999,
        animation: 'xpBounce 1.2s ease forwards',
        fontSize: 28,
        fontWeight: 800,
        color: COLORS.yellow,
        textShadow: '0 0 20px rgba(251,191,36,0.8)',
        pointerEvents: 'none',
      }}
    >
      +{amount} XP ⚡
    </div>
  );
}

function TimerBar({ timeLeft, total }: { timeLeft: number; total: number }) {
  const pct = (timeLeft / total) * 100;
  const color = timeLeft <= 5 ? COLORS.red : timeLeft <= 10 ? COLORS.orange : COLORS.cyan;
  return (
    <div style={{ marginBottom: 12 }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginBottom: 6,
          fontSize: 13,
          color: COLORS.muted,
        }}
      >
        <span>⏱️ Time</span>
        <span
          style={{
            fontWeight: 800,
            fontSize: 18,
            color: timeLeft <= 5 ? COLORS.red : COLORS.text,
            animation: timeLeft <= 5 ? 'timerPulse 0.5s infinite' : 'none',
          }}
        >
          {timeLeft}s
        </span>
      </div>
      <div style={{ background: 'rgba(255,255,255,0.08)', borderRadius: 99, height: 10, overflow: 'hidden' }}>
        <div
          style={{
            width: `${pct}%`,
            height: '100%',
            borderRadius: 99,
            background: color,
            transition: 'width 1s linear, background 0.3s',
            boxShadow: `0 0 10px ${color}`,
          }}
        />
      </div>
    </div>
  );
}

function ProgressDots({ current, total }: { current: number; total: number }) {
  return (
    <div style={{ display: 'flex', gap: 6, justifyContent: 'center', marginBottom: 16 }}>
      {Array.from({ length: total }, (_, i) => (
        <div
          key={i}
          style={{
            width: i === current ? 20 : 10,
            height: 10,
            borderRadius: 99,
            background: i < current ? COLORS.green : i === current ? COLORS.yellow : 'rgba(255,255,255,0.15)',
            transition: 'all 0.3s ease',
            boxShadow: i === current ? `0 0 8px ${COLORS.yellow}` : 'none',
          }}
        />
      ))}
    </div>
  );
}

function HomeScreen({ onSelect, totalXP, gamesPlayed }: { onSelect: (id: 'word' | 'code' | 'pitch') => void; totalXP: number; gamesPlayed: number }) {
  const games = [
    {
      id: 'word',
      title: 'Word Duel',
      emoji: '⚔️',
      desc: 'Battle with words! Synonyms, meanings & more',
      color: COLORS.pink,
      bg: 'linear-gradient(135deg, #2D1B3D, #1A1535)',
      badge: 'VERBAL',
      questions: '15 rounds',
    },
    {
      id: 'code',
      title: 'Code Sprint',
      emoji: '🚀',
      desc: 'Race through coding challenges!',
      color: COLORS.cyan,
      bg: 'linear-gradient(135deg, #0D2233, #1A1535)',
      badge: 'TECHNICAL',
      questions: '3 levels',
    },
    {
      id: 'pitch',
      title: 'Pitch Master',
      emoji: '🎯',
      desc: 'Ace real-life communication scenarios!',
      color: COLORS.yellow,
      bg: 'linear-gradient(135deg, #2D2000, #1A1535)',
      badge: 'COMMUNICATION',
      questions: '8 scenarios',
    },
  ];

  return (
    <div style={{ animation: 'slideIn 0.5s ease' }}>
      <div
        style={{
          textAlign: 'center',
          marginBottom: 32,
          background: 'linear-gradient(135deg, #7C3AED, #EC4899, #06B6D4)',
          backgroundSize: '200% 200%',
          animation: 'gradientShift 4s ease infinite',
          borderRadius: 20,
          padding: '24px 16px',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, marginBottom: 14 }}>
          <img src={logo} alt="2CaRvN" style={{ width: 60, height: 60, borderRadius: 16, border: '2px solid rgba(255,255,255,0.35)', background: 'rgba(255,255,255,0.08)' }} />
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', color: 'rgba(255,255,255,0.9)' }}>
              2CaRvN
            </div>
            <div style={{ fontSize: 22, fontWeight: 900, color: '#fff' }}>
              Arena Hub
            </div>
          </div>
        </div>
        <div style={{ fontSize: 48, animation: 'wiggle 2s ease infinite' }}>🎮</div>
        <h1 style={{ fontSize: 28, fontWeight: 900, color: '#fff', margin: '8px 0 4px', letterSpacing: -1 }}>
          2CaRvN ARENA
        </h1>
        <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: 14, margin: 0 }}>
          Learn · Play · Level Up!
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, marginBottom: 20 }}>
        {[
          { label: 'Total XP', value: `${totalXP} ⚡`, color: COLORS.yellow },
          { label: 'Games Won', value: `${gamesPlayed} 🏆`, color: COLORS.green },
          { label: 'Level', value: `${Math.floor(totalXP / 100) + 1} 🌟`, color: COLORS.purple },
        ].map((s) => (
          <div
            key={s.label}
            style={{
              background: COLORS.surface,
              borderRadius: 12,
              padding: '12px 8px',
              textAlign: 'center',
              border: '1px solid rgba(255,255,255,0.07)',
            }}
          >
            <div style={{ fontSize: 18, fontWeight: 900, color: s.color }}>{s.value}</div>
            <div style={{ fontSize: 11, color: COLORS.muted, marginTop: 2 }}>{s.label}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {games.map((g, i) => (
          <button
            key={g.id}
            className="game-btn"
            onClick={() => onSelect(g.id as 'word' | 'code' | 'pitch')}
            style={{
              background: g.bg,
              border: `1.5px solid ${g.color}33`,
              borderRadius: 18,
              padding: '18px 20px',
              textAlign: 'left',
              cursor: 'pointer',
              width: '100%',
              animation: `slideIn 0.4s ${i * 0.1}s both ease`,
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <div
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: 16,
                  fontSize: 28,
                  background: `${g.color}22`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: `1.5px solid ${g.color}44`,
                  animation: 'pulse 2s infinite',
                  flexShrink: 0,
                }}
              >
                {g.emoji}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                  <span style={{ fontSize: 17, fontWeight: 800, color: '#fff' }}>{g.title}</span>
                  <span
                    style={{
                      fontSize: 10,
                      fontWeight: 700,
                      padding: '2px 8px',
                      borderRadius: 99,
                      background: `${g.color}22`,
                      color: g.color,
                      letterSpacing: 0.5,
                    }}
                  >
                    {g.badge}
                  </span>
                </div>
                <p style={{ fontSize: 13, color: COLORS.muted, margin: '0 0 4px' }}>{g.desc}</p>
                <span style={{ fontSize: 11, color: g.color }}>✦ {g.questions}</span>
              </div>
              <div style={{ fontSize: 20, color: g.color }}>▶</div>
            </div>
          </button>
        ))}
      </div>

      <div
        style={{
          marginTop: 20,
          padding: '14px 16px',
          borderRadius: 14,
          background: 'linear-gradient(90deg, rgba(124,58,237,0.15), rgba(236,72,153,0.15))',
          border: '1px solid rgba(124,58,237,0.25)',
          textAlign: 'center',
        }}
      >
        <span style={{ fontSize: 13, color: COLORS.muted }}>
          🔥 Next level at <strong style={{ color: COLORS.yellow }}>{(Math.floor(totalXP / 100) + 1) * 100} XP</strong> — keep going!
        </span>
      </div>
    </div>
  );
}

function WordGame({ onBack, onComplete }: { onBack: () => void; onComplete: (score: number, duration: number) => void }) {
  const [qIdx, setQIdx] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [timeLeft, setTimeLeft] = useState(15);
  const [phase, setPhase] = useState<'question' | 'answered' | 'timeout'>('question');
  const [showXP, setShowXP] = useState<number | null>(null);
  const [xpKey, setXpKey] = useState(0);
  const [questions] = useState<WordQuestion[]>(() => [...WORD_QUESTIONS].sort(() => Math.random() - 0.5).slice(0, 10));
  const [elapsed, setElapsed] = useState(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const q = questions[qIdx];
  const multiplier = streak >= 4 ? 3 : streak >= 2 ? 2 : 1;

  const nextQ = useCallback(() => {
    if (qIdx + 1 >= questions.length) {
      onComplete(score, elapsed);
    } else {
      setQIdx((i) => i + 1);
      setSelected(null);
      setPhase('question');
      setTimeLeft(15);
    }
  }, [qIdx, questions.length, score, onComplete, elapsed]);

  useEffect(() => {
    if (phase !== 'question') return;
    timerRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          setPhase('timeout');
          setStreak(0);
          setTimeout(nextQ, 1500);
          return 0;
        }
        return t - 1;
      });
      setElapsed((prev) => prev + 1);
    }, 1000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [phase, nextQ]);

  const handleSelect = (idx: number) => {
    if (phase !== 'question') return;
    if (timerRef.current) clearInterval(timerRef.current);
    setSelected(idx);
    const correct = idx === q.answer;
    if (correct) {
      const newStreak = streak + 1;
      setStreak(newStreak);
      const xp = 10 * (newStreak >= 4 ? 3 : newStreak >= 2 ? 2 : 1);
      setScore((s) => s + xp);
      setShowXP(xp);
      setXpKey((k) => k + 1);
    } else {
      setStreak(0);
    }
    setPhase('answered');
    setTimeout(nextQ, 2000);
  };

  const optColors = [COLORS.purple, COLORS.pink, COLORS.cyan, COLORS.orange];

  return (
    <div style={{ animation: 'slideIn 0.4s ease' }}>
      {showXP && <XPPopup key={xpKey} amount={showXP} onDone={() => setShowXP(null)} />}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
        <button
          className="game-btn"
          onClick={onBack}
          style={{
            background: 'rgba(255,255,255,0.07)',
            border: 'none',
            color: COLORS.text,
            borderRadius: 10,
            padding: '8px 14px',
            fontSize: 18,
            cursor: 'pointer',
          }}
        >
          ←
        </button>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 14, fontWeight: 800, color: COLORS.pink }}>⚔️ WORD DUEL</div>
        </div>
        <div
          style={{
            background: `${COLORS.yellow}22`,
            border: `1px solid ${COLORS.yellow}44`,
            borderRadius: 10,
            padding: '6px 12px',
            fontSize: 13,
            color: COLORS.yellow,
            fontWeight: 700,
          }}
        >
          {score} XP {multiplier > 1 && <span style={{ color: COLORS.orange }}>×{multiplier}🔥</span>}
        </div>
      </div>

      <ProgressDots current={qIdx} total={questions.length} />
      <TimerBar timeLeft={timeLeft} total={15} />

      {streak >= 2 && (
        <div
          style={{
            textAlign: 'center',
            marginBottom: 12,
            padding: '6px 14px',
            borderRadius: 99,
            display: 'inline-block',
            background: `${COLORS.orange}22`,
            border: `1px solid ${COLORS.orange}55`,
            fontSize: 13,
            color: COLORS.orange,
            fontWeight: 700,
            animation: 'pulse 0.8s infinite',
          }}
        >
          🔥 {streak} in a row! ×{multiplier} XP Bonus!
        </div>
      )}

      <div
        style={{
          background: COLORS.surface,
          borderRadius: 20,
          padding: 24,
          marginBottom: 20,
          border: '1.5px solid rgba(255,255,255,0.07)',
          animation:
            phase === 'answered' && selected === q.answer
              ? 'correctFlash 0.6s ease'
              : phase === 'answered' && selected !== q.answer
              ? 'wrongFlash 0.6s ease'
              : 'none',
        }}
      >
        <div style={{ textAlign: 'center', fontSize: 48, marginBottom: 12 }}>{q.emoji}</div>
        <p
          style={{
            fontSize: 18,
            fontWeight: 700,
            textAlign: 'center',
            color: COLORS.text,
            lineHeight: 1.5,
            margin: 0,
          }}
        >
          {q.q}
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        {q.options.map((opt, i) => {
          let bg = `${optColors[i]}22`;
          let border = `2px solid ${optColors[i]}55`;
          let extra = {} as Record<string, string>;
          if (phase === 'answered') {
            if (i === q.answer) {
              bg = `${COLORS.green}33`;
              border = `2px solid ${COLORS.green}`;
              extra = { animation: 'bounceIn 0.4s ease' };
            } else if (i === selected && i !== q.answer) {
              bg = `${COLORS.red}22`;
              border = `2px solid ${COLORS.red}`;
              extra = { animation: 'shake 0.4s ease' };
            }
          }
          return (
            <button
              key={i}
              className="opt-btn"
              onClick={() => handleSelect(i)}
              style={{
                background: bg,
                border,
                borderRadius: 14,
                padding: '14px 12px',
                cursor: 'pointer',
                color: COLORS.text,
                fontWeight: 700,
                fontSize: 14,
                textAlign: 'left',
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                ...extra,
              }}
            >
              <span
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: 8,
                  background: `${optColors[i]}33`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 900,
                  fontSize: 13,
                  color: optColors[i],
                  flexShrink: 0,
                }}
              >
                {String.fromCharCode(65 + i)}
              </span>
              {opt}
            </button>
          );
        })}
      </div>

      {phase === 'timeout' && (
        <div
          style={{
            marginTop: 16,
            padding: 14,
            borderRadius: 14,
            textAlign: 'center',
            background: `${COLORS.red}22`,
            border: `1px solid ${COLORS.red}55`,
            animation: 'slideIn 0.3s ease',
          }}
        >
          <p style={{ margin: 0, color: COLORS.red, fontWeight: 700 }}>
            ⏰ Time's up! Answer: <span style={{ color: COLORS.green }}>{q.options[q.answer]}</span>
          </p>
        </div>
      )}
    </div>
  );
}

function CodeGame({ onBack, onComplete }: { onBack: () => void; onComplete: (score: number, duration: number) => void }) {
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard' | null>(null);
  const [qIdx, setQIdx] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(20);
  const [phase, setPhase] = useState<'question' | 'answered' | 'timeout'>('question');
  const [showXP, setShowXP] = useState<number | null>(null);
  const [xpKey, setXpKey] = useState(0);
  const [questions, setQuestions] = useState<CodeQuestion[]>([]);
  const [elapsed, setElapsed] = useState(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const startGame = (diff: 'easy' | 'medium' | 'hard') => {
    const qs = [...CODE_QUESTIONS[diff]].sort(() => Math.random() - 0.5);
    setDifficulty(diff);
    setQuestions(qs);
    setQIdx(0);
    setSelected(null);
    setScore(0);
    setTimeLeft(20);
    setPhase('question');
    setElapsed(0);
  };

  const nextQ = useCallback(() => {
    if (qIdx + 1 >= questions.length) {
      onComplete(score, elapsed);
    } else {
      setQIdx((i) => i + 1);
      setSelected(null);
      setPhase('question');
      setTimeLeft(20);
    }
  }, [qIdx, questions.length, score, onComplete, elapsed]);

  useEffect(() => {
    if (!difficulty || phase !== 'question' || questions.length === 0) return;
    timerRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          setPhase('timeout');
          setTimeout(nextQ, 2000);
          return 0;
        }
        return t - 1;
      });
      setElapsed((prev) => prev + 1);
    }, 1000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [difficulty, phase, nextQ, questions.length]);

  const handleSelect = (idx: number) => {
    if (phase !== 'question') return;
    if (timerRef.current) clearInterval(timerRef.current);
    setSelected(idx);
    const q = questions[qIdx];
    if (idx === q.answer) {
      const xp = difficulty === 'hard' ? 20 : difficulty === 'medium' ? 15 : 10;
      setScore((s) => s + xp);
      setShowXP(xp);
      setXpKey((k) => k + 1);
    }
    setPhase('answered');
    setTimeout(nextQ, 2500);
  };

  if (!difficulty) {
    return (
      <div style={{ animation: 'slideIn 0.4s ease' }}>
        {showXP && <XPPopup key={xpKey} amount={showXP} onDone={() => setShowXP(null)} />}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
          <button
            className="game-btn"
            onClick={onBack}
            style={{
              background: 'rgba(255,255,255,0.07)',
              border: 'none',
              color: COLORS.text,
              borderRadius: 10,
              padding: '8px 14px',
              fontSize: 18,
              cursor: 'pointer',
            }}
          >
            ←
          </button>
          <div style={{ fontSize: 16, fontWeight: 800, color: COLORS.cyan }}>🚀 CODE SPRINT</div>
        </div>
        <div
          style={{
            textAlign: 'center',
            padding: '20px 0 28px',
            background: COLORS.surface,
            borderRadius: 20,
            marginBottom: 20,
            border: '1.5px solid rgba(255,255,255,0.07)',
          }}
        >
          <div style={{ fontSize: 56, marginBottom: 8 }}>🚀</div>
          <h2 style={{ margin: '0 0 6px', color: COLORS.text, fontSize: 22 }}>Pick Your Level!</h2>
          <p style={{ color: COLORS.muted, fontSize: 14, margin: 0 }}>Choose your coding challenge difficulty</p>
        </div>
        {[
          { id: 'easy', label: '🟢 Easy', desc: 'Variables, print, basic loops', xp: '10 XP/question', color: COLORS.green },
          { id: 'medium', label: '🟡 Medium', desc: 'Lists, conditions, functions', xp: '15 XP/question', color: COLORS.yellow },
          { id: 'hard', label: '🔴 Hard', desc: 'List comp, dicts, debugging', xp: '20 XP/question', color: COLORS.red },
        ].map((d) => (
          <button
            key={d.id}
            className="game-btn"
            onClick={() => startGame(d.id as 'easy' | 'medium' | 'hard')}
            style={{
              width: '100%',
              marginBottom: 12,
              background: `${d.color}15`,
              border: `2px solid ${d.color}44`,
              borderRadius: 16,
              padding: '16px 20px',
              cursor: 'pointer',
              textAlign: 'left',
              display: 'flex',
              alignItems: 'center',
              gap: 14,
            }}
          >
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 17, fontWeight: 800, color: d.color, marginBottom: 4 }}>{d.label}</div>
              <div style={{ fontSize: 13, color: COLORS.muted }}>{d.desc}</div>
            </div>
            <span
              style={{
                fontSize: 12,
                padding: '4px 10px',
                borderRadius: 99,
                background: `${d.color}22`,
                color: d.color,
                fontWeight: 700,
              }}
            >
              {d.xp}
            </span>
          </button>
        ))}
      </div>
    );
  }

  const q = questions[qIdx];
  if (!q) return null;
  const optColors = [COLORS.purple, COLORS.cyan, COLORS.yellow, COLORS.pink];

  return (
    <div style={{ animation: 'slideIn 0.4s ease' }}>
      {showXP && <XPPopup key={xpKey} amount={showXP} onDone={() => setShowXP(null)} />}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
        <button
          className="game-btn"
          onClick={onBack}
          style={{
            background: 'rgba(255,255,255,0.07)',
            border: 'none',
            color: COLORS.text,
            borderRadius: 10,
            padding: '8px 14px',
            fontSize: 18,
            cursor: 'pointer',
          }}
        >
          ←
        </button>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 14, fontWeight: 800, color: COLORS.cyan }}>🚀 CODE SPRINT</div>
        </div>
        <div
          style={{
            background: `${COLORS.cyan}22`,
            border: `1px solid ${COLORS.cyan}44`,
            borderRadius: 10,
            padding: '6px 12px',
            fontSize: 13,
            color: COLORS.cyan,
            fontWeight: 700,
          }}
        >
          {score} XP
        </div>
      </div>

      <ProgressDots current={qIdx} total={questions.length} />
      <TimerBar timeLeft={timeLeft} total={20} />

      <div
        style={{
          background: COLORS.surface,
          borderRadius: 20,
          padding: '20px 18px',
          marginBottom: 16,
          border: '1.5px solid rgba(255,255,255,0.07)',
        }}
      >
        <div style={{ textAlign: 'center', fontSize: 32, marginBottom: 10 }}>{q.emoji}</div>
        <p style={{ fontSize: 15, fontWeight: 700, color: COLORS.text, marginBottom: 12 }}>{q.q.split('\n')[0]}</p>
        {q.q.includes('```') && (
          <pre
            style={{
              background: '#0D1117',
              borderRadius: 12,
              padding: '12px 14px',
              fontSize: 13,
              color: '#E2E8F0',
              overflowX: 'auto',
              margin: 0,
              border: '1px solid rgba(255,255,255,0.08)',
              fontFamily: 'monospace',
              lineHeight: 1.6,
            }}
          >
            {q.q.replace(/```[\s\S]*?\n/, '').replace(/```/, '').trim()}
          </pre>
        )}
      </div>

      {phase === 'answered' && (
        <div
          style={{
            marginBottom: 14,
            padding: 14,
            borderRadius: 14,
            background: selected === q.answer ? `${COLORS.green}22` : `${COLORS.red}15`,
            border: `1px solid ${selected === q.answer ? COLORS.green : COLORS.red}55`,
            animation: 'slideIn 0.3s ease',
          }}
        >
          <p
            style={{
              margin: 0,
              fontWeight: 700,
              color: selected === q.answer ? COLORS.green : COLORS.red,
            }}
          >
            {selected === q.answer ? '✅ Correct!' : `❌ Correct answer: ${q.options[q.answer]}`}
          </p>
          <p style={{ margin: '6px 0 0', fontSize: 13, color: COLORS.muted }}>{q.explain}</p>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        {q.options.map((opt, i) => {
          let bg = `${optColors[i]}15`;
          let border = `2px solid ${optColors[i]}44`;
          if (phase === 'answered') {
            if (i === q.answer) {
              bg = `${COLORS.green}25`;
              border = `2px solid ${COLORS.green}`;
            } else if (i === selected) {
              bg = `${COLORS.red}15`;
              border = `2px solid ${COLORS.red}`;
            }
          }
          return (
            <button
              key={i}
              className="opt-btn"
              onClick={() => handleSelect(i)}
              style={{
                background: bg,
                border,
                borderRadius: 14,
                padding: '12px 10px',
                cursor: 'pointer',
                color: COLORS.text,
                fontWeight: 700,
                fontSize: 13,
                fontFamily: 'monospace',
                textAlign: 'center',
              }}
            >
              {opt}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function PitchGame({ onBack, onComplete }: { onBack: () => void; onComplete: (score: number, duration: number) => void }) {
  const [qIdx, setQIdx] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [phase, setPhase] = useState<'question' | 'answered'>('question');
  const [showXP, setShowXP] = useState<number | null>(null);
  const [xpKey, setXpKey] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const [questions] = useState<PitchScenario[]>(() => [...PITCH_SCENARIOS].sort(() => Math.random() - 0.5).slice(0, 8));

  const q = questions[qIdx];

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | null = null;
    if (phase === 'question') {
      timer = setInterval(() => {
        setElapsed((prev) => prev + 1);
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [phase]);

  const handleSelect = (idx: number) => {
    if (phase !== 'question') return;
    setSelected(idx);
    if (idx === q.answer) {
      setScore((s) => s + 12);
      setShowXP(12);
      setXpKey((k) => k + 1);
    }
    setPhase('answered');
  };

  const next = () => {
    if (qIdx + 1 >= questions.length) {
      onComplete(score, elapsed);
    } else {
      setQIdx((i) => i + 1);
      setSelected(null);
      setPhase('question');
    }
  };

  const optColors = [COLORS.purple, COLORS.pink, COLORS.cyan, COLORS.orange];

  return (
    <div style={{ animation: 'slideIn 0.4s ease' }}>
      {showXP && <XPPopup key={xpKey} amount={showXP} onDone={() => setShowXP(null)} />}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
        <button
          className="game-btn"
          onClick={onBack}
          style={{
            background: 'rgba(255,255,255,0.07)',
            border: 'none',
            color: COLORS.text,
            borderRadius: 10,
            padding: '8px 14px',
            fontSize: 18,
            cursor: 'pointer',
          }}
        >
          ←
        </button>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 14, fontWeight: 800, color: COLORS.yellow }}>🎯 PITCH MASTER</div>
        </div>
        <div
          style={{
            background: `${COLORS.yellow}22`,
            border: `1px solid ${COLORS.yellow}44`,
            borderRadius: 10,
            padding: '6px 12px',
            fontSize: 13,
            color: COLORS.yellow,
            fontWeight: 700,
          }}
        >
          {score} XP
        </div>
      </div>

      <ProgressDots current={qIdx} total={questions.length} />

      <div
        style={{
          background: COLORS.surface,
          borderRadius: 20,
          padding: '24px 18px',
          marginBottom: 16,
          border: '1.5px solid rgba(255,255,255,0.07)',
        }}
      >
        <div style={{ textAlign: 'center', fontSize: 44, marginBottom: 12 }}>{q.emoji}</div>
        <p
          style={{
            fontSize: 16,
            fontWeight: 700,
            color: COLORS.text,
            lineHeight: 1.6,
            margin: 0,
            textAlign: 'center',
          }}
        >
          {q.scenario}
        </p>
      </div>

      {phase === 'answered' && (
        <div
          style={{
            marginBottom: 14,
            padding: 16,
            borderRadius: 16,
            background: selected === q.answer ? `${COLORS.green}20` : `${COLORS.red}15`,
            border: `1.5px solid ${selected === q.answer ? COLORS.green : COLORS.red}66`,
            animation: 'bounceIn 0.4s ease',
          }}
        >
          <p
            style={{
              margin: '0 0 6px',
              fontWeight: 800,
              fontSize: 15,
              color: selected === q.answer ? COLORS.green : COLORS.red,
            }}
          >
            {selected === q.answer ? '🎉 Excellent choice!' : '💡 There’s a better way!'}
          </p>
          <p style={{ margin: 0, fontSize: 13, color: COLORS.muted, lineHeight: 1.6 }}>{q.explain}</p>
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 16 }}>
        {q.options.map((opt, i) => {
          let bg = `${optColors[i]}15`;
          let border = `2px solid ${optColors[i]}33`;
          let extra = {} as Record<string, string>;
          if (phase === 'answered') {
            if (i === q.answer) {
              bg = `${COLORS.green}25`;
              border = `2px solid ${COLORS.green}`;
              extra = { animation: 'bounceIn 0.4s ease' };
            } else if (i === selected) {
              bg = `${COLORS.red}12`;
              border = `2px solid ${COLORS.red}88`;
              extra = { animation: 'shake 0.4s ease' };
            }
          }
          return (
            <button
              key={i}
              className="opt-btn"
              onClick={() => handleSelect(i)}
              style={{
                background: bg,
                border,
                borderRadius: 14,
                padding: '14px 16px',
                cursor: 'pointer',
                color: COLORS.text,
                fontWeight: 600,
                fontSize: 14,
                textAlign: 'left',
                display: 'flex',
                alignItems: 'flex-start',
                gap: 10,
                ...extra,
              }}
            >
              <span
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: 8,
                  background: `${optColors[i]}30`,
                  color: optColors[i],
                  fontWeight: 900,
                  fontSize: 12,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  marginTop: 1,
                }}
              >
                {String.fromCharCode(65 + i)}
              </span>
              {opt}
            </button>
          );
        })}
      </div>

      {phase === 'answered' && (
        <button
          className="game-btn"
          onClick={next}
          style={{
            width: '100%',
            padding: '16px',
            background: `linear-gradient(135deg, ${COLORS.yellow}, ${COLORS.orange})`,
            border: 'none',
            borderRadius: 16,
            fontWeight: 900,
            fontSize: 16,
            cursor: 'pointer',
            color: '#1A1008',
            animation: 'slideIn 0.3s ease',
          }}
        >
          {qIdx + 1 >= questions.length ? '🏁 See My Results!' : 'Next Scenario →'}
        </button>
      )}
    </div>
  );
}

export default function VarahaArena({ onFinish }: VarahaArenaProps) {
  const [screen, setScreen] = useState<'home' | 'word' | 'code' | 'pitch' | 'result'>('home');
  const [finalScore, setFinalScore] = useState(0);
  const [finalDuration, setFinalDuration] = useState(0);

  const handleComplete = (score: number, duration: number) => {
    setFinalScore(score);
    setFinalDuration(duration);
    setScreen('result');
  };

  const handlePlay = (id: 'word' | 'code' | 'pitch') => {
    setScreen(id);
  };

  const handleFinish = () => {
    onFinish(finalScore, finalDuration);
  };

  return (
    <div style={{ minHeight: '100vh', background: COLORS.bg, color: COLORS.text, position: 'relative' }}>
      <Particles />
      <div style={{ maxWidth: 560, margin: '0 auto', padding: '16px 16px 40px', position: 'relative', zIndex: 1 }}>
        {screen === 'home' && (
          <HomeScreen onSelect={handlePlay} totalXP={0} gamesPlayed={0} />
        )}

        {screen === 'word' && <WordGame onBack={() => setScreen('home')} onComplete={handleComplete} />}
        {screen === 'code' && <CodeGame onBack={() => setScreen('home')} onComplete={handleComplete} />}
        {screen === 'pitch' && <PitchGame onBack={() => setScreen('home')} onComplete={handleComplete} />}

        {screen === 'result' && (
          <div style={{ animation: 'bounceIn 0.5s ease', textAlign: 'center' }}>
            <div
              style={{
                background: COLORS.surface,
                borderRadius: 24,
                padding: '32px 24px',
                marginBottom: 20,
                border: '1.5px solid rgba(255,255,255,0.07)',
              }}
            >
              <div style={{ fontSize: 64, marginBottom: 8 }}>🌟🌟🌟</div>
              <h2 style={{ fontSize: 26, fontWeight: 900, margin: '0 0 6px', color: COLORS.yellow }}>
                Challenge Completed!
              </h2>
              <div style={{ fontSize: 48, fontWeight: 900, color: COLORS.yellow, margin: '16px 0 4px' }}>
                {finalScore} XP
              </div>
              <p style={{ color: COLORS.muted, fontSize: 14, margin: 0 }}>earned this round</p>

              <div style={{ marginTop: 20, background: 'rgba(255,255,255,0.05)', borderRadius: 16, padding: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: 13 }}>
                  <span style={{ color: COLORS.muted }}>Duration</span>
                  <span style={{ fontWeight: 700, color: COLORS.yellow }}>{finalDuration}s</span>
                </div>
                <div style={{ background: 'rgba(255,255,255,0.08)', borderRadius: 99, height: 10, overflow: 'hidden' }}>
                  <div
                    style={{
                      width: `${Math.min((finalScore / 300) * 100, 100)}%`,
                      height: '100%',
                      borderRadius: 99,
                      background: `linear-gradient(90deg, ${COLORS.purple}, ${COLORS.yellow})`,
                      boxShadow: `0 0 12px ${COLORS.yellow}88`,
                    }}
                  />
                </div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 20 }}>
              <button
                className="game-btn"
                onClick={() => setScreen('home')}
                style={{
                  padding: '16px',
                  background: `linear-gradient(135deg, ${COLORS.purple}, ${COLORS.pink})`,
                  border: 'none',
                  borderRadius: 16,
                  color: '#fff',
                  fontWeight: 800,
                  fontSize: 15,
                  cursor: 'pointer',
                }}
              >
                🔄 Play Again
              </button>
              <button
                className="game-btn"
                onClick={handleFinish}
                style={{
                  padding: '16px',
                  background: COLORS.surface,
                  border: '1.5px solid rgba(255,255,255,0.1)',
                  borderRadius: 16,
                  color: COLORS.text,
                  fontWeight: 800,
                  fontSize: 15,
                  cursor: 'pointer',
                }}
              >
                🏠 Submit & Return
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

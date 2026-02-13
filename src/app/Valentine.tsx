"use client";

import { useState, useEffect, useRef, useCallback } from "react";

// ─── Floating Hearts Background ────────────────────────────────────
function FloatingHearts() {
  const [hearts, setHearts] = useState<
    { id: number; left: number; size: number; delay: number; duration: number; emoji: string }[]
  >([]);

  useEffect(() => {
    const emojis = ["💕", "💗", "💖", "💝", "❤️", "🩷", "💘", "✨", "🌸"];
    const generated = Array.from({ length: 25 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      size: 16 + Math.random() * 28,
      delay: Math.random() * 8,
      duration: 6 + Math.random() * 10,
      emoji: emojis[Math.floor(Math.random() * emojis.length)],
    }));
    setHearts(generated);
  }, []);

  return (
    <>
      {hearts.map((h) => (
        <span
          key={h.id}
          className="floating-heart"
          style={{
            left: `${h.left}%`,
            fontSize: `${h.size}px`,
            animationDelay: `${h.delay}s`,
            animationDuration: `${h.duration}s`,
          }}
        >
          {h.emoji}
        </span>
      ))}
    </>
  );
}

// ─── Confetti Effect ───────────────────────────────────────────────
function Confetti() {
  const [pieces, setPieces] = useState<
    { id: number; left: number; color: string; delay: number; duration: number; size: number }[]
  >([]);

  useEffect(() => {
    const colors = [
      "#ff6b9d", "#ff3366", "#ffb3d0", "#ff85b3", "#ffd700",
      "#ff69b4", "#ff1493", "#ff4081", "#e91e63", "#f48fb1",
    ];
    const generated = Array.from({ length: 80 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      color: colors[Math.floor(Math.random() * colors.length)],
      delay: Math.random() * 3,
      duration: 2 + Math.random() * 3,
      size: 6 + Math.random() * 10,
    }));
    setPieces(generated);
  }, []);

  return (
    <>
      {pieces.map((p) => (
        <div
          key={p.id}
          className="confetti"
          style={{
            left: `${p.left}%`,
            backgroundColor: p.color,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
            width: `${p.size}px`,
            height: `${p.size}px`,
            borderRadius: Math.random() > 0.5 ? "50%" : "2px",
          }}
        />
      ))}
    </>
  );
}

// ─── Sparkle Stars ─────────────────────────────────────────────────
function Sparkles() {
  const [sparkles, setSparkles] = useState<
    { id: number; left: number; top: number; delay: number; size: number }[]
  >([]);

  useEffect(() => {
    const generated = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      top: Math.random() * 100,
      delay: Math.random() * 3,
      size: 12 + Math.random() * 20,
    }));
    setSparkles(generated);
  }, []);

  return (
    <>
      {sparkles.map((s) => (
        <span
          key={s.id}
          className="sparkle-star"
          style={{
            left: `${s.left}%`,
            top: `${s.top}%`,
            animationDelay: `${s.delay}s`,
            fontSize: `${s.size}px`,
          }}
        >
          ✨
        </span>
      ))}
    </>
  );
}

// ─── Runaway No Button ─────────────────────────────────────────────
function NoButton({ onGiveUp }: { onGiveUp: () => void }) {
  const btnRef = useRef<HTMLButtonElement>(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [initialized, setInitialized] = useState(false);
  const [dodgeCount, setDodgeCount] = useState(0);
  const [shrinking, setShrinking] = useState(false);
  const dodgeMessages = [
    "No",
    "Are you sure?",
    "Really? 🥺",
    "Think again!",
    "Pretty please?",
    "Don't be shy 💕",
    "Wrong button!",
    "Nope! Try again",
    "Almost got me!",
    "Haha nice try!",
    "You can't! 😜",
    "Just say yes!",
  ];

  useEffect(() => {
    // Start next to the yes button area
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    setPos({ x: vw / 2 + 80, y: vh / 2 + 100 });
    setInitialized(true);
  }, []);

  const runAway = useCallback(() => {
    if (!btnRef.current) return;

    const btn = btnRef.current;
    const rect = btn.getBoundingClientRect();
    const vw = window.innerWidth;
    const vh = window.innerHeight;

    // Generate a random position far from cursor
    const margin = 20;
    const btnW = rect.width;
    const btnH = rect.height;

    let newX: number, newY: number;
    let attempts = 0;
    do {
      newX = margin + Math.random() * (vw - btnW - margin * 2);
      newY = margin + Math.random() * (vh - btnH - margin * 2);
      attempts++;
    } while (
      attempts < 50 &&
      Math.abs(newX - rect.left) < 150 &&
      Math.abs(newY - rect.top) < 150
    );

    setPos({ x: newX, y: newY });
    setDodgeCount((c) => c + 1);
    setShrinking(true);
    setTimeout(() => setShrinking(false), 300);
  }, []);

  // After many dodges, the button gets tinier and eventually "gives up"
  useEffect(() => {
    if (dodgeCount >= 15) {
      onGiveUp();
    }
  }, [dodgeCount, onGiveUp]);

  const currentLabel = dodgeMessages[Math.min(dodgeCount, dodgeMessages.length - 1)];
  const scale = Math.max(0.4, 1 - dodgeCount * 0.04);

  if (!initialized) return null;

  return (
    <button
      ref={btnRef}
      className="no-btn"
      style={{
        left: `${pos.x}px`,
        top: `${pos.y}px`,
        transform: `scale(${shrinking ? scale * 0.8 : scale})`,
        opacity: Math.max(0.3, 1 - dodgeCount * 0.05),
      }}
      onMouseEnter={runAway}
      onTouchStart={(e) => {
        e.preventDefault();
        runAway();
      }}
      onClick={runAway}
    >
      {currentLabel}
    </button>
  );
}

// ─── Main Valentine Component ──────────────────────────────────────
export default function Valentine() {
  const [accepted, setAccepted] = useState(false);
  const [noGaveUp, setNoGaveUp] = useState(false);
  const [yesSize, setYesSize] = useState(1);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // The Yes button grows when the No button is dodged
  const handleNoGiveUp = useCallback(() => {
    setNoGaveUp(true);
  }, []);

  // Yes button grows over time to be more inviting
  useEffect(() => {
    if (noGaveUp) {
      setYesSize(1.3);
    }
  }, [noGaveUp]);

  const handleYes = () => {
    setAccepted(true);
  };

  if (!mounted) return null;

  // ─── Celebration Screen ────────────────────────────────────────
  if (accepted) {
    return (
      <div className="celebration-overlay">
        <Confetti />
        <Sparkles />
        <div className="bounce-in" style={{ textAlign: "center" }}>
          <div
            style={{ fontSize: "clamp(80px, 15vw, 160px)", lineHeight: 1 }}
            className="main-heart"
          >
            💖
          </div>
          <h1
            className="shimmer-text"
            style={{
              fontSize: "clamp(2rem, 6vw, 4.5rem)",
              fontWeight: 800,
              marginTop: "16px",
              lineHeight: 1.2,
            }}
          >
            Yaaay!!!
          </h1>
          <p
            style={{
              fontSize: "clamp(1.2rem, 3vw, 2rem)",
              marginTop: "16px",
              color: "#ffb3d0",
              fontWeight: 500,
            }}
          >
            I knew you&apos;d say yes! 🥰
          </p>
          <p
            style={{
              fontSize: "clamp(1rem, 2.5vw, 1.5rem)",
              marginTop: "12px",
              color: "#ff85b3",
              fontWeight: 400,
            }}
          >
            You just made me the happiest person ever! 💕
          </p>
          <div
            style={{
              marginTop: "32px",
              fontSize: "clamp(2rem, 5vw, 3.5rem)",
              display: "flex",
              gap: "8px",
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            {["🥰", "💘", "💝", "💖", "💗", "💕", "❤️‍🔥"].map((e, i) => (
              <span
                key={i}
                className="bounce-in"
                style={{ animationDelay: `${0.1 * i}s`, display: "inline-block" }}
              >
                {e}
              </span>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ─── Question Screen ───────────────────────────────────────────
  return (
    <div
      style={{
        minHeight: "100dvh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        padding: "20px",
        background:
          "radial-gradient(ellipse at 50% 30%, rgba(120, 0, 50, 0.4), transparent 70%), radial-gradient(ellipse at 80% 80%, rgba(80, 0, 40, 0.3), transparent 50%), #1a0011",
      }}
    >
      <FloatingHearts />

      {/* Main content */}
      <div
        className="bounce-in"
        style={{
          textAlign: "center",
          zIndex: 10,
          position: "relative",
        }}
      >
        {/* Big heart */}
        <div
          className="main-heart"
          style={{
            fontSize: "clamp(70px, 12vw, 120px)",
            lineHeight: 1,
            marginBottom: "8px",
          }}
        >
          💝
        </div>

        {/* Question */}
        <h1
          className="shimmer-text"
          style={{
            fontSize: "clamp(1.8rem, 5.5vw, 4rem)",
            fontWeight: 800,
            lineHeight: 1.2,
            marginBottom: "8px",
          }}
        >
          Will You Be My
        </h1>
        <h1
          className="shimmer-text"
          style={{
            fontSize: "clamp(2.2rem, 7vw, 5rem)",
            fontWeight: 900,
            lineHeight: 1.1,
            marginBottom: "24px",
          }}
        >
          Valentine?
        </h1>

        {/* Cute subtitle */}
        <p
          style={{
            color: "#ff85b3",
            fontSize: "clamp(1rem, 2.5vw, 1.4rem)",
            marginBottom: "40px",
            fontWeight: 400,
            opacity: 0.9,
          }}
        >
          {noGaveUp
            ? "See? There was only ever one answer 😏💕"
            : "I've been meaning to ask you something... 🥺"}
        </p>

        {/* Yes button */}
        <button
          className="yes-btn"
          style={{
            transform: `scale(${yesSize})`,
            transition: "transform 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55)",
          }}
          onClick={handleYes}
        >
          Yes! 💖
        </button>
      </div>

      {/* Runaway No button */}
      {!noGaveUp && <NoButton onGiveUp={handleNoGiveUp} />}
    </div>
  );
}
 
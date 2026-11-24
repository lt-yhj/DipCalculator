import { useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';

// 1 증감 버튼. 길게 누르면 반복한다.
function HoldButton({ d, children, label }) {
  const { step } = useApp();
  const timers = useRef({ t1: null, t2: null });

  const stop = () => {
    clearTimeout(timers.current.t1);
    clearInterval(timers.current.t2);
    timers.current = { t1: null, t2: null };
  };
  useEffect(() => {
    const t = timers;
    return () => { clearTimeout(t.current.t1); clearInterval(t.current.t2); };
  }, []);

  const onPointerDown = (e) => {
    e.preventDefault();
    stop();
    if (!step(d)) return;
    timers.current.t1 = setTimeout(() => {
      timers.current.t2 = setInterval(() => { if (!step(d)) stop(); }, 80);
    }, 420);
  };

  return (
    <button
      aria-label={label}
      onPointerDown={onPointerDown}
      onPointerUp={stop}
      onPointerLeave={stop}
      onPointerCancel={stop}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); step(d); } }}
      onContextMenu={(e) => e.preventDefault()}
    >
      {children}
    </button>
  );
}

export default function StepButtons() {
  return (
    <section className="arrows">
      <HoldButton d={-1} label="1 감소">
        <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 18 4 7h16z" /></svg>1 감소
      </HoldButton>
      <HoldButton d={1} label="1 증가">
        <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 6l8 11H4z" /></svg>1 증가
      </HoldButton>
    </section>
  );
}

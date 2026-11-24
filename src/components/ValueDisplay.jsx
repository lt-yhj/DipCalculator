import { useEffect, useRef } from 'react';
import { useApp, BASES, BASE_NAMES, formatValue, bitAt, bitPos } from '../context/AppContext';

function ValueCell({ b, kind, cellRef }) {
  const { value, base, buf, bits, setBase } = useApp();
  const active = b === base;
  const typing = active && buf !== null;
  const big = kind !== 'mini';
  const label = BASE_NAMES[b] + (active ? ' 입력' : kind === 'res' ? ' 결과' : '');
  const txt = typing ? (buf || '0') : formatValue(value, b, bits);
  const cls = ['val', `b${b}`, big && 'big', kind === 'res' && 'res', active && 'active']
    .filter(Boolean).join(' ');

  return (
    <div
      ref={cellRef}
      className={cls}
      tabIndex={0}
      role="button"
      onClick={() => setBase(b)}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setBase(b); } }}
    >
      <div className="k">{label}</div>
      <div className="v">{txt}</div>
    </div>
  );
}

export default function ValueDisplay() {
  const { value, base, bits, msb, hint } = useApp();
  const activeRef = useRef(null);

  // 입력이 막히면 입력 칸을 흔든다
  useEffect(() => {
    const el = activeRef.current;
    if (!hint.n || !el) return;
    el.classList.remove('shake');
    void el.offsetWidth;
    el.classList.add('shake');
  }, [hint.n]);

  // 큰 칸 2개: 입력 진법 + 결과(입력이 2진수면 10진수, 아니면 2진수). 나머지는 작은 칸.
  const resB = base === 2 ? 10 : 2;
  const minis = BASES.filter((b) => b !== base && b !== resB);

  const on = [];
  let order = '';
  for (let i = 0; i < bits; i++) {
    const bit = bitAt(value, bitPos(i, bits, msb));
    if (bit) on.push(i + 1);
    order += bit + ((i + 1) % 4 === 0 && i + 1 < bits ? ' ' : '');
  }

  return (
    <>
      <section className="values">
        <ValueCell b={base} kind="input" cellRef={activeRef} />
        <ValueCell b={resB} kind="res" />
        <div className="mini">
          {minis.map((b) => <ValueCell key={b} b={b} kind="mini" />)}
        </div>
        <div className="onlist">
          {on.length ? <>ON 스위치 <b>{on.join(', ')}</b></> : <>ON 스위치 <b>없음</b> (모두 OFF)</>}
          <br />스위치 1→{bits} 순서로 읽으면 <b>{order}</b>
        </div>
      </section>
      <div className="hint" aria-live="polite">{hint.msg}</div>
    </>
  );
}

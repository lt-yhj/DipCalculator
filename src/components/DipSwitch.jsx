import { useRef } from 'react';
import { useApp, bitAt, bitPos } from '../context/AppContext';

// i번째 스위치. 탭하면 토글, 위/아래로 밀면 그 방향으로 설정.
export default function DipSwitch({ index }) {
  const { value, bits, msb, upOn, setSwitch } = useApp();
  const y0 = useRef(null);

  const bit = bitAt(value, bitPos(index, bits, msb));
  const up = upOn ? bit === 1 : bit === 0;

  const onPointerDown = (e) => {
    y0.current = e.clientY;
    try { e.currentTarget.setPointerCapture(e.pointerId); } catch { /* 일부 브라우저 미지원 */ }
  };
  const onPointerUp = (e) => {
    if (y0.current === null) return;
    const dy = e.clientY - y0.current;
    y0.current = null;
    setSwitch(index, dy < -10 ? true : dy > 10 ? false : !up);
  };
  const onKeyDown = (e) => {
    if (e.key === 'ArrowUp') { e.preventDefault(); setSwitch(index, true); }
    else if (e.key === 'ArrowDown') { e.preventDefault(); setSwitch(index, false); }
    else if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setSwitch(index, !up); }
  };

  return (
    <div className="col">
      <div
        className={`sw${up ? ' up' : ''}`}
        tabIndex={0}
        role="switch"
        aria-checked={!!bit}
        aria-label={`스위치 ${index + 1}`}
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
        onPointerCancel={() => { y0.current = null; }}
        onKeyDown={onKeyDown}
      >
        <span className="knob" />
        <span className="lt">{upOn ? '1' : '0'}</span>
        <span className="lb">{upOn ? '0' : '1'}</span>
      </div>
      <div className={`num${bit ? ' on' : ''}`}>{index + 1}</div>
    </div>
  );
}

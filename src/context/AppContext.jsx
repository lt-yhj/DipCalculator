/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useRef, useEffect, useCallback, useMemo } from 'react';

const AppContext = createContext(null);

const STORAGE_KEY = 'dipaddr.v1';
export const BASES = [2, 8, 10, 16];
export const BASE_NAMES = { 2: '2진수', 8: '8진수', 10: '10진수', 16: '16진수' };
export const BIT_OPTIONS = [2, 4, 8];

const clampBits = (n) => (BIT_OPTIONS.includes(Number(n)) ? Number(n) : 8);
export const maxOf = (bits) => 2 ** bits - 1;
export const bitAt = (v, pos) => Math.floor(v / 2 ** pos) % 2;
// i번째 스위치(0부터)가 가리키는 비트 위치
export const bitPos = (i, bits, msb) => (msb ? bits - 1 - i : i);

export function formatValue(v, base, bits) {
  let s = v.toString(base).toUpperCase();
  if (base === 2) s = s.padStart(bits, '0').replace(/\B(?=(\d{4})+$)/g, ' ');
  return s;
}

function loadState() {
  const st = { value: 0, bits: 8, msb: false, base: 10, upOn: true, theme: 'dark', edge: 'clamp' };
  try {
    const s = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null');
    if (s && typeof s === 'object') Object.assign(st, s);
  } catch { /* 저장값이 없거나 깨졌으면 기본값 사용 */ }
  st.bits = clampBits(st.bits);
  st.value = Math.min(maxOf(st.bits), Math.max(0, Math.floor(Number(st.value)) || 0));
  st.msb = !!st.msb;
  st.upOn = st.upOn !== false;
  st.theme = st.theme === 'light' ? 'light' : 'dark';
  st.edge = st.edge === 'wrap' ? 'wrap' : 'clamp';
  st.base = 10; // 앱 실행 시 항상 10진수 입력으로 시작 (저장된 진법은 무시)
  st.buf = null; // 키패드로 입력 중인 문자열 (null이면 값에서 생성)
  return st;
}

export function AppProvider({ children }) {
  const [st, setSt] = useState(loadState);
  // 길게 누르기 반복처럼 연속 호출되는 동작이 항상 최신 상태를 읽도록 ref에 동기 반영
  const stRef = useRef(st);
  const update = useCallback((patch) => {
    stRef.current = { ...stRef.current, ...patch };
    setSt(stRef.current);
  }, []);

  const [hint, setHintState] = useState({ msg: '', n: 0 });
  const hintTimer = useRef(null);
  const showHint = useCallback((msg) => {
    clearTimeout(hintTimer.current);
    setHintState((h) => ({ msg, n: h.n + 1 }));
    hintTimer.current = setTimeout(() => setHintState((h) => ({ ...h, msg: '' })), 1800);
  }, []);
  const clearHint = useCallback(() => {
    clearTimeout(hintTimer.current);
    setHintState((h) => (h.msg ? { ...h, msg: '' } : h));
  }, []);
  useEffect(() => () => clearTimeout(hintTimer.current), []);

  useEffect(() => {
    const { buf: _buf, ...rest } = st;
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(rest)); } catch { /* 저장 불가 환경 무시 */ }
  }, [st]);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', st.theme);
  }, [st.theme]);

  const setValue = useCallback((value) => {
    update({ value, buf: null });
    clearHint();
  }, [update, clearHint]);

  const setSwitch = useCallback((i, up) => {
    const { value, bits, msb, upOn } = stRef.current;
    const pos = bitPos(i, bits, msb);
    const want = up === upOn ? 1 : 0;
    const cur = bitAt(value, pos);
    setValue(cur === want ? value : value + (want ? 1 : -1) * 2 ** pos);
  }, [setValue]);

  const press = useCallback((k) => {
    const { value, base, buf, bits } = stRef.current;
    if (k === 'RESET') { setValue(0); return; }
    if (k === 'DEL') {
      const cur = buf !== null ? buf : value.toString(base).toUpperCase();
      const s = cur.slice(0, -1);
      update({ buf: s, value: s ? parseInt(s, base) : 0 });
      clearHint();
      return;
    }
    if (parseInt(k, 16) >= base) return;
    let s = buf === null ? '' : buf; // 스위치/증감 후 첫 입력은 새로 시작
    if (s === '0') s = '';
    const next = s + k;
    const v = parseInt(next, base);
    const max = maxOf(bits);
    if (v > max) { showHint(`최대 ${max} (${bits}비트)까지 입력할 수 있습니다`); return; }
    update({ buf: next, value: v });
    clearHint();
  }, [update, setValue, showHint, clearHint]);

  // 1 증감. 더 이상 움직일 수 없으면 false를 돌려줘 반복을 멈춘다.
  const step = useCallback((d) => {
    const { value, bits, edge } = stRef.current;
    const max = maxOf(bits);
    let v = value + d;
    if (v > max) v = edge === 'wrap' ? 0 : max;
    if (v < 0) v = edge === 'wrap' ? max : 0;
    if (v === value) { showHint(d > 0 ? `최댓값 ${max}입니다` : '최솟값 0입니다'); return false; }
    setValue(v);
    return true;
  }, [setValue, showHint]);

  const setBase = useCallback((base) => update({ base, buf: null }), [update]);

  const setBits = useCallback((n) => {
    const bits = clampBits(n);
    // 개수를 줄이면 남는 하위 비트만 유지
    update({ bits, value: stRef.current.value % 2 ** bits, buf: null });
    clearHint();
  }, [update, clearHint]);

  const setOption = useCallback((key, val) => update({ [key]: val }), [update]);

  const value = useMemo(() => ({
    ...st, hint, setValue, setSwitch, press, step, setBase, setBits, setOption,
  }), [st, hint, setValue, setSwitch, press, step, setBase, setBits, setOption]);

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export const useApp = () => useContext(AppContext);

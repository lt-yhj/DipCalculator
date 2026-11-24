import { useApp, BASES, BASE_NAMES, BIT_OPTIONS, maxOf } from '../context/AppContext';

function Seg({ options, current, onPick }) {
  return (
    <div className="seg" role="radiogroup">
      {options.map(([val, label]) => (
        <button key={String(val)} role="radio" aria-checked={val === current} onClick={() => onPick(val)}>
          {label}
        </button>
      ))}
    </div>
  );
}

export default function SettingsPage() {
  const { base, bits, msb, upOn, edge, theme, setBase, setBits, setOption } = useApp();

  return (
    <main className="view">
      <div className="group">
        <h2>입력 진법</h2>
        <p>키패드로 입력할 진법입니다. 홈 화면의 값 칸을 눌러도 바뀝니다.</p>
        <Seg options={BASES.map((b) => [b, BASE_NAMES[b]])} current={base} onPick={setBase} />
      </div>
      <div className="group">
        <h2>딥스위치 개수</h2>
        <p>스위치 {bits}개 · 0 ~ {maxOf(bits)}까지 표현합니다. 개수를 줄이면 남는 하위 비트만 유지됩니다.</p>
        <Seg options={BIT_OPTIONS.map((n) => [n, `${n}개`])} current={bits} onPick={setBits} />
      </div>
      <div className="group">
        <h2>비트 순서</h2>
        <p>1번 스위치를 최하위 비트(LSB)로 볼지 최상위 비트(MSB)로 볼지 정합니다. 바꿔도 값은 그대로이고 스위치 배치가 바뀝니다.</p>
        <Seg options={[[false, '1번 = LSB'], [true, '1번 = MSB']]} current={msb} onPick={(v) => setOption('msb', v)} />
      </div>
      <div className="group">
        <h2>ON 방향</h2>
        <p>스위치를 어느 쪽으로 밀었을 때 1(ON)로 볼지 정합니다. 실제 장비의 DIP 스위치 표기와 맞추세요.</p>
        <Seg options={[[true, '위로 = ON'], [false, '아래로 = ON']]} current={upOn} onPick={(v) => setOption('upOn', v)} />
      </div>
      <div className="group">
        <h2>증감 버튼 끝에서</h2>
        <p>최댓값에서 1 증가, 0에서 1 감소를 눌렀을 때의 동작입니다.</p>
        <Seg options={[['clamp', '멈춤'], ['wrap', '넘어가기']]} current={edge} onPick={(v) => setOption('edge', v)} />
      </div>
      <div className="group">
        <h2>화면</h2>
        <Seg options={[['dark', '다크'], ['light', '화이트']]} current={theme} onPick={(v) => setOption('theme', v)} />
      </div>
    </main>
  );
}

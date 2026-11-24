import { useApp } from '../context/AppContext';
import DipSwitch from '../components/DipSwitch';
import ValueDisplay from '../components/ValueDisplay';
import StepButtons from '../components/StepButtons';
import Keypad from '../components/Keypad';

export default function HomePage() {
  const { bits, msb, upOn } = useApp();

  return (
    <main className="view home">
      <section className="bankwrap">
        <div className="onmark">
          ON 방향 <b>{upOn ? '▲ 위' : '▼ 아래'}</b>
          <span className="sep">·</span>
          1번 = <b>{msb ? 'MSB' : 'LSB'}</b>
        </div>
        {/* 개수와 상관없이 8개일 때와 같은 폭으로 가운데 정렬 */}
        <div className="bank" style={{ gridTemplateColumns: `repeat(${bits}, calc((100% - 56px) / 8))` }}>
          {Array.from({ length: bits }, (_, i) => <DipSwitch key={i} index={i} />)}
        </div>
      </section>
      <ValueDisplay />
      <StepButtons />
      <Keypad />
    </main>
  );
}

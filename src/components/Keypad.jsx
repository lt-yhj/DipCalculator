import { useApp } from '../context/AppContext';

const LAYOUT = ['D', 'E', 'F', 'A', 'B', 'C', '7', '8', '9', '4', '5', '6', '1', '2', '3', 'RESET', '0', 'DEL'];

export default function Keypad() {
  const { base, press } = useApp();

  return (
    <section className="pad">
      {LAYOUT.map((k) => {
        const fn = k === 'RESET' || k === 'DEL';
        return (
          <button
            key={k}
            className={`key${fn ? ' fn' : ''}${k === 'DEL' ? ' del' : ''}`}
            disabled={!fn && parseInt(k, 16) >= base}
            onClick={() => press(k)}
          >
            {k}
          </button>
        );
      })}
    </section>
  );
}

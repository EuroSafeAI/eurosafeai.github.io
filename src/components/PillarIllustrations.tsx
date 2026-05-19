const ACCENT = "#003399";

export const PillarNetwork = () => {
  const agents = [
    { x: 18, y: 50 },
    { x: 75, y: 18 },
    { x: 132, y: 50 },
    { x: 75, y: 100 },
  ];
  const w = 42;
  const h = 40;
  return (
    <svg viewBox="0 0 190 160" width="100%" height="100%" role="img" aria-hidden="true">
      <defs>
        <marker id="pillarArrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto">
          <path d="M0,0 L10,5 L0,10 z" fill={ACCENT} opacity="0.7" />
        </marker>
      </defs>
      {[
        { from: 0, to: 1 },
        { from: 1, to: 2 },
        { from: 2, to: 3 },
        { from: 3, to: 0 },
        { from: 0, to: 2 },
      ].map((e, i) => {
        const a = agents[e.from];
        const b = agents[e.to];
        const x1 = a.x + w / 2;
        const y1 = a.y + h / 2;
        const x2 = b.x + w / 2;
        const y2 = b.y + h / 2;
        const len = Math.hypot(x2 - x1, y2 - y1);
        const trim = 24;
        const tx1 = x1 + ((x2 - x1) * trim) / len;
        const ty1 = y1 + ((y2 - y1) * trim) / len;
        const tx2 = x2 - ((x2 - x1) * trim) / len;
        const ty2 = y2 - ((y2 - y1) * trim) / len;
        return (
          <line
            key={i}
            x1={tx1}
            y1={ty1}
            x2={tx2}
            y2={ty2}
            stroke={ACCENT}
            strokeOpacity="0.45"
            strokeWidth="1.2"
            markerEnd="url(#pillarArrow)"
          />
        );
      })}
      {agents.map((a, i) => (
        <g key={i}>
          <rect
            x={a.x}
            y={a.y}
            width={w}
            height={h}
            rx="8"
            fill={i === 0 ? ACCENT : "#fff"}
            fillOpacity={i === 0 ? 0.15 : 1}
            stroke={ACCENT}
            strokeWidth="1.4"
          />
          <circle cx={a.x + w / 2} cy={a.y + 14} r="4.5" fill={ACCENT} opacity="0.85" />
          <line x1={a.x + 10} y1={a.y + 26} x2={a.x + w - 10} y2={a.y + 26} stroke={ACCENT} strokeOpacity="0.55" strokeWidth="1.2" />
          <line x1={a.x + 10} y1={a.y + 32} x2={a.x + w - 14} y2={a.y + 32} stroke={ACCENT} strokeOpacity="0.35" strokeWidth="1.2" />
        </g>
      ))}
    </svg>
  );
};

export const PillarBallot = () => (
  <svg viewBox="0 0 190 160" width="100%" height="100%" role="img" aria-hidden="true">
    <rect x="48" y="72" width="94" height="62" rx="3" fill="none" stroke={ACCENT} strokeWidth="1.5" />
    <rect x="68" y="63" width="54" height="12" rx="2" fill={ACCENT} opacity="0.2" stroke={ACCENT} strokeWidth="1.2" />
    <g>
      <rect x="70" y="28" width="50" height="38" rx="2" fill="#fff" stroke={ACCENT} strokeWidth="1.4" />
      <path d="M80 49 L90 58 L110 36" stroke={ACCENT} strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </g>
    <line x1="60" y1="104" x2="130" y2="104" stroke={ACCENT} strokeOpacity="0.3" strokeWidth="1" />
    <line x1="60" y1="116" x2="118" y2="116" stroke={ACCENT} strokeOpacity="0.3" strokeWidth="1" />
  </svg>
);

export const PillarLLM = () => {
  const cols = 7;
  const tokenW = 14;
  const tokenGap = 4;
  const totalW = cols * tokenW + (cols - 1) * tokenGap;
  const startX = (190 - totalW) / 2;
  const layers = [
    { y: 118, label: "Embedding" },
    { y: 96, label: "Attention" },
    { y: 74, label: "Feed-Forward" },
    { y: 52, label: "Attention" },
  ];
  return (
    <svg viewBox="0 0 190 160" width="100%" height="100%" role="img" aria-hidden="true">
      {Array.from({ length: cols }).map((_, i) => (
        <rect
          key={`t-${i}`}
          x={startX + i * (tokenW + tokenGap)}
          y={142}
          width={tokenW}
          height={8}
          rx={1.5}
          fill={ACCENT}
          opacity="0.55"
        />
      ))}
      {layers.map((l, li) => (
        <g key={`l-${li}`}>
          <rect
            x={startX - 4}
            y={l.y}
            width={totalW + 8}
            height={14}
            rx={2}
            fill={ACCENT}
            opacity={0.14 + li * 0.05}
            stroke={ACCENT}
            strokeOpacity="0.5"
            strokeWidth="0.8"
          />
          {Array.from({ length: cols }).map((_, i) => {
            const x = startX + i * (tokenW + tokenGap) + tokenW / 2;
            const yTop = l.y + 14;
            const yBot = li === 0 ? 142 : layers[li - 1].y;
            return (
              <line
                key={`c-${li}-${i}`}
                x1={x}
                y1={yTop}
                x2={x}
                y2={yBot}
                stroke={ACCENT}
                strokeOpacity="0.22"
                strokeWidth="0.8"
              />
            );
          })}
        </g>
      ))}
      {[
        { from: 0, to: 3 },
        { from: 2, to: 5 },
        { from: 1, to: 4 },
      ].map((arc, i) => {
        const x1 = startX + arc.from * (tokenW + tokenGap) + tokenW / 2;
        const x2 = startX + arc.to * (tokenW + tokenGap) + tokenW / 2;
        const mx = (x1 + x2) / 2;
        const depth = 12 + (arc.to - arc.from) * 2;
        return (
          <path
            key={`a-${i}`}
            d={`M ${x1} 52 Q ${mx} ${52 - depth} ${x2} 52`}
            fill="none"
            stroke={ACCENT}
            strokeOpacity="0.55"
            strokeWidth="1"
          />
        );
      })}
      <circle cx="95" cy="26" r="6" fill={ACCENT} opacity="0.9" />
      <line x1="95" y1="32" x2="95" y2="44" stroke={ACCENT} strokeOpacity="0.5" strokeWidth="1" />
    </svg>
  );
};

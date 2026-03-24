export const StarSticker = ({ top, left, right, bottom, color, size = 40, rotation = 0 }: any) => (
  <svg width={size} height={size} viewBox="0 0 100 100" style={{ position: 'absolute', top, left, right, bottom, transform: `rotate(${rotation}deg)`, zIndex: 5, filter: 'drop-shadow(3px 3px 0px var(--text-primary))' }}>
    <polygon points="50,5 65,35 95,40 75,65 80,95 50,80 20,95 25,65 5,40 35,35" fill={color} stroke="var(--text-primary)" strokeWidth="4" strokeLinejoin="round" />
  </svg>
);

export const PeaceSticker = ({ top, left, right, bottom, color, size = 50, rotation = 0 }: any) => (
  <svg width={size} height={size} viewBox="0 0 100 100" style={{ position: 'absolute', top, left, right, bottom, transform: `rotate(${rotation}deg)`, zIndex: 5, filter: 'drop-shadow(3px 3px 0px var(--text-primary))' }}>
    <circle cx="50" cy="50" r="45" fill={color} stroke="var(--text-primary)" strokeWidth="5" />
    <line x1="50" y1="5" x2="50" y2="95" stroke="var(--text-primary)" strokeWidth="5" />
    <line x1="50" y1="50" x2="20" y2="85" stroke="var(--text-primary)" strokeWidth="5" />
    <line x1="50" y1="50" x2="80" y2="85" stroke="var(--text-primary)" strokeWidth="5" />
  </svg>
);

export const FlowerSticker = ({ top, left, right, bottom, color, size = 60, rotation = 0 }: any) => (
  <svg width={size} height={size} viewBox="0 0 100 100" style={{ position: 'absolute', top, left, right, bottom, transform: `rotate(${rotation}deg)`, zIndex: 5, filter: 'drop-shadow(3px 3px 0px var(--text-primary))' }}>
    <g fill={color} stroke="var(--text-primary)" strokeWidth="5">
      <circle cx="30" cy="30" r="20" />
      <circle cx="70" cy="30" r="20" />
      <circle cx="30" cy="70" r="20" />
      <circle cx="70" cy="70" r="20" />
      <circle cx="50" cy="20" r="20" />
      <circle cx="50" cy="80" r="20" />
      <circle cx="20" cy="50" r="20" />
      <circle cx="80" cy="50" r="20" />
    </g>
    <circle cx="50" cy="50" r="15" fill="#F89254" stroke="var(--text-primary)" strokeWidth="5" />
  </svg>
);

export const SmileySticker = ({ top, left, right, bottom, color, size = 50, rotation = 0 }: any) => (
  <svg width={size} height={size} viewBox="0 0 100 100" style={{ position: 'absolute', top, left, right, bottom, transform: `rotate(${rotation}deg)`, zIndex: 5, filter: 'drop-shadow(3px 3px 0px var(--text-primary))' }}>
    <circle cx="50" cy="50" r="45" fill={color} stroke="var(--text-primary)" strokeWidth="5" />
    <circle cx="35" cy="40" r="5" fill="var(--text-primary)" />
    <circle cx="65" cy="40" r="5" fill="var(--text-primary)" />
    <path d="M 25 60 Q 50 85 75 60" fill="none" stroke="var(--text-primary)" strokeWidth="6" strokeLinecap="round" />
  </svg>
);

export const EmojiSticker = ({ emoji, top, left, right, bottom, size = 50, rotation = 0 }: any) => (
  <div style={{ 
    position: 'absolute', 
    top, left, right, bottom, 
    transform: `rotate(${rotation}deg)`, 
    zIndex: 5, 
    fontSize: `${size}px`,
    userSelect: 'none',
    lineHeight: 1,
    filter: 'drop-shadow(3px 3px 0px var(--text-primary))'
  }}>
    {emoji}
  </div>
);

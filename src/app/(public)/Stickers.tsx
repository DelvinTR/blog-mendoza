import React from 'react';

// List of available sticker files in public/assets/stickers/
const STICKERS_LIST = [
  'Calque 1.png', 'Calque 2.png', 'Calque 3.png', 'Calque 4.png', 'Calque 5.png',
  'Calque 6.png', 'Calque 7.png', 'Calque 8.png', 'Calque 9.png', 'Calque 10.png',
  'Calque 11.png', 'Calque 12.png', 'Calque 14.png', 'Calque 15.png', 'Calque 16.png',
  'Calque 17.png', 'Calque 18.png', 'Calque 19.png', 'Calque 20.png', 'Calque 21.png'
];

/**
 * Helper to get a stable "random" index based on position props
 * This prevents hydration mismatch errors in Next.js
 */
const getStableIndex = (props: any) => {
  const seed = (props.top || '') + (props.left || '') + (props.right || '') + (props.bottom || '') + 'salt-for-variety';
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = ((hash << 5) - hash) + seed.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
};

export const CustomSticker = ({ top, left, right, bottom, size = 100, rotation = 0, stickerIndex }: any) => {
  const autoIndex = getStableIndex({ top, left, right, bottom });
  // Use manual index if provided, otherwise fallback to calculated hash
  const finalIndex = typeof stickerIndex === 'number' ? stickerIndex : autoIndex;
  const stickerFile = STICKERS_LIST[finalIndex % STICKERS_LIST.length];

  return (
    <div className="retro-sticker" style={{ position: 'absolute', top, left, right, bottom, zIndex: 5 }}>
      <div className="retro-sticker-inner" style={{ transform: `rotate(${rotation}deg)` }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img 
          src={`/assets/stickers/${stickerFile}`} 
          alt="Retro Sticker" 
          style={{ 
            width: `${size}px`, 
            height: 'auto', 
            display: 'block',
            filter: 'drop-shadow(3px 3px 0px rgba(0,0,0,0.2))'
          }} 
        />
      </div>
    </div>
  );
};

// Map old SVG components to the new CustomSticker component
// This way we don't have to change the code in every page
export const StarSticker = (props: any) => <CustomSticker {...props} />;
export const PeaceSticker = (props: any) => <CustomSticker {...props} />;
export const FlowerSticker = (props: any) => <CustomSticker {...props} />;
export const SmileySticker = (props: any) => <CustomSticker {...props} />;

export const EmojiSticker = ({ emoji, top, left, right, bottom, size = 50, rotation = 0 }: any) => (
  <div className="retro-sticker" style={{ position: 'absolute', top, left, right, bottom, zIndex: 5 }}>
    <div className="retro-sticker-inner" style={{ transform: `rotate(${rotation}deg)`, fontSize: `${size}px`, userSelect: 'none', lineHeight: 1 }}>
      <div style={{ filter: 'drop-shadow(3px 3px 0px rgba(0,0,0,0.15))' }}>
        {emoji}
      </div>
    </div>
  </div>
);

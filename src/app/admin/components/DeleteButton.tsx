'use client';

export default function DeleteButton({ 
  children, 
  confirmMessage, 
  style 
}: { 
  children: React.ReactNode, 
  confirmMessage: string, 
  style?: React.CSSProperties 
}) {
  return (
    <button 
      type="submit" 
      style={style} 
      onClick={(e) => { 
        if(!window.confirm(confirmMessage)) e.preventDefault(); 
      }}
    >
      {children}
    </button>
  );
}

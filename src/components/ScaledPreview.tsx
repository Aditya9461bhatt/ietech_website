import { useEffect, useRef, useState } from 'react';

interface ScaledPreviewProps {
  children: React.ReactNode;
  width: number;
  height: number;
}

export default function ScaledPreview({ children, width, height }: ScaledPreviewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new ResizeObserver((entries) => {
      const containerWidth = entries[0].contentRect.width;
      setScale(Math.min(1, containerWidth / width));
    });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [width]);

  return (
    <div 
      ref={containerRef} 
      className="w-full relative overflow-hidden rounded-sm shadow-2xl border border-black/5 dark:border-white/5 bg-white dark:bg-[#0a0a0a]" 
      style={{ height: `${height * scale}px` }}
    >
      {/* Interactive on purpose — the pages invite visitors to click the demo. */}
      <div
        className="origin-top-left absolute top-0 left-0 transition-transform duration-300 ease-out"
        style={{ width: `${width}px`, height: `${height}px`, transform: `scale(${scale})` }}
      >
        {children}
      </div>
    </div>
  );
}

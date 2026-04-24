import { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";

export default function PageLoader() {
  const location = useLocation();
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(false);
  const prevPath = useRef(location.pathname + location.search);

  useEffect(() => {
    const currentPath = location.pathname + location.search;
    if (prevPath.current === currentPath) return;
    prevPath.current = currentPath;


    const t1 = setTimeout(() => { setVisible(true); setProgress(30); }, 0);
    const t2 = setTimeout(() => setProgress(60), 300);
    const t3 = setTimeout(() => setProgress(85), 600);
    const t4 = setTimeout(() => setProgress(100), 900);
    const t5 = setTimeout(() => {
      setVisible(false);
      setProgress(0);
    }, 1200);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
      clearTimeout(t5);
    };
  }, [location.pathname, location.search]);

  if (!visible) return null;

  return (
    <div
      className="fixed top-0 left-0 h-[2.5px] z-[9999]"
      style={{
        width: `${progress}%`,
        transition: progress === 100
          ? "width 200ms ease-out, opacity 300ms ease-out 100ms"
          : "width 400ms cubic-bezier(0.4, 0, 0.2, 1)",
        background: "linear-gradient(90deg, #dc2626, #ef4444, #f87171)",
        boxShadow: "0 0 12px rgba(220, 38, 38, 0.5), 0 0 4px rgba(220, 38, 38, 0.3)",
        opacity: progress === 100 ? 0 : 1,
      }}
    />
  );
}

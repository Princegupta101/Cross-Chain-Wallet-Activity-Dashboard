import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "../../redux/store";
import type { LoaderProps, LoaderSize } from "../../types/types";

const sizeMap: Record<LoaderSize, number> = {
  sm: 24,
  md: 32,
  lg: 40,
  xl: 56,
  "2xl": 72,
};

export default function Loader({
  size = "lg",
  text,
  className = "",
}: LoaderProps) {
  const theme = useSelector((state: RootState) => state.theme?.mode ?? "light");
  const spinnerColor = theme === "dark" ? "#60a5fa" : "#3b82f6";
  const spinnerBg = theme === "dark" ? "#334155" : "#e2e8f0";
  const pxSize = sizeMap[size];

  const spinnerStyle: React.CSSProperties = {
    border: `4px solid ${spinnerBg}`,
    borderTop: `4px solid ${spinnerColor}`,
    width: pxSize,
    height: pxSize,
  };

  const [dots, setDots] = useState("");
  useEffect(() => {
    if (!text) return;
    const interval = setInterval(() => {
      setDots((d) => (d.length < 3 ? d + "." : ""));
    }, 400);
    return () => clearInterval(interval);
  }, [text]);

  return (
    <div
      className={`flex flex-col items-center justify-center min-h-[100px] gap-4 ${className}`}
      aria-busy="true"
      aria-label={text ? text + dots : "Loading"}
    >
      <div className="loader" style={spinnerStyle} />
      {text && (
        <span
          style={{
            marginTop: 8,
            fontSize: 15,
            color: theme === "dark" ? "#cbd5e1" : "#475569",
            fontWeight: 600,
            letterSpacing: 0.3,
          }}
        >
          {text}
          <span className="inline-block w-8">{dots}</span>
        </span>
      )}
    </div>
  );
}

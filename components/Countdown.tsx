"use client";

import { useEffect, useMemo, useState } from "react";

type Props = { startDate?: string };

export default function Countdown({ startDate = "2024-10-04T00:00:00+07:00" }: Props) {
  const target = useMemo(() => new Date(startDate).getTime(), [startDate]);
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  const diff = Math.max(0, now - target);
  const totalSeconds = Math.floor(diff / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return (
    <div className="counter-grid">
      <div className="counter-card"><strong>{days}</strong><span>Ngày</span></div>
      <div className="counter-card"><strong>{hours}</strong><span>Giờ</span></div>
      <div className="counter-card"><strong>{minutes}</strong><span>Phút</span></div>
      <div className="counter-card"><strong>{seconds}</strong><span>Giây</span></div>
    </div>
  );
}

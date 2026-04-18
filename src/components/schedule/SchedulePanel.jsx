import { useState, useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { getSchedule } from "../../services/api";
import { X } from "lucide-react";
import { useLanguage } from "../../context/LanguageContext";

export default function SchedulePanel({ open, onClose }) {
  const [clock, setClock] = useState(new Date());
  const panelRef = useRef(null);
  const { getTitle } = useLanguage();

  // Live clock
  useEffect(() => {
    const interval = setInterval(() => setClock(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  // Close on outside click
  useEffect(() => {
    function handleClick(e) {
      if (panelRef.current && !panelRef.current.contains(e.target)) {
        onClose();
      }
    }
    if (open) {
      document.addEventListener("mousedown", handleClick);
    }
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open, onClose]);

  // Close on ESC
  useEffect(() => {
    function handleKey(e) {
      if (e.key === "Escape") onClose();
    }
    if (open) document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [open, onClose]);

  // Get today + next 6 days timestamps
  const days = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() + i);
    const start = Math.floor(d.getTime() / 1000);
    const end = start + 86400;
    days.push({ date: new Date(d), start, end });
  }

  // Fetch schedule for today + next 6 days
  const startTs = days[0].start;
  const endTs = days[days.length - 1].end;

  const { data: scheduleData = [], isLoading } = useQuery({
    queryKey: ["schedule", startTs, endTs],
    queryFn: () => getSchedule(startTs, endTs),
    enabled: open,
    staleTime: 5 * 60 * 1000,
  });

  // Group schedule by day
  const grouped = {};
  days.forEach(({ date, start, end }) => {
    const key = date.toDateString();
    grouped[key] = {
      date,
      items: scheduleData
        .filter((s) => s.airingAt >= start && s.airingAt < end && !s.media?.isAdult)
        .sort((a, b) => a.airingAt - b.airingAt),
    };
  });

  // Format time
  const formatTime = (ts) => {
    const d = new Date(ts * 1000);
    return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: false });
  };

  // Format clock
  const formatClock = () => {
    return clock.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false });
  };

  // Timezone
  const offset = -(clock.getTimezoneOffset());
  const offsetHrs = Math.floor(Math.abs(offset) / 60);
  const offsetMins = Math.abs(offset) % 60;
  const offsetStr = `GMT ${offset >= 0 ? "+" : "-"}${String(offsetHrs).padStart(2, "0")}:${String(offsetMins).padStart(2, "0")}`;

  // Day name
  const dayName = (d) => d.toLocaleDateString("en-US", { weekday: "short" });
  const monthDay = (d) => {
    const day = d.getDate();
    const month = d.toLocaleDateString("en-US", { month: "long" }).toUpperCase();
    return { day, month };
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[200] bg-black/50">
      <div
        ref={panelRef}
        className="fixed left-0 top-0 h-full w-[320px] bg-[#080808] border-r border-white/5 shadow-2xl overflow-y-auto animate-in slide-in-from-left duration-300 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
      >
        {/* Header */}
        <div className="sticky top-0 bg-[#080808] z-10">
          {/* Red accent bar */}
          <div className="h-[2px] bg-gradient-to-r from-red-600 via-red-500 to-transparent" />
          
          <div className="px-4 pt-3 pb-3">
            <div className="flex items-center justify-between">
              <h2 className="text-[14px] font-black text-white tracking-tight">
                Estimated Schedule
              </h2>
              <button
                onClick={onClose}
                className="text-white/20 hover:text-white hover:bg-white/5 transition-all p-1 rounded-lg"
              >
                <X size={14} />
              </button>
            </div>

            {/* Timezone + Clock */}
            <div className="mt-2 flex items-end justify-between">
              <div className="flex items-center gap-3">
                <span className="text-[9px] font-bold bg-red-600/90 text-white px-1.5 py-[2px] rounded-sm uppercase tracking-wider">
                  {offsetStr}
                </span>
                <div className="text-[22px] font-black text-white tracking-tight leading-none font-mono tabular-nums">
                  {formatClock()}
                </div>
              </div>
              {/* Live indicator */}
              <div className="flex items-center gap-1 mb-0.5">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75" />
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-red-500" />
                </span>
                <span className="text-[8px] font-bold text-white/25 uppercase tracking-wider">Live</span>
              </div>
            </div>
          </div>
          
          {/* Bottom divider */}
          <div className="h-px bg-gradient-to-r from-white/[0.06] via-white/[0.03] to-transparent" />
        </div>

        {/* Schedule list */}
        <div className="px-5 py-4">
          {isLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 12 }).map((_, i) => (
                <div key={i} className="flex items-center gap-3 animate-pulse">
                  <div className="w-10 h-3 bg-white/5 rounded" />
                  <div className="flex-1 h-3 bg-white/5 rounded" />
                  <div className="w-6 h-3 bg-white/5 rounded" />
                </div>
              ))}
            </div>
          ) : (
            Object.entries(grouped).map(([key, { date, items }]) => {
              const { day, month } = monthDay(date);
              const isToday = new Date().toDateString() === date.toDateString();

              return (
                <div key={key} className="mb-4">
                  {/* Day header */}
                  <div className="flex items-center justify-between mb-2 pb-1.5 border-b border-white/5">
                    <div>
                      <span className="text-[16px] font-black text-white leading-none block">
                        {day}
                      </span>
                      <span className="text-[10px] font-extrabold text-white/50 uppercase tracking-wide">
                        {month}
                      </span>
                    </div>
                    <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                      isToday
                        ? "bg-red-600 text-white"
                        : "bg-white/[0.03] text-white/30"
                    }`}>
                      {isToday ? "Today" : dayName(date)}
                    </span>
                  </div>

                  {/* Anime list */}
                  {items.length === 0 ? (
                    <p className="text-white/20 text-[10px] py-1">No scheduled airing</p>
                  ) : (
                    <div className="space-y-0">
                      {items.map((item) => {
                        const isPast = item.airingAt * 1000 < Date.now();
                        return (
                        <a
                          key={item.id}
                          href={`/watch/${item.media?.id}`}
                          className={`flex items-center gap-2 py-[4px] group hover:bg-white/[0.04] rounded px-1 -mx-1 transition-colors cursor-pointer ${isPast ? 'opacity-60' : ''}`}
                        >
                          <span className="text-[11px] font-bold text-white/30 w-[34px] shrink-0 font-mono tabular-nums">
                            {formatTime(item.airingAt)}
                          </span>
                          <span className="text-[11px] text-white/50 group-hover:text-white transition-colors flex-1 truncate leading-tight font-medium">
                            {getTitle(item.media?.title)}
                          </span>
                          <span className="text-[10px] text-white/20 font-bold tabular-nums shrink-0">
                            {item.media?.popularity || item.episode}
                          </span>
                        </a>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}

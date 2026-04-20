import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { getSchedule } from "../../services/api";
import { useLanguage } from "../../context/LanguageContext";
import { ChevronLeft, ChevronRight, Clock, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function EstimatedSchedule() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [clock, setClock] = useState(new Date());
  const { getTitle } = useLanguage();
  const navigate = useNavigate();

  // Live clock
  useEffect(() => {
    const interval = setInterval(() => setClock(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  // Generate 7 days (Today + 6)
  const days = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date();
    d.setDate(d.getDate() + i);
    days.push(d);
  }

  // Current start/end range for fetching (broad range to cover all 7 days)
  const startTs = Math.floor(new Date().setHours(0, 0, 0, 0) / 1000);
  const endTs = startTs + (7 * 86400);

  const { data: scheduleData = [], isLoading } = useQuery({
    queryKey: ["schedule-section", startTs, endTs],
    queryFn: () => getSchedule(startTs, endTs),
    staleTime: 5 * 60 * 1000,
  });

  // Filter items for the selected date
  const selectedDayItems = scheduleData
    .filter((s) => {
      const itemDate = new Date(s.airingAt * 1000).toDateString();
      return itemDate === selectedDate.toDateString() && !s.media?.isAdult;
    })
    .sort((a, b) => a.airingAt - b.airingAt);

  const formatTime = (ts) => {
    return new Date(ts * 1000).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: false });
  };

  const getDayName = (d) => d.toLocaleDateString("en-US", { weekday: "short" }).toUpperCase();
  const getDayNum = (d) => d.getDate();
  const isToday = (d) => d.toDateString() === new Date().toDateString();
  const isSelected = (d) => d.toDateString() === selectedDate.toDateString();

  // Timezone string
  const offset = -(new Date().getTimezoneOffset());
  const offsetHrs = Math.floor(Math.abs(offset) / 60);
  const offsetMins = Math.abs(offset) % 60;
  const offsetStr = `GMT ${offset >= 0 ? "+" : "-"}${String(offsetHrs).padStart(2, "0")}:${String(offsetMins).padStart(2, "0")}`;

  return (
    <section className="max-w-[1720px] mx-auto px-2 md:px-4 mt-6 mb-6">
      <div className="bg-[#0f1115] rounded-[6px] border border-white/5 overflow-hidden shadow-lg">
        
        {/* Header Area */}
        <div className="bg-[#161921] border-b border-white/5 p-2 md:p-3">
          <div className="flex items-center justify-between mb-2 px-1">
            <div className="flex items-center gap-2">
              <div className="w-[2px] h-3 bg-red-600 rounded-full" />
              <h2 className="text-[12px] font-bold text-white uppercase tracking-tight">
                Schedule
              </h2>
               <span className="text-[11px] font-bold text-white/40 ml-2 border-l border-white/5 pl-2 truncate">
                 {Intl.DateTimeFormat().resolvedOptions().timeZone.replace(/_/g, ' ')} (GMT {offsetStr})
               </span>
            </div>
            <div className="flex items-center gap-1">
              <button className="w-5 h-5 rounded bg-white/5 flex items-center justify-center text-white/30 hover:text-white transition-all">
                <ChevronLeft size={12} />
              </button>
              <button className="w-5 h-5 rounded bg-white/5 flex items-center justify-center text-white/30 hover:text-white transition-all">
                <ChevronRight size={12} />
              </button>
            </div>
          </div>

          {/* Day Cards Row */}
          <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-hide pb-1">
            {days.map((date, i) => (
              <button
                key={i}
                onClick={() => setSelectedDate(date)}
                className={`flex flex-col items-center min-w-[50px] md:min-w-[70px] py-1.5 rounded-[4px] transition-all duration-200 ${
                  isSelected(date)
                    ? "bg-[#ff4d2e] translate-y-[-1px]"
                    : "bg-white/[0.01] hover:bg-white/[0.04]"
                }`}
              >
                <span className={`text-[8px] font-bold ${isSelected(date) ? "text-white" : "text-white/30"}`}>
                  {isToday(date) ? "TODAY" : getDayName(date)}
                </span>
                <span className={`text-[13px] font-black ${isSelected(date) ? "text-white" : "text-white/80"}`}>
                  {getDayNum(date)}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Schedule Grid Area */}
        <div className="p-1 md:p-3">
          <div className="min-h-[180px]">
            {isLoading ? (
              <div className="space-y-1">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="flex items-center gap-2 animate-pulse px-2 py-1.5">
                    <div className="w-8 h-2.5 bg-white/5 rounded" />
                    <div className="flex-1 h-2.5 bg-white/5 rounded" />
                    <div className="w-10 h-2.5 bg-white/5 rounded" />
                  </div>
                ))}
              </div>
            ) : selectedDayItems.length > 0 ? (
              <div className="space-y-px">
                {selectedDayItems.slice(0, 14).map((item) => {
                  const isPast = item.airingAt * 1000 < Date.now();
                  return (
                    <div 
                      key={item.id}
                      onClick={() => navigate(`/watch/${item.media?.id}`)}
                      className={`flex items-center gap-2.5 py-1.5 px-2.5 rounded-sm hover:bg-white/[0.02] transition-colors cursor-pointer group ${isPast ? "opacity-60" : ""}`}
                    >
                      <span className={`text-[11px] font-mono w-10 shrink-0 ${isPast ? "text-white/30" : "text-white/90"}`}>
                        {formatTime(item.airingAt)}
                      </span>
                      <h3 className={`text-sm font-medium transition-colors truncate flex-1 ${isPast ? "text-white/70 line-through" : "text-white/80 group-hover:text-white"}`}>
                        {getTitle(item.media?.title)}
                      </h3>
                      <span className={`text-[10px] uppercase border border-white/5 px-2 py-0.5 rounded ${isPast ? "text-white/30 bg-white/5" : "text-white/70 bg-white/10"}`}>
                        EP {item.episode}
                      </span>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="h-[120px] flex flex-col items-center justify-center text-white/10 gap-2">
                <Clock size={24} strokeWidth={1} />
                <p className="font-bold uppercase tracking-widest text-[8px]">Empty</p>
              </div>
            )}
          </div>

          {/* Footer of the section */}
          <div className="mt-2 pt-2 border-t border-white/5 flex items-center justify-between px-1">
             <div className="text-[9px] font-bold text-white/[0.05] tabular-nums uppercase">
                {clock.toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit' })}
             </div>
             {selectedDayItems.length > 14 && (
               <button 
                onClick={() => navigate('/schedule')}
                className="flex items-center gap-1 text-[9px] font-bold text-white/20 hover:text-white transition-colors uppercase tracking-wider"
               >
                 More <Plus size={10} />
               </button>
             )}
          </div>
        </div>
      </div>
    </section>
  );
}

import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ALL_GENRES } from "../../constants/genres";
import SchedulePanel from "../schedule/SchedulePanel";
import { useLanguage } from "../../context/LanguageContext";

export default function Navbar() {
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [showSchedule, setShowSchedule] = useState(false);
  const { language, setEN, setJP } = useLanguage();
  const navigate = useNavigate();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const searchContainerRef = useRef(null);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/browse?search=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchOpen(false);
      setSearchQuery("");
    }
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target)) {
        setIsSearchOpen(false);
      }
    };
    if (isSearchOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isSearchOpen]);

  const links = [
    { name: "TYPES", path: "/browse", dropdown: "types" },
    { name: "GENRES", path: "/browse", dropdown: "genres" },
    { name: "NEW RELEASES", path: "/browse?sort=START_DATE_DESC" },
    { name: "UPDATES", path: "/browse?sort=UPDATED_AT_DESC" },
    { name: "ONGOING", path: "/browse?status=RELEASING" },
    { name: "RECENT", path: "/browse?sort=START_DATE_DESC" },
    { name: "SCHEDULE", action: "schedule" },

  ];

  return (
    <>
    <nav className="fixed top-0 left-0 w-full z-110 bg-[#121212]/95 backdrop-blur-md border-b border-white/5">
      <div className="max-w-[1400px] mx-auto px-4 md:px-6 h-[56px] flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Mobile hamburger - Moved to far left */}
          <button 
            onClick={() => setShowSchedule(true)} 
            className="lg:hidden text-white/80 hover:text-white transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          {/* Logo */}
          <Link 
            to="/" 
            className="flex items-center gap-0 shrink-0"
            onClick={(e) => {
              e.preventDefault();
              navigate("/");
              window.scrollTo(0, 0);
            }}
          >
            <span className="text-[20px] md:text-[22px] font-bold italic text-white leading-none tracking-tight">
              Ani
            </span>
            <span className="text-[20px] md:text-[22px] font-bold italic bg-red-600 text-white px-[5px] py-[2px] rounded-[4px] leading-none -ml-px">
              GO
            </span>
          </Link>
        </div>

        {/* Navigation links */}
        <div className="hidden lg:flex items-center gap-6 h-full">
          {links.map((link) => (
            <div
              key={link.name}
              className="h-full flex items-center relative group"
              onMouseEnter={() => link.dropdown && setActiveDropdown(link.dropdown)}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <Link
                to={link.path || "#"}
                onClick={(e) => {
                  if (link.action === "schedule") {
                    e.preventDefault();
                    setShowSchedule(true);
                  }
                }}
                className={`text-[11px] font-bold tracking-[1px] transition-all duration-200 px-3 py-1 rounded-[4px] flex items-center uppercase ${
                  activeDropdown === link.dropdown && link.dropdown
                    ? "text-red-500"
                    : showSchedule && link.action === "schedule"
                    ? "text-red-500"
                    : "text-white/40 hover:text-white"
                }`}
              >
                {link.name}
              </Link>

              {/* Types Dropdown */}
              {link.dropdown === 'types' && activeDropdown === 'types' && (
                <div 
                  className="absolute top-[56px] left-0 bg-[#121212] border border-white/5 shadow-2xl p-4 w-[180px] z-110 rounded-b-[12px] animate-in fade-in slide-in-from-top-2 duration-200"
                >
                  <div className="flex flex-col gap-1">
                    {[
                      { label: "Movies", value: "MOVIE" },
                      { label: "TV Series", value: "TV" },
                      { label: "OVAs", value: "OVA" },
                      { label: "ONAs", value: "ONA" },
                      { label: "Specials", value: "SPECIAL" },
                    ].map((type) => (
                      <Link
                        key={type.value}
                        to={`/browse?type=${type.value}`}
                        onClick={() => setActiveDropdown(null)}
                        className="text-white/60 hover:text-white hover:bg-white/[0.03] px-3 py-2.5 rounded text-[13px] font-medium transition-all leading-tight flex items-center"
                      >
                        {type.label}
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Genres Mega-Dropdown */}
              {link.dropdown === 'genres' && activeDropdown === 'genres' && (
                <div 
                  className="absolute top-[56px] left-0 -translate-x-[50px] bg-[#121212] border border-white/5 shadow-2xl p-5 w-[650px] z-110 rounded-b-[12px] animate-in fade-in slide-in-from-top-2 duration-200"
                >
                  <div className="grid grid-cols-5 gap-x-4 gap-y-2">
                    {ALL_GENRES.map((genre) => (
                      <Link
                        key={genre}
                        to={`/browse?genre=${genre}`}
                        onClick={() => setActiveDropdown(null)}
                        className="text-[#888] hover:text-white hover:bg-white/[0.03] px-2 py-1 rounded text-[12px] font-medium transition-all leading-tight flex items-center gap-2 group"
                      >
                        <div className="w-[3px] h-[3px] bg-red-600 rounded-full" />
                        {genre}
                      </Link>
                    ))}
                  </div>
                  <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between font-bold uppercase tracking-widest text-[9px]">
                    <span className="text-[#666]">Explore 41 unique categories</span>
                    <Link to="/browse" className="text-red-500 hover:text-red-400">View All Filters</Link>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Right controls */}
        <div className="flex items-center gap-4">
          {/* EN / JP toggle */}
          <div className="flex items-center overflow-hidden rounded-[4px] bg-[#2a2a2a] border border-white/5 h-[24px]">
            <button 
              onClick={setEN}
              className={`${language === "EN" ? "bg-red-600 text-white" : "bg-transparent text-[#666] hover:text-[#aaa]"} text-[10px] font-bold px-[8px] h-full flex items-center leading-none italic tracking-tighter transition-colors`}
            >
              EN
            </button>
            <button 
              onClick={setJP}
              className={`${language === "JP" ? "bg-red-600 text-white" : "bg-transparent text-[#666] hover:text-[#aaa]"} text-[10px] font-bold px-[8px] h-full flex items-center leading-none italic tracking-tighter transition-colors`}
            >
              JP
            </button>
          </div>

          {/* Search Bar */}
          <div ref={searchContainerRef} className="relative flex items-center">
            <div 
              className={`absolute right-0 flex items-center bg-[#2a2a2a] border border-white/10 rounded-[4px] h-[34px] transition-all duration-300 ease-out origin-right ${
                isSearchOpen ? "w-[250px] md:w-[350px] opacity-100" : "w-0 opacity-0 pointer-events-none"
              }`}
            >
              <form onSubmit={handleSearchSubmit} className="flex items-center w-full px-2">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search anime..."
                  className="bg-transparent text-[12px] text-white w-full outline-none placeholder-white/20"
                  autoFocus={isSearchOpen}
                />
                <button type="submit" className="text-white/40 hover:text-white transition-colors">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </button>
              </form>
            </div>
            
            {!isSearchOpen && (
              <button 
                onClick={() => setIsSearchOpen(true)}
                className="text-[#888] hover:text-white transition-all transform hover:scale-110"
              >
                <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            )}
          </div>

          {/* Bell icon - Hidden on mobile for cleaner look */}
          <button className="hidden md:block text-[#888] hover:text-white transition-all transform hover:scale-110">
            <svg className="w-[19px] h-[19px] fill-[#888]/10 hover:fill-current" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
            </svg>
          </button>

          {/* Login / Profile Avatar */}
          <button className="flex items-center justify-center w-8 h-8 rounded-full overflow-hidden border border-white/10 hover:border-white/30 transition-all">
            <img 
              src="https://avatar.iran.liara.run/public/64" 
              alt="Avatar" 
              className="w-full h-full object-cover"
            />
          </button>
        </div>
      </div>
    </nav>

      {/* Schedule Panel */}
      <SchedulePanel open={showSchedule} onClose={() => setShowSchedule(false)} />
    </>
  );
}

// ANTIGRAVITY SYNC v5 - AUTO-FIX REVERTED CODE
import { useState, useEffect, useMemo, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getBrowseAnime, getBrowseAnimeMAL } from "../services/api";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import AnimeCard from "../components/common/AnimeCard";
import SkeletonCard from "../components/common/SkeletonCard";
import { Search, ChevronDown, ArrowDownUp, Filter, ChevronRight, ChevronLeft, Check, X, ChevronsRight, ChevronsLeft, Feather, Target, Calendar } from "lucide-react";
import { ALL_GENRES, OFFICIAL_GENRES, GENRE_MAP } from "../constants/genres";
import Pagination from "../components/common/Pagination";

export default function Browse() {
  const [searchParams, setSearchParams] = useSearchParams();

  const filters = useMemo(() => {
    const genreStr = searchParams.get("genre") || "";
    const excludeStr = searchParams.get("exclude") || "";
    const formatParams = searchParams.getAll("format");

    return {
      search: searchParams.get("search") || "",
      include: genreStr ? genreStr.split(",").filter(Boolean) : [],
      exclude: excludeStr ? excludeStr.split(",").filter(Boolean) : [],
      formats: formatParams,
      status: searchParams.get("status") || "",
      sort: searchParams.get("sort") || "TRENDING_DESC",
      year: searchParams.get("year") || null,
      season: searchParams.get("season") || null,
      country: searchParams.get("country") || "",
      rating: searchParams.get("rating") || null,
      language: searchParams.getAll("language"),
      excludeMyList: searchParams.get("excludeMyList") === "true",
    };
  }, [searchParams]);

  const [searchInput, setSearchInput] = useState(searchParams.get("search") || "");
  const [page, setPage] = useState(() => {
    const p = searchParams.get("page");
    return p ? parseInt(p) : 1;
  });

  // CORRECT WAY: Refs and Hooks must be at the top level, never nested.
  const emptyPageCount = useRef(0);

  const [prevUrlSearch, setPrevUrlSearch] = useState(searchParams.get("search") || "");
  const [prevUrlPage, setPrevUrlPage] = useState(searchParams.get("page") || "1");

  const currentUrlSearch = searchParams.get("search") || "";
  const currentUrlPage = searchParams.get("page") || "1";

  if (currentUrlSearch !== prevUrlSearch) {
    setPrevUrlSearch(currentUrlSearch);
    setSearchInput(currentUrlSearch);
  }

  if (currentUrlPage !== prevUrlPage) {
    setPrevUrlPage(currentUrlPage);
    setPage(parseInt(currentUrlPage));
  }

  const handlePageChange = (newPage) => {
    setPage(newPage);
    const newParams = new URLSearchParams(searchParams);
    newParams.set("page", newPage);
    setSearchParams(newParams);
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const [openDropdown, setOpenDropdown] = useState(null);

  useEffect(() => {
    const fromUrl = searchParams.get("search") || "";
    if (searchInput === fromUrl) { return; }

    const timer = setTimeout(() => {
      setSearchParams(prev => {
        const next = new URLSearchParams(prev);
        if (!searchInput) { next.delete("search"); }
        else { next.set("search", searchInput); }
        next.set("page", "1");
        return next;
      });
    }, 500);
    return () => { clearTimeout(timer); };
  }, [searchInput]);

  useEffect(() => {
    if (openDropdown && window.innerWidth < 768) {
      document.body.style.overflow = "hidden";
      document.body.style.touchAction = "none";
    } else {
      document.body.style.overflow = "unset";
      document.body.style.touchAction = "auto";
    }
    return () => {
      document.body.style.overflow = "unset";
      document.body.style.touchAction = "auto";
    };
  }, [openDropdown]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest(".filter-dropdown-container")) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => { document.removeEventListener("mousedown", handleClickOutside); };
  }, []);

  const { data: result = { media: [], pageInfo: { total: 0 } }, isLoading, isFetching, refetch } = useQuery({
    queryKey: ["browse", page, filters.search, filters.formats, filters.include, filters.exclude, filters.status, filters.sort, filters.year, filters.season, filters.country, filters.rating],
    queryFn: () => {
      if (filters.include.includes("Avant Garde")) {
        return getBrowseAnimeMAL({
          page: page,
          genres: filters.include,
          search: filters.search,
          status: filters.status,
          sort: filters.sort
        });
      }

      const vars = {
        page: page,
        perPage: 54,
        sort: [filters.sort],
      };
      if (filters.search && filters.search.trim()) { vars.search = filters.search; }
      if (filters.formats && filters.formats.length > 0) { vars.format_in = filters.formats; }

      if (filters.include && filters.include.length > 0) {
        const gen_in = [];
        const t_in = [];
        filters.include.forEach(g => {
          const mapped = GENRE_MAP[g] || g;
          if (OFFICIAL_GENRES.includes(mapped)) { gen_in.push(mapped); }
          else { t_in.push(mapped); }
        });
        if (gen_in.length > 0) { vars.genre_in = gen_in; }
        if (t_in.length > 0) { vars.tag_in = t_in; }
      }

      if (filters.status) { vars.status = filters.status; }
      if (filters.year) { vars.seasonYear = parseInt(filters.year); }
      if (filters.season) { vars.season = filters.season; }
      if (filters.country) { vars.country = filters.country; }
      if (filters.rating) { vars.averageScore_greater = parseInt(filters.rating); }

      return getBrowseAnime(vars);
    },
    enabled: true,
  });

  const animeList = useMemo(() => {
    const rawList = result.media || [];
    if (filters.include.length === 0 && filters.exclude.length === 0) { return rawList; }

    return rawList.filter(anime => {
      const animeGenres = anime.genres || [];
      const animeTags = (anime.tags || []).map(t => t.name);
      const allLabels = [...animeGenres, ...animeTags];

      const isExcl = filters.exclude.some(excl => {
        const mappedExcl = GENRE_MAP[excl] || excl;
        return allLabels.includes(mappedExcl);
      });
      if (isExcl) { return false; }

      if (filters.include.length > 0) {
        const isIncl = filters.include.some(incl => {
          const mappedIncl = GENRE_MAP[incl] || incl;
          return allLabels.includes(mappedIncl);
        });
        if (!isIncl) { return false; }
      }

      return true;
    });
  }, [result.media, filters.include, filters.exclude]);

  const hasNextPage = (result.pageInfo && result.pageInfo.hasNextPage) || false;

  // Single, stable effect for auto-pagination and safety breaks
  useEffect(() => {
    if (!isLoading && !isFetching) {
      if (animeList.length > 0) {
        if (emptyPageCount.current !== 0) {
          emptyPageCount.current = 0;
        }
      } else if (hasNextPage) {
        if (emptyPageCount.current >= 3) {
          console.warn("[Browse] Safety break: Stopped auto-jump after 3 empty pages.");
          return;
        }
        emptyPageCount.current += 1;
        handlePageChange(page + 1);
      }
    }
  }, [animeList, isLoading, isFetching, hasNextPage, page]);

  const toggleGenre = (genre) => {
    setSearchParams(prev => {
      const next = new URLSearchParams(prev);
      const genreVal = next.get("genre");
      const excludeVal = next.get("exclude");
      const include = genreVal ? genreVal.split(",").filter(Boolean) : [];
      const exclude = excludeVal ? excludeVal.split(",").filter(Boolean) : [];

      if (include.includes(genre)) {
        const newInclude = include.filter(g => g !== genre);
        const newExclude = [...exclude, genre];
        if (newInclude.length > 0) {
          next.set("genre", newInclude.join(","));
        } else {
          next.delete("genre");
        }
        next.set("exclude", newExclude.join(","));
      } else if (exclude.includes(genre)) {
        const newExclude = exclude.filter(g => g !== genre);
        if (newExclude.length > 0) {
          next.set("exclude", newExclude.join(","));
        } else {
          next.delete("exclude");
        }
      } else {
        const newInclude = [...include, genre];
        next.set("genre", newInclude.join(","));
      }
      next.set("page", "1");
      return next;
    });
  };

  const toggleFilter = (key, value) => {
    setSearchParams(prev => {
      const next = new URLSearchParams(prev);
      var urlKey = key;
      if (key === "formats") { urlKey = "format"; }
      else if (key === "language") { urlKey = "language"; }
      const currentValues = next.getAll(urlKey);
      const isSelected = currentValues.includes(value);
      const nextValues = isSelected ? currentValues.filter(v => v !== value) : [...currentValues, value];
      next.delete(urlKey);
      nextValues.forEach(v => { next.append(urlKey, v); });
      next.set("page", "1");
      return next;
    });
  };

  const handleSingleSelect = (key, value) => {
    setSearchParams(prev => {
      const next = new URLSearchParams(prev);
      if (!value) { next.delete(key); }
      else { next.set(key, value); }
      next.set("page", "1");
      return next;
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSearchParams(prev => {
      const next = new URLSearchParams(prev);
      if (!searchInput) { next.delete("search"); }
      else { next.set("search", searchInput); }
      next.set("page", "1");
      return next;
    });
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <Navbar />
      <main className="max-w-[1720px] mx-auto px-2 md:px-4 pt-24 pb-12">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-[14px] font-semibold uppercase tracking-[0.2em] text-white opacity-60">BROWSER</h1>
          {!isLoading && (
            <span className="text-[10px] font-bold text-white/40 bg-white/[0.03] px-2 py-1 rounded border border-white/5 uppercase tracking-wider">
              {result.pageInfo && result.pageInfo.total ? result.pageInfo.total.toLocaleString() : 0} Anime
            </span>
          )}
        </div>

        <form onSubmit={handleSubmit} className="hidden md:flex items-stretch mb-10 bg-[#121212] border border-white/5 rounded-[4px] h-10 relative filter-dropdown-container">
          <div className="relative flex-[1.5] border-r border-white/5 group">
            <input
              type="text"
              placeholder="Search..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="w-full h-full bg-transparent px-3 text-[12px] text-white/50 placeholder-white/20 outline-none"
            />
            <Search className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/20 w-3 h-3" />
          </div>

          <div className="relative flex-1 border-r border-white/5">
            <button type="button" onClick={() => { setOpenDropdown(openDropdown === "type" ? null : "type"); }} className="w-full h-full flex items-center justify-between px-3 text-[12px] text-white/40">
              <span className="truncate">{filters.formats.length > 0 ? "Type (" + filters.formats.length + ")" : "Type"}</span>
              <ChevronDown className="w-3 h-3 text-white/20" />
            </button>
            {openDropdown === "type" && (
              <div className="absolute top-[44px] left-0 w-48 bg-[#121212] border border-white/5 rounded-[4px] shadow-2xl p-3 z-[100]">
                {["MOVIE", "TV", "OVA", "ONA", "SPECIAL", "MUSIC"].map(format => (
                  <button key={format} type="button" onClick={() => { toggleFilter("formats", format); }} className="flex items-center gap-3 w-full py-1 text-[12px] text-gray-400 hover:text-white">
                    <div className={"w-3.5 h-3.5 border rounded-[2px] " + (filters.formats.includes(format) ? "bg-white border-white" : "border-white/20")} />
                    {format}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="relative flex-1 border-r border-white/5">
            <button type="button" onClick={() => { setOpenDropdown(openDropdown === "genre" ? null : "genre"); }} className="w-full h-full flex items-center justify-between px-3 text-[12px] text-white/40">
              <span className="truncate">{(filters.include.length + filters.exclude.length > 0) ? "Genres (" + (filters.include.length + filters.exclude.length) + ")" : "Genres"}</span>
              <ChevronDown className="w-3 h-3 text-white/20" />
            </button>
            {openDropdown === "genre" && (
              <div className="absolute top-[44px] left-0 w-[650px] bg-[#121212] border border-white/5 rounded-[4px] shadow-2xl p-4 z-[100]">
                <div className="grid grid-cols-4 gap-x-4 gap-y-2">
                  {ALL_GENRES.map(g => (
                    <button key={g} type="button" onClick={() => { toggleGenre(g); }} className="flex items-center gap-2 py-1 text-[12px]">
                      <div className={"w-3 h-3 border rounded-sm " + (filters.include.includes(g) ? "bg-red-600 border-red-600" : filters.exclude.includes(g) ? "bg-white/10 border-white/30" : "border-white/20")} />
                      <span className={filters.exclude.includes(g) ? "text-white/30 line-through" : "text-white/60"}>{g}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="relative flex-1 border-r border-white/5">
            <button type="button" onClick={() => { setOpenDropdown(openDropdown === "status" ? null : "status"); }} className="w-full h-full flex items-center justify-between px-3 text-[12px] text-white/40">
              <span className="truncate">{filters.status || "Status"}</span>
              <ChevronDown className="w-3 h-3 text-white/20" />
            </button>
            {openDropdown === "status" && (
              <div className="absolute top-[44px] left-0 w-40 bg-[#121212] border border-white/5 rounded-[4px] shadow-2xl z-[100]">
                {["", "RELEASING", "FINISHED", "NOT_YET_RELEASED"].map(val => (
                  <button key={val} type="button" onClick={() => { handleSingleSelect("status", val); setOpenDropdown(null); }} className="w-full px-4 py-2 text-[12px] text-left text-white/40 hover:bg-white/5">
                    {val || "All Status"}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="relative border-l border-white/5 ml-auto">
            <button type="button" onClick={() => { setOpenDropdown(openDropdown === "sort" ? null : "sort"); }} className="flex items-center justify-center w-10 h-full text-white/20 hover:bg-white/5">
              <ArrowDownUp size={14} />
            </button>
            {openDropdown === "sort" && (
              <div className="absolute top-[44px] right-0 w-48 bg-[#121212] border border-white/5 rounded-[4px] shadow-2xl z-[100]">
                {[
                  { label: "Trending", value: "TRENDING_DESC" },
                  { label: "Popularity", value: "POPULARITY_DESC" },
                  { label: "Score", value: "SCORE_DESC" },
                  { label: "Recently Added", value: "ID_DESC" }
                ].map(s => (
                  <button key={s.value} onClick={() => { handleSingleSelect("sort", s.value); setOpenDropdown(null); }} className="w-full px-4 py-2 text-[12px] text-left text-white/40 hover:bg-white/5">
                    {s.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          <button type="button" onClick={() => { refetch(); }} className="px-6 h-full bg-red-600 text-white text-[12px] font-bold">Filter</button>
        </form>

        {(isLoading || (isFetching && animeList.length === 0)) ? (
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-7 xl:grid-cols-9 gap-4 text-white/10">
            {Array.from({ length: 54 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : animeList.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-7 xl:grid-cols-9 gap-4">
            {animeList.map(anime => <AnimeCard key={anime.id} anime={anime} />)}
          </div>
        ) : (
          <div className="text-center py-24 opacity-40 text-sm">No results found matching your selection.</div>
        )}

        {(!isLoading && result.pageInfo && result.pageInfo.lastPage > 1) && (
          <Pagination currentPage={page} totalPages={result.pageInfo.lastPage} onPageChange={handlePageChange} />
        )}
      </main>
      <Footer />
    </div>
  );
}

import { useState } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getAnimeDetails } from "../services/api";
import { useLanguage } from "../context/LanguageContext";
import { useUserList } from "../context/UserListContext";
import Navbar from "../components/layout/Navbar";

export default function AnimeDetails() {
  const { id } = useParams();
  const { getTitle } = useLanguage();
  const { list, addToList } = useUserList();
  const [addingAction, setAddingAction] = useState(false);
  const [selectStatus, setSelectStatus] = useState("Watching");

  const { data: anime, isLoading } = useQuery({
    queryKey: ["animeDetails", id],
    queryFn: () => getAnimeDetails(Number(id)),
    enabled: !!id,
  });

  // Check if it's already in the list
  const existingEntry = list.find((i) => i.animeId === Number(id));

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#111] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-red-600 border-t-transparent flex items-center justify-center rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!anime) {
    return (
      <div className="min-h-screen bg-[#111] text-white flex flex-col pt-[52px]">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">Anime Not Found</div>
      </div>
    );
  }

  const handleAddToList = () => {
    addToList({
      animeId: anime.id,
      title: anime.title,
      coverImage: anime.coverImage?.large,
      totalEpisodes: anime.episodes,
      progress: existingEntry ? existingEntry.progress : 0,
      status: selectStatus,
      score: existingEntry ? existingEntry.score : 0,
    });
    setAddingAction(false);
  };

  return (
    <div className="min-h-screen bg-[#111] text-white flex flex-col font-sans pb-20">
      <Navbar />

      {/* Hero Banner Area */}
      <div className="relative w-full h-[300px] md:h-[450px] bg-[#1a1a1a]">
        {anime.bannerImage ? (
          <img
            src={anime.bannerImage}
            alt="Banner"
            className="w-full h-full object-cover opacity-60"
          />
        ) : anime.coverImage?.extraLarge || anime.coverImage?.large ? (
          <div
            className="w-full h-full bg-cover bg-center"
            style={{
              backgroundImage: `url(${anime.coverImage?.extraLarge || anime.coverImage?.large})`,
              filter: 'blur(30px) brightness(0.3)',
            }}
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-[#2a2a2a] to-[#111]" />
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#111]/60 to-[#111]" />
      </div>

      {/* Content Area */}
      <div className="max-w-[1200px] mx-auto px-4 md:px-6 -mt-[100px] md:-mt-[150px] relative z-10 w-full">
        <div className="flex flex-col md:flex-row gap-6 md:gap-10">
          
          {/* Left Column: Poster & Actions */}
          <div className="w-[180px] md:w-[240px] shrink-0 mx-auto md:mx-0">
            <div className="rounded-[4px] overflow-hidden shadow-2xl border border-white/5 bg-[#222]">
              <img
                src={anime.coverImage?.extraLarge || anime.coverImage?.large}
                alt={getTitle(anime.title)}
                className="w-full object-cover aspect-2/3"
              />
            </div>

            {/* List Actions */}
            <div className="mt-6 flex flex-col gap-3">
              {existingEntry && !addingAction ? (
                <div className="w-full flex items-center justify-between bg-white/[0.05] border border-white/10 rounded-[4px] px-3 py-2">
                  <div className="flex flex-col">
                    <span className="text-[10px] text-[#aaa] uppercase tracking-wider font-bold">In List</span>
                    <span className="text-[13px] font-bold text-white leading-tight">
                      {existingEntry.status}
                    </span>
                  </div>
                  <button
                    onClick={() => setAddingAction(true)}
                    className="text-[#888] hover:text-white transition-colors p-1"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                  </button>
                </div>
              ) : (
                <div className="bg-[#1a1a1a] rounded-[4px] border border-white/5 p-3 flex flex-col gap-3 animate-in fade-in zoom-in-95 duration-200">
                  <select
                    value={selectStatus}
                    onChange={(e) => setSelectStatus(e.target.value)}
                    className="w-full bg-[#2a2a2a] text-white text-[13px] font-medium outline-none rounded p-2 border border-transparent focus:border-red-600 transition-colors"
                  >
                    <option value="Watching">Watching</option>
                    <option value="Planned">Planned</option>
                    <option value="Completed">Completed</option>
                    <option value="Dropped">Dropped</option>
                  </select>
                  <button
                    onClick={handleAddToList}
                    className="w-full bg-red-600 hover:bg-red-700 text-white font-bold text-[13px] py-2 rounded transition-colors"
                  >
                    {existingEntry ? "Update List" : "Add to List"}
                  </button>
                  {addingAction && existingEntry && (
                    <button
                      onClick={() => setAddingAction(false)}
                      className="w-full bg-transparent hover:bg-white/[0.05] text-[#888] hover:text-white font-bold text-[12px] py-1.5 rounded transition-colors"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Information */}
          <div className="flex-1 text-center md:text-left mt-4 md:mt-24">
            <h1 className="text-2xl md:text-4xl font-black text-white leading-tight mb-2">
              {getTitle(anime.title)}
            </h1>
            
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mb-6">
              <span className="bg-red-600 text-white text-[11px] font-black px-2 py-0.5 rounded-[3px] uppercase tracking-tight">
                {anime.format || "TV"}
              </span>
              <span className="text-[12px] font-bold text-[#888] bg-white/[0.05] px-2 py-0.5 rounded-[3px]">
                {anime.seasonYear || "TBA"}
              </span>
              <span className="text-[12px] font-bold text-[#888] bg-white/[0.05] border border-white/5 px-2 py-0.5 rounded-[3px]">
                {anime.episodes ? `${anime.episodes} Episodes` : "Airing"}
              </span>
              <span className="text-[12px] font-bold text-[#888] flex items-center gap-1">
                ⭐ {anime.averageScore ? `${anime.averageScore}%` : "N/A"}
              </span>
            </div>

            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 mb-8">
              {(anime.genres || []).map((genre) => (
                <span
                  key={genre}
                  className="text-[11px] font-bold text-[#ccc] px-2.5 py-1 rounded-full border border-white/10 bg-[#1a1a1a]"
                >
                  {genre}
                </span>
              ))}
            </div>

            <div className="text-[14px] text-[#ccc] leading-[1.8] max-w-[800px]">
              {anime.description ? (
                <div dangerouslySetInnerHTML={{ __html: anime.description }} />
              ) : (
                <p className="italic text-[#666]">No synopsis available.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

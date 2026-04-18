export default function AlphabetNav() {
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

  return (
    <section className="mt-14 max-w-[1400px] mx-auto px-4 md:px-6">
      {/* Label */}
      <p className="text-center text-[13px] text-[#666] mb-4">
        Searching anime order by alphabet name A to Z.
      </p>

      {/* Letter buttons */}
      <div className="flex flex-wrap items-center justify-center gap-[6px]">
        {/* All */}
        <button className="text-[11px] font-medium text-[#bbb] bg-[#2a2a2a] hover:bg-[#333] hover:text-white px-[10px] py-[5px] rounded-[3px] border border-[#383838] transition-colors">
          All
        </button>
        {/* 0-9 */}
        <button className="text-[11px] font-medium text-[#bbb] bg-[#2a2a2a] hover:bg-[#333] hover:text-white px-[10px] py-[5px] rounded-[3px] border border-[#383838] transition-colors">
          0-9
        </button>
        {/* A-Z */}
        {letters.map((letter) => (
          <button
            key={letter}
            className="text-[11px] font-medium text-[#bbb] bg-[#2a2a2a] hover:bg-[#333] hover:text-white w-[30px] py-[5px] rounded-[3px] border border-[#383838] transition-colors text-center"
          >
            {letter}
          </button>
        ))}
      </div>
    </section>
  );
}

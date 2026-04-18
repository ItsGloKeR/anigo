import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-[#181818] border-t border-[#2a2a2a] mt-16">
      <div className="max-w-[1400px] mx-auto px-4 md:px-6 py-8">
        {/* Top row */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          {/* Logo & copyright */}
          <div>
            <Link to="/" className="flex items-center gap-0">
              <span className="text-[20px] font-black italic text-white leading-none tracking-tight">Ani</span>
              <span className="text-[20px] font-black italic bg-red-600 text-white px-[4px] py-[2px] rounded-[3px] leading-none ml-[-1px]">GO</span>
            </Link>
            <p className="text-[11px] text-[#555] mt-2">
              Copyright &copy;AniGo. All Rights Reserved
            </p>
          </div>

          {/* Links */}
          <div className="flex items-center gap-5">
            <Link to="/browse" className="text-[12px] text-[#999] hover:text-white transition-colors flex items-center gap-1">
              <span className="text-red-600">&gt;</span> REQUEST
            </Link>
            <Link to="/browse" className="text-[12px] text-[#999] hover:text-white transition-colors flex items-center gap-1">
              <span className="text-red-600">&gt;</span> CONTACT US
            </Link>
          </div>
        </div>

        {/* Disclaimer */}
        <p className="text-[11px] text-[#555] text-center mt-5 leading-relaxed">
          Disclaimer: This site does not store any files on its server. All contents are provided by non-affiliated third parties.
        </p>
        <p className="text-[10px] text-[#444] text-right mt-1">myflixer, hianime</p>
      </div>

      {/* Red bottom bar */}
      <div className="h-[3px] bg-red-600" />
    </footer>
  );
}

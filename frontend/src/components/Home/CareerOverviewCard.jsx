export default function CareerOverviewCard() {
  return (
    <div className="relative max-w-md mx-auto select-none">
      
      {/* Floating Badge: Top-Left */}
      <div className="absolute -top-4 -left-6 z-20 bg-white/95 backdrop-blur-md border border-slate-100 shadow-xl shadow-slate-200/50 rounded-2xl p-3 flex items-center gap-3 animate-bounce duration-1000">
        <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold text-sm">
          ✓
        </div>
        <div>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">New Match</p>
          <p className="text-xs font-black text-slate-800">Career Updated</p>
        </div>
      </div>

      {/* Floating Badge: Bottom-Right */}
      <div className="absolute -bottom-4 -right-6 z-20 bg-white/95 backdrop-blur-md border border-slate-100 shadow-xl shadow-slate-200/50 rounded-2xl p-3.5 space-y-1">
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">New Opportunity</p>
        <p className="text-xs font-black text-slate-900">ML Engineer</p>
        <p className="text-xs font-black text-blue-600">94% Match</p>
      </div>

      {/* Main Container Card */}
      <div className="bg-white border border-slate-100 shadow-2xl shadow-blue-500/10 rounded-[32px] p-6 sm:p-7 space-y-4 relative z-10">
        
        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <span className="text-xs font-bold text-slate-400 tracking-wide">CareerAI Assistant</span>
            <h3 className="text-xl font-black text-slate-900 tracking-tight mt-0.5">Your Career Overview</h3>
          </div>
          <div className="w-9 h-9 rounded-2xl bg-blue-600 text-white flex items-center justify-center text-sm shadow-md shadow-blue-500/30">
            ✦
          </div>
        </div>

        {/* Primary Career Match Highlight Card */}
        <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 rounded-2xl p-5 text-white shadow-lg shadow-blue-600/25 relative overflow-hidden">
          <div className="flex justify-between items-baseline mb-3">
            <h4 className="text-2xl font-black tracking-tight">Data Scientist</h4>
            <div className="text-right">
              <span className="text-2xl font-black">96%</span>
              <span className="block text-[10px] uppercase font-bold text-blue-200">Match</span>
            </div>
          </div>
          
          {/* Match Progress Bar */}
          <div className="w-full bg-white/20 h-2 rounded-full overflow-hidden p-0.5">
            <div className="bg-white h-full rounded-full w-[96%]" />
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3">
          {/* ATS Score */}
          <div className="bg-slate-50/80 border border-slate-100 rounded-2xl p-3.5 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center text-lg shrink-0">
              📄
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase">Resume Score</p>
              <p className="text-base font-black text-slate-900">92/100</p>
            </div>
          </div>

          {/* Skill Growth */}
          <div className="bg-slate-50/80 border border-slate-100 rounded-2xl p-3.5 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center text-lg shrink-0">
              📈
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase">Skill Growth</p>
              <p className="text-base font-black text-slate-900">+34%</p>
            </div>
          </div>
        </div>

        {/* Recommended Jobs Bar */}
        <div className="bg-slate-50/80 border border-slate-100 rounded-2xl p-3.5 flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center text-lg shrink-0">
            💼
          </div>
          <div className="flex-1">
            <p className="text-[10px] font-bold text-slate-400 uppercase">Recommended Opportunities</p>
            <p className="text-sm font-black text-slate-900">128 Jobs Matched</p>
          </div>
          <span className="text-slate-400 font-bold text-sm">→</span>
        </div>

      </div>
    </div>
  );
}
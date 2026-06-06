import { useState } from "react";
import Icon from "@/components/ui/icon";

const TEMPLATES = [
  { id: "cinematic", label: "Cinematic", icon: "Film", color: "from-blue-500/20 to-cyan-500/20" },
  { id: "social", label: "Social Media", icon: "Smartphone", color: "from-pink-500/20 to-purple-500/20" },
  { id: "explainer", label: "Explainer", icon: "BookOpen", color: "from-green-500/20 to-teal-500/20" },
  { id: "promo", label: "Promo", icon: "Zap", color: "from-orange-500/20 to-yellow-500/20" },
  { id: "documentary", label: "Documentary", icon: "Camera", color: "from-red-500/20 to-rose-500/20" },
  { id: "animation", label: "Animation", icon: "Sparkles", color: "from-violet-500/20 to-indigo-500/20" },
];

const PROJECTS = [
  {
    id: 1,
    title: "Product Launch Campaign",
    duration: "0:45",
    template: "Promo",
    status: "done",
    created: "2h ago",
    thumb: "https://cdn.ezst.app/projects/9361d3fe-cffa-4d50-96b2-31d88b5afdba/files/fffd85cc-3e06-41ea-bf48-fd5122d96b15.jpg",
    views: "1.2k",
  },
  {
    id: 2,
    title: "Brand Story — Summer 2026",
    duration: "1:20",
    template: "Cinematic",
    status: "done",
    created: "Yesterday",
    thumb: "https://cdn.ezst.app/projects/9361d3fe-cffa-4d50-96b2-31d88b5afdba/files/fffd85cc-3e06-41ea-bf48-fd5122d96b15.jpg",
    views: "3.4k",
  },
  {
    id: 3,
    title: "How It Works Explainer",
    duration: "2:10",
    template: "Explainer",
    status: "rendering",
    created: "Just now",
    thumb: null,
    views: null,
  },
  {
    id: 4,
    title: "Social Reel — New Collection",
    duration: "0:30",
    template: "Social Media",
    status: "done",
    created: "3 days ago",
    thumb: "https://cdn.ezst.app/projects/9361d3fe-cffa-4d50-96b2-31d88b5afdba/files/fffd85cc-3e06-41ea-bf48-fd5122d96b15.jpg",
    views: "8.9k",
  },
];

const NAV_ITEMS = [
  { icon: "LayoutDashboard", label: "Dashboard", active: true },
  { icon: "Video", label: "My Videos" },
  { icon: "LayoutTemplate", label: "Templates" },
  { icon: "Wand2", label: "AI Studio" },
  { icon: "BarChart2", label: "Analytics" },
  { icon: "Settings", label: "Settings" },
];

const STATS = [
  { label: "Videos Created", value: "47", change: "+12 this month", icon: "Video", color: "text-cyan-400" },
  { label: "Total Views", value: "124K", change: "+34% vs last month", icon: "Eye", color: "text-violet-400" },
  { label: "Render Time Saved", value: "38h", change: "vs manual editing", icon: "Clock", color: "text-emerald-400" },
  { label: "Credits Left", value: "1,240", change: "of 2,000 monthly", icon: "Coins", color: "text-amber-400" },
];

export default function Index() {
  const [prompt, setPrompt] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState("cinematic");
  const [duration, setDuration] = useState("30");
  const [style, setStyle] = useState("realistic");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="min-h-screen bg-background flex overflow-hidden">
      {/* Background grid */}
      <div className="fixed inset-0 bg-grid opacity-100 pointer-events-none" />
      <div className="fixed inset-0 pointer-events-none" style={{
        background: "radial-gradient(ellipse 80% 50% at 20% 20%, rgba(0,230,255,0.06) 0%, transparent 60%), radial-gradient(ellipse 60% 40% at 80% 80%, rgba(130,80,220,0.08) 0%, transparent 60%)"
      }} />

      {/* Sidebar */}
      <aside
        className={`${sidebarOpen ? "w-60" : "w-16"} flex-shrink-0 h-screen sticky top-0 z-20 flex flex-col transition-all duration-300`}
        style={{ background: "rgba(8,10,18,0.95)", borderRight: "1px solid rgba(255,255,255,0.06)" }}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-4 py-5 border-b border-white/5">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 glow-cyan"
            style={{ background: "linear-gradient(135deg, #00e6ff, #8250dc)" }}>
            <Icon name="Clapperboard" size={16} className="text-black" />
          </div>
          {sidebarOpen && (
            <span className="font-syne font-extrabold text-lg gradient-text tracking-tight">FrameAI</span>
          )}
          <button onClick={() => setSidebarOpen(!sidebarOpen)}
            className="ml-auto text-white/30 hover:text-white/70 transition-colors">
            <Icon name={sidebarOpen ? "PanelLeftClose" : "PanelLeftOpen"} size={16} />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 py-4 px-2 space-y-0.5">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.label}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-200 ${
                item.active
                  ? "text-cyan-400 font-medium"
                  : "text-white/40 hover:text-white/80 hover:bg-white/5"
              }`}
              style={item.active ? { background: "rgba(0,230,255,0.08)", border: "1px solid rgba(0,230,255,0.15)" } : {}}
            >
              <Icon name={item.icon} size={17} className="flex-shrink-0" />
              {sidebarOpen && <span className="font-dm">{item.label}</span>}
              {sidebarOpen && item.active && (
                <span className="ml-auto w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse-glow" />
              )}
            </button>
          ))}
        </nav>

        {/* Credits */}
        {sidebarOpen && (
          <div className="p-4 border-t border-white/5">
            <div className="glass rounded-xl p-3">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs text-white/40 font-dm">Monthly Credits</span>
                <span className="text-xs text-cyan-400 font-syne font-semibold">1,240 left</span>
              </div>
              <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                <div className="h-full rounded-full progress-bar" style={{ width: "62%" }} />
              </div>
              <button className="mt-3 w-full py-2 rounded-lg text-xs font-syne font-semibold text-black transition-all hover:opacity-90"
                style={{ background: "linear-gradient(135deg, #00e6ff, #8250dc)" }}>
                Upgrade Plan
              </button>
            </div>
          </div>
        )}

        {/* User */}
        <div className="p-3 border-t border-white/5 flex items-center gap-3">
          <div className="w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-syne font-bold text-black"
            style={{ background: "linear-gradient(135deg, #00e6ff, #8250dc)" }}>
            A
          </div>
          {sidebarOpen && (
            <div className="flex-1 min-w-0">
              <div className="text-sm font-dm text-white/80 truncate">Alex Morgan</div>
              <div className="text-xs text-white/30 truncate">Pro Plan</div>
            </div>
          )}
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 h-screen overflow-y-auto">
        {/* Top bar */}
        <header className="sticky top-0 z-10 flex items-center justify-between px-6 py-4"
          style={{ background: "rgba(8,10,18,0.8)", backdropFilter: "blur(16px)", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
          <div>
            <h1 className="font-syne text-xl font-bold text-white">Dashboard</h1>
            <p className="text-sm text-white/35 font-dm">Saturday, June 06, 2026</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="glass rounded-xl px-4 py-2 text-sm text-white/60 hover:text-white/90 transition-colors flex items-center gap-2">
              <Icon name="Search" size={15} />
              <span className="font-dm">Search...</span>
              <span className="text-xs text-white/25 ml-2">⌘K</span>
            </button>
            <button className="glass rounded-xl p-2.5 text-white/50 hover:text-white/80 transition-colors relative">
              <Icon name="Bell" size={17} />
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-cyan-400" />
            </button>
          </div>
        </header>

        <div className="p-6 space-y-6">

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {STATS.map((stat, i) => (
              <div key={stat.label}
                className="glass rounded-2xl p-4 hover:border-white/12 transition-all duration-200 animate-fade-up"
                style={{ animationDelay: `${i * 0.08}s`, animationFillMode: "both" }}>
                <div className="flex items-start justify-between mb-3">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${stat.color}`}
                    style={{ background: "rgba(255,255,255,0.06)" }}>
                    <Icon name={stat.icon} size={17} />
                  </div>
                  <Icon name="TrendingUp" size={13} className="text-emerald-400 mt-1" />
                </div>
                <div className={`font-syne text-2xl font-bold ${stat.color}`}>{stat.value}</div>
                <div className="font-dm text-xs text-white/40 mt-0.5">{stat.label}</div>
                <div className="font-dm text-xs text-white/25 mt-1">{stat.change}</div>
              </div>
            ))}
          </div>

          {/* Main two-column layout */}
          <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">

            {/* AI Generation Panel */}
            <div className="xl:col-span-3 space-y-4">
              <div className="glass rounded-2xl overflow-hidden"
                style={{ border: "1px solid rgba(0,230,255,0.12)" }}>
                {/* Panel header */}
                <div className="px-5 py-4 flex items-center gap-3"
                  style={{ borderBottom: "1px solid rgba(255,255,255,0.06)", background: "rgba(0,230,255,0.03)" }}>
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                    style={{ background: "linear-gradient(135deg, rgba(0,230,255,0.2), rgba(130,80,220,0.2))" }}>
                    <Icon name="Wand2" size={16} className="text-cyan-400" />
                  </div>
                  <div>
                    <div className="font-syne font-semibold text-white text-sm">AI Video Generator</div>
                    <div className="font-dm text-xs text-white/35">Describe your vision, get stunning video</div>
                  </div>
                  <div className="ml-auto flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse-glow" />
                    <span className="text-xs text-emerald-400 font-dm">Online</span>
                  </div>
                </div>

                <div className="p-5 space-y-4">
                  {/* Prompt textarea */}
                  <div>
                    <label className="block text-xs font-dm text-white/40 mb-2 uppercase tracking-widest">Your Prompt</label>
                    <div className="relative">
                      <textarea
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        placeholder="A cinematic drone shot over a futuristic city at golden hour, neon lights reflecting on glass skyscrapers, smooth motion..."
                        rows={4}
                        className="w-full rounded-xl px-4 py-3.5 text-sm font-dm text-white/80 placeholder-white/20 resize-none outline-none transition-all"
                        style={{
                          background: "rgba(255,255,255,0.04)",
                          border: "1px solid rgba(255,255,255,0.08)",
                        }}
                        onFocus={(e) => e.currentTarget.style.borderColor = "rgba(0,230,255,0.3)"}
                        onBlur={(e) => e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"}
                      />
                      <div className="absolute bottom-3 right-3 text-xs text-white/20 font-dm">
                        {prompt.length}/500
                      </div>
                    </div>
                  </div>

                  {/* Template selection */}
                  <div>
                    <label className="block text-xs font-dm text-white/40 mb-2 uppercase tracking-widest">Template Style</label>
                    <div className="grid grid-cols-3 gap-2">
                      {TEMPLATES.map((tpl) => (
                        <button
                          key={tpl.id}
                          onClick={() => setSelectedTemplate(tpl.id)}
                          className={`relative flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs font-dm transition-all duration-200 ${
                            selectedTemplate === tpl.id
                              ? "text-cyan-400"
                              : "text-white/40 hover:text-white/70"
                          }`}
                          style={{
                            background: selectedTemplate === tpl.id
                              ? "rgba(0,230,255,0.08)"
                              : "rgba(255,255,255,0.03)",
                            border: selectedTemplate === tpl.id
                              ? "1px solid rgba(0,230,255,0.3)"
                              : "1px solid rgba(255,255,255,0.07)",
                          }}
                        >
                          <Icon name={tpl.icon} size={14} />
                          <span>{tpl.label}</span>
                          {selectedTemplate === tpl.id && (
                            <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-cyan-400" />
                          )}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Options row */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-dm text-white/40 mb-2 uppercase tracking-widest">Duration</label>
                      <div className="flex gap-2">
                        {["15", "30", "60", "120"].map((d) => (
                          <button key={d}
                            onClick={() => setDuration(d)}
                            className={`flex-1 py-2 rounded-lg text-xs font-syne font-semibold transition-all duration-200 ${
                              duration === d ? "text-black" : "text-white/40 hover:text-white/70"
                            }`}
                            style={{
                              background: duration === d
                                ? "linear-gradient(135deg, #00e6ff, #8250dc)"
                                : "rgba(255,255,255,0.05)",
                            }}>
                            {d}s
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-dm text-white/40 mb-2 uppercase tracking-widest">Visual Style</label>
                      <div className="flex gap-2">
                        {["realistic", "anime", "3d"].map((s) => (
                          <button key={s}
                            onClick={() => setStyle(s)}
                            className={`flex-1 py-2 rounded-lg text-xs font-syne font-semibold transition-all capitalize duration-200 ${
                              style === s ? "text-black" : "text-white/40 hover:text-white/70"
                            }`}
                            style={{
                              background: style === s
                                ? "linear-gradient(135deg, #00e6ff, #8250dc)"
                                : "rgba(255,255,255,0.05)",
                            }}>
                            {s}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Generate button */}
                  <button
                    className="w-full py-3.5 rounded-xl font-syne font-bold text-sm text-black flex items-center justify-center gap-2.5 transition-all duration-200 hover:opacity-90 hover:scale-[1.01] active:scale-[0.99]"
                    style={{ background: "linear-gradient(135deg, #00e6ff 0%, #8250dc 100%)", boxShadow: "0 8px 32px rgba(0,230,255,0.2), 0 4px 16px rgba(130,80,220,0.2)" }}>
                    <Icon name="Sparkles" size={17} />
                    Generate Video
                    <span className="ml-auto text-black/50 text-xs font-dm font-normal">~45 sec</span>
                  </button>
                </div>
              </div>

              {/* Rendering status */}
              <div className="glass rounded-2xl p-4 flex items-center gap-4"
                style={{ border: "1px solid rgba(130,80,220,0.2)" }}>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: "rgba(130,80,220,0.15)" }}>
                  <Icon name="Loader2" size={20} className="text-violet-400 animate-spin-slow" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-dm text-sm text-white/80">How It Works Explainer</span>
                    <span className="text-xs text-violet-400 font-syne font-semibold">68%</span>
                  </div>
                  <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full rounded-full progress-bar animate-shimmer" style={{ width: "68%" }} />
                  </div>
                  <div className="text-xs text-white/30 font-dm mt-1.5">Rendering frames… ~30s remaining</div>
                </div>
                <button className="text-white/20 hover:text-white/50 transition-colors flex-shrink-0">
                  <Icon name="X" size={16} />
                </button>
              </div>
            </div>

            {/* Right column */}
            <div className="xl:col-span-2 space-y-4">
              {/* Quick actions */}
              <div className="glass rounded-2xl p-4" style={{ border: "1px solid rgba(255,255,255,0.07)" }}>
                <h3 className="font-syne font-semibold text-white text-sm mb-3">Quick Actions</h3>
                <div className="space-y-2">
                  {[
                    { icon: "Upload", label: "Upload footage", sub: "Enhance with AI", color: "text-cyan-400", bg: "rgba(0,230,255,0.08)" },
                    { icon: "LayoutTemplate", label: "Browse templates", sub: "120+ ready-made", color: "text-violet-400", bg: "rgba(130,80,220,0.08)" },
                    { icon: "Music", label: "Add soundtrack", sub: "AI-generated audio", color: "text-emerald-400", bg: "rgba(52,211,153,0.08)" },
                    { icon: "Captions", label: "Auto subtitles", sub: "40+ languages", color: "text-amber-400", bg: "rgba(251,191,36,0.08)" },
                  ].map((action) => (
                    <button key={action.label}
                      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/5 transition-all group text-left">
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                        style={{ background: action.bg }}>
                        <Icon name={action.icon} size={15} className={action.color} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-dm text-white/75 group-hover:text-white/95 transition-colors">{action.label}</div>
                        <div className="text-xs text-white/30 font-dm">{action.sub}</div>
                      </div>
                      <Icon name="ChevronRight" size={14} className="text-white/20 group-hover:text-white/50 transition-colors" />
                    </button>
                  ))}
                </div>
              </div>

              {/* Usage this week */}
              <div className="glass rounded-2xl p-4" style={{ border: "1px solid rgba(255,255,255,0.07)" }}>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-syne font-semibold text-white text-sm">This Week</h3>
                  <span className="text-xs text-white/30 font-dm">Jun 1–6</span>
                </div>
                <div className="space-y-3">
                  {[
                    { label: "Videos Generated", val: 8, max: 20, pct: 40, color: "#00e6ff" },
                    { label: "Credits Used", val: 760, max: 2000, pct: 38, color: "#8250dc" },
                    { label: "Avg Render Time", val: "42s", max: null, pct: null, color: "#34d399" },
                  ].map((item) => (
                    <div key={item.label}>
                      <div className="flex justify-between items-center mb-1.5">
                        <span className="text-xs font-dm text-white/45">{item.label}</span>
                        <span className="text-xs font-syne font-semibold" style={{ color: item.color }}>
                          {item.max ? `${item.val}/${item.max}` : item.val}
                        </span>
                      </div>
                      {item.max && (
                        <div className="w-full h-1 bg-white/8 rounded-full overflow-hidden">
                          <div className="h-full rounded-full transition-all duration-1000"
                            style={{ width: `${item.pct}%`, background: item.color }} />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Recent Projects */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-syne font-bold text-white text-lg">Recent Projects</h2>
              <button className="text-sm text-cyan-400 font-dm hover:text-cyan-300 transition-colors flex items-center gap-1">
                View all <Icon name="ArrowRight" size={14} />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {PROJECTS.map((project, i) => (
                <div
                  key={project.id}
                  className="glass rounded-2xl overflow-hidden group cursor-pointer transition-all duration-300 animate-fade-up"
                  style={{ animationDelay: `${i * 0.1}s`, animationFillMode: "both" }}
                >
                  {/* Thumbnail */}
                  <div className="relative aspect-video overflow-hidden"
                    style={{ background: "rgba(255,255,255,0.04)" }}>
                    {project.thumb ? (
                      <img src={project.thumb} alt={project.title}
                        className="w-full h-full object-cover opacity-70 group-hover:opacity-90 group-hover:scale-105 transition-all duration-500" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Icon name="Loader2" size={24} className="text-violet-400 animate-spin-slow" />
                      </div>
                    )}

                    {/* Overlay controls */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                      style={{ background: "rgba(0,0,0,0.4)" }}>
                      <button className="w-10 h-10 rounded-full flex items-center justify-center text-white"
                        style={{ background: "rgba(0,230,255,0.9)" }}>
                        <Icon name="Play" size={18} className="text-black ml-0.5" />
                      </button>
                    </div>

                    {/* Duration badge */}
                    {project.status === "done" && (
                      <span className="absolute bottom-2 right-2 text-xs font-syne font-semibold text-white px-2 py-0.5 rounded-md"
                        style={{ background: "rgba(0,0,0,0.7)" }}>
                        {project.duration}
                      </span>
                    )}

                    {/* Rendering badge */}
                    {project.status === "rendering" && (
                      <div className="absolute top-2 left-2 flex items-center gap-1.5 px-2 py-1 rounded-lg"
                        style={{ background: "rgba(130,80,220,0.85)" }}>
                        <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse-glow" />
                        <span className="text-xs font-syne font-semibold text-white">Rendering</span>
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="p-3">
                    <div className="font-syne font-semibold text-sm text-white/85 truncate mb-1">{project.title}</div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-white/30 font-dm">{project.template} · {project.created}</span>
                      {project.views && (
                        <span className="text-xs text-white/35 font-dm flex items-center gap-1">
                          <Icon name="Eye" size={11} />
                          {project.views}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Action row */}
                  <div className="px-3 pb-3 flex gap-2">
                    <button className="flex-1 py-1.5 rounded-lg text-xs font-syne font-semibold text-cyan-400 transition-all hover:bg-cyan-400/10"
                      style={{ border: "1px solid rgba(0,230,255,0.2)" }}>
                      <span className="flex items-center justify-center gap-1"><Icon name="Pencil" size={11} /> Edit</span>
                    </button>
                    <button className="flex-1 py-1.5 rounded-lg text-xs font-syne font-semibold text-white/50 transition-all hover:bg-white/5"
                      style={{ border: "1px solid rgba(255,255,255,0.08)" }}>
                      <span className="flex items-center justify-center gap-1"><Icon name="Download" size={11} /> Export</span>
                    </button>
                    <button className="py-1.5 px-2 rounded-lg text-white/30 hover:text-white/60 transition-all hover:bg-white/5"
                      style={{ border: "1px solid rgba(255,255,255,0.08)" }}>
                      <Icon name="MoreHorizontal" size={13} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}

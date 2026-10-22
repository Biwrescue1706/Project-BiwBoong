import Navbar from "../components/Navbar";

const websites = [
    {
        title: "เว็บไซต์บันทึกรายรับ-รายจ่าย",
        description: "ระบบบันทึกและจัดการรายรับ-รายจ่าย",
        category: "FINANCE MANAGEMENT",
        icon: "💰",
        url: "https://cashflow-page.smartdorm-biwboong.shop/",
        gradient: "from-violet-500 to-purple-700",
        glow: "group-hover:shadow-purple-500/20",
        accent: "text-violet-200",
        number: "01",
    },
    {
        title: "เว็บไซต์แสดงผลงาน",
        description: "Portfolio และผลงานต่าง ๆ",
        category: "PERSONAL PORTFOLIO",
        icon: "💼",
        url: "http://portfolio-biwboong.smartdorm-biwboong.shop",
        gradient: "from-emerald-400 to-teal-600",
        glow: "group-hover:shadow-emerald-500/20",
        accent: "text-emerald-200",
        number: "02",
    },
    {
        title: "เว็บไซต์ยืมคืนอุปกรณ์",
        description: "ระบบจัดการยืมและคืนอุปกรณ์",
        category: "ASSET MANAGEMENT",
        icon: "📦",
        url: "https://biwbongshop.onrender.com",
        gradient: "from-sky-400 to-blue-700",
        glow: "group-hover:shadow-sky-500/20",
        accent: "text-sky-200",
        number: "03",
    },
    {
        title: "เว็บไซต์คำนวณค่าน้ำค่าไฟ",
        description: "ระบบคำนวณและจัดการค่าน้ำค่าไฟ",
        category: "UTILITY BILLING",
        icon: "💡",
        url: "https://biwbongexpenses.onrender.com",
        gradient: "from-amber-300 to-orange-600",
        glow: "group-hover:shadow-amber-500/20",
        accent: "text-amber-200",
        number: "04",
    },
];

function ArrowIcon() {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1"
            aria-hidden="true"
        >
            <path
                d="M5 12h14m-6-6 6 6-6 6"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}

function CalendarIcon() {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.7"
            className="h-6 w-6"
            aria-hidden="true"
        >
            <rect x="3" y="5" width="18" height="16" rx="3" />
            <path
                d="M16 3v4M8 3v4M3 10h18"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}

export default function Home() {
    return (
        <div className="relative min-h-screen w-full min-w-0 overflow-x-clip bg-[#080b19] font-sarabun text-white">
            <Navbar />

            {/* Ambient background */}
            <div
                className="pointer-events-none fixed inset-0 overflow-hidden"
                aria-hidden="true"
            >
                <div className="absolute -left-40 top-20 h-96 w-96 rounded-full bg-violet-600/15 blur-[120px]" />
                <div className="absolute -right-40 top-64 h-96 w-96 rounded-full bg-cyan-500/10 blur-[120px]" />
                <div className="absolute bottom-0 left-1/3 h-80 w-80 rounded-full bg-emerald-500/10 blur-[120px]" />

                <div
                    className="absolute inset-0 opacity-[0.12]"
                    style={{
                        backgroundImage:
                            "radial-gradient(rgba(148,163,184,0.5) 0.7px, transparent 0.7px)",
                        backgroundSize: "24px 24px",
                    }}
                />
            </div>

            <main className="relative mx-auto w-full min-w-0 max-w-[1500px] px-4 py-7 sm:px-6 sm:py-10 lg:px-10 lg:py-14">
                {/* Hero */}
                <section className="relative isolate overflow-hidden rounded-[28px] border border-white/10 bg-gradient-to-br from-[#171b36] via-[#11162b] to-[#101c30] shadow-2xl shadow-black/20 sm:rounded-[36px]">
                    <div className="pointer-events-none absolute -right-16 -top-24 -z-10 h-80 w-80 rounded-full bg-violet-500/20 blur-[90px]" />
                    <div className="pointer-events-none absolute -bottom-32 left-1/3 -z-10 h-72 w-72 rounded-full bg-cyan-400/10 blur-[90px]" />

                    <div className="grid gap-10 px-6 py-10 sm:px-10 sm:py-14 lg:grid-cols-[1fr_300px] lg:items-center lg:px-14 lg:py-16">
                        <div>
                            <div className="mb-6 inline-flex items-center gap-2.5 rounded-full border border-cyan-300/20 bg-cyan-300/[0.08] px-4 py-2.5">
                                <span className="relative flex h-2.5 w-2.5">
                                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-300 opacity-50" />
                                    <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-300" />
                                </span>

                                <span className="text-xs font-bold tracking-[0.12em] text-cyan-100 sm:text-sm">
                                    BIWBONG DIGITAL SPACE
                                </span>
                            </div>

                            <p className="text-sm font-bold tracking-[0.18em] text-violet-300 sm:text-base">
                                PERSONAL HUB / 2026
                            </p>

                            <h1 className="mt-4 text-3xl font-black leading-tight tracking-tight text-white sm:text-4xl lg:text-5xl xl:text-6xl">
                                ทุกเครื่องมือ
                                <span className="mt-1 block bg-gradient-to-r from-cyan-300 via-violet-300 to-fuchsia-300 bg-clip-text pb-1 text-transparent">
                                    ในพื้นที่เดียว
                                </span>
                            </h1>

                            <p className="mt-5 max-w-2xl text-base font-medium leading-8 text-slate-200 sm:text-lg">
                                ศูนย์รวมเว็บไซต์และตารางเรียนส่วนตัว
                                ออกแบบเพื่อให้เข้าถึงทุกระบบได้ง่าย
                                จัดการงานและกำหนดการต่าง ๆ ได้จากจุดเดียว
                            </p>

                            <div className="mt-8 flex flex-wrap gap-3">
                                <a
                                    href="#websites"
                                    className="inline-flex items-center gap-2.5 rounded-xl bg-white px-5 py-3.5 text-sm font-extrabold text-slate-950 shadow-lg transition hover:-translate-y-0.5 hover:bg-cyan-50 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-cyan-300/50"
                                >
                                    สำรวจเว็บไซต์
                                    <ArrowIcon />
                                </a>

                                <a
                                    href="#calendar"
                                    className="inline-flex items-center gap-2.5 rounded-xl border border-white/15 bg-white/[0.06] px-5 py-3.5 text-sm font-bold text-white transition hover:border-cyan-300/40 hover:bg-white/10 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-cyan-300/30"
                                >
                                    <CalendarIcon />
                                    ดูปฏิทิน
                                </a>
                            </div>
                        </div>

                        {/* Decorative hub graphic */}
                        <div className="hidden lg:flex lg:justify-center">
                            <div className="relative flex h-64 w-64 items-center justify-center">
                                <div className="absolute inset-3 rounded-full border border-cyan-200/15" />
                                <div className="absolute inset-8 rounded-full border border-violet-300/20" />
                                <div className="absolute inset-14 rounded-full border border-dashed border-white/20" />

                                <div className="relative flex h-28 w-28 rotate-[-6deg] items-center justify-center rounded-[30px] border border-white/20 bg-gradient-to-br from-cyan-300 via-blue-500 to-violet-600 shadow-2xl shadow-violet-500/30 transition-transform duration-500 hover:rotate-0">
                                    <span className="text-4xl font-black tracking-tight text-white">
                                        B.
                                    </span>
                                </div>

                                <div className="absolute right-7 top-8 flex h-12 w-12 items-center justify-center rounded-2xl border border-white/15 bg-[#171b36] text-xl shadow-lg">
                                    💻
                                </div>

                                <div className="absolute bottom-8 left-4 flex h-12 w-12 items-center justify-center rounded-2xl border border-white/15 bg-[#171b36] text-xl shadow-lg">
                                    📅
                                </div>

                                <div className="absolute bottom-7 right-5 h-3 w-3 rounded-full bg-emerald-300 shadow-[0_0_18px_rgba(110,231,183,0.8)]" />
                                <div className="absolute left-8 top-10 h-2 w-2 rounded-full bg-violet-300" />
                            </div>
                        </div>
                    </div>

                    <div className="h-1 w-full bg-gradient-to-r from-emerald-300 via-cyan-400 via-violet-500 to-fuchsia-400" />
                </section>

                {/* Website section */}
                <section
                    id="websites"
                    className="scroll-mt-24 pt-10 sm:pt-14 lg:pt-16"
                    aria-labelledby="websites-title"
                >
                    <div className="mb-6 flex flex-col gap-4 sm:mb-8 sm:flex-row sm:items-end sm:justify-between">
                        <div>
                            <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-cyan-300 sm:text-sm">
                                YOUR DIGITAL TOOLKIT
                            </p>

                            <h2
                                id="websites-title"
                                className="mt-2 text-2xl font-black tracking-tight text-white sm:text-3xl"
                            >
                                เว็บไซต์ของฉัน
                            </h2>

                            <p className="mt-2 text-sm font-medium leading-7 text-slate-300 sm:text-base">
                                เลือกระบบที่ต้องการใช้งานได้ทันที
                            </p>
                        </div>

                        <div className="flex w-fit items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-300/10 text-cyan-300">
                                <svg
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="1.8"
                                    className="h-5 w-5"
                                    aria-hidden="true"
                                >
                                    <rect x="3" y="3" width="7" height="7" rx="2" />
                                    <rect x="14" y="3" width="7" height="7" rx="2" />
                                    <rect x="3" y="14" width="7" height="7" rx="2" />
                                    <rect x="14" y="14" width="7" height="7" rx="2" />
                                </svg>
                            </div>

                            <div>
                                <p className="text-lg font-black leading-tight text-white">
                                    04
                                    <span className="ml-1.5 text-xs font-bold text-slate-300">
                                        SYSTEMS
                                    </span>
                                </p>
                                <p className="mt-1 text-xs font-medium text-slate-400">
                                    PERSONAL WORKSPACE
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 xl:grid-cols-4">
                        {websites.map((website) => (
                            <a
                                key={website.url}
                                href={website.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={`group relative flex min-h-[230px] min-w-0 flex-col overflow-hidden rounded-[26px] border border-white/10 bg-[#12172a] p-5 shadow-lg shadow-black/10 transition duration-300 hover:-translate-y-1.5 hover:border-white/20 hover:shadow-2xl ${website.glow} focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-cyan-300/40 sm:min-h-[250px] sm:rounded-[30px] sm:p-6`}
                            >
                                <div
                                    className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${website.gradient}`}
                                />

                                <div
                                    className={`pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full bg-gradient-to-br ${website.gradient} opacity-[0.09] blur-2xl transition duration-500 group-hover:scale-125 group-hover:opacity-20`}
                                />

                                <div className="relative flex items-start justify-between gap-3">
                                    <div
                                        className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${website.gradient} text-3xl shadow-lg transition duration-300 group-hover:rotate-[-5deg] group-hover:scale-105`}
                                    >
                                        <span aria-hidden="true">{website.icon}</span>
                                    </div>

                                    <span className="pt-1 text-xs font-extrabold tracking-widest text-slate-400">
                                        {website.number}
                                    </span>
                                </div>

                                <div className="relative mt-6">
                                    <p
                                        className={`text-[10px] font-extrabold tracking-[0.14em] ${website.accent} sm:text-xs`}
                                    >
                                        {website.category}
                                    </p>

                                    <h3 className="mt-2 break-words text-lg font-extrabold leading-snug text-white transition-colors group-hover:text-cyan-200 sm:text-xl">
                                        {website.title}
                                    </h3>

                                    <p className="mt-2 break-words text-sm font-medium leading-6 text-slate-300">
                                        {website.description}
                                    </p>
                                </div>

                                <div className="relative mt-auto flex items-center justify-between pt-6">
                                    <span className="text-xs font-bold text-slate-300">
                                        เปิดเว็บไซต์
                                    </span>

                                    <span
                                        className={`flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${website.gradient} text-white shadow-md transition duration-300 group-hover:translate-x-1`}
                                        aria-hidden="true"
                                    >
                                        <ArrowIcon />
                                    </span>
                                </div>
                            </a>
                        ))}
                    </div>
                </section>

                {/* Calendar section */}
                <section
                    id="calendar"
                    className="scroll-mt-24 pt-12 sm:pt-16 lg:pt-20"
                    aria-labelledby="calendar-title"
                >
                    <div className="relative overflow-hidden rounded-[28px] border border-white/10 bg-gradient-to-br from-[#151b31] to-[#101525] p-5 shadow-2xl shadow-black/10 sm:rounded-[32px] sm:p-8 lg:p-10">
                        <div className="pointer-events-none absolute -right-16 -top-20 h-64 w-64 rounded-full bg-cyan-400/10 blur-[90px]" />

                        <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                                <div className="inline-flex items-center gap-2 rounded-full border border-violet-300/20 bg-violet-300/10 px-3 py-1.5 text-xs font-bold text-violet-200">
                                    <CalendarIcon />
                                    PERSONAL SCHEDULE
                                </div>

                                <h2
                                    id="calendar-title"
                                    className="mt-4 break-words text-2xl font-black tracking-tight text-white sm:text-3xl lg:text-4xl"
                                >
                                    Google Calendar
                                    <span className="mt-1 block text-cyan-300 sm:inline sm:pl-2">
                                        – BiwBong
                                    </span>
                                </h2>

                                <p className="mt-3 text-sm font-medium leading-7 text-slate-300 sm:text-base">
                                    ปฏิทินตารางเรียนและกำหนดการต่าง ๆ
                                </p>
                            </div>

                            <div className="flex w-fit items-center gap-2 rounded-xl border border-emerald-300/20 bg-emerald-300/[0.07] px-4 py-3">
                                <span className="h-2.5 w-2.5 rounded-full bg-emerald-300" />
                                <span className="text-sm font-bold text-emerald-200">
                                    ตารางกำหนดการ
                                </span>
                            </div>
                        </div>

                        <div className="relative mt-7 overflow-hidden rounded-2xl border border-white/10 bg-white p-1.5 shadow-2xl sm:mt-9 sm:rounded-3xl sm:p-2">
                            <iframe
                                src="https://calendar.google.com/calendar/embed?src=bewrockgame1%40gmail.com&ctz=Asia%2FBangkok"
                                title="Google Calendar – BiwBong"
                                className="block h-[450px] w-full border-0 sm:h-[600px] lg:h-[700px]"
                                loading="lazy"
                            />
                        </div>

                        <p className="relative mt-4 text-xs font-medium leading-6 text-slate-400">
                            หมายเหตุ: การแสดงปฏิทินขึ้นอยู่กับการตั้งค่าการแชร์ของ Google Calendar
                        </p>
                    </div>
                </section>
            </main>

            {/* Footer */}
            <footer className="mt-8 hidden border-t border-indigo-100 bg-white px-4 py-6 text-center sm:block">
                <div className="mx-auto flex max-w-6xl flex-col items-center gap-2">
                    <p className="text-sm font-semibold leading-6 text-slate-300 sm:text-base">
                        © 2025 - 2026 เว็บไซต์ของฉัน สงวนลิขสิทธิ์.
                    </p>

                    <p className="text-xs font-bold tracking-[0.16em] text-slate-500">
                        BIWBONG · PERSONAL DIGITAL SPACE
                    </p>
                </div>
            </footer>
        </div>
    );
}
import Navbar from "../components/Navbar";

const timetables = [
    {
        title: "ตารางเรียนปัจจุบัน",
        description: "Current Timetable",
        url: "/current-timetable",
        term: "NOW",
        accent: "#A5F3D0",
        gradient: "from-emerald-400 via-teal-500 to-cyan-600",
        glow: "group-hover:shadow-emerald-500/20",
        number: "00",
    },
    {
        title: "ตารางเรียน 1/2568",
        description: "ภาคเรียนที่ 1",
        url: "/term-1-2568",
        term: "TERM 01",
        accent: "#93C5FD",
        gradient: "from-blue-500 via-indigo-500 to-violet-600",
        glow: "group-hover:shadow-indigo-500/20",
        number: "01",
    },
    {
        title: "ตารางเรียน 2/2568",
        description: "ภาคเรียนที่ 2",
        url: "/term-2-2568",
        term: "TERM 02",
        accent: "#D8B4FE",
        gradient: "from-violet-500 via-purple-500 to-fuchsia-600",
        glow: "group-hover:shadow-purple-500/20",
        number: "02",
    },
    {
        title: "ตารางเรียน 1/2567",
        description: "ภาคเรียนที่ 1",
        url: "/term-1-2567",
        term: "TERM 01",
        accent: "#FCD34D",
        gradient: "from-amber-400 via-orange-500 to-rose-500",
        glow: "group-hover:shadow-orange-500/20",
        number: "03",
    },
    {
        title: "ตารางเรียน 2/2567",
        description: "ภาคเรียนที่ 2",
        url: "/term-2-2567",
        term: "TERM 02",
        accent: "#67E8F9",
        gradient: "from-cyan-400 via-sky-500 to-blue-600",
        glow: "group-hover:shadow-cyan-500/20",
        number: "04",
    },
    {
        title: "ตารางเรียน 1/2566",
        description: "ภาคเรียนที่ 1",
        url: "/term-1-2566",
        term: "TERM 01",
        accent: "#FDA4AF",
        gradient: "from-rose-400 via-pink-500 to-fuchsia-600",
        glow: "group-hover:shadow-pink-500/20",
        number: "05",
    },
    {
        title: "ตารางเรียน 2/2566",
        description: "ภาคเรียนที่ 2",
        url: "/term-2-2566",
        term: "TERM 02",
        accent: "#CBD5E1",
        gradient: "from-slate-400 via-slate-500 to-slate-700",
        glow: "group-hover:shadow-slate-500/20",
        number: "06",
    },
];

function CalendarIcon() {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            className="h-6 w-6"
            aria-hidden="true"
        >
            <rect x="3.5" y="5" width="17" height="15" rx="3" />
            <path
                d="M7.5 3v4M16.5 3v4M3.5 10h17M8 14h.01M12 14h.01M16 14h.01M8 17h.01M12 17h.01"
                strokeLinecap="round"
            />
        </svg>
    );
}

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

function NoticeIcon() {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            className="h-5 w-5"
            aria-hidden="true"
        >
            <path
                d="M12 8v4m0 4h.01M10.3 3.9 2.7 17a2 2 0 0 0 1.7 3h15.2a2 2 0 0 0 1.7-3l-7.6-13.1a2 2 0 0 0-3.4 0Z"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}

export default function Timetable() {
    return (
        <div className="relative isolate min-h-screen w-full min-w-0 overflow-x-clip bg-[#080b19] font-sarabun text-slate-100">

            {/* Aurora Background */}
            <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
            >
                <div className="absolute -left-40 top-20 h-96 w-96 rounded-full bg-violet-600/15 blur-[120px]" />
                <div className="absolute -right-40 top-1/3 h-96 w-96 rounded-full bg-cyan-400/10 blur-[120px]" />
                <div className="absolute bottom-40 left-1/3 h-80 w-80 rounded-full bg-emerald-400/10 blur-[120px]" />
            </div>

            <main className="relative z-10 mx-auto w-full min-w-0 max-w-[1500px] px-4 py-6 pb-24 sm:px-6 sm:py-9 sm:pb-24 lg:px-10 lg:py-12">
                {/* Hero */}
                <section className="relative isolate overflow-hidden rounded-[28px] border border-white/10 bg-[#171936] shadow-2xl shadow-indigo-950/20 sm:rounded-[36px]">
                    <div className="pointer-events-none absolute -right-20 -top-28 -z-10 h-80 w-80 rounded-full bg-violet-600/30 blur-3xl" />
                    <div className="pointer-events-none absolute -bottom-32 left-1/3 -z-10 h-72 w-72 rounded-full bg-emerald-400/15 blur-3xl" />

                    <div className="relative grid gap-8 px-6 py-9 sm:px-9 sm:py-12 lg:grid-cols-[1fr_260px] lg:items-center lg:px-12 lg:py-14">
                        <div>
                            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-emerald-300/30 bg-emerald-300/10 px-4 py-2 text-sm font-bold tracking-wide text-emerald-200">
                                <span className="h-2 w-2 rounded-full bg-emerald-300 shadow-[0_0_12px_rgba(110,231,183,0.9)]" />
                                PERSONAL ACADEMIC SPACE
                            </div>

                            <p className="text-sm font-semibold tracking-wide text-indigo-200 sm:text-base">
                                BIWBONG / ACADEMIC CENTER
                            </p>

                            <h1 className="mt-3 text-3xl font-black leading-tight tracking-tight text-white sm:text-4xl lg:text-5xl">
                                ทุกภาคเรียน
                                <span className="block bg-gradient-to-r from-emerald-300 via-cyan-300 to-violet-300 bg-clip-text text-transparent">
                                    ในพื้นที่เดียว
                                </span>
                            </h1>

                            <p className="mt-4 max-w-xl text-base font-medium leading-8 text-slate-200 sm:text-lg">
                                ศูนย์รวมตารางเรียนสาขาวิศวกรรมคอมพิวเตอร์
                                ย้อนดูตารางเรียนแต่ละภาคการศึกษาได้อย่างสะดวก
                                จัดระเบียบทุกช่วงเวลาของการเรียนไว้ในที่เดียว
                            </p>

                            <div className="mt-7 flex flex-wrap gap-2">
                                <span className="rounded-lg border border-white/15 bg-white/10 px-3 py-2 text-xs font-semibold text-white sm:text-sm">
                                    COMPUTER ENGINEERING
                                </span>
                                <span className="rounded-lg border border-white/15 bg-white/10 px-3 py-2 text-xs font-semibold text-white sm:text-sm">
                                    2566 — 2568
                                </span>
                            </div>
                        </div>

                        {/* Calendar Illustration */}
                        <div className="hidden lg:block">
                            <div className="relative mx-auto flex h-56 w-56 items-center justify-center rounded-[40px] border border-white/15 bg-white/[0.06] shadow-2xl backdrop-blur-sm">
                                <div className="absolute inset-4 rounded-[30px] border border-white/10" />

                                <div className="relative flex h-32 w-32 rotate-[-6deg] items-center justify-center rounded-[28px] bg-gradient-to-br from-emerald-300 via-cyan-400 to-indigo-500 text-[#171936] shadow-xl shadow-cyan-500/20 transition-transform duration-500 hover:rotate-0">
                                    <CalendarIcon />
                                    <span className="absolute bottom-4 right-4 text-sm font-black">
                                        66+
                                    </span>
                                </div>

                                <span className="absolute right-4 top-7 h-3 w-3 rounded-full bg-violet-300" />
                                <span className="absolute bottom-7 left-5 h-4 w-4 rounded-md bg-orange-300" />
                            </div>
                        </div>
                    </div>

                    <div className="h-1 w-full bg-gradient-to-r from-emerald-300 via-cyan-400 via-violet-500 to-pink-400" />
                </section>

                {/* Section Heading */}
                <section className="mb-5 mt-9 flex flex-col justify-between gap-4 sm:mb-7 sm:mt-12 sm:flex-row sm:items-end">
                    <div>
                        <p className="text-sm font-bold uppercase tracking-[0.15em] text-emerald-300">
                            Your learning timeline
                        </p>

                        <h2 className="mt-2 text-2xl font-black tracking-tight text-white sm:text-3xl">
                            เลือกตารางเรียน
                        </h2>

                        <p className="mt-2 text-base font-medium leading-7 text-slate-400">
                            เลือกภาคเรียนที่ต้องการเพื่อเปิดดูรายละเอียด
                        </p>
                    </div>

                    {/* Timetable Count */}
                    <div className="flex w-fit items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.05] px-4 py-3 shadow-lg shadow-black/10 backdrop-blur-md">
                        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-400/15 text-indigo-300">
                            <CalendarIcon />
                        </span>

                        <div>
                            <p className="text-xl font-black leading-tight text-white">
                                {timetables.length}
                                <span className="ml-1.5 text-sm font-bold text-slate-300">
                                    ตาราง
                                </span>
                            </p>

                            <p className="mt-1 text-xs font-semibold text-slate-400">
                                AVAILABLE TIMETABLES
                            </p>
                        </div>
                    </div>
                </section>

                {/* Timetable Cards */}
                <section
                    aria-label="รายการตารางเรียน"
                    className="grid w-full min-w-0 grid-cols-1 gap-4 min-[640px]:grid-cols-2 min-[1024px]:grid-cols-3 min-[1400px]:grid-cols-4 sm:gap-5"
                >
                    {timetables.map((item, index) => (
                        <a
                            key={item.url}
                            href={item.url}
                            className={`group relative flex min-h-[200px] min-w-0 flex-col overflow-hidden rounded-[24px] border border-white/10 bg-[#11172a] p-5 shadow-lg shadow-black/10 transition duration-300 hover:-translate-y-1.5 hover:border-white/20 hover:shadow-xl ${item.glow} focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-indigo-300 sm:min-h-[215px] sm:rounded-[28px] sm:p-6`}
                            style={{ animationDelay: `${index * 60}ms` }}
                        >
                            {/* Colored Top Strip */}
                            <div
                                className={`absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r ${item.gradient}`}
                            />

                            {/* Background Decoration */}
                            <div
                                className={`pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-gradient-to-br ${item.gradient} opacity-[0.08] transition duration-500 group-hover:scale-150 group-hover:opacity-[0.16]`}
                            />

                            <div className="relative flex items-start justify-between gap-3">
                                <div
                                    className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${item.gradient} text-white shadow-lg transition duration-300 group-hover:rotate-[-6deg] group-hover:scale-110`}
                                >
                                    <CalendarIcon />
                                </div>

                                <span
                                    className="rounded-lg px-3 py-1.5 text-xs font-extrabold tracking-wide"
                                    style={{
                                        backgroundColor: `${item.accent}20`,
                                        color: item.accent,
                                    }}
                                >
                                    {item.term}
                                </span>
                            </div>

                            <div className="relative mt-6 min-w-0">
                                <h3 className="break-words text-lg font-bold leading-snug text-white transition-colors group-hover:text-emerald-300 sm:text-xl">
                                    {item.title}
                                </h3>

                                <p className="mt-2 break-words text-sm font-medium leading-6 text-slate-400 sm:text-base">
                                    {item.description}
                                </p>
                            </div>

                            <div className="relative mt-auto flex items-center justify-between gap-2 pt-5">
                                <span className="text-xs font-semibold tracking-wide text-slate-500">
                                    ACADEMIC RECORD / {item.number}
                                </span>

                                <span
                                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${item.gradient} text-white shadow-sm transition duration-300 group-hover:translate-x-1 group-hover:shadow-md`}
                                    aria-hidden="true"
                                >
                                    <ArrowIcon />
                                </span>
                            </div>
                        </a>
                    ))}
                </section>

            </main>

        </div>
    );
}
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft } from "lucide-react";

const timeSlots = [
    "09:00",
    "10:00",
    "11:00",
    "12:00",
    "13:00",
    "14:00",
    "15:00",
    "16:00",
];

const schedule = [
    { day: "จันทร์", shortDay: "จ.", courses: [] },
    {
        day: "อังคาร",
        shortDay: "อ.",
        courses: [
            {
                code: "CE379",
                title: "เครือข่ายอินเทอร์เน็ตของอุปกรณ์อัจฉริยะ",
                time: "09:00 - 13:00",
                room: "S.001 R.592",
                teacher: "ดร.เด่นเดช",
                start: 0,
                span: 4,
                color: "violet",
            },
        ],
    },
    {
        day: "พุธ",
        shortDay: "พ.",
        courses: [
            {
                code: "CE378",
                title: "ความมั่นคงในระบบสารสนเทศ",
                time: "09:00 - 12:00",
                room: "S.001 R.51104",
                teacher: "ผศ.ดร.ชัยพร",
                start: 0,
                span: 3,
                color: "cyan",
            },
        ],
    },
    {
        day: "พฤหัสบดี",
        shortDay: "พฤ.",
        courses: [
            {
                code: "CE499",
                title: "โครงงานวิศวกรรมคอมพิวเตอร์ 2",
                time: "13:30 - 16:30",
                room: "S.312 R.585",
                teacher: "อ.สนายุ",
                start: 4,
                span: 4,
                color: "orange",
            },
        ],
    },
    { day: "ศุกร์", shortDay: "ศ.", courses: [] },
];

const instructors = [
    {
        name: "ดร.เด่นเดช รักษ์รัตน์ตรัย",
        subject: "เครือข่ายอินเทอร์เน็ตของอุปกรณ์อัจฉริยะ",
        color: "bg-violet-500",
    },
    {
        name: "ผศ.ดร.ชัยพร เขมะภาตะพันธ์",
        subject: "ความมั่นคงในระบบสารสนเทศ",
        color: "bg-cyan-500",
    },
    {
        name: "อ.สนายุ จินตนาวรรณกุล",
        subject: "โครงงานวิศวกรรมคอมพิวเตอร์ 2",
        color: "bg-orange-500",
    },
];

const courseColors = {
    violet: {
        border: "border-violet-200",
        background: "bg-violet-50",
        badge: "bg-violet-100 text-violet-700",
        dot: "bg-violet-500",
        heading: "text-violet-700",
    },
    cyan: {
        border: "border-cyan-200",
        background: "bg-cyan-50",
        badge: "bg-cyan-100 text-cyan-700",
        dot: "bg-cyan-500",
        heading: "text-cyan-700",
    },
    orange: {
        border: "border-orange-200",
        background: "bg-orange-50",
        badge: "bg-orange-100 text-orange-700",
        dot: "bg-orange-500",
        heading: "text-orange-700",
    },
};

function CourseDetails({ course, compact = false }) {
    const palette = courseColors[course.color];

    return (
        <div className={compact ? "space-y-2" : "space-y-3"}>
            <div className="flex flex-wrap items-center gap-2">
                <span
                    className={`inline-flex rounded-lg px-2.5 py-1 text-xs font-extrabold tracking-wide ${palette.badge}`}
                >
                    {course.code}
                </span>

                <span className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500">
                    <span
                        className={`h-1.5 w-1.5 rounded-full ${palette.dot}`}
                    />
                    วิชาเรียน
                </span>
            </div>

            <h3
                className={`font-bold leading-relaxed text-slate-800 ${compact ? "text-sm" : "text-sm xl:text-base"
                    }`}
            >
                {course.title}
            </h3>

            <div className="space-y-2 border-t border-black/5 pt-3 text-xs text-slate-600 sm:text-sm">
                <p className="flex items-start gap-2">
                    <span className="w-12 shrink-0 font-semibold text-slate-400">
                        เวลา
                    </span>
                    <span className="font-semibold text-slate-700">
                        {course.time} น.
                    </span>
                </p>

                <p className="flex items-start gap-2">
                    <span className="w-12 shrink-0 font-semibold text-slate-400">
                        ห้อง
                    </span>
                    <span className="font-medium">{course.room}</span>
                </p>

                <p className="flex items-start gap-2">
                    <span className="w-12 shrink-0 font-semibold text-slate-400">
                        ผู้สอน
                    </span>
                    <span>{course.teacher}</span>
                </p>
            </div>
        </div>
    );
}

export default function CurrentTimetable() {
    const navigate = useNavigate();

    const [deferredPrompt, setDeferredPrompt] = useState(null);
    const deferredPromptRef = useRef(null);

    useEffect(() => {
        const handleBeforeInstall = (event) => {
            event.preventDefault();
            deferredPromptRef.current = event;
            setDeferredPrompt(event);
        };

        const handleInstallClick = async (event) => {
            if (!(event.target instanceof Element)) return;

            const button = event.target.closest("#installAppBtn");

            if (!button || !deferredPromptRef.current) return;

            event.preventDefault();

            const promptEvent = deferredPromptRef.current;
            deferredPromptRef.current = null;
            setDeferredPrompt(null);

            await promptEvent.prompt();
            await promptEvent.userChoice;
        };

        const handleAppInstalled = () => {
            deferredPromptRef.current = null;
            setDeferredPrompt(null);
        };

        window.addEventListener(
            "beforeinstallprompt",
            handleBeforeInstall
        );

        document.addEventListener("click", handleInstallClick);

        window.addEventListener("appinstalled", handleAppInstalled);

        return () => {
            window.removeEventListener(
                "beforeinstallprompt",
                handleBeforeInstall
            );

            document.removeEventListener(
                "click",
                handleInstallClick
            );

            window.removeEventListener(
                "appinstalled",
                handleAppInstalled
            );
        };
    }, []);

    const totalCourses = schedule.reduce(
        (total, day) => total + day.courses.length,
        0
    );

    const studyDays = schedule.filter(
        (day) => day.courses.length > 0
    ).length;

    return (
        <div className="relative min-h-screen w-full min-w-0 overflow-x-clip bg-[#080b19] font-sarabun text-slate-100">
            {/* Background Aurora */}
            <div className="pointer-events-none fixed inset-0 -z-0 overflow-hidden">
                <div className="absolute -left-40 top-20 h-96 w-96 rounded-full bg-violet-600/10 blur-[120px]" />
                <div className="absolute -right-40 top-1/3 h-96 w-96 rounded-full bg-cyan-400/10 blur-[120px]" />
                <div className="absolute bottom-0 left-1/3 h-80 w-80 rounded-full bg-emerald-400/10 blur-[120px]" />
            </div>

            <main className="mx-auto max-w-[1600px] px-4 py-4 sm:px-5 sm:py-8 lg:px-8">
                {/* Back button */}
                <button
                    type="button"
                    onClick={() => navigate(-1)}
                    className="mb-5 inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-sm font-medium text-slate-300 transition hover:border-cyan-300/30 hover:bg-white/[0.08] hover:text-white"
                >
                    <ChevronLeft className="h-4 w-4" />
                    ย้อนกลับ
                </button>

                {/* Hero */}
                <section className="relative isolate mb-6 overflow-hidden rounded-[28px] bg-gradient-to-br from-[#25205f] via-[#4338a5] to-[#6959e8] px-5 py-8 text-white shadow-xl shadow-indigo-900/15 sm:px-8 sm:py-10 lg:px-10 lg:py-12">
                    <div className="pointer-events-none absolute -right-16 -top-24 -z-10 h-64 w-64 rounded-full border-[35px] border-white/5" />

                    <div className="pointer-events-none absolute -bottom-28 right-1/4 -z-10 h-64 w-64 rounded-full bg-cyan-300/10 blur-3xl" />

                    <div className="pointer-events-none absolute right-10 top-10 -z-10 hidden h-24 w-24 rotate-12 rounded-3xl border border-white/10 sm:block" />

                    <div className="relative grid items-center gap-8 lg:grid-cols-[1fr_auto]">
                        <div>
                            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3.5 py-2 text-xs font-medium text-indigo-100 backdrop-blur-sm sm:text-sm">
                                <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-300" />
                                STUDENT DASHBOARD
                                <span className="text-white/40">/</span>
                                ภาคเรียนที่กำลังศึกษา
                            </div>

                            <p className="text-sm font-medium text-indigo-200 sm:text-base">
                                มหาวิทยาลัยธุรกิจบัณฑิตย์
                            </p>

                            <h1 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl lg:text-5xl">
                                ตารางเรียน
                                <span className="mt-1 block text-cyan-300">
                                    ปัจจุบัน
                                </span>
                            </h1>

                            <p className="mt-4 max-w-xl text-sm leading-7 text-indigo-100/90 sm:text-base">
                                วางแผนการเรียนของคุณในแต่ละวัน
                                พร้อมรายละเอียดรายวิชา เวลา และห้องเรียน
                                ครบจบในหน้าเดียว
                            </p>

                            <div className="mt-6 flex flex-wrap items-center gap-3 text-xs text-indigo-100 sm:text-sm">
                                <span className="rounded-xl border border-white/15 bg-white/10 px-3 py-2">
                                    วิศวกรรมคอมพิวเตอร์
                                </span>

                                <span className="rounded-xl border border-white/15 bg-white/10 px-3 py-2">
                                    ชั้นปีที่ 3 · รหัส 66
                                </span>
                            </div>
                        </div>

                        <div className="hidden lg:flex lg:justify-center">
                            <div className="relative flex h-44 w-44 items-center justify-center rounded-[36px] border border-white/20 bg-white/10 shadow-2xl backdrop-blur-md xl:h-52 xl:w-52">
                                <div className="absolute inset-3 rounded-[28px] border border-white/10" />

                                <div className="text-center">
                                    <div className="text-6xl font-black tracking-tighter text-white xl:text-7xl">
                                        66
                                    </div>

                                    <div className="mt-2 text-xs font-bold tracking-[0.25em] text-cyan-200">
                                        COMPUTER ENG.
                                    </div>

                                    <div className="mt-3 text-xs text-indigo-100">
                                        TRANSFER PROGRAM
                                    </div>
                                </div>

                                <div className="absolute -right-3 top-7 h-7 w-7 rounded-xl bg-cyan-300 shadow-lg shadow-cyan-400/30" />

                                <div className="absolute -bottom-2 left-7 h-5 w-5 rounded-full bg-orange-300" />
                            </div>
                        </div>
                    </div>
                </section>

                {/* Semester information */}
                <section className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
                    <div className="group flex items-center gap-4 rounded-2xl border border-indigo-100/80 bg-white p-4 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-md sm:p-5">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-indigo-50 text-xl text-indigo-600 transition group-hover:bg-indigo-600 group-hover:text-white">
                            <span aria-hidden="true">▦</span>
                        </div>

                        <div>
                            <p className="text-xs font-medium text-slate-400">
                                รายวิชาทั้งหมด
                            </p>

                            <p className="mt-1 text-2xl font-black text-slate-800">
                                {totalCourses}

                                <span className="ml-1.5 text-xs font-medium text-slate-400">
                                    วิชา
                                </span>
                            </p>
                        </div>
                    </div>

                    <div className="group flex items-center gap-4 rounded-2xl border border-cyan-100/80 bg-white p-4 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-md sm:p-5">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-cyan-50 text-xl text-cyan-600 transition group-hover:bg-cyan-500 group-hover:text-white">
                            <span aria-hidden="true">◷</span>
                        </div>

                        <div>
                            <p className="text-xs font-medium text-slate-400">
                                วันที่มีเรียน
                            </p>

                            <p className="mt-1 text-2xl font-black text-slate-800">
                                {studyDays}

                                <span className="ml-1.5 text-xs font-medium text-slate-400">
                                    วัน / สัปดาห์
                                </span>
                            </p>
                        </div>
                    </div>

                    <div className="group flex items-center gap-4 rounded-2xl border border-orange-100/80 bg-white p-4 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-md sm:p-5">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-orange-50 text-xl text-orange-600 transition group-hover:bg-orange-500 group-hover:text-white">
                            <span aria-hidden="true">⌑</span>
                        </div>

                        <div>
                            <p className="text-xs font-medium text-slate-400">
                                ระยะเวลาภาคเรียน
                            </p>

                            <p className="mt-1 text-sm font-extrabold leading-6 text-slate-800 sm:text-base">
                                12 ม.ค. – 10 พ.ค. 2569
                            </p>
                        </div>
                    </div>
                </section>

                {/* Program information */}
                <section className="mb-8 flex flex-col gap-3 rounded-2xl border border-indigo-100 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:p-5">
                    <div className="flex items-start gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-500 text-lg text-white shadow-md shadow-indigo-500/20">
                            <span aria-hidden="true">✦</span>
                        </div>

                        <div>
                            <h2 className="font-bold text-slate-800">
                                วิทยาลัยวิศวกรรมศาสตร์และเทคโนโลยี
                            </h2>

                            <p className="mt-1 text-xs leading-6 text-slate-500 sm:text-sm">
                                สาขาวิชาวิศวกรรมคอมพิวเตอร์ · ปริญญาตรี

                                <span className="hidden sm:inline"> · </span>

                                <span className="block sm:inline">
                                    หลักสูตรเทียบโอนจาก ปวส. ภาษาไทย
                                </span>
                            </p>
                        </div>
                    </div>

                    <div className="w-fit rounded-xl bg-indigo-50 px-3 py-2 text-xs font-bold text-indigo-700">
                        ACADEMIC YEAR 2569
                    </div>
                </section>

                {/* Timetable heading */}
                <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
                    <div>
                        <p className="text-xs font-bold uppercase tracking-[0.2em] text-indigo-500">
                            Weekly planner
                        </p>

                        <h2 className="mt-1 text-2xl font-black tracking-tight text-slate-800 sm:text-3xl">
                            ตารางประจำสัปดาห์
                        </h2>

                        <p className="mt-2 text-sm text-slate-500">
                            เลือกดูรายวิชาตามวันและช่วงเวลา
                        </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 text-xs font-medium text-slate-500">
                        <span className="flex items-center gap-1.5">
                            <span className="h-2.5 w-2.5 rounded-full bg-violet-500" />
                            CE379
                        </span>

                        <span className="flex items-center gap-1.5">
                            <span className="h-2.5 w-2.5 rounded-full bg-cyan-500" />
                            CE378
                        </span>

                        <span className="flex items-center gap-1.5">
                            <span className="h-2.5 w-2.5 rounded-full bg-orange-500" />
                            CE499
                        </span>
                    </div>
                </div>

                {/* Desktop timetable */}
                <section className="mb-8 hidden min-[1400px]:block">
                    <div className="overflow-hidden rounded-[24px] border border-slate-200 bg-white shadow-sm">
                        <div className="overflow-x-auto">
                            <div className="min-w-[1200px]">
                                <div
                                    className="grid bg-[#28235f] text-white"
                                    style={{
                                        gridTemplateColumns:
                                            "125px repeat(8, minmax(0, 1fr))",
                                    }}
                                >
                                    <div className="flex items-center justify-center border-r border-white/10 px-3 py-5 text-sm font-bold">
                                        วัน / เวลา
                                    </div>

                                    {timeSlots.map((slot, index) => (
                                        <div
                                            key={slot}
                                            className="border-r border-white/10 px-2 py-4 text-center last:border-r-0"
                                        >
                                            <p className="text-sm font-bold">
                                                {slot}
                                            </p>

                                            <p className="mt-1 text-[10px] text-indigo-200">
                                                {index === 7
                                                    ? "17:00"
                                                    : timeSlots[index + 1]}
                                            </p>
                                        </div>
                                    ))}
                                </div>

                                {schedule.map((day, dayIndex) => (
                                    <div
                                        key={day.day}
                                        className={`grid min-h-[145px] border-b border-slate-100 last:border-b-0 ${dayIndex % 2 === 0
                                                ? "bg-white"
                                                : "bg-slate-50/60"
                                            }`}
                                        style={{
                                            gridTemplateColumns:
                                                "125px repeat(8, minmax(0, 1fr))",
                                        }}
                                    >
                                        <div className="flex flex-col items-center justify-center gap-2 border-r border-slate-100 px-2 py-4">
                                            <span
                                                className={`flex h-10 w-10 items-center justify-center rounded-xl text-sm font-black ${day.courses.length
                                                        ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/20"
                                                        : "bg-slate-100 text-slate-500"
                                                    }`}
                                            >
                                                {day.shortDay}
                                            </span>

                                            <span className="text-sm font-bold text-slate-700">
                                                {day.day}
                                            </span>
                                        </div>

                                        <div
                                            className="col-span-8 grid"
                                            style={{
                                                gridTemplateColumns:
                                                    "repeat(8, minmax(0, 1fr))",
                                            }}
                                        >
                                            {day.courses.length > 0 ? (
                                                day.courses.map((course) => {
                                                    const palette =
                                                        courseColors[
                                                        course.color
                                                        ];

                                                    return (
                                                        <div
                                                            key={course.code}
                                                            className={`m-2 rounded-2xl border p-3 transition duration-200 hover:-translate-y-0.5 hover:shadow-md ${palette.border} ${palette.background}`}
                                                            style={{
                                                                gridColumn: `${course.start + 1
                                                                    } / span ${course.span
                                                                    }`,
                                                            }}
                                                        >
                                                            <CourseDetails
                                                                course={course}
                                                                compact
                                                            />
                                                        </div>
                                                    );
                                                })
                                            ) : (
                                                <div className="col-span-8 flex items-center justify-center">
                                                    <span className="rounded-full bg-slate-100 px-4 py-2 text-xs font-medium text-slate-400">
                                                        ไม่มีเรียนในวันนี้
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                {/* Mobile and tablet timetable */}
                <section className="mb-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 min-[1400px]:hidden">
                    {schedule.map((day) => (
                        <article
                            key={day.day}
                            className="group overflow-hidden rounded-[22px] border border-slate-200/80 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-indigo-900/5"
                        >
                            <div className="flex items-center justify-between border-b border-slate-100 px-4 py-4">
                                <div className="flex items-center gap-3">
                                    <div
                                        className={`flex h-11 w-11 items-center justify-center rounded-2xl text-sm font-black transition duration-300 group-hover:scale-105 ${day.courses.length
                                                ? "bg-gradient-to-br from-indigo-500 to-violet-600 text-white shadow-lg shadow-indigo-500/20"
                                                : "bg-slate-100 text-slate-500"
                                            }`}
                                    >
                                        {day.shortDay}
                                    </div>

                                    <div>
                                        <h3 className="font-bold text-slate-800">
                                            {day.day}
                                        </h3>

                                        <p className="mt-1 text-[11px] text-slate-400">
                                            {day.courses.length
                                                ? "มีตารางเรียน"
                                                : "วันว่าง"}
                                        </p>
                                    </div>
                                </div>

                                <span
                                    className={`rounded-full px-3 py-1.5 text-[11px] font-bold ${day.courses.length
                                            ? "bg-indigo-50 text-indigo-600"
                                            : "bg-slate-100 text-slate-400"
                                        }`}
                                >
                                    {day.courses.length
                                        ? `${day.courses.length} วิชา`
                                        : "ไม่มีเรียน"}
                                </span>
                            </div>

                            <div className="p-4">
                                {day.courses.length > 0 ? (
                                    <div className="space-y-3">
                                        {day.courses.map((course) => {
                                            const palette =
                                                courseColors[course.color];

                                            return (
                                                <div
                                                    key={course.code}
                                                    className={`relative overflow-hidden rounded-2xl border p-4 transition duration-200 hover:shadow-md ${palette.border} ${palette.background}`}
                                                >
                                                    <div
                                                        className={`absolute bottom-0 left-0 top-0 w-1 ${palette.dot}`}
                                                    />

                                                    <div className="pl-2">
                                                        <CourseDetails
                                                            course={course}
                                                        />
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-slate-50/70 px-3 py-8 text-center">
                                        <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-xl text-slate-300 shadow-sm">
                                            <span aria-hidden="true">
                                                ☼
                                            </span>
                                        </div>

                                        <p className="text-sm font-semibold text-slate-500">
                                            วันนี้ไม่มีเรียน
                                        </p>

                                        <p className="mt-1 text-xs text-slate-400">
                                            มีเวลาสำหรับงานและการพักผ่อน
                                        </p>
                                    </div>
                                )}
                            </div>

                            <div className="h-1 w-full bg-gradient-to-r from-indigo-500 via-violet-400 to-cyan-400 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                        </article>
                    ))}
                </section>

                {/* Instructors */}
                <section className="mb-6 overflow-hidden rounded-[24px] border border-slate-200/80 bg-white shadow-sm">
                    <div className="flex flex-col gap-2 border-b border-slate-100 bg-gradient-to-r from-white to-indigo-50/70 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
                        <div>
                            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-indigo-500">
                                Teaching team
                            </p>

                            <h2 className="mt-1 text-xl font-black text-slate-800">
                                อาจารย์ผู้สอน
                            </h2>
                        </div>

                        <span className="w-fit rounded-full border border-indigo-100 bg-white px-3 py-1.5 text-xs font-semibold text-indigo-600">
                            {instructors.length} ผู้สอน
                        </span>
                    </div>

                    <div className="grid grid-cols-1 divide-y divide-slate-100 sm:grid-cols-2 sm:divide-y-0 lg:grid-cols-3 lg:divide-x lg:divide-y-0">
                        {instructors.map((instructor) => (
                            <div
                                key={instructor.name}
                                className="flex items-start gap-3 p-5 transition hover:bg-slate-50/70 sm:p-6"
                            >
                                <div
                                    className={`mt-1 h-10 w-1.5 shrink-0 rounded-full ${instructor.color}`}
                                />

                                <div>
                                    <p className="font-bold leading-6 text-slate-800">
                                        {instructor.name}
                                    </p>

                                    <p className="mt-2 text-xs leading-6 text-slate-500">
                                        {instructor.subject}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Student signature */}
                <section className="relative overflow-hidden rounded-[24px] border border-indigo-100 bg-gradient-to-br from-white via-white to-indigo-50/80 p-5 shadow-sm sm:p-7">
                    <div className="pointer-events-none absolute -right-10 -top-10 h-36 w-36 rounded-full bg-violet-100/60 blur-2xl" />

                    <div className="relative flex flex-col items-center gap-5 sm:flex-row sm:justify-between">
                        <div className="text-center sm:text-left">
                            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-indigo-500">
                                Student information
                            </p>

                            <h2 className="mt-2 text-lg font-black text-slate-800">
                                ข้อมูลผู้จัดทำตารางเรียน
                            </h2>

                            <p className="mt-2 text-sm text-slate-500">
                                นักศึกษาสาขาวิศวกรรมคอมพิวเตอร์
                            </p>
                        </div>

                        <div className="min-w-0 text-center sm:text-right">
                            <div className="flex min-h-[90px] items-center justify-center rounded-2xl border border-white bg-white/80 px-5 py-2 shadow-sm sm:justify-end">
                                <img
                                    src="/signature.webp"
                                    alt="ลายเซ็น"
                                    width="150"
                                    height="90"
                                    className="h-[90px] w-[150px] object-contain"
                                />
                            </div>

                            <p className="mt-2 font-bold text-slate-800">
                                นายภูวณัฐ พาหะละ
                            </p>

                            <p className="mt-1 text-xs text-slate-400">
                                วันที่ ๒ ธันวาคม ๒๕๖๘
                            </p>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
}
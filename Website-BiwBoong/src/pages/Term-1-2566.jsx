
import { useNavigate } from "react-router-dom";
import {
    ArrowLeft,
    ArrowRight,
    BookOpen,
    CalendarDays,
    Clock3,
    GraduationCap,
    MapPin,
} from "lucide-react";

const days = [
    {
        day: "วันอังคาร",
        short: "อ.",
        courses: [
            {
                code: "PE108",
                title: "พลศึกษา",
                start: "09:00",
                end: "13:00",
                room: "S.003 R.361",
                teacher: "อ.กัญญารัตน์",
                color: "violet",
            },
        ],
    },
    {
        day: "วันพุธ",
        short: "พ.",
        courses: [
            {
                code: "CE214",
                title: "รายวิชา CE214",
                start: "09:00",
                end: "12:00",
                room: "S.001 R.593",
                teacher: "อ.รุ่งโรจน์",
                color: "cyan",
            },
            {
                code: "MA208",
                title: "รายวิชา MA208",
                start: "12:00",
                end: "15:00",
                room: "S.002 R.593",
                teacher: "อ.รุ่งโรจน์",
                color: "pink",
            },
            {
                code: "PH207",
                title: "รายวิชา PH207",
                start: "16:00",
                end: "17:00",
                room: "S.001 R.832",
                teacher: "ผศ.ดร.ปราโมทย์ และ อ.อนิรุทธ์",
                color: "amber",
            },
        ],
    },
    {
        day: "วันศุกร์",
        short: "ศ.",
        courses: [
            {
                code: "CE214",
                title: "รายวิชา CE214",
                start: "09:00",
                end: "12:00",
                room: "S.001 R.593",
                teacher: "อ.รุ่งโรจน์",
                color: "cyan",
            },
            {
                code: "MA208",
                title: "รายวิชา MA208",
                start: "12:00",
                end: "15:00",
                room: "S.002 R.593",
                teacher: "อ.รุ่งโรจน์",
                color: "pink",
            },
            {
                code: "CE201",
                title: "รายวิชา CE201",
                start: "16:00",
                end: "17:00",
                room: "S.002 R.836",
                teacher: "ดร.ทศพล",
                color: "emerald",
            },
        ],
    },
];

const colorStyles = {
    violet: {
        card: "border-l-violet-400 bg-violet-400/10",
        badge: "bg-violet-300/15 text-violet-200",
    },
    cyan: {
        card: "border-l-cyan-400 bg-cyan-400/10",
        badge: "bg-cyan-300/15 text-cyan-200",
    },
    pink: {
        card: "border-l-pink-400 bg-pink-400/10",
        badge: "bg-pink-300/15 text-pink-200",
    },
    amber: {
        card: "border-l-amber-400 bg-amber-400/10",
        badge: "bg-amber-300/15 text-amber-200",
    },
    emerald: {
        card: "border-l-emerald-400 bg-emerald-400/10",
        badge: "bg-emerald-300/15 text-emerald-200",
    },
};

function CourseCard({ course }) {
    const color = colorStyles[course.color] || colorStyles.cyan;

    return (
        <article
            className={`min-w-0 rounded-2xl border border-white/10 border-l-4 ${color.card} p-4`}
        >
            <div className="flex flex-wrap items-center justify-between gap-2">
                <span
                    className={`rounded-lg px-2.5 py-1 text-sm font-extrabold ${color.badge}`}
                >
                    {course.code}
                </span>

                <span className="flex items-center gap-1 text-xs text-slate-300">
                    <Clock3 className="h-3.5 w-3.5" />
                    {course.start}–{course.end} น.
                </span>
            </div>

            <h3 className="mt-3 break-words font-bold leading-snug text-white">
                {course.title}
            </h3>

            <div className="mt-4 space-y-2 text-sm leading-relaxed text-slate-300">
                <p className="flex items-start gap-2">
                    <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />
                    <span>{course.room}</span>
                </p>

                <p className="flex items-start gap-2">
                    <GraduationCap className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />
                    <span>{course.teacher}</span>
                </p>
            </div>
        </article>
    );
}

function StudentInformation() {
    return (
        <section className="mx-auto mt-6 max-w-[1200px] rounded-[20px] border border-slate-300/80 bg-gradient-to-br from-white via-white to-slate-300/90 p-5 text-slate-800 shadow-xl sm:p-6 lg:p-7">
            <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
                <div>
                    <p className="text-[10px] font-extrabold uppercase tracking-[0.25em] text-indigo-500 sm:text-xs">
                        Student Information
                    </p>
                    <h2 className="mt-2 text-base font-extrabold sm:text-lg">
                        ข้อมูลผู้จัดทำตารางเรียน
                    </h2>
                    <p className="mt-1 text-sm text-slate-500">
                        นักศึกษาสาขาวิศวกรรมคอมพิวเตอร์
                    </p>
                </div>

                <div className="flex shrink-0 flex-col items-center sm:min-w-[150px]">
                    <div className="flex h-[82px] w-full max-w-[150px] items-center justify-center rounded-2xl border border-white/80 bg-white/80 px-4 shadow-sm">
                        <img
                            src="/signature.webp"
                            alt="ลายเซ็นผู้จัดทำ"
                            className="max-h-[65px] w-full object-contain"
                        />
                    </div>
                    <p className="mt-2 text-sm font-bold text-slate-800 sm:text-base">
                        นายภูวณัฐ พาหะละ
                    </p>
                    <p className="mt-1 text-[11px] text-slate-400">
                        วันที่ 8 มีนาคม 2569
                    </p>
                </div>
            </div>
        </section>
    );
}

export default function Term1_2566() {
    const navigate = useNavigate();

    const totalCourses = days.reduce(
        (total, day) => total + day.courses.length,
        0
    );

    const studyDays = days.filter(
        (day) => day.courses.length > 0
    ).length;

    return (
        <main className="relative isolate min-h-[calc(100dvh-64px)] overflow-x-clip bg-[#080b19] px-3 pb-10 pt-5 text-slate-100 sm:px-5 sm:pt-8 lg:px-8">
            <div
                aria-hidden="true"
                className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
            >
                <div className="absolute -left-40 top-20 h-96 w-96 rounded-full bg-violet-600/15 blur-[120px]" />
                <div className="absolute -right-40 top-1/3 h-96 w-96 rounded-full bg-cyan-400/10 blur-[120px]" />
            </div>

            <div className="mx-auto w-full max-w-[1200px]">
                <button
                    type="button"
                    onClick={() => navigate(-1)}
                    className="mb-5 inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-sm font-medium text-slate-300 transition hover:bg-white/[0.08] hover:text-white"
                >
                    <ArrowLeft className="h-4 w-4" />
                    ย้อนกลับ
                </button>

                {/* Dashboard Header */}
                <section>
                    <div className="relative isolate overflow-hidden rounded-[30px] bg-gradient-to-br from-[#30216f] via-[#4438a7] to-[#6555eb] p-6 shadow-2xl shadow-violet-950/20 sm:p-8 lg:p-10">
                        <div
                            aria-hidden="true"
                            className="pointer-events-none absolute -right-10 -top-20 -z-10 h-64 w-64 rounded-full border-[35px] border-white/[0.06]"
                        />
                        <div
                            aria-hidden="true"
                            className="pointer-events-none absolute right-10 top-10 -z-10 h-24 w-24 rotate-12 rounded-[28px] border border-white/10"
                        />

                        <div className="inline-flex flex-wrap items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3.5 py-2 text-xs font-semibold text-indigo-100 sm:text-sm">
                            <span className="h-2 w-2 rounded-full bg-emerald-300" />
                            <span>STUDENT DASHBOARD</span>
                            <span className="text-indigo-300">/</span>
                            <span>ภาคเรียนที่กำลังศึกษา</span>
                        </div>

                        <div className="mt-6 max-w-3xl">
                            <p className="text-sm font-semibold text-indigo-200">
                                มหาวิทยาลัยธุรกิจบัณฑิตย์
                            </p>

                            <h1 className="mt-2 text-3xl font-extrabold leading-tight tracking-tight text-white sm:text-4xl">
                                ตารางเรียน
                                <br />
                                <span className="text-cyan-300">ภาคเรียนที่ 1/2566</span>
                            </h1>

                            <p className="mt-4 max-w-2xl text-sm leading-7 text-indigo-100/90 sm:text-base">
                                วางแผนการเรียนของคุณในแต่ละวัน
                                พร้อมรายละเอียดรายวิชา เวลา และห้องเรียน ครบจบในหน้าเดียว
                            </p>

                            <div className="mt-6 flex flex-wrap gap-2">
                                <span className="rounded-xl border border-white/15 bg-white/10 px-3 py-2 text-sm font-medium text-white">
                                    วิศวกรรมคอมพิวเตอร์
                                </span>
                                <span className="rounded-xl border border-white/15 bg-white/10 px-3 py-2 text-sm font-medium text-white">
                                    ชั้นปีที่ 1 · รหัส 66
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Statistics */}
                    <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
                        <div className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-gradient-to-br from-white to-slate-50 p-5 text-slate-900 shadow-lg">
                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-indigo-100 text-indigo-600">
                                <BookOpen className="h-5 w-5" />
                            </div>
                            <div>
                                <p className="text-xs text-slate-500">รายวิชาทั้งหมด</p>
                                <p className="mt-1 text-2xl font-extrabold">
                                    {totalCourses}
                                    <span className="ml-1 text-sm font-medium text-slate-500">
                                        วิชา
                                    </span>
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-gradient-to-br from-white to-cyan-50 p-5 text-slate-900 shadow-lg">
                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-cyan-100 text-cyan-600">
                                <CalendarDays className="h-5 w-5" />
                            </div>
                            <div>
                                <p className="text-xs text-slate-500">วันที่มีเรียน</p>
                                <p className="mt-1 text-2xl font-extrabold">
                                    {studyDays}
                                    <span className="ml-1 text-sm font-medium text-slate-500">
                                        วัน / สัปดาห์
                                    </span>
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-gradient-to-br from-white to-amber-50 p-5 text-slate-900 shadow-lg sm:col-span-2 xl:col-span-1">
                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-amber-100 text-amber-600">
                                <Clock3 className="h-5 w-5" />
                            </div>
                            <div>
                                <p className="text-xs text-slate-500">ระยะเวลาภาคเรียน</p>
                                <p className="mt-1 text-sm font-extrabold sm:text-base">
                                    15 ส.ค. – 3 ธ.ค. 2566
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Faculty Information */}
                    <div className="mt-6 flex flex-col gap-4 rounded-2xl border border-slate-200 bg-gradient-to-r from-white to-cyan-50 p-5 text-slate-900 shadow-lg sm:flex-row sm:items-center sm:justify-between sm:p-6">
                        <div className="flex min-w-0 items-start gap-3">
                            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 text-white shadow-lg">
                                <GraduationCap className="h-5 w-5" />
                            </div>
                            <div>
                                <h2 className="font-bold leading-relaxed">
                                    วิทยาลัยวิศวกรรมศาสตร์และเทคโนโลยี
                                </h2>
                                <p className="mt-1 text-sm leading-relaxed text-slate-500">
                                    สาขาวิชาวิศวกรรมคอมพิวเตอร์ · ปริญญาตรี ·
                                    หลักสูตรเทียบโอนจาก ปวส. ภาษาไทย
                                </p>
                            </div>
                        </div>

                        <span className="inline-flex w-fit shrink-0 items-center rounded-xl bg-indigo-50 px-3 py-2 text-xs font-extrabold tracking-wide text-indigo-600">
                            ACADEMIC YEAR 2566
                        </span>
                    </div>
                </section>

                {/* Weekly Timetable */}
                <section className="mt-8">
                    <div className="mb-5">
                        <h2 className="text-xl font-extrabold text-white">
                            ตารางเรียนรายสัปดาห์
                        </h2>
                        <p className="mt-1 text-sm text-slate-400">
                            รายละเอียดรายวิชา เวลา ห้องเรียน และอาจารย์ผู้สอน
                        </p>
                    </div>

                    <div className="space-y-7">
                        {days.map((day) => (
                            <section key={day.short}>
                                <div className="mb-3 flex items-center gap-3">
                                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-emerald-300/20 bg-emerald-300/10 font-bold text-emerald-200">
                                        {day.short}
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-white">{day.day}</h3>
                                        <p className="text-sm text-slate-400">
                                            {day.courses.length} รายวิชา
                                        </p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
                                    {day.courses.map((course, index) => (
                                        <CourseCard
                                            key={`${day.short}-${course.code}-${index}`}
                                            course={course}
                                        />
                                    ))}
                                </div>
                            </section>
                        ))}
                    </div>
                </section>

                {/* Student Information */}
                <StudentInformation />

                <div className="mt-3 text-center">
                    <button
                        type="button"
                        onClick={() => navigate("/current-timetable")}
                        className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2.5 text-sm font-semibold text-slate-300 transition hover:border-cyan-300/30 hover:bg-white/[0.08] hover:text-white"
                    >
                        ดูตารางเรียนปัจจุบัน
                        <ArrowRight className="h-4 w-4" />
                    </button>
                </div>

                <footer className="mt-8 hidden border-t border-indigo-100 bg-white px-4 py-6 text-center sm:block">
                    <p className="text-xs font-medium text-slate-400 sm:text-sm">
                        © 2025 - 2026 เว็บไซต์ของฉัน สงวนลิขสิทธิ์.
                    </p>

                    <p className="mt-1 text-[10px] text-slate-300">
                        DESIGNED FOR COMPUTER ENGINEERING STUDENT
                    </p>
                </footer>
            </div>
        </main>
    );
}

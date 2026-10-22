
import { useNavigate } from "react-router-dom";
import {
    ArrowLeft,
    ArrowRight,
    BookOpen,
    CalendarDays,
    Clock3,
    GraduationCap,
    MapPin,
    ClipboardList,
} from "lucide-react";

const schedule = [
    {
        day: "วันจันทร์",
        short: "จ.",
        courses: [
            {
                code: "LW391",
                title: "กฎหมายและจรรยาบรรณฯ",
                fullTitle: "กฎหมายและจรรยาบรรณ",
                start: "09:00",
                end: "10:30",
                room: "S.001 R.51003",
                teacher: "อ.ภัทรภณ",
                startSlot: 1,
                span: 3,
                color: "violet",
            },
            {
                code: "CE360",
                title: "เทคโนโลยีบล็อกเชน",
                start: "10:30",
                end: "12:00",
                room: "S.511 R.51001",
                teacher: "ดร.เด่นเดช",
                startSlot: 4,
                span: 3,
                color: "pink",
            },
        ],
    },
    {
        day: "วันอังคาร",
        short: "อ.",
        courses: [
            {
                code: "CE334",
                title: "การโปรแกรมระบบและระบบปฏิบัติการ",
                start: "09:00",
                end: "12:00",
                room: "S.001 R.593",
                teacher: "ผศ.ดร.สมศักดิ์",
                startSlot: 1,
                span: 6,
                color: "green",
            },
            {
                code: "CE360",
                title: "เทคโนโลยีบล็อกเชน",
                start: "13:30",
                end: "15:00",
                room: "S.511 R.51001",
                teacher: "ดร.เด่นเดช",
                startSlot: 10,
                span: 3,
                color: "emerald",
            },
        ],
    },
    {
        day: "วันพุธ",
        short: "พ.",
        courses: [
            {
                code: "CE498",
                title: "โครงงานวิศวกรรมคอมพิวเตอร์ 1",
                start: "10:00",
                end: "12:00",
                room: "S.314",
                teacher: "อ.สนายุ",
                startSlot: 3,
                span: 4,
                color: "amber",
            },
        ],
    },
    {
        day: "วันพฤหัสบดี",
        short: "พฤ.",
        courses: [
            {
                code: "CE392",
                title: "เรื่องเฉพาะทางวิศวกรรมคอมพิวเตอร์",
                start: "09:00",
                end: "12:00",
                room: "S.001 R.591",
                teacher: "ดร.ทศพล",
                startSlot: 1,
                span: 6,
                color: "emerald",
            },
            {
                code: "LW391",
                title: "กฎหมายและจรรยาบรรณ",
                start: "13:30",
                end: "15:00",
                room: "S.001 R.223",
                teacher: "อ.ภัทรภณ",
                startSlot: 10,
                span: 3,
                color: "violet",
            },
        ],
    },
];

const timeSlots = [
    "09:00",
    "09:30",
    "10:00",
    "10:30",
    "11:00",
    "11:30",
    "12:00",
    "12:30",
    "13:00",
    "13:30",
    "14:00",
    "14:30",
];

const colorStyles = {
    violet: {
        card: "border-l-violet-400 bg-violet-400/10",
        badge: "bg-violet-300/15 text-violet-200 ring-violet-300/20",
    },
    pink: {
        card: "border-l-pink-400 bg-pink-400/10",
        badge: "bg-pink-300/15 text-pink-200 ring-pink-300/20",
    },
    green: {
        card: "border-l-green-400 bg-green-400/10",
        badge: "bg-green-300/15 text-green-200 ring-green-300/20",
    },
    emerald: {
        card: "border-l-emerald-400 bg-emerald-400/10",
        badge: "bg-emerald-300/15 text-emerald-200 ring-emerald-300/20",
    },
    amber: {
        card: "border-l-amber-400 bg-amber-400/10",
        badge: "bg-amber-300/15 text-amber-200 ring-amber-300/20",
    },
};

const teachers = [
    "อ.ภัทรภณ วรรณแสง",
    "ดร.เด่นเดช รักษ์รัตน์ตรัย",
    "ดร.ทศพล เศรษฐวัชราวนิช",
    "ผศ.ดร.สมศักดิ์ กิตติปิยกุล",
    "อ.สนายุ จินตนาวรรณกุล",
];

function CourseCard({ course }) {
    const color = colorStyles[course.color];

    return (
        <article
            className={`min-w-0 overflow-hidden rounded-2xl border border-white/10 border-l-[5px] ${color.card} p-4 shadow-lg shadow-black/10`}
        >
            <div className="flex flex-wrap items-center justify-between gap-2">
                <span
                    className={`rounded-lg px-2.5 py-1 text-sm font-extrabold ring-1 ${color.badge}`}
                >
                    {course.code}
                </span>

                <span className="flex items-center gap-1 text-xs font-medium text-slate-300 sm:text-sm">
                    <Clock3 className="h-3.5 w-3.5 shrink-0" />
                    {course.start}–{course.end}
                </span>
            </div>

            <h3 className="mt-3 break-words font-bold leading-snug text-white">
                {course.title}
            </h3>

            <div className="mt-4 space-y-2 text-sm leading-relaxed text-slate-300">
                <p className="flex items-start gap-2">
                    <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />
                    <span>
                        <span className="text-slate-400">ห้อง </span>
                        {course.room}
                    </span>
                </p>

                <p className="flex items-start gap-2">
                    <GraduationCap className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />
                    <span>
                        <span className="text-slate-400">อาจารย์ </span>
                        {course.teacher}
                    </span>
                </p>
            </div>
        </article>
    );
}

function DesktopSchedule() {
    return (
        <section className="mx-auto mt-6 hidden max-w-[2000px] min-[1400px]:block">
            <div className="overflow-x-auto rounded-2xl border border-white/10 bg-white/[0.035] p-3 shadow-xl shadow-black/10">
                <div className="min-w-[1400px]">
                    {/* หัวตาราง */}
                    <div className="grid grid-cols-[100px_repeat(12,minmax(75px,1fr))] gap-2 border-b border-dashed border-white/10 p-2">
                        <div className="flex min-h-[75px] items-center justify-center rounded-xl bg-emerald-300/15 text-center font-bold text-emerald-200">
                            เวลา / วัน
                        </div>

                        {timeSlots.map((time, index) => (
                            <div
                                key={time}
                                className="flex min-h-[75px] flex-col items-center justify-center rounded-xl bg-cyan-300/10 text-center text-xs font-bold text-slate-300"
                            >
                                <span>{time}</span>
                                <span className="my-1 text-slate-500">-</span>
                                <span>
                                    {timeSlots[index + 1] || "15:00"}
                                </span>
                            </div>
                        ))}
                    </div>

                    {/* ตารางเรียนรายวัน */}
                    {schedule.map((day) => (
                        <div
                            key={day.short}
                            className="grid min-h-[125px] grid-cols-[100px_repeat(12,minmax(75px,1fr))] gap-2 border-b border-dashed border-white/10 p-2 last:border-b-0"
                        >
                            <div className="flex min-h-[110px] items-center justify-center rounded-xl bg-emerald-300/15 font-bold text-emerald-200">
                                {day.short}
                            </div>

                            {day.courses.map((course) => {
                                const color = colorStyles[course.color];

                                return (
                                    <article
                                        key={`${day.short}-${course.code}-${course.start}`}
                                        style={{
                                            gridColumn: `${course.startSlot + 1} / span ${course.span}`,
                                        }}
                                        className={`min-w-0 overflow-hidden rounded-2xl border border-white/10 border-l-[5px] ${color.card} p-3 shadow-md`}
                                    >
                                        <span
                                            className={`inline-flex rounded-md px-2 py-1 text-xs font-extrabold ring-1 ${color.badge}`}
                                        >
                                            {course.code}
                                        </span>

                                        <h3 className="mt-2 break-words text-sm font-extrabold leading-snug text-white">
                                            {course.title}
                                        </h3>

                                        <div className="mt-2 break-words text-xs leading-relaxed text-slate-300">
                                            {course.room}
                                            <br />
                                            ({course.teacher})
                                            <br />
                                            {course.start}–{course.end}
                                        </div>
                                    </article>
                                );
                            })}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

function MobileSchedule() {
    return (
        <section className="mx-auto mt-6 max-w-[1200px] min-[1400px]:hidden">
            <div className="mb-5 rounded-2xl border border-white/10 bg-white/[0.035] p-4 text-center">
                <p className="font-bold text-cyan-200">
                    ตารางเรียน 1/2568
                </p>
                <p className="mt-1 text-sm text-slate-400">
                    แสดงแบบการ์ดสำหรับมือถือและแท็บเล็ต
                </p>
            </div>

            <div className="space-y-7">
                {schedule.map((day) => (
                    <section key={day.short}>
                        <div className="mb-3 flex items-center gap-3">
                            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-emerald-300/15 bg-emerald-300/10 font-bold text-emerald-200">
                                {day.short}
                            </div>

                            <div>
                                <h2 className="font-bold text-white">
                                    {day.day}
                                </h2>
                                <p className="text-sm text-slate-400">
                                    {day.courses.length} รายวิชา
                                </p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                            {day.courses.map((course) => (
                                <CourseCard
                                    key={`${day.short}-${course.code}-${course.start}`}
                                    course={course}
                                />
                            ))}
                        </div>
                    </section>
                ))}
            </div>
        </section>
    );
}

function StudentInformation() {
    return (
        <section className="mx-auto mt-6 max-w-[1200px] overflow-hidden rounded-[20px] border border-slate-300/80 bg-gradient-to-br from-white via-white to-slate-300/90 p-5 text-slate-800 shadow-xl shadow-black/20 sm:p-6 lg:p-7">
            <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
                <div className="min-w-0">
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
                            alt="ลายเซ็นนายภูวณัฐ พาหะละ"
                            className="max-h-[65px] w-full object-contain"
                        />
                    </div>

                    <p className="mt-2 text-sm font-bold text-slate-800 sm:text-base">
                        นายภูวณัฐ พาหะละ
                    </p>

                    <p className="mt-1 text-[11px] text-slate-400">
                        ๑๑ สิงหาคม ๒๕๖๘
                    </p>
                </div>
            </div>
        </section>
    );
}

export default function Term1_2568() {
    const navigate = useNavigate();

    const totalCourses = schedule.reduce(
        (total, day) => total + day.courses.length,
        0
    );

    return (
        <main className="relative isolate min-h-[calc(100dvh-64px)] overflow-x-clip bg-[#080b19] px-3 pb-10 pt-5 text-slate-100 sm:px-5 sm:pt-8 lg:px-8">
            {/* Background effects */}
            <div
                aria-hidden="true"
                className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
            >
                <div className="absolute -left-40 top-20 h-96 w-96 rounded-full bg-violet-600/15 blur-[120px]" />
                <div className="absolute -right-40 top-1/3 h-96 w-96 rounded-full bg-cyan-400/10 blur-[120px]" />
                <div className="absolute bottom-0 left-1/3 h-80 w-80 rounded-full bg-emerald-400/10 blur-[120px]" />
            </div>

            <div className="relative mx-auto w-full max-w-[2000px]">
                {/* Back button */}
                <div className="mx-auto max-w-[1200px]">
                    <button
                        type="button"
                        onClick={() => navigate(-1)}
                        className="mb-5 inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-sm font-medium text-slate-300 transition hover:border-cyan-300/30 hover:bg-white/[0.08] hover:text-white"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        ย้อนกลับ
                    </button>
                </div>

                {/* Page heading */}

                {/* Header Dashboard */}
                <section className="mx-auto max-w-[1200px]">
                    <div className="relative isolate overflow-hidden rounded-[30px] bg-gradient-to-br from-[#30216f] via-[#4438a7] to-[#6555eb] p-6 shadow-2xl shadow-violet-950/20 sm:p-8 lg:p-10">
                        {/* Decorative background */}
                        <div
                            aria-hidden="true"
                            className="pointer-events-none absolute -right-10 -top-20 -z-10 h-64 w-64 rounded-full border-[35px] border-white/[0.06]"
                        />
                        <div
                            aria-hidden="true"
                            className="pointer-events-none absolute right-10 top-10 -z-10 h-24 w-24 rotate-12 rounded-[28px] border border-white/10"
                        />

                        {/* Breadcrumb */}
                        <div className="inline-flex flex-wrap items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3.5 py-2 text-xs font-semibold text-indigo-100 sm:text-sm">
                            <span className="h-2 w-2 rounded-full bg-emerald-300" />
                            <span>STUDENT DASHBOARD</span>
                            <span className="text-indigo-300">/</span>
                            <span>ภาคเรียนที่ 1 / 2568</span>
                        </div>

                        {/* Heading */}
                        <div className="mt-6 max-w-3xl">
                            <p className="text-sm font-semibold text-indigo-200">
                                มหาวิทยาลัยธุรกิจบัณฑิตย์
                            </p>

                            <h1 className="mt-2 text-3xl font-extrabold leading-tight tracking-tight text-white sm:text-4xl">
                                ตารางเรียน
                                <br />
                                <span className="text-cyan-300">
                                    ภาคเรียนที่ 1/2568
                                </span>
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
                                    ชั้นปีที่ 3 · รหัส 66
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Statistics */}
                    <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
                        {/* Course count */}
                        <div className="flex min-w-0 items-center gap-4 rounded-2xl border border-slate-200 bg-gradient-to-br from-white to-slate-50 p-5 text-slate-900 shadow-lg shadow-black/10">
                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-indigo-100 text-indigo-600">
                                <BookOpen className="h-5 w-5" />
                            </div>

                            <div className="min-w-0">
                                <p className="text-xs text-slate-500">รายวิชาทั้งหมด</p>
                                <p className="mt-1 text-2xl font-extrabold">
                                    {schedule.reduce(
                                        (total, day) => total + day.courses.length,
                                        0
                                    )}
                                    <span className="ml-1 text-sm font-medium text-slate-500">
                                        วิชา
                                    </span>
                                </p>
                            </div>
                        </div>

                        {/* Study days */}
                        <div className="flex min-w-0 items-center gap-4 rounded-2xl border border-slate-200 bg-gradient-to-br from-white to-cyan-50 p-5 text-slate-900 shadow-lg shadow-black/10">
                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-cyan-100 text-cyan-600">
                                <CalendarDays className="h-5 w-5" />
                            </div>

                            <div className="min-w-0">
                                <p className="text-xs text-slate-500">วันที่มีเรียน</p>
                                <p className="mt-1 text-2xl font-extrabold">
                                    {schedule.filter((day) => day.courses.length > 0).length}
                                    <span className="ml-1 text-sm font-medium text-slate-500">
                                        วัน / สัปดาห์
                                    </span>
                                </p>
                            </div>
                        </div>

                        {/* Semester duration */}
                        <div className="flex min-w-0 items-center gap-4 rounded-2xl border border-slate-200 bg-gradient-to-br from-white to-amber-50 p-5 text-slate-900 shadow-lg shadow-black/10 sm:col-span-2 xl:col-span-1">
                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-amber-100 text-amber-600">
                                <Clock3 className="h-5 w-5" />
                            </div>

                            <div className="min-w-0">
                                <p className="text-xs text-slate-500">ระยะเวลาภาคเรียน</p>
                                <p className="mt-1 text-sm font-extrabold sm:text-base">
                                    11 ส.ค. – 30 พ.ย. 2568
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Faculty information */}
                    <div className="mt-6 flex flex-col gap-4 rounded-2xl border border-slate-200 bg-gradient-to-r from-white to-cyan-50 p-5 text-slate-900 shadow-lg shadow-black/10 sm:flex-row sm:items-center sm:justify-between sm:p-6">
                        <div className="flex min-w-0 items-start gap-3">
                            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 text-white shadow-lg shadow-violet-500/20">
                                <GraduationCap className="h-5 w-5" />
                            </div>

                            <div className="min-w-0">
                                <h2 className="font-bold leading-relaxed text-slate-900">
                                    วิทยาลัยวิศวกรรมศาสตร์และเทคโนโลยี
                                </h2>

                                <p className="mt-1 text-sm leading-relaxed text-slate-500">
                                    สาขาวิชาวิศวกรรมคอมพิวเตอร์ · ปริญญาตรี ·
                                    หลักสูตรเทียบโอนจาก ปวส. ภาษาไทย
                                </p>
                            </div>
                        </div>

                        <span className="inline-flex w-fit shrink-0 items-center rounded-xl bg-indigo-50 px-3 py-2 text-xs font-extrabold tracking-wide text-indigo-600">
                            ACADEMIC YEAR 2568
                        </span>
                    </div>
                </section>


                {/* Desktop timetable */}
                <DesktopSchedule />

                {/* Mobile and tablet timetable */}
                <MobileSchedule />

                {/* Teacher list */}
                <section className="mx-auto mt-6 max-w-[1200px] rounded-2xl border border-white/10 bg-white/[0.045] p-5 shadow-lg shadow-black/10 sm:p-6">
                    <div className="flex items-start gap-3">
                        <div className="rounded-xl bg-cyan-300/10 p-2.5 text-cyan-200">
                            <GraduationCap className="h-5 w-5" />
                        </div>

                        <div className="min-w-0">
                            <h2 className="font-bold text-white">
                                อาจารย์ผู้สอน
                            </h2>

                            <div className="mt-3 flex flex-wrap gap-2">
                                {teachers.map((teacher) => (
                                    <span
                                        key={teacher}
                                        className="rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-slate-300"
                                    >
                                        {teacher}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                {/* Midterm exam */}
                <section className="mx-auto mt-5 max-w-[1200px] rounded-2xl border border-amber-300/20 bg-amber-300/[0.06] p-5 shadow-lg shadow-black/10 sm:p-6">
                    <div className="flex items-start gap-3">
                        <div className="rounded-xl bg-amber-300/10 p-2.5 text-amber-200">
                            <ClipboardList className="h-5 w-5" />
                        </div>

                        <div>
                            <h2 className="font-bold text-white">
                                สอบกลางภาค
                            </h2>

                            <p className="mt-3 text-sm text-slate-300 sm:text-base">
                                17 ตุลาคม 2568
                            </p>

                            <p className="mt-1 text-sm text-slate-300 sm:text-base">
                                เวลา 13.30 น. - 15.00 น.
                            </p>

                            <p className="mt-2 font-semibold leading-relaxed text-amber-200">
                                สอบกลางภาค CE360 เทคโนโลยีบล็อกเชน
                            </p>
                        </div>
                    </div>
                </section>

                {/* Student information and signature */}
                <StudentInformation />

                {/* Link to current timetable */}
                <div className="mx-auto mt-3 max-w-[1200px] text-center">
                    <button
                        type="button"
                        onClick={() => navigate("/current-timetable")}
                        className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2.5 text-sm font-semibold text-slate-300 transition hover:border-cyan-300/30 hover:bg-white/[0.08] hover:text-white"
                    >
                        ดูตารางเรียนปัจจุบัน
                        <ArrowRight className="h-4 w-4" />
                    </button>
                </div>


                {/* Footer */}
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

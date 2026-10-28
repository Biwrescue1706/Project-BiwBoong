
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
        day: "วันจันทร์",
        short: "จ.",
        courses: [
            {
                code: "CE306",
                title: "การโปรแกรมประยุกต์บนเว็บ",
                start: "09:00",
                end: "13:00",
                room: "S.001 R.593",
                teacher: "ดร.เด่นเดช",
                color: "red",
            },
        ],
    },
    {
        day: "วันอังคาร",
        short: "อ.",
        courses: [
            {
                code: "CE385",
                title: "การออกแบบสถาปัตยกรรมแอปพลิเคชัน",
                start: "09:00",
                end: "13:00",
                room: "S.001 R.593",
                teacher: "อ.สนายุ",
                color: "lime",
            },
            {
                code: "CE327",
                title: "โครงสร้างและสถาปัตยคอมพิวเตอร์",
                start: "15:00",
                end: "16:30",
                room: "S.001 R.593",
                teacher: "ผศ.ดร.สมศักดิ์",
                color: "emerald",
            },
        ],
    },
    {
        day: "วันพุธ",
        short: "พ.",
        courses: [
            {
                code: "CE327",
                title: "โครงสร้างและสถาปัตยคอมพิวเตอร์",
                start: "13:30",
                end: "15:00",
                room: "S.001 R.593",
                teacher: "ผศ.ดร.สมศักดิ์",
                color: "emerald",
            },
        ],
    },
    {
        day: "วันพฤหัสบดี",
        short: "พฤ.",
        courses: [],
    },
    {
        day: "วันศุกร์",
        short: "ศ.",
        courses: [
            {
                code: "CE341",
                title: "วิศวกรรมซอฟต์แวร์",
                start: "09:00",
                end: "13:00",
                room: "S.001 R.51003",
                teacher: "ผศ.ดร.ชัยพร",
                color: "pink",
            },
        ],
    },
    {
        day: "วันเสาร์",
        short: "ส.",
        courses: [
            {
                code: "CE396",
                title: "การออกแบบฐานข้อมูล",
                start: "10:00",
                end: "12:00",
                room: "S.001 R.592",
                teacher: "อ.นุชนาถ",
                color: "orange",
            },
            {
                code: "CE396",
                title: "การออกแบบฐานข้อมูล",
                start: "13:00",
                end: "15:00",
                room: "S.001 R.592",
                teacher: "อ.นุชนาถ",
                color: "orange",
            },
        ],
    },
];

const colorStyles = {
    red: {
        card: "border-l-red-400 bg-red-400/10",
        badge: "bg-red-300/15 text-red-200",
    },
    lime: {
        card: "border-l-lime-400 bg-lime-400/10",
        badge: "bg-lime-300/15 text-lime-200",
    },
    emerald: {
        card: "border-l-emerald-400 bg-emerald-400/10",
        badge: "bg-emerald-300/15 text-emerald-200",
    },
    pink: {
        card: "border-l-pink-400 bg-pink-400/10",
        badge: "bg-pink-300/15 text-pink-200",
    },
    orange: {
        card: "border-l-orange-400 bg-orange-400/10",
        badge: "bg-orange-300/15 text-orange-200",
    },
};

// สร้างช่วงเวลาตั้งแต่ 09:00 ถึง 17:00 โดยแต่ละช่องห่างกัน 30 นาที
const timeSlots = Array.from({ length: 16 }, (_, index) => {
    const totalMinutes = 9 * 60 + index * 30;
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;

    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
});

// แปลงเวลาเป็นตำแหน่งช่องในตาราง โดยเริ่มต้นที่ 09:00
function getSlotIndex(time) {
    const [hours, minutes] = time.split(":").map(Number);

    return (hours * 60 + minutes - 9 * 60) / 30;
}

// การ์ดรายวิชาสำหรับแท็บเล็ตและมือถือ
function CourseCard({ course }) {
    const color = colorStyles[course.color] || colorStyles.emerald;

    return (
        <article
            className={`min-w-0 rounded-2xl border border-white/10 border-l-4 ${color.card} p-4 shadow-lg shadow-black/10 transition hover:border-white/20`}
        >
            <div className="flex flex-wrap items-center justify-between gap-2">
                <span
                    className={`rounded-lg px-2.5 py-1 text-sm font-extrabold ${color.badge}`}
                >
                    {course.code}
                </span>

                <span className="flex items-center gap-1 text-xs text-slate-300 sm:text-sm">
                    <Clock3 className="h-4 w-4 shrink-0" />
                    {course.start}–{course.end} น.
                </span>
            </div>

            <h3 className="mt-3 break-words font-bold leading-relaxed text-white">
                {course.title}
            </h3>

            <div className="mt-4 space-y-2 text-sm leading-relaxed text-slate-300">
                <p className="flex items-start gap-2">
                    <Clock3 className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />
                    <span>
                        <span className="text-slate-400">เวลาเรียน: </span>
                        {course.start}–{course.end} น.
                    </span>
                </p>

                <p className="flex items-start gap-2">
                    <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />
                    <span>
                        <span className="text-slate-400">ห้องเรียน: </span>
                        {course.room}
                    </span>
                </p>

                <p className="flex items-start gap-2">
                    <GraduationCap className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />
                    <span>
                        <span className="text-slate-400">อาจารย์: </span>
                        {course.teacher}
                    </span>
                </p>
            </div>
        </article>
    );
}

// ตารางเรียนสำหรับหน้าจอคอมพิวเตอร์
function DesktopTimetable() {
    return (
        <div className="hidden min-[1280px]:block">
            <div className="overflow-x-auto rounded-2xl border border-white/10 bg-white/[0.02] p-3">
                <div className="min-w-[1100px]">
                    {/* หัวตารางเวลา */}
                    <div
                        className="grid gap-1"
                        style={{
                            gridTemplateColumns: `80px repeat(${timeSlots.length}, minmax(0, 1fr))`,
                        }}
                    >
                        <div className="flex items-center justify-center rounded-lg bg-emerald-300/15 p-2 text-xs font-bold text-emerald-200">
                            เวลา / วัน
                        </div>

                        {timeSlots.map((time) => {
                            const [hours, minutes] = time
                                .split(":")
                                .map(Number);

                            const nextMinutes = hours * 60 + minutes + 30;
                            const nextTime = `${String(
                                Math.floor(nextMinutes / 60)
                            ).padStart(2, "0")}:${String(
                                nextMinutes % 60
                            ).padStart(2, "0")}`;

                            return (
                                <div
                                    key={time}
                                    className="flex min-h-[52px] flex-col items-center justify-center rounded-lg bg-slate-800/90 px-1 text-[10px] font-semibold text-slate-300"
                                >
                                    <span>{time}</span>
                                    <span className="text-slate-500">–</span>
                                    <span>{nextTime}</span>
                                </div>
                            );
                        })}
                    </div>

                    {/* แถวของแต่ละวัน */}
                    {days.map((day) => (
                        <div
                            key={day.short}
                            className="mt-1 grid gap-1 border-t border-dashed border-white/10 py-1"
                            style={{
                                gridTemplateColumns: `80px repeat(${timeSlots.length}, minmax(0, 1fr))`,
                            }}
                        >
                            <div className="flex min-h-[100px] items-center justify-center rounded-lg bg-emerald-300/15 p-2 text-sm font-bold text-emerald-200">
                                {day.short}
                            </div>

                            {day.courses.map((course, index) => {
                                const start = getSlotIndex(course.start);
                                const end = getSlotIndex(course.end);
                                const color =
                                    colorStyles[course.color] ||
                                    colorStyles.emerald;

                                return (
                                    <article
                                        key={`${day.short}-${course.code}-${index}`}
                                        className={`relative z-10 min-w-0 self-stretch overflow-hidden rounded-xl border border-white/10 border-l-4 ${color.card} p-2`}
                                        style={{
                                            gridColumn: `${start + 2} / span ${end - start}`,
                                            gridRow: "1",
                                            marginTop: "4px",
                                            marginBottom: "4px",
                                        }}
                                    >
                                        <span
                                            className={`inline-block rounded-md px-2 py-1 text-[10px] font-extrabold ${color.badge}`}
                                        >
                                            {course.code}
                                        </span>

                                        <h3 className="mt-1 break-words text-xs font-bold leading-relaxed text-white">
                                            {course.title}
                                        </h3>

                                        <p className="mt-1 break-words text-[10px] leading-relaxed text-slate-300">
                                            {course.room}
                                        </p>

                                        <p className="break-words text-[10px] leading-relaxed text-slate-400">
                                            ({course.teacher})
                                        </p>

                                        <p className="mt-1 text-[10px] text-slate-300">
                                            {course.start}–{course.end}
                                        </p>
                                    </article>
                                );
                            })}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

// ข้อมูลผู้จัดทำตารางเรียน
function StudentInformation() {
    return (
        <section className="mt-6 rounded-[20px] border border-slate-300/80 bg-gradient-to-br from-white via-white to-slate-200 p-5 text-slate-800 shadow-xl shadow-black/20 sm:p-6 lg:p-7">
            <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
                <div className="min-w-0">
                    <p className="text-[10px] font-extrabold uppercase tracking-[0.25em] text-indigo-500 sm:text-xs">
                        Student Information
                    </p>

                    <h2 className="mt-2 font-extrabold sm:text-lg">
                        ข้อมูลผู้จัดทำตารางเรียน
                    </h2>

                    <p className="mt-1 text-sm text-slate-500">
                        นักศึกษาสาขาวิศวกรรมคอมพิวเตอร์
                    </p>
                </div>

                <div className="flex shrink-0 flex-col items-center sm:min-w-[150px]">
                    <div className="flex h-[82px] w-full max-w-[150px] items-center justify-center rounded-2xl border border-white bg-white/80 px-4 shadow-sm">
                        <img
                            src="/signature.webp"
                            alt="ลายเซ็นผู้จัดทำ"
                            className="max-h-[65px] w-full object-contain"
                            onError={(event) => {
                                event.currentTarget.style.display = "none";
                            }}
                        />
                    </div>

                    <p className="mt-2 text-sm font-bold sm:text-base">
                        นายภูวณัฐ พาหะละ
                    </p>

                    <p className="mt-1 text-[11px] text-slate-400">
                        ผู้จัดทำตารางเรียน
                    </p>
                </div>
            </div>
        </section>
    );
}

export default function Term1_2567() {
    const navigate = useNavigate();

    const allCourses = days.flatMap((day) => day.courses);

    const totalCourses = new Set(
        allCourses.map((course) => course.code)
    ).size;

    const studyDays = days.filter(
        (day) => day.courses.length > 0
    ).length;

    return (
        <main className="relative isolate min-h-[calc(100dvh-64px)] overflow-x-clip bg-[#080b19] px-3 pb-10 pt-5 text-slate-100 sm:px-5 sm:pt-8 lg:px-8">
            {/* Background */}
            <div
                aria-hidden="true"
                className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
            >
                <div className="absolute -left-40 top-20 h-96 w-96 rounded-full bg-violet-600/15 blur-[120px]" />
                <div className="absolute -right-40 top-1/3 h-96 w-96 rounded-full bg-cyan-400/10 blur-[120px]" />
            </div>

            <div className="mx-auto w-full max-w-[1600px]">
                {/* Back Button */}
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

                        <div className="inline-flex flex-wrap items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3.5 py-2 text-xs font-semibold text-indigo-100 sm:text-sm">
                            <span className="h-2 w-2 rounded-full bg-emerald-300" />
                            <span>STUDENT DASHBOARD</span>
                            <span className="text-indigo-300">/</span>
                            <span>ภาคเรียนที่ 1/2567</span>
                        </div>

                        <div className="mt-6 max-w-3xl">
                            <p className="text-sm font-semibold text-indigo-200">
                                มหาวิทยาลัยธุรกิจบัณฑิตย์
                            </p>

                            <h1 className="mt-2 text-3xl font-extrabold leading-tight tracking-tight text-white sm:text-4xl">
                                ตารางเรียน
                                <br />
                                <span className="text-cyan-300">
                                    ภาคเรียนที่ 1/2567
                                </span>
                            </h1>

                            <p className="mt-4 max-w-2xl text-sm leading-7 text-indigo-100/90 sm:text-base">
                                ตรวจสอบตารางเรียนรายสัปดาห์
                                พร้อมรายละเอียดรายวิชา เวลาเรียน
                                ห้องเรียน และข้อมูลอาจารย์ผู้สอน
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
                        <div className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-gradient-to-br from-white to-slate-50 p-5 text-slate-900 shadow-lg shadow-black/10">
                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-indigo-100 text-indigo-600">
                                <BookOpen className="h-5 w-5" />
                            </div>

                            <div>
                                <p className="text-xs text-slate-500">
                                    รายวิชาทั้งหมด
                                </p>

                                <p className="mt-1 text-2xl font-extrabold">
                                    {totalCourses}
                                    <span className="ml-1 text-sm font-medium text-slate-500">
                                        วิชา
                                    </span>
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-gradient-to-br from-white to-cyan-50 p-5 text-slate-900 shadow-lg shadow-black/10">
                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-cyan-100 text-cyan-600">
                                <CalendarDays className="h-5 w-5" />
                            </div>

                            <div>
                                <p className="text-xs text-slate-500">
                                    วันที่มีเรียน
                                </p>

                                <p className="mt-1 text-2xl font-extrabold">
                                    {studyDays}
                                    <span className="ml-1 text-sm font-medium text-slate-500">
                                        วัน / สัปดาห์
                                    </span>
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-gradient-to-br from-white to-amber-50 p-5 text-slate-900 shadow-lg shadow-black/10 sm:col-span-2 xl:col-span-1">
                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-amber-100 text-amber-600">
                                <Clock3 className="h-5 w-5" />
                            </div>

                            <div>
                                <p className="text-xs text-slate-500">
                                    ระยะเวลาภาคเรียน
                                </p>

                                <p className="mt-1 text-sm font-extrabold sm:text-base">
                                    13 ส.ค. – 1 ธ.ค. 2567
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Faculty Information */}
                    <div className="mt-6 flex flex-col gap-4 rounded-2xl border border-slate-200 bg-gradient-to-r from-white to-cyan-50 p-5 text-slate-900 shadow-lg shadow-black/10 sm:flex-row sm:items-center sm:justify-between sm:p-6">
                        <div className="flex min-w-0 items-start gap-3">
                            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 text-white shadow-lg">
                                <GraduationCap className="h-5 w-5" />
                            </div>

                            <div className="min-w-0">
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
                            ACADEMIC YEAR 2567
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
                            ภาคเรียนที่ 1 ปีการศึกษา 2567
                        </p>
                    </div>

                    {/* Desktop: ตารางตามช่วงเวลา */}
                    <DesktopTimetable />

                    {/* Mobile / Tablet: การ์ดรายวิชา */}
                    <div className="space-y-7 min-[1280px]:hidden">
                        {days.map((day) => (
                            <section key={day.short}>
                                <div className="mb-3 flex items-center gap-3">
                                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-emerald-300/20 bg-emerald-300/10 font-bold text-emerald-200">
                                        {day.short}
                                    </div>

                                    <div>
                                        <h3 className="font-bold text-white">
                                            {day.day}
                                        </h3>

                                        <p className="text-sm text-slate-400">
                                            {day.courses.length > 0
                                                ? `${day.courses.length} คาบเรียน`
                                                : "ไม่มีเรียน"}
                                        </p>
                                    </div>
                                </div>

                                {day.courses.length > 0 ? (
                                    <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                                        {day.courses.map((course, index) => (
                                            <CourseCard
                                                key={`${day.short}-${course.code}-${index}`}
                                                course={course}
                                            />
                                        ))}
                                    </div>
                                ) : (
                                    <div className="rounded-2xl border border-dashed border-white/10 bg-white/[0.02] px-4 py-5 text-sm text-slate-500">
                                        ไม่มีรายวิชาในวันนี้
                                    </div>
                                )}
                            </section>
                        ))}
                    </div>
                </section>

                {/* Student Information */}
                <StudentInformation />

                {/* Current Timetable Button */}
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

            </div>
        </main>
    );
}

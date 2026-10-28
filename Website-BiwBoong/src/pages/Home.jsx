import { useState } from "react";
import Navbar from "../components/Navbar";

const websites = [
  {
    title: "รายรับ-รายจ่าย",
    description: "จัดการและติดตามรายรับรายจ่ายส่วนตัวได้อย่างสะดวก",
    url: "https://cashflow-page.smartdorm-biwboong.shop/",
    icon: "💰",
    category: "การเงิน",
  },
  {
    title: "เว็บไซต์แสดงผลงาน",
    description: "รวบรวมผลงาน โปรเจกต์ และประสบการณ์ที่ผ่านมา",
    url: "http://portfolio-biwboong.smartdorm-biwboong.shop",
    icon: "💻",
    category: "Portfolio",
  },
  {
    title: "ระบบยืมคืนอุปกรณ์",
    description: "จัดการข้อมูลการยืมและคืนอุปกรณ์ผ่านเว็บไซต์",
    url: "https://biwboongstore.smartdorm-biwboong.shop",
    icon: "📦",
    category: "จัดการอุปกรณ์",
  },
  {
    title: "ระบบคำนวณค่าน้ำค่าไฟ",
    description: "ช่วยคำนวณและจัดการค่าใช้จ่ายน้ำประปาและไฟฟ้า",
    url: "https://biwbongexpenses.onrender.com",
    icon: "⚡",
    category: "คำนวณค่าใช้จ่าย",
  },
];

export default function Home() {
  const [search, setSearch] = useState("");

  const filteredWebsites = websites.filter((website) =>
    `${website.title} ${website.description} ${website.category}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#FFF8E7] font-sarabun text-stone-800">

      {/* Hero Section */}
      <section className="relative isolate overflow-hidden bg-gradient-to-br from-[#DDF7E5] via-[#EAF9EC] to-[#F2FBEA]">
        {/* Decorative Background */}
        <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-emerald-200/40 blur-3xl" />
          <div className="absolute -bottom-32 -left-20 h-80 w-80 rounded-full bg-lime-200/40 blur-3xl" />
          <div className="absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-amber-100/30 blur-3xl" />
        </div>

        <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 py-16 sm:px-8 sm:py-20 lg:grid-cols-2 lg:gap-16 lg:px-10 lg:py-24">
          {/* Hero Text */}
          <div className="text-center lg:text-left">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-white/70 px-4 py-2 text-sm font-semibold text-emerald-800 shadow-sm backdrop-blur">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              Personal Digital Hub
            </div>

            <h1 className="text-4xl font-extrabold leading-tight tracking-tight text-stone-800 sm:text-5xl lg:text-6xl">
              ทุกเครื่องมือ
              <br />
              <span className="text-emerald-700">ในพื้นที่เดียว</span>
            </h1>

            <p className="mx-auto mt-6 max-w-xl text-base leading-8 text-stone-600 sm:text-lg lg:mx-0">
              ศูนย์รวมเว็บไซต์และเครื่องมือที่ใช้งานเป็นประจำ
              ช่วยให้เข้าถึงงานต่าง ๆ ได้ง่ายขึ้นในที่เดียว
              สะดวก รวดเร็ว และเป็นระเบียบ
            </p>

            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row lg:justify-start">
              <a
                href="#websites"
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-emerald-700 px-6 py-3.5 font-semibold text-white shadow-lg shadow-emerald-900/10 transition hover:-translate-y-0.5 hover:bg-emerald-800"
              >
                เลือกเว็บไซต์ที่ต้องการ
                <span aria-hidden="true">→</span>
              </a>

              <a
                href="#calendar"
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-emerald-200 bg-white/80 px-6 py-3.5 font-semibold text-emerald-900 transition hover:bg-white"
              >
                <span aria-hidden="true">📅</span>
                ดูปฏิทิน
              </a>
            </div>

            <div className="mt-10 flex flex-wrap justify-center gap-6 text-sm text-stone-600 lg:justify-start">
              <div className="flex items-center gap-2">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white text-emerald-700 shadow-sm">
                  ✓
                </span>
                รวมทุกเว็บไซต์
              </div>

              <div className="flex items-center gap-2">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white text-emerald-700 shadow-sm">
                  ✓
                </span>
                ใช้งานง่าย
              </div>
            </div>
          </div>

          {/* Hero Hub Graphic */}
          <div className="relative mx-auto w-full max-w-lg">
            <div className="absolute inset-8 rounded-full bg-emerald-200/40 blur-3xl" />

            <div className="relative rounded-[2rem] border border-white/80 bg-white/60 p-5 shadow-xl shadow-emerald-900/5 backdrop-blur sm:p-8">
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-stone-500">
                    YOUR WORKSPACE
                  </p>
                  <h2 className="mt-1 text-xl font-bold text-stone-800">
                    My Digital Hub
                  </h2>
                </div>

                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 text-2xl">
                  ✨
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {websites.map((website, index) => (
                  <a
                    key={website.title}
                    href={website.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`group rounded-2xl border border-white bg-white/90 p-4 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-md ${
                      index % 2 === 0 ? "sm:translate-y-3" : ""
                    }`}
                  >
                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#EAF9EC] text-2xl transition group-hover:scale-105">
                      {website.icon}
                    </div>

                    <p className="text-sm font-bold text-stone-800">
                      {website.title}
                    </p>

                    <p className="mt-1 text-xs text-stone-500">
                      {website.category}
                    </p>
                  </a>
                ))}
              </div>

              <div className="mt-8 flex items-center justify-between rounded-2xl bg-[#FFF8E7] px-4 py-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-xl shadow-sm">
                    🗂️
                  </div>
                  <div>
                    <p className="text-sm font-bold text-stone-800">
                      All in one place
                    </p>
                    <p className="text-xs text-stone-500">
                      ทุกอย่างพร้อมใช้งาน
                    </p>
                  </div>
                </div>

                <span className="text-xl text-emerald-700">↗</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Websites Section */}
      <section
        id="websites"
        className="mx-auto max-w-7xl scroll-mt-20 px-5 py-16 sm:px-8 sm:py-20 lg:px-10"
      >
        <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-[#E5F5E7] px-3 py-1.5 text-sm font-semibold text-emerald-800">
              <span>🧩</span>
              My Applications
            </div>

            <h2 className="text-3xl font-extrabold tracking-tight text-stone-800 sm:text-4xl">
              เว็บไซต์ของฉัน
            </h2>

            <p className="mt-3 max-w-2xl leading-7 text-stone-600">
              เลือกเครื่องมือที่ต้องการใช้งานจากรายการด้านล่าง
            </p>
          </div>

          <div className="text-sm font-medium text-stone-500">
            ทั้งหมด {filteredWebsites.length} เว็บไซต์
          </div>
        </div>

        {/* Search */}
        <div className="mb-8">
          <label htmlFor="website-search" className="sr-only">
            ค้นหาเว็บไซต์
          </label>

          <div className="relative max-w-md">
            <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-lg text-stone-400">
              🔎
            </span>

            <input
              id="website-search"
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="ค้นหาเว็บไซต์..."
              className="w-full rounded-2xl border border-amber-100 bg-white py-3.5 pl-12 pr-4 text-sm text-stone-800 outline-none transition placeholder:text-stone-400 focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100"
            />
          </div>
        </div>

        {/* Website Cards */}
        {filteredWebsites.length > 0 ? (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {filteredWebsites.map((website) => (
              <article
                key={website.title}
                className="group flex h-full flex-col rounded-3xl border border-amber-100 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-emerald-200 hover:shadow-xl hover:shadow-emerald-900/5"
              >
                <div className="mb-5 flex items-start justify-between">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#EAF9EC] text-3xl transition group-hover:scale-105">
                    {website.icon}
                  </div>

                  <span className="rounded-full bg-[#FFF8E7] px-3 py-1 text-xs font-medium text-stone-600">
                    {website.category}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-stone-800">
                  {website.title}
                </h3>

                <p className="mt-3 flex-1 text-sm leading-7 text-stone-600">
                  {website.description}
                </p>

                <a
                  href={website.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-700 px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-800"
                >
                  เปิดเว็บไซต์
                  <span aria-hidden="true">↗</span>
                </a>
              </article>
            ))}
          </div>
        ) : (
          <div className="rounded-3xl border border-amber-100 bg-white px-6 py-12 text-center">
            <div className="text-4xl">🔍</div>
            <p className="mt-4 font-semibold text-stone-800">
              ไม่พบเว็บไซต์ที่ค้นหา
            </p>
            <p className="mt-2 text-sm text-stone-500">
              ลองเปลี่ยนคำค้นหาอีกครั้ง
            </p>

            <button
              type="button"
              onClick={() => setSearch("")}
              className="mt-5 rounded-xl bg-emerald-700 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-800"
            >
              ล้างคำค้นหา
            </button>
          </div>
        )}
      </section>

      {/* Calendar Section */}
      <section
        id="calendar"
        className="scroll-mt-20 border-t border-amber-100 bg-[#FDF5DF] py-16 sm:py-20"
      >
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-white px-3 py-1.5 text-sm font-semibold text-emerald-800 shadow-sm">
                <span>📅</span>
                Stay Organized
              </div>

              <h2 className="text-3xl font-extrabold tracking-tight text-stone-800 sm:text-4xl">
                ปฏิทินของฉัน
              </h2>

              <p className="mt-3 leading-7 text-stone-600">
                ดูตารางนัดหมายและจัดการเวลาได้จากปฏิทินด้านล่าง
              </p>
            </div>

            <a
              href="https://calendar.google.com/calendar/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 self-start rounded-xl border border-emerald-200 bg-white px-4 py-3 text-sm font-semibold text-emerald-800 transition hover:bg-[#EAF9EC] sm:self-auto"
            >
              เปิด Google Calendar
              <span aria-hidden="true">↗</span>
            </a>
          </div>

          <div className="overflow-hidden rounded-3xl border border-amber-100 bg-white p-2 shadow-sm sm:p-3">
            <iframe
              title="Google Calendar"
              src="https://calendar.google.com/calendar/embed?src=bewrockgame1%40gmail.com&ctz=Asia%2FBangkok"
              className="h-[500px] w-full rounded-2xl sm:h-[650px]"
              frameBorder="0"
              scrolling="no"
            />
          </div>
        </div>
      </section>
    </div>
  );
}
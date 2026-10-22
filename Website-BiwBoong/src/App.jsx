import { BrowserRouter, Routes, Route } from "react-router-dom";

import Layout from "./components/Layout.jsx";
import Home from "./pages/Home.jsx";
import Timetable from "./pages/Timetable.jsx";
import CurrentTimetable from "./pages/CurrentTimetable.jsx";
import NotFound from "./pages/NotFound.jsx";
import Term1_2566 from "./pages/Term-1-2566.jsx";
import Term1_2568 from "./pages/Term-1-2568.jsx";
import Term1_2567 from "./pages/Term-1-2567.jsx";
import Term2_2568 from "./pages/Term-2-2568.jsx"

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/timetable" element={<Timetable />} />
          <Route
            path="/current-timetable"
            element={<CurrentTimetable />}
          />
          <Route
            path="/term-1-2566"
            element={<Term1_2566 />}
          />

          <Route path="/term-1-2567" element={<Term1_2567 />} />

          <Route
            path="/term-1-2568"
            element={<Term1_2568 />}
          />
          <Route path="/term-2-2568" element={<Term2_2568 />} />

          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
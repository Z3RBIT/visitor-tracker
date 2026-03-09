import { BrowserRouter, Routes, Route, NavLink } from "react-router-dom";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";

const App = () => {
  return (
    <BrowserRouter>
      {/* Fondo degradado */}
      <div className="min-h-screen bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e] relative overflow-x-hidden">
        {/* Orbes decorativos */}
        <div className="fixed top-[-100px] left-[-100px] w-[400px] h-[400px] bg-purple-600/20 rounded-full blur-[120px] pointer-events-none" />
        <div className="fixed bottom-[-100px] right-[-100px] w-[400px] h-[400px] bg-pink-600/20 rounded-full blur-[120px] pointer-events-none" />

        {/* Navbar */}
        <nav className="sticky top-0 z-50 backdrop-blur-md bg-white/5 border-b border-white/10 px-6 py-4">
          <div className="max-w-2xl mx-auto flex items-center justify-between">
            <span className="text-white font-bold text-lg">
              👁️ Visitor Tracker
            </span>
            <div className="flex gap-2">
              <NavLink
                to="/"
                className={({ isActive }) =>
                  `px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? "bg-white/20 text-white"
                      : "text-white/50 hover:text-white hover:bg-white/10"
                  }`
                }
              >
                Mi Visita
              </NavLink>
              <NavLink
                to="/dashboard"
                className={({ isActive }) =>
                  `px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? "bg-white/20 text-white"
                      : "text-white/50 hover:text-white hover:bg-white/10"
                  }`
                }
              >
                Dashboard
              </NavLink>
            </div>
          </div>
        </nav>

        {/* Contenido */}
        <main className="max-w-2xl mx-auto">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/dashboard" element={<Dashboard />} />
          </Routes>
        </main>

        {/* Footer */}
        <footer className="text-center text-white/20 text-xs py-8">
          Visitor Tracker © {new Date().getFullYear()}
        </footer>
      </div>
    </BrowserRouter>
  );
};

export default App;

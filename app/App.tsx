import { useState } from "react";
import { useLocation, Link, Outlet } from "react-router";
import "./app.css";

function Sidebar({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 md:hidden z-30"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`w-72 h-screen bg-linear-to-b from-slate-900 to-slate-950 text-white border-l border-slate-800 fixed right-0 top-0 flex flex-col shadow-2xl transition-transform duration-300 z-40 md:translate-x-0 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        } md:relative md:translate-x-0`}
      >
        {/* Header */}
        <div className="p-4 md:p-6 border-b border-slate-800 bg-linear-to-r from-violet-600 to-purple-600 flex items-center justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl font-black tracking-tight">🎮 FreeGames</h1>
            <p className="text-xs md:text-sm text-purple-200 mt-1">Votre hub de jeux gratuits</p>
          </div>
          {/* Close button for mobile */}
          <button
            onClick={onClose}
            className="md:hidden text-white text-2xl hover:text-purple-200 transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 md:p-6 space-y-2">
          <Link
            to="/"
            onClick={onClose}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
              isActive("/")
                ? "bg-linear-to-r from-violet-600 to-purple-600 text-white shadow-lg"
                : "text-slate-300 hover:bg-slate-800 hover:text-white"
            }`}
          >
            <span className="text-lg">🏠</span>
            <span className="font-semibold">Accueil</span>
          </Link>
          <Link
            to="/users"
            onClick={onClose}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
              isActive("/users")
                ? "bg-linear-to-r from-violet-600 to-purple-600 text-white shadow-lg"
                : "text-slate-300 hover:bg-slate-800 hover:text-white"
            }`}
          >
            <span className="text-lg">👥</span>
            <span className="font-semibold">Utilisateurs</span>
          </Link>
        </nav>

        {/* Footer */}
        <div className="p-4 md:p-6 border-t border-slate-800 bg-slate-900/50">
          <p className="text-xs text-slate-500 text-center">© 2025 FreeGames</p>
          <p className="text-xs text-slate-600 text-center mt-1">v1.0.0</p>
        </div>
      </aside>
    </>
  );
}

export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>FreeGames - Votre hub de jeux gratuits</title>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap"
        />
      </head>
      <body>
        <div className="flex flex-col md:flex-row">
          {/* Mobile Header */}
          <header className="md:hidden bg-linear-to-r from-violet-600 to-purple-600 text-white p-4 flex items-center justify-between sticky top-0 z-20 shadow-lg">
            <h1 className="text-xl font-black">🎮 FreeGames</h1>
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="text-white text-2xl hover:text-purple-200 transition-colors"
            >
              ☰
            </button>
          </header>

          <main className="flex-1 w-full min-h-screen">
            <Outlet />
          </main>
          <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        </div>
      </body>
    </html>
  );
}

import { Link } from "react-router";
import type { Route } from "./+types/home";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "FreeGames - Accueil" },
    { name: "description", content: "Bienvenue sur FreeGames!" },
  ];
}

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="bg-linear-to-r from-violet-600 via-purple-600 to-pink-600 text-white py-8 md:py-12 px-4 md:px-8">
        <div className="max-w-4xl">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-black mb-3 tracking-tight">🎮 Bienvenue sur FreeGames</h1>
          <p className="text-base md:text-lg lg:text-xl text-purple-100 mb-2">
            Découvrez et explorez les meilleurs jeux gratuits du web
          </p>
          <p className="text-xs md:text-sm text-purple-200">Tous les jeux sont 100% gratuits • Aucun téléchargement requis</p>
        </div>
      </div>

      {/* Games Grid */}
      <div className="p-4 md:p-8 max-w-7xl mx-auto w-full">
        <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-6 md:mb-8">Jeux disponibles</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          <Link
            to="/games/truthordare"
            className="group bg-white dark:bg-slate-800 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 hover:scale-105 cursor-pointer border border-slate-200 dark:border-slate-700"
          >
            <div className="bg-linear-to-br from-violet-500 to-purple-500 h-32 md:h-40 flex items-center justify-center text-5xl md:text-6xl group-hover:scale-110 transition-transform duration-300">
              🎭
            </div>
            <div className="p-4 md:p-5">
              <h3 className="text-base md:text-lg font-bold text-slate-900 dark:text-white mb-2">
                Action ou Vérité
              </h3>
              <p className="text-xs md:text-sm text-slate-600 dark:text-slate-400 mb-4">
                Un classique incontournable! Choisissez entre une action amusante ou une vérité embarrassante.
              </p>
              <button className="w-full py-2 px-4 bg-linear-to-r from-violet-600 to-purple-600 text-white font-semibold rounded-lg text-sm md:text-base hover:from-violet-700 hover:to-purple-700 transition-all duration-200 shadow-md hover:shadow-lg">
                Jouer maintenant
              </button>
            </div>
          </Link>

          <Link
            to="/games/undercover"
            className="group bg-white dark:bg-slate-800 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 hover:scale-105 cursor-pointer border border-slate-200 dark:border-slate-700"
          >
            <div className="bg-linear-to-br from-red-500 to-orange-500 h-32 md:h-40 flex items-center justify-center text-5xl md:text-6xl group-hover:scale-110 transition-transform duration-300">
              🕵️
            </div>
            <div className="p-4 md:p-5">
              <h3 className="text-base md:text-lg font-bold text-slate-900 dark:text-white mb-2">
                Undercover
              </h3>
              <p className="text-xs md:text-sm text-slate-600 dark:text-slate-400 mb-4">
                Trouvez l'espion! Incluez Mr White et des undercover en fonction du nombre de joueurs.
              </p>
              <button className="w-full py-2 px-4 bg-linear-to-r from-red-600 to-orange-600 text-white font-semibold rounded-lg text-sm md:text-base hover:from-red-700 hover:to-orange-700 transition-all duration-200 shadow-md hover:shadow-lg">
                Jouer maintenant
              </button>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}

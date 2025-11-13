import type { Route } from "./+types/home";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "FreeGames - Accueil" },
    { name: "description", content: "Bienvenue sur FreeGames!" },
  ];
}

export default function Home() {
  return (
    <div className="p-8">
      <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-4">
        Bienvenue sur FreeGames
      </h1>
      <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
        Découvrez et explorez les meilleurs jeux gratuits.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div
            key={i}
            className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 shadow-md hover:shadow-lg transition"
          >
            <div className="bg-linear-to-br from-blue-400 to-purple-500 h-32 rounded mb-3"></div>
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
              Jeu {i}
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Description du jeu gratuit numéro {i}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

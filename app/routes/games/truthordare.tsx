import { useState, useEffect } from "react";
import type { Route } from "../+types/home";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Action ou Vérité" },
    { name: "description", content: "Jouer au jeu Action ou Vérité" },
  ];
}

interface GameData {
  actions: string[];
  truths: string[];
}

export default function TruthOrDare() {
  const [users, setUsers] = useState<string[]>([]);
  const [gameData, setGameData] = useState<GameData | null>(null);
  const [currentUserIndex, setCurrentUserIndex] = useState(0);
  const [currentChallenge, setCurrentChallenge] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState<"action" | "truth" | null>(null);
  const [gameStarted, setGameStarted] = useState(false);

  // Charger les utilisateurs depuis localStorage
  useEffect(() => {
    const savedUsers = localStorage.getItem("users");
    if (savedUsers) {
      const parsedUsers = JSON.parse(savedUsers);
      setUsers(parsedUsers);
    } else {
      const defaultUsers = ["Alice", "Bob", "Charlie"];
      setUsers(defaultUsers);
      localStorage.setItem("users", JSON.stringify(defaultUsers));
    }
  }, []);

  // Charger les données du jeu depuis le fichier JSON
  useEffect(() => {
    const loadGameData = async () => {
      try {
        const response = await fetch("/gamedata/truthordare.json");
        const data = await response.json();
        setGameData(data);
      } catch (error) {
        console.error("Erreur lors du chargement des données du jeu:", error);
      }
    };

    loadGameData();
  }, []);

  const startGame = () => {
    setGameStarted(true);
    setCurrentUserIndex(0);
    setCurrentChallenge(null);
    setSelectedType(null);
  };

  const getRandomChallenge = (type: "action" | "truth") => {
    if (!gameData) return;

    const challenges = type === "action" ? gameData.actions : gameData.truths;
    const randomIndex = Math.floor(Math.random() * challenges.length);
    setCurrentChallenge(challenges[randomIndex]);
    setSelectedType(type);
  };

  const nextPlayer = () => {
    setCurrentUserIndex((prev) => (prev + 1) % users.length);
    setCurrentChallenge(null);
    setSelectedType(null);
  };

  const resetGame = () => {
    setGameStarted(false);
    setCurrentUserIndex(0);
    setCurrentChallenge(null);
    setSelectedType(null);
  };

  if (!gameData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-slate-500">Chargement du jeu...</p>
      </div>
    );
  }

  if (users.length === 0) {
    return (
      <div className="min-h-screen">
        <div className="bg-linear-to-r from-violet-600 via-purple-600 to-pink-600 text-white py-10 px-8">
          <h1 className="text-4xl font-black mb-2">🎭 Action ou Vérité</h1>
          <p className="text-purple-100">Amusez-vous avec vos amis!</p>
        </div>
        <div className="p-8 max-w-2xl mx-auto">
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-8 text-center border border-slate-200 dark:border-slate-700">
            <p className="text-slate-600 dark:text-slate-400 text-lg mb-4">
              Aucun utilisateur trouvé. Veuillez d'abord ajouter des utilisateurs.
            </p>
            <a
              href="/users"
              className="inline-block px-6 py-3 bg-linear-to-r from-violet-600 to-purple-600 text-white rounded-lg hover:from-violet-700 hover:to-purple-700 font-semibold transition-all duration-200"
            >
              Aller à la gestion des utilisateurs
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="bg-linear-to-r from-violet-600 via-purple-600 to-pink-600 text-white py-8 md:py-10 px-4 md:px-8">
        <h1 className="text-3xl md:text-4xl font-black mb-2">🎭 Action ou Vérité</h1>
        <p className="text-sm md:text-base text-purple-100">Amusez-vous avec vos amis!</p>
      </div>

      {/* Content */}
      <div className="p-4 md:p-8 max-w-4xl mx-auto w-full">
        {!gameStarted ? (
          // Game Start Screen
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 md:p-8 text-center border border-slate-200 dark:border-slate-700">
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4">
              Prêt à jouer?
            </h2>
            <p className="text-slate-600 dark:text-slate-400 mb-6 text-base md:text-lg">
              {users.length} joueurs détectés
            </p>
            <div className="mb-8">
              <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 mb-3">Joueurs:</p>
              <div className="flex flex-wrap gap-2 justify-center">
                {users.map((user, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-violet-100 dark:bg-violet-900 text-violet-700 dark:text-violet-300 rounded-full text-xs md:text-sm font-semibold"
                  >
                    {user}
                  </span>
                ))}
              </div>
            </div>
            <button
              onClick={startGame}
              className="px-6 md:px-8 py-3 md:py-4 bg-linear-to-r from-violet-600 to-purple-600 text-white rounded-lg hover:from-violet-700 hover:to-purple-700 font-bold text-base md:text-lg transition-all duration-200 shadow-lg hover:shadow-xl w-full md:w-auto"
            >
              Commencer le jeu! 🎮
            </button>
          </div>
        ) : (
          // Game Screen
          <div>
            {/* Current Player Display */}
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 md:p-8 mb-4 md:mb-6 border border-slate-200 dark:border-slate-700">
              <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 mb-2">Joueur actuel</p>
              <h2 className="text-3xl md:text-5xl font-black text-center">
                <div className="w-16 md:w-20 h-16 md:h-20 rounded-full bg-linear-to-br from-violet-500 to-purple-500 flex items-center justify-center text-white mx-auto mb-4 text-2xl md:text-3xl">
                  {users[currentUserIndex].charAt(0).toUpperCase()}
                </div>
                {users[currentUserIndex]}
              </h2>
            </div>

            {/* Challenge Display */}
            {currentChallenge ? (
              <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 md:p-8 mb-4 md:mb-6 border border-slate-200 dark:border-slate-700">
                <p className="text-center text-xs md:text-sm text-slate-500 dark:text-slate-400 mb-4">
                  {selectedType === "action" ? "🎬 ACTION" : "🤔 VÉRITÉ"}
                </p>
                <p className="text-xl md:text-3xl font-bold text-center text-slate-900 dark:text-white mb-6 md:mb-8 line-clamp-4 md:line-clamp-none">
                  {currentChallenge}
                </p>
                <div className="flex flex-col md:flex-row gap-3 md:gap-4 justify-center">
                  <button
                    onClick={nextPlayer}
                    className="px-4 md:px-6 py-3 bg-linear-to-r from-green-500 to-emerald-500 text-white rounded-lg hover:from-green-600 hover:to-emerald-600 font-semibold transition-all duration-200 shadow-md hover:shadow-lg text-sm md:text-base"
                  >
                    ✓ Prochain joueur
                  </button>
                  <button
                    onClick={() => getRandomChallenge(selectedType!)}
                    className="px-4 md:px-6 py-3 bg-linear-to-r from-blue-500 to-cyan-500 text-white rounded-lg hover:from-blue-600 hover:to-cyan-600 font-semibold transition-all duration-200 shadow-md hover:shadow-lg text-sm md:text-base"
                  >
                    🔄 Changer le défi
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 md:p-12 mb-4 md:mb-6 border border-slate-200 dark:border-slate-700">
                <p className="text-center text-slate-500 dark:text-slate-400 mb-4 md:mb-6 text-base md:text-lg">
                  Choisissez votre défi
                </p>
                <div className="flex flex-col md:flex-row gap-3 md:gap-6 justify-center">
                  <button
                    onClick={() => getRandomChallenge("action")}
                    className="px-6 md:px-8 py-4 md:py-6 bg-linear-to-br from-red-500 to-pink-500 text-white rounded-lg hover:from-red-600 hover:to-pink-600 font-bold text-lg md:text-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                  >
                    🎬 ACTION
                  </button>
                  <button
                    onClick={() => getRandomChallenge("truth")}
                    className="px-6 md:px-8 py-4 md:py-6 bg-linear-to-br from-blue-500 to-purple-500 text-white rounded-lg hover:from-blue-600 hover:to-purple-600 font-bold text-lg md:text-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                  >
                    🤔 VÉRITÉ
                  </button>
                </div>
              </div>
            )}

            {/* Reset Button */}
            <div className="text-center">
              <button
                onClick={resetGame}
                className="px-6 py-3 bg-slate-500 text-white rounded-lg hover:bg-slate-600 font-semibold transition-all duration-200 shadow-md hover:shadow-lg text-sm md:text-base"
              >
                ↺ Retourner à l'accueil
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

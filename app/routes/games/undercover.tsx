import { useState, useEffect } from "react";
import type { Route } from "./+types/undercover";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Undercover" },
    { name: "description", content: "Jouer au jeu Undercover" },
  ];
}

interface GameData {
  topics: Array<{ word: string; fake: string }>;
}

interface Player {
  name: string;
  role: "citizen" | "undercover" | "mr_white";
  word: string;
  isAlive: boolean;
}

export default function Undercover() {
  const [users, setUsers] = useState<string[]>([]);
  const [gameData, setGameData] = useState<GameData | null>(null);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameSetup, setGameSetup] = useState(false);
  const [players, setPlayers] = useState<Player[]>([]);
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [underCoverCount, setUnderCoverCount] = useState(1);
  const [currentPlayerRole, setCurrentPlayerRole] = useState<"citizen" | "undercover" | "mr_white" | null>(null);
  const [currentPlayerWord, setCurrentPlayerWord] = useState<string>("");
  const [roundCount, setRoundCount] = useState(1);
  const [votePhase, setVotePhase] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [winner, setWinner] = useState<"citizens" | "undercover" | null>(null);

  // Charger les utilisateurs
  useEffect(() => {
    const savedUsers = localStorage.getItem("users");
    if (savedUsers) {
      const parsedUsers = JSON.parse(savedUsers);
      setUsers(parsedUsers);
      const underCount = Math.max(1, Math.floor(parsedUsers.length / 3));
      setUnderCoverCount(underCount);
    } else {
      const defaultUsers = ["Alice", "Bob", "Charlie"];
      setUsers(defaultUsers);
      setUnderCoverCount(1);
      localStorage.setItem("users", JSON.stringify(defaultUsers));
    }
  }, []);

  // Charger les données du jeu
  useEffect(() => {
    const loadGameData = async () => {
      try {
        const response = await fetch("/gamedata/undercover.json");
        const data = await response.json();
        setGameData(data);
      } catch (error) {
        console.error("Erreur lors du chargement des données:", error);
      }
    };

    loadGameData();
  }, []);

  const initializeGame = () => {
    if (!gameData) return;

    // Sélectionner un sujet aléatoire
    const randomTopic =
      gameData.topics[Math.floor(Math.random() * gameData.topics.length)];

    // Créer les joueurs
    const shuffledUsers = [...users].sort(() => Math.random() - 0.5);

    // Calculer les rôles en garantissant une majorité de citoyens
    // Undercovers + Mr White ne doivent pas dépasser 50% (arrondi à l'inférieur)
    const maxBadGuys = Math.floor(users.length / 2);
    const totalBadGuys = underCoverCount + 1; // undercover + 1 Mr White

    let hasMrWhite = true;
    let finalUnderCoverCount = underCoverCount;

    // Si Mr White + undercovers > 50%, on retire Mr White
    if (totalBadGuys > maxBadGuys) {
      hasMrWhite = false;
      // Si même sans Mr White on dépasse 50%, réduire les undercovers
      if (finalUnderCoverCount > maxBadGuys) {
        finalUnderCoverCount = maxBadGuys;
      }
    }

    // Assigner les rôles
    let mrWhiteIndex = -1;
    if (hasMrWhite) {
      mrWhiteIndex = Math.floor(Math.random() * users.length);
    }

    const newPlayers = shuffledUsers.map((name, index) => {
      let role: "citizen" | "undercover" | "mr_white";
      let word: string;

      if (hasMrWhite && index === mrWhiteIndex) {
        role = "mr_white";
        word = "???";
      } else if (index < finalUnderCoverCount || (hasMrWhite && index < finalUnderCoverCount + 1)) {
        role = "undercover";
        word = randomTopic.fake;
      } else {
        role = "citizen";
        word = randomTopic.word;
      }

      return {
        name,
        role,
        word,
        isAlive: true,
      };
    });

    setPlayers(newPlayers);
    setGameSetup(true);
  };

  const startGameRound = () => {
    setGameStarted(true);
    setCurrentPlayerIndex(0);
    setCurrentPlayerRole(null);
    setCurrentPlayerWord("");
  };

  const showPlayerRole = () => {
    if (currentPlayerIndex < players.length) {
      const player = players[currentPlayerIndex];
      setCurrentPlayerRole(player.role);
      setCurrentPlayerWord(player.word);
    }
  };

  const confirmPlayerViewed = () => {
    setCurrentPlayerRole(null);
    setCurrentPlayerWord("");

    if (currentPlayerIndex < players.length - 1) {
      setCurrentPlayerIndex(currentPlayerIndex + 1);
    } else {
      setVotePhase(true);
    }
  };

  const eliminatePlayer = (index: number) => {
    const updatedPlayers = [...players];
    updatedPlayers[index].isAlive = false;
    setPlayers(updatedPlayers);

    // Vérifier les conditions de fin
    checkGameOver(updatedPlayers);

    if (!gameOver) {
      setVotePhase(false);
      setCurrentPlayerIndex(0);
      setRoundCount(roundCount + 1);
    }
  };

  const checkGameOver = (currentPlayers: Player[]) => {
    const alive = currentPlayers.filter((p) => p.isAlive);
    const undercovers = alive.filter(
      (p) => p.role === "undercover" || p.role === "mr_white"
    );
    const citizens = alive.filter((p) => p.role === "citizen");

    if (undercovers.length === 0) {
      setGameOver(true);
      setWinner("citizens");
    } else if (citizens.length === 0) {
      setGameOver(true);
      setWinner("undercover");
    }
  };

  const resetGame = () => {
    setGameStarted(false);
    setGameSetup(false);
    setPlayers([]);
    setCurrentPlayerIndex(0);
    setCurrentPlayerRole(null);
    setCurrentPlayerWord("");
    setRoundCount(1);
    setVotePhase(false);
    setGameOver(false);
    setWinner(null);
  };

  if (!gameData) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <p className="text-slate-500 text-center">Chargement du jeu...</p>
      </div>
    );
  }

  if (users.length === 0) {
    return (
      <div className="min-h-screen">
        <div className="bg-linear-to-r from-red-600 via-orange-600 to-yellow-600 text-white py-8 md:py-10 px-4 md:px-8">
          <h1 className="text-3xl md:text-4xl font-black mb-2">🕵️ Undercover</h1>
          <p className="text-sm md:text-base text-orange-100">Trouvez l'espion caché!</p>
        </div>
        <div className="p-4 md:p-8 max-w-2xl mx-auto w-full">
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 md:p-8 text-center border border-slate-200 dark:border-slate-700">
            <p className="text-slate-600 dark:text-slate-400 text-base md:text-lg mb-4">
              Aucun utilisateur trouvé. Veuillez d'abord ajouter des utilisateurs.
            </p>
            <a
              href="/users"
              className="inline-block px-6 py-3 bg-linear-to-r from-red-600 to-orange-600 text-white rounded-lg hover:from-red-700 hover:to-orange-700 font-semibold transition-all duration-200 text-sm md:text-base"
            >
              Aller à la gestion des utilisateurs
            </a>
          </div>
        </div>
      </div>
    );
  }

  if (users.length < 3) {
    return (
      <div className="min-h-screen">
        <div className="bg-linear-to-r from-red-600 via-orange-600 to-yellow-600 text-white py-8 md:py-10 px-4 md:px-8">
          <h1 className="text-3xl md:text-4xl font-black mb-2">🕵️ Undercover</h1>
          <p className="text-sm md:text-base text-orange-100">Trouvez l'espion caché!</p>
        </div>
        <div className="p-4 md:p-8 max-w-2xl mx-auto w-full">
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 md:p-8 text-center border border-slate-200 dark:border-slate-700">
            <p className="text-slate-600 dark:text-slate-400 text-base md:text-lg mb-4">
              Vous avez besoin de minimum 3 joueurs pour jouer à Undercover.
            </p>
            <a
              href="/users"
              className="inline-block px-6 py-3 bg-linear-to-r from-red-600 to-orange-600 text-white rounded-lg hover:from-red-700 hover:to-orange-700 font-semibold transition-all duration-200 text-sm md:text-base"
            >
              Ajouter des joueurs
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="bg-linear-to-r from-red-600 via-orange-600 to-yellow-600 text-white py-8 md:py-10 px-4 md:px-8">
        <h1 className="text-3xl md:text-4xl font-black mb-2">🕵️ Undercover</h1>
        <p className="text-sm md:text-base text-orange-100">Trouvez l'espion caché!</p>
      </div>

      {/* Content */}
      <div className="p-4 md:p-8 max-w-4xl mx-auto w-full">
        {!gameSetup ? (
          // Setup Screen
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 md:p-8 border border-slate-200 dark:border-slate-700">
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-6">
              Configuration du jeu
            </h2>

            <div className="mb-6 md:mb-8">
              <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm md:text-base">
                <span className="font-semibold">{users.length} joueurs</span> détectés
              </p>
              <div className="flex flex-wrap gap-2">
                {users.map((user, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-orange-100 dark:bg-orange-900 text-orange-700 dark:text-orange-300 rounded-full text-xs md:text-sm font-semibold"
                  >
                    {user}
                  </span>
                ))}
              </div>
            </div>

            <div className="mb-6 md:mb-8 p-4 md:p-6 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700">
              <label className="block mb-4">
                <span className="text-slate-700 dark:text-slate-300 font-semibold mb-3 block text-sm md:text-base">
                  Nombre d'undercovers: <span className="text-red-600 text-xl md:text-2xl">{underCoverCount}</span>
                </span>
                <input
                  type="range"
                  min="1"
                  max={Math.floor(users.length / 2)}
                  value={underCoverCount}
                  onChange={(e) => setUnderCoverCount(parseInt(e.target.value))}
                  className="w-full cursor-pointer"
                />
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
                  Minimum: 1 • Maximum: {Math.floor(users.length / 2)}
                </p>
              </label>
            </div>

            <div className="bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-700 rounded-lg p-4 mb-6 md:mb-8">
              <p className="text-xs md:text-sm text-blue-800 dark:text-blue-300">
                {Math.floor(users.length / 2) >= underCoverCount + 1 ? (
                  <>
                    <span className="font-bold">1 Mr White</span> (ne connaît rien) • <span className="font-bold">{underCoverCount} Undercover(s)</span> (mot similaire) • <span className="font-bold">{users.length - underCoverCount - 1} Citoyens</span> (mot original)
                  </>
                ) : (
                  <>
                    <span className="font-bold">{underCoverCount} Undercover(s)</span> (mot similaire) • <span className="font-bold">{users.length - underCoverCount} Citoyens</span> (mot original) • <span className="text-xs text-blue-600 dark:text-blue-400">(Pas assez de joueurs pour Mr White)</span>
                  </>
                )}
              </p>
            </div>

            <button
              onClick={initializeGame}
              className="w-full px-6 md:px-8 py-3 md:py-4 bg-linear-to-r from-red-600 to-orange-600 text-white rounded-lg hover:from-red-700 hover:to-orange-700 font-bold text-base md:text-lg transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              Commencer le jeu! 🎮
            </button>
          </div>
        ) : !gameStarted ? (
          // Ready Screen
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 md:p-8 text-center border border-slate-200 dark:border-slate-700">
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 md:mb-6">
              Prêt à commencer?
            </h2>
            <p className="text-slate-600 dark:text-slate-400 mb-6 md:mb-8 text-base md:text-lg">
              Chaque joueur verra son rôle et son mot.
            </p>
            <button
              onClick={startGameRound}
              className="px-6 md:px-8 py-3 md:py-4 bg-linear-to-r from-red-600 to-orange-600 text-white rounded-lg hover:from-red-700 hover:to-orange-700 font-bold text-base md:text-lg transition-all duration-200 shadow-lg hover:shadow-xl w-full md:w-auto"
            >
              Démarrer le jeu ▶️
            </button>
          </div>
        ) : gameOver ? (
          // Game Over Screen
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 md:p-8 text-center border border-slate-200 dark:border-slate-700">
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white mb-6">
              {winner === "citizens" ? "🎉 Les citoyens ont gagné!" : "🕵️ Les undercovers ont gagné!"}
            </h2>

            {winner === "citizens" && (
              <div className="mb-6 md:mb-8">
                <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm md:text-base">Les undercovers et Mr White ont été éliminés!</p>
              </div>
            )}

            {winner === "undercover" && (
              <div className="mb-6 md:mb-8">
                <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm md:text-base">Les citoyens ont été tous éliminés!</p>
              </div>
            )}

            <div className="mb-6 md:mb-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
              {players.map((player, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-lg ${
                    player.role === "mr_white"
                      ? "bg-purple-100 dark:bg-purple-900 border border-purple-300 dark:border-purple-700"
                      : player.role === "undercover"
                      ? "bg-red-100 dark:bg-red-900 border border-red-300 dark:border-red-700"
                      : "bg-green-100 dark:bg-green-900 border border-green-300 dark:border-green-700"
                  }`}
                >
                  <p className="font-bold text-slate-900 dark:text-white text-sm md:text-base">{player.name}</p>
                  <p className="text-xs md:text-sm text-slate-700 dark:text-slate-300">
                    {player.role === "mr_white"
                      ? "👑 Mr White"
                      : player.role === "undercover"
                      ? "🕵️ Undercover"
                      : "👤 Citoyen"}
                  </p>
                </div>
              ))}
            </div>

            <button
              onClick={resetGame}
              className="px-6 md:px-8 py-3 md:py-4 bg-linear-to-r from-red-600 to-orange-600 text-white rounded-lg hover:from-red-700 hover:to-orange-700 font-bold text-base md:text-lg transition-all duration-200 shadow-lg hover:shadow-xl w-full md:w-auto"
            >
              Retour à l'accueil
            </button>
          </div>
        ) : votePhase ? (
          // Vote Phase
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 md:p-8 border border-slate-200 dark:border-slate-700">
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-6 text-center">
              Round {roundCount} - Votez pour éliminer quelqu'un
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
              {players.map((player, index) =>
                player.isAlive ? (
                  <button
                    key={index}
                    onClick={() => eliminatePlayer(index)}
                    className="p-4 bg-slate-100 dark:bg-slate-700 hover:bg-red-200 dark:hover:bg-red-900 rounded-lg font-semibold text-slate-900 dark:text-white transition-colors duration-200 text-base md:text-lg"
                  >
                    ❌ {player.name}
                  </button>
                ) : null
              )}
            </div>
          </div>
        ) : (
          // Player View Phase
          <div>
            {currentPlayerRole ? (
              <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 md:p-8 text-center border border-slate-200 dark:border-slate-700">
                <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 mb-4">Joueur {currentPlayerIndex + 1} sur {players.length}</p>

                <div
                  className={`mb-6 md:mb-8 p-6 md:p-8 rounded-lg text-white ${
                    currentPlayerRole === "mr_white"
                      ? "bg-linear-to-br from-purple-600 to-purple-800"
                      : currentPlayerRole === "undercover"
                      ? "bg-linear-to-br from-red-600 to-red-800"
                      : "bg-linear-to-br from-green-600 to-green-800"
                  }`}
                >
                  <p className="text-xs md:text-sm font-semibold mb-2">Ton rôle:</p>
                  <p className="text-2xl md:text-3xl font-black mb-4 md:mb-6">
                    {currentPlayerRole === "mr_white"
                      ? "👑 Mr White"
                      : currentPlayerRole === "undercover"
                      ? "🕵️ Undercover"
                      : "👤 Citoyen"}
                  </p>
                  <p className="text-xs md:text-sm font-semibold mb-2">Ton mot:</p>
                  <p className="text-4xl md:text-5xl font-black">{currentPlayerWord}</p>
                </div>

                <button
                  onClick={confirmPlayerViewed}
                  className="px-6 md:px-8 py-3 md:py-4 bg-linear-to-r from-red-600 to-orange-600 text-white rounded-lg hover:from-red-700 hover:to-orange-700 font-bold text-base md:text-lg transition-all duration-200 shadow-lg hover:shadow-xl w-full md:w-auto"
                >
                  Vu! ✓
                </button>
              </div>
            ) : (
              <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 md:p-8 text-center border border-slate-200 dark:border-slate-700">
                <p className="text-slate-500 dark:text-slate-400 mb-4 md:mb-6 text-base md:text-lg">
                  Joueur {currentPlayerIndex + 1} sur {players.length}
                </p>
                <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-6 md:mb-8">
                  {players[currentPlayerIndex]?.name}
                </h2>
                <button
                  onClick={showPlayerRole}
                  className="px-6 md:px-8 py-3 md:py-4 bg-linear-to-r from-red-600 to-orange-600 text-white rounded-lg hover:from-red-700 hover:to-orange-700 font-bold text-base md:text-lg transition-all duration-200 shadow-lg hover:shadow-xl w-full md:w-auto"
                >
                  Voir ton rôle 👀
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

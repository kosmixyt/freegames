import { useState, useEffect } from "react";
import type { Route } from "./+types/users";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Gestion des utilisateurs" },
    { name: "description", content: "Gérez les noms d'utilisateurs" },
  ];
}

export default function Users() {
  const [users, setUsers] = useState<string[]>([]);
  const [newUser, setNewUser] = useState("");

  // Charger les utilisateurs depuis le localStorage au montage
  useEffect(() => {
    const savedUsers = localStorage.getItem("users");
    if (savedUsers) {
      setUsers(JSON.parse(savedUsers));
    } else {
      // Utilisateurs par défaut
      const defaultUsers = ["Alice", "Bob", "Charlie"];
      setUsers(defaultUsers);
      localStorage.setItem("users", JSON.stringify(defaultUsers));
    }
  }, []);

  // Sauvegarder les utilisateurs dans le localStorage à chaque changement
  useEffect(() => {
    localStorage.setItem("users", JSON.stringify(users));
  }, [users]);

  const addUser = () => {
    if (newUser.trim()) {
      setUsers([...users, newUser]);
      setNewUser("");
    }
  };

  const deleteUser = (index: number) => {
    setUsers(users.filter((_, i) => i !== index));
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="bg-linear-to-r from-violet-600 via-purple-600 to-pink-600 text-white py-8 md:py-10 px-4 md:px-8">
        <h1 className="text-3xl md:text-4xl font-black mb-2">👥 Gestion des utilisateurs</h1>
        <p className="text-sm md:text-base text-purple-100">Gérez vos utilisateurs et votre équipe</p>
      </div>

      {/* Content */}
      <div className="p-4 md:p-8 max-w-2xl mx-auto w-full">
        {/* Form to add user */}
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-4 md:p-6 mb-6 md:mb-8 border border-slate-200 dark:border-slate-700">
          <h2 className="text-base md:text-lg font-bold text-slate-900 dark:text-white mb-4">Ajouter un nouvel utilisateur</h2>
          <div className="flex flex-col md:flex-row gap-3">
            <input
              type="text"
              value={newUser}
              onChange={(e) => setNewUser(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && addUser()}
              placeholder="Entrez le nom d'utilisateur"
              className="flex-1 px-4 py-3 border-2 border-slate-300 dark:border-slate-600 rounded-lg dark:bg-slate-700 dark:text-white text-slate-900 placeholder-slate-500 dark:placeholder-slate-400 focus:border-violet-600 focus:outline-none transition-colors text-sm md:text-base"
            />
            <button
              onClick={addUser}
              className="px-6 py-3 bg-linear-to-r from-violet-600 to-purple-600 text-white rounded-lg hover:from-violet-700 hover:to-purple-700 font-semibold transition-all duration-200 shadow-md hover:shadow-lg shrink-0 text-sm md:text-base"
            >
              Ajouter
            </button>
          </div>
        </div>

        {/* Users list */}
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg overflow-hidden border border-slate-200 dark:border-slate-700">
          <div className="px-4 md:px-6 py-4 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900">
            <h2 className="text-base md:text-lg font-bold text-slate-900 dark:text-white">
              Utilisateurs ({users.length})
            </h2>
          </div>

          {users.length === 0 ? (
            <div className="p-6 md:p-8 text-center">
              <p className="text-slate-500 dark:text-slate-400 text-base md:text-lg">😴 Aucun utilisateur pour le moment</p>
              <p className="text-xs md:text-sm text-slate-400 dark:text-slate-500 mt-2">Ajoutez votre premier utilisateur ci-dessus</p>
            </div>
          ) : (
            <ul className="divide-y divide-slate-200 dark:divide-slate-700">
              {users.map((user, index) => (
                <li
                  key={index}
                  className="flex flex-col md:flex-row items-start md:items-center justify-between p-4 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors duration-200 gap-3 md:gap-0"
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="w-10 h-10 rounded-full bg-linear-to-br from-violet-500 to-purple-500 flex items-center justify-center text-white font-bold shrink-0">
                      {user.charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-slate-900 dark:text-white text-sm md:text-base truncate">{user}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">Utilisateur</p>
                    </div>
                  </div>
                  <button
                    onClick={() => deleteUser(index)}
                    className="px-3 py-2 bg-red-500 text-white rounded-lg text-xs md:text-sm font-medium hover:bg-red-600 transition-colors duration-200 shadow-sm hover:shadow-md w-full md:w-auto"
                  >
                    ✕ Supprimer
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

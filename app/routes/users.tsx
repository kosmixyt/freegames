import { useState, useEffect } from "react";
import type { Route } from "./+types/users";

const STORAGE_KEY = "freegames_users";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Gestion des utilisateurs" },
    { name: "description", content: "Gérez les noms d'utilisateurs" },
  ];
}

export default function Users() {
  const [users, setUsers] = useState<string[]>([]);
  const [newUser, setNewUser] = useState("");
  const [isLoaded, setIsLoaded] = useState(false);

  // Load users from localStorage on mount
  useEffect(() => {
    const savedUsers = localStorage.getItem(STORAGE_KEY);
    if (savedUsers) {
      try {
        setUsers(JSON.parse(savedUsers));
      } catch (error) {
        console.error("Erreur lors du chargement des utilisateurs:", error);
        setUsers(["Alice", "Bob", "Charlie"]);
      }
    } else {
      setUsers(["Alice", "Bob", "Charlie"]);
    }
    setIsLoaded(true);
  }, []);

  // Save users to localStorage whenever they change
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
    }
  }, [users, isLoaded]);

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
    <div className="flex flex-col h-full">
      <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">
        Gestion des utilisateurs
      </h2>

      {/* Form to add user */}
      <div className="flex gap-2 mb-6">
        <input
          type="text"
          value={newUser}
          onChange={(e) => setNewUser(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && addUser()}
          placeholder="Ajouter un utilisateur"
          className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-800 dark:text-white text-sm"
        />
        <button
          onClick={addUser}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 text-sm font-medium"
        >
          Ajouter
        </button>
      </div>

      {/* Users list */}
      <div className="flex-1 overflow-y-auto space-y-2">
        {users.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            Aucun utilisateur
          </p>
        ) : (
          users.map((user, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 bg-gray-100 dark:bg-gray-800 rounded-md"
            >
              <span className="text-gray-800 dark:text-white">{user}</span>
              <button
                onClick={() => deleteUser(index)}
                className="px-2 py-1 bg-red-500 text-white rounded text-xs hover:bg-red-600"
              >
                Supprimer
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router";
import App from "./App";
import Home from "./routes/home";
import Users from "./routes/users";
import TruthOrDare from "./routes/games/truthordare";
import Undercover from "./routes/games/undercover";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route element={<App />}>
          <Route path="/" element={<Home />} />
          <Route path="/users" element={<Users />} />
          <Route path="/games/truthordare" element={<TruthOrDare />} />
          <Route path="/games/undercover" element={<Undercover />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);

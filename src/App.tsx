import AuthentificationPage from "./components/AuthentificationPage";
import Home from "./components/Home";
import ListPage from "./components/Player/ListPage";
import TeamsListPage from "./components/Team/TeamsListPage";
import TeamsPlayers from "./components/TeamsWithPlayers/TeamsPlayers";
import "./inxdex.css";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import stores from "./storage/StorageZustand";
import Logout from "./components/Logout";
import ValidationPage from "./components/ValidationPage";
const { useTokenStore } = stores;

function App() {
  const { token } = useTokenStore();

  return (
    <BrowserRouter>
      <div>
        {token && <Logout />} {}
      </div>
      <Routes>
        <Route path="/validation" element={<ValidationPage></ValidationPage>} />
        <Route path="/authentification" element={<AuthentificationPage />} />
        {token && <Route path="/" element={<Home />} />}
        {token && <Route path="/players" element={<ListPage />} />}
        {token && <Route path="/teams" element={<TeamsListPage />} />}
        {token && <Route path="/all" element={<TeamsPlayers />} />}
        {!token && (
          <Route path="*" element={<Navigate to="/authentification" />} />
        )}
      </Routes>
    </BrowserRouter>
  );
}

export default App;

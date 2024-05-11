import { useNavigate } from "react-router-dom";
import stores from "../storage/StorageZustand";
const { useTokenStore, usePlayerStore, useTeamStore } = stores;

function Logout() {
  const navigate = useNavigate();
  const { setToken } = useTokenStore();
  const { setPlayers } = usePlayerStore();
  const { setTeams } = useTeamStore();

  const handleLogout = () => {
    setToken(null);
    localStorage.clear();
    setPlayers([]);
    setTeams([]);
    navigate("/authentification");
  };

  return (
    <button className="delete-button" onClick={handleLogout}>
      Logout
    </button>
  );
}

export default Logout;

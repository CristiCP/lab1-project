import { useNavigate } from "react-router-dom";
import stores from "../storage/StorageZustand";
const { useTokenStore } = stores;

function Logout() {
  const navigate = useNavigate();
  const { setToken } = useTokenStore();

  const handleLogout = () => {
    setToken(null);
    localStorage.removeItem("token");
    navigate("/authentification");
  };

  return (
    <button className="delete-button" onClick={handleLogout}>
      Logout
    </button>
  );
}

export default Logout;

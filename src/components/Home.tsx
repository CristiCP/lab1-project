import { Link } from "react-router-dom";
import AddPlayer from "./Player/AddPlayer";
import AddTeam from "./Team/AddTeam";
import Logout from "./Logout";
import { useEffect } from "react";
import axios from "axios";
import stores from "../storage/StorageZustand";
const { useTokenStore } = stores;

function Home() {
  const { token } = useTokenStore();
  const axiosConfig = {
    headers: {
      Authorization: token,
    },
  };

  useEffect(() => {
    axios.get("http://localhost:4000/all", axiosConfig).catch((e) => {
      if (e.message == "Request failed with status code 403") {
        localStorage.removeItem("token");
      }
    });
  });

  return (
    <div className="new-player">
      <div>
        {<Logout />} {}
      </div>
      <AddPlayer></AddPlayer>
      <AddTeam></AddTeam>
      <div>
        <Link to="/all" className="show-button">
          Show all teams with players
        </Link>
      </div>
    </div>
  );
}

export default Home;

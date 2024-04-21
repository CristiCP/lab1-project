import { Link } from "react-router-dom";
import AddPlayer from "./Player/AddPlayer";
import AddTeam from "./Team/AddTeam";

function Home() {
  return (
    <div className="new-player">
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

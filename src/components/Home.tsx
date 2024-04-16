import AddPlayer from "./Player/AddPlayer";
import AddTeam from "./Team/AddTeam";

function Home() {
  return (
    <div className="new-player">
      <AddPlayer></AddPlayer>
      <AddTeam></AddTeam>
    </div>
  );
}

export default Home;

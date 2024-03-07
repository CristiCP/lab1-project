import NewPlayer from "./NewPlayer";
import PlayersList from "./PlayersList";
import Player from "./Player";
import UpdatePlayer from "./UpdatePlayer";
import { useEffect, useState } from "react";

function App() {
  const [playersList, setPlayersList] = useState<Player[]>([]);
  const [isOn, setOn] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);

  useEffect(() => {
    const player1 = new Player("Ronaldo", "Portugal", "Al-Nassr", 39);
    const player2 = new Player("Messi", "Argentine", "Inter Miami", 36);
    const player3 = new Player("Coman", "Romanian", "FCSB", 25);
    setPlayersList([player1, player2, player3]);
  }, []);

  return (
    <div>
      <h1>Footballers List</h1>
      <div className="container">
        <NewPlayer setPlayersList={setPlayersList}></NewPlayer>
        <PlayersList
          players={playersList}
          setPlayersList={setPlayersList}
          isOn={isOn}
          setOn={setOn}
          setSelectedIndex={setSelectedIndex}
        ></PlayersList>
        {isOn && (
          <UpdatePlayer
            setOn={setOn}
            players={playersList}
            index={selectedIndex}
          ></UpdatePlayer>
        )}
      </div>
    </div>
  );
}

export default App;

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

  const addPlayer = (newPlayer: Player) => {
    setPlayersList((prevPlayersList) => [...prevPlayersList, newPlayer]);
  };

  const deletePlayer = (newPlayers: Player[]) => {
    setPlayersList(newPlayers);
    if (isOn === true) {
      setOn(false);
    }
  };

  const updatePlayerDialog = (index: number) => {
    setSelectedIndex(index);
    setOn(true);
  };

  const closeUpdatePlayerDialog = () => {
    setOn(false);
  };

  return (
    <div>
      <h1>Footballers List</h1>
      <div className="container">
        <NewPlayer onAddPlayer={addPlayer}></NewPlayer>
        <PlayersList
          players={playersList}
          onDeletePlayer={deletePlayer}
          onUpdatePlayer={updatePlayerDialog}
        ></PlayersList>
        {isOn && (
          <UpdatePlayer
            onUpdatePlayer={closeUpdatePlayerDialog}
            players={playersList}
            index={selectedIndex}
          ></UpdatePlayer>
        )}
      </div>
    </div>
  );
}

export default App;

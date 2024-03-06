import { useState } from "react";
import Player from "./Player";

interface Props {
  onUpdatePlayer: () => void;
  players: Player[];
  index: number;
}

function UpdatePlayer({ onUpdatePlayer, players, index }: Props) {
  const handleCloseButton = () => {
    onUpdatePlayer();
  };

  const handleUpdateButton = () => {
    if (club) {
      players[index].setTeam(club);
      onUpdatePlayer();
    }
  };

  const [club, setClub] = useState("");

  return (
    <div>
      <h2>New club:</h2>
      <section>
        {index !== -1 && (
          <input
            className="Team"
            type="text"
            value={club}
            onChange={(e) => setClub(e.target.value)}
          ></input>
        )}
      </section>
      <button className="add-button" onClick={() => handleUpdateButton()}>
        Update player
      </button>
      <button className="delete-button" onClick={() => handleCloseButton()}>
        Cancel
      </button>
    </div>
  );
}

export default UpdatePlayer;

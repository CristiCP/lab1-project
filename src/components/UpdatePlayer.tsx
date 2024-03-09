import React, { useEffect, useState } from "react";
import Player from "./Player";

interface Props {
  setOn: React.Dispatch<React.SetStateAction<boolean>>;
  players: Player[];
  index: number;
}

function UpdatePlayer({ setOn, players, index }: Props) {
  const handleCloseButton = () => {
    console.log("dsda");
    setOn(false);
  };

  const handleUpdateButton = () => {
    if (club) {
      players[index].setTeam(club);
      setOn(false);
    }
  };

  const [club, setClub] = useState(players[index].getTeam().toString());
  useEffect(() => {
    setClub(players[index].getTeam().toString());
  }, [index]);

  return (
    <div className="update-content">
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

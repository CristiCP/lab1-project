import React from "react";
import Player from "./Player";
import UpdatePlayer from "./UpdatePlayer";

interface Props {
  players: Player[];
  setPlayersList: React.Dispatch<React.SetStateAction<Player[]>>;
  isOn: boolean;
  setOn: React.Dispatch<React.SetStateAction<boolean>>;
  selectedIndex: number;
  setSelectedIndex: React.Dispatch<React.SetStateAction<number>>;
}

function ListPage({
  players,
  setPlayersList,
  isOn,
  setOn,
  selectedIndex,
  setSelectedIndex,
}: Props) {
  function handleDeleteButton(index: number) {
    const updatedPlayers = players.filter((_, i) => i !== index);
    setPlayersList(updatedPlayers);
    if (isOn === true) {
      setOn(false);
    }
  }

  const handleUpdateButton = (index: number) => {
    setSelectedIndex(index);
    setOn(true);
  };

  return (
    <strong className="container">
      <div className="players-list">
        <h2>Players List</h2>
        <ul>
          {players.map((player, index) => (
            <li key={index}>
              <strong>
                Name:
                {" " + player.getName() + " "}
              </strong>
              <strong>
                Country:
                {" " + player.getNationality() + " "}
              </strong>
              <strong>
                Club:
                {" " + player.getTeam() + " "}
              </strong>
              <strong>
                Age:
                {" " + player.getAge()}
              </strong>
              <button
                className="delete-button"
                onClick={() => {
                  handleDeleteButton(index);
                }}
              >
                Delete
              </button>
              <button
                className="update-button"
                onClick={() => handleUpdateButton(index)}
              >
                Update
              </button>
            </li>
          ))}
        </ul>
      </div>
      <div className="update-entity">
        {isOn && (
          <UpdatePlayer
            setOn={setOn}
            players={players}
            index={selectedIndex}
          ></UpdatePlayer>
        )}
      </div>
    </strong>
  );
}

export default ListPage;

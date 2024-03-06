import Player from "./Player";

interface Props {
  players: Player[];
  onDeletePlayer: (newPlayers: Player[]) => void;
  onUpdatePlayer: (index: number) => void;
}

function PlayersList({ players, onDeletePlayer, onUpdatePlayer }: Props) {
  function handleDeleteButton(index: number) {
    const updatedPlayers = players.filter((_, i) => i !== index);
    onDeletePlayer(updatedPlayers);
  }

  const handleUpdateButton = (index: number) => {
    onUpdatePlayer(index);
  };

  return (
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
              Nationality:
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
  );
}

export default PlayersList;

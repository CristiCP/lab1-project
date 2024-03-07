import Player from "./Player";

interface Props {
  players: Player[];
  setPlayersList: React.Dispatch<React.SetStateAction<Player[]>>;
  isOn: boolean;
  setOn: React.Dispatch<React.SetStateAction<boolean>>;
  setSelectedIndex: React.Dispatch<React.SetStateAction<number>>;
}

function PlayersList({
  players,
  setPlayersList,
  isOn,
  setOn,
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

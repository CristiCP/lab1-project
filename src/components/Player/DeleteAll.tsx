import axios from "axios";
import React from "react";
import stores from "../../storage/StorageZustand";
const { usePlayerStore } = stores;

interface Props {
  playersDelete: number[];
  setSelectedPlayers: React.Dispatch<React.SetStateAction<number[]>>;
}

function DeleteAll({ playersDelete, setSelectedPlayers }: Props) {
  const { setPlayers } = usePlayerStore();

  const handleDeleteAll = () => {
    playersDelete.forEach((id) => {
      axios
        .delete(`http://localhost:4000/players/${id}`)
        .then(() =>
          axios
            .get("http://localhost:4000/players")
            .then((res) => setPlayers(res.data))
            .catch((e) => console.log(e))
        )
        .catch((e) => {
          console.log(e);
          alert("Error!Please refresh the page!");
        });
    });
    setSelectedPlayers([]);
  };

  return (
    <button className="delete-all-button" onClick={handleDeleteAll}>
      Delete selected
    </button>
  );
}

export default DeleteAll;

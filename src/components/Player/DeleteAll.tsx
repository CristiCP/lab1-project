import axios from "axios";
import React from "react";
import stores from "../../storage/StorageZustand";
const { usePlayerStore } = stores;
const { useTokenStore } = stores;

interface Props {
  playersDelete: number[];
  setSelectedPlayers: React.Dispatch<React.SetStateAction<number[]>>;
  fetchData: () => void;
}

function DeleteAll({ playersDelete, setSelectedPlayers, fetchData }: Props) {
  const { token } = useTokenStore();
  const axiosConfig = {
    headers: {
      Authorization: token,
    },
  };
  const { setPlayers } = usePlayerStore();

  const handleDeleteAll = () => {
    playersDelete.forEach((id) => {
      axios
        .delete(`http://localhost:4000/players/${id}`, axiosConfig)
        .then(() =>
          axios
            .get("http://localhost:4000/players", axiosConfig)
            .then((res) => {
              setPlayers(res.data);
              localStorage.setItem("players", JSON.stringify(res.data));
            })
            .catch((e) => console.log(e))
        )
        .catch((e) => {
          if (e.message == "Network Error") {
            const storedPlayers = JSON.parse(
              localStorage.getItem("players") || "[]"
            );
            const updatedStoredPlayers = storedPlayers.filter(
              (player: any) => player.id !== id
            );
            localStorage.setItem(
              "players",
              JSON.stringify(updatedStoredPlayers)
            );

            const newPlayers = JSON.parse(
              localStorage.getItem("newPlayers") || "[]"
            );
            const updatedNewPlayers = newPlayers.filter(
              (player: any) => player.id !== id
            );
            localStorage.setItem(
              "newPlayers",
              JSON.stringify(updatedNewPlayers)
            );

            const isIdInNewPlayers = newPlayers.some(
              (player: any) => player.id === id
            );
            if (!isIdInNewPlayers) {
              const deletedPlayers = JSON.parse(
                localStorage.getItem("deletedPlayers") || "[]"
              );
              deletedPlayers.push(id);
              localStorage.setItem(
                "deletedPlayers",
                JSON.stringify(deletedPlayers)
              );
            }
            fetchData();
          } else {
            alert("Error!Please refresh the page!");
          }
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

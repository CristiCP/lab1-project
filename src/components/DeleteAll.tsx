import axios from "axios";
import React from "react";

interface Props {
  playersDelete: number[];
  setData: React.Dispatch<
    React.SetStateAction<
      {
        name: string;
        country: string;
        team: string;
        age: string;
        id: number;
      }[]
    >
  >;
  setSelectedPlayers: React.Dispatch<React.SetStateAction<number[]>>;
}

function DeleteAll({ playersDelete, setData, setSelectedPlayers }: Props) {
  const handleDeleteAll = () => {
    playersDelete.forEach((id) => {
      axios.delete(`http://localhost:3000/users/${id}`).then(() =>
        axios
          .get("http://localhost:3000/users")
          .then((res) => setData(res.data))
          .catch((e) => console.log(e))
      );
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

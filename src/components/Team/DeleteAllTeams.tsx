import React from "react";
import stores from "../../storage/StorageZustand";
import axios from "axios";
const { useTeamStore } = stores;

interface Props {
  teamsDelete: string[];
  setSelectedTeams: React.Dispatch<React.SetStateAction<string[]>>;
}

function DeleteAllTeams({ teamsDelete, setSelectedTeams }: Props) {
  const { setTeams } = useTeamStore();

  const handleDeleteAll = () => {
    teamsDelete.forEach((name) => {
      axios
        .delete(`http://localhost:4000/teams/${name}`)
        .then(() =>
          axios
            .get("http://localhost:4000/teams")
            .then((res) => setTeams(res.data))
            .catch((e) => console.log(e))
        )
        .catch((e) => {
          console.log(e);
          alert("Error!Please refresh the page!");
        });
    });
    setSelectedTeams([]);
  };

  return (
    <button className="delete-all-button" onClick={handleDeleteAll}>
      Delete selected
    </button>
  );
}

export default DeleteAllTeams;

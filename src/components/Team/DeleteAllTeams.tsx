import React from "react";
import stores from "../../storage/StorageZustand";
const { useTokenStore } = stores;
import axios from "axios";
const { useTeamStore } = stores;

interface Props {
  teamsDelete: string[];
  setSelectedTeams: React.Dispatch<React.SetStateAction<string[]>>;
  fetchData: () => void;
}

function DeleteAllTeams({ teamsDelete, setSelectedTeams, fetchData }: Props) {
  const { token } = useTokenStore();
  const axiosConfig = {
    headers: {
      Authorization: token,
    },
  };
  const { setTeams } = useTeamStore();

  const handleDeleteAll = () => {
    teamsDelete.forEach((name) => {
      axios
        .delete(`http://localhost:4000/teams/${name}`, axiosConfig)
        .then(() =>
          axios
            .get("http://localhost:4000/teams", axiosConfig)
            .then((res) => {
              setTeams(res.data);
              localStorage.setItem("teams", JSON.stringify(res.data));
            })
            .catch((e) => console.log(e))
        )
        .catch((e) => {
          if (e.message == "Network Error") {
            const storedTeams = JSON.parse(
              localStorage.getItem("teams") || "[]"
            );
            const updatedStoredTeams = storedTeams.filter(
              (team: any) => team.name !== name
            );
            localStorage.setItem("teams", JSON.stringify(updatedStoredTeams));

            const newTeams = JSON.parse(
              localStorage.getItem("newTeams") || "[]"
            );
            const updatedNewTeams = newTeams.filter(
              (team: any) => team.name !== name
            );
            localStorage.setItem("newTeams", JSON.stringify(updatedNewTeams));

            const isNameInNewTeams = newTeams.some(
              (team: any) => team.name === name
            );
            if (!isNameInNewTeams) {
              const deletedTeams = JSON.parse(
                localStorage.getItem("deletedTeams") || "[]"
              );
              deletedTeams.push(name);
              localStorage.setItem(
                "deletedTeams",
                JSON.stringify(deletedTeams)
              );
            }
            fetchData();
          } else {
            alert("Error!Please refresh the page!");
          }
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

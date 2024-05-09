import axios from "axios";
import React, { useEffect, useState } from "react";
import stores from "../../storage/StorageZustand";
const { usePlayerStore, useTokenStore } = stores;

interface Props {
  setOn: React.Dispatch<React.SetStateAction<boolean>>;
  idPlayer: number;
  namePlayer: string;
  countryPlayer: string;
  clubPlayer: string;
  agePlayer: number;
  fetchData: () => void;
}

interface Team {
  name: string;
  country: string;
  year: number;
}

function UpdatePlayer({
  setOn,
  idPlayer,
  namePlayer,
  countryPlayer,
  clubPlayer,
  agePlayer,
  fetchData,
}: Props) {
  const { token } = useTokenStore();
  const axiosConfig = {
    headers: {
      Authorization: token,
    },
  };
  const [club, setClub] = useState(clubPlayer);
  const [selectedIdPlayer, setSelectedIdPlayer] = useState(idPlayer);
  const [selectedName, setSelectedName] = useState(namePlayer);
  const [selectedAge, setSelectedAge] = useState(agePlayer);
  const [selectedCountry, setSelectedCountry] = useState(countryPlayer);
  const { setPlayers } = usePlayerStore();

  useEffect(() => {
    setClub(clubPlayer);
    setSelectedIdPlayer(idPlayer);
    setSelectedName(namePlayer);
    setSelectedAge(agePlayer);
    setSelectedCountry(countryPlayer);
  }, [idPlayer]);

  const handleCloseButton = () => {
    setOn(false);
  };

  const handleUpdateButton = () => {
    if (club) {
      const values = {
        name: selectedName,
        country: selectedCountry,
        team: club,
        age: selectedAge,
        id: selectedIdPlayer,
      };
      axios
        .put("http://localhost:4000/players/" + idPlayer, values, axiosConfig)
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
            const storedTeams = JSON.parse(
              localStorage.getItem("teams") || "[]"
            );
            let teamExists = false;
            storedTeams.forEach((storedTeam: Team) => {
              if (storedTeam.name === values.team) {
                teamExists = true;
              }
            });
            if (teamExists) {
              const storedPlayers = JSON.parse(
                localStorage.getItem("players") || "[]"
              );
              const updatedPlayers = JSON.parse(
                localStorage.getItem("updatedPlayers") || "[]"
              );
              const playerIndex = storedPlayers.findIndex(
                (player: any) => player.id === values.id
              );
              if (playerIndex !== -1) {
                storedPlayers[playerIndex] = values;
                localStorage.setItem("players", JSON.stringify(storedPlayers));
                updatedPlayers.push(values);
                localStorage.setItem(
                  "updatedPlayers",
                  JSON.stringify(updatedPlayers)
                );
              }

              const newPlayers = JSON.parse(
                localStorage.getItem("newPlayers") || "[]"
              );
              const playerNewIndex = newPlayers.findIndex(
                (player: any) => player.id === values.id
              );
              if (playerNewIndex !== -1) {
                newPlayers[playerNewIndex] = values;
                localStorage.setItem("newPlayers", JSON.stringify(newPlayers));
              }
              fetchData();
            } else {
              alert("Team does not exist!");
            }
          } else if (e.response && e.response.status === 404) {
            alert("Team does not exist!");
          } else {
            alert(
              "Error!Player could not be updated or does not exist anymore!Please refresh the page!"
            );
          }
        });
      setOn(false);
    }
  };

  return (
    <div className="update-content">
      <h2>New club:</h2>
      <section>
        {idPlayer !== -1 && (
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

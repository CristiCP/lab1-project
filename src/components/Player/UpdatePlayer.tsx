import axios from "axios";
import React, { useEffect, useState } from "react";
import stores from "../../storage/StorageZustand";
const { usePlayerStore } = stores;

interface Props {
  setOn: React.Dispatch<React.SetStateAction<boolean>>;
  idPlayer: number;
  namePlayer: string;
  countryPlayer: string;
  clubPlayer: string;
  agePlayer: number;
}

function UpdatePlayer({
  setOn,
  idPlayer,
  namePlayer,
  countryPlayer,
  clubPlayer,
  agePlayer,
}: Props) {
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
        .put("http://localhost:4000/players/" + idPlayer, values)
        .then(() =>
          axios
            .get("http://localhost:4000/players")
            .then((res) => setPlayers(res.data))
            .catch((e) => console.log(e))
        )
        .catch((e) => {
          console.log(e);
          alert(
            "Error!Player could not be updated or does not exist anymore!Please refresh the page!"
          );
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

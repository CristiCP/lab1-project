import React, { useEffect, useState } from "react";
import stores from "../../storage/StorageZustand";
import axios from "axios";
const { useTeamStore } = stores;

interface Props {
  setOn: React.Dispatch<React.SetStateAction<boolean>>;
  nameTeam: string;
  countryTeam: string;
  ageTeam: number;
}

function UpdateTeam({ setOn, nameTeam, countryTeam, ageTeam }: Props) {
  const [selectedName, setSelectedName] = useState(nameTeam);
  const [selectedAge, setSelectedAge] = useState(ageTeam);
  const [selectedCountry, setSelectedCountry] = useState(countryTeam);
  const { setTeams } = useTeamStore();

  useEffect(() => {
    setSelectedName(nameTeam);
    setSelectedAge(ageTeam);
    setSelectedCountry(countryTeam);
  }, [nameTeam]);

  const handleCloseButton = () => {
    setOn(false);
  };

  const handleUpdateButton = () => {
    if (countryTeam) {
      const values = {
        name: selectedName,
        country: selectedCountry,
        year: selectedAge,
      };
      axios
        .put("http://localhost:4000/teams/" + selectedName, values)
        .then(() =>
          axios
            .get("http://localhost:4000/teams")
            .then((res) => {
              setTeams(res.data);
              localStorage.setItem("teams", JSON.stringify(res.data));
            })
            .catch((e) => console.log(e))
        )
        .catch((e) => {
          console.log(e);
          alert(
            "Error!Team could not be updated or does not exist anymore!Please refresh the page!"
          );
        });
      setOn(false);
    }
  };

  return (
    <div className="update-content">
      <h2>New country:</h2>
      <section>
        {nameTeam !== "" && (
          <input
            className="Team"
            type="text"
            value={selectedCountry}
            onChange={(e) => setSelectedCountry(e.target.value)}
          ></input>
        )}
      </section>
      <button className="add-button" onClick={() => handleUpdateButton()}>
        Update team
      </button>
      <button className="delete-button" onClick={() => handleCloseButton()}>
        Cancel
      </button>
    </div>
  );
}

export default UpdateTeam;

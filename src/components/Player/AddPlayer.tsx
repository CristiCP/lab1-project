import axios from "axios";
import { useState } from "react";
import { Link } from "react-router-dom";

interface Team {
  name: string;
  country: string;
  year: number;
}

function AddPlayer() {
  const [name, setName] = useState("");
  const [nationality, setNationality] = useState("");
  const [team, setTeam] = useState("");
  const [age, setAge] = useState("");
  const [confirmation, setConfirmation] = useState(false);

  const handleAddButton = () => {
    if (name && nationality && team && age) {
      const ageNumber = Number(age);
      if (isNaN(ageNumber)) {
        alert("Age should be a number!");
      } else {
        const currentTime = new Date().getTime();
        const jPlayer = {
          id: currentTime,
          name: name,
          country: nationality,
          team: team,
          age: age,
        };
        axios
          .post("http://localhost:4000/players", jPlayer)
          .then(() => {
            setConfirmation(true);
            setTimeout(() => {
              setConfirmation((prevConfirmation) => {
                if (prevConfirmation) {
                  return false;
                }
                return prevConfirmation;
              });
            }, 2000);
          })
          .catch((e) => {
            if (e.response && e.response.status === 404) {
              alert("Team does not exist!");
            } else if (e.message === "Network Error") {
              const storedTeams = JSON.parse(
                localStorage.getItem("teams") || "[]"
              );
              let teamExists = false;
              storedTeams.forEach((storedTeam: Team) => {
                if (storedTeam.name === team) {
                  teamExists = true;
                }
              });
              if (teamExists) {
                const storedPlayers = JSON.parse(
                  localStorage.getItem("newPlayers") || "[]"
                );
                storedPlayers.push(jPlayer);
                localStorage.setItem(
                  "newPlayers",
                  JSON.stringify(storedPlayers)
                );
                const players = JSON.parse(
                  localStorage.getItem("players") || "[]"
                );
                players.push(jPlayer);
                localStorage.setItem("players", JSON.stringify(players));
                setConfirmation(true);
                setTimeout(() => {
                  setConfirmation(false);
                }, 2000);
              } else {
                alert("Team does not exist!");
              }
            }
          });
      }
    } else {
      alert("Complete all details!");
    }
  };

  return (
    <div>
      <h2>Player Details</h2>
      <form>
        <input
          className="Name"
          type="text"
          placeholder="Enter name..."
          onChange={(e) => setName(e.target.value)}
        ></input>
      </form>
      <form>
        <input
          className="Nationality"
          type="text"
          placeholder="Enter country..."
          onChange={(e) => setNationality(e.target.value)}
        ></input>
      </form>
      <form>
        <input
          className="Team"
          type="text"
          placeholder="Enter club..."
          onChange={(e) => setTeam(e.target.value)}
        ></input>
      </form>
      <form>
        <input
          className="Age"
          type="text"
          placeholder="Enter age..."
          onChange={(e) => setAge(e.target.value)}
        ></input>
      </form>
      <strong className="buttons-add-show">
        <button className="add-button" onClick={handleAddButton}>
          Add player
        </button>
        <div>
          <Link to="/players" className="show-button">
            Show list
          </Link>
        </div>
      </strong>
      {confirmation && (
        <div className="confirmation-div">Player added to the list!</div>
      )}
    </div>
  );
}

export default AddPlayer;

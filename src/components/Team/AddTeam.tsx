import axios from "axios";
import { useState } from "react";
import { Link } from "react-router-dom";
import stores from "../../storage/StorageZustand";
const { useTokenStore } = stores;

function AddTeam() {
  const { token } = useTokenStore();
  const axiosConfig = {
    headers: {
      Authorization: token,
    },
  };
  const [name, setName] = useState("");
  const [nationality, setNationality] = useState("");
  const [age, setAge] = useState("");
  const [confirmation, setConfirmation] = useState(false);

  const handleAddButton = () => {
    if (name && nationality && age) {
      const ageNumber = Number(age);
      if (isNaN(ageNumber)) {
        alert("Year should be a number!");
      } else {
        const jTeam = {
          name: name,
          country: nationality,
          year: age,
        };
        axios
          .post("http://localhost:4000/teams", jTeam, axiosConfig)
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
            console.log(e);
            if (e.response && e.response.status === 409) {
              alert("Team already exist!");
            } else if (e.message === "Network Error") {
              const storedTeams = JSON.parse(
                localStorage.getItem("newTeams") || "[]"
              );
              let teamExist = storedTeams.some(
                (team: any) => team.name == jTeam.name
              );
              if (teamExist) {
                alert("Team already exist!");
                return;
              }
              storedTeams.push(jTeam);
              localStorage.setItem("newTeams", JSON.stringify(storedTeams));
              const teams = JSON.parse(localStorage.getItem("teams") || "[]");
              teams.push(jTeam);
              localStorage.setItem("teams", JSON.stringify(teams));
              setConfirmation(true);
              setTimeout(() => {
                setConfirmation((prevConfirmation) => {
                  if (prevConfirmation) {
                    return false;
                  }
                  return prevConfirmation;
                });
              }, 2000);
            } else {
              alert("Server error!Please refresh the page!");
            }
          });
      }
    } else {
      alert("Complete all details!");
    }
  };

  return (
    <div>
      <h2>Team Details</h2>
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
          className="Age"
          type="text"
          placeholder="Enter founding year..."
          onChange={(e) => setAge(e.target.value)}
        ></input>
      </form>
      <strong className="buttons-add-show">
        <button className="add-button" onClick={handleAddButton}>
          Add team
        </button>
        <div>
          <Link to="/teams" className="show-button">
            Show list
          </Link>
        </div>
      </strong>
      {confirmation && (
        <div className="confirmation-div">Team added to the list!</div>
      )}
    </div>
  );
}

export default AddTeam;

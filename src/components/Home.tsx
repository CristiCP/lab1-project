import React, { useState } from "react";
import Player from "./Player";
import { Link } from "react-router-dom";

interface Props {
  setPlayersList: React.Dispatch<React.SetStateAction<Player[]>>;
}

function Home({ setPlayersList }: Props) {
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
        const newPlayer = new Player(name, nationality, team, ageNumber);
        setPlayersList((prevPlayersList) => [...prevPlayersList, newPlayer]);
        setConfirmation(true);
        setTimeout(() => {
          setConfirmation((prevConfirmation) => {
            if (prevConfirmation) {
              return false;
            }
            return prevConfirmation;
          });
        }, 2000);
      }
    } else {
      alert("Complete all details!");
    }
  };

  return (
    <div className="new-player">
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
          <Link to="/list" className="show-button">
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

export default Home;

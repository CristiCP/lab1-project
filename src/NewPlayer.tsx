import { useState } from "react";
import Player from "./Player";

interface Props {
  onAddPlayer: (newPlayer: Player) => void;
}

function NewPlayer({ onAddPlayer }: Props) {
  const [name, setName] = useState("");
  const [nationality, setNationality] = useState("");
  const [team, setTeam] = useState("");
  const [age, setAge] = useState("");

  const handleAddButton = () => {
    if (name && nationality && team && age) {
      const ageNumber = Number(age);
      if (isNaN(ageNumber)) {
        alert("Age should be a number!");
      } else {
        const newPlayer = new Player(name, nationality, team, ageNumber);
        onAddPlayer(newPlayer);
      }
    } else {
      alert("Complete all details!");
    }
  };

  return (
    <div className="new-player">
      <h2>Player Details</h2>
      <section>
        <input
          className="Name"
          type="text"
          placeholder="Enter name..."
          onChange={(e) => setName(e.target.value)}
        ></input>
      </section>
      <section>
        <input
          className="Nationality"
          type="text"
          placeholder="Enter nationality..."
          onChange={(e) => setNationality(e.target.value)}
        ></input>
      </section>
      <section>
        <input
          className="Team"
          type="text"
          placeholder="Enter club..."
          onChange={(e) => setTeam(e.target.value)}
        ></input>
      </section>
      <section>
        <input
          className="Age"
          type="text"
          placeholder="Enter age..."
          onChange={(e) => setAge(e.target.value)}
        ></input>
      </section>
      <button className="add-button" onClick={handleAddButton}>
        Add player
      </button>
    </div>
  );
}

export default NewPlayer;

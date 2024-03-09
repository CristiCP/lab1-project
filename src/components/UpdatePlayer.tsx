import axios from "axios";
import React, { useEffect, useState } from "react";

interface Props {
  setOn: React.Dispatch<React.SetStateAction<boolean>>;
  idPlayer: number;
  clubPlayer: string;
  setNewData: React.Dispatch<
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
}

interface PlayerData {
  name: string;
  country: string;
  team: string;
  age: string;
  id: number;
}

function UpdatePlayer({ setOn, idPlayer, clubPlayer, setNewData }: Props) {
  const [data, setData] = useState<PlayerData | null>(null);
  const [club, setClub] = useState(clubPlayer);

  useEffect(() => {
    axios
      .get("http://localhost:3000/users/" + idPlayer)
      .then((res) => setData(res.data))
      .catch((e) => console.log(e));
  }, []);

  useEffect(() => {
    setClub(clubPlayer);
  }, [clubPlayer]);

  const handleCloseButton = () => {
    setOn(false);
  };

  const handleUpdateButton = () => {
    if (club) {
      const values = {
        name: data?.name,
        country: data?.country,
        team: club,
        age: data?.age,
        id: data?.id,
      };
      axios
        .put("http://localhost:3000/users/" + idPlayer, values)
        .catch((e) => console.log(e));
      axios
        .get("http://localhost:3000/users")
        .then((res) => setNewData(res.data))
        .catch((e) => console.log(e));
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

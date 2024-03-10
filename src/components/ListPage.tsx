import { useEffect, useState } from "react";
import UpdatePlayer from "./UpdatePlayer";
import axios from "axios";
import CountryImage from "./CountryImage";

function ListPage() {
  const [data, setData] = useState<
    Array<{
      name: string;
      country: string;
      team: string;
      age: string;
      id: number;
    }>
  >([]);
  const [isOn, setOn] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [selectedClub, setSelectedClub] = useState("");

  useEffect(() => {
    axios
      .get("http://localhost:3000/users")
      .then((res) => setData(res.data))
      .catch((e) => console.log(e));
  }, []);

  function handleDeleteButton(id: number) {
    axios.delete("http://localhost:3000/users/" + id).then(() =>
      axios
        .get("http://localhost:3000/users")
        .then((res) => setData(res.data))
        .catch((e) => console.log(e))
    );
    setOn(false);
  }

  const handleUpdateButton = (playerId: number, team: string) => {
    setOn(true);
    setSelectedIndex(playerId);
    setSelectedClub(team);
  };

  return (
    <div className="container">
      <div className="players-list">
        <h2>Players List</h2>
        <ul>
          {data.map((player: any, index: number) => (
            <li key={index} className="player-item">
              <div className="player-info">
                <strong>
                  Name:
                  {" " + player["name"] + " "}
                </strong>
                <strong>
                  Country:
                  {" " + player["country"] + " "}
                </strong>
                <strong>
                  Club:
                  {" " + player["team"] + " "}
                </strong>
                <strong>
                  Age:
                  {" " + player["age"] + " "}
                </strong>
              </div>
              <div className="country-image">
                <CountryImage country={player["country"]} />
              </div>
              <div className="player-buttons">
                <button
                  className="delete-button"
                  onClick={() => handleDeleteButton(player["id"])}
                >
                  Delete
                </button>
                <button
                  className="update-button"
                  onClick={() =>
                    handleUpdateButton(player["id"], player["team"])
                  }
                >
                  Update
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
      <div className="update-entity">
        {isOn && (
          <UpdatePlayer
            setOn={setOn}
            idPlayer={selectedIndex}
            clubPlayer={selectedClub}
            setNewData={setData}
          />
        )}
      </div>
    </div>
  );
}

export default ListPage;

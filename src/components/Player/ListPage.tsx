import { useEffect, useState } from "react";
import UpdatePlayer from "./UpdatePlayer";
import axios from "axios";
import CountryImage from "../CountryImage";
import Export from "./Export";
import DeleteAll from "./DeleteAll";
import stores from "../../storage/StorageZustand";
const { usePlayerStore } = stores;
import io from "socket.io-client";

const socket = io("http://localhost:4000");

function ListPage() {
  const [isOn, setOn] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [selectedClub, setSelectedClub] = useState("");
  const [selectedName, setSelectedName] = useState("");
  const [selectedAge, setSelectedAge] = useState(-1);
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedPlayers, setSelectedPlayers] = useState<number[]>([]);
  const { players, setPlayers, addPlayer } = usePlayerStore();

  useEffect(() => {
    const fetchData = () => {
      axios
        .get("http://localhost:4000/players")
        .then((res) => setPlayers(res.data))
        .catch((e) => {
          if (e.message == "Network Error") {
            console.log("Backend is down! Retrying in 7 seconds...");
            alert("Backend is down!Please wait...");
            setTimeout(fetchData, 7000);
          } else {
            alert("Error on getting players");
          }
        });
      socket.on("newEntity", (newPlayer) => {
        addPlayer(newPlayer);
        console.log("New player added!");
      });
    };
    fetchData();
  }, []);

  function handleDeleteButton(id: number) {
    axios
      .delete("http://localhost:4000/players/" + id)
      .then(() =>
        axios
          .get("http://localhost:4000/players")
          .then((res) => setPlayers(res.data))
          .catch((e) => console.log(e))
      )
      .catch((e) => {
        console.log(e);
        alert(
          "Error!Player could not be deleted or was already deleted!Please refresh the page!"
        );
      });
    setOn(false);
  }

  const handleUpdateButton = (
    playerId: number,
    name: string,
    country: string,
    team: string,
    age: number
  ) => {
    setOn(true);
    setSelectedIndex(playerId);
    setSelectedClub(team);
    setSelectedName(name);
    setSelectedCountry(country);
    setSelectedAge(age);
  };

  const handleCheckboxChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    playerId: number
  ) => {
    if (event.target.checked) {
      setSelectedPlayers([...selectedPlayers, playerId]);
    } else {
      setSelectedPlayers(selectedPlayers.filter((id) => id !== playerId));
    }
  };

  return (
    <div className="container">
      <div className="players-list">
        <h2>Players List</h2>
        <ul>
          {players.map((player: any, index: number) => (
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
                    handleUpdateButton(
                      player["id"],
                      player["name"],
                      player["country"],
                      player["team"],
                      player["age"]
                    )
                  }
                >
                  Update
                </button>
                <div className="player-checkbox">
                  <input
                    type="checkbox"
                    checked={selectedPlayers.includes(player["id"])}
                    onChange={(event) =>
                      handleCheckboxChange(event, player["id"])
                    }
                  />
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
      <div className="buttons-container">
        <div className="update-entity">
          {isOn && (
            <UpdatePlayer
              setOn={setOn}
              idPlayer={selectedIndex}
              namePlayer={selectedName}
              countryPlayer={selectedCountry}
              clubPlayer={selectedClub}
              agePlayer={selectedAge}
            />
          )}
        </div>
        <div className="export-entity">
          <Export></Export>
        </div>
        <div className="delete-all-entity">
          <DeleteAll
            playersDelete={selectedPlayers}
            setSelectedPlayers={setSelectedPlayers}
          ></DeleteAll>
        </div>
      </div>
    </div>
  );
}

export default ListPage;

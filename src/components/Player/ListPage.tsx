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
  const [page, setPage] = useState(1);

  useEffect(() => {
    const handleScroll = () => {
      const windowHeight = window.innerHeight;
      const fullHeight = document.documentElement.offsetHeight;
      const scrollPosition = document.documentElement.scrollTop;

      if (windowHeight + scrollPosition >= fullHeight) {
        setPage((prevPage) => prevPage + 1);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const fetchData = () => {
    axios
      .get(`http://localhost:4000/players?page=${page}&pageSize=50`)
      .then(() => {
        return Promise.all([
          addPlayersFromLocalStorage(),
          updatePlayersFromLocalStorage(),
          deletePlayersFromLocalStorage(),
        ]);
      })
      .then(() => {
        getPlayers();
      })
      .catch((e) => {
        if (e.message == "Network Error") {
          const localPlayers = JSON.parse(
            localStorage.getItem("players") || "[]"
          );
          setPlayers(localPlayers);
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

  const getPlayers = () => {
    axios
      .get(`http://localhost:4000/players?page=${page}&pageSize=50`)
      .then((res) => {
        setPlayers([...players, ...res.data]);
        localStorage.setItem(
          "players",
          JSON.stringify([...players, ...res.data])
        );
      })
      .catch((e) => console.log(e));
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    fetchData();
  }, [page]);

  function handleDeleteButton(id: number) {
    axios
      .delete("http://localhost:4000/players/" + id)
      .then(() => {
        setPlayers(players.filter((player: any) => player.id !== id));
        localStorage.setItem("players", JSON.stringify(players));
      })
      .catch((e) => {
        if (e.message == "Network Error") {
          const storedPlayers = JSON.parse(
            localStorage.getItem("players") || "[]"
          );
          const updatedStoredPlayers = storedPlayers.filter(
            (player: any) => player.id !== id
          );
          localStorage.setItem("players", JSON.stringify(updatedStoredPlayers));

          const newPlayers = JSON.parse(
            localStorage.getItem("newPlayers") || "[]"
          );
          const updatedNewPlayers = newPlayers.filter(
            (player: any) => player.id !== id
          );
          localStorage.setItem("newPlayers", JSON.stringify(updatedNewPlayers));

          const isIdInNewPlayers = newPlayers.some(
            (player: any) => player.id === id
          );
          if (!isIdInNewPlayers) {
            const deletedPlayers = JSON.parse(
              localStorage.getItem("deletedPlayers") || "[]"
            );
            deletedPlayers.push(id);
            localStorage.setItem(
              "deletedPlayers",
              JSON.stringify(deletedPlayers)
            );
          }
          fetchData();
        } else {
          alert(
            "Error!Player could not be deleted or was already deleted!Please refresh the page!"
          );
        }
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

  const addPlayersFromLocalStorage = () => {
    const newPlayers = JSON.parse(localStorage.getItem("newPlayers") || "[]");
    if (newPlayers.length > 0) {
      for (const newPlayer of newPlayers) {
        try {
          axios.post("http://localhost:4000/players", newPlayer);
        } catch (error) {
          console.error("Error adding new player:", error);
        }
      }
      localStorage.removeItem("newPlayers");
    }
  };

  const deletePlayersFromLocalStorage = () => {
    const deletedPlayers = JSON.parse(
      localStorage.getItem("deletedPlayers") || "[]"
    );
    if (deletedPlayers.length > 0) {
      for (const deletedPlayer of deletedPlayers) {
        try {
          axios.delete("http://localhost:4000/players/" + deletedPlayer);
        } catch (error) {
          console.error("Error deleting player:", error);
        }
      }
      localStorage.removeItem("deletedPlayers");
    }
  };

  const updatePlayersFromLocalStorage = () => {
    const updatedPlayers = JSON.parse(
      localStorage.getItem("updatedPlayers") || "[]"
    );
    if (updatedPlayers.length > 0) {
      for (const updatedPlayer of updatedPlayers) {
        try {
          axios.put(
            "http://localhost:4000/players/" + updatedPlayer.id,
            updatedPlayer
          );
        } catch (error) {
          console.error("Error deleting player:", error);
        }
      }
      localStorage.removeItem("updatedPlayers");
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
              <div className="update-entity">
                {isOn && selectedIndex == player.id && (
                  <UpdatePlayer
                    setOn={setOn}
                    idPlayer={selectedIndex}
                    namePlayer={selectedName}
                    countryPlayer={selectedCountry}
                    clubPlayer={selectedClub}
                    agePlayer={selectedAge}
                    fetchData={fetchData}
                  />
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>
      <div className="buttons-container">
        <div className="export-entity">
          <Export></Export>
        </div>
        <div className="delete-all-entity">
          <DeleteAll
            playersDelete={selectedPlayers}
            setSelectedPlayers={setSelectedPlayers}
            fetchData={fetchData}
          ></DeleteAll>
        </div>
      </div>
    </div>
  );
}

export default ListPage;

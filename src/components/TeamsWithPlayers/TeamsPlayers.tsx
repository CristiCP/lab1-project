import axios from "axios";
import { useEffect, useState } from "react";
import CountryImage from "../CountryImage";
import stores from "../../storage/StorageZustand";
const { useTokenStore } = stores;

interface Team {
  name: string;
  country: string;
  year: number;
  players: Player[];
}

interface Player {
  name: string;
  country: string;
  age: number;
}

function TeamsPlayers() {
  const { token } = useTokenStore();
  const axiosConfig = {
    headers: {
      Authorization: token,
    },
  };
  const [teamsWithPlayers, setTeamsWithPlayers] = useState<Team[]>([]);
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

  useEffect(() => {
    axios
      .get<Team[]>(
        `http://localhost:4000/all?page=${page}&pageSize=50`,
        axiosConfig
      )
      .then((response) => {
        setTeamsWithPlayers([...teamsWithPlayers, ...response.data]);
      })
      .catch((error) => {
        console.error("Error fetching teams and players:", error);
      });
  }, [page]);

  return (
    <div>
      <h2>Teams and Players</h2>
      {teamsWithPlayers.map((team) => (
        <li className="player-item">
          <div key={team.name}>
            <div className="player-info">
              <strong>
                Name:
                {" " + team.name + " "}
              </strong>
              <strong>
                Country:
                {" " + team.country + " "}
              </strong>
              <strong>
                Year:
                {" " + team.year + " "}
              </strong>
            </div>
            <div className="country-image">
              <CountryImage country={team.country} />
            </div>
            <ul>
              {team.players.map((player) => (
                <li key={player.name}>
                  {player.name} - {player.country} - Age: {player.age}
                </li>
              ))}
            </ul>
          </div>
        </li>
      ))}
    </div>
  );
}

export default TeamsPlayers;

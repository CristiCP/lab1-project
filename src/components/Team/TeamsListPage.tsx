import { useEffect, useState } from "react";
import stores from "../../storage/StorageZustand";
const { useTokenStore } = stores;
const { useTeamStore } = stores;
import CountryImage from "../CountryImage";
import axios from "axios";
import UpdateTeam from "./UpdateTeam";
import DeleteAllTeams from "./DeleteAllTeams";
function TeamsListPage() {
  const { token } = useTokenStore();
  const axiosConfig = {
    headers: {
      Authorization: token,
    },
  };
  const { teams, setTeams } = useTeamStore();
  const [isOn, setOn] = useState(false);
  const [selectedName, setSelectedName] = useState("");
  const [selectedAge, setSelectedAge] = useState(-1);
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedTeams, setSelectedTeams] = useState<string[]>([]);
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
      .get(`http://localhost:4000/teams?page=${page}&pageSize=50`, axiosConfig)
      .then(() => {
        return Promise.all([
          addTeamsFromLocalStorage(),
          deleteTeamsFromLocalStorage(),
        ]);
      })
      .then(() => {
        getTeams();
      })
      .catch((e) => {
        if (e.message == "Network Error") {
          const localTeams = JSON.parse(localStorage.getItem("teams") || "[]");
          setTeams(localTeams);
          setTimeout(fetchData, 7000);
        } else {
          alert("Error on getting players");
        }
      });
  };

  const getTeams = () => {
    axios
      .get(`http://localhost:4000/teams?page=${page}&pageSize=50`, axiosConfig)
      .then((res) => {
        const newTeams = res.data.filter((newTeam: any) => {
          return !teams.some(
            (existingTeam: any) => existingTeam.name === newTeam.name
          );
        });

        setTeams([...teams, ...newTeams]);
        localStorage.setItem("teams", JSON.stringify([...teams, ...newTeams]));
      })
      .catch((e) => console.log(e));
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    fetchData();
  }, [page]);

  function handleDeleteButton(name: string) {
    axios
      .delete("http://localhost:4000/teams/" + name, axiosConfig)
      .then(() =>
        axios
          .get(
            `http://localhost:4000/teams?page=${page}&pageSize=50`,
            axiosConfig
          )
          .then((res) => {
            setTeams(res.data);
            localStorage.setItem("teams", JSON.stringify(res.data));
          })
          .catch((e) => console.log(e))
      )
      .catch((e) => {
        if (e.message == "Network Error") {
          const storedTeams = JSON.parse(localStorage.getItem("teams") || "[]");
          const updatedStoredTeams = storedTeams.filter(
            (team: any) => team.name !== name
          );
          localStorage.setItem("teams", JSON.stringify(updatedStoredTeams));

          const newTeams = JSON.parse(localStorage.getItem("newTeams") || "[]");
          const updatedNewTeams = newTeams.filter(
            (team: any) => team.name !== name
          );
          localStorage.setItem("newTeams", JSON.stringify(updatedNewTeams));

          const isNameInNewTeams = newTeams.some(
            (team: any) => team.name === name
          );
          if (!isNameInNewTeams) {
            const deletedTeams = JSON.parse(
              localStorage.getItem("deletedTeams") || "[]"
            );
            deletedTeams.push(name);
            localStorage.setItem("deletedTeams", JSON.stringify(deletedTeams));
          }
          fetchData();
        } else {
          alert(
            "Error!Team could not be deleted or was already deleted!Please refresh the page!"
          );
        }
      });
    setOn(false);
  }

  const handleUpdateButton = (name: string, country: string, year: number) => {
    setOn(true);
    setSelectedName(name);
    setSelectedCountry(country);
    setSelectedAge(year);
  };

  const handleCheckboxChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    teamName: string
  ) => {
    if (event.target.checked) {
      setSelectedTeams([...selectedTeams, teamName]);
    } else {
      setSelectedTeams(selectedTeams.filter((name) => name !== teamName));
    }
  };

  const addTeamsFromLocalStorage = () => {
    const newTeams = JSON.parse(localStorage.getItem("newTeams") || "[]");
    if (newTeams.length > 0) {
      for (const newTeam of newTeams) {
        try {
          axios.post("http://localhost:4000/teams", newTeam, axiosConfig);
        } catch (error) {
          console.error("Error adding new team:", error);
        }
      }
      localStorage.removeItem("newTeams");
    }
  };

  const deleteTeamsFromLocalStorage = () => {
    const deletedTeams = JSON.parse(
      localStorage.getItem("deletedTeams") || "[]"
    );
    if (deletedTeams.length > 0) {
      for (const deletedTeam of deletedTeams) {
        try {
          axios.delete(
            "http://localhost:4000/teams/" + deletedTeam,
            axiosConfig
          );
        } catch (error) {
          console.error("Error deleting team:", error);
        }
      }
      localStorage.removeItem("deletedTeams");
    }
  };

  return (
    <div className="container">
      <div className="players-list">
        <h2>Teams List</h2>
        <ul>
          {teams.map((team: any, index: number) => (
            <li key={index} className="player-item">
              <div className="player-info">
                <strong>
                  Name:
                  {" " + team["name"] + " "}
                </strong>
                <strong>
                  Country:
                  {" " + team["country"] + " "}
                </strong>
                <strong>
                  Year:
                  {" " + team["year"] + " "}
                </strong>
              </div>
              <div className="country-image">
                <CountryImage country={team["country"]} />
              </div>
              <div className="player-buttons">
                <button
                  className="delete-button"
                  onClick={() => handleDeleteButton(team["name"])}
                >
                  Delete
                </button>
                <button
                  className="update-button"
                  onClick={() =>
                    handleUpdateButton(
                      team["name"],
                      team["country"],
                      team["year"]
                    )
                  }
                >
                  Update
                </button>
                <div className="player-checkbox">
                  <input
                    type="checkbox"
                    checked={selectedTeams.includes(team["name"])}
                    onChange={(event) =>
                      handleCheckboxChange(event, team["name"])
                    }
                  />
                </div>
              </div>
              <div className="update-entity">
                {isOn && selectedName == team.name && (
                  <UpdateTeam
                    setOn={setOn}
                    nameTeam={selectedName}
                    countryTeam={selectedCountry}
                    ageTeam={selectedAge}
                  />
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>
      <div className="buttons-container">
        {
          <div className="delete-all-entity">
            <DeleteAllTeams
              teamsDelete={selectedTeams}
              setSelectedTeams={setSelectedTeams}
              fetchData={fetchData}
            ></DeleteAllTeams>
          </div>
        }
      </div>
    </div>
  );
}

export default TeamsListPage;

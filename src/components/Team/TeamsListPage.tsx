import { useEffect, useState } from "react";
import stores from "../../storage/StorageZustand";
const { useTeamStore } = stores;
import CountryImage from "../CountryImage";
import axios from "axios";
import UpdateTeam from "./UpdateTeam";
import DeleteAllTeams from "./DeleteAllTeams";
function TeamsListPage() {
  const { teams, setTeams } = useTeamStore();
  const [isOn, setOn] = useState(false);
  const [selectedName, setSelectedName] = useState("");
  const [selectedAge, setSelectedAge] = useState(-1);
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedTeams, setSelectedTeams] = useState<string[]>([]);

  useEffect(() => {
    const fetchData = () => {
      axios
        .get("http://localhost:4000/teams")
        .then((res) => setTeams(res.data))
        .catch((e) => {
          if (e.message == "Network Error") {
            console.log("Backend is down! Retrying in 7 seconds...");
            alert("Backend is down!Please wait...");
            setTimeout(fetchData, 7000);
          } else {
            alert("Error on getting players");
          }
        });
    };
    fetchData();
  }, []);

  function handleDeleteButton(name: string) {
    axios
      .delete("http://localhost:4000/teams/" + name)
      .then(() =>
        axios
          .get("http://localhost:4000/teams")
          .then((res) => setTeams(res.data))
          .catch((e) => console.log(e))
      )
      .catch((e) => {
        console.log(e);
        alert(
          "Error!Team could not be deleted or was already deleted!Please refresh the page!"
        );
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
            </li>
          ))}
        </ul>
      </div>
      <div className="buttons-container">
        <div className="update-entity">
          {isOn && (
            <UpdateTeam
              setOn={setOn}
              nameTeam={selectedName}
              countryTeam={selectedCountry}
              ageTeam={selectedAge}
            />
          )}
        </div>
        {
          <div className="delete-all-entity">
            <DeleteAllTeams
              teamsDelete={selectedTeams}
              setSelectedTeams={setSelectedTeams}
            ></DeleteAllTeams>
          </div>
        }
      </div>
    </div>
  );
}

export default TeamsListPage;

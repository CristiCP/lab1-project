import { saveAs } from "file-saver";
import axios from "axios";

interface UserData {
  name: string;
  country: string;
  team: string;
  age: number;
}

function Export() {
  let exportAction = () => {
    axios
      .get("http://localhost:4000/players")
      .then((res) => {
        const csvData = res.data
          .map(
            ({ name, country, team, age }: UserData) =>
              `${name},${country},${team},${age}`
          )
          .join("\n");

        const blob = new Blob([csvData], {
          type: "text/csv;charset=utf-8",
        });

        saveAs(blob, "list.csv");
      })
      .catch((e) => {
        console.log(e);
        alert("Error!Please refresh the page!");
      });
  };

  return (
    <button className="export-button" onClick={exportAction}>
      Export button
    </button>
  );
}

export default Export;

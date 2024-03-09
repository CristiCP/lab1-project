import { useEffect, useState } from "react";
import Home from "./components/Home";
import ListPage from "./components/ListPage";
import Player from "./components/Player";
import "./inxdex.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";

function App() {
  const [playersList, setPlayersList] = useState<Player[]>([]);
  const [isOn, setOn] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);

  useEffect(() => {
    const player1 = new Player("Ronaldo", "Portugal", "Al-Nassr", 39);
    const player2 = new Player("Messi", "Argentina", "Inter Miami", 36);
    const player3 = new Player("Coman", "Romania", "FCSB", 25);
    setPlayersList([player1, player2, player3]);
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={<Home setPlayersList={setPlayersList}></Home>}
        ></Route>
        <Route
          path="/list"
          element={
            <ListPage
              players={playersList}
              setPlayersList={setPlayersList}
              isOn={isOn}
              setOn={setOn}
              selectedIndex={selectedIndex}
              setSelectedIndex={setSelectedIndex}
            ></ListPage>
          }
        ></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;

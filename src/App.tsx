import Home from "./components/Home";
import ListPage from "./components/Player/ListPage";
import TeamsListPage from "./components/Team/TeamsListPage";
import TeamsPlayers from "./components/TeamsWithPlayers/TeamsPlayers";
import "./inxdex.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home></Home>}></Route>
        <Route path="/players" element={<ListPage></ListPage>}></Route>
        <Route path="/teams" element={<TeamsListPage></TeamsListPage>}></Route>
        <Route path="/all" element={<TeamsPlayers></TeamsPlayers>}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;

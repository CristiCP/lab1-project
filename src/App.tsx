import Home from "./components/Home";
import ListPage from "./components/ListPage";
import "./inxdex.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home></Home>}></Route>
        <Route path="/list" element={<ListPage></ListPage>}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;

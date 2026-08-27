import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import DiaryWrite from "./pages/DiaryWrite";
import Archive from "./pages/Archive";
import DiaryDetail from "./pages/DiaryDetail";
import PreMatchCardDraw from "./pages/PreMatchCardDraw";

function App(){
  return(
    <Routes>
      <Route path="/" element={<Home />}/>
      <Route path="/diary/write" element={<DiaryWrite />}/>
      <Route path="/archive" element={<Archive />}/>
      <Route path="/diary/:id" element={<DiaryDetail/>}/>
      <Route path="/cards/pre-match" element={<PreMatchCardDraw />} />
    </Routes>
  );
}

export default App;

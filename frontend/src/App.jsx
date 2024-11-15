import { Routes, Route, Navigate } from 'react-router-dom'
import Registration from './Components/Register/Index.jsx'
import Login from './Components/Login/Index.jsx'
import Home from './Components/Home.jsx'
import Game from './Components/Game.jsx';
import LeaderBoard from './Components/LeaderBoard.jsx';
import GameOver from './Components/Gameover.jsx';

function App() {
  const user = localStorage.getItem("token");
  return (
    <>
      <div>
      <Routes>
          <Route path='/register' element={<Registration />} ></Route>
          <Route path='/login' element={<Login />} ></Route>
          <Route path='/home' element={user ? <Home /> : <Navigate to="/login" />} />
          <Route path='/game' element={user ? <Game /> : <Navigate to="/login" />} />
          <Route path='/leader-board' element={user ? <LeaderBoard /> : <Navigate to="/login" />}/>
          <Route path='/game-over' element={user ? <GameOver /> : <Navigate to="/login" />}/>
        </Routes>
      </div>
    </>
  )
}

export default App

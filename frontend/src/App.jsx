import { Routes, Route } from 'react-router-dom'
import Registration from './Components/Register/Index.jsx'
import Login from './Components/Login/Index.jsx'
import Home from './Components/Home/Index.jsx'

function App() {
  return (
    <>
      <div>
      <Routes>
          <Route path='/register' element={<Registration />} ></Route>
          <Route path='/login' element={<Login />} ></Route>
          <Route path='/home' element={<Home />} ></Route>
        </Routes>
      </div>
    </>
  )
}

export default App

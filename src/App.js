import {BrowserRouter, Route, Routes} from 'react-router-dom'
import './App.css';

import Login from './pages/Login/Login'
import Main from './pages/Main/Main'
import Profile from './pages/Profile/Profile'
import Register from './pages/Register/Register'

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Routes>
          <Route path='/profile' element={<Profile></Profile>}></Route>
          <Route path='/register' element={<Register></Register>}></Route>
          <Route path='/main' element={<Main></Main>}></Route>
          <Route path='/' element={<Login></Login>}></Route>
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;

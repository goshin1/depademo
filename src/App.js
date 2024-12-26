import { HashRouter, Routes, Route } from 'react-router-dom';
import Login from './component/Login';
import Join from './component/Join';
import Main from './component/Main';
import Project from './component/Project';
import GoogleEdit from './component/GoogleEdit';
import './App.css';
import Test from './component/Test'

function App() {
  return (
    <div id='widthApp' className="App">
      <HashRouter>
        <Routes>
          <Route path='/' element={<Login></Login>}></Route> 
          <Route path='/sign' element={<Join></Join>}></Route>
          <Route path='/main' element={<Main></Main>}></Route>
          <Route path='/project' element={<Project></Project>}></Route>
          <Route path='/google' element={<GoogleEdit></GoogleEdit>}></Route>
          <Route path='/test' element={<Test></Test>}></Route>
        </Routes>
      </HashRouter>
    </div>
  );
}

export default App;

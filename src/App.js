
import './App.css';
import {BrowserRouter as Router, Routes, Route, Link} from 'react-router-dom'
import { useParams } from 'react-router-dom';
import PageAll from './components/PageAll';

import Current from './components/Current';



function App() {


  const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2OGQyNDI5NC0xMTFiLTQ3Y2ItOWE0ZS1iOGM0MWVkNDFhM2EiLCJwbGF0Zm9ybSI6InN1YnNjcmlwdGlvbnMiLCJpYXQiOjE2NzkwNTYzNjMsImV4cCI6MTY3OTk1NjM2M30.9CieMFG5NXyeIXQLVbwzWFM51yikKE6e-p55Gmyqt20"

  return (
    <div className="App-body">
        <header>
          
        </header>
        <main>
            <Router>
                  <Routes>
                        <Route exact path="/" element={<PageAll />} />
                        <Route path="/:title" element={<Current data={token}/>} />
                        {/* <Route path="*" element={<error/>} /> */}
                  </Routes>
            </Router>
        </main>
        <footer>
        <p>All rights are reserved</p>
        </footer>
    </div>
  );
}

export default App;

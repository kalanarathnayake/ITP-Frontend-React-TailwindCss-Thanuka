import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import Navbar from "./components/navbar.component";
import { GroupList } from "./components/group-list.component";
import { CreateGroup } from './components/group-add.component';

function App() {
  return (
    <div>
      <Navbar />
      <Router>
        <Routes>
          <Route exact path="/group" element={<GroupList />} />
          <Route exact path="/createGroup" element={<CreateGroup />} />{/* Done */}
        </Routes>
      </Router>
    </div>
  );

}

export default App;

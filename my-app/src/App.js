import logo from './logo.svg';
import './App.css';
import Main from "./components/Main.js";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/Login.js';
import Signup from './components/Signup.js';
import Calendar from './components/Calendar.js';
import Edit_user from './components/Edit_user.js';
import Delete_user from './components/Delete_user.js';
import Event_cr from './components/Event_cr.js';
import Event_pt from './components/Event_pt.js';
import Add_participant from './components/Add_participant.js';
import Edit_event from './components/Edit_event.js';
import Add_event from './components/Add_event.js';
import Change_password from './components/Change_password.js';



function App() {
  return (
    <div className="App">
        <Routes>
            <Route path="/" element={<Main />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />
            <Route path="/calendar" element={<Calendar />} />
            <Route path="/edit_user" element={<Edit_user />} />
            <Route path="/delete_user" element={<Delete_user />} />
            <Route path="/event-creator" element={<Event_cr />} />
            <Route path="/event-participant" element={<Event_pt />} />
            <Route path="/add-participant" element={<Add_participant />} />
            <Route path="/edit-event" element={<Edit_event />} />
            <Route path="/add-event" element={<Add_event />} />
            <Route path="/change-password" element={<Change_password />} />
        </Routes>
    </div>
  );
}

export default App;

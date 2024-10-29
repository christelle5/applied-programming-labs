import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./Add_participant.css";

function Add_participant(){
    const loggedin = localStorage.getItem("loggedin");
    const userId = localStorage.getItem("userId");
    const username = localStorage.getItem("username");
    const password = localStorage.getItem("password");
    const eventId = localStorage.getItem("eventId");
    const navigate = useNavigate();

    const [participants, setParticipants] = useState([])
    const [event, setEvent] = useState([])
    const user = JSON.parse(localStorage.getItem("user"));
    const basicAuthHeader = "Basic " + btoa(`${username}:${password}`);
    const headers = new Headers();
    headers.append("Authorization", basicAuthHeader);
    headers.append('Content-Type', 'application/json');
    const [newrole, setNewrole] = useState('');

    const [participantUN, setParticipantUN] = useState('');
    const [participantRole, setParticipantRole] = useState('');
    const [participantID, setParticipantID] = useState();
    const[partID, setpartID] = useState();

    const [data1, setData1] = useState();

    function add_partic() {
        const urlUserId = `http://localhost:5000/api/v1/user/${participantUN}`;

        console.log(participantUN);

        if (participantUN === username)
        {
            alert("You are trying to add yourself...");
            window.location.reload();
        }
        else
        {
             fetch(urlUserId, {
                    method: "GET",
                    headers: headers,
                })
            .then(async response => {
                if (!response.ok) {
                    alert('User with such username does not exist. Try again.');
                    window.location.reload();
                }
                return response.json()
            })
            .then(data => {
                add_p(data);
            })
            .catch(error => {
                alert(error);
            })
            console.log(participantID);
        }
    }

    function add_p(id)
    {
        const datas = {user_status: newrole};
        console.log(datas);

        fetch(`http://127.0.0.1:5000/api/v1/event/${Number(eventId)}/participants/${Number(id)}`, {
            method: 'POST',
            headers,
            body: JSON.stringify(datas)
            })
           .then(async response => {
                if (!response.ok) {
                    const data = await response.json();
                    if(data && data.message)
                        {
                            if(data.message=='Access denied!')
                            {
                                alert("Access denied!");
                                window.location.reload();
                            }
                            if(data.message=='Invalid input.')
                            {
                                alert("Invalid input.");
                                window.location.reload();
                            }
                            if(data.message=='Participant already exists.')
                            {
                                alert("Participant already exists.");
                                window.location.reload();
                            }
                        }
                        else
                        {
                            if(data.user_status)
                            {
                                alert('Role: ' + data.user_status);
                            }
                        }
                }
                if (response.ok) {
                    const data = await response.json();
                    if(data && data.message)
                        {
                            if(data.message=='New participant was successfully added!')
                            {
                                alert("New participant was successfully added!");
                                window.location.reload();
                            }
                        }
                }
          })
          .then(data => {
            setData1(data);
            })
    }

    useEffect(() => {
    if (loggedin !== "true") {
      navigate("/login");
    }
  }, [loggedin, navigate]);

    function logout(e) {
    e.preventDefault();
    localStorage.removeItem("userId");
    localStorage.removeItem("role");
    localStorage.removeItem("username");
    localStorage.removeItem("password");
    console.log("userId", "role", "username", "password");
    console.log("Navigating to '/'");
    navigate("/");
    }

    return(
    <div>
          <meta charSet="UTF-8" />
          <title>My calendar</title>
          <header>
            <div className="logo">
              <img src={require("./logo.png")} alt="Logo" width={25} height={25} />
              <p>Pigeon Coop</p>
            </div>
            <nav>
              <ul>
                <li>
                  <Link to={"/calendar"}>My calendar</Link>
                </li>
                <li>
                  <Link to={"/edit_user"}>My profile</Link>
                </li>
                <li>
                  <button className="buttons2" onClick={logout}>
                    Log Out
                  </button>
                </li>
              </ul>
            </nav>
          </header>
          <div className="event-container">
          <h1>Add new participant</h1>
          <form>
            <p className="text">Input username of the user.</p>
            <label htmlFor="username">Username:</label>
            <input type="text" id="username" onChange={(e) => setParticipantUN(e.target.value)} required />

            <p className="text">You can add his/her role or any other additional information.</p>
            <label htmlFor="username">Role:</label>
            <input type="text" id="role" name="role" onChange={(e) => setNewrole(e.target.value)} required />

          </form>
          <div className="buttons-container">
              <button className="buttons" onClick={add_partic}>Confirm</button>
              <button className="buttons"><Link to='/calendar'>Cancel</Link></button>
          </div>
        </div>

          <footer>
            <div className="contact-info" id="contact-info">
              <p>
                Contact admin:
                <a href="bilka2004@ukr.net"> Christelle</a>.
              </p>
              <p>
                Find out more about the
                <Link to="https://github.com/christelle5/applied-programming-labs"> project</Link>.</p>
              <p>© 2023 The Events Calendar. All rights reserved.</p>
            </div>
          </footer>
        </div>
    );
}

export default Add_participant;
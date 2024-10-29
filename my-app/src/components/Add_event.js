import React, { useEffect, useState } from "react";
import { useNavigate, navigate, Link } from "react-router-dom";
import "./Add_event.css";

function Add_event()
{
    const [title, setTitle] = useState("");
    const [aboutEvent, setAboutEvent] = useState("");
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [startTime, setStartTime] = useState("");
    const [endTime, setEndTime] = useState("");

    const creator_userId = Number(localStorage.getItem("userId"));

    const loggedin = localStorage.getItem("loggedin");
    const userId = localStorage.getItem("userId");
    const username = localStorage.getItem("username");
    const password = localStorage.getItem("password");
    const user = JSON.parse(localStorage.getItem("user"));
    const basicAuthHeader = "Basic " + btoa(`${username}:${password}`);
    const headers = new Headers();
    headers.append("Authorization", basicAuthHeader);
    headers.append('Content-Type', 'application/json');

    const [data1, setData1] = useState({});
    const navigate = useNavigate();

    function add_event()
    {
        let datas={title, aboutEvent, startDate, endDate, startTime, endTime, creator_userId};
        console.log(datas);

        fetch('http://127.0.0.1:5000/api/v1/event', {
            method: 'POST',
            headers,
            body: JSON.stringify(datas)
            })
           .then(async response => {
                if (!response.ok) {
                    const data = await response.json();
                    if(data && data.message)
                        {
                            if(data.message=='Access denied! The operation is forbidden for you.')
                            {
                                alert('Access denied! The operation is forbidden for you.');
                                window.location.reload();
                            }
                            if(data.message=='Invalid input.')
                            {
                                alert("Invalid input.");
                                window.location.reload();
                            }
                        }
                        else
                        {
                            if(data.title)
                            {
                                alert('Title: ' + data.title);
                            }
                            if(data.aboutEvent)
                            {
                                alert('About event: ' + data.aboutEvent);
                            }
                            if(data.startDate)
                            {
                                alert('Start Date: ' + data.startDate);
                            }
                            if(data.startTime)
                            {
                                alert('Start Time: ' + data.startTime);
                            }
                            if(data.endDate)
                            {
                                alert('End Date: ' + data.endDate);
                            }
                            if(data.endTime)
                            {
                                alert('End Time: ' + data.endTime);
                            }
                        }
                }
                if (response.ok) {
                    const data = await response.json();
                    if(data && data.message)
                        {
                            if(data.message=='New event was successfully created!')
                            {
                                alert('New event was successfully created!');
                                console.log("Navigate to /calendar");
                                navigate('/calendar');
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

        return (
          <div>
            <meta charSet="UTF-8" />
            <title>Sign up page</title>
            <header>
              <div className="logo">
                <img src={require("./logo.png")} alt="Logo" width={25} height={25} /><p>Pigeon Coop</p>
              </div>
              <nav>
                <ul>
                  <li><Link to="/edit_user">My profile</Link></li>
                  <li><Link to="/calendar">My calendar</Link></li>
                  <li><button className="buttons2" onClick={logout}>Log Out</button></li>
                </ul>
              </nav>
            </header>
            <div className="event-container">
              <h1>Add new event to your calendar</h1>
              <form>
                <p className="text">How would you like to name your event?</p>
                <label htmlFor="title">Title:</label>
                <input type="text" id="title" name="title" required onChange={(e) => setTitle(e.target.value)} />

                <p className="text">You can add a short description, where other participants will be able to find out more about the event, but it is not necessary. For example, you can write the event venue there.</p>
                <label htmlFor="username">About:</label>
                <input type="text" id="about" name="about" onChange={(e) => setAboutEvent(e.target.value)} />

                <p className="text">Let's set the start date of the event.</p>
                <p className="options">Format: "YYYY-MM-DD".</p>
                <label htmlFor="startDate">Start date:</label>
                <input type="date" id="startDate" name="startDate" onChange={(e) => setStartDate(e.target.value)} required />

                <p className="text">Let's set the end date of the event.</p>
                <p className="options">Format: "YYYY-MM-DD".</p>
                <label htmlFor="endDate">End date:</label>
                <input type="date" id="endDate" name="endDate" onChange={(e) => setEndDate(e.target.value)} required />

                <p className="text">You can also add the start time, but it is not necessary.</p>
                <p className="options">Format: "HH:MM".</p>
                <label htmlFor="startTime">Start time:</label>
                <input type="time" id="startTime" name="startTime" onChange={(e) => setStartTime(e.target.value)} />

                <p className="text">And you can add the end time, but it is not necessary too.</p>
                <p className="options">Format: "HH:MM".</p>
                <label htmlFor="endTime">End time:</label>
                <input type="time" id="endTime" name="endTime" onChange={(e) => setEndTime(e.target.value)} />

                <div className="example-event">
                  <p className="text">For example, if you set:</p>
                  <p className="options">
                    Title: Summer Camp
                    <br />
                    About: Camp Harbor View,Plympton St. 46, Boston, Massachusetts.
                    <br />
                    Start date: 2025-06-02
                    <br />
                    End date: 2025-06-09
                    <br />
                    Start time: 10:00
                    <br />
                    End time: 20:00
                  </p>
                  <p className="text">
                    It will mean that 'Summer Camp' will last from 10 a.m. 02/03/25 to 8 p.m.
                    09/06/25.
                  </p>
                  <p className="text">
                    You can add participants to the event on Calendar -&gt; More details (of the
                    particular event) -&gt; Participants.
                  </p>
                </div>

              </form>

              <div className="buttons-container">
                <button type="submit" className="buttons" onClick={add_event}>Add event</button>
                <button className="buttons"><Link to="/calendar">Cancel</Link></button>
              </div>
            </div>
            <footer>
              <div className="contact-info" id="contact-info">
                <p>Contact admin:<a href="bilka2004@ukr.net"> Christelle</a>.</p>
                <p>
                  Find out more about the{" "}
                  <a href="https://github.com/christelle5/applied-programming-labs">
                    project
                  </a>
                  .
                </p>
                <p>© 2023 The Events Calendar. All rights reserved.</p>
              </div>
            </footer>
          </div>
        );
}

export default Add_event;
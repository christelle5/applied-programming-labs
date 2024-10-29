import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./Event.css";

function Event_cr(){
    const loggedin = localStorage.getItem("loggedin");
    const userId = Number(localStorage.getItem("userId"));
    const username = localStorage.getItem("username");
    const password = localStorage.getItem("password");
    const eventId = localStorage.getItem("eventId");
    console.log(eventId);
    const navigate = useNavigate();

    const [participants, setParticipants] = useState([])
    const [event, setEvent] = useState([])
    const urlEvent = `http://localhost:5000/api/v1/event/${Number(eventId)}`;
    const urlParticipants = `http://localhost:5000/api/v1/event/${Number(eventId)}/participants`;
    const user = JSON.parse(localStorage.getItem("user"));
    const basicAuthHeader = "Basic " + btoa(`${username}:${password}`);
    const headers = new Headers();
    headers.append("Authorization", basicAuthHeader);
    headers.append('Content-Type', 'application/json');

    console.log(urlParticipants);
    const [newrole, setNewrole] = useState('');
    const [data3, setData3] = useState();
    const [data4, setData4] = useState();
    const [data5, setData5] = useState();

     const fetchData1 = async () => {
        try {
          const response = await fetch(urlEvent, {
            method: "GET",
            headers: headers
          });
          if (response.ok) {
            const data = await response.json();
            setEvent(data);
          } else {
            throw new Error("Failed to fetch data");
          }
        } catch (error) {
          console.log(error);
        }
     };

    const fetchData2 = async () => {
        try {
          const response = await fetch(urlParticipants, {
            method: "GET",
            headers: headers,
          });
          if (response.ok) {
            const data = await response.json();
            setParticipants(data);
          } else {
            throw new Error("Failed to fetch data");
          }
        } catch (error) {
          console.log(error);
        }
     };

    const edit_participant = async (participant) => {
      let datas = { user_status: newrole };
      try {
        const response = await fetch(
          `http://127.0.0.1:5000/api/v1/event/${Number(eventId)}/participants/${participant.id}`,
          {
            method: "PUT",
            headers: headers,
            body: JSON.stringify(datas),
          }
        );
        if (response.ok) {
          const data = await response.json();
          setData3(data);
          console.log(data3);
          if (data.message) {
            if (data.message === "The participant was successfully updated!") {
              alert("The participant was successfully updated!");
              window.location.reload();
            } else if (data.message === "Access denied!") {
              alert("Access denied!");
              window.location.reload();
            } else if (data.message === "Invalid input.") {
              alert("Invalid input.");
            } else if (data.message === "Participant already exists.") {
              alert("Participant already exists.");
            }
          } else if (data.user_status) {
            alert("Role: " + data.user_status);
          }
        } else {
          throw new Error("Failed to fetch data");
        }
      } catch (error) {
        console.log(error);
      }
    };

    const delete_participant = async (participant) =>
    {
        try {
            const response = await fetch(`http://127.0.0.1:5000/api/v1/event/${Number(eventId)}/participants/${participant.id}`, {
            method: 'DELETE',
            headers,
            });
            if (response.ok) {
              const data = await response.json();
              setData4(data);
              console.log(data4);
              if (data.message) {
                if (data.message === "The participant was successfully deleted!") {
                  alert("The participant was successfully deleted!");
                  window.location.reload();
                } else if (data.message === "Access denied!") {
                  alert("Access denied!");
                } else if (data.message === "Invalid input.") {
                  alert("Invalid input.");
                }
                }
              }
          } catch (error) {
            console.log(error);
          }
    }

    const delete_event = async (event) =>
    {
        const eventId = event.eventId;
        try {
            const response = await fetch(`http://127.0.0.1:5000/api/v1/event/${Number(eventId)}`, {
            method: 'DELETE',
            headers,
            });
            if (response.ok) {
              const data = await response.json();
              setData5(data);
              console.log(data5);
            } else {
              throw new Error("Failed to fetch data");
            }
          } catch (error) {
            console.log(error);
          }

        console.log(data5);
        if (data5 && data5.message) {
                if (data5 && data5.message === "The event was successfully deleted!") {
                  alert("The event was successfully deleted!");
                }
                if (data5 && data5.message === "Access denied!") {
                  alert("Access denied!");
                }
                else
                {
                    console.log("undefined response, hmmm");
                }
        }
        navigate('/calendar');
    }

    useEffect(() => {
    if (loggedin !== "true") {
      navigate("/login");
    } else {
      fetchData1();
      fetchData2();
    }
  }, [loggedin, navigate]);

    function edit_event(event) {
    localStorage.setItem("title", event.title);
    console.log("Navigating to '/edit-event'");
    navigate("/edit-event");
    }

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
              <Link to={"/add-event"}>New event</Link>
            </li>
            <li>
              <button className="buttons2" onClick={logout}>
                Log Out
              </button>
            </li>
          </ul>
        </nav>
      </header>
  <div className="title">
    <p className="event__title"><h1>{event.title}</h1></p>
    <p className="event__time">Time: {event.startTime} - {event.endTime}</p>
    <p className="event__time">Start date: {event.startDate}</p>
    <p className="event__time">End date: {event.endDate}</p>
    <p className="event__description">About:</p>
    <p className="text">{event.aboutEvent}</p>
      <div className='buttons-container'>
        <button className="buttons"><Link to='/add-participant'>Add participant</Link></button>
        <button className="buttons" onClick={() => edit_event(event)}>Edit event</button>
        <button className="buttons" onClick={() => delete_event(event)}>Delete event</button>
      </div>
  </div>

  <div className="title">
    <h1>Participants</h1>
  </div>
  <div className="participants">
     {participants &&
      participants.map((participant) => {
        if (participant.status !== 'creator') {
          return (
            <div>
              <div className="participant">
              <div>
                <p className="participant__name">{participant.firstName} {participant.lastName}</p>
                <p className="participant__username">Username: {participant.username}</p>
                <p className="participant__status">Status: {participant.status}</p>
                <p className="participant__role">Role: {participant.role}</p>
                <label htmlFor="participant__role">New role:</label>
                <input type="text" id="participant__role" name="participant__role" onChange={(e) => setNewrole(e.target.value)} />
                 </div>
                  <div className='buttons-container'>
                    <button className="buttons" onClick={() => edit_participant(participant)}>Edit participant</button>
                    <button className="buttons" onClick={() => delete_participant(participant)}>Delete participant</button>
                  </div>
              </div>
            </div>
          );
        } else {
          return null; // Пропустити цей елемент
        }
      })
    }

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

export default Event_cr;
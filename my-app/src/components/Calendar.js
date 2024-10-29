import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./Calendar.css";

function Calendar() {
  const loggedin = localStorage.getItem("loggedin");
  const userId = Number(localStorage.getItem("userId"));
  const username = localStorage.getItem("username");
  const password = localStorage.getItem("password");
  const navigate = useNavigate();

  const [events, setEvents] = useState([]);
  const urlEvents = `http://localhost:5000/api/v1/calendar/${Number(userId)}`;
  const user = JSON.parse(localStorage.getItem("user"));
  const basicAuthHeader = "Basic " + btoa(`${username}:${password}`);
  const headers = new Headers();
  headers.append("Authorization", basicAuthHeader);

  const fetchData = async () => {
    try {
      const response = await fetch(urlEvents, {
        method: "GET",
        headers: headers,
        credentials: "same-origin",
      });
      if (response.ok) {
        const data = await response.json();
        setEvents(data);
      } else {
        throw new Error("Failed to fetch data");
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (loggedin !== "true") {
      navigate("/login");
    } else {
      fetchData();
    }
  }, [loggedin, navigate]);

  function logout(e) {
    e.preventDefault();
    localStorage.removeItem("userId");
    localStorage.removeItem("role");
    localStorage.removeItem("username");
    localStorage.removeItem("password");
    console.log("Navigating to '/'");
    navigate("/");
  }

  function about_event(event){
    localStorage.setItem('eventId', event.id);
    console.log(event.role);
    console.log(event.creator_userId);
    if (event.role == 'Creator') {
        console.log("Navigating to '/event");
        navigate('/event-creator');
    } else {
        console.log("Navigating to '/event");
        navigate("/event-participant");
    }
  }

  return (
   <div className="wrapper">
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

      <div className="content">
      <div className="title">
        <h1>My Events Calendar</h1>
      </div>
      <div className="events">
        {events &&
          events.map((event) => {
            var strDate = event.startDate.substring(0, 16);
            var strDate1 = event.endDate.substring(0, 16);
            if (event.role == "Participant") {
              var role = "You are just a participant of '" + event.title + "'.";
              localStorage.setItem('role', 'participant');
            } else {
              var role = "You are the creator of '" + event.title + "'.";
              localStorage.setItem('role', 'creator');
            }
            return (
              <div className="event">
                <h3 className="event__title" key={event.id}>
                  {event.title}
                </h3>
                <p className="event__sdate" key={event.id}>
                  Start date: {strDate}
                </p>
                <p></p>
                <p className="event__edate" key={event.id}>
                  End date: {strDate1}
                </p>
                <p></p>
                <p className="event__role" key={event.id}>
                  Status: {role}
                </p>
                <p className="event__description" key={event.id}>
                  About:
                </p>
                <p className="event__about" key={event.id}>
                  {event.aboutEvent}
                </p>
                <button type="submit" className="buttons" data-testid="more-details-button"
                onClick={() => about_event(event)}>More details</button>
              </div>
            );
          })}
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

export default Calendar;

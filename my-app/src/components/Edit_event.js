import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./Edit_event.css";

function Edit_event()
{
      const loggedin = localStorage.getItem("loggedin");
      const username = localStorage.getItem("username");
      const password = localStorage.getItem("password");
      const eventtitle = localStorage.getItem("title");
      const navigate = useNavigate();

      const [title_inp, setTitleInp] = useState("");
      const [aboutEvent_inp, setAboutEvent_inp] = useState("");
      const [startDate_inp, setStartDate_inp] = useState(null);
      const [endDate_inp, setEndDate_inp] = useState(null);
      const [startTime_inp, setStartTime_inp] = useState("");
      const [endTime_inp, setEndTime_inp] = useState("");
      const eventId = localStorage.getItem("eventId");
      const [dataput, setDataput] = useState(null);

      const [eventinfo, setEventinfo] = useState([]);
      const urlEvent = `http://localhost:5000/api/v1/event/${Number(eventId)}`;
      const user = JSON.parse(localStorage.getItem("user"));
      const basicAuthHeader = "Basic " + btoa(`${username}:${password}`);
      const headers = new Headers();
      headers.append("Authorization", basicAuthHeader);
      headers.append('Content-Type', 'application/json');

      const fetchData = async () => {
        try {
          const response = await fetch(urlEvent, {
            method: "GET",
            headers: headers,
          });
          if (response.ok) {
            const data = await response.json();
            setEventinfo(data);
          } else {
            throw new Error("Failed to fetch data");
          }
        } catch (error) {
          console.log(error);
        }
      };

      /* PUT new data */
      var newdata = new Object();

      function change_data()
      {
          if(title_inp !== ""){
                newdata.title = title_inp;
            }
          if(aboutEvent_inp !== ""){
                newdata.aboutEvent = aboutEvent_inp;
            }
          if(startDate_inp !== null){
                newdata.startDate = startDate_inp;
            }
          if(endDate_inp !== null){
                newdata.endDate = endDate_inp;
            }
          if(startTime_inp !== ""){
                newdata.startTime = startTime_inp;
            }
          if(endTime_inp !== ""){
                newdata.endTime = endTime_inp;
          }

          fetch(urlEvent, {
                method: 'PUT',
                headers,
                body: JSON.stringify(newdata)
                })
               .then(async response => {
                    if (!response.ok) {
                        const data = await response.json();
                        if(data && data.message)
                            {
                                if(data.message=='Access denied.')
                                {
                                    alert("Access denied.");
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
                                if(data.message=='Event successfully updated.')
                                {
                                    alert("Event successfully updated.");
                                    console.log('Navigate to /calendar');
                                    navigate('/calendar');
                                }
                            }
                    }
              })
              .then(data => {
                setDataput(data);
                })
        }

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
        console.log("userId", "role", "username", "password");
        console.log("Navigating to '/'");
        navigate("/");
    }

    return(
      <div>
        <meta charSet="UTF-8" />
        <title>Event</title>
        <header>
          <div className="logo">
            <img src={require("./logo.png")} alt="Logo" width={25} height={25} /><p>Pigeon Coop</p>
          </div>
          <nav>
            <ul>
              <li><Link to="/calendar">Change password</Link></li>
              <li><Link to="/calendar">My calendar</Link></li>
              <li><button className="buttons2" onClick={logout}>Log Out</button></li>
            </ul>
          </nav>
        </header>
        <div className="event-container">
       <h1>{eventtitle}</h1>
        <form>

        <p className="text" key={eventinfo.id}>Current title: {eventinfo.title}</p>
        <label htmlFor="title">Title:</label>
        <input type="text" id="title" name="title" onChange={(e) => setTitleInp(e.target.value)}/>

        <p className="text" key={eventinfo.id}>Current description: {eventinfo.aboutEvent}</p>
        <label htmlFor="username">About:</label>
        <input type="text" id="about" name="about" onChange={(e) => setAboutEvent_inp(e.target.value)}/>

        <p className="text">Current start date: {eventinfo.startDate}</p>
        <label htmlFor="startDate">Start date:</label>
        <input type="date" id="startDate" name="startDate" onChange={(e) => setStartDate_inp(e.target.value)}/>

        <p className="text">Current end date: {eventinfo.endDate}</p>
        <label htmlFor="endDate">End date:</label>
        <input type="date" id="endDate" name="endDate" onChange={(e) => setEndDate_inp(e.target.value)}/>

        <p className="text">Current start time: {eventinfo.startTime}</p>
        <label htmlFor="startTime">Start time:</label>
        <input type="time" id="startTime" name="startTime" onChange={(e) => setStartTime_inp(e.target.value)}/>

        <p className="text">Current end time: {eventinfo.endTime}</p>
        <label htmlFor="endTime">End time:</label>
        <input type="time" id="endTime" name="endTime" onChange={(e) => setEndTime_inp(e.target.value)}/>

        </form>
            <div className='buttons-container'>
                <button type="submit" className="buttons" onClick={change_data}>Confirm</button>
                <button type="button" className="buttons"><Link to="/calendar">Cancel</Link></button>
            </div>
        </div>
        <footer>
          <div className="contact-info" id="contact-info">
            <p>Contact admin:<a href="bilka2004@ukr.net"> Christelle</a>.</p>
            <p>
              Find out more about the {" "}
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


export default Edit_event;
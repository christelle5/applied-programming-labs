import React, { Component } from "react";
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Login from './Login';
import Signup from './Signup';
import "./Main.css";

function Main()
{
    return (
        <div>
        <meta charSet="UTF-8" />
        <title>Start Page</title>
        <header>
          <div className="logo">
            <img src={require("./logo.png")} alt="Logo" width={25} height={25} /><p>Pigeon Coop</p>
          </div>
          <nav>
            <ul>
                <li><Link to="/signup">Sign up</Link></li>
                <li><Link to="/login">Log in</Link></li>
            </ul>
          </nav>
        </header>
        <main>
          <div className="welcome">
            <h1>Welcome to The Events Calendar</h1>
          </div>
          <div className="about" id="about">
            <p>With the development of technology, society increasingly spends time on various entertainment websites, social networks, news portals, and so on. When a person browses, for example, a news feed on a social network, they simply scan the content: saw, scrolled, forgot, saw again, scrolled, and immediately forgot. This process involves short-term memory. People quickly switch from one topic to another. Neuroscientists have repeatedly concluded that the average modern person is generally more inattentive than, say, a half of century ago. Of course, both short-term and long-term memory are equally important. But without usage of long-term memory, the human brain becomes more forgetful and unfocused.</p>
            <p>Therefore, planning things becomes more difficult. It also becomes harder to follow the flow of events that are happening around them and not miss anything. To help us organize our time, planners, organizers, and many other tools, including event calendars, was invented.</p>
            <div className="features">
              <h4>Opportunities of The Events Calendar:</h4>
              <ul>
                <li>You have your own event calendar, where you can find both events you have created and events you are participating in.</li>
                <li>You can create, edit and customize new events, add other participants and assign roles to events to your preferences.</li>
                <li>You can remove unwanted guests from the event at any moment.</li>
                <li>You can always decline to participate in an event.</li>
                <li>You can see the list of participants for events in which you are either the creator or a participant.</li>
                <li>You have the option to view all of your events consolidated in one location to ensure you don't overlook anything.</li>
              </ul>
            </div>
            <p>All of this and much more can be found on The Events Calendar. New features will be implemented soon.<br />To start using our event calendar, please sign up or log in.</p>
          </div>
          <div className="contact-form" id="contact-form">
            <h2>Contact Us</h2>
            <form>
              <div className="form-group">
                <label htmlFor="name">Name:</label>
                <input type="text" id="name" name="name" required />
              </div>
              <div className="form-group">
                <label htmlFor="email">Email:</label>
                <input type="email" id="email" name="email" required />
              </div>
              <div className="form-group">
                <label htmlFor="message">Message:</label>
                <textarea id="message" name="message" required defaultValue={""} />
              </div>
              <button type="submit">Send</button>
            </form>
          </div>
        </main>
        <footer>
          <div className="contact-info" id="contact-info">
            <p>Contact admin:<a href="bilka2004@ukr.net"> Christelle</a>.</p>
            <p>Find out more about the <a href="https://github.com/christelle5/applied-programming-labs">project</a>.</p>
            <p>© 2023 The Events Calendar. All rights reserved.</p>
          </div>
        </footer>
      </div>
    );
}

export default Main;
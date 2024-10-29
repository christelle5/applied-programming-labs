import React, { useEffect, useState } from "react";
import { useNavigate, navigate, Link } from "react-router-dom";
import "./Login.js";
import "./Main.js";
import "./Signup.css";

function Signup()
{
    const [username, setUsername] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [passwordConfirm, setPasswordConfirm] = useState("");
    const [phone, setPhone] = useState("");
    const [loggedin, setLoggedin] = useState(false);
    const [data1, setData1] = useState({});
    const navigate = useNavigate();
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');

    function signup()
    {
        let datas={username, firstName, lastName, email, password, phone};

        if(password != passwordConfirm){
            alert("Passwords are different!")
        } else
        {
          fetch('http://127.0.0.1:5000/api/v1/user', {
            method: 'POST',
            headers,
            body: JSON.stringify(datas)
            })
           .then(async response => {
                if (!response.ok) {
                    const data = await response.json();
                    if(data && data.message)
                        {
                            if(data.message=="User with such username or email already exists.")
                            {
                                alert("User with such username or email already exists.");
                                window.location.reload();
                            }
                        }
                        else
                        {
                            if(data.username)
                            {
                                alert('Username: ' + data.username);
                            }
                            if(data.firstName)
                            {
                                alert('First Name: ' + data.firstName);
                            }
                            if(data.lastName)
                            {
                                alert('Last Name: ' + data.lastName);
                            }
                            if(data.email)
                            {
                                alert('Email: ' + data.email);
                            }
                            if(data.phone)
                            {
                                alert('Phone: ' + data.phone);
                            }
                            if(data.password)
                            {
                                alert('Password: ' + data.password);
                            }
                        }
                }
                if (response.ok) {
                    const data = await response.json();
                    if(data && data.message)
                        {
                            if(data.message=='New user was successfully created!')
                            {
                                alert('New user was successfully created!');
                                navigate('/login');
                            }
                        }
                }
          })
          .then(data => {
            setData1(data);
            })
        }
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
              <li><Link to="/">About service</Link></li>
              <li><Link to="/login">Log in</Link></li>
            </ul>
          </nav>
        </header>
        <div className="signup-container">
          <h1>Sign Up</h1>
          <form>
            <label htmlFor="username">Username:</label>
            <input
              type="text"
              id="username"
              name="username"
              placeholder="user_n4me"
              data-testid="username"
              onChange={(e) => setUsername(e.target.value)}
              required
            />
            <label htmlFor="firstname">First Name:</label>
            <input
              type="text"
              id="firstname"
              name="firstname"
              placeholder="John"
              data-testid="firstName"
              onChange={(e) => setFirstName(e.target.value)}
              required
            />
            <label htmlFor="lastname">Last Name:</label>
            <input
              type="text"
              id="lastname"
              name="lastname"
              placeholder="Kim"
              data-testid="lastName"
              onChange={(e) => setLastName(e.target.value)}
              required
            />
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="johnkim@yahoo.com"
              data-testid="email"
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <label htmlFor="phone">Phone:</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              placeholder="0123456789"
              data-testid="phone"
              onChange={(e) => setPhone(e.target.value)}
              required
            />
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="p4sSw0_rd&%d1"
              data-testid="password"
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <label htmlFor="confirm-password">Confirm Password:</label>
            <input
              type="password"
              id="confirm-password"
              name="confirm-password"
              placeholder="p4sSw0_rd&%d1"
              data-testid="confirm-password"
              onChange={(e) => setPasswordConfirm(e.target.value)}
              required
            />
          </form>
          <div className="buttons-container">
            <button type="submit" className="buttons" onClick={signup}>SignUp</button>
            <button className="buttons"><Link to="/">Cancel</Link></button>
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

export default Signup;
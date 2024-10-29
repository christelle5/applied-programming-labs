import React, { useEffect, useState } from "react";
import { useNavigate, navigate, Link } from "react-router-dom";
import "./Login.css";

function Login()
{
    const [username, setUsername]=useState("");
    const [password, setPassword]=useState("");
    const [loggedin, setLoggedin] = useState(false);
    const [data1, setData1] = useState({});
    const navigate = useNavigate();

    async function login()
    {
        let data={username, password};

        try {
          const response = await fetch('http://127.0.0.1:5000/api/v1/login', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
          })
          .then((r) => r.json())
          .then(r => {
            localStorage.setItem('username', username);
            localStorage.setItem('password', password);
            setData1(r);});
        } catch (error) {
          // TypeError: Failed to fetch
          console.log('There was an error', error);
        }
            if (data1 && data1.messages)
        {
            if (data1.messages === 'Success.')
            {
                setLoggedin(true);
                localStorage.setItem('loggedin', true);
                navigate("/calendar");
            }
            if (data1.messages === 'User does not exists.')
            {
                alert('User does not exists.');
                window.location.reload();
            }
            if (data1.messages == 'Invalid input. Try again.')
            {
                alert('Invalid input. Try again.');
                window.location.reload();
            }
        }
    }

    console.log(data1.message);
    localStorage.setItem('userId', data1.userId);


    useEffect(() => {
        if (loggedin === 'true') {
              localStorage.setItem('loggedin', true);
              navigate("/calendar");
            }
          }, [loggedin]);

    return (
      <div className="wrapper">
        <meta charSet="UTF-8" />
        <title>Log In Page</title>
        <header>
          <div className="logo">
            <img src={require("./logo.png")} alt="Logo" width={25} height={25} /><p>Pigeon Coop</p>
          </div>
          <nav>
            <ul>
                <li><Link to="/">About service</Link></li>
                <li><Link to="/signup">Sign up</Link></li>
            </ul>
          </nav>
        </header>

        <div className="content">
        <div className="login-container">
          <h1>Log In</h1>
          <form id="form">
            <label htmlFor="username">Username:</label>
            <input type="text" id="username" name="username" data-testid='username' placeholder="username"
            onChange={(e) => setUsername(e.target.value)}
            required />
            <label htmlFor="password">Password:</label>
            <input type="password" id="password" name="password" data-testid='password' placeholder="password"
             onChange={(e) => setPassword(e.target.value)}
             required />
          </form>
          <button type="submit" className="buttons" onClick={login}>Log in</button>
        </div>
        </div>

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

export default Login;
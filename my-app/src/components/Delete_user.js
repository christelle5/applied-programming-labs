//<script src="https://unpkg.com/react-router-dom/umd/react-router-dom.min.js"></script>
import React, { useEffect, useState } from "react";
import { useNavigate, navigate, Link } from "react-router-dom";
import "./Delete_user.css";

function Delete_user()
{
    const [password1, setPassword1] = useState("");
    const [password2, setPassword2] = useState("");

    const loggedin = localStorage.getItem("loggedin");
    const userId = localStorage.getItem("userId");
    const username = localStorage.getItem("username");
    const password = localStorage.getItem("password");
    const navigate = useNavigate();

    const [userinfo, setUserinfo] = useState([]);
    const urlUser = `http://localhost:5000/api/v1/user/${userId}`;
    const user = JSON.parse(localStorage.getItem("user"));
    const basicAuthHeader = "Basic " + btoa(`${username}:${password}`);
    const headers = new Headers();
    headers.append("Authorization", basicAuthHeader);

    async function delete_user()
    {
        if (password1==password2 && password==password1){

            try {
            const response = await fetch(urlUser, {
            method: 'DELETE',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': basicAuthHeader,
            }
            })
            .then((r) => r.json())
            } catch (error) {
            // TypeError: Failed to fetch
            console.log('There was an error', error);
        }
        localStorage.removeItem("userId");
        localStorage.removeItem("role");
        localStorage.removeItem("username");
        localStorage.removeItem("password");
        console.log("userId", "role", "username", "password");
        console.log("Navigating to '/'");
        navigate("/");

        } else
        {
            alert("Incorrect password!");
        }
    }

    useEffect(() => {
        if (loggedin !== "true") {
          navigate("/login");
        }
    }, [loggedin]);

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
        <title>My profile</title>
        <header>
          <div className="logo">
            <img src={require("./logo.png")} alt="Logo" width={25} height={25} /><p>Pigeon Coop</p>
          </div>
          <nav>
            <ul>
              <li><Link to="/calendar">My calendar</Link></li>
              <li><button className="buttons2" onClick={logout}>Log Out</button></li>
            </ul>
          </nav>
        </header>
          <div class="password-container">
          <h1>Are you sure you want to delete your account?</h1>
          <form>
            <label for="password">Input your password:</label>
            <input type="password" id="password" name="password" onChange={(e) => setPassword1(e.target.value)} required/>

            <label for="password">Confirm password:</label>
            <input type="password" id="password" name="password" onChange={(e) => setPassword2(e.target.value)} required/>
          </form>
          <div className='buttons-container'>
            <button type="submit" class="buttons" onClick={delete_user}>Delete my account</button>
            <button type="button" class="buttons"><Link to={'/edit_user'}>Cancel</Link></button>
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


export default Delete_user;
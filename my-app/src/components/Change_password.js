import React, { useEffect, useState } from "react";
import { useNavigate, navigate, Link } from "react-router-dom";
import "./Change_password.css";

function Change_password()
{
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword1, setPassword1] = useState("");
    const [newPassword2, setPassword2] = useState("");
    const loggedin = localStorage.getItem("loggedin");
    const userId = localStorage.getItem("userId");
    const username = localStorage.getItem("username");
    const password = localStorage.getItem("password");
    const navigate = useNavigate();

    const [dataput, setDataput] = useState();
    const urlUser = `http://localhost:5000/api/v1/user/${Number(userId)}`;
    const basicAuthHeader = "Basic " + btoa(`${username}:${password}`);
    const [oldbasicAuthHeader, setOldBasicAuthHeader] = useState();

    const headers = new Headers();
    headers.append("Authorization", basicAuthHeader);
    headers.append('Content-Type', 'application/json');

    var newdata = new Object();

    function change_password()
    {
        if(oldPassword !== password)
        {
            alert("Incorrect old password.")
            window.location.reload();
        } else
        {
          if (newPassword1 !== newPassword2)
          {
            alert("Passwords are different. Try again.");
            window.location.reload();
          }
          else
          {
              newdata.password = newPassword1;

              fetch(urlUser, {
                    method: 'PUT',
                    headers,
                    body: JSON.stringify(newdata)
                    })
                   .then(async response => {
                        if (!response.ok) {
                            const data = await response.json();
                            if(data && data.message)
                                {
                                    if(data.message==='Access denied.')
                                    {
                                        alert('Access denied.');
                                        window.location.reload();
                                    }
                                }
                                else
                                {
                                    if(data.password)
                                    {
                                        alert('Password: ' + data.password);
                                    }
                                }
                        }
                        if (response.ok) {
                            const data = await response.json();
                            if(data)
                                {
                                    alert('Successfully changed!');
                                    localStorage.setItem('password', newPassword1);
                                    console.log('Navigate to /edit_user');
                                    navigate('/edit_user');
                                }
                        }
                  })
                  .then(data => {
                    setDataput(data);
                    })
            }
          }
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
      <div className="wrapper">
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

        <div className="content">
            <div className="password-container">
              <h1>Change your password</h1>
              <form>
                <label htmlFor="old-password">Old password:</label>
                <input type="password" id="old-password" name="old-password" required
                onChange={(e) => setOldPassword(e.target.value)}/>

                <label htmlFor="new-password">New password:</label>
                <input type="password" id="new-password" name="new-password" required
                onChange={(e) => setPassword1(e.target.value)}/>

                <label htmlFor="confirm-password">Confirm new password:</label>
                <input type="password" id="confirm-password" name="confirm-password" required
                onChange={(e) => setPassword2(e.target.value)}/>
              </form>
                <div className='buttons-container'>
                    <button type="submit" className="buttons" onClick={change_password}>Confirm</button>
                    <button type="button" className="buttons"><Link to="/edit_user">Cancel</Link></button>
                </div>
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

export default Change_password;
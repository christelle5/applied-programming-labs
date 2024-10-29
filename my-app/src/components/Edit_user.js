import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./Edit_user.css";

function Edit_user()
{
      const loggedin = localStorage.getItem("loggedin");
      const userId = localStorage.getItem("userId");
      const username = localStorage.getItem("username");
      const password = localStorage.getItem("password");
      const navigate = useNavigate();

      const [password_inp, setPasswordInp] = useState("");
      const [username_inp, setUsername_inp] = useState("");
      const [firstName_inp, setFirstName_inp] = useState("");
      const [lastName_inp, setLastName_inp] = useState("");
      const [email_inp, setEmail_inp] = useState("");
      const [phone_inp, setPhone_inp] = useState("");
      const [dataput, setDataput] = useState();

      const [userinfo, setUserinfo] = useState([]);
      const urlUser = `http://localhost:5000/api/v1/user/${userId}`;
      const user = JSON.parse(localStorage.getItem("user"));
      const basicAuthHeader = "Basic " + btoa(`${username}:${password}`);
      const headers = new Headers();
      headers.append("Authorization", basicAuthHeader);
      headers.append('Content-Type', 'application/json');

      const fetchData = async () => {
        try {
          const response = await fetch(urlUser, {
            method: "GET",
            headers: headers,
            credentials: "same-origin",
          });
          if (response.ok) {
            const data = await response.json();
            setUserinfo(data);
            console.log(userinfo);
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
        if(password_inp != password){
            alert("Incorrect password.")
        } else
        {
          if(username_inp != ""){
                newdata.username = username_inp;
            }
          if(firstName_inp != ""){
                newdata.firstName = firstName_inp;
            }
          if(lastName_inp != ""){
                newdata.lastName = lastName_inp;
            }
          if(email_inp != ""){
                newdata.email = email_inp;
            }
          if(phone_inp != ""){
                newdata.phone = phone_inp;
            }
          console.log(newdata);

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
                                if(data.message=='User with such username already exists.')
                                {
                                    alert('User with such username already exists.');
                                    window.location.reload();
                                }
                                if(data.message=='User with such email already exists.')
                                {
                                    alert('User with such email already exists.');
                                    window.location.reload();
                                }
                                if(data.message=='Access denied.')
                                {
                                    alert('Access denied.');
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
                            }
                    }
                    if (response.ok) {
                        const data = await response.json();
                        if(data && data.message)
                            {
                                if(data.message=='Successfully changed!')
                                {
                                    alert('Successfully changed!');
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
        <title>My profile</title>
        <header>
          <div className="logo">
            <img src={require("./logo.png")} alt="Logo" width={25} height={25} /><p>Pigeon Coop</p>
          </div>
          <nav>
            <ul>
              <li><Link to="/change-password">Change password</Link></li>
              <li><Link to="/calendar">My calendar</Link></li>
              <li><button className="buttons2" onClick={logout}>Log Out</button></li>
            </ul>
          </nav>
        </header>
        <div className="user-container">
       <h1>My profile</h1>
        <form>
        <p className="text">If you want to change your password, click on <Link to="/change-password">here</Link>.</p>
        <p className="text">If you want to delete your account, click on <Link to='/delete_user'>here</Link>.</p>

        <p className="cusername" key={userinfo.id}>Current username: {userinfo.username}</p>
        <label htmlFor="username">Username:</label>
        <input type="text" id="username" name="username" data-testid='username1' onChange={(e) => setUsername_inp(e.target.value)}/>

        <p className="cname" key={userinfo.id}>Current first name: {userinfo.firstName}</p>
        <label htmlFor="firstname">First Name:</label>
        <input type="text" id="firstname" name="firstname" onChange={(e) => setFirstName_inp(e.target.value)}/>

        <p className="clastname" key={userinfo.id}>Current last name: {userinfo.lastName}</p>
        <label htmlFor="lastname">Last Name:</label>
        <input type="text" id="lastname" name="lastname" onChange={(e) => setLastName_inp(e.target.value)}/>

        <p className="cemail" key={userinfo.id}>Current email: {userinfo.email}</p>
        <label htmlFor="email">Email:</label>
        <input type="email" id="email" name="email" onChange={(e) => setEmail_inp(e.target.value)}/>

        <p className="cphone" key={userinfo.id}>Current phone: {userinfo.phone}</p>
        <label htmlFor="phone">Phone:</label>
        <input type="tel" id="phone" name="phone" onChange={(e) => setPhone_inp(e.target.value)}/>

        <p className="text">Input password to confirm changes.</p>
        <label htmlFor="password">Password:</label>
        <input type="password"
        id="password"
        name="password"
        onChange={(e) => setPasswordInp(e.target.value)}
        required />
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


export default Edit_user;
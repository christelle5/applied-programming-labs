function elementFromHtml(html){
    const template = document.createElement("template");

    template.innerHTML = html.trim();

    return template.content.firstElementChild;
}

//const urlParams = new URLSearchParams(window.location.search);
//const id = urlParams.get('id');

var userId = localStorage.getItem('userId');
console.log(userId);

/*var username = localStorage.getItem('username');
var password = localStorage.getItem('password');*/

/*if (userId == null) {
    window.location.href = '../front/login-page.html';
}*/

let urlUser = "http://localhost:5000/api/v1/user/" + userId;

/*let h = new Headers();
h.append('Accept', 'application/json');
let encoded = btoa(username + ':' + password);*/


//let auth = 'Basic ' + encoded;

//h.append('Authorization', auth);
//console.log(auth);

const basicAuthHeader = "Basic " + btoa('user2:user2');
let headers = new Headers();
headers.append('Authorization', basicAuthHeader);

let req2 = new Request(urlUser, {
    method:'GET',
    headers: headers,
    credentials:'same-origin'
});
fetch(req2)
    .then(response => {
      if (!response.ok) {
        alert('Server error.');
      }
    return response.json();
    })
    .then(user_data => {
    const user = elementFromHtml(`
        <div class = 'user_container'>
          <h1>My profile</h1>
        <form>
        <p class="text">If you want to change your password, click on <a href="./password-page.html">here</a>.</p>
        <p class="text">If you want to delete your account, click on <a href="./del-user-page.html">here</a>.</p>

        <p class="cusername">Current username: nick_v_detective_dc</p>

        <label for="username">Username:</label>
        <input type="text" id="username" name="username">
        <div class="error-message" id="username-error"></div>

        <p class="cname">Current first name: Nick</p>

        <label for="firstname">First Name:</label>
        <input type="text" id="firstname" name="firstname">

        <p class="clastname">Current last name: Valentine</p>

        <label for="lastname">Last Name:</label>
        <input type="text" id="lastname" name="lastname">

        <p class="cemail">Current email: nickv_detect@diamondcity.com</p>

        <label for="email">Email:</label>
        <input type="email" id="email" name="email">
        <div class="error-message" id="email-error"></div>

        <p class="cphone">Current phone: +617018290051</p>

        <label for="phone">Phone:</label>
        <input type="tel" id="phone" name="phone">

        <p class="text">Input password to confirm changes.</p>
        <label for="password">Password:</label>
        <input type="password" id="password" name="password" required>
        <div class="error-message" id="password-error"></div>

        <button type="submit">Confirm</button>
        <button type="button" class="cancel-button"><a href="./calendar-page.html">Cancel</a></button>
        </form></div>
            `);

            var cUserName = user.querySelector(".cusername");
            var cName = user.querySelector(".cname");
            var cLastName = user.querySelector(".clastname");
            var cEmail = user.querySelector(".cemail");
            var cPhone = user.querySelector(".cphone");

            console.log(user_data.username, user_data.firstName, user_data.lastName,
            user_data.email, user_data.phone);

            cUserName.innerHTML = "Current username: " + user_data.username + ".";
            cName.innerHTML = "Current first name: " + user_data.firstName + ".";
            cLastName.innerHTML = "Current last name: " + user_data.lastName + ".";
            cEmail.innerHTML = "Current email: " + user_data.email + ".";
            if (user_data.phone != null) {
                cPhone.innerHTML = "Current phone: " + user_data.phone + ".";
            } else
            {
                cPhone.innerHTML = "There is no phone number yet, but you can add it.";
            }

           var userinfo = document.querySelector(".user-container");
           userinfo.appendChild(user);
    })
    .catch(error => console.error(error));



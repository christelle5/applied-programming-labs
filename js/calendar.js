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

let urlEvents = "http://localhost:5000/api/v1/calendar/" + userId;

/*let h = new Headers();
h.append('Accept', 'application/json');
let encoded = btoa(username + ':' + password);*/


//let auth = 'Basic ' + encoded;

//h.append('Authorization', auth);
//console.log(auth);

const basicAuthHeader = "Basic " + btoa('user2:user2');
let headers = new Headers();
headers.append('Authorization', basicAuthHeader);

let req2 = new Request(urlEvents, {
    method:'GET',
    headers: headers,
    credentials:'same-origin'
});
fetch(req2)
    .then(response => {
      if (!response.ok) {
        alert('Incorrect login or password. Please try again.');
      }
    return response.json();
    })
    .then(data => {
        data.forEach(element =>{
            const event = elementFromHtml(`
            <div class="event">
            <h3 class="event__title">Sunday Party</h3>
            <p class="event__sdate">Start date: 23.04.2023<p>
            <p class="event__edate">End date: 24.04.2023<p>
            <p class="event__role">Status: participant</p>
            <p class="event__description">About:</p>
            <p class="event__about">"Oh that's new party! What a wonderful life!"</p>
            <a href="event-page-prtc.html" class="buttons">More details</a>
            </div>
            `);

            var titleName = event.querySelector(".event__title");
            var timeName = event.querySelector(".event__time");
            var sdateName = event.querySelector(".event__sdate");
            var edateName = event.querySelector(".event__edate");
            var roleName = event.querySelector(".event__role");
            var aboutName = event.querySelector(".event__about");
            //var addBttn = event.querySelector("#add-button");
            //addBttn.href("onclick", "window.location='event-page.html?id=" + element.eventId + "'");


            titleName.innerHTML = element.title;

            var dateParts = element.startDate.split("-");
            var jsDate = new Date(dateParts[0], dateParts[1] - 1, dateParts[2].substr(0,2));
            var strDate = dateParts[2].substr(0,2) + "/" + (dateParts[1]) + "/" + dateParts[0];
            sdateName.innerHTML = "Starting " + strDate + " at " + element.startTime + ".";

            var dateParts1 = element.endDate.split("-");
            var jsDate1 = new Date(dateParts1[0], dateParts1[1] - 1, dateParts1[2].substr(0,2));
            var strDate1 = dateParts1[2].substr(0,2) + "/" + (dateParts1[1]) + "/" + dateParts1[0];
            edateName.innerHTML = "Ending " + strDate1 + " at " +element.endTime + ".";

            if (element.role == 'Participant')
            {
                roleName.innerHTML = "You are just a participant of '" + element.title + "'.";
                localStorage.setItem('role', 'participant');
            } else
            {
                roleName.innerHTML = "You are the creator of '" + element.title + "'.";
                localStorage.setItem('role', 'creator');
            }
            aboutName.innerHTML = element.aboutEvent;
            console.log(localStorage.getItem('role'));

           var calendar = document.querySelector(".events");
            calendar.appendChild(event);
        })
    })
    .catch(error => console.error(error));
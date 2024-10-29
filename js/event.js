function elementFromHtml(html){
    const template = document.createElement("template");

    template.innerHTML = html.trim();

    return template.content.firstElementChild;
}

var userId = localStorage.getItem('userId');
console.log(userId);

const eventId = new URLSearchParams(window.location.search).get('eventId');

//let urlEvents = "http://localhost:5000/api/v1/calendar/" + eventId;

let urlEvent = "http://localhost:5000/api/v1/event/1";
var status = 'participant';

const basicAuthHeader = "Basic " + btoa('user2:user2');
let headers = new Headers();
headers.append('Authorization', basicAuthHeader);


let req2 = new Request(urlEvent, {
    method:'GET',
    headers: headers,
    credentials:'same-origin'
});

if (status == 'participant'){
    fetch(req2)
    .then(response => {
      if (!response.ok) {
        alert('Incorrect login or password. Please try again.');
      }
    return response.json();
    })
    .then(data => {
        const event = elementFromHtml(`
        <div class="title">
            <p class="event__title"><h1>Friday party</h1></p>
            <p class="event__time">Time: 22:00 - 03:00</p>
            <p class="event__sdate">Start date: 21.04.2023<p>
            <p class="event__edate">End date: 22.04.2023<p>
            <p class="event__description">About:</p>
            <p class="text">Place: The Great Green Jewel of the Commonwealth.</p>
            <a href="add-partic-page.html" class="buttons">Add participant</a>
            <a href="edit-event-page.html" class="buttons">Edit event</a>
            <a href="event-page-prtc.html" class="buttons">Delete event</a>
        </div>
        `);

            var titleName = event.querySelector(".event__title");
            var timeName = event.querySelector(".event__time");
            var sdateName = event.querySelector(".event__sdate");
            var edateName = event.querySelector(".event__edate");
            var roleName = event.querySelector(".event__role");
            var aboutName = event.querySelector(".event__description");


            titleName.innerHTML = element.title;

            var dateParts = element.startDate.split("-");
            var jsDate = new Date(dateParts[0], dateParts[1] - 1, dateParts[2].substr(0,2));
            var strDate = dateParts[2].substr(0,2) + "/" + (dateParts[1]) + "/" + dateParts[0];
            sdateName.innerHTML = "Starting " + strDate + " at " + element.startTime + ".";

            var dateParts1 = element.endDate.split("-");
            var jsDate1 = new Date(dateParts1[0], dateParts1[1] - 1, dateParts1[2].substr(0,2));
            var strDate1 = dateParts1[2].substr(0,2) + "/" + (dateParts1[1]) + "/" + dateParts1[0];
            edateName.innerHTML = "Ending " + strDate1 + " at " +element.endTime + ".";

            if (element.role == 'participant')
            {
                roleName.innerHTML = "You are just a participant of '" + element.title + "'.";
                localStorage.setItem('role', 'participant');
            } else
            {
                roleName.innerHTML = "You are the creator of '" + element.title + "'.";
                localStorage.setItem('role', 'creator');
            }
            aboutName.innerHTML = element.aboutEvent;

           var calendar = document.querySelector(".title");
           calendar.appendChild(event);
    })
    .catch(error => console.error(error));
}


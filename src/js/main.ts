// Object Types
// helps with autocompletion and helps with type checking during dev
type Course = {
    id: number,
    name: string,
    school: string,
    startDate: string,
    endDate: string
}
type Job = {
    id: number,
    workplace: string,
    title: string,
    startDate: string,
    endDate: string
}

type Website = {
    id: number,
    title: string,
    url: string,
    description: string
}

let baseURL: string = "https://ojaskivi.se/cv/public/api/";

// uncomment to use localhost DB instead
// if (location.hostname === "localhost" || location.hostname === "127.0.0.1") baseURL = "http://127.0.0.1:8000/api/"

const allUrls: string[] = ['courses', 'jobs', 'websites'];

// do when first load
window.onload = () => {
    fetchAllData();
    toggleLogin();
}

// get api-token from localStorage
let TOKEN: string | null = localStorage.getItem('api-token');

// get elements from
const searchFormEl = document.getElementById("search-form");
searchFormEl.addEventListener('submit', search);

const outputEl = document.getElementById("api-output");
const coursesEl = document.getElementById("api-courses");
const jobsEl = document.getElementById("api-jobs");
const websitesEl = document.getElementById("api-websites");
const loginEl = document.getElementById('login');


// define global variables
let selectEl: any;
let loginCreditsEl: any;

async function login(e: any) {
    e.preventDefault();

    loginCreditsEl = document.getElementById('login-credits');

    let stringToken = loginCreditsEl.value;

    let object = {
        token: stringToken
    }

    // add data/info to the request
    // body is the actual "kött och potatis" of the request
    const meta = {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(object)
    }

    // send the request and wait until it's resolved
    const response = await fetch(baseURL + "login", meta)
        .then((response) => response.json())
        .then(data => { return data; })
        .catch(error => {
            console.error(error);
        });

    // om requesten återkommer med en token har det lyckats, annars misslyckades det
    // if the request returns a token, login has been successful
    if (response.token) {
        // save to token in localStorage and add it to the TOKEN-variable
        localStorage.setItem('api-token', response.token);
        TOKEN = response.token;
        toggleLogin();
    } else {
        // login failed
        document.getElementById('login-input-info').innerHTML = "Felaktig inloggning";
    }
}

async function logout() {

    const meta = {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            // you have to be logged in to logout, therefore there is an authorization sent with the request
            'Authorization': `Bearer ${TOKEN}`
        }
    }

    await fetch(baseURL + "logout", meta)
        .catch(error => {
            console.error(error);
        });

    // remove the token variable, delete it from localstorage and toggle login
    TOKEN = null;
    localStorage.removeItem('api-token');
    toggleLogin();
}

function toggleLogin() {

    // if there is a token, display the logged in menu
    // if you fake a login, the requests will still fail on the REST-side
    if (TOKEN != "" && TOKEN != null) {
        loginEl.innerHTML = `
        <button onclick="newCourseForm()"> Lägg till objekt </button>
            <button onclick="logout()">Logga ut</button>
        `

        // display the edit/delete-buttons
        toggleButtons();
    } else {

        // print the login form
        loginEl.innerHTML = `
        <details>
        <summary>Logga in</summary>
        <form id="login-form" name="login-form" onsubmit="login(event)">
            <input
              id="login-credits"
              type="password"
              name="credits"
              placeholder="Inloggningsuppgifter"
              required
            />
            <input type="submit" value="logga in">
            <!-- <button onclick="login(event)">Logga in</button> -->
            <br /><span
              id="login-input-info"
            ></span>
          </form>
      </details>`;
        toggleButtons();
    }
}

// show/hide the edit/delete buttons
function toggleButtons(parentElement = null) {

    let editButtonsEl;

    // if parentElement exists, select the .buttons within the parentElement, else choose all the .buttons
    if (parentElement) editButtonsEl = parentElement.getElementsByClassName('buttons');
    else editButtonsEl = document.getElementsByClassName('buttons');

    // if user is logged in, show the buttons, else hide the buttons
    if (TOKEN != "" && TOKEN != null) {
        for (let i = 0; i < editButtonsEl.length; i++) {
            editButtonsEl[i].style.display = "flex";
        }
    } else {
        for (let i = 0; i < editButtonsEl.length; i++) {
            editButtonsEl[i].style.display = "none";
        }
    }
}

// get all the data from the API
async function fetchAllData() {

    // loop through the array of URLs
    allUrls.forEach(async (url) => {
        const response: Response = await fetch(baseURL + url);

        // if the status is OK...
        if (response.status >= 200 && response.status < 300) {
            switch (url) { //...call the right function to print the current data
                case 'courses': printCourses(await response.json()); break;
                case 'jobs': printJobs(await response.json()); break;
                case 'websites': printWebsites(await response.json()); break;
            }
        }
    })
    return;
}

// same as above, but only fetch one API
async function fetchData(type: string) {
    const response: Response = await fetch(baseURL + type);
    if (response.status >= 200 && response.status < 300) {
        switch (type) {
            case 'courses': printCourses(await response.json()); break;
            case 'jobs': printJobs(await response.json()); break;
            case 'websites': printWebsites(await response.json()); break;
        }
    }
}

// check if a job is current or has ended
function checkCurrent(date) {
    const current = new Date();
    const endDate = new Date(date);

    if (endDate.getTime() > current.getTime()) {
        return "nuvarande"
    } else
        return date;

}

// print all the data
// in this function all the courses will be printed
function printCourses(courses: Course[]) {
    coursesEl.innerHTML = "";
    if (courses.length) {
        courses.forEach(course => coursesEl.innerHTML += `<div class="api-item" data-id="${course.id}" data-type="courses" data-names='["namn","universitet","startdatum", "slutdatum"]' data-name="${course.name}" data-school="${course.school}" data-start-date="${course.startDate}" data-end-date="${course.endDate}"><div><b>${course.name}</b><br> ${course.school}<br>${course.startDate} - ${course.endDate}</div><div class="buttons"><button aria-label="redigera ${course.name}" onclick="editItem(event)"><i class="far fa-edit"></i></button><button aria-label="radera ${course.name}" onclick="destroy(event, 'courses')"><i class="far fa-trash-alt"></i></button></div></div>`);
        toggleButtons(coursesEl);
    } else // if no courses found, i.e. search returns 0, print that
        coursesEl.innerHTML += `<div class="api-item">Inga kurser hittades</div>`;
}

// same as above, but for jobs
function printJobs(jobs: Job[]) {
    jobsEl.innerHTML = "";
    if (jobs.length) {
        jobs.forEach(job => jobsEl.innerHTML += `<div class="api-item" data-id="${job.id}" data-type="jobs" data-names='["arbetsplats","arbetstitel","startdatum", "slutdatum"]' data-workplace="${job.workplace}"data-title="${job.title}" data-start-date="${job.startDate}" data-end-date="${job.endDate}"><div><b>${job.workplace}</b><br>${job.title}<br>${job.startDate} - ${checkCurrent(job.endDate)}</div><div class="buttons"><button aria-label="redigera ${job.title}" onclick="editItem(event)"><i class="far fa-edit"></i></button><button aria-label="radera ${job.title}" onclick="destroy(event, 'jobs')"><i class="far fa-trash-alt"></i></button></div></div>`);
        toggleButtons(jobsEl);
    } else
        jobsEl.innerHTML += `<div class="api-item">Inga jobb hittades</div>`;

}

// same as above, but for websites
function printWebsites(websites: Website[]) {
    websitesEl.innerHTML = "";
    if (websites.length) {
        websites.forEach(website => websitesEl.innerHTML += `<div class="api-item" data-id="${website.id}" data-type="websites" data-names='["titel","länk","beskrivning"]' data-title="${website.title}" data-url="${website.url}" data-description="${website.description}"><div><b><a href="${website.url}" target="_blank" rel="noreferrer">${website.title}</a></b><br>${website.description}</div><div class="buttons"><button aria-label="redigera ${website.title}" onclick="editItem(event)"><i class="far fa-edit"></i></button><button aria-label="radera ${website.title}" onclick="destroy(event, 'websites')"><i class="far fa-trash-alt"></i></button></div></div>`);
        toggleButtons(websitesEl);
    } else
        websitesEl.innerHTML += `<div class="api-item">Inga hemsidor hittades</div>`;

}

// when editing an item
function editItem(event) {

    // choose the closest .api-item from the event
    let item = event.target.closest('.api-item');

    // the data is stored in the elements dataset
    let data = item.dataset;

    // generate the form from the data
    generateForm(data)
}

async function destroy(e: any, type: string) {
    // has to be logged in to remove a course
    if (!TOKEN) {
        alert("Logga in för att ändra eller lägga till en kurs");
        return;
    }

    let target = e.target.closest('.api-item');
    let name = "objektet ";
    if (target.dataset.name) name += target.dataset.name;
    else if (target.dataset.title) name += target.dataset.title;
    if (confirm(`Vill du radera ${name}? Detta går inte att ångra.`)) {

        // if a user tries to be sneaky beaky and fakes a successful login, the token still has to validate at the endpoint
        let meta = {
            method: 'DELETE',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${TOKEN}`
            }
        }

        const response = await fetch(baseURL + type + "/" + target.dataset.id, meta)

        if (response.status >= 200 && response.status < 300) {
            // print the remaining objects from the specific type
            fetchData(type);
        }
    }
}

const overlayEl = document.getElementById("overlay-container");
const overlayFormEl = document.getElementById("overlay-form");

// generate a form depending on which form should be generated
function generateForm(data) {

    // display the dark, faded, background
    showOverlay();

    let form = `<h2>redigera</h2><form onsubmit="updateItem(event, ${data.id}, '${data.type}')">`;

    // get the names from the dataset
    let names = JSON.parse(data.names);
    let index = 0;
    if (data) {

        // iterate through the data
        for (let d in data) {
            // skip id, type and names from the dataset
            if (d != "id" && d != "type" && d != "names") {

                // checkType gets the correct data type
                form += `<label>${names[index]}<input type="${checkType(data[d])}" name="${d}" value="${data[d]}" required/></label>`
                index++;
            }
        }

        form += `<input type="submit" value="spara"></form><p id="edit-error" class="error"></p>`

        overlayFormEl.innerHTML = form;
        overlayEl.querySelector('input').focus();

    }
}

// do the actual update
async function updateItem(event, id: number, type: string) {
    event.preventDefault();

    // get the data from the form
    const formData: any = new FormData(event.target)
    const formDataEntries = Object.fromEntries(formData.entries());

    // PUT for update and the formData as JSON for the body
    const meta = {
        method: 'PUT',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            "Authorization": `Bearer ${TOKEN}`
        },
        body: JSON.stringify(formDataEntries)
    }

    const response = await fetch(baseURL + `${type}/${id}`, meta)

    if (response.status >= 200 && response.status < 300) {
        hideOverlay();
        fetchData(type);
    } else {
        const json = await response.json();
        if (json.error == "date") {
            document.getElementById('new-error').innerHTML = "Datum inkorrekt. Är slutdatum senare än startdatum?"

        } else {
            document.getElementById('new-error').innerHTML = "Något gick fel... testa logga ut och in om problemet kvarstår"
        }

    }
}


function showOverlay() {
    overlayEl.style.display = "flex";
}

function hideOverlay() {
    overlayEl.style.display = "none";
}

function checkType(data: string): string {

    // if the string parses as a date, it's probably a date.
    if (Date.parse(data)) {
        return "date"
    }

    // if it contains https or http, it's probably a URL
    if (data.includes("https") || data.includes("http")) {
        return "url";
    }

    // else, it's text
    return "text";
}

// print the correct form when adding a new object
function selectChange() {

    // selectEl is the dropdown-menu
    const type = selectEl.value;
    let newItemFormEl = document.getElementById('form-new-item');
    newItemFormEl.dataset.type = type;

    // switch to display the correct form
    switch (type) {
        case "courses":
            newItemFormEl.innerHTML = `
            <label>kursnamn
            <input type="text" name="name" placeholder="Webbutveckling III" required />
          </label>
    
          <label>skola/universitet
            <input type="text" name="school" placeholder="MIUN" required />
          </label>
    
          <label>startdatum
            <input type="date" name="startDate" required />
          </label>

          <label>slutdatum
            <input type="date" name="endDate" required />
          </label>
            `; break;
        case "jobs":
            newItemFormEl.innerHTML = `
            <label>arbetsplats
            <input type="text" name="workplace" placeholder="Webbutvecklarna AB" required />
          </label>
    
          <label>titel
            <input type="text" name="title" placeholder="Full stack" required />
          </label>
    
          <label>startdatum
            <input type="date" name="startDate" required />
          </label>  

          <label>slutdatum
            <input type="date" name="endDate" required />
          </label>`; break;
        case "websites":
            newItemFormEl.innerHTML = `
          <label>namn
          <input type="text" name="title" placeholder="Sida för hotell" required />
        </label>
  
        <label>länk
          <input type="url" placeholder="https://example.com" name="url" required />
        </label>
        <label>beskrivning
        <input type="text" placeholder="Hemsida skapad med Wordpress" name="description" required />
      </label></form>`; break;
    }

    newItemFormEl.innerHTML += `<input type='submit' value='lägg till'></form><p id="new-error" class="error"></p>`;

}

// print the inital new-item form
function newCourseForm() {

    overlayFormEl.innerHTML =
        `
        <h2>lägg till</h2>

        <select name="select-type" id="select-type" onchange="selectChange()" focus>
        <option value="courses">kurs</option>
        <option value="jobs">jobb</option>
        <option value="websites">hemsida</option>
        </select>
        <form id="form-new-item" data-type="courses" name="form-new-item" method="POST" onsubmit="addNewItem(event)">

        <label>kursnamn
            <input name="name" type="text" placeholder="Webbutveckling III" required />
        </label>
    
        <label>skola/universitet
            <input name="school" type="text" placeholder="MIUN" required />
        </label>
    
        <label>startdatum
            <input name="startDate" type="date" required />
        </label>

        <label>slutdatum
            <input name="endDate" type="date" required />
        </label>

        <input type='submit' value='lägg till'></form><p id="new-error" class="error"></p>`;

    showOverlay();
    overlayFormEl.querySelector('select').focus();
    selectEl = document.getElementById("select-type")
}

async function addNewItem(event) {
    event.preventDefault();

    const type = selectEl.value;
    let formData: any = new FormData(event.target)

    const plainFormData = Object.fromEntries(formData.entries());

    const meta = {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            "Authorization": `Bearer ${TOKEN}`
        },
        body: JSON.stringify(plainFormData)
    }

    const response = await fetch(baseURL + type, meta)

    if (response.status >= 200 && response.status < 300) {
        hideOverlay();
        fetchData(type);
    } else {
        const json = await response.json();
        const errorEl = document.getElementById('new-error');
        if (json.error == "date") {
            errorEl.innerHTML = "Datum inkorrekt. Är slutdatum senare än startdatum?"

        } else {
            errorEl.innerHTML = "Något gick fel... testa logga ut och in om problemet kvarstår"
        }
    }
}

// convert some chars to HTMLchars
function escapeHtml(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };

    return text.replace(/[&<>"']/g, function (m) { return map[m]; });
}


async function search(event: any) {
    event.preventDefault();

    // get the searchterm
    let jagHatarTypeScript: any = document.getElementById("search-value");
    let searchTerm = jagHatarTypeScript.value;

    if (searchTerm.length == 0) {
        document.getElementById('search-term').innerHTML = ``;
        fetchAllData();
        return;
    }

    // print the searchterm
    document.getElementById('search-term').innerHTML = `<b>Sökresultat för: </b>${escapeHtml(searchTerm)}`;

    const meta = {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
    }

    // show the loading animation
    const loading = `<img class="loading" src="assets/loading.svg" alt="" />`
    coursesEl.innerHTML = loading;
    jobsEl.innerHTML = loading;
    websitesEl.innerHTML = loading;

    const response = await fetch(baseURL + `search/${searchTerm}`, meta)
        .then((response) => response.json())
        .then(data => { return data; })
        .catch(error => {
            console.error(error);
        });

    // if there isn't an exception, the query has been successful (even if the search result is 0)
    if (!response.exception) {
        for (const property in response) {
            switch (property) {
                case "courses": printCourses(response[property]); break;
                case "jobs": printJobs(response[property]); break;
                case "websites": printWebsites(response[property]); break;
            }
        }
    }
    else {
        fetchAllData();
        document.getElementById('search-term').innerHTML = `<b>Något gick fel... försök igen! Troligtvis användes ogiltiga tecken</b>`;
    }
}
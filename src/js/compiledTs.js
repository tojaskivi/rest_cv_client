var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var baseURL = "https://ojaskivi.se/cv/public/api/";
var allUrls = ['courses', 'jobs', 'websites'];
window.onload = function () {
    fetchAllData();
    toggleLogin();
};
var TOKEN = localStorage.getItem('api-token');
var searchFormEl = document.getElementById("search-form");
searchFormEl.addEventListener('submit', search);
var outputEl = document.getElementById("api-output");
var coursesEl = document.getElementById("api-courses");
var jobsEl = document.getElementById("api-jobs");
var websitesEl = document.getElementById("api-websites");
var loginEl = document.getElementById('login');
var selectEl;
var loginCreditsEl;
function login(e) {
    return __awaiter(this, void 0, void 0, function () {
        var stringToken, object, meta, response;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    e.preventDefault();
                    loginCreditsEl = document.getElementById('login-credits');
                    stringToken = loginCreditsEl.value;
                    object = {
                        token: stringToken
                    };
                    meta = {
                        method: 'POST',
                        headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(object)
                    };
                    return [4, fetch(baseURL + "login", meta)
                            .then(function (response) { return response.json(); })
                            .then(function (data) { return data; })["catch"](function (error) {
                            console.error(error);
                        })];
                case 1:
                    response = _a.sent();
                    if (response.token) {
                        localStorage.setItem('api-token', response.token);
                        TOKEN = response.token;
                        toggleLogin();
                    }
                    else {
                        document.getElementById('login-input-info').innerHTML = "Felaktig inloggning";
                    }
                    return [2];
            }
        });
    });
}
function logout() {
    return __awaiter(this, void 0, void 0, function () {
        var meta;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    meta = {
                        method: 'POST',
                        headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'application/json',
                            'Authorization': "Bearer " + TOKEN
                        }
                    };
                    return [4, fetch(baseURL + "logout", meta)["catch"](function (error) {
                            console.error(error);
                        })];
                case 1:
                    _a.sent();
                    TOKEN = null;
                    localStorage.removeItem('api-token');
                    toggleLogin();
                    return [2];
            }
        });
    });
}
function toggleLogin() {
    if (TOKEN != "" && TOKEN != null) {
        loginEl.innerHTML = "\n        <button onclick=\"newCourseForm()\"> L\u00E4gg till objekt </button>\n            <button onclick=\"logout()\">Logga ut</button>\n        ";
        toggleButtons();
    }
    else {
        loginEl.innerHTML = "\n        <details>\n        <summary>Logga in</summary>\n        <form id=\"login-form\" name=\"login-form\" onsubmit=\"login(event)\">\n            <input\n              id=\"login-credits\"\n              type=\"password\"\n              name=\"credits\"\n              placeholder=\"Inloggningsuppgifter\"\n              required\n            />\n            <input type=\"submit\" value=\"logga in\">\n            <!-- <button onclick=\"login(event)\">Logga in</button> -->\n            <br /><span\n              id=\"login-input-info\"\n            ></span>\n          </form>\n      </details>";
        toggleButtons();
    }
}
function toggleButtons(parentElement) {
    if (parentElement === void 0) { parentElement = null; }
    var editButtonsEl;
    if (parentElement)
        editButtonsEl = parentElement.getElementsByClassName('buttons');
    else
        editButtonsEl = document.getElementsByClassName('buttons');
    if (TOKEN != "" && TOKEN != null) {
        for (var i = 0; i < editButtonsEl.length; i++) {
            editButtonsEl[i].style.display = "flex";
        }
    }
    else {
        for (var i = 0; i < editButtonsEl.length; i++) {
            editButtonsEl[i].style.display = "none";
        }
    }
}
function fetchAllData() {
    return __awaiter(this, void 0, void 0, function () {
        var _this = this;
        return __generator(this, function (_a) {
            allUrls.forEach(function (url) { return __awaiter(_this, void 0, void 0, function () {
                var response, _a, _b, _c, _d;
                return __generator(this, function (_e) {
                    switch (_e.label) {
                        case 0: return [4, fetch(baseURL + url)];
                        case 1:
                            response = _e.sent();
                            if (!(response.status >= 200 && response.status < 300)) return [3, 8];
                            _a = url;
                            switch (_a) {
                                case 'courses': return [3, 2];
                                case 'jobs': return [3, 4];
                                case 'websites': return [3, 6];
                            }
                            return [3, 8];
                        case 2:
                            _b = printCourses;
                            return [4, response.json()];
                        case 3:
                            _b.apply(void 0, [_e.sent()]);
                            return [3, 8];
                        case 4:
                            _c = printJobs;
                            return [4, response.json()];
                        case 5:
                            _c.apply(void 0, [_e.sent()]);
                            return [3, 8];
                        case 6:
                            _d = printWebsites;
                            return [4, response.json()];
                        case 7:
                            _d.apply(void 0, [_e.sent()]);
                            return [3, 8];
                        case 8: return [2];
                    }
                });
            }); });
            return [2];
        });
    });
}
function fetchData(type) {
    return __awaiter(this, void 0, void 0, function () {
        var response, _a, _b, _c, _d;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0: return [4, fetch(baseURL + type)];
                case 1:
                    response = _e.sent();
                    if (!(response.status >= 200 && response.status < 300)) return [3, 8];
                    _a = type;
                    switch (_a) {
                        case 'courses': return [3, 2];
                        case 'jobs': return [3, 4];
                        case 'websites': return [3, 6];
                    }
                    return [3, 8];
                case 2:
                    _b = printCourses;
                    return [4, response.json()];
                case 3:
                    _b.apply(void 0, [_e.sent()]);
                    return [3, 8];
                case 4:
                    _c = printJobs;
                    return [4, response.json()];
                case 5:
                    _c.apply(void 0, [_e.sent()]);
                    return [3, 8];
                case 6:
                    _d = printWebsites;
                    return [4, response.json()];
                case 7:
                    _d.apply(void 0, [_e.sent()]);
                    return [3, 8];
                case 8: return [2];
            }
        });
    });
}
function checkCurrent(date) {
    var current = new Date();
    var endDate = new Date(date);
    if (endDate.getTime() > current.getTime()) {
        return "nuvarande";
    }
    else
        return date;
}
function printCourses(courses) {
    coursesEl.innerHTML = "";
    if (courses.length) {
        courses.forEach(function (course) { return coursesEl.innerHTML += "<div class=\"api-item\" data-id=\"" + course.id + "\" data-type=\"courses\" data-names='[\"namn\",\"universitet\",\"startdatum\", \"slutdatum\"]' data-name=\"" + course.name + "\" data-school=\"" + course.school + "\" data-start-date=\"" + course.startDate + "\" data-end-date=\"" + course.endDate + "\"><div><b>" + course.name + "</b><br> " + course.school + "<br>" + course.startDate + " - " + course.endDate + "</div><div class=\"buttons\"><button aria-label=\"redigera " + course.name + "\" onclick=\"editItem(event)\"><i class=\"far fa-edit\"></i></button><button aria-label=\"radera " + course.name + "\" onclick=\"destroy(event, 'courses')\"><i class=\"far fa-trash-alt\"></i></button></div></div>"; });
        toggleButtons(coursesEl);
    }
    else
        coursesEl.innerHTML += "<div class=\"api-item\">Inga kurser hittades</div>";
}
function printJobs(jobs) {
    jobsEl.innerHTML = "";
    if (jobs.length) {
        jobs.forEach(function (job) { return jobsEl.innerHTML += "<div class=\"api-item\" data-id=\"" + job.id + "\" data-type=\"jobs\" data-names='[\"arbetsplats\",\"arbetstitel\",\"startdatum\", \"slutdatum\"]' data-workplace=\"" + job.workplace + "\"data-title=\"" + job.title + "\" data-start-date=\"" + job.startDate + "\" data-end-date=\"" + job.endDate + "\"><div><b>" + job.workplace + "</b><br>" + job.title + "<br>" + job.startDate + " - " + checkCurrent(job.endDate) + "</div><div class=\"buttons\"><button aria-label=\"redigera " + job.title + "\" onclick=\"editItem(event)\"><i class=\"far fa-edit\"></i></button><button aria-label=\"radera " + job.title + "\" onclick=\"destroy(event, 'jobs')\"><i class=\"far fa-trash-alt\"></i></button></div></div>"; });
        toggleButtons(jobsEl);
    }
    else
        jobsEl.innerHTML += "<div class=\"api-item\">Inga jobb hittades</div>";
}
function printWebsites(websites) {
    websitesEl.innerHTML = "";
    if (websites.length) {
        websites.forEach(function (website) { return websitesEl.innerHTML += "<div class=\"api-item\" data-id=\"" + website.id + "\" data-type=\"websites\" data-names='[\"titel\",\"l\u00E4nk\",\"beskrivning\"]' data-title=\"" + website.title + "\" data-url=\"" + website.url + "\" data-description=\"" + website.description + "\"><div><b><a href=\"" + website.url + "\" target=\"_blank\" rel=\"noreferrer\">" + website.title + "</a></b><br>" + website.description + "</div><div class=\"buttons\"><button aria-label=\"redigera " + website.title + "\" onclick=\"editItem(event)\"><i class=\"far fa-edit\"></i></button><button aria-label=\"radera " + website.title + "\" onclick=\"destroy(event, 'websites')\"><i class=\"far fa-trash-alt\"></i></button></div></div>"; });
        toggleButtons(websitesEl);
    }
    else
        websitesEl.innerHTML += "<div class=\"api-item\">Inga hemsidor hittades</div>";
}
function editItem(event) {
    var item = event.target.closest('.api-item');
    var data = item.dataset;
    generateForm(data);
}
function destroy(e, type) {
    return __awaiter(this, void 0, void 0, function () {
        var target, name, meta, response;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!TOKEN) {
                        alert("Logga in för att ändra eller lägga till en kurs");
                        return [2];
                    }
                    target = e.target.closest('.api-item');
                    name = "objektet ";
                    if (target.dataset.name)
                        name += target.dataset.name;
                    else if (target.dataset.title)
                        name += target.dataset.title;
                    if (!confirm("Vill du radera " + name + "? Detta g\u00E5r inte att \u00E5ngra.")) return [3, 2];
                    meta = {
                        method: 'DELETE',
                        headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'application/json',
                            'Authorization': "Bearer " + TOKEN
                        }
                    };
                    return [4, fetch(baseURL + type + "/" + target.dataset.id, meta)];
                case 1:
                    response = _a.sent();
                    if (response.status >= 200 && response.status < 300) {
                        fetchData(type);
                    }
                    _a.label = 2;
                case 2: return [2];
            }
        });
    });
}
var overlayEl = document.getElementById("overlay-container");
var overlayFormEl = document.getElementById("overlay-form");
function generateForm(data) {
    showOverlay();
    var form = "<h2>redigera</h2><form onsubmit=\"updateItem(event, " + data.id + ", '" + data.type + "')\">";
    var names = JSON.parse(data.names);
    var index = 0;
    if (data) {
        for (var d in data) {
            if (d != "id" && d != "type" && d != "names") {
                form += "<label>" + names[index] + "<input type=\"" + checkType(data[d]) + "\" name=\"" + d + "\" value=\"" + data[d] + "\" required/></label>";
                index++;
            }
        }
        form += "<input type=\"submit\" value=\"spara\"></form><p id=\"edit-error\" class=\"error\"></p>";
        overlayFormEl.innerHTML = form;
        overlayEl.querySelector('input').focus();
    }
}
function updateItem(event, id, type) {
    return __awaiter(this, void 0, void 0, function () {
        var formData, formDataEntries, meta, response, json;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    event.preventDefault();
                    formData = new FormData(event.target);
                    formDataEntries = Object.fromEntries(formData.entries());
                    meta = {
                        method: 'PUT',
                        headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'application/json',
                            "Authorization": "Bearer " + TOKEN
                        },
                        body: JSON.stringify(formDataEntries)
                    };
                    return [4, fetch(baseURL + (type + "/" + id), meta)];
                case 1:
                    response = _a.sent();
                    if (!(response.status >= 200 && response.status < 300)) return [3, 2];
                    hideOverlay();
                    fetchData(type);
                    return [3, 4];
                case 2: return [4, response.json()];
                case 3:
                    json = _a.sent();
                    if (json.error == "date") {
                        document.getElementById('new-error').innerHTML = "Datum inkorrekt. Är slutdatum senare än startdatum?";
                    }
                    else {
                        document.getElementById('new-error').innerHTML = "Något gick fel... testa logga ut och in om problemet kvarstår";
                    }
                    _a.label = 4;
                case 4: return [2];
            }
        });
    });
}
function showOverlay() {
    overlayEl.style.display = "flex";
}
function hideOverlay() {
    overlayEl.style.display = "none";
}
function checkType(data) {
    if (Date.parse(data)) {
        return "date";
    }
    if (data.includes("https") || data.includes("http")) {
        return "url";
    }
    return "text";
}
function selectChange() {
    var type = selectEl.value;
    var newItemFormEl = document.getElementById('form-new-item');
    newItemFormEl.dataset.type = type;
    switch (type) {
        case "courses":
            newItemFormEl.innerHTML = "\n            <label>kursnamn\n            <input type=\"text\" name=\"name\" placeholder=\"Webbutveckling III\" required />\n          </label>\n    \n          <label>skola/universitet\n            <input type=\"text\" name=\"school\" placeholder=\"MIUN\" required />\n          </label>\n    \n          <label>startdatum\n            <input type=\"date\" name=\"startDate\" required />\n          </label>\n\n          <label>slutdatum\n            <input type=\"date\" name=\"endDate\" required />\n          </label>\n            ";
            break;
        case "jobs":
            newItemFormEl.innerHTML = "\n            <label>arbetsplats\n            <input type=\"text\" name=\"workplace\" placeholder=\"Webbutvecklarna AB\" required />\n          </label>\n    \n          <label>titel\n            <input type=\"text\" name=\"title\" placeholder=\"Full stack\" required />\n          </label>\n    \n          <label>startdatum\n            <input type=\"date\" name=\"startDate\" required />\n          </label>  \n\n          <label>slutdatum\n            <input type=\"date\" name=\"endDate\" required />\n          </label>";
            break;
        case "websites":
            newItemFormEl.innerHTML = "\n          <label>namn\n          <input type=\"text\" name=\"title\" placeholder=\"Sida f\u00F6r hotell\" required />\n        </label>\n  \n        <label>l\u00E4nk\n          <input type=\"url\" placeholder=\"https://example.com\" name=\"url\" required />\n        </label>\n        <label>beskrivning\n        <input type=\"text\" placeholder=\"Hemsida skapad med Wordpress\" name=\"description\" required />\n      </label></form>";
            break;
    }
    newItemFormEl.innerHTML += "<input type='submit' value='l\u00E4gg till'></form><p id=\"new-error\" class=\"error\"></p>";
}
function newCourseForm() {
    overlayFormEl.innerHTML =
        "\n        <h2>l\u00E4gg till</h2>\n\n        <select name=\"select-type\" id=\"select-type\" onchange=\"selectChange()\" focus>\n        <option value=\"courses\">kurs</option>\n        <option value=\"jobs\">jobb</option>\n        <option value=\"websites\">hemsida</option>\n        </select>\n        <form id=\"form-new-item\" data-type=\"courses\" name=\"form-new-item\" method=\"POST\" onsubmit=\"addNewItem(event)\">\n\n        <label>kursnamn\n            <input name=\"name\" type=\"text\" placeholder=\"Webbutveckling III\" required />\n        </label>\n    \n        <label>skola/universitet\n            <input name=\"school\" type=\"text\" placeholder=\"MIUN\" required />\n        </label>\n    \n        <label>startdatum\n            <input name=\"startDate\" type=\"date\" required />\n        </label>\n\n        <label>slutdatum\n            <input name=\"endDate\" type=\"date\" required />\n        </label>\n\n        <input type='submit' value='l\u00E4gg till'></form><p id=\"new-error\" class=\"error\"></p>";
    showOverlay();
    overlayFormEl.querySelector('select').focus();
    selectEl = document.getElementById("select-type");
}
function addNewItem(event) {
    return __awaiter(this, void 0, void 0, function () {
        var type, formData, plainFormData, meta, response, json, errorEl;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    event.preventDefault();
                    type = selectEl.value;
                    formData = new FormData(event.target);
                    plainFormData = Object.fromEntries(formData.entries());
                    meta = {
                        method: 'POST',
                        headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'application/json',
                            "Authorization": "Bearer " + TOKEN
                        },
                        body: JSON.stringify(plainFormData)
                    };
                    return [4, fetch(baseURL + type, meta)];
                case 1:
                    response = _a.sent();
                    if (!(response.status >= 200 && response.status < 300)) return [3, 2];
                    hideOverlay();
                    fetchData(type);
                    return [3, 4];
                case 2: return [4, response.json()];
                case 3:
                    json = _a.sent();
                    errorEl = document.getElementById('new-error');
                    if (json.error == "date") {
                        errorEl.innerHTML = "Datum inkorrekt. Är slutdatum senare än startdatum?";
                    }
                    else {
                        errorEl.innerHTML = "Något gick fel... testa logga ut och in om problemet kvarstår";
                    }
                    _a.label = 4;
                case 4: return [2];
            }
        });
    });
}
function escapeHtml(text) {
    var map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, function (m) { return map[m]; });
}
function search(event) {
    return __awaiter(this, void 0, void 0, function () {
        var jagHatarTypeScript, searchTerm, meta, loading, response, property;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    event.preventDefault();
                    jagHatarTypeScript = document.getElementById("search-value");
                    searchTerm = jagHatarTypeScript.value;
                    if (searchTerm.length == 0) {
                        document.getElementById('search-term').innerHTML = "";
                        fetchAllData();
                        return [2];
                    }
                    document.getElementById('search-term').innerHTML = "<b>S\u00F6kresultat f\u00F6r: </b>" + escapeHtml(searchTerm);
                    meta = {
                        method: 'GET',
                        headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'application/json'
                        }
                    };
                    loading = "<img class=\"loading\" src=\"assets/loading.svg\" alt=\"\" />";
                    coursesEl.innerHTML = loading;
                    jobsEl.innerHTML = loading;
                    websitesEl.innerHTML = loading;
                    return [4, fetch(baseURL + ("search/" + searchTerm), meta)
                            .then(function (response) { return response.json(); })
                            .then(function (data) { return data; })["catch"](function (error) {
                            console.error(error);
                        })];
                case 1:
                    response = _a.sent();
                    if (!response.exception) {
                        for (property in response) {
                            switch (property) {
                                case "courses":
                                    printCourses(response[property]);
                                    break;
                                case "jobs":
                                    printJobs(response[property]);
                                    break;
                                case "websites":
                                    printWebsites(response[property]);
                                    break;
                            }
                        }
                    }
                    else {
                        fetchAllData();
                        document.getElementById('search-term').innerHTML = "<b>N\u00E5got gick fel... f\u00F6rs\u00F6k igen! Troligtvis anv\u00E4ndes ogiltiga tecken</b>";
                    }
                    return [2];
            }
        });
    });
}

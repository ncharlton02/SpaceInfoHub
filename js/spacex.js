const upcomingLaunchTable = document.getElementById("upcoming-launch-table");
const pastLaunchTable = document.getElementById("past-launch-table");

const nextLaunchNumberText = document.getElementById("next-launch-number");
const nextLaunchNameText = document.getElementById("next-launch-name");
const nextLaunchDateText = document.getElementById("next-launch-date");
const nextLaunchCountdownText = document.getElementById("next-launch-countdown");
const nextLaunchDetailsText = document.getElementById("next-launch-details");
var nextLaunchDate;

httpGetAsync("https://api.spacexdata.com/v3/launches/next", parseNextLaunch);
httpGetAsync("https://api.spacexdata.com/v3/launches/upcoming",
    function (json) {
        insertLaunchDataIntoTable(json, upcomingLaunchTable);
    }
);

httpGetAsync("https://api.spacexdata.com/v3/launches/past",
    function (json) {
        insertLaunchDataIntoTable(json, pastLaunchTable);
    }
);

function insertLaunchDataIntoTable(json, table) {
    let html = [];

    JSON.parse(json).forEach(launch => {
        let link = generateLink(launch.flight_number);

        html.push("<tr>");
        html.push("<td><b>" + launch.flight_number + "<b></td>");
        html.push("<td><b>" + launch.mission_name + "<b></td>");
        html.push("<td>" + parseMissionDate(launch.launch_date_utc) + "</td>");
        html.push("<td><a href=\"" + link + "\" style=\"color:#6a6aFa\">Details</a></td>");
        html.push("</tr>");
    });

    table.innerHTML = html.join("");
}

function parseNextLaunch(json) {
    json = JSON.parse(json);
    nextLaunchDate = new Date(json.launch_date_utc);

    nextLaunchNumberText.innerHTML = json.flight_number;
    nextLaunchNameText.innerHTML = json.mission_name;
    nextLaunchDateText.innerHTML = nextLaunchDate.toDateString();

    let link = generateLink(json.flight_number);
    let aTag = "<a href=\"" + link + "\" style=\"color:#6a6aFa\"> More Details</a>";
    nextLaunchDetailsText.innerHTML = json.details + aTag;

    updateCountdown();
    setInterval(updateCountdown, 500);
}

function updateCountdown() {
    let duration = nextLaunchDate.getTime() - new Date().getTime();

    if (duration < 0)
        return;

    var seconds = Math.floor(duration / 1000);
    var minutes = Math.floor(seconds / 60);
    var hours = Math.floor(minutes / 60);
    var days = Math.floor(hours / 24);

    hours %= 24;
    minutes %= 60;
    seconds %= 60;

    let format = days + " days, " + hours + " hours, " + minutes + " minutes, " + seconds + " seconds"
    nextLaunchCountdownText.innerHTML = format;
}

function parseMissionDate(date_utc_str) {
    let date = new Date(date_utc_str);

    return date.toDateString();
}

function generateLink(flight_number) {
    return "spacex-launch.html?flight_number=" + flight_number;
}
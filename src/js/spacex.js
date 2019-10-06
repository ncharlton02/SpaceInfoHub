const upcomingLaunchTable = document.getElementById("upcoming-launch-table");
const pastLaunchTable = document.getElementById("past-launch-table");

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
        html.push("<tr>");
        html.push("<td><b>" + launch.flight_number + "<b></td>");
        html.push("<td><b>" + launch.mission_name + "<b></td>");
        html.push("<td>" + parseMissionDate(launch.launch_date_utc) + "</td>");
        html.push("<td><a href=\"#\" style=\"color:#6a6aFa\">Details</a></td>");
        html.push("</tr>");
    });

    table.innerHTML = html.join("");
}

function parseMissionDate(date_utc_str){
    let date = new Date(date_utc_str);

    return date.toDateString();
}

function httpGetAsync(theUrl, callback) {
    var xmlHttp = new XMLHttpRequest();

    xmlHttp.onreadystatechange = function () {
        if (xmlHttp.readyState == 4) {
            if (xmlHttp.status == 200)
                callback(xmlHttp.responseText);
            else
                console.log("Request to \"" + theUrl + "\" returned error " + xmlHttp.status)
        }

    }
    xmlHttp.open("GET", theUrl, true);

    xmlHttp.send(null);
}

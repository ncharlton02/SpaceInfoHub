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

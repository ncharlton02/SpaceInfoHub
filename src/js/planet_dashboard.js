let planets = {};

let info = [
    {
        "id": "mercury",
        "title": "Mercury",
        "desc": "the sun is very bright here"
    }
    , {
        "id": "venus",
        "title": "Venus",
        "desc": "Acid Rain! :("
    },
    {
        "id": "earth",
        "title": "Earth",
        "desc": "It has oxygen"
    },
    {
        "id": "mars",
        "title": "Mars",
        "desc": "No aliens here!"
    },
    {
        "id": "jupiter",
        "title": "Jupiter",
        "desc": "what is that big red dot for?"
    },
    {
        "id": "saturn",
        "title": "Saturn",
        "desc": "I have ringzzzz"
    },
    {
        "id": "uranus",
        "title": "Uranus",
        "desc": "obligatory Uranus joke"
    },
    {
        "id" : "neptune",
        "title":"Neptune",
        "desc":"I am blue!"
    }
].forEach(function (planet) {
    planets[planet.id] = planet;
});

const planetTitleText = document.getElementById("planet-title");
const planetDescText = document.getElementById("planet-desc");
var selectedPlanet;

function selectPlanet(planet) {
    if (!planet)
        return;

    selectedPlanet = planet;
    planetTitleText.innerHTML = planet.title;
    planetDescText.innerHTML = planet.desc;
}

selectPlanet(planets.earth);
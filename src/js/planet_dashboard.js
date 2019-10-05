let planets = {};

let info = [
    {
        "id": "mercury",
        "title": "Mercury",
        "desc": "the sun is very bright here",
        "color": [0.725, 0.431, 0.054, 1.0],
    }
    , {
        "id": "venus",
        "title": "Venus",
        "desc": "Acid Rain! :(",
        "color": [0.976, 0.776, 0.525, 1.0],
    },
    {
        "id": "earth",
        "title": "Earth",
        "desc": "It has oxygen",
        "color": [0.094, 0.482, 0.105, 1.0],
    },
    {
        "id": "mars",
        "title": "Mars",
        "desc": "No aliens here!",
        "color": [0.913, 0.160, 0.047, 1.0],
    },
    {
        "id": "jupiter",
        "title": "Jupiter",
        "desc": "what is that big red dot for?",
        "color": [0.850, 0.823, 0.705, 1.0],
    },
    {
        "id": "saturn",
        "title": "Saturn",
        "desc": "I have ringzzzz",
        "color": [0.756, 0.407, 0.145, 1.0],
    },
    {
        "id": "uranus",
        "title": "Uranus",
        "desc": "obligatory Uranus joke",
        "color": [0.145, 0.505, 0.756, 1.0],
    },
    {
        "id" : "neptune",
        "title":"Neptune",
        "desc":"I am blue!",
        "color": [0.105, 0.172, 0.552, 1.0],
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
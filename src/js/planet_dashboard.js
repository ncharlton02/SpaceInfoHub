let planets = {};

let info = [
    {
        "id": "sun",
        "title": "The Sun",
        "desc": "The Star of Our Solar System",
        "texture": "images/2k_sun.jpg",
        "color": [.9, .4, .4, 1.0],
        "facts": []
    },
    {
        "id": "mercury",
        "title": "Mercury",
        "desc": "The 1st Planet",
        "texture": "images/2k_mercury.jpg",
        "color": [0.725, 0.431, 0.054, 1.0],
        "facts": [
            ["Radius", "1516 mi (2,440 km)"],
            ["Surface Gravity", "3.7 m/s <sup>2</sup>"],
        ]
    }
    , {
        "id": "venus",
        "title": "Venus",
        "desc": "The 2nd Planet",
        "texture": "images/2k_venus_surface.jpg",
        "color": [0.976, 0.776, 0.525, 1.0],
        "facts": [
            ["Radius", "3759 mi (6,051 km)"],
            ["Surface Gravity", "8.87 m/s <sup>2</sup>"],
        ]
    },
    {
        "id": "venus_atmosphere",
        "title": "Venus (Atmosphere Texture)",
        "desc": "The 2nd Planet",
        "texture": "images/2k_venus_atmosphere.jpg",
        "color": [0.976, 0.776, 0.525, 1.0],
        "facts": [
            ["Radius", "3759 mi (6,051 km)"],
            ["Surface Gravity", "8.87 m/s <sup>2</sup>"],
        ]
    },
    {
        "id": "earth",
        "title": "Earth",
        "desc": "The 3rd Planet",
        "texture": "images/2k_earth_daymap.jpg",
        "color": [0.094, 0.482, 0.105, 1.0],
        "facts": [
            ["Radius", "3,958 mi (6,371 km)"],
            ["Surface Gravity", "9.807 m/s <sup>2</sup>"],
        ]
    },
    {
        "id": "earth_night",
        "title": "Earth (Night)",
        "desc": "The 3rd Planet",
        "texture": "images/2k_earth_nightmap.jpg",
        "color": [0.094, 0.482, 0.105, 1.0],
        "facts": [
            ["Radius", "3,958 mi (6,371 km)"],
            ["Surface Gravity", "9.807 m/s <sup>2</sup>"],
        ]
    },
    {
        "id": "mars",
        "title": "Mars",
        "desc": "The 4th Planet",
        "texture": "images/2k_mars.jpg",
        "color": [0.913, 0.160, 0.047, 1.0],
        "facts": [
            ["Radius", "2106 mi (3,389 km)"],
            ["Surface Gravity", "3.72 m/s <sup>2</sup>"],
        ]
    },
    {
        "id": "jupiter",
        "title": "Jupiter",
        "desc": "The 5th Planet",
        "texture": "images/2k_jupiter.jpg",
        "color": [0.850, 0.823, 0.705, 1.0],
        "facts": [
            ["Radius", "43,411 mi (69,911 km)"],
            ["Surface Gravity", "24.79 m/s <sup>2</sup>"],
        ]
    },
    {
        "id": "saturn",
        "title": "Saturn",
        "desc": "The 6th Planet",
        "texture": "images/2k_saturn.jpg",
        "color": [0.756, 0.407, 0.145, 1.0],
        "facts": [
            ["Radius", "36,184 mi (58,232 km)"],
            ["Surface Gravity", "10.44 m/s <sup>2</sup>"],
        ]
    },
    {
        "id": "uranus",
        "title": "Uranus",
        "desc": "The 7th Planet",
        "texture": "images/2k_uranus.jpg",
        "color": [0.145, 0.505, 0.756, 1.0],
        "facts": [
            ["Radius", "15759 mi (25,362 km)"],
            ["Surface Gravity", "8.69 m/s <sup>2</sup>"],
        ]
    },
    {
        "id": "neptune",
        "title": "Neptune",
        "desc": "The 8th Planet",
        "texture": "images/2k_neptune.jpg",
        "color": [0.105, 0.172, 0.552, 1.0],
        "facts": [
            ["Radius", "15,299 mi (24,622 km)"],
            ["Surface Gravity", "24.79 m/s <sup>2</sup>"],
        ]
    },
    {
        "id": "moon",
        "title": "The Moon",
        "desc": "Earth's Moon",
        "texture": "images/2k_moon.jpg",
        "color": [0.105, 0.172, 0.552, 1.0],
        "facts": [
            ["Radius", "1,080 mi (1,738.1 km)"],
            ["Surface Gravity", "1.62 m/s <sup>2</sup>"],
        ]
    }
].forEach(function (planet) {
    planets[planet.id] = planet;
});

const planetTitleText = document.getElementById("planet-title");
const planetDescText = document.getElementById("planet-desc");
const planetFactsBox = document.getElementById("planet-facts-box");
var selectedPlanet;
var updateTexture = false;

function selectPlanet(planet) {
    if (!planet)
        return;

    selectedPlanet = planet;
    planetTitleText.innerHTML = planet.title;
    planetDescText.innerHTML = planet.desc;

    updatePlanetFacts(planet.facts);

    updateTexture = true;
}

function updatePlanetFacts(facts) {
    var html = [];

    facts.forEach(function (fact) {
        if (fact.length == 2) {
            html.push("<p><b>" + fact[0] + "</b>: " + fact[1] + "</p>");
        }
    });

    planetFactsBox.innerHTML = html.join("");
}

selectPlanet(planets.earth);
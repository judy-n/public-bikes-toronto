"use strict";

const BIKE_API = "http://api.citybik.es";
const TORONTO_SLUG = "v2/networks/bixi-toronto";
const [lat, lon] = [43.6629, -79.3957];

const el = (tag, classes = [], props = {}, ...children) => {
  const element = document.createElement(tag);
  element.classList.add(...classes);
  Object.entries(props).forEach(([key, val]) => element.setAttribute(key, val));
  children.forEach((child) => element.appendChild(child));
  return element;
};

const nearCampus = (targetLat, targetLon) => {
  const diffLat = Math.abs(targetLat - lat);
  const diffLon = Math.abs(targetLon - lon);
  return Math.abs(targetLat - lat) < 0.006 && Math.abs(targetLon - lon) < 0.006;
};

const displayStation = (station) => {
  const empty = station.free_bikes;
  const total = station.extra.slots;
  const name = station.name;
  const at = station.timestamp;

  const stationEl = el(
    "div",
    ["station"],
    {},
      el("div", ["pt1"], {}, el("img", [], {src: 'assets/location.svg', alt: ''}),
      el("p", [], {}, document.createTextNode(name))),
          el("div", ["availability"], {}, el("p", ["free"], {},
              document.createTextNode(empty)),
              el("p", [], {}, document.createTextNode(`/ ${total}`)))

  );
  document.querySelector(".date").innerHTML = `As of ${new Date(at).toLocaleTimeString()}`
  document.querySelector("#stations").appendChild(stationEl);
};

fetch(`${BIKE_API}/${TORONTO_SLUG}`)
  .then((response) => response.json())
  .then((result) => {
    const nearbyStations = result.network.stations
      .filter((station) => nearCampus(station.latitude, station.longitude))
      .map(displayStation);
  })
  .catch(() => console.error("Unexpected Error Occurred"));

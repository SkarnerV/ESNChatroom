import L from "leaflet";
import jwt from "jsonwebtoken";
import { banner } from "../../templates/map/banner";
import { spotInfo } from "../../templates/map/spot-info";
import { currentLocationIcon } from "../../constant/svg-icon";
import { getAllSpot, addSpot, updateSpot, deleteSpot } from "../../api/map";
import * as marker from './marker.ts';

class MapPage extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.innerHTML = `<div style="height: 100dvh">
      ${banner}
      <div id="map" class="w-screen grow z-0" style="height: 90dvh"></div>
      ${spotInfo}
    </div>`;
  }
}

customElements.define("map-page", MapPage);

// map setup

let zoom = 17; // 0 - 18
let center = [37.4100355,-122.0597742];
let map = L.map('map').setView(center, zoom);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  zoomControl: true ,
}).addTo(map);

// get user location

const successGPS = (position) => {
  const lat = position.coords.latitude;
  const lng = position.coords.longitude;
  center = [lat, lng];
  map.setView(center, zoom);
  localStorage.setItem('center', JSON.stringify(center))
};
const errorGPS = () => {
  window.alert('Cannot get your location. Default location is set to CMU-SV.');
}

if (localStorage.getItem('center') && localStorage.getItem('center') !== null) {
  center = JSON.parse(localStorage.getItem('center')!);
  map.setView(center, zoom);
} else if(navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(successGPS, errorGPS);
} else {
  window.alert('Your device does not support GPS. Default location is set to CMU-SV.');
}

// add marker

// self location marker

const selfIcon = L.divIcon({
  className: 'self-icon',
  html: currentLocationIcon,
  iconSize: [32, 34],
  iconAnchor: [16, 34],
});

let selfMark = L.marker(center,{
  icon: selfIcon,
  draggable: false,
}).addTo(map);

// reset self location marker when navigator geolocation is changed

navigator.geolocation.watchPosition((position) => {
  const lat = position.coords.latitude;
  const lng = position.coords.longitude;
  selfMark.remove();
  selfMark = L.marker([lat, lng],{
    icon: selfIcon,
    draggable: false,
  }).addTo(map);
}, ()=>{});

// food spot markers

getAllSpot().then((spots) => {
  spots.forEach((spot) => {
    const pos = [spot.latitude, spot.longitude];
    let m: L.Marker;
    if(spot.username === currentUser.username) {
      m = L.marker(pos, {
        title: spot.info,
        icon: marker.mySpotIcon,
      }).addTo(map);
    } else {
      m = L.marker(pos, {
        title: spot.info,
      }).addTo(map);
    }
    m.on('click', () => {
      showSpotInfo(spot);
      selectedMarker = m;
    });
  });
});

// spot CRUD

const currentUser = jwt.decode(localStorage.getItem("token"), "esn");
const addSpotBtn = document.getElementById('add-spot-btn') as HTMLButtonElement;
const addSpotSubmitBtn = document.getElementById('add-spot-submit-btn') as HTMLButtonElement;
let tmpMarker: L.Marker;
let selectedMarker: L.Marker;

// add spot

const showSpotEdit = (isEdit: boolean = false) => {
  document.getElementById('edit-div')!.classList.remove('hidden');
  document.getElementById('info-div')!.classList.add('hidden');
  document.getElementById('spot-detail')!.classList.remove('hidden');
  document.getElementById('spot-name')!.innerText = currentUser.username;
  addSpotBtn.innerText = 'Cancel';
  addSpotBtn.classList.remove('bg-rose-500');
  addSpotBtn.classList.add('bg-gray-500');
  addSpotBtn.onclick = handleCancelOnClick;
  if (isEdit) {
    document.getElementById('delete-icon')!.classList.remove('hidden');
    addSpotSubmitBtn.innerText = 'Update';
  } else {
    document.getElementById('delete-icon')!.classList.add('hidden');
    addSpotSubmitBtn.innerText = 'Create';
    addSpotSubmitBtn.onclick = handleAddSpotSubmit;
    const currentSpot = map.getCenter();
    tmpMarker = L.marker(currentSpot,{
      icon: marker.newSpotIcon,
      draggable: false,
    })
    tmpMarker.addTo(map);
  }

  map.dragging.disable();
}

const handleCancelOnClick = () => {
  document.getElementById('spot-detail')!.classList.add('hidden');
  (document.getElementById('spot-info-input') as HTMLTextAreaElement).value = '';
  addSpotBtn.innerText = 'Add New';
  addSpotBtn.classList.remove('bg-gray-500');
  addSpotBtn.classList.add('bg-rose-500');
  addSpotBtn.onclick = handleAddSpot;
  
  if (tmpMarker) map.removeLayer(tmpMarker);
  map.dragging.enable();
}

const handleAddSpot = () => showSpotEdit();

addSpotBtn.onclick = handleAddSpot;

const handleAddSpotSubmit = () => {
  const spotInfoInput = document.getElementById('spot-info-input') as HTMLTextAreaElement;
  const spotInfo = spotInfoInput.value;
  if (spotInfo === '') {
    window.alert('Please enter your sharing information.');
    return;
  }

  const currentSpot = map.getCenter();
  
  const spot = {
    username: currentUser.username,
    info: spotInfo,
    latitude: currentSpot.lat,
    longitude: currentSpot.lng,
  }
  // add spot to database
  addSpot(spot).then(() => {
    handleCancelOnClick()
    const m = L.marker(currentSpot,{
      icon: marker.mySpotIcon,
      draggable: false,
    }).addTo(map);
    m.on('click', () => {
      showSpotInfo(spot);
      selectedMarker = m;
    });
  }).catch((err) => {
    console.log(err);
  });
}

// show spot info

const showSpotInfo = (spot) => {
  document.getElementById('edit-div')!.classList.add('hidden');
  document.getElementById('spot-detail')!.classList.remove('hidden');
  document.getElementById('info-div')!.classList.remove('hidden');
  const editIcon = document.getElementById('edit-icon') as HTMLElement;
  if (spot.username === currentUser.username) {
    editIcon.classList.remove('hidden');
    editIcon.onclick = () => handleUpdateSpot(spot);
    const deleteIcon = document.getElementById('delete-icon') as HTMLElement;
    deleteIcon.onclick = () => handleDeleteSpot(spot);
    (document.getElementById('spot-info-input') as HTMLTextAreaElement).value = spot.info;
  } else {
    editIcon.classList.add('hidden');
    document.getElementById('spot-img')!.onclick = ()=>{
      window.location.href = `/chat.html?contact=${spot.username}`;
    }
  }
  document.getElementById('spot-info')!.innerText = spot.info;
  document.getElementById('spot-name')!.innerText = spot.username;
  const time = new Date(spot.lastUpdateTime);
  document.getElementById('spot-update-time')!.innerText = time.toLocaleString();;
  addSpotBtn.innerText = 'Cancel';
  addSpotBtn.classList.remove('bg-rose-500');
  addSpotBtn.classList.add('bg-gray-500');
  addSpotBtn.onclick = handleCancelOnClick;
}

// edit spot info

const handleUpdateSpot = (spot) => {
  showSpotEdit(true);
  addSpotSubmitBtn.onclick = () => {
    updateSpot({
      ...spot,
      info: (document.getElementById('spot-info-input') as HTMLTextAreaElement).value,
    }).then((res) => {
      handleCancelOnClick();
      selectedMarker.on('click', () => {
        showSpotInfo(res);
        selectedMarker = selectedMarker;
      })
    }).catch((err) => {
      console.log(err);
    });
  };
}

// delete spot

const handleDeleteSpot = (spot) => {
  deleteSpot(spot)
  .then(() => {
    handleCancelOnClick();
    map.removeLayer(selectedMarker);
  }).catch((err) => {
    console.log(err);
  });
}

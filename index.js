const timeResult = document.getElementById('timeResult');
const cityResult = document.getElementById('cityResult');
const stateResult = document.getElementById('stateResult');
const countryResult = document.getElementById('countryResult');
const conditionResult = document.getElementById('conditionResult');
const humidityResult = document.getElementById('humidityResult');
const tempResult = document.getElementById('tempResult');
const windResult = document.getElementById('windResult');
const results = document.getElementById('results');
const result = document.getElementsByClassName('result');
const resultDiv = document.getElementsByClassName('resultDiv');
const startBtn = document.getElementById('startBtn');
const footerBtn = document.getElementsByClassName('footerBtn');
const currentBtn = document.getElementById('currentBtn');
const savedBtn = document.getElementById('savedBtn');
const gitBtn = document.getElementById('gitBtn');
const locations = document.getElementById('locations');
const locationExitBtn = document.getElementById('locationExitBtn');
const inputDiv = document.getElementById('inputDiv');
const footerBtnContainer = document.getElementById('footerBtnContainer');

const cityInput = document.getElementById('city');
const stateInput = document.getElementById('state');
const tempType = document.getElementById('tempType');
const submitBtn = document.getElementById('submitBtn');
const closeBtn = document.getElementById('closeBtn');
const addBtn = document.getElementById('addBtn');

let loading = false;
let currentWindowActive = false;
let locationWindowActive = false;

results.style.visibility = 'hidden';
locations.style.visibility = 'hidden';
inputDiv.style.visibility = 'hidden';

let locationArray = [];

(()=> {
    const storage = {...localStorage};
    for (let key in storage) {
        const keyMap = key.split('');
        const keyWeather = keyMap.splice(0, 7);
        const keyJoin = keyWeather.join('');
        if (keyJoin === 'weather') {
            const location = JSON.parse(localStorage.getItem(key));
            addLocationToLocationList(location);
            locationArray.push(location);
        }
    }
})();

/*
for (let i = 0; i < footerBtn.length; i++) {
    const e = footerBtn[i];
    e.addEventListener('mouseenter', function(){
        e.style.cursor = 'pointer';
        e.style.backgroundColor = 'rgb(107, 130, 223)';
    })
    e.addEventListener('mouseleave', function(){
        const windowActive = checkWindowActive(e);
        if (!windowActive) {
            e.style.backgroundColor = `rgb(71, 104, 237)`;
        }
    })
}
*/

startBtn.addEventListener('mouseenter', function(){
    startBtn.children[0].src = './images/xp-closed.png';
})

startBtn.addEventListener('mouseleave', function(){
    startBtn.children[0].src = './images/xp-open.png';
})

locationExitBtn.addEventListener('click', function(){
    openWindow(locations, savedBtn, locationWindowActive);
})

addListeners(inputDiv, currentBtn, currentWindowActive);
addListeners(locations, savedBtn, locationWindowActive);

function addListeners(mainDiv, btn, boolVar) {
    mainDiv.visibility = 'hidden';
    btn.addEventListener('click', function(){
        openWindow(mainDiv, btn, boolVar);
        boolVar = true;
    })
    btn.addEventListener('mouseenter', function(){
        btn.style.backgroundColor = `rgb(107, 130, 223)`;
        btn.style.cursor = 'pointer';
    })
    btn.addEventListener('mouseleave', function(){
        if (!boolVar) {
            btn.style.backgroundColor = 'rgb(71, 104, 237)';
        }
    })
} 


function openWindow(window, btn, activeWindow){
    if (window.style.visibility === 'hidden') {
        window.style.visibility = 'visible';
        btn.style.backgroundColor = 'rgb(107, 130, 223)';
        activeWindow = true;
    } else {
        window.style.visibility = 'hidden';
        btn.style.backgroundColor = 'rgb(71, 104, 237)';
        activeWindow = false;
    }
}
async function getData(cityVal, stateVal, tempType){
    try {
        const response = await fetch(`https://api.weatherapi.com/v1/current.json?key=918188e5f09d4942981155140232103&q=${cityVal}, ${stateVal}`, {mode: 'cors'});
        const responseData = await response.json();
        timeResult.textContent = responseData.location.localtime;
        cityResult.textContent = responseData.location.name;
        stateResult.textContent = responseData.location.region;
        countryResult.textContent = responseData.location.country;
        conditionResult.textContent = responseData.current.condition.text;
        humidityResult.textContent = responseData.current.humidity;
        if (tempType === 'Fahrenheit') {
            tempResult.textContent = `${responseData.current.temp_f}F`;
            windResult.textContent = `${responseData.current.wind_dir} ${responseData.current.wind_mph} MPH`;
        } else {
            tempResult.textContent = `${responseData.current.temp_c}C`;
            windResult.textContent = `${responseData.current.wind_dir} ${responseData.current.wind_kph} KPH`;
        }

    } catch (err) {
        console.log(err);
    }
}

function showResultsAnimation(){
    let i = 0;
    const myInterval = setInterval(function(){
        if (i < resultDiv.length) {
            loading = true;
            let e = resultDiv[i];
            e.style.visibility = 'hidden';
            showResultsWindow(e);
            i++;
        } else {
            loading = false;
            clearInterval(myInterval);
        }
    }, 150);
}

function showResultsWindow(e) {
    e.style.visibility = 'visible';
    e.classList.add('fade-in');
}

function removeResultsWindow(e) {
    e.style.visibility = 'hidden';
    e.classList.remove('fade-in');
}

submitBtn.addEventListener('click', function(){
    if (cityInput.value !== '') {
        showResultsWindow(results);
        const cityVal = cityInput.value;
        const stateVal = stateInput.value;
        const tempTypeVal = tempType.value;
        getData(cityVal, stateVal, tempTypeVal);
        cityInput.style.border = "none";
        showResultsAnimation();
        addResultTab();
    } else {
        cityInput.style.border = '2px solid red';
    }
})

closeBtn.addEventListener('click', function(){
    if (!loading) {
        removeResultsWindow(results);
        removeData(resultDiv);
        removeResultTab();
    }
})

function addResultTab(){
    const resultTab = document.createElement('div');
    resultTab.id = 'resultTab';
    resultTab.classList.add('footerBtn');
    const myImg = document.createElement('img');
    myImg.src = './images/weather-logo.png';
    resultTab.appendChild(myImg);
    resultTab.innerHTML += 'Weather Results';
    footerBtnContainer.appendChild(resultTab);
}

function removeResultTab(){
    for (let i = footerBtnContainer.children.length -1; i >= 0; i--) {
        const e = footerBtnContainer.children[i];
        if (e.id === 'resultTab') {
            e.remove();
            break;
        }
    }
}

function removeData(element){
    for (let i = 0; i < element.length; i++) {
            const e = element[i];
            const r = e.children[1];
            e.style.visibility = 'hidden';
            e.classList.remove('fade-in');
            r.textContent = '';
        }
}

addBtn.addEventListener('click', function(){
    const cityVal = document.getElementById('city').value;
    const stateVal = document.getElementById('state').value;
    const tempVal = document.getElementById('tempType').value;
    const newLocation = new Object();
    newLocation.city = cityVal;
    newLocation.state = stateVal;
    newLocation.temp = tempVal;
    localStorage.setItem(`weather${cityVal}`, JSON.stringify(newLocation));
    locationArray.push(newLocation);
    addLocationToLocationList(newLocation);
})

function addLocationToLocationList(loc) {
    const locations = document.getElementById('locations');
    const location = document.createElement('div');
    const locationP = document.createElement('p');
    const removeLocationBtn = document.createElement('button');

    locationP.textContent = `${loc.city}, ${loc.state}`;
    location.id = loc.city;
    location.classList.add('location');
    removeLocationBtn.textContent = 'X';
    removeLocationBtn.classList.add('removeLocationBtn');
    location.appendChild(locationP);
    location.appendChild(removeLocationBtn);
    locations.appendChild(location);

    locationP.addEventListener('click', function(){
        if (!loading) {
            removeResultsWindow(results);
            showResultsWindow(results);
            const cityVal = loc.city;
            const stateVal = loc.state;
            const tempTypeVal = loc.temp;
            getData(cityVal, stateVal, tempTypeVal);
            cityInput.style.border = "none";
            showResultsAnimation();
            addResultTab();
        }
    })

    removeLocationBtn.addEventListener('click', function(){
        removeFromLocationList(loc)
    })
}

function removeFromLocationList(loc) {
    const locationDiv = document.getElementById('locations');
    for (let i = 0; i < locationArray.length; i++) {
        const location = locationArray[i];
        if (loc.city === location.city) {
            locationArray.splice(i, 1);
            localStorage.removeItem(`weather${loc.city}`);
        }
    }
    for (let i = locationDiv.children.length - 1; i >= 0; i--) {
        const e = locationDiv.children[i];
        if (e.textContent === `${loc.city}, ${loc.state}X`) {
            e.remove();
            break
        }
    }
}



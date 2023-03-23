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

const cityInput = document.getElementById('city');
const stateInput = document.getElementById('state');
const tempType = document.getElementById('tempType');
const submitBtn = document.getElementById('submitBtn');
const closeBtn = document.getElementById('closeBtn');
const addBtn = document.getElementById('addBtn');

results.style.visibility = 'hidden';

let locationArray = [];

(()=> {
    const storage = {...localStorage};
    for (let key in storage) {
        const location = JSON.parse(localStorage.getItem(key));
        updateLocationList(location);
        locationArray.push(location);
    }
})();


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
            let e = resultDiv[i];
            changeVisibility(e);
            i++;
        } else {
            clearInterval(myInterval);
        }
    }, 150);
}

function changeVisibility(e) {
    e.style.visibility = 'visible';
    e.classList.add('fade-in');
}


submitBtn.addEventListener('click', function(){
    if (cityInput.value !== '') {
        results.style.visibility = 'visible';
        results.classList.add('fade-in');
        const cityVal = cityInput.value;
        const stateVal = stateInput.value;
        const tempTypeVal = tempType.value;
        getData(cityVal, stateVal, tempTypeVal);
        cityInput.style.border = "none";
        showResultsAnimation();
    } else {
        cityInput.style.border = '2px solid red';
    }

})

closeBtn.addEventListener('click', function(){
    results.style.visibility = 'hidden';
    results.classList.remove('fade-in');
    for (let i = 0; i < resultDiv.length; i++) {
        const e = resultDiv[i];
        const r = e.children[1];
        e.style.visibility = 'hidden';
        e.classList.remove('fade-in');
        r.textContent = '';
    }
})

addBtn.addEventListener('click', function(){
    const cityVal = document.getElementById('city').value;
    const stateVal = document.getElementById('state').value;
    const tempVal = document.getElementById('tempType').value;
    const newLocation = new Object();
    newLocation.city = cityVal;
    newLocation.state = stateVal;
    newLocation.temp = tempVal;
    localStorage.setItem(cityVal, JSON.stringify(newLocation));
    updateLocationList(newLocation);
})

function updateLocationList(loc) {
    const locations = document.getElementById('locations');
    const location = document.createElement('div');
    const locBtn = document.createElement('button');

    location.textContent = `${loc.city}, ${loc.state}`;
    location.id = loc.city;
    location.classList.add('location');
    locBtn.textContent = 'X';
    locBtn.classList.add('removeLocationBtn');
    location.appendChild(locBtn);
    locations.appendChild(location);

    location.addEventListener('click', function(){
        results.style.visibility = 'visible';
        results.classList.add('fade-in');
        getData(loc.city, loc.state, loc.temp);
        cityInput.style.border = "none";
        showResultsAnimation();
    })

    locBtn.addEventListener('click', function(){
        results.style.visibility = 'hidden';
        results.classList.remove('fade-in');
        for (let i = 0; i < resultDiv.length; i++) {
            const e = resultDiv[i];
            const r = e.children[1];
            e.style.visibility = 'hidden';
            e.classList.remove('fade-in');
            r.textContent = '';
        }
        const storage = {...localStorage};
        for (let key in storage) {
            if (key === loc.city) {
                localStorage.removeItem(key);
                removeFromLocationList(loc);
            }
        }

    })
}

function removeFromLocationList(loc) {
    const locationDiv = document.getElementsByClassName('location');
    for (let i = 0; i < locationArray.length; i++) {
        const location = locationArray[i];
        if (loc.city === location.city) {
            locationArray.splice(i, 1);
        }
    }
    for (let i = locationDiv.children.length -1; i >= 0; i--) {
        const e = locationDiv.children[i];
        console.log(e);
        if (e.id === loc.city) {
            e.remove();
        }
    }

}



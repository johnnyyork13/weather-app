const cityResult = document.getElementById('cityResult');
const stateResult = document.getElementById('stateResult');
const countryResult = document.getElementById('countryResult');
const conditionResult = document.getElementById('conditionResult');
const humidityResult = document.getElementById('humidityResult');
const tempResult = document.getElementById('tempResult');
const windResult = document.getElementById('windResult');
const results = document.getElementById('results');
const result = document.getElementsByClassName('result');

const cityInput = document.getElementById('city');
const stateInput = document.getElementById('state');
const submitBtn = document.getElementById('submitBtn');
const closeBtn = document.getElementById('closeBtn');

results.style.visibility = 'hidden';

async function getData(cityVal, stateVal){
    try {
        const response = await fetch(`https://api.weatherapi.com/v1/current.json?key=918188e5f09d4942981155140232103&q=${cityVal}, ${stateVal}`, {mode: 'cors'});
        const responseData = await response.json();
        cityResult.textContent = responseData.location.name;
        stateResult.textContent = responseData.location.region;
        countryResult.textContent = responseData.location.country;
        conditionResult.textContent = responseData.current.condition.text;
        humidityResult.textContent = responseData.current.humidity;
        tempResult.textContent = `${responseData.current.temp_f}F`;
        windResult.textContent = `${responseData.current.wind_dir} ${responseData.current.wind_mph}mph`;
    } catch (err) {
        console.log(err);
    }
}

submitBtn.addEventListener('click', function(){
    results.style.visibility = 'visible';
    const cityVal = cityInput.value;
    const stateVal = stateInput.value;
    getData(cityVal, stateVal);
})

closeBtn.addEventListener('click', function(){
    results.style.visibility = 'hidden';
    for (let i = 0; i < result.length; i++) {
        const e = result[i];
        e.textContent = '';
    }
})
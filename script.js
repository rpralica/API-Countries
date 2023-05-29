'use strict';
const btnCountry = document.querySelector('#btn-country');
const countriesContainer = document.querySelector('.countries');
 const upisi=document.getElementById('upisi'); 
const renderCountry = function(data, className='') {
  //convert an object to an array
  const languages = Object.values(data.languages); 
  const currencies = Object.values(data.currencies).map((cur) => cur.name);
  const html = `<article class="country ${className}">
  <img class="country__img" src="${data.flags.svg}" />
  <div class="country__data">
    <h3 class="country__name">${data.name.official}</h3>
    <h4 class="country__region">${data.region}</h4>
    <p class="country__row"><span>👫</span>${(+data.population/1000000).toFixed(1)} people</p>
    <p class="country__row"><span>🗣️</span>${languages}</p>
    <p class="country__row currencies"><span>💰</span>${currencies.join(`<br/>`)}</p>
    <p class="country__row"><span>🌎</span>${data.area.toLocaleString()} km²</p>
  </div>
  </article>`
  countriesContainer.insertAdjacentHTML('beforeend', html);
};
 
const renderError = function(err) {
    countriesContainer.insertAdjacentText('beforeend', err)
}
 
const getJSON = function(url, errorMsg = 'Something went wrong') {
    //the code below returns a promise
    return fetch(url).then((response) => {
      if(!response.ok) throw new Error(`${errorMsg} (${response.status})`)
      return response.json()})
}
 
const getCountryDataP = function(country) {
    getJSON(`https://restcountries.com/v3.1/name/${country}`, 'Country not found')
    .then(([data]) => {
      renderCountry(data);
      const neighbors = data.borders;
      if (!neighbors) throw new Error(`No neighbors found`);
      neighbors.forEach((cur) => fetch(`https://restcountries.com/v3.1/alpha?codes=${cur}`)
      .then((response) => response.json())
      .then(([data2]) => renderCountry(data2, 'neighbour')) 
      ); // close forEach
    })
    .catch((err) => {
      console.log(`${err} 🤔🙃😫`);
      renderError(`Something went wrong. ${err.message}. Please try again!`)})
    .finally(() => countriesContainer.style.opacity = 1)
};
 

// const prikaz=`
// <input id="upisi"  type="text">
// <button id="btn-country">Prikaži</button>
// ` 
// countriesContainer.insertAdjacentHTML('beforebegin', prikaz);

btnCountry.addEventListener('click',function(e){
  e.preventDefault();
getCountryDataP(upisi.value)
});
    

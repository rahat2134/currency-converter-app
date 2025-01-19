const BASE_URL =
    "https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api";
const FALLBACK_URL = "https://latest.currency-api.pages.dev";

    
const dropdowns = document.querySelectorAll('.dropdown select');
const btn = document.querySelector('form button');
const fromCurr = document.querySelector('.from select');
const toCurr = document.querySelector('.To select');
const msg = document.querySelector('.msg');

// creating all the options with help of data in codes.js
for(let select of dropdowns) {
    for(let currCode in countryList) {
        let newOption = document.createElement("option");
        newOption.innerText = currCode;
        newOption.value = currCode;
        // adding default as USD in from and INR in To section
        if(select.name === 'from' && currCode === 'USD') {
            newOption.selected = "selected";
        } else if(select.name === 'To' && currCode === 'INR') {
            newOption.selected = "selected";
        }
        select.append(newOption);
    }

    select.addEventListener("change", (evt)=>{ // whenever there will be any change in select i.e any country change
        updateFlag(evt.target); //tell the update flag that pls change the flag now.
    })
}

const updateFlag = (element) => { // this element is the select i.e country
    // just need to add currCode in country name https://flagsapi.com/{US}/flat/64.png
    let currCode = element.value;
    let countryCode = countryList[currCode];

    let newSrc = `https://flagsapi.com/${countryCode}/flat/64.png`;
    let img = element.parentElement.querySelector("img"); //we get the image from our select attribute that we got as input
    img.src = newSrc;
}

btn.addEventListener("click", async (evt)=>{ 
    evt.preventDefault(); //to reset the button default functionality. Bydefault when we click then it loads the page so we are reset or removing it.    
    
    let amount = document.querySelector('.amount input'); 
    let amtVal = amount.value;
    if(amtVal < 0 || amtVal === "") {
        amtVal = 1;
        amount.value="1";
    }

    const fromCurrency = fromCurr.value.toLowerCase();
    const toCurrency = toCurr.value.toLowerCase();
    const URL = `${BASE_URL}@latest/v1/currencies/${fromCurrency}.json`;
    const fallbackURL = `${FALLBACK_URL}/v1/currencies/${fromCurrency}.json`;

    try {
        let response = await fetch(URL);
        if (!response.ok) {
            response = await fetch(fallbackURL);
        }
        const data = await response.json();
        const rate = data[fromCurrency][toCurrency];
        if (rate) {
            const convertedAmount = amtVal * rate;
            msg.innerText = `${amtVal} ${fromCurrency.toUpperCase()} = ${convertedAmount.toFixed(2)} ${toCurrency.toUpperCase()}`;
        } else {
            msg.innerText = `Conversion rate for ${toCurrency.toUpperCase()} not found.`;
        }
    } catch (error) {
        msg.innerText = "Error fetching conversion rate. Please try again later.";
    }
});
const apiUrl = 'https://api.carrollmedia.dev';
let prayerTally = 0;
    function init() {
    // enable active states for buttons in mobile safari
    document.addEventListener("touchstart", function () {}, false);
    updateTally();
    // getTimespans();
    setInputButtonState();
}

function updateTally() {
    fetch(apiUrl + '/prayer')
  .then((response) => response.json())
  .then((data) => {
    totalMinutes = data;
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    let tallyDisplayHours = document.getElementsByClassName('tally-display-hours');
    let tallyDisplayMinutes = document.getElementsByClassName('tally-display-minutes');

    for(element of tallyDisplayHours) {
        element.innerText = hours;
    }
    
    for(element of tallyDisplayMinutes) {
        element.innerText = minutes;
    }
});
}

async function getTimespans() {
    const response = await fetch(apiUrl + '/prayer/timespan');
    const json = await response.json();
    let hoursMap = new Map();
    let daysMap = new Map();
    let timespans = json.timespans;
    timespans.forEach(element => {
        populateHoursMap(hoursMap, element);
        populateDaysMap(daysMap, element);
    });
    daysMap = formatDaysMap(daysMap);
    const weeklyMap = populateWeeklyMap(timespans);
    return [hoursMap, daysMap, weeklyMap];
}

function populateDaysMap(daysMap, element) {
    if (daysMap.get(element.day)) {
        const currentSum = daysMap.get(element.day);
        daysMap.set(element.day, currentSum + element.duration);
    } else {
        daysMap.set(element.day, element.duration);
    }
}

function populateHoursMap(hoursMap, element) {
    const formattedHour = element.hour > 12 ? element.hour - 12 + ' pm' : element.hour + ' am';
    element.hour = formattedHour;
    if (hoursMap.get(element.hour)) {
        const currentSum = hoursMap.get(element.hour);
        hoursMap.set(element.hour, currentSum + element.duration);
    } else {
        hoursMap.set(element.hour, element.duration);
    }
}

function populateWeeklyMap(timespans) {
    const sunday = getSunday();
    let weeklyMap = createBaseWeeklyMap();
    timespans = timespans.filter(element => isInCurrentWeek(element, sunday))
    timespans.forEach(element => {
        const currentSum = weeklyMap.get(translateDays(element.day));
        weeklyMap.set(translateDays(element.day), currentSum + element.duration);
    });

    return weeklyMap;
}

function isInCurrentWeek(element, sunday) {
    const submittedTime = new Date(element.submitted_time);
    return (submittedTime > sunday);
}

function getSunday() {
    const today = new Date();
    const sunday = new Date(today.setDate(today.getDate() - today.getDay()));
    sunday.setHours(0);
    sunday.setMinutes(0);
    return sunday;
}

function formatDaysMap(daysMap) {
    daysMap = new Map([...daysMap.entries()].sort());
    let formattedMap = new Map();
    daysMap.forEach((value, key) => {
        formattedMap.set(translateDays(key), value);
    })
    return formattedMap;
}

function createBaseWeeklyMap() {
    return new Map([
        ['Sunday', 0],
        ['Monday', 0],
        ['Tuesday', 0],
        ['Wednesday', 0],
        ['Thursday', 0],
        ['Friday', 0],
        ['Saturday', 0]
    ])
}

function translateDays(dayOfWeek) {
    let formattedDay;
    switch(dayOfWeek) {
        case 0:
            formattedDay = 'Sunday';
            break;
        case 1:
            formattedDay = 'Monday';
            break;
        case 2:
            formattedDay = 'Tuesday';
            break;
        case 3:
            formattedDay = 'Wednesday';
            break;
        case 4:
            formattedDay = 'Thursday';
            break;
        case 5:
            formattedDay = 'Friday';
            break;
        case 6:
            formattedDay = 'Saturday';
            break;
    }
    return formattedDay;
}

function addPrayerTime(event) {
const hue = document.getElementById('hue');
const minutes = hue.value;

fetch(apiUrl + '/prayer?minutes=' + minutes, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  }
})
  .then((response) => 
  {
    response.json();
    updateTally();
    })
  .then((data) => {
    console.log('Success:', data);
  })
  .catch((error) => {
    console.error('Error:', error);
  });

}

function handleNumberInput() {
    setInputButtonState();
}

function handleNumberInputBlur(event) {
    const value = event.target.value;

    if (event.target.hasAttribute("min") && value < parseFloat(event.target.min))
        event.target.value = event.target.min;

    if (event.target.hasAttribute("max") && value > parseFloat(event.target.max))
        event.target.value = event.target.max;
}

function setInputButtonState() {
    const inputs = document.getElementsByClassName("number-input-text-box");

    for (let input of inputs) {
        if (input.id.length > 0) { // during value transition the old input won't have an id
            const value = input.value;
            const parent = input.parentElement.parentElement;

            if (parent.children[0] && input.hasAttribute("min"))
                parent.children[0].disabled = value <= parseFloat(input.min);

            if (parent.children[2] && input.hasAttribute("max"))
                parent.children[2].disabled = value >= parseFloat(input.max);
        }
    }
}

function setNumber(event) {
    let button = event.target;
    let input = document.getElementById(button.dataset.inputId);

    if (input) {
        let value = parseFloat(input.value);
        let step = parseFloat(input.dataset.step);

        if (button.dataset.operation === "decrement") {
            value -= isNaN(step) ? 1 : step;
        } else if (button.dataset.operation === "increment") {
            value += isNaN(step) ? 1 : step;
        }

        if (input.hasAttribute("min") && value < parseFloat(input.min)) {
            value = input.min;
        }

        if (input.hasAttribute("max") && value > parseFloat(input.max)) {
            value = input.max;
        }

        if (input.value !== value) {
            setInputValue(input, value);
            setInputButtonState();
        }
    }
}

function setInputValue(input, value) {
    let newInput = input.cloneNode(true);
    const parentBox = input.parentElement.getBoundingClientRect();

    input.id = "";

    newInput.value = value;

    if (value > input.value) {
        // right to left
        input.parentElement.appendChild(newInput);
        input.style.marginLeft = -parentBox.width + "px";
    } else if (value < input.value) {
        // left to right
        newInput.style.marginLeft = -parentBox.width + "px";
        input.parentElement.prepend(newInput);
        window.setTimeout(function () {
            newInput.style.marginLeft = 0
        }, 20);
    }

    window.setTimeout(function () {
        input.parentElement.removeChild(input);
    }, 250);
}
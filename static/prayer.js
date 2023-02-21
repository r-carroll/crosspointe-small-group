let prayerTally = 0;
    function init() {
        console.log("initting")
    // enable active states for buttons in mobile safari
    document.addEventListener("touchstart", function () {}, false);
    updateTally();
    setInputButtonState();
}

function updateTally() {
    fetch('https://api.carrollmedia.dev/prayer')
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

function addPrayerTime(event) {
const hue = document.getElementById('hue');
const minutes = hue.value;

fetch('https://api.carrollmedia.dev/prayer?minutes=' + minutes, {
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
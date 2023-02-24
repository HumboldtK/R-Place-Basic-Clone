const CANVAS_WIDTH = 1500;
const CANVAS_HEIGHT = 1000;
const canvas = document.getElementById("grid");
const ctx = canvas.getContext("2d");
const colorpicker = document.getElementById("colorpicker");
const board = document.querySelector(".board");
let pixels = [];
let isPressed = false;
let realtime = true;

// just grab a DOM element
var element = document.querySelector('#grid')

// And pass it to panzoom
var instance = panzoom(element, {
  maxZoom: 20,
  minZoom: 1,
  bounds: true,
  boundsPadding: 1
});

const draw = function ({ x, y, color }) {
  const imageData = ctx.createImageData(2, 2);
  const pixelData = imageData.data;
  pixelData[0] = parseInt(color.slice(1, 3), 16);
  pixelData[1] = parseInt(color.slice(3, 5), 16);
  pixelData[2] = parseInt(color.slice(5, 7), 16);
  pixelData[3] = 255;
  pixelData[4] = parseInt(color.slice(1, 3), 16);
  pixelData[5] = parseInt(color.slice(3, 5), 16);
  pixelData[6] = parseInt(color.slice(5, 7), 16);
  pixelData[7] = 255;
  pixelData[8] = parseInt(color.slice(1, 3), 16);
  pixelData[9] = parseInt(color.slice(3, 5), 16);
  pixelData[10] = parseInt(color.slice(5, 7), 16);
  pixelData[11] = 255;
  pixelData[12] = parseInt(color.slice(1, 3), 16);
  pixelData[13] = parseInt(color.slice(3, 5), 16);
  pixelData[14] = parseInt(color.slice(5, 7), 16);
  pixelData[15] = 255;
  x = Math.round(x / 2) * 2;
  y = Math.round(y / 2) * 2;
  ctx.putImageData(imageData, x, y);
};


let latestPixels;
const printSnapshot = function ({ dateStart, dateEnd } = {}) {
  const dateParam = dateStart
    ? `?start_date=${dateStart}`
    : dateEnd
    ? `?historic_date=${dateEnd}`
    : "";
  fetch("get_pixels.php" + dateParam)
    .then(function (response) {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(function (data) {
      if (latestPixels !== JSON.stringify(data)) {
        latestPixels = JSON.stringify(data);
        data.forEach(function (item) {
          draw(item);
        });
      }
    })
    .catch(function(error) {
      console.error('Error fetching pixels:', error);
    });
};

const ingestPixels = function (pixels) {
  fetch("update_pixels.php", {
    method: "POST",
    body: JSON.stringify(pixels),
  })
  .then(function(response) {
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    console.log('Pixels updated successfully');
  })
  .catch(function(error) {
    console.error('Error updating pixels:', error);
  });
};

const init = function () {
  canvas.width = CANVAS_WIDTH;
  canvas.height = CANVAS_HEIGHT;
  canvas.style.width = `${CANVAS_WIDTH}px`;
  canvas.style.height = `${CANVAS_HEIGHT}px`;
  printSnapshot(); 
};

const getPixelClicked = function (canvas, event) {
  const canvasRect = canvas.getBoundingClientRect();
  const canvasWidth = canvasRect.width;
  const canvasHeight = canvasRect.height;
  if (event.offsetX < 0 || event.offsetX >= canvasWidth || event.offsetY < 0 || event.offsetY >= canvasHeight) {
  return null; // Return null if the click is outside the canvas
}
  const x = Math.floor(event.offsetX / 2) * 2;
  const y = Math.floor(event.offsetY / 2) * 2;
  const color = colorpicker.value;
  return { x, y, color };
};


const now = function (lag = 0) {
  const MILISECONDS = 1000;
  const format = (number) => (number < 10 ? `0${number}` : number);
  const d = new Date(Date.now() - lag * MILISECONDS);
  const day = format(d.getUTCDate());
  const month = format(d.getUTCMonth() + 1);
  const year = format(d.getUTCFullYear());
  const hour = format(d.getUTCHours());
  const minutes = format(d.getUTCMinutes());
  const seconds = format(d.getUTCSeconds());
  const date = `${year}-${month}-${day}`;
  const time = `${hour}:${minutes}:${seconds}`;
  return `${date} ${time}`;
};

const onPressBrush = function (event) {
  if (event.button === 0) {
    isPressed = true;
    useBrush(event);
  }
};
const onRaiseBrush = function () {
  isPressed = false;
  pixels = [];
};

let lastPlacementTime = 0;
let isFirstPlacement = true;
const placeSound = new Audio('pixelplaced.mp3');

const useBrush = function (event) {
  if (isPressed) {
    const currentTime = new Date().getTime();
    if (currentTime - lastPlacementTime >= 10000) { // 10 second cooldown
      const pixel = getPixelClicked(canvas, event);
      if (isSoundEnabled) {
        placeSound.play();
      }
      pixels = [pixel];
      draw(pixel);
      ingestPixels(pixels);
      pixels = [];
      lastPlacementTime = currentTime;
      soundPlayed = false; // reset soundPlayed
      if (isFirstPlacement) {
        document.getElementById("timer").style.display = "block";
        isFirstPlacement = false;
      }
    }
    isPressed = false;
  }
};

const timerSound = new Audio('timerend.mp3');
let isSoundEnabled = true;
let soundPlayed = false;

const updateTimer = function () {
  const currentTime = new Date().getTime();
  const timeRemaining = Math.max(0, lastPlacementTime + 10000 - currentTime); // time remaining in milliseconds
  const secondsRemaining = Math.ceil(timeRemaining / 1000); // time remaining in seconds, rounded up
  const timerElement = document.getElementById("timer");
  timerElement.innerText = `Next placement in ${secondsRemaining} seconds`;
  timerElement.classList.add("visible");
  
  if (timeRemaining === 0 && isSoundEnabled && !soundPlayed) {
    timerSound.play();
    soundPlayed = true;
  }
};

// check if the "sound" cookie is set and update isSoundEnabled accordingly
const soundCookie = document.cookie.split('; ').find(row => row.startsWith('sound='));
if (soundCookie) {
  isSoundEnabled = soundCookie.split('=')[1] === 'true';
}

const toggleSound = function () {
  isSoundEnabled = !isSoundEnabled;
  soundPlayed = false; // reset soundPlayed
  document.cookie = `sound=${isSoundEnabled}; expires=${new Date(Date.now() + 86400e3).toUTCString()};`;
};


const checkbox = document.querySelector('.toggle-checkbox');
checkbox.checked = isSoundEnabled;
checkbox.addEventListener('change', toggleSound);

// update isSoundEnabled based on the initial state of the checkbox
isSoundEnabled = checkbox.checked;

window.setInterval(function () {
  if (realtime) {
    printSnapshot({ dateStart: now(5) });
  }
  if (!isFirstPlacement) {
    updateTimer();
  }
}, 2000); // sets refresh rate of realtime fetch requests. The lower the better for realtime. 2 seconds default.

canvas.onmousedown = realtime ? onPressBrush : () => {};
canvas.ontouchstart = realtime ? onPressBrush : () => {};
canvas.ontouchmove = realtime ? useBrush : () => {};
canvas.onmousemove = realtime ? useBrush : () => {};
canvas.ontouchend = realtime ? onRaiseBrush : () => {};
canvas.onmouseup = realtime ? onRaiseBrush : () => {};



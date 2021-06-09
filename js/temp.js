const lastUpdateTime = document.querySelector('#lastUpdateTime');
const insideTemp = document.querySelector('#insideTemp');
const insideHumid = document.querySelector('#insideHumid');
const insideHeatIndex = document.querySelector('#insideHeatIndex');
const outsideTemp = document.querySelector('#outsideTemp');
const outsideHumid = document.querySelector('#outsideHumid');
const outsideHeatIndex = document.querySelector('#outsideHeatIndex');

const newArrays = {
  date: [],
  inside: {
    temp: [],
    humid: [],
    heatIndex: []
  },
  outside: {
    temp: [],
    humid: [],
    heatIndex: []
  }
}

function getLastUpdate() {
  fetch(`${apiHost}/wheater/last`)
  .then(response => response.json())
  .then(result => {
    lastUpdateTime.innerText = `Last Update: ${result.data.date}`;

    insideTemp.innerText = `${result.data.inside.temp.toFixed(2)} °C`;
    insideHumid.innerText = `${result.data.inside.humid.toFixed(2)} %`;
    insideHeatIndex.innerText = `${result.data.inside.heatIndex.toFixed(2)} °C`;

    outsideTemp.innerText = `${result.data.outside.temp.toFixed(2)} °C`;
    outsideHumid.innerText = `${result.data.outside.humid.toFixed(2)} %`;
    outsideHeatIndex.innerText = `${result.data.outside.heatIndex.toFixed(2)} °C`;
  })
  .catch(err => console.log(err));
}

const plot = {
  buffer: 5,
  label: {
    temp: 'Temp °C',
    humid: 'Humid %',
    heatIndex: 'HeatIndex °C'
  },
  data: {
    inside: [],
    outside: []
  },
  dataFromDb: {
    hour: [],
    day: [],
    month: []
  },
  update: {
    hour: false
  },
  maxRange: {
    inside: null,
    outside: null
  },
  minRange: {
    inside: null,
    outside: null
  },
  init: function() {
    this.getHour(false);
    this.getDay(false);
    this.getMonth(false);
    let getAllData = setInterval(() => {
      if (this.dataFromDb.hour.length != 0 && this.dataFromDb.day.length != 0 && this.dataFromDb.month.length != 0) {
        this.makeParse();
        clearInterval(getAllData);
      }
    }, 500);
  },
  setUpdater: function() {
    this.update.running = true;
    //Get Hour Data
    setInterval(() => {
      const date = new Date();
      if (date.getMinutes() == 1 && this.update.hour == false) {
        this.update.hour = true;
        this.getHour(true);
      }
      if (date.getMinutes() == 2) {
        this.update.hour = false;
      }
    }, 1000);
  },
  getHour: function(update) {
    this.dataFromDb.hour = []
    fetch(`${apiHost}/wheater/hour`)
    .then(response => response.json())
    .then(result => {
      this.dataFromDb.hour = result.data;
      if (update) {
        this.makeParse();
      }
    })
    .catch(err => console.log(err));
  },
  getDay: function(update) {
    this.dataFromDb.day = []
    fetch(`${apiHost}/wheater/day`)
    .then(response => response.json())
    .then(result => {
      this.dataFromDb.day = result.data;
      if (update) {
        this.makeParse();
      }
    })
    .catch(err => console.log(err));
  },
  getMonth: function(update) {
    this.dataFromDb.month = []
    fetch(`${apiHost}/wheater/month`)
    .then(response => response.json())
    .then(result => {
      this.dataFromDb.month = result.data;
      if (update) {
        this.makeParse();
      }
    })
    .catch(err => console.log(err));
  },
  makeParse: function() {
    newArrays.date = [];
    newArrays.inside.temp = [];
    newArrays.inside.humid = [];
    newArrays.inside.heatIndex = [];
    newArrays.outside.temp = [];
    newArrays.outside.humid = [];
    newArrays.outside.heatIndex = [];

    this.parse(this.dataFromDb.hour);
    this.parse(this.dataFromDb.day);
    this.parse(this.dataFromDb.month);
    this.makeArray();
    if (this.update.running == undefined) {
      this.setUpdater();
    }
  },
  parse: function(data) {
    data.forEach(ele => {
      for (const [key, value] of Object.entries(ele)) {
        if (typeof value == 'string') {
          newArrays[key].push(value);
        } else {
          for (const [key2, value2] of Object.entries(value)) {
            newArrays[key][key2].push(value2.toFixed(2))
          }
        }
      }
    });
  },
  makeArray: function() {
    this.data.inside = [];
    this.data.outside = [];
    for (const [key, value] of Object.entries(newArrays)) {
      if (key != 'date') {
        for (const [key2, value2] of Object.entries(value)) {
          this.data[key].push(this.makeTrace(this.label[key2], newArrays.date, newArrays[key][key2]));
        }
      }
    }
    this.getMaxValuesHour();
    this.draw();
  },
  makeTrace: function(name, x, y) {
    var trace = {
      x: x,
      y: y,
      mode: 'lines+markers',
      type: 'scatter',
      line: {shape: 'spline'},
      connectgaps: true,
      name: name
    };
    return trace;
  },
  draw: function() {
    Plotly.newPlot('temps-inside', this.data.inside, {
      title:'Inside',
      xaxis: {
        range: [formatDate(minDays(Date.now(), 2), false), formatDate(Date.now(), true)],
        type: 'date'
      },
      yaxis: {
        range: [(this.minRange.inside - this.buffer), (this.maxRange.inside + this.buffer)],
        title: 'Value'
      }
    }, {responsive: true});
    Plotly.newPlot('temps-outside', this.data.outside, {
      title:'Outside',
      xaxis: {
        range: [formatDate(minDays(Date.now(), 2), false), formatDate(Date.now(), true)],
        type: 'date'
      },
      yaxis: {
        range: [(this.minRange.outside - this.buffer), (this.maxRange.outside + this.buffer)],
        title: 'Value'
      }
    }, {responsive: true});
  },
  getMaxValuesHour: function() {
    this.dataFromDb.hour.forEach(ele => {
      for (const [key, value] of Object.entries(ele)) {
        if (typeof value != 'string') {
          for (const [key2, value2] of Object.entries(value)) {
            if (this.maxRange[key] < value2) {
              this.maxRange[key] = value2;
            } else {
              if (this.minRange[key] > value2 || this.minRange[key] == null) {
                this.minRange[key] = value2;
              }
            }
            //console.log(key, key2, value2);
          }
        }
      }
    });
  }
}

function minDays(date, days) {
  const result = new Date(date);
  result.setTime(result.getTime() - days * 24 * 3600 * 1000);
  return result;
}

function formatDate(date, secondsyes) {
  const result = new Date(date);

  let sec = result.getSeconds();
  let hour = result.getHours();
  let min = result.getMinutes();
  let day = result.getDate();
  let month = result.getMonth() + 1;

  if (sec < 10) sec = `0${sec}`;
  if (hour < 10) hour = `0${hour}`;
  if (min < 10) min = `0${min}`;  
  if (day < 10) day = `0${day}`;
  if (month < 10) month = `0${month}`;

  if (secondsyes) { 
    //console.log(`${result.getFullYear()}-${month}-${day} ${hour}:${min}:${sec}`);
    return `${result.getFullYear()}-${month}-${day} ${hour}:${min}:${sec}`;
  } else {
    //console.log(`${result.getFullYear()}-${month}-${day} 00:00:00`);
    return `${result.getFullYear()}-${month}-${day} 00:00:00`;
  }
}

setInterval(() => {
  const date = new Date();
  if (date.getSeconds() == 2) {
    getLastUpdate();
  }
}, 500)

getLastUpdate();
plot.init();
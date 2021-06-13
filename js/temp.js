const lastUpdateTime = document.querySelector('#lastUpdateTime');
const temp = document.querySelector('#temp');
const humid = document.querySelector('#humid');
const heatIndex = document.querySelector('#heatIndex');

const station = document.querySelector('#station');

const newArrays = {
  date: [],
  temp: [],
  humid: [],
  heatIndex: []
}

function getLastUpdate(uuid) {
  fetch(`${apiHost}/wheater/${uuid}/last`)
  .then(response => response.json())
  .then(result => {
    lastUpdateTime.innerText = `Last Update: ${result.data.date}`;

    temp.innerText = `${result.data.temp.toFixed(2)} °C`;
    humid.innerText = `${result.data.humid.toFixed(2)} %`;
    heatIndex.innerText = `${result.data.heatIndex.toFixed(2)} °C`;
  })
  .catch(err => console.log(err));
}

function getStations() {
  fetch(`${apiHost}/wheater/`)
  .then(r => r.json())
  .then(result => {
    result.stations.forEach(ele => {
      const option = document.createElement('option');
      option.setAttribute('value', ele.uuid);
      option.innerText = `${ele.name} [${ele.city}]`;
      station.appendChild(option);
    })
  });
  station.addEventListener('change', e => {
    plot.uuid = e.target.value;
    getLastUpdate(plot.uuid);
    plot.getData(plot.uuid);
  });
}

const plot = {
  uuid: "26d4f02d-3a00-4d13-971b-f3362c529dec",
  buffer: 5,
  label: {
    temp: 'Temp °C',
    humid: 'Humid %',
    heatIndex: 'HeatIndex °C'
  },
  data: [],
  dataFromDb: {
    hour: [],
    day: [],
    month: []
  },
  update: {
    hour: false
  },
  maxRange: null,
  minRange: null,
  init: function() {
    this.getData(plot.uuid);
  },
  setUpdater: function() {
    this.update.running = true;
    //Get Hour Data
    setInterval(() => {
      const date = new Date();
      if (date.getMinutes() == 1 && this.update.hour == false) {
        this.update.hour = true;
        this.getData(plot.uuid);
      }
      if (date.getMinutes() == 2) {
        this.update.hour = false;
      }
    }, 1000);
  },
  getData: function(uuid) {
    const query = `{
      wheater {
        hour(stationUUID: "${uuid}") {
          date
          temp
          humid
          heatIndex
        }
        day(stationUUID: "${uuid}") {
          date
          temp
          humid
          heatIndex
        }
        month(stationUUID: "${uuid}") {
          date
          temp
          humid
          heatIndex
        }
      }
    }`
    fetch(`${apiHost}/graphql`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({query: query})
    })
    .then(r => r.json())
    .then(result => {
      this.dataFromDb.hour = result.data.wheater.hour;
      this.dataFromDb.day = result.data.wheater.day;
      this.dataFromDb.month = result.data.wheater.month;
      this.makeParse(uuid);
    });
  },
  makeParse: function(uuid) {
    newArrays.date = [];
    newArrays.temp = [];
    newArrays.humid = [];
    newArrays.heatIndex = [];

    this.parse(this.dataFromDb.hour);
    this.parse(this.dataFromDb.day);
    this.parse(this.dataFromDb.month);
    this.makeArray(uuid);
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
          newArrays[key].push(value.toFixed(2))
        }
      }
    });
  },
  makeArray: function(uuid) {
    this.data = [];
    for (const [key, value] of Object.entries(newArrays)) {
      if (key != 'date') {
        this.data.push(this.makeTrace(this.label[key], newArrays.date, newArrays[key]));
      }
    }
    this.getMaxValuesHour();
    this.draw(uuid);
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
  draw: function(uuid) {
    Plotly.newPlot('temps', this.data, {
      title:`Weather Station`,
      xaxis: {
        range: [formatDate(minDays(Date.now(), 6), false), formatDate(Date.now(), true)],
        type: 'date'
      },
      yaxis: {
        range: [(this.minRange - this.buffer), (this.maxRange + this.buffer)],
        title: 'Value'
      }
    }, {responsive: true});
  },
  getMaxValuesHour: function() {
    this.dataFromDb.hour.forEach(ele => {
      for (const [key, value] of Object.entries(ele)) {
        if (typeof value != 'string') {
          if (this.maxRange < value) {
            this.maxRange = value;
          } else {
            if (this.minRange > value || this.minRange == null) {
              this.minRange = value;
            }
          }
          //console.log(key, key2, value2);
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
    getLastUpdate(plot.uuid);
  }
}, 500)

getStations();

getLastUpdate(plot.uuid);
plot.init();
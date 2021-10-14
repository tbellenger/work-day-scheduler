let times = ['7', '8', '9', '10','11','12','13','14','15','16', '17'];

let currentDayEl = $('#currentDay');
let containerEl = $('.container');

let todayLong = moment().format('dddd, MMMM Do YYYY');
let todayShort = moment().startOf('day');
let todayStore = moment().format('YYYYMMDD');

// Utility functions for using Map data structure with JSON
// https://stackoverflow.com/questions/29085197/how-do-you-json-stringify-an-es6-map
function replacer(key, value) {
  if(value instanceof Map) {
    return {
      dataType: 'Map',
      value: Array.from(value.entries()), // or with spread: value: [...value]
    };
  } else {
    return value;
  }
}

function reviver(key, value) {
  if(typeof value === 'object' && value !== null) {
    if (value.dataType === 'Map') {
      return new Map(value.value);
    }
  }
  return value;
}

// this is the data structure that is stored
// it has a map with the date as key and the events as the value
// the events is another map with the time as key and description as value
let data = new Map();
let events = new Map();
data.set(todayStore, events);

let store = JSON.parse(localStorage.getItem('day-schedule'), reviver);

// take the event time and description and add them to the 
// events map inside the value where the key is todays date
// update localstorage with the new data
const saveEntry = function(evtTime, evtDescription) {
    events = store.get(todayStore);
    if (events == null) {
      events = new Map();
    }
    events.set(evtTime, evtDescription);
    store.set(todayStore, events);
    localStorage.setItem('day-schedule', JSON.stringify(store, replacer));
};

// on the button click traverse DOM to find the 
// text area. Use the time stored in the dataset of 
// textarea and the value to save the entry
const saveBtnClickHandler = function() {
  let descEl = $(this).parent().find("textarea");
  saveEntry(descEl.data('time'), descEl.val());
};

// initialize localstorage where it is required and 
// build the page with hours from 7am to 5pm
const init = function() {
  if (store == null) {
    // first use so create empty store object with today
    localStorage.setItem('day-schedule', JSON.stringify(data, replacer));
    store = data;
  } else {
    // find today if there else create today
    if (store.has(todayStore)) {
        events = store.get(todayStore);
    } else {
        store.set(todayStore, events);
    }
  }
  // set title day text
  currentDayEl.text(todayLong);

  // add event handlers
  containerEl.on('click','.saveBtn', saveBtnClickHandler);

  updateContainerContents();


};

const updateContainerContents = function() {
  // empty the container befoer we fill it up
  containerEl.empty();
  // generate the container contents
  for (let i = 0; i < times.length; i++) {
    // check if we stored data in this row
    let contents = '';
    if (events.has(parseInt(times[i]))) {
      console.log('loading data for event' + times[i] + ' from store');
      contents = events.get(parseInt(times[i]));
    }
    let cntTime = moment(parseInt(times[i]),"HH");
    let cntNextTime = moment(parseInt(times[i]) + 1, "HH");
    let category = '';
    if (moment().isBefore(cntTime)) {
        category = "description future";
    } else if (moment().isAfter(cntTime) && moment().isBefore(cntNextTime)) {
        category = "description present";
    } else {
        category = "description past";
    }
    let hourEl = $("<div></div>")
      .addClass('hour')
      .addClass('col-2')
      .css('display', 'flex')
      .css('justify-content', 'center')
      .css('align-items', 'center')
      .text(cntTime.format("hA"));
    let txtAreaEl = $("<textarea>")
      .addClass(category)
      .addClass('col-9')
      .attr('name','desc')
      .attr('cols','100%')
      .attr('rows','3')
      .data('time', parseInt(times[i]))
      .text(contents);
    let btnEl = $("<button></button>")
      .addClass('saveBtn')
      .addClass('col-1')
      .html('&#x1F5AB;');
    let rowEl = $("<div></div>")
      .addClass('row')
      .append(hourEl)
      .append(txtAreaEl)
      .append(btnEl);
    let timeBlckEl = $("<div></div>")
      .addClass('time-block')
      .append(rowEl);
    containerEl.append(timeBlckEl);
  }

  // redraw the container contents at the next hour mark to move
  // 'now' box forward
  // calculate the millis until the next hour and add 1 second
  setInterval(updateContainerContents,
    moment().endOf('hour').format('x') - moment().format('x') + 1000);
};

init();
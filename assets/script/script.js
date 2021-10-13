let times = ['7', '8', '9', '10','11','12','13','14','15','16', '17'];

let currentDayEl = $('#currentDay');
let containerEl = $('.container');

let todayLong = moment().format('dddd, MMMM Do YYYY');
let todayShort = moment().startOf('day');
let todayStore = moment().format('YYYYMMDD');
console.log(todayShort.toString());

// Utility functions for using Map data structure with JSON
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


let data = new Map();
let events = new Map();
data.set(todayStore, events);
console.log(JSON.stringify(data, replacer));

let store = JSON.parse(localStorage.getItem('day-schedule'), reviver);

const saveEntry = function(evtTime, evtDescription) {
    events = store.get(todayStore);
    if (events == null) {
        events = new Map();
    }
    events.set(evtTime, evtDescription);
    store.set(todayStore, events);
    localStorage.setItem('day-schedule', JSON.stringify(store, replacer));
    console.log('Saving- Time:' + evtTime + '/Description:' + evtDescription);
};

const saveBtnClickHandler = function() {
    let descEl = $(this).parent().find("textarea");
    saveEntry(descEl.data('time'), descEl.val());
};

const init = function() {
    if (store == null) {
        // first use so create empty store object with today
        localStorage.setItem('day-schedule', JSON.stringify(data, replacer));
        store = data;
    } else {
        // find today if there else create today
        if (store.has(todayStore)) {
            console.log('Store has today store');
            events = store.get(todayStore);
        } else {
            console.log('Adding today store to store');
            store.set(todayStore, events);
        }
    }
    // set title day text
    currentDayEl.textcontent = todayLong;

    // generate the container contents
    for (let i = 0; i < times.length; i++) {
        // check if we stored data in this row
        let contents = '';
        if (events.has(parseInt(times[i]))) {
            console.log('loading data for event' + times[i] + ' from store');
            contents = events.get(parseInt(times[i]));
        }
        let cntTime = moment(times[i],"HH");
        let category = '';
        if (moment().isBefore(cntTime)) {
            category = "class='description future'";
        } else if (moment().isAfter(cntTime)) {
            category = "class='description past'";
        } else {
            category = "class='description present'";
        }
        let hourEl = $("<div class='hour'></div>").text(cntTime.format("hA"));
        let txtAreaEl = $("<textarea " + category + " name='desc' cols='100%' rows='3' data-time='" + times[i] + "'></textarea>").text(contents);
        let btnEl = $("<button class='saveBtn'></button>").text('Save');
        let rowEl = $("<div class='row'></div>").append(hourEl).append(txtAreaEl).append(btnEl);
        let timeBlckEl = $("<div class='time-block'></div>").append(rowEl);
        containerEl.append(timeBlckEl);
    }

    // add event handlers
    containerEl.on('click','.saveBtn', saveBtnClickHandler);
};



init();
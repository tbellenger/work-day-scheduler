let times = ['7', '8', '9', '10','11','12','13','14','15','16', '17'];

let currentDayEl = $('#currentDay');
let containerEl = $('.container');

let todayLong = moment().format('dddd, MMMM Do YYYY');
let todayShort = moment().startOf('day');
console.log(todayShort.toString());

let data = {
    date: todayShort,
    events: [
        {
            time: "7AM",
            desc: "Event description"
        }
    ]
};
let store = JSON.parse(localStorage.getItem('day-schedule'));

const saveBtnClickHandler = (event) => {
    console.log(event);
};

const init = () => {
    if (store == null) {
        // first use so create empty store object
        store = [];
        console.log(data);
        store.push(data);
        localStorage.setItem('day-schedule', JSON.stringify(store));
    }
    // set title day text
    currentDayEl.textcontent = todayLong;

    // generate the container contents
    for (let i = 0; i < times.length; i++) {
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
        let txtAreaEl = $("<textarea " + category + " name='desc' cols='100%' rows='3' data-time='" + times[i] + "'></textarea>").text('Event');
        let btnEl = $("<button class='saveBtn'></button>").text('Save');
        let rowEl = $("<div class='row'></div>").append(hourEl).append(txtAreaEl).append(btnEl);
        let timeBlckEl = $("<div class='time-block'></div>").append(rowEl);
        containerEl.append(timeBlckEl);
    }

    // add event handlers
    containerEl.on('click','.saveBtn', saveBtnClickHandler);
};


init();


let times = ['07:00', '08:00', '09:00', '10:00','11:00','12:00','13:00','14:00','15:00','16:00', '17:00'];

let currentDayEl = $('#currentDay');
let containerEl = $('.container');

let todayLong = moment().format('dddd, MMMM Do YYYY');
let todayShort = moment().format('MM-DD-YYYY');

if (moment().isBefore(todayShort + ' 19:00')) {
    console.log('before 5PM');
} else {
    console.log('after 5PM');
}
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

const init = () => {
    if (store == null) {
        // first use so create empty store object
        store = [];
        console.log(dummyData);
        store.push(JSON.parse(dummyData));
        localStorage.setItem('day-schedule', JSON.stringify(store));
    }
    // set title day text
    currentDayEl.textcontent = todayLong;

    // generate the container contents
    for (let i = 0; i < times.length; i++) {
        let category = '';
        if (moment().isBefore(todayShort + ' ' + times[i])) {
            category = "class='future'";
        } else if (moment().isAfter(todayShort + ' ' + times[i])) {
            category = "class='past'";
        } else {
            category = "class='present'";
        }
        let hourEl = $("<div class='hour'></div>").text(times[i]);
        let txtAreaEl = $("<textarea " + category + " name='desc' id='description' cols='100%' rows='3'></textarea>").text('Event');
        let btnEl = $("<button class='saveBtn'></button>").text('Save');
        let rowEl = $("<div class='row'></div>").append(hourEl).append(txtAreaEl).append(btnEl);
        let timeBlckEl = $("<div class='time-block'></div>").append(rowEl);
        containerEl.append(timeBlckEl);
    }

};


init();


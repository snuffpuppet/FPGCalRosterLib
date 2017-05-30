function ASSERT_TRUE(test, warning) {
  if (!test)
    throw warning;
}

function getCalendarEvents(calendarName, startTime, endTime) {
  var calendars = CalendarApp.getCalendarsByName(calendarName);
  ASSERT_TRUE(calendars.length == 1, calendars.length + " calendars found for '" + calendarName + "'");

  var events = calendars[0].getEvents(startTime, endTime);
  ASSERT_TRUE(events != null, "Problem retrieving shifts from " + startTime.getDate() + "/" + startTime.getMonth() + " to " + endTime.getDate() + "/" + endTime.getMonth());
  ASSERT_TRUE(events.length > 0, "No shifts found from " + startTime.getDate() + "/" + startTime.getMonth() + " to " + endTime.getDate() + "/" + endTime.getMonth());
  
  return events;
}


function extractShiftsFromCalendars(calendarNames, startTime, endTime) { 
  var r;
  
  shifts = calendarNames.reduce(function(acc, x) {
    return acc.concat(calendarShifts(getCalendarEvents(x, startTime, endTime)));
  }, []);
  
  shifts.sort(function(x, y) { return x.isValid ? (x.employeeName < y.employeeName ? -1 : 1) : 1; });  
  
  r = {shifts: _._filter(shifts, function (x) { return x.isValid; }),
       warnings: _._filter(shifts, function (x) { return !x.isValid; })
      };

  Object.freeze(r);
  return r;
}

function employeeScheduleList(payBrackets, shifts) {
  return shifts.reduce(function(acc, x) { 
    if (acc.length === 0 || acc[acc.length-1] !== x.employeeName) {
      acc[acc.length] = x.employeeName;
    }
    return acc;
  }, []);
}

function rosterTable(title, calendarNames, startTime, endTime) { 
  var extract, table, renderer;
  var vertAxis, hozAxis;
  
  var keyGenerator = function(shift) { return shift.employeeName; };
  var renderer = function(shift) { return shift.duration; };
  
  extract = extractShiftsFromCalendars(calendarNames, startTime, endTime);
  
  vertAxis = contentAxis("Employee", extract.shifts, keyGenerator);
  hozAxis = dateAxis("Date", startTime, endTime, function(shift) { return shift.startTime; });

  table = objectTable(title, hozAxis, vertAxis, renderer, extract.shifts);
  
  return table;
}

function payrollTable(title, calendarNames, startTime, endTime) {
  var table, extract;
  var hozAxis, vertAxis;
  var payBrackets = [range(0,7), range(7,19), range(19,24)];
  var payBracketLabels = ["<00:00 - 07:00>", "<07:00 - 19:00>", "<19:00 - 24:00>"];
  //  payBrackets: shiftPaySchedules(startTime, endTime)};
  
  var shiftPaySchedules = function(startTime, endTime, payBrackets) {
    //var analyser = rangeOverlapAnalyser();
    var shiftRange = range(startTime.getHours() + startTime.getMinutes() / 60, 
      endTime.getHours() + endTime.getMinutes() / 60);
  
    return multiRangeOverlaps(shiftRange, payBrackets);
  };

  extract = extractShiftsFromCalendars(calendarNames, startTime, endTime);
  //shifts = _._map(extract.shifts, function(x) { x.schedule = shiftPaySchedules(x.startTime, x.endTime, payBrackets); return x; });
  
  var keyGenerator = function(shift) { return shift.employeeName; };
  var subKeyGenerator = function(shift) { return payBracketLabels; };
  var renderer = function(shift) { return _._pluck(shiftPaySchedules(shift.startTime, shift.endTime, payBrackets), "amount"); };
  
  vertAxis = contentAxis("Employee", extract.shifts, keyGenerator, subKeyGenerator);
  hozAxis = dateAxis("Date", startTime, endTime, function(shift) { return shift.startTime; });

  table = objectTable(title, hozAxis, vertAxis, renderer, extract.shifts);
  
  return table;
}
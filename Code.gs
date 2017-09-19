function rosterTable(title, calendarNames, startTime, endTime) { 
  var extract, roster, renderer, table;
  var vertAxis, hozAxis;
  
  var keyGenerator = function(shift) { return shift.employeeName; };
  var renderer = function(shift) { return Math.round(shift.paidHours*100)/100; };
  
  extract = extractShiftsFromCalendars(calendarNames, startTime, endTime);
  
  vertAxis = contentAxis("Employee", extract.shifts, keyGenerator);
  hozAxis = dateAxis("Date", startTime, endTime, function(shift) { return shift.startTime; });

  table = objectTable(title, hozAxis, vertAxis, renderer, extract.shifts);
    
  roster = { 
    title: table.title,
    data: table.data,
    height: table.height,
    width: table.width,
    headerSize: table.headerSize,
    hozAxis: table.hozAxis,
    vertAxis: table.vertAxis,
    table: table.table,
    warnings: extract.warnings,
  };
  
  return roster;
}

function payrollTable(title, calendarNames, startTime, endTime) {
  var payroll, extract, table;
  var hozAxis, vertAxis;
  var payBrackets = [range(0,7), range(7,19), range(19,24)];
  var payBracketLabels = ["0am -> 7am", "7am -> 7pm", "7pm -> 0pm"];
  //  payBrackets: shiftPaySchedules(startTime, endTime)};
  
  extract = extractShiftsFromCalendars(calendarNames, startTime, endTime);
  
  var keyGenerator = function(shift) { return shift.employeeName; };
  var subKeyGenerator = function(shift) { return payBracketLabels; };
  var renderer = function(shift) { return _._pluck(shiftPaySchedules(shift, payBrackets), "amount"); };
  
  vertAxis = contentAxis("Employee", extract.shifts, keyGenerator, subKeyGenerator);
  hozAxis = dateAxis("Date", startTime, endTime, function(shift) { return shift.startTime; });

  table = objectTable(title, hozAxis, vertAxis, renderer, extract.shifts);
  
  payroll = {
    title: table.title,
    data: table.data,
    height: table.height,
    width: table.width,
    headerSize: table.headerSize,
    hozAxis: table.hozAxis,
    vertAxis: table.vertAxis,
    table: table.table,
    warnings: extract.warnings,
  };
  
  return payroll;
}

function shiftPaySchedules(shift, payBrackets) {
  // return a list of ranges that the shift spans
  // round the numbers to 2 decimal places
  // Aggregate numbers to middle span if the day is a Sunday
  var shiftRange = range(shift.startTime.getHours() + shift.startTime.getMinutes() / 60, 
    shift.endTime.getHours() + shift.endTime.getMinutes() / 60);
  var ov = multiRangeOverlaps(shiftRange, payBrackets);
  
  // apply break to 2nd pay bracket
  ov[1] = rangeOverlap(ov[1].range, ov[1].amount - shift.shiftBreak);
  
  // if weekend, no splitting required, can just use the middle shift
  if (shift.startTime.getDay() == 0 || shift.startTime.getDay() == 6) {
    var total = ov.reduce(function(acc, x) { return acc + x.amount; }, 0);
    ov[0] = rangeOverlap(ov[0].range, 0);
    ov[1] = rangeOverlap(ov[1].range, total);
    ov[2] = rangeOverlap(ov[2].range, 0);
  }
  
  // round values to nearest 100th of an hour
  var ovr = ov.reduce(function(acc, x) {
    acc[acc.length] = rangeOverlap(x.range, Math.round(x.amount*100)/100);
    return acc;
  }, []);
  
  return ovr;
}

function getCalendarEvents(calendarName, startTime, endTime) {
  var calendars = CalendarApp.getCalendarsByName(calendarName);
  ASSERT_TRUE(calendars.length == 1, calendars.length + " calendars found for '" + calendarName + "'");

  var events = calendars[0].getEvents(startTime, endTime);
  ASSERT_TRUE(events != null, "Problem retrieving shifts from " + startTime.getDate() + "/" + startTime.getMonth() + " to " + endTime.getDate() + "/" + endTime.getMonth());
  //ASSERT_TRUE(events.length > 0, "No shifts found from " + startTime.getDate() + "/" + startTime.getMonth() + " to " + endTime.getDate() + "/" + endTime.getMonth());
  
  return events;
}


function employeeScheduleList(payBrackets, shifts) {
  return shifts.reduce(function(acc, x) { 
    if (acc.length === 0 || acc[acc.length-1] !== x.employeeName) {
      acc[acc.length] = x.employeeName;
    }
    return acc;
  }, []);
}

function ASSERT_TRUE(test, warning) {
  if (!test)
    throw warning;
}


/*
function payrollData(calendarNames, startTime, endTime, payBrackets) {
  var payroll, extract;
  var hozAxis, vertAxis;
  var payBrackets = [range(0,7), range(7,19), range(19,24)];
  var payBracketLabels = ["<00:00 - 07:00>", "<07:00 - 19:00>", "<19:00 - 24:00>"];
  //  payBrackets: shiftPaySchedules(startTime, endTime)};
  
  var shiftPaySchedules = function(shift, payBrackets) {
    var shiftRange = range(shift.startTime.getHours() + shift.startTime.getMinutes() / 60, 
      shift.endTime.getHours() + shift.endTime.getMinutes() / 60);
    var ov = multiRangeOverlaps(shiftRange, payBrackets);
    
    // apply break to 2nd pay bracket
    ov[1] = rangeOverlap(ov[1].range, ov[1].amount - shift.shiftBreak);
    
    return ov;
  };

  extract = extractShiftsFromCalendars(calendarNames, startTime, endTime);
  
  var keyGenerator = function(shift) { return shift.employeeName; };
  var subKeyGenerator = function(shift) { return payBracketLabels; };
  var renderer = function(shift) { return _._pluck(shiftPaySchedules(shift, payBrackets), "amount"); };
  
  vertAxis = contentAxis("Employee", extract.shifts, keyGenerator, subKeyGenerator);
  hozAxis = dateAxis("Date", startTime, endTime, function(shift) { return shift.startTime; });

  payroll = objectDataGrid('', hozAxis, vertAxis, renderer, extract.shifts);
  
  return payroll;
}
*/



function warning(eventTitle, eventTime, reason) {
  var eventDate = eventTime.getDate() + "/" + (eventTime.getMonth()+1);    
  return "WARNING: Ignoring event '" + eventTitle + "' on " + eventDate + " - " + reason;
}
  
function parseEmployeeName(eventTitle, eventTime) {
  var isValid, warning='', regexResults, r;
  var regex = /^\s*([^ (]*).*/;
  
  regexResults = regex.exec(eventTitle);
  isValid = !(regexResults === null);
  if (isValid) {
    r = { isValid: true, employeeName: regexResults[1] };
  }
  else {
    r = { isValid: false, warning: warning(eventTitle, eventTime, "unusable format") };
  }
  
  Object.freeze(r);
  return r;
}
  
function parseShiftBreak(eventTitle, eventTime) {
  var regexResults, r;
  var shiftBreak;
  var regex = /^\s*[^ (]*\s*\(([^)]*)\).*/;
  
  regexResults = regex.exec(eventTitle);
  
  if (regexResults !== null) {
    if (BunkerUtils.isNumber(regexResults[1])) {
      r = { isValid: true, shiftBreak: (parseInt(regexResults[1],10) / 60)};
    }
    else {
      r = { isValid: false, warning: warning(eventTitle, eventTime, "invalid break format '" + regexResults[1] + "'") };             
    }
  }
  else {
    // no break present, break time is 0
    r = { isValid: true, shiftBreak: 0 };
  }
  
  Object.freeze(r);
  return r;
}
    
function parseShiftTitle(eventTitle, eventTime) {
  var shiftBreak, r;
  var nameResult, breakResult;
  
  nameResult = parseEmployeeName(eventTitle, eventTime);
  breakResult = parseShiftBreak(eventTitle, eventTime);
  
  if (nameResult.isValid && breakResult.isValid) {
    r = { isValid: true, employeeName: nameResult.employeeName, shiftBreak: breakResult.shiftBreak };
  }
  else {
    r = !nameResult.isValid ? nameResult : breakResult;
  }
  
  Object.freeze(r);
  return r;
}

function calendarShift(event) {
  // Check event consistency
  var titleResult, r, dur;
  var eventTitle = event.getTitle();
  var startTime = event.getStartTime();
  var endTime = event.getEndTime();
  
  if (!event.isAllDayEvent()) {
    titleResult = parseShiftTitle(eventTitle, startTime);
    if (titleResult.isValid) {
      dur = (endTime - startTime) / 60 / 60 / 1000;
      r = {isValid: true, 
           employeeName: titleResult.employeeName, 
           shiftBreak: titleResult.shiftBreak, 
           startTime: startTime, 
           endTime: endTime,
           duration: dur,
           paidHours: dur - titleResult.shiftBreak,
          }
    }
    else {
      r = {isValid: false,
           warning: titleResult.warning
          };
    }
  }
  else {
    r = {isValid: false,
         warning: warning(eventTitle, startTime, "found all day event")
        };
  }
  
  Object.freeze(r);
  return r;
}
  
function calendarShifts(calendarEvents) {
  return _._map(calendarEvents, function(x) { 
    return calendarShift(x);
  });
}


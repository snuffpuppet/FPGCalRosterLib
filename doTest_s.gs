function doTests() {
  var TESTS = {
    ranges: function (t) {
      var shifts = [range(5,21), range(18,23), range(9,15), range(-4,3)];
      var paySchedules = [range(0,7), range(7,19), range(19,24)];
      t.expect(JSON.stringify(multiRangeOverlaps(shifts[0], paySchedules)), '[{"range":{"start":0,"end":7},"amount":2},{"range":{"start":7,"end":19},"amount":12},{"range":{"start":19,"end":24},"amount":2}]');
      t.expect(JSON.stringify(multiRangeOverlaps(shifts[1], paySchedules)), '[{"range":{"start":0,"end":7},"amount":0},{"range":{"start":7,"end":19},"amount":1},{"range":{"start":19,"end":24},"amount":4}]');
      t.expect(JSON.stringify(multiRangeOverlaps(shifts[2], paySchedules)), '[{"range":{"start":0,"end":7},"amount":0},{"range":{"start":7,"end":19},"amount":6},{"range":{"start":19,"end":24},"amount":0}]');
      t.expect(JSON.stringify(multiRangeOverlaps(shifts[3], paySchedules)), '[{"range":{"start":0,"end":7},"amount":3},{"range":{"start":7,"end":19},"amount":0},{"range":{"start":19,"end":24},"amount":0}]');
    },
    schedules: function(t) {
      var eventTitles = ["Paddy", "L.Mac(10)", "L-Mac (10)", "Paddy [30]", "Paddy (20)[30]", "Paddy(20)[grinder cleaning]", "Paddy(08)", "Paddy(e6)"];
      var nameResults = ['{"isValid":true,"employeeName":"Paddy"}',
                         '{"isValid":true,"employeeName":"L.Mac"}',
                         '{"isValid":true,"employeeName":"L-Mac"}',
                         '{"isValid":true,"employeeName":"Paddy"}',
                         '{"isValid":true,"employeeName":"Paddy"}',
                         '{"isValid":true,"employeeName":"Paddy"}',
                         '{"isValid":true,"employeeName":"Paddy"}',
                         '{"isValid":true,"employeeName":"Paddy"}'];
      var breakResults =['{"isValid":true,"shiftBreak":0}',
                         '{"isValid":true,"shiftBreak":0.16666666666666666}',
                         '{"isValid":true,"shiftBreak":0.16666666666666666}',
                         '{"isValid":true,"shiftBreak":0}',
                         '{"isValid":true,"shiftBreak":0.3333333333333333}',
                         '{"isValid":true,"shiftBreak":0.3333333333333333}',
                         '{"isValid":true,"shiftBreak":0.13333333333333333}',
                         '{"isValid":false,"warning":"WARNING: Ignoring event \'Paddy(e6)\' on 27/5 - invalid break format \'e6\'"}'];
                         
      var eventTime = new Date(2017, 04, 27);
      var eventTimes = [range(6, 11),       //[new Date(2017, 04, 27, 6, 0, 0), new Date(2017, 04, 27, 11, 0, 0)],
                        range(11, 16),      //new Date(2017, 04, 27, 11, 0, 0), new Date(2017, 04, 27, 16, 0, 0)],
                        range(8.25, 16.5),  //new Date(2017, 04, 27, 8, 15, 0), new Date(2017, 04, 27, 16, 30, 0)]];
                        ];
      var payScheduleResults = ['[{"range":{"start":0,"end":7},"amount":1},{"range":{"start":7,"end":19},"amount":4},{"range":{"start":19,"end":24},"amount":0}]',
                                '[{"range":{"start":0,"end":7},"amount":0},{"range":{"start":7,"end":19},"amount":5},{"range":{"start":19,"end":24},"amount":0}]',
                                '[{"range":{"start":0,"end":7},"amount":0},{"range":{"start":7,"end":19},"amount":8.25},{"range":{"start":19,"end":24},"amount":0}]',
                       ];
      var paySchedules = [range(0,7), range(7,19), range(19,24)];
      
      t.expect(warning('Event Title', eventTime, 'reason'), "WARNING: Ignoring event 'Event Title' on 27/5 - reason");
      eventTitles.forEach(function(x, i) { t.expect(JSON.stringify(parseEmployeeName(x, eventTime)), nameResults[i]); });
      eventTitles.forEach(function(x, i) { t.expect(JSON.stringify(parseShiftBreak(x, eventTime)), breakResults[i]); });
      //eventTimes.forEach(function(x, i) { t.expect(JSON.stringify(rangeOverlaps(x, paySchedules)), payScheduleResults[i]); });
    },
    rosterTable: function(t) {
      var roster = rosterTable("testTable", ['bunkercoffee@gmail.com', 'Bessa Coffee'], new Date(2017,4,29), new Date(2017, 5, 5));
      t.expect(roster.data, '[["-",6.83,5.58,7.5,8.17,"-","-"],[4.83,4.83,7.5,4.83,7.67,"-",4.67],[5.58,5.25,10.08,5.58,5.5,"-","-"],["-","-","-","-","-","-",4.17],["-","-","-","-","-","-",5.58],[9.16,5.58,8.17,4.08,9.25,"-",6.75],[10.08,4.33,5.33,7,4.83,"-","-"],["-","-",7,6.58,7.33,"-",3.83],[8,7,"-",5.17,5.25,"-","-"],[3.5,4,"-",2,"-","-","-"],[6.83,7.83,4.33,4.33,7.83,"-","-"],[7.83,"-","-","-","-","-",4.83],[5.5,"-","-",5.75,"-","-","-"],["-",10.25,6.33,7.25,10.5,"-","-"],[9.33,7.75,7.83,5.33,2.5,"-","-"]]');
      //t.expect(roster.table, '[["","29/5","30/5","31/5","1/6","2/6","3/6","4/6"],["Adam","-",6.83,5.58,7.5,8.17,"-","-"],["Alex",4.83,4.83,7.5,4.83,7.67,"-",4.67],["Alice",5.58,5.25,10.08,5.58,5.5,"-","-"],["Bam","-","-","-","-","-","-",4.17],["Beau","-","-","-","-","-","-",5.58],["Cami",9.16,5.58,8.17,4.08,9.25,"-",6.75],["Ellen",10.08,4.33,5.33,7,4.83,"-","-"],["Emma","-","-",7,6.58,7.33,"-",3.83],["Isaac",8,7,"-",5.17,5.25,"-","-"],["Kate",3.5,4,"-",2,"-","-","-"],["L.Mac",6.83,7.83,4.33,4.33,7.83,"-","-"],["Laura",7.83,"-","-","-","-","-",4.83],["MG",5.5,"-","-",5.75,"-","-","-"],["Min","-",10.25,6.33,7.25,10.5,"-","-"],["Paddy",9.33,7.75,7.83,5.33,2.5,"-","-"]]');
      t.expect(roster.height, 16);
      t.expect(roster.width, 8);
      t.expect(roster.headerSize, 1);
      t.expect(roster.hozAxis, '{"name":"Date","labels":[["29/5"],["30/5"],["31/5"],["1/6"],["2/6"],["3/6"],["4/6"]],"girth":1,"keyIndex":{"29/5":0,"30/5":1,"31/5":2,"1/6":3,"2/6":4,"3/6":5,"4/6":6}}');
      t.expect(roster.vertAxis, '{"name":"Employee","labels":[["Adam"],["Alex"],["Alice"],["Bam"],["Beau"],["Cami"],["Ellen"],["Emma"],["Isaac"],["Kate"],["L.Mac"],["Laura"],["MG"],["Min"],["Paddy"]],"girth":1,"keyIndex":{"Adam":0,"Alex":1,"Alice":2,"Bam":3,"Beau":4,"Cami":5,"Ellen":6,"Emma":7,"Isaac":8,"Kate":9,"L.Mac":10,"Laura":11,"MG":12,"Min":13,"Paddy":14}}');
      t.expect(roster.warnings, '[]');
    },
    payrollTable1: function(t) {
      var payroll = payrollTable("testTable", ['bunkercoffee@gmail.com', 'Bessa Coffee'], new Date(2017,4,29), new Date(2017, 5, 5));
      t.expect(payroll.data, '[["-",1,1.25,0,0.83,"-","-"],["-",5.83,4.33,7.5,7.33,"-","-"],["-",0,0,0,0,"-","-"],[0.5,0,0,0,0,"-",0],[4.33,4.83,7.5,4.83,7.67,"-",4.67],[0,0,0,0,0,"-",0],[1.25,0,1.25,1.25,0,"-","-"],[4.33,5.25,8.83,4.33,5.5,"-","-"],[0,0,0,0,0,"-","-"],["-","-","-","-","-","-",0],["-","-","-","-","-","-",4.17],["-","-","-","-","-","-",0],["-","-","-","-","-","-",0],["-","-","-","-","-","-",5.58],["-","-","-","-","-","-",0],[0.5,1.25,0,1.25,0,"-",0],[8.66,4.33,8.17,2.83,9.25,"-",6.75],[0,0,0,0,0,"-",0],[1.25,0.5,0,0.5,0.5,"-","-"],[8.83,3.83,5.33,6.5,4.33,"-","-"],[0,0,0,0,0,"-","-"],["-","-",0.5,1,0,"-",0],["-","-",6.5,5.58,7.33,"-",3.83],["-","-",0,0,0,"-",0],[0,0.5,"-",0,1.25,"-","-"],[8,6.5,"-",5.17,4,"-","-"],[0,0,"-",0,0,"-","-"],[0,0,"-",0,"-","-","-"],[3.5,4,"-",2,"-","-","-"],[0,0,"-",0,"-","-","-"],[0.5,0,0.5,0.5,0.5,"-","-"],[6.33,7.83,3.83,3.83,7.33,"-","-"],[0,0,0,0,0,"-","-"],[0,"-","-","-","-","-",0],[7.83,"-","-","-","-","-",4.83],[0,"-","-","-","-","-",0],[0,"-","-",0,"-","-","-"],[5,"-","-",5.25,"-","-","-"],[0.5,"-","-",0.5,"-","-","-"],["-",1.25,1,0,1.25,"-","-"],["-",9,5.33,7.25,9.25,"-","-"],["-",0,0,0,0,"-","-"],[1,0,0,0,0,"-","-"],[8.33,7.75,7.83,5.33,2.5,"-","-"],[0,0,0,0,0,"-","-"]]');
      //t.expect(payroll.table, '[["","","29/5","30/5","31/5","1/6","2/6","3/6","4/6"],["Adam","0am -> 7am","-",1,1.25,0,0.83,"-","-"],["","7am -> 7pm","-",5.83,4.33,7.5,7.33,"-","-"],["","7pm -> 0pm","-",0,0,0,0,"-","-"],["Alex","0am -> 7am",0.5,0,0,0,0,"-",0],["","7am -> 7pm",4.33,4.83,7.5,4.83,7.67,"-",4.67],["","7pm -> 0pm",0,0,0,0,0,"-",0],["Alice","0am -> 7am",1.25,0,1.25,1.25,0,"-","-"],["","7am -> 7pm",4.33,5.25,8.83,4.33,5.5,"-","-"],["","7pm -> 0pm",0,0,0,0,0,"-","-"],["Bam","0am -> 7am","-","-","-","-","-","-",0],["","7am -> 7pm","-","-","-","-","-","-",4.17],["","7pm -> 0pm","-","-","-","-","-","-",0],["Beau","0am -> 7am","-","-","-","-","-","-",0],["","7am -> 7pm","-","-","-","-","-","-",5.58],["","7pm -> 0pm","-","-","-","-","-","-",0],["Cami","0am -> 7am",0.5,1.25,0,1.25,0,"-",0],["","7am -> 7pm",8.66,4.33,8.17,2.83,9.25,"-",6.75],["","7pm -> 0pm",0,0,0,0,0,"-",0],["Ellen","0am -> 7am",1.25,0.5,0,0.5,0.5,"-","-"],["","7am -> 7pm",8.83,3.83,5.33,6.5,4.33,"-","-"],["","7pm -> 0pm",0,0,0,0,0,"-","-"],["Emma","0am -> 7am","-","-",0.5,1,0,"-",0],["","7am -> 7pm","-","-",6.5,5.58,7.33,"-",3.83],["","7pm -> 0pm","-","-",0,0,0,"-",0],["Isaac","0am -> 7am",0,0.5,"-",0,1.25,"-","-"],["","7am -> 7pm",8,6.5,"-",5.17,4,"-","-"],["","7pm -> 0pm",0,0,"-",0,0,"-","-"],["Kate","0am -> 7am",0,0,"-",0,"-","-","-"],["","7am -> 7pm",3.5,4,"-",2,"-","-","-"],["","7pm -> 0pm",0,0,"-",0,"-","-","-"],["L.Mac","0am -> 7am",0.5,0,0.5,0.5,0.5,"-","-"],["","7am -> 7pm",6.33,7.83,3.83,3.83,7.33,"-","-"],["","7pm -> 0pm",0,0,0,0,0,"-","-"],["Laura","0am -> 7am",0,"-","-","-","-","-",0],["","7am -> 7pm",7.83,"-","-","-","-","-",4.83],["","7pm -> 0pm",0,"-","-","-","-","-",0],["MG","0am -> 7am",0,"-","-",0,"-","-","-"],["","7am -> 7pm",5,"-","-",5.25,"-","-","-"],["","7pm -> 0pm",0.5,"-","-",0.5,"-","-","-"],["Min","0am -> 7am","-",1.25,1,0,1.25,"-","-"],["","7am -> 7pm","-",9,5.33,7.25,9.25,"-","-"],["","7pm -> 0pm","-",0,0,0,0,"-","-"],["Paddy","0am -> 7am",1,0,0,0,0,"-","-"],["","7am -> 7pm",8.33,7.75,7.83,5.33,2.5,"-","-"],["","7pm -> 0pm",0,0,0,0,0,"-","-"]]');
      t.expect(payroll.height, 46);
      t.expect(payroll.width, 9);
      t.expect(payroll.headerSize, 1);
      t.expect(payroll.hozAxis, '{"name":"Date","labels":[["29/5"],["30/5"],["31/5"],["1/6"],["2/6"],["3/6"],["4/6"]],"girth":1,"keyIndex":{"29/5":0,"30/5":1,"31/5":2,"1/6":3,"2/6":4,"3/6":5,"4/6":6}}');
      t.expect(payroll.vertAxis, '{"name":"Employee","labels":[["Adam","0am -> 7am"],["","7am -> 7pm"],["","7pm -> 0pm"],["Alex","0am -> 7am"],["","7am -> 7pm"],["","7pm -> 0pm"],["Alice","0am -> 7am"],["","7am -> 7pm"],["","7pm -> 0pm"],["Bam","0am -> 7am"],["","7am -> 7pm"],["","7pm -> 0pm"],["Beau","0am -> 7am"],["","7am -> 7pm"],["","7pm -> 0pm"],["Cami","0am -> 7am"],["","7am -> 7pm"],["","7pm -> 0pm"],["Ellen","0am -> 7am"],["","7am -> 7pm"],["","7pm -> 0pm"],["Emma","0am -> 7am"],["","7am -> 7pm"],["","7pm -> 0pm"],["Isaac","0am -> 7am"],["","7am -> 7pm"],["","7pm -> 0pm"],["Kate","0am -> 7am"],["","7am -> 7pm"],["","7pm -> 0pm"],["L.Mac","0am -> 7am"],["","7am -> 7pm"],["","7pm -> 0pm"],["Laura","0am -> 7am"],["","7am -> 7pm"],["","7pm -> 0pm"],["MG","0am -> 7am"],["","7am -> 7pm"],["","7pm -> 0pm"],["Min","0am -> 7am"],["","7am -> 7pm"],["","7pm -> 0pm"],["Paddy","0am -> 7am"],["","7am -> 7pm"],["","7pm -> 0pm"]],"girth":2,"keyIndex":{"Adam":0,"Alex":3,"Alice":6,"Bam":9,"Beau":12,"Cami":15,"Ellen":18,"Emma":21,"Isaac":24,"Kate":27,"L.Mac":30,"Laura":33,"MG":36,"Min":39,"Paddy":42}}');
      t.expect(payroll.warnings, '[]');
    },
    payrollTable2: function(t) {
      var payroll = payrollTable("testTable", ['bunkercoffee@gmail.com'], new Date(2017,7,21), new Date(2017, 8, 3));
      t.expect(payroll.data, '[["-",1,1.25,0,1.25,"-","-","-",0,1.25,0,1.25,"-"],["-",6.33,3.33,7.5,3.83,"-","-","-",7.5,3.33,7.5,3.83,"-"],["-",0,0,0,0,"-","-","-",0,0,0,0,"-"],["-","-","-","-","-","-","-","-",1.25,"-","-","-","-"],["-","-","-","-","-","-","-","-",3.5,"-","-","-","-"],["-","-","-","-","-","-","-","-",0,"-","-","-","-"],["-","-","-","-","-","-",0,"-","-","-","-","-","-"],["-","-","-","-","-","-",4.33,"-","-","-","-","-","-"],["-","-","-","-","-","-",0,"-","-","-","-","-","-"],[1.25,0,1,1,0,"-","-",0,0,1,"-",1,"-"],[2.83,7.5,4.83,4.5,5.5,"-","-",7.5,5,2.83,"-",2.5,"-"],[0,0,0,0,0,"-","-",0,0,0,"-",0,"-"],["-","-","-","-","-","-",0,"-","-","-","-","-","-"],["-","-","-","-","-","-",5.08,"-","-","-","-","-","-"],["-","-","-","-","-","-",0,"-","-","-","-","-","-"],[0,1.25,0,0,1,"-","-",1.25,1,0,1,0,"-"],[8,3.5,8,5,6,"-","-",4.33,5,8,9,9,"-"],[0,0,0,0,0,"-","-",0,0,0,0,0,"-"],[1,"-","-",1.25,1.25,"-",0,1,"-","-",1.25,1.25,"-"],[4.83,"-","-",3.83,3.33,"-",7.75,4.83,"-","-",3.33,8.5,"-"],[0,"-","-",0,0,"-",0,0,"-","-",0,0,"-"],[0,"-","-",0,"-","-","-",0,"-","-",0,"-","-"],[4.25,"-","-",4.75,"-","-","-",3.75,"-","-",4.5,"-","-"],[0,"-","-",0.5,"-","-","-",0,"-","-",1.75,"-","-"],["-",0,"-","-","-","-","-","-",0,"-","-","-","-"],["-",2,"-","-","-","-","-","-",2,"-","-","-","-"],["-",0,"-","-","-","-","-","-",0,"-","-","-","-"],[0,1.25,1.25,"-",0,"-","-",0,"-",1.25,"-","-","-"],[5,3.83,3.83,"-",8.5,"-","-",5,"-",3.83,"-","-","-"],[0,0,0,"-",0,"-","-",0,"-",0,"-","-","-"],[1.25,0,0,1.25,"-","-",0,1.25,1.25,0,1.25,"-","-"],[4.33,5.33,5.33,3.33,"-","-",6,4.66,6.33,5.33,4.83,"-","-"],[0,0,0,0,"-","-",0,0,0,0,0,"-","-"],["-","-","-","-","-","-",0,"-","-","-","-","-","-"],["-","-","-","-","-","-",4.33,"-","-","-","-","-","-"],["-","-","-","-","-","-",0,"-","-","-","-","-","-"],["-","-","-","-","-","-","-","-","-","-","-",0,"-"],["-","-","-","-","-","-","-","-","-","-","-",3.5,"-"],["-","-","-","-","-","-","-","-","-","-","-",0,"-"]]');
      t.expect(payroll.warnings, '[{"isValid":false,"warning":"WARNING: Ignoring event \'Paddy (odd jobs)\' on 24/8 - invalid break format \'odd jobs\'"}]');
    },
    payrollTable3: function(t) {
      var payroll = payrollTable("testTable", ['Heirloom Chocolate'], new Date(2017,7,21), new Date(2017, 8, 3));
      t.expect(payroll.data, '[]');
      t.expect(payroll.warnings, '[{"isValid":false,"warning":"No valid calendar events found in \'Heirloom Chocolate\'"}]');
    },
  };
  /*
  var logger = function(outcome) { 
    SpreadsheetApp.getUi().alert(outcome.toString());
  };
  */
  var UTEST = UTest.initUTest(TESTS);
  
  UTEST('ranges');
  UTEST('schedules');
  UTEST('rosterTable');
  UTEST('payrollTable1');
  UTEST('payrollTable2');
  UTEST('payrollTable3');
}

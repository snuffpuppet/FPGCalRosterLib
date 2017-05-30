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
      t.expect(JSON.stringify(roster.table), '[["","29/5","30/5","31/5","1/6","2/6","3/6","4/6"],["Adam","-",7.5,4.25,8,8,"-","-"],["Alex",5,5,8,5,8,"-",4.5],["Alice",5.75,5,5.75,5.75,5.5,"-","-"],["Bam","-","-","-","-","-","-",4],["Beau","-","-","-","-","-","-",5.75],["Cami",4,5.75,8,4.25,9,"-","-"],["Ellen",5.5,4.5,5.5,7.5,5,"-","-"],["Emma","-","-",7.5,"-",5,"-",4],["Isaac",8,7.5,"-",5,5.25,"-","-"],["Kate",3.5,"-","-","-","-","-","-"],["L.Mac",7.5,8,4.5,4.5,8.5,"-","-"],["Laura",8.333333333333334,"-",5,7,5.75,"-",5],["Louie","-","-","-","-","-","-",7.25],["MG",5.75,"-","-","-","-","-","-"],["Min","-",5.5,7,8,5.5,"-","-"],["Paddy",1,8,5,5.5,"-","-","-"]]');
      t.expect(roster.height, 17);
      t.expect(roster.width, 8);
      t.expect(roster.headerSize, 1);
      t.expect(JSON.stringify(roster.hozAxis), '{"name":"Date","labels":[["29/5"],["30/5"],["31/5"],["1/6"],["2/6"],["3/6"],["4/6"]],"girth":1,"keyIndex":{"29/5":0,"30/5":1,"31/5":2,"1/6":3,"2/6":4,"3/6":5,"4/6":6}}');
      t.expect(JSON.stringify(roster.vertAxis), '{"name":"Employee","labels":[["Adam"],["Alex"],["Alice"],["Bam"],["Beau"],["Cami"],["Ellen"],["Emma"],["Isaac"],["Kate"],["L.Mac"],["Laura"],["Louie"],["MG"],["Min"],["Paddy"]],"girth":1,"keyIndex":{"Adam":0,"Alex":1,"Alice":2,"Bam":3,"Beau":4,"Cami":5,"Ellen":6,"Emma":7,"Isaac":8,"Kate":9,"L.Mac":10,"Laura":11,"Louie":12,"MG":13,"Min":14,"Paddy":15}}');
    },
    payrollTable: function(t) {
      var payroll = payrollTable("testTable", ['bunkercoffee@gmail.com', 'Bessa Coffee'], new Date(2017,4,29), new Date(2017, 5, 5));
      t.expect(JSON.stringify(payroll.table), '[["","","29/5","30/5","31/5","1/6","2/6","3/6","4/6"],["Adam","<00:00 - 07:00>","-",1,1.25,0,1,"-","-"],["","<07:00 - 19:00>","-",6.5,3,8,7,"-","-"],["","<19:00 - 24:00>","-",0,0,0,0,"-","-"],["Alex","<00:00 - 07:00>",0,0,0,0,0,"-",0],["","<07:00 - 19:00>",5,5,8,5,8,"-",4.5],["","<19:00 - 24:00>",0,0,0,0,0,"-",0],["Alice","<00:00 - 07:00>",1.25,0,1.25,1.25,0,"-","-"],["","<07:00 - 19:00>",4.5,5,4.5,4.5,5.5,"-","-"],["","<19:00 - 24:00>",0,0,0,0,0,"-","-"],["Bam","<00:00 - 07:00>","-","-","-","-","-","-",0],["","<07:00 - 19:00>","-","-","-","-","-","-",4],["","<19:00 - 24:00>","-","-","-","-","-","-",0],["Beau","<00:00 - 07:00>","-","-","-","-","-","-",0],["","<07:00 - 19:00>","-","-","-","-","-","-",5.75],["","<19:00 - 24:00>","-","-","-","-","-","-",0],["Cami","<00:00 - 07:00>",0.5,1.25,0,1.25,0,"-","-"],["","<07:00 - 19:00>",3.5,4.5,8,3,9,"-","-"],["","<19:00 - 24:00>",0,0,0,0,0,"-","-"],["Ellen","<00:00 - 07:00>",0,0.5,0,0.5,0.5,"-","-"],["","<07:00 - 19:00>",5.5,4,5.5,7,4.5,"-","-"],["","<19:00 - 24:00>",0,0,0,0,0,"-","-"],["Emma","<00:00 - 07:00>","-","-",0.5,"-",0,"-",2],["","<07:00 - 19:00>","-","-",7,"-",5,"-",2],["","<19:00 - 24:00>","-","-",0,"-",0,"-",0],["Isaac","<00:00 - 07:00>",0,0.5,"-",0,1.25,"-","-"],["","<07:00 - 19:00>",8,7,"-",5,4,"-","-"],["","<19:00 - 24:00>",0,0,"-",0,0,"-","-"],["Kate","<00:00 - 07:00>",0,"-","-","-","-","-","-"],["","<07:00 - 19:00>",3.5,"-","-","-","-","-","-"],["","<19:00 - 24:00>",0,"-","-","-","-","-","-"],["L.Mac","<00:00 - 07:00>",0.5,0,0.5,0.5,0.5,"-","-"],["","<07:00 - 19:00>",7,8,4,4,8,"-","-"],["","<19:00 - 24:00>",0,0,0,0,0,"-","-"],["Laura","<00:00 - 07:00>",0,"-",0,1,1.25,"-",2],["","<07:00 - 19:00>",8.333333333333332,"-",5,6,4.5,"-",3],["","<19:00 - 24:00>",0,"-",0,0,0,"-",0],["Louie","<00:00 - 07:00>","-","-","-","-","-","-",2],["","<07:00 - 19:00>","-","-","-","-","-","-",5.25],["","<19:00 - 24:00>","-","-","-","-","-","-",0],["MG","<00:00 - 07:00>",0,"-","-","-","-","-","-"],["","<07:00 - 19:00>",5.25,"-","-","-","-","-","-"],["","<19:00 - 24:00>",0.5,"-","-","-","-","-","-"],["Min","<00:00 - 07:00>","-",0,1,0,0,"-","-"],["","<07:00 - 19:00>","-",5.5,6,8,5.5,"-","-"],["","<19:00 - 24:00>","-",0,0,0,0,"-","-"],["Paddy","<00:00 - 07:00>",0,0,0,0,"-","-","-"],["","<07:00 - 19:00>",1,8,5,5.5,"-","-","-"],["","<19:00 - 24:00>",0,0,0,0,"-","-","-"]]');
      t.expect(payroll.height, 49);
      t.expect(payroll.width, 9);
      t.expect(payroll.headerSize, 1);
      t.expect(JSON.stringify(payroll.hozAxis), '{"name":"Date","labels":[["29/5"],["30/5"],["31/5"],["1/6"],["2/6"],["3/6"],["4/6"]],"girth":1,"keyIndex":{"29/5":0,"30/5":1,"31/5":2,"1/6":3,"2/6":4,"3/6":5,"4/6":6}}');
      t.expect(JSON.stringify(payroll.vertAxis), '{"name":"Employee","labels":[["Adam","<00:00 - 07:00>"],["","<07:00 - 19:00>"],["","<19:00 - 24:00>"],["Alex","<00:00 - 07:00>"],["","<07:00 - 19:00>"],["","<19:00 - 24:00>"],["Alice","<00:00 - 07:00>"],["","<07:00 - 19:00>"],["","<19:00 - 24:00>"],["Bam","<00:00 - 07:00>"],["","<07:00 - 19:00>"],["","<19:00 - 24:00>"],["Beau","<00:00 - 07:00>"],["","<07:00 - 19:00>"],["","<19:00 - 24:00>"],["Cami","<00:00 - 07:00>"],["","<07:00 - 19:00>"],["","<19:00 - 24:00>"],["Ellen","<00:00 - 07:00>"],["","<07:00 - 19:00>"],["","<19:00 - 24:00>"],["Emma","<00:00 - 07:00>"],["","<07:00 - 19:00>"],["","<19:00 - 24:00>"],["Isaac","<00:00 - 07:00>"],["","<07:00 - 19:00>"],["","<19:00 - 24:00>"],["Kate","<00:00 - 07:00>"],["","<07:00 - 19:00>"],["","<19:00 - 24:00>"],["L.Mac","<00:00 - 07:00>"],["","<07:00 - 19:00>"],["","<19:00 - 24:00>"],["Laura","<00:00 - 07:00>"],["","<07:00 - 19:00>"],["","<19:00 - 24:00>"],["Louie","<00:00 - 07:00>"],["","<07:00 - 19:00>"],["","<19:00 - 24:00>"],["MG","<00:00 - 07:00>"],["","<07:00 - 19:00>"],["","<19:00 - 24:00>"],["Min","<00:00 - 07:00>"],["","<07:00 - 19:00>"],["","<19:00 - 24:00>"],["Paddy","<00:00 - 07:00>"],["","<07:00 - 19:00>"],["","<19:00 - 24:00>"]],"girth":2,"keyIndex":{"Adam":0,"Alex":3,"Alice":6,"Bam":9,"Beau":12,"Cami":15,"Ellen":18,"Emma":21,"Isaac":24,"Kate":27,"L.Mac":30,"Laura":33,"Louie":36,"MG":39,"Min":42,"Paddy":45}}');
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
  UTEST('payrollTable');
}

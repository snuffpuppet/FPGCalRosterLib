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
      t.expect(roster.data, '[["-",6.833333333333333,5.583333333333333,7.500000000000001,8.166666666666668,"-","-"],[4.833333333333333,4.833333333333333,7.5,4.833333333333333,7.666666666666668,"-",4.666666666666666],[5.583333333333333,5.25,10.083333333333334,5.583333333333333,5.5,"-","-"],["-","-","-","-","-","-",4.166666666666666],["-","-","-","-","-","-",5.583333333333333],[3.8333333333333335,5.583333333333333,8.166666666666666,4.083333333333333,9.25,"-",6.75],[5.5,4.333333333333333,5.333333333333333,7,4.833333333333333,"-","-"],["-","-",7,6.583333333333333,7.333333333333333,"-",3.8333333333333335],[8,7,"-",5.166666666666667,5.25,"-","-"],[3.5,4,"-",2,"-","-","-"],[6.833333333333333,7.833333333333333,4.333333333333333,4.333333333333333,7.833333333333333,"-","-"],[7.833333333333334,"-","-","-","-","-",4.833333333333333],[5.5,"-","-",5.75,"-","-","-"],["-",5.5,6.333333333333333,7.25,10.5,"-","-"],[1,7.75,3,5.333333333333333,2.5,"-","-"]]');
      t.expect(roster.table, '[["","29/5","30/5","31/5","1/6","2/6","3/6","4/6"],["Adam","-",6.833333333333333,5.583333333333333,7.500000000000001,8.166666666666668,"-","-"],["Alex",4.833333333333333,4.833333333333333,7.5,4.833333333333333,7.666666666666668,"-",4.666666666666666],["Alice",5.583333333333333,5.25,10.083333333333334,5.583333333333333,5.5,"-","-"],["Bam","-","-","-","-","-","-",4.166666666666666],["Beau","-","-","-","-","-","-",5.583333333333333],["Cami",3.8333333333333335,5.583333333333333,8.166666666666666,4.083333333333333,9.25,"-",6.75],["Ellen",5.5,4.333333333333333,5.333333333333333,7,4.833333333333333,"-","-"],["Emma","-","-",7,6.583333333333333,7.333333333333333,"-",3.8333333333333335],["Isaac",8,7,"-",5.166666666666667,5.25,"-","-"],["Kate",3.5,4,"-",2,"-","-","-"],["L.Mac",6.833333333333333,7.833333333333333,4.333333333333333,4.333333333333333,7.833333333333333,"-","-"],["Laura",7.833333333333334,"-","-","-","-","-",4.833333333333333],["MG",5.5,"-","-",5.75,"-","-","-"],["Min","-",5.5,6.333333333333333,7.25,10.5,"-","-"],["Paddy",1,7.75,3,5.333333333333333,2.5,"-","-"]]');
      t.expect(roster.height, 16);
      t.expect(roster.width, 8);
      t.expect(roster.headerSize, 1);
      t.expect(roster.hozAxis, '{"name":"Date","labels":[["29/5"],["30/5"],["31/5"],["1/6"],["2/6"],["3/6"],["4/6"]],"girth":1,"keyIndex":{"29/5":0,"30/5":1,"31/5":2,"1/6":3,"2/6":4,"3/6":5,"4/6":6}}');
      t.expect(roster.vertAxis, '{"name":"Employee","labels":[["Adam"],["Alex"],["Alice"],["Bam"],["Beau"],["Cami"],["Ellen"],["Emma"],["Isaac"],["Kate"],["L.Mac"],["Laura"],["MG"],["Min"],["Paddy"]],"girth":1,"keyIndex":{"Adam":0,"Alex":1,"Alice":2,"Bam":3,"Beau":4,"Cami":5,"Ellen":6,"Emma":7,"Isaac":8,"Kate":9,"L.Mac":10,"Laura":11,"MG":12,"Min":13,"Paddy":14}}');
    },
    payrollTable: function(t) {
      var payroll = payrollTable("testTable", ['bunkercoffee@gmail.com', 'Bessa Coffee'], new Date(2017,4,29), new Date(2017, 5, 5));
      t.expect(payroll.data, '[["-",1,1.25,0,0.833333333333333,"-","-"],["-",5.833333333333333,4.333333333333333,7.500000000000001,7.333333333333333,"-","-"],["-",0,0,0,0,"-","-"],[0.5,0,0,0,0,"-",0],[4.333333333333333,4.833333333333333,7.5,4.833333333333333,7.666666666666668,"-",4.666666666666667],[0,0,0,0,0,"-",0],[1.25,0,1.25,1.25,0,"-","-"],[4.333333333333333,5.25,8.833333333333332,4.333333333333333,5.500000000000001,"-","-"],[0,0,0,0,0,"-","-"],["-","-","-","-","-","-",0],["-","-","-","-","-","-",4.166666666666667],["-","-","-","-","-","-",0],["-","-","-","-","-","-",0],["-","-","-","-","-","-",5.583333333333333],["-","-","-","-","-","-",0],[0.5,1.25,0,1.25,0,"-",2],[3.3333333333333335,4.333333333333333,8.166666666666664,2.8333333333333335,9.25,"-",4.75],[0,0,0,0,0,"-",0],[0,0.5,0,0.5,0.5,"-","-"],[5.5,3.8333333333333335,5.333333333333333,6.5,4.333333333333333,"-","-"],[0,0,0,0,0,"-","-"],["-","-",0.5,1,0,"-",2],["-","-",6.5,5.583333333333333,7.333333333333333,"-",1.8333333333333333],["-","-",0,0,0,"-",0],[0,0.5,"-",0,1.25,"-","-"],[8,6.5,"-",5.166666666666668,4,"-","-"],[0,0,"-",0,0,"-","-"],[0,0,"-",0,"-","-","-"],[3.5,4,"-",2,"-","-","-"],[0,0,"-",0,"-","-","-"],[0.5,0,0.5,0.5,0.5,"-","-"],[6.333333333333333,7.833333333333333,3.8333333333333335,3.8333333333333335,7.333333333333333,"-","-"],[0,0,0,0,0,"-","-"],[0,"-","-","-","-","-",2],[7.833333333333332,"-","-","-","-","-",2.8333333333333335],[0,"-","-","-","-","-",0],[0,"-","-",0,"-","-","-"],[5,"-","-",5.25,"-","-","-"],[0.5,"-","-",0.5,"-","-","-"],["-",0,1,0,1.25,"-","-"],["-",5.5,5.333333333333333,7.25,9.25,"-","-"],["-",0,0,0,0,"-","-"],[0,0,0,0,0,"-","-"],[1,7.75,3,5.333333333333333,2.5,"-","-"],[0,0,0,0,0,"-","-"]]');
      t.expect(payroll.table, '[["","","29/5","30/5","31/5","1/6","2/6","3/6","4/6"],["Adam","<00:00 - 07:00>","-",1,1.25,0,0.833333333333333,"-","-"],["","<07:00 - 19:00>","-",5.833333333333333,4.333333333333333,7.500000000000001,7.333333333333333,"-","-"],["","<19:00 - 24:00>","-",0,0,0,0,"-","-"],["Alex","<00:00 - 07:00>",0.5,0,0,0,0,"-",0],["","<07:00 - 19:00>",4.333333333333333,4.833333333333333,7.5,4.833333333333333,7.666666666666668,"-",4.666666666666667],["","<19:00 - 24:00>",0,0,0,0,0,"-",0],["Alice","<00:00 - 07:00>",1.25,0,1.25,1.25,0,"-","-"],["","<07:00 - 19:00>",4.333333333333333,5.25,8.833333333333332,4.333333333333333,5.500000000000001,"-","-"],["","<19:00 - 24:00>",0,0,0,0,0,"-","-"],["Bam","<00:00 - 07:00>","-","-","-","-","-","-",0],["","<07:00 - 19:00>","-","-","-","-","-","-",4.166666666666667],["","<19:00 - 24:00>","-","-","-","-","-","-",0],["Beau","<00:00 - 07:00>","-","-","-","-","-","-",0],["","<07:00 - 19:00>","-","-","-","-","-","-",5.583333333333333],["","<19:00 - 24:00>","-","-","-","-","-","-",0],["Cami","<00:00 - 07:00>",0.5,1.25,0,1.25,0,"-",2],["","<07:00 - 19:00>",3.3333333333333335,4.333333333333333,8.166666666666664,2.8333333333333335,9.25,"-",4.75],["","<19:00 - 24:00>",0,0,0,0,0,"-",0],["Ellen","<00:00 - 07:00>",0,0.5,0,0.5,0.5,"-","-"],["","<07:00 - 19:00>",5.5,3.8333333333333335,5.333333333333333,6.5,4.333333333333333,"-","-"],["","<19:00 - 24:00>",0,0,0,0,0,"-","-"],["Emma","<00:00 - 07:00>","-","-",0.5,1,0,"-",2],["","<07:00 - 19:00>","-","-",6.5,5.583333333333333,7.333333333333333,"-",1.8333333333333333],["","<19:00 - 24:00>","-","-",0,0,0,"-",0],["Isaac","<00:00 - 07:00>",0,0.5,"-",0,1.25,"-","-"],["","<07:00 - 19:00>",8,6.5,"-",5.166666666666668,4,"-","-"],["","<19:00 - 24:00>",0,0,"-",0,0,"-","-"],["Kate","<00:00 - 07:00>",0,0,"-",0,"-","-","-"],["","<07:00 - 19:00>",3.5,4,"-",2,"-","-","-"],["","<19:00 - 24:00>",0,0,"-",0,"-","-","-"],["L.Mac","<00:00 - 07:00>",0.5,0,0.5,0.5,0.5,"-","-"],["","<07:00 - 19:00>",6.333333333333333,7.833333333333333,3.8333333333333335,3.8333333333333335,7.333333333333333,"-","-"],["","<19:00 - 24:00>",0,0,0,0,0,"-","-"],["Laura","<00:00 - 07:00>",0,"-","-","-","-","-",2],["","<07:00 - 19:00>",7.833333333333332,"-","-","-","-","-",2.8333333333333335],["","<19:00 - 24:00>",0,"-","-","-","-","-",0],["MG","<00:00 - 07:00>",0,"-","-",0,"-","-","-"],["","<07:00 - 19:00>",5,"-","-",5.25,"-","-","-"],["","<19:00 - 24:00>",0.5,"-","-",0.5,"-","-","-"],["Min","<00:00 - 07:00>","-",0,1,0,1.25,"-","-"],["","<07:00 - 19:00>","-",5.5,5.333333333333333,7.25,9.25,"-","-"],["","<19:00 - 24:00>","-",0,0,0,0,"-","-"],["Paddy","<00:00 - 07:00>",0,0,0,0,0,"-","-"],["","<07:00 - 19:00>",1,7.75,3,5.333333333333333,2.5,"-","-"],["","<19:00 - 24:00>",0,0,0,0,0,"-","-"]]');
      t.expect(payroll.height, 46);
      t.expect(payroll.width, 9);
      t.expect(payroll.headerSize, 1);
      t.expect(payroll.hozAxis, '{"name":"Date","labels":[["29/5"],["30/5"],["31/5"],["1/6"],["2/6"],["3/6"],["4/6"]],"girth":1,"keyIndex":{"29/5":0,"30/5":1,"31/5":2,"1/6":3,"2/6":4,"3/6":5,"4/6":6}}');
      t.expect(payroll.vertAxis, '{"name":"Employee","labels":[["Adam","<00:00 - 07:00>"],["","<07:00 - 19:00>"],["","<19:00 - 24:00>"],["Alex","<00:00 - 07:00>"],["","<07:00 - 19:00>"],["","<19:00 - 24:00>"],["Alice","<00:00 - 07:00>"],["","<07:00 - 19:00>"],["","<19:00 - 24:00>"],["Bam","<00:00 - 07:00>"],["","<07:00 - 19:00>"],["","<19:00 - 24:00>"],["Beau","<00:00 - 07:00>"],["","<07:00 - 19:00>"],["","<19:00 - 24:00>"],["Cami","<00:00 - 07:00>"],["","<07:00 - 19:00>"],["","<19:00 - 24:00>"],["Ellen","<00:00 - 07:00>"],["","<07:00 - 19:00>"],["","<19:00 - 24:00>"],["Emma","<00:00 - 07:00>"],["","<07:00 - 19:00>"],["","<19:00 - 24:00>"],["Isaac","<00:00 - 07:00>"],["","<07:00 - 19:00>"],["","<19:00 - 24:00>"],["Kate","<00:00 - 07:00>"],["","<07:00 - 19:00>"],["","<19:00 - 24:00>"],["L.Mac","<00:00 - 07:00>"],["","<07:00 - 19:00>"],["","<19:00 - 24:00>"],["Laura","<00:00 - 07:00>"],["","<07:00 - 19:00>"],["","<19:00 - 24:00>"],["MG","<00:00 - 07:00>"],["","<07:00 - 19:00>"],["","<19:00 - 24:00>"],["Min","<00:00 - 07:00>"],["","<07:00 - 19:00>"],["","<19:00 - 24:00>"],["Paddy","<00:00 - 07:00>"],["","<07:00 - 19:00>"],["","<19:00 - 24:00>"]],"girth":2,"keyIndex":{"Adam":0,"Alex":3,"Alice":6,"Bam":9,"Beau":12,"Cami":15,"Ellen":18,"Emma":21,"Isaac":24,"Kate":27,"L.Mac":30,"Laura":33,"MG":36,"Min":39,"Paddy":42}}');
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

function objectTable(title, hozAxis, vertAxis, renderer, content) {
  var data = [], r;
    
  initDataGrid(hozAxis, vertAxis, data);
  fillContent(hozAxis, vertAxis, data, content, renderer);
  
  r = {title: title,
       data: data,
       height: data.length + hozAxis.girth,
       width: (data.length > 0 ? data[0].length : 0 )+ vertAxis.girth,
       headerSize: hozAxis.girth,
       hozAxis: hozAxis,
       vertAxis: vertAxis,
       table: renderTable(hozAxis, vertAxis, data),
      };
  Object.freeze(r);
  
  return r;
}

function contentAxis(name, content, keyGenerator, subKeyGenerator) {
  var r;
  var axisInfo;
  
  var keyGrid = function(key, subKeys) {
    return _._map(subKeys, function(x, i) { 
      if (i===0) {
        return [key, x];
      }
      else {
        return ["", x];
      }
    });
  };
  
  axisInfo = content.reduce(function(acc, x) {
    var key = keyGenerator(x);
    if (typeof(acc.index[key]) !== "number") {
      acc.index[key] = acc.labels.length;

      if (typeof(subKeyGenerator) === "function") {
        var keys = keyGrid(key, subKeyGenerator(x));
        keys.reduce(function(acc2, x2) { acc2[acc2.length] = x2; return acc2}, acc.labels);
        //Logger.log("-->psk[%s]", acc);
      }
      else {
        acc.labels[acc.labels.length] = [key];
      }
    }
    return acc;
  }, { labels: [], index: {} });
  
  return tableAxis(name, axisInfo.labels, axisInfo.index, keyGenerator);
}

function dateAxis(name, startTime, endTime, keyGenerator) {
  var labels = dateList(startTime, endTime);
  var index = labels.reduce(function(acc, x, i) { acc[x] = i; return acc }, {});
  var keyTranslator = function(element) {
    var time = keyGenerator(element);
    return time.getDate() + "/" + (time.getMonth() + 1);
  }
  return tableAxis(name, labels, index, keyTranslator);
}

function dateList(startTime, endTime) {
  // return _._times((endTime.getTime()-startTime.getTime())/1000/60/60/24, function(n) { return new Date(startTime,getTime() + (n-1)* 24 * 3600 * 1000) };
  var r = [], t = startTime;
  while (t < endTime) {
    r[r.length] = [t.getDate() + "/" + (t.getMonth() + 1)];
    t = new Date(t.getTime() + 24 * 60 * 60 * 1000);
  }
  return r;
}

/*
function dayAxis(name, startTime, endTime, keyGenerator) {
  // WARNING: using day as an axis key will only work if you have 7 or less elements as they will otherwise not be unique
  var labels = dayList(startTime, endTime);
  var index = labels.reduce(function(acc, x, i) { acc[x] = i; return acc }, {});
  var keyTranslator = function(element) {
    var time = keyGenerator(element);
    return labels[time.getDay()];
  }
  return tableAxis(name, labels, index, keyTranslator);
}
*/
function dayList(startTime, endTime) {
  var days = ["Sun","Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  var r = [], t = startTime;
  while (t < endTime) {
    r[r.length] = [days[t.getDay()]];
    t = new Date(t.getTime() + 24 * 60 * 60 * 1000);
  }
  return r;
}

function tableAxis(name, labelElements, keyIndex, keyGenerator) {
  var r;
  
  r = {name: name,
       labels: labelElements,
       girth: labelElements.length > 0 ? labelElements[0].length : 0,
       keyIndex: keyIndex,
       keyGenerator : keyGenerator
      };
  Object.freeze(r);
  
  return r;
}

function renderTable(hozAxis, vertAxis, data) {
  var table = [];

  initTopRows(hozAxis, vertAxis, table);
  initLeftColumns(hozAxis, vertAxis, table);

  data.reduce(function(acc, x, i) {
    var row = i+hozAxis.girth;
    //var row = acc[i+hozAxis.girth];
    //var newrow = row.concat(x);
    acc[row] = acc[row].concat(x);
    return acc;
  }, table);

  return table;
}
  
function initDataGrid(hozAxis, vertAxis, grid) {
  // pad the left rows to the width of the vertical axis labels
  vertAxis.labels.reduce(function(acc, x, i) { 
    acc[i] = filledArray(hozAxis.labels.length, "-");
    return acc;
  }, grid);
}

function padLeftCols(hozAxis, vertAxis, table) {
  // pad all the left rows to the width of the vertical axis labels
  hozAxis.labels[0].reduce(function(acc, x, i) { 
    acc[i] = filledArray(vertAxis.girth, "");
    return acc;
  }, table);
  
  return table;
}

function initTopRows(hozAxis, vertAxis, table) {
  padLeftCols(hozAxis, vertAxis, table);
  // Render the horizontal axis labels
  hozAxis.labels.reduce(function(acc, x, i) { return initTableHozAxis(acc, i, x); }, table);
}
  
function initTableHozAxis(table, labelsIndex, labels) {
  labels.reduce(function(acc, x, labelsIndex) { 
    acc[labelsIndex] = acc[labelsIndex].concat(x); 
    return acc;
  }, table);
  //table[row] = .concat(gridElements);
  return table;
}
  
function initLeftColumns(hozAxis, vertAxis, table) {
  vertAxis.labels.reduce(function(acc, x) { return initTableRow(hozAxis, acc, x); }, table);
}

function initTableRow(hozAxis, table, leftLabels) {
  table[table.length] = leftLabels; //.concat(_._map(hozAxis.labels, function(x) { return "-"; }));
  return table;
}

function fillContent(hozAxis, vertAxis, grid, content, renderer) {
  content.forEach(function(x) { return setData(grid, x, hozAxis, vertAxis, renderer); }); // Fill Cells
}

function setData(grid, element, hozAxis, vertAxis, renderer) {
  var row = vertAxis.keyIndex[vertAxis.keyGenerator(element)]; // + hozAxis.girth;
  var col = hozAxis.keyIndex[hozAxis.keyGenerator(element)]; // + vertAxis.girth;
  var cellData = renderer(element);
  
  if (Array.isArray(cellData)) {
    cellData.reduce(function(acc, x, i) {
      updateCell(acc, row+i, col, x); //acc[row + i][col] = x;
      return acc;
    }, grid);
  }
  else {
    updateCell(grid, row, col, cellData); //grid[row][col] = cellData;
  }
  
  return grid;
}

function updateCell(grid, row, col, value) {
  if (BunkerUtils.isNumber(grid[row][col])) {
    // already a value there, add this value to it
    grid[row][col] += value;
  }
  else {
    grid[row][col] = value;
  }
}

function setTableCell(table, element, hozAxis, vertAxis, renderer) {
  var row = vertAxis.keyIndex[vertAxis.keyGenerator(element)] + hozAxis.girth;
  var col = hozAxis.keyIndex[hozAxis.keyGenerator(element)] + vertAxis.girth;
  var cellData = renderer(element);
  
  if (Array.isArray(cellData)) {
    cellData.reduce(function(acc, x, i) {
      acc[row + i][col] = x;
      return acc;
    }, table);
  }
  else {
    table[row][col] = cellData;
  }
  
  return table;
}
  
function filledArray(size, x) {
  return Array.apply(null, Array(size)).map(String.prototype.valueOf, x);
}
  

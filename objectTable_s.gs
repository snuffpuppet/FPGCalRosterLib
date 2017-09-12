function tableAxis(name, labelElements, keyIndex, keyGenerator) {
  var r;
  
  r = {name: name,
       labels: labelElements,
       girth: labelElements[0].length,
       keyIndex: keyIndex,
       keyGenerator : keyGenerator
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
  var dateList = function(startTime, endTime) {
    // return _._times((endTime.getTime()-startTime.getTime())/1000/60/60/24, function(n) { return new Date(startTime,getTime() + (n-1)* 24 * 3600 * 1000) };
    var r = [], t = startTime;
    while (t < endTime) {
      r[r.length] = [t.getDate() + "/" + (t.getMonth() + 1)];
      t = new Date(t.getTime() + 24 * 60 * 60 * 1000);
    }
    return r;
  };
  var labels = dateList(startTime, endTime);
  var index = labels.reduce(function(acc, x, i) { acc[x] = i; return acc }, {});
  var keyTranslator = function(element) {
    var time = keyGenerator(element);
    return time.getDate() + "/" + (time.getMonth() + 1);
  }
  return tableAxis(name, labels, index, keyTranslator);
}

function objectTable(title, hozAxis, vertAxis, renderer, content) {
  var data = [], r;
    
  initDataGrid(hozAxis, vertAxis, data);
  fillContent(hozAxis, vertAxis, data, content, renderer);
  
  r = {title: title,
       data: data,
       height: data.length + hozAxis.girth,
       width: data[0].length + vertAxis.girth,
       headerSize: hozAxis.girth,
       hozAxis: hozAxis,
       vertAxis: vertAxis,
       table: renderTable(hozAxis, vertAxis, data),
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
  content.reduce(function(acc, x) { return setDataCell(acc, x, hozAxis, vertAxis, renderer); }, grid); // Fill Cells
}

function setDataCell(grid, element, hozAxis, vertAxis, renderer) {
  var row = vertAxis.keyIndex[vertAxis.keyGenerator(element)]; // + hozAxis.girth;
  var col = hozAxis.keyIndex[hozAxis.keyGenerator(element)]; // + vertAxis.girth;
  var cellData = renderer(element);
  
  if (Array.isArray(cellData)) {
    cellData.reduce(function(acc, x, i) {
      acc[row + i][col] = x;
      return acc;
    }, grid);
  }
  else {
    grid[row][col] = cellData;
  }
  
  return grid;
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
  

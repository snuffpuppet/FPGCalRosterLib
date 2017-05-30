function range(start, end) {
  var r = {start: start, end: end};
  Object.freeze(r);
  return r;
}

function checkRangesOverlap(range1, range2) {
  // ref: https://stackoverflow.com/questions/325933/determine-whether-two-date-ranges-overlap/325964#325964
  return (range1.start < range2.end) && (range1.end > range2.start);
}

function rangeOverlap(range1, range2) {
  var overlapAmount = function(range1, range2) {
    // ref: https://stackoverflow.com/questions/325933/determine-whether-two-date-ranges-overlap/325964#325964
    return Math.min(range1.end - range1.start, 
                    range1.end - range2.start,
                    range2.end - range2.start,
                    range2.end - range1.start
                   );
  };

  return checkRangesOverlap(range1, range2) ? overlapAmount(range1, range2) : 0;
}

function multiRangeOverlaps(range, ranges) {
  // return the result of overlaps between the given ranges against all of ranges in the second argument
  var rangeOverlapResult = function(range, amount) {
    var r = { range: range, amount: amount };
    Object.freeze(r);
    return r;
  };

  return _._map(ranges, function(x) { 
    return rangeOverlapResult(x, rangeOverlap(x, range));
  });
}

// from d3 library: https://github.com/d3/d3-array/blob/master/src/range.js
export function range(start, stop, step) {
  console.log(start, stop, step);
  start = +start, stop = +stop, step = (n = arguments.length) < 2 ? (stop = start, start = 0, 1) : n < 3 ? 1 : +step;

  var i = -1,
    n = Math.max(0, Math.ceil((stop - start) / step)) | 0,
    range = new Array(n);

  while (++i < n) {
    range[i] = start + i * step;
  }

  return range;
}

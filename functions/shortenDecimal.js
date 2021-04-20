function fmtDbl (n, ratioToPct) {
  if (ratioToPct) {n = n * 100}
  var result = Round(n, 2);
  var prefix = ''
  if (result == 0 && n > 0) {
    prefix = '<';
    result = '0.01'
  }
  return prefix + Text(result)
}

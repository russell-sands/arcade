// Format numbers by prefixing
function fmtNum (n) {
  var wholePart = Split(Text(n), '.')[0];
  var digits = Count(wholePart);
  var factor = 1;
  var suffixKey = '0';
  var suffixLookup = {
    '0':'',
    '1':'K',
    '2':'M',
    '3':'B',
    '4':'T'
  };
  if (digits >3 && digits <= 6) {
    factor = 1000;
    suffixKey = 1;
  } else if (digits > 6 && digits <=  9) {
    factor = 1000000;
    suffixKey = 2;
  } else if (digits > 9 && digits <= 12) {
    factor = 1000000000;
    suffixKey = 3
  } else if (digits > 12) {
    factor = 1000000000000;
    suffixKey = 4
  }
  var factored = Round(Number(wholePart) / factor, 1);
  // Handle when "round up" pushes us to another scale
  if (factored >= 1000) {
    suffixKey += 1;
    factored = Round(factored / 1000, 1);
  }
  // Get the output
  var output = '';
  if (factored < 1) {
    output = '<1';
  } else {
    output = Text(factored) + suffixLookup[Text(suffixKey)];
  }
  return output
}

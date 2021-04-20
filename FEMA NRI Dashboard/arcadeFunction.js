/////////////////////////////////////////////////////////
//// 'attributes' VARIABLE THAT GOES INTO THE RETURN ////
/////////////////////////////////////////////////////////

var attributes = {};

////////////////////////////////////////////////
///// CONFIG "BIG" OVERALL RISK CARD AT TOP ////
////////////////////////////////////////////////

// Overall risk rating
var rating = $datapoint['risk_ratng']


// Default and selected values
var labelDefault = '&nbsp;';
var widthDefault = '17%';
var widthMatched = '32%';
var heightDefault = '0.8rem';
var heightMatched = '1.7rem'

// The values we're going to look for. 
// Spaces are allowed in expression vars
var allowedValues = [
    'Very High',
    'Relatively High',
    'Relatively Moderate',
    'Relatively Low',
    'Very Low'
];

//////////////////////////////////////////
//// CONFIG FOR INDIVIDUAL RISK CARDS ////
//////////////////////////////////////////

// Base portion of risk field names
var varsBase = [
  'avln', 'cfld', 'cwav', 'drgt',
  'erqk', 'hail', 'hrcn', 'hwav',
  'istm', 'lnds', 'wntw', 'ltng',
  'rfld', 'swnd', 'trnd', 'tsun',
  'vlcn', 'wfir']


// Only a few risks have aggriculture exposure
var agVarsBase = [
  'cwav', 'drgt', 'hail', 'rfld',
  'swnd'];
    
// Drought does not have population exposure
// - Only one for now, but for clarity in the function and potential future
//   adaption store as array
var agOnlyBase = ['drgt',]

// Percent variable name sufixes
var pctVarSuffixes = {
  'agriculture': ['hlra'], 
  'generic': [], // Placeholder for consistency
  'popAndBldg' : ['hlrp', 'hlrb'] 
};

// Numeric variable name suffixes
var numVarSuffixes = {
  'agriculture': ['expa', 'eala'],
  'generic': ['evnts'],
  'popAndBldg': [
    'expp', 'exppe', 'expb', 'ealp',
    'ealpe', 'ealb'
  ]
};

// Double value fields
var dblVarsSuffixes = ['afreq']

// The color that each rating should be
var individualRatingAttribtes = {
    'Very High':{
        bgColor: '#c7445d',
        color: 'white',
        order: '1',
        display: 'block'
      },
    'Relatively High':{
        bgColor: '#e07069',
        color: 'white',
        order: '2',
        display: 'block'
      },
    'Relatively Moderate':{
        bgColor: '#f0d55d',
        color: 'black',
        order: '3',
        display: 'block'
      },
    'Relatively Low':{
        bgColor: '#509bc7',
        color: 'white',
        order: '4',
        display: 'block'
      },
    'Very Low':{
        bgColor: '#4d6dbd',
        color: 'white',
        order: '5',
        display: 'block'
      },
    'Insufficient Data':{
        bgColor: '#ffffff',
        color: 'black',
        order: '6',
        display: 'none'
      },
    'Not Applicable':{
        bgColor: '#ffffff',
        color: 'black',
        order: '7',
        display: 'none'
      },
    'No Rating':{
        bgColor: '#ffffff',
        color: 'black',
        order: '8',
        display: 'none'
      },
}

///////////////////
//// Functions ////
///////////////////

// Format percents and handle very tiny precents
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
    // Max out at 4
    suffixKey = Min(4, suffixKey + 1);
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

// Get the units for the annual frequency as well as whether or not to display them
function getFreqLabeling(base) {
  var noEvents = ['clfd', 'erqk', 'wfir'];
  var distinct = [
    'avln', 'hrcn', 'lnds', 'ltng',
    'rfld', 'trnd', 'tsun', 'vlcn',];
  var eventday = [
    'cwav', 'drgt', 'hail', 'hwav',
    'istm', 'swind', 'wntw',];
  var output = {}
  if (Includes(noEvents, base)) {
    output.frqDisplay = 'none';
    output.frqUnits = 'XXXX'
  }
  if (Includes(distinct, base)) {
    output.frqDisplay = 'inline';
    output.frqUnits = 'events'; 
  }
  if (Includes(eventday, base)) {
    output.frqDisplay = 'inline';
    output.frqUnits = 'event days';
  }
  return output;
}

/////////////////////////////////////////////////////////////
//// GET THE ATTRIBUTES NEEDED FOR THE OVERALL RISK CARD ////
/////////////////////////////////////////////////////////////


for (var index in allowedValues) {
  var value = allowedValues[index]
  if (rating != value) {
      attributes[value + ' label'] = labelDefault
      attributes[value + ' width'] = widthDefault
      attributes[value + ' height'] = heightDefault
      
  } else {
      attributes[value + ' label'] = rating
      attributes[value + ' width'] = widthMatched
      attributes[value + ' height'] = heightMatched
  }
}

/////////////////////////////////////////////////////////////////
//// GET THE ATTRIBUTES NEEDED FOR THE INDIVIDUAL RISK CARDS ////
/////////////////////////////////////////////////////////////////

for (var index in varsBase) {
    // Retrieve the basename for the risk's fields
    var base = varsBase[index];

    //// Get any attributes that depend on the Risk rating ////
    var ratingField = base + '_riskr'
    var value = $datapoint[ratingField];
    
    // Handle nulls
    if (IsEmpty(value)) {value = 'No Rating'}
    var ratingAttributes = individualRatingAttribtes[value]
    attributes[ratingField + '_value'] = value
    for (var attr in ratingAttributes) {
      attributes[ratingField + '_' + attr] = ratingAttributes[attr]
    }

    //// Compute information related to event frequency ////
    // The event frequency is either distinct events, event days, or none
    var freqFormatAttributes = getFreqLabeling(base)
    for (var attr in freqFormatAttributes) {
      attributes[base + '_' + attr] = freqFormatAttributes[attr];
    }
    
    //// Format decimal fields ////
    for (var i in dblVarsSuffixes) {
      var dblVar = base + '_' + dblVarsSuffixes[i]
      attributes[dblVar] = fmtDbl($datapoint[dblVar], false);
    }

    //// Format the common number and percent fields ////
    for (var i in pctVarSuffixes.generic) {
      var fmtField = base + '_' + pctVarSuffixes.generic[i];
      attributes[fmtField] = fmtDbl($datapoint[fmtField], true);
    }
    for (var i in numVarSuffixes.generic) {
      var fmtField = base + '_' + numVarSuffixes.generic[i];
      attributes[fmtField] = fmtNum($datapoint[fmtField]);
    }

    //// Format and determine display of population and building variables ////
    if (Includes(agOnlyBase, base)) {
      attributes[base +'_popDisplay'] = 'display:none;'
    } else {
      attributes[base +'_popDisplay'] = ''
      // Get and format the data
      for (var i in pctVarSuffixes.popAndBldg) {
        var fmtField = base + '_' + pctVarSuffixes.popAndBldg[i];
        attributes[fmtField] = fmtDbl($datapoint[fmtField], true)
      }
      for (var i in numVarSuffixes.popAndBldg) {
        var fmtField = base + '_' + numVarSuffixes.popAndBldg[i];
        attributes[fmtField] = fmtNum($datapoint[fmtField]);
      }
    }

    //// Format and destermine the display of the aggriculture variables ////
    if (Includes(agVarsBase, base)) {
      attributes[base + '_agDisplay'] = ''
      for (var i in pctVarSuffixes.agriculture) {
        var fmtField = base + '_' + pctVarSuffixes.agriculture[i];
        attributes[fmtField] = fmtDbl($datapoint[fmtField], true)
      }
      for (var i in numVarSuffixes.agriculture) {
        var fmtField = base + '_' + numVarSuffixes.agriculture[i];
        attributes[fmtField] = fmtNum($datapoint[fmtField]);
      }
    } else {
      attributes[base + '_agDisplay'] = 'display:none;';
    }
}

return {
  textColor: '',
  backgroundColor: '#e7e7e7',
  separatorColor:'#e7e7e7',
  selectionColor: '#e7e7e7',
  selectionTextColor: '',
  attributes
}

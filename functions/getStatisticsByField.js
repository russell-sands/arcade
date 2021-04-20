//Distinguish between NULL counts and No counts
function handleNull(value) {
    if (value == NULL) {
        var result = "Null data for";
    } else {
        var result = TEXT(value);
    }
    return result;
}

// Write the summary line with some attractive text
function summaryLine(type, type_count) {
    var isAre = WHEN(type_count > 1, "are", "is");
    var suffix = When(type_count > 1, "s", "");
    return Concatenate(["There", isAre, type_count, type], " ") + suffix + " in this area with:";
}

// Do the overal summarization and generate the popup text
function summarize(withinFeature, featureSet, groupByField, summaryFieldMap) {
    // Get the features within the polygon
    var interesectingFeatures = Intersects(withinFeature, featureSet);
    // Construct the summary information that we need for GroupBy
    var groupBySummaryInfo = [{name:"count", expression:groupByField, statistic:"COUNT"}];
    for (var k in summaryFieldMap) {
        var expr = summaryFieldMap[k]["expression"];
        var stat = summaryFieldMap[k]["statistic"];
        groupBySummaryInfo[Count(groupBySummaryInfo)] = {name:k, expression:expr, statistic:stat};
    }

    var interesectingFeatures_stastics = GroupBy(interesectingFeatures, groupByField, groupBySummaryInfo);

    var output = "";
    if (Count(interesectingFeatures_stastics) == 0) {
        output += "No locations found in this area.";
    } else {
        for (var data in interesectingFeatures_stastics) {
            // Start with text about the summary type and count
            var groupBy_type = data[groupByField];
            var groupBy_type_count = data["count"];
            output += summaryLine(groupBy_type, groupBy_type_count);
            // Then add the summarized information
            for (var k in summaryFieldMap) {
                var stat = summaryFieldMap[k]["statistic"];
                var decoration = summaryFieldMap[k]["decoration"];
                var this_value = handleNull(data[k]);
                output += Concatenate(["\n -", this_value, decoration], " ");
            }
            output += "\n\n"
        }
    }

    return output;
}

//// Setup parameters that the function needs to run. /////

// A feature set to get the summary information from. Refer to the feature set documentation for more information
var featuresToSummarize = FeatureSetByName($map,"Layer Name in Map");

// What field should the summary results be broken out by? This should be a field in featuresToSummarize
var featuresToSummarize_groupByField = "Group_By_Field_Name";

// DICT of fields with the statistic and some text that will appear with the output
// summarize() will always get COUNT as an output.
// Field names come from featuresToSummarize
var featuresToSummarize_summaryFieldMap = {
    "SUMMARY_NAME": { // Not exposed in popup. Must be unique
        "expression":"Field1", // Refer to GroupBy Dumentation, FIELD name or SQL Query
        "statistic": "SUM", //Refer to GroupBy Documentation for supported statistics
        "decoration": "Summary 1 Decoration" // This text will be placed after the statistic in the popup
    },
    "SUMMARY_NAME_2": { // Not exposed in popup. Must be unique
        "expression":"Field2 * Field3", // Refer to GroupBy Dumentation, FIELD name or SQL Query
        "statistic": "SUM", //Refer to GroupBy Documentation for supported statistics
        "decoration": "Summary 2 Decoration" // This text will be placed after the statistic in the popup
    },

};

summarize($feature, featuresToSummarize, featuresToSummarize_groupByField, featuresToSummarize_summaryFieldMap);

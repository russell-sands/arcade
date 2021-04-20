function ordinalText (n, flavor) {
    var asStr = TEXT(n);
    var lastChar = RIGHT(asStr, 1);
    if (asStr == "1" && flavor != "") {
        asStr = flavor;
    } else if (lastChar == "1") {
        asStr += "st" + flavor;
    } else if (lastChar == "2") {
        asStr += "nd" + flavor;
    } else if (lastChar == "3") {
        asStr += "rd" + flavor;
    } else {
        asStr += "th" + flavor;
    }
    return asStr;
}

ordinalText(1, "")

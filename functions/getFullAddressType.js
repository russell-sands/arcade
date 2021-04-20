function getAddrTypeDescription (addr_type) {
    var subaddress = "A subset of a PointAddress that represents a house or building subaddress location, such as an apartment unit, floor, or individual building within a complex. The UnitName, UnitType, LevelName, LevelType, BldgName, and BldgType field values help to distinguish subaddresses which may be associated with the same PointAddress. Reference data consists of point features with associated house number, street name, and subaddress elements, along with administrative divisions and optional postal code; for example, 3836 Emerald Ave, Suite C, La Verne, CA, 91750.";

    var pointaddress = "A street address based on points that represent house and building locations. Typically, this is the most spatially accurate match level. Reference data contains address points with associated house numbers and street names, along with administrative divisions and optional postal code. The X / Y and geometry output values for a PointAddress match represent the street entry location for the address; this is the location used for routing operations. The DisplayX and DisplayY values represent the rooftop, or actual, location of the address. Example: 380 New York St, Redlands, CA, 92373.";

    var streetaddress = "A street address that differs from PointAddress because the house number is interpolated from a range of numbers. Reference data contains street center lines with house number ranges, along with administrative divisions and optional postal code information, for example, 647 Haight St, San Francisco, CA, 94117.";

    var streetint = "A street address consisting of a street intersection along with city and optional state and postal code information. This is derived from StreetAddress reference data, for example, Redlands Blvd & New York St, Redlands, CA, 92373.";

    var streetaddressext = "An interpolated street address match that is returned when parameter matchOutOfRange=true and the input house number exceeds the house number range for the matched street segment.";

    var distancemarker = "A street address that represents the linear distance along a street, typically in kilometers or miles, from a designated origin location. Example: Carr 682 KM 4, Barceloneta, 00617.";

    var streetname = "Similar to a street address but without the house number. Reference data contains street centerlines with associated street names (no numbered address ranges), along with administrative divisions and optional postal code, for example, W Olive Ave, Redlands, CA, 92373.";

    var locality = "A place-name representing a populated place. The Type output field provides more detailed information about the type of populated place. Possible Type values for Locality matches include Block, Sector, Neighborhood, District, City, MetroArea, County, State or Province, Territory, Country, and Zone. Example: Bogotá, COL";

    var postalloc = "A combination of postal code and city name. Reference data is typically a union of postal boundaries and administrative (locality) boundaries, for example, 7132 Frauenkirchen.";

    var postalext = "A postal code with an additional extension, such as the United States Postal Service ZIP+4. Reference data is postal code points with extensions, for example, 90210-3841.";

    var postal = "Postal code. Reference data is postal code points, for example, 90210 USA.";

    var poi = "Points of interest. Reference data consists of administrative division place-names, businesses, landmarks, and geographic features, for example, Starbucks.";

    var latlong = "An x/y coordinate pair. The LatLong addr_type is returned when an x/y coordinate pair, such as 117.155579,32.703761, is the search input.";

    var xy_xy = "XY—XY is the match based on the assumption that the first coordinate of the input is longitude and the second is latitude.";

    var yx_yx = "YX—YX is returned as Addr_type for the candidate which assumes that latitude is the first number in the input, followed by longitude.";

    var mgrs = "A Military Grid Reference System (MGRS) location, such as 46VFM5319397841.";

    var usng = "A United States National Grid (USNG) location, such as 15TXN29753883. This Addr_type value is only returned when the category parameter is set to USNG in a findAddressCandidates or geocodeAddresses request.";

    return WHEN(addr_type == "Subaddress", subaddress, 
                addr_type == "PointAddress", pointaddress,
                addr_type == "StreetAddress", streetaddress,
                addr_type == "StreetInt", streetint,
                addr_type == "StreetAddressExt", streetaddressext,
                addr_type == "DistanceMarker", distancemarker,
                addr_type == "StreetName", streetname,
                addr_type == "Locality", locality,
                addr_type == "PostalLoc", postalloc,
                addr_type == "PostalExt", postalext,
                addr_type == "Postal", postal,
                addr_type == "POI", poi,
                addr_type == "LatLong", latlong,
                addr_type == "XY-XY", xy_xy,
                addr_type == "YX-YX", yx_yx,
                addr_type == "MGRS", mgrs,
                addr_type == "USNG", usng,
                "Unnexpected addr_type " + addr_type
                )
}

getAddrTypeDescription($feature.Addr_type)

import React, {Component} from "react";
import {Marker} from "react-leaflet";
import {
    UW_LATITUDE,
    UW_LATITUDE_OFFSET,
    UW_LATITUDE_SCALE,
    UW_LONGITUDE,
    UW_LONGITUDE_OFFSET,
    UW_LONGITUDE_SCALE
} from "./Constants";
import L from "leaflet"
import img from "./location.png"

// custom icon with specified image and size
let customIcon = L.icon({iconUrl: img, iconSize: [32, 32]})

interface MapPointProps {
    x: number; // x coordinate of the point
    y: number; // y coordinate of the point
}


/**
 * Converts x coordinate to longitude
 */
function xToLon(x: number): number {
    return UW_LONGITUDE + (x - UW_LONGITUDE_OFFSET) * UW_LONGITUDE_SCALE;
}

/**
 * Converts y coordinate to latitude
 */
function yToLat(y: number): number {
    return UW_LATITUDE + (y - UW_LATITUDE_OFFSET) * UW_LATITUDE_SCALE;
}

/**
 * A component that will render a point on the React Leaflet map of
 * point x, y. This line will convert from the assignment's coordinate
 * system (where 0,0 is the top-left of the UW campus) to latitude and
 * longitude, which the React Leaflet map uses
 */
class MapPoint extends Component<MapPointProps, {}> {
    constructor(props: any) {
        super(props);
        this.state = {
            edgeText: "",
        };
    }

    render() {
        return (
            // mark the point with the custom symbol
            <Marker
                icon={customIcon}
                position={[yToLat(this.props.y), xToLon(this.props.x)]}
            />
        )
    }
}

export default MapPoint;
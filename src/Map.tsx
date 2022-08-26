/*
 * Copyright (C) 2022 Soham Pardeshi.  All rights reserved.  Permission is
 * hereby granted to students registered for University of Washington
 * CSE 331 for use solely during Summer Quarter 2022 for purposes of
 * the course.  No other use, copying, distribution, or modification
 * is permitted without prior written consent. Copyrights for
 * third-party components of this work must be honored.  Instructors
 * interested in reusing these course materials should contact the
 * author.
 */

import {LatLngExpression} from "leaflet";
import React, {Component} from "react";
import {MapContainer, TileLayer} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import MapLine from "./MapLine";
import MapPoint from "./MapPoint";
import {UW_LATITUDE_CENTER, UW_LONGITUDE_CENTER} from "./Constants";

import {Edge, Point} from "./DataType"

// This defines the location of the map. These are the coordinates of the UW Seattle campus
const position: LatLngExpression = [UW_LATITUDE_CENTER, UW_LONGITUDE_CENTER];

// NOTE: This component is a suggestion for you to use, if you would like to. If
// you don't want to use this component, you're free to delete it or replace it
// with your hw-lines Map

interface MapProps {
    mapEdges: Edge[]; // edges representing the line on the map
    mapPoints: Point[]; // points on the map
}

/**
 * A component that will display the campus map, mark the start and end buildings on the map, and draw
 * the shortest path between two buildings on the map.
 */
class Map extends Component<MapProps, {}> {
    render() {
        return (
            <div id="map">
                <MapContainer
                    center={position}
                    zoom={15}
                    scrollWheelZoom={false}>
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />

                    { // draw the points
                        this.props.mapPoints.map((p) =>
                            <MapPoint key={p.label} x={p.x} y={p.y}/>
                        )
                    }

                    { // draw the edges
                        this.props.mapEdges.map((e) =>
                            <MapLine key={e.label} color={e.color} x1={e.x1} y1={e.y1} x2={e.x2} y2={e.y2}/>
                        )
                    }
                </MapContainer>
            </div>
        );
    }
}

export default Map;

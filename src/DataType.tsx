// represent an edge on the map
export interface Edge {
    x1: number; // x coordinate of the starting point
    y1: number; // y coordinate of the starting point
    x2: number; // x coordinate of the ending point
    y2: number; // y coordinate of the ending point
    color: string; // color of the edge
    label: string; // edge label
}

// represent a point on the map
export interface Point {
    x: number; // x coordinate of the point
    y: number; // y coordinate of the point
    label: string; // point label
}

// represent a building on the map
export interface Building {
    shortName: string; // short name of the building
    longName: string; // long name of the building
    key: string; // unique key for the building
}
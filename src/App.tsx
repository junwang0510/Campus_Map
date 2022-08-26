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

import React, {Component} from 'react';
import Map from "./Map";
import {Edge, Point} from "./DataType";
import BuildingList from "./BuildingList";

// Allows us to write CSS styles inside App.css, any styles will apply to all components inside <App />
import "./App.css";

interface AppState {
    edges: Edge[]; // edges representing the path between two buildings
    points: Point[]; // points representing the selected buildings
}

/**
 * A component that displays the map and handles changes to selected buildings
 * and path between them.
 */
class App extends Component<{}, AppState> {
    constructor(props: any) {
        super(props);
        this.state = {
            edges: [],
            points: []
        };
    }

    // update the edges representing the path between two buildings
    setEdges(e: Edge[]) {
        this.setState({edges: e});
    }

    // update the points representing the selected buildings
    setPoints(v: Point[]) {
        this.setState({points: v});
    }

    render() {
        return (
            <div>
                <h1 id="app-title"> 🔍 UW Campus Pathfinder 🏫 </h1>
                <div>
                    <Map
                        mapEdges={this.state.edges}
                        mapPoints={this.state.points}
                    />
                </div>

                {/* Update the edges and points on the map */}
                <BuildingList
                    onChange={(e: Edge[], p: Point[]) => {
                        this.setEdges(e);
                        this.setPoints(p);
                    }}
                />
            </div>
        );
    }

}

export default App;

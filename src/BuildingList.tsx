import React, {Component} from 'react';
import {Building, Edge, Point} from "./DataType";

interface BuildingListProps {
    onChange(edges: Edge[], points: Point[]): void;
}

interface BuildingListState {
    buildings: Building[]; // all buildings on campus
    start: string; // start building
    end: string; // end building
    directions: string; // directions between two buildings
}

/**
 * A component that allows the user to select the start and end buildings to find the path for
 * via the dropdown menus, have buttons available to find the shortest path between the buildings or
 * clear the content of the map, and generates a MapQuest-style list of walking directions for the path.
 */
class BuildingList extends Component<BuildingListProps, BuildingListState> {
    constructor(props: any) {
        super(props);
        this.state = {
            buildings: [],
            start: "",
            end: "",
            directions: ""
        };
    }

    // Get the list of buildings from the given string
    parseBuildings(str: string) {
        // removes curly brackets surrounding the entire data
        str = str.substring(1, str.length - 1);

        // splits the string so that each element in data corresponds to one building
        let data: string[] = str.split(",");

        let buildingList: Building[] = [];
        for (let i = 0; i < data.length; i++) {
            let building: string[] = data[i].split(":");
            let short = building[0].substring(1, building[0].length - 1);
            let long = building[1].substring(1, building[1].length - 1);
            // using "shortName:longName" as the unique key
            buildingList.push({shortName: short, longName: long, key: short + ":" + long});
        }

        // sort the buildings by their long names for easier use of application
        const sortByLongName = (a: Building, b: Building) => {
            const aName = a.longName.toLowerCase();
            const bName = b.longName.toLowerCase();
            return aName.localeCompare(bName);
        }
        buildingList.sort(sortByLongName);

        // update current buildings
        this.setState({
            buildings: buildingList,
        });
    }

    // Get the shortest path between two buildings from the input string to an array of
    // Edge, marks the start and end points, and assign to the path a random color
    // TODO: Change the random color part if needed
    parsePath(str: string) {
        // removes unnecessary data
        str = str.substring(2, str.length - 2);

        // splits the string so that each element in data corresponds to one path
        let data: string[] = str.split("},{");
        let edgeList: Edge[] = [];
        let pointList: Point[] = [];

        // pick a random color for the path
        let colors: string[] = ['black', 'orange', 'blue', 'purple', 'green'];
        let randIndex = Math.floor(Math.random() * colors.length);
        let pathColor = colors[randIndex];

        for (let i = 0; i < data.length; i++) {
            let edge: string[] = data[i].split(",");
            for (let j = 0; j < edge.length; j++) {
                edge[j] = edge[j].substring(5);
            }
            // use all the fields of the data as the unique key
            edgeList.push({
                x1: parseInt(edge[0]), y1: parseInt(edge[1]), x2: parseInt(edge[2]),
                y2: parseInt(edge[3]), color: pathColor, label: i.toString()
            });
        }

        // get the start point of the path
        let startPoint: Point = {
            x: edgeList[0].x1,
            y: edgeList[0].y1,
            label: edgeList[0].x1 + "," + edgeList[0].y1
        };

        // get the end point of the path
        let endPoint: Point = {
            x: edgeList[edgeList.length - 1].x1,
            y: edgeList[edgeList.length - 1].y1,
            label: edgeList[edgeList.length - 1].x1 + "," + edgeList[edgeList.length - 1].y1
        };

        pointList.push(startPoint, endPoint);
        this.props.onChange(edgeList, pointList);
    }

    // set the state of the start building
    setStart(evt: any) {
        this.setState({
            start: evt.target.value
        });
    }

    // set the state of the end building
    setEnd(evt: any) {
        this.setState({
            end: evt.target.value
        });
    }

    // set the state of the directions
    setDirection(s: string) {
        this.setState({
            directions: s
        });
    }

    // clear all lines and points displayed on the map and reset the stored
    // start and end buildings, as well as the directions of the path
    reset() {
        this.setState({
            start: "",
            end: "",
            directions: "",
        });
        this.props.onChange([], []);
    }

    // parse buildings into a dropdown list
    buildingsDropdown() {
        return this.state.buildings.map((building, index) => {
            return (
                <option key={index} value={building.shortName}>{building.longName}</option>
            )
        });
    }

    // retrieve and parse buildings information from the spark server
    componentDidMount = async () => {
        try {
            let response = await fetch("http://localhost:4567/buildings");
            if (!response.ok) {
                alert("The status is wrong! Expected: 200, Was: " + response.status);
                return; // Don't keep trying to execute if the response is bad.
            }
            let parsingPromise = await response.text();
            this.parseBuildings(parsingPromise);

        } catch (e) {
            alert("There was an error connecting to the server!");
            console.log(e);
        }
    };

    // get the shortest path between the start and end buildings the user selected
    getPath = async () => {
        const start = this.state.start;
        const end = this.state.end;
        // test if start and end buildings exists
        if (start === "" && end === "") {
            alert("Need to select both start and end buildings!");
            return;
        }
        // test if start and end buildings are identical
        else if (start === end) {
            alert("Cannot enter the same start and end buildings!");
            return;
        }

        try {
            const url = `http://localhost:4567/findPath?start=${start}&end=${end}`;
            let response = await fetch(url);
            if (!response.ok) {
                alert("The status expects: 200, but got: " + response.status);
                return;
            }
            let text = await response.text();
            this.parsePath(text);
            await this.getDirections();
        } catch (e) {
            alert("There was an error contacting the server.");
            console.log(e);
        }
    };

    // get a list of walking directions for the shortest path between the start and end buildings
    getDirections = async () => {
        const start = this.state.start;
        const end = this.state.end;
        try {
            const url = `http://localhost:4567/directions?start=${start}&end=${end}`;
            let response = await fetch(url);
            if (!response.ok) {
                alert("The status expects: 200, but got: " + response.status);
                return;
            }
            let text = await response.text();
            text = text.replaceAll(",", "\n")
            this.setDirection(text);

        } catch (e) {
            alert("There was an error contacting the server.");
            console.log(e);
        }
    }

    render() {
        return (
            <div id="user-controls">
                {/* Dropdown menu to select the start building */}
                <h3> Start Building </h3>
                <div id="dropdown">
                    <select onChange={this.setStart.bind(this)} value={this.state.start} name="start">
                        <option id="dropdown-option">- Select the Start Building -</option>
                        {this.buildingsDropdown()}
                    </select>
                </div>

                {/* Dropdown menu to select the end building */}
                <h3> End Building </h3>
                <div id="dropdown">
                    <select onChange={this.setEnd.bind(this)} value={this.state.end} name="end">
                        <option id="dropdown-option">- Select the End Building -</option>
                        {this.buildingsDropdown()}
                    </select>
                </div>
                <br/>

                {/* Buttons */}
                <div>
                    <button className="findPath" onClick={() => this.getPath()}>Find Path</button>
                </div>
                <br/>
                <div>
                    <button className="reset" onClick={() => this.reset()}>Reset</button>
                </div>
                <br/>

                {/* directions for navigation */}
                <h3>Walking Directions:</h3>
                <div> Change directions after roughly 30 steps / 20 seconds:</div>
                <p className={"directions"}>{this.state.directions}</p>
            </div>
        );
    }
}

export default BuildingList;
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

package pathfinder;

import graph.SimpleGraph;
import pathfinder.datastructures.Path;
import pathfinder.datastructures.Point;
import pathfinder.parser.CampusBuilding;
import pathfinder.parser.CampusPath;
import pathfinder.parser.CampusPathsParser;

import java.util.*;

/**
 * CampusMap represents a map containing unique buildings and directed paths connecting different locations
 * on campus
 */
public class CampusMap implements ModelAPI {
    // RI: parsedBuildings != null and parsedPaths != null and graph != null
    //     no CampusBuilding in parsedBuildings is null
    //     no shortName of any CampusBuilding is null
    //     no longName of any CampusBuilding is null
    //     no CampusPath in parsedPaths is null
    //     no distance in parsedPaths is negative
    // AF(this) = a campus map such that
    //          this.parsedBuildings = unique campus buildings on campus
    //          this.parsedPaths = unique campus paths on campus
    //          this.graph = a graph containing information about different locations and paths on campus

    private List<CampusBuilding> parsedBuildings;
    private List<CampusPath> parsedPaths;
    private SimpleGraph<Point, Double> graph;
    // debug flag
    public static final boolean DEBUG = false;

    /**
     * Constructs a CampusMap with the input buildings and paths
     *
     * @param buildings buildings information for creating CampusMap
     * @param paths     paths information for creating CampusMap
     * @throws IllegalArgumentException if buildings or paths (or both) is null
     * @spec.effects creates a CampusMap with the input buildings and paths
     */
    public CampusMap(String buildings, String paths) {
        // exception checks
        if (buildings == null && paths == null) {
            throw new IllegalArgumentException("Buildings and paths files cannot be null");
        } else if (buildings == null) {
            throw new IllegalArgumentException("Buildings file cannot be null");
        } else if (paths == null) {
            throw new IllegalArgumentException("Paths file cannot be null");
        }

        parsedBuildings = new ArrayList<>();
        parsedPaths = new ArrayList<>();
        graph = new SimpleGraph<>();

        buildMap(buildings, paths);
        checkRep();
    }

    // Builds a CampusMap with the input buildings and paths
    private void buildMap(String buildings, String paths) {
        parsedBuildings = CampusPathsParser.parseCampusBuildings(buildings);
        parsedPaths = CampusPathsParser.parseCampusPaths(paths);
        for (CampusPath cp : parsedPaths) {
            Point parent = new Point(cp.getX1(), cp.getY1());
            Point child = new Point(cp.getX2(), cp.getY2());
            double distance = cp.getDistance();
            graph.addNode(parent);
            graph.addNode(child);
            graph.addEdge(parent, child, distance);
        }
    }

    /**
     * Checks whether a given short name for a building exists in the map
     *
     * @param shortName The short name of a building to query.
     * @return true if the input short name is in the map; false otherwise
     * @spec.requires shortName != null
     */
    @Override
    public boolean shortNameExists(String shortName) {
        checkRep();
        for (CampusBuilding cb : parsedBuildings) {
            String shortN = cb.getShortName();
            if (shortN.equals(shortName)) {
                checkRep();
                return true;
            }
        }
        checkRep();
        return false;
    }

    /**
     * Get the corresponding long name of the given short name for a building
     *
     * @param shortName The short name of a building to find the corresponding long name for.
     * @return the corresponding long name of the input short name
     * @throws IllegalArgumentException if the given short name for the building does not exist in the graph
     * @spec.requires shortName != null
     */
    @Override
    public String longNameForShort(String shortName) {
        checkRep();
        if (!shortNameExists(shortName)) {
            throw new IllegalArgumentException("short name provided does not exist");
        }
        for (CampusBuilding cb : parsedBuildings) {
            String shortN = cb.getShortName();
            if (shortN.equals(shortName)) {
                checkRep();
                return cb.getLongName();
            }
        }
        checkRep();
        return null;
    }

    /**
     * Get a collection of short names of the buildings in the map with corresponding long names
     *
     * @return a map containing all short names of the buildings in the map with their corresponding long names
     */
    @Override
    public Map<String, String> buildingNames() {
        checkRep();
        Map<String, String> buildingNames = new HashMap<>();
        for (CampusBuilding cb : parsedBuildings) {
            String shortN = cb.getShortName();
            String longN = cb.getLongName();
            buildingNames.put(shortN, longN);
        }
        checkRep();
        return buildingNames;
    }

    /**
     * Get the shortest path between two buildings
     *
     * @param startShortName The short name of the building at the beginning of this path.
     * @param endShortName   The short name of the building at the end of this path.
     * @return a Path of Point representing the shortest path between two buildings
     * @throws IllegalArgumentException if either startShortName or endShortName is null
     *                                  or if startShortName or endShortName is not a short name for existing building in the map
     */
    @Override
    public Path<Point> findShortestPath(String startShortName, String endShortName) {
        checkRep();
        // Exception checks
        if (startShortName == null || endShortName == null) {
            throw new IllegalArgumentException("building names cannot be null");
        } else if (!shortNameExists(startShortName) || !shortNameExists(endShortName)) {
            throw new IllegalArgumentException("Short names of buildings must be in campus map");
        }

        // Find the corresponding Point of the input building names
        Point start = null;
        Point end = null;
        for (CampusBuilding cb : parsedBuildings) {
            String shortName = cb.getShortName();
            if (shortName.equals(startShortName)) {
                start = new Point(cb.getX(), cb.getY());
            } else if (shortName.equals(endShortName)) {
                end = new Point(cb.getX(), cb.getY());
            }
        }
        checkRep();
        return DijkstraPathFinder.findPath(graph, start, end);
    }

    // Throws an exception if the representation invariant is violated
    private void checkRep() {
        assert parsedBuildings != null && parsedPaths != null && graph != null;

        if (DEBUG) {
            for (CampusBuilding cb : parsedBuildings) {
                assert cb != null;
                assert cb.getShortName() != null;
                assert cb.getLongName() != null;
            }
            for (CampusPath cp : parsedPaths) {
                assert cp != null;
                assert cp.getDistance() >= 0.0;
            }
        }
    }
}

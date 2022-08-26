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

package campuspaths;

import campuspaths.utils.CORSFilter;
import pathfinder.*;
import pathfinder.datastructures.*;
import spark.*;

import java.util.*;

import com.google.gson.Gson;

public class SparkServer {

    public static void main(String[] args) {
        CORSFilter corsFilter = new CORSFilter();
        corsFilter.apply();
        // The above two lines help set up some settings that allow the
        // React application to make requests to the Spark server, even though it
        // comes from a different server.
        // You should leave these two lines at the very beginning of main().

        // Create a map with the given data
        CampusMap map = new CampusMap("campus_buildings.csv", "campus_paths.csv");
        // Gson object for converting java objects to json strings
        Gson gson = new Gson();

        // Find the shortest path between two buildings on the map
        Spark.get("/findPath", new Route() {
            @Override
            public Object handle(Request request, Response response) throws Exception {
                // start and end buildings
                String start = request.queryParams("start");
                String end = request.queryParams("end");

                // error check
                if (start == null || end == null) {
                    Spark.halt(400, "Start or end building is empty!");
                }

                // Use Dijkstra's algorithm to find the shortest path between two buildings
                Path<Point> shortestPath = null;
                try {
                    shortestPath = map.findShortestPath(start, end);
                } catch (IllegalArgumentException e) {
                    Spark.halt(400, "start and end must be valid shortname for buildings");
                }

                // Store the shortest path's segments
                List<PathSegment> resultPath = new ArrayList<>();
                for (Path<Point>.Segment p : shortestPath) {
                    PathSegment curr = new PathSegment(p.getStart().getX(), p.getStart().getY(),
                            p.getEnd().getX(), p.getEnd().getY());
                    resultPath.add(curr);
                }

                // Convert to json
                return gson.toJson(resultPath);
            }
        });

        // Get all the buildings on the current map
        Spark.get("/buildings", new Route() {
            @Override
            public Object handle(Request request, Response response) throws Exception {
                Map<String, String> buildings = map.buildingNames();
                return gson.toJson(buildings);
            }
        });

        // Get the directions of the path segments in the shortest path between two buildings
        Spark.get("/directions", new Route() {
            @Override
            public Object handle(Request request, Response response) throws Exception {
                // start and end buildings
                // Since this method is used after finding the shortest path, there is no
                // need to check whether the start and end buildings are valid.
                String start = request.queryParams("start");
                String end = request.queryParams("end");

                // Use Dijkstra's algorithm to find the shortest path between two buildings
                Path<Point> shortestPath = map.findShortestPath(start, end);

                // creates a list of edge objects that represent every path in the graph
                List<String> directions = new ArrayList<>();
                for (Path<Point>.Segment p : shortestPath) {
                    String current = "";

                    // position checking to infer direction
                    double x1 = p.getStart().getX();
                    double y1 = p.getStart().getY();
                    double x2 = p.getEnd().getX();
                    double y2 = p.getEnd().getY();
                    if (x1 < x2 - 5) {
                        current += "East";
                    } else if (x2 < x1 - 5) {
                        current += "West";
                    }
                    if (y1 < y2 - 5) {
                        current += "South";
                    } else if (y2 < y1 - 5) {
                        current += "North";
                    }
                    directions.add(current);
                }

                // Convert to json
                return gson.toJson(directions);
            }
        });
    }

    // PathSegment represents a segment of the shortest path
    private static class PathSegment {
        // coordinates representing a segment of the shortest path
        private double x1, y1, x2, y2;

        /**
         * Creates a PathSegment representing a segment of the shortest path
         *
         * @param x1 x coordinate of the starting point
         * @param y1 y coordinate of the starting point
         * @param x2 x coordinate of the ending point
         * @param y2 y coordinate of the ending point
         */
        public PathSegment(double x1, double y1, double x2, double y2) {
            this.x1 = x1;
            this.y1 = y1;
            this.x2 = x2;
            this.y2 = y2;
        }
    }
}

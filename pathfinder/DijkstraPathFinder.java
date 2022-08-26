package pathfinder;

import graph.SimpleGraph;
import pathfinder.datastructures.Path;

import java.util.*;


public class DijkstraPathFinder {
    public static <T> Path<T> findPath(SimpleGraph<T, Double> graph, T startNode, T destinationNode) {
        // set up
        PriorityQueue<Path<T>> active = new PriorityQueue<Path<T>>(new Comparator<Path<T>>() {
            @Override
            public int compare(Path<T> o1, Path<T> o2) {
                return Double.compare(o1.getCost(), o2.getCost());
            }
        });
        Set<T> finished = new HashSet<>();
        Path<T> startPath = new Path<>(startNode);
        active.add(startPath);

        // still have nodes to process
        while (!active.isEmpty()) {
            // path with the lowest cost
            Path<T> minPath = active.remove();
            T minDest = minPath.getEnd();

            if (minDest.equals(destinationNode)) {
                return minPath;
            }

            if (finished.contains(minDest)) {
                continue;
            }

            // find all the connected edges of minDest
            Set<SimpleGraph<T, Double>.Edge> edges = graph.findChildren(minDest);
            for (SimpleGraph<T, Double>.Edge edge : edges) {
                if (!finished.contains(edge.getChild())) {
                    Path<T> newPath = minPath.extend(edge.getChild(), edge.getLabel());
                    active.add(newPath);
                }
            }
            finished.add(minDest);
        }
        return null;
    }

}
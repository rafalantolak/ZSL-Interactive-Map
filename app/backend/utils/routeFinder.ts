import { schoolLayout, type Place, type SchoolFloor } from "../core/schoolLayout";
import Node from "../core/node";
import dijkstra from "./dijkstra";

export type RouteResult = {
  from: Place;
  to: Place;
  path: Place[];
  distance: number;
  found: boolean;
};

const placeById = new Map<string, Place>(
  schoolLayout.places.map((place) => [place.id, place])
);

const placeByNode = new Map<Node, Place>(
  schoolLayout.places.map((place) => [place.node, place])
);
const stairsPlaces = schoolLayout.places.filter((place) => place.kind === "stairs");

export const getAllPlaces = (): Place[] => schoolLayout.places;

export const getMarkedPlaces = (): Place[] =>
  schoolLayout.places.filter((place) => place.marked);

export const getFloors = (): SchoolFloor[] => schoolLayout.floors;

export const getMapImage = () => ({
  src: schoolLayout.mapImagePath,
  width: schoolLayout.mapImageSize.width,
  height: schoolLayout.mapImageSize.height,
});

type PathSearchResult = {
  path: Node[];
  distance: number;
};

type StairPathCandidate = {
  stair: Place;
  path: Node[];
  distance: number;
};

type CrossFloorRouteCandidate = {
  path: Node[];
  distance: number;
  startStairsDistance: number;
  endStairsDistance: number;
};

const hasFiniteDistance = (distance: number): boolean => Number.isFinite(distance);

const toPlacePath = (nodes: Node[]): Place[] =>
  nodes.map((node) => placeByNode.get(node)).filter((place): place is Place => Boolean(place));

const mergeNodePaths = (...segments: Node[][]): Node[] => {
  const merged: Node[] = [];

  for (const segment of segments) {
    if (segment.length === 0) {
      continue;
    }
    if (merged.length > 0 && merged[merged.length - 1] === segment[0]) {
      merged.push(...segment.slice(1));
      continue;
    }
    merged.push(...segment);
  }

  return merged;
};

const isCorridorOnFloor = (
  place: Place | undefined,
  floorId: Place["floorId"]
): boolean => Boolean(place && place.kind === "corridor" && place.floorId === floorId);

const findCorridorPathOnFloor = (
  from: Place,
  to: Place,
  floorId: Place["floorId"]
): PathSearchResult =>
  dijkstra(from.node, to.node, {
    canVisitNode: (node) => {
      if (node === from.node || node === to.node) {
        return true;
      }
      const place = placeByNode.get(node);
      return isCorridorOnFloor(place, floorId);
    },
  });

const findStairsOnlyPath = (fromStairs: Place, toStairs: Place): PathSearchResult =>
  dijkstra(fromStairs.node, toStairs.node, {
    canVisitNode: (node) => {
      if (node === fromStairs.node || node === toStairs.node) {
        return true;
      }
      const place = placeByNode.get(node);
      return Boolean(place && place.kind === "stairs");
    },
  });

const getSortedStartStairsCandidates = (from: Place): StairPathCandidate[] =>
  stairsPlaces
    .filter((stairs) => stairs.floorId === from.floorId)
    .map((stairs) => {
      const result = findCorridorPathOnFloor(from, stairs, from.floorId);
      return {
        stair: stairs,
        path: result.path,
        distance: result.distance,
      };
    })
    .filter((candidate) => hasFiniteDistance(candidate.distance))
    .sort((a, b) => a.distance - b.distance);

const getSortedDestinationStairsCandidates = (to: Place): StairPathCandidate[] =>
  stairsPlaces
    .filter((stairs) => stairs.floorId === to.floorId)
    .map((stairs) => {
      const result = findCorridorPathOnFloor(stairs, to, to.floorId);
      return {
        stair: stairs,
        path: result.path,
        distance: result.distance,
      };
    })
    .filter((candidate) => hasFiniteDistance(candidate.distance))
    .sort((a, b) => a.distance - b.distance);

const isBetterCrossFloorCandidate = (
  candidate: CrossFloorRouteCandidate,
  currentBest: CrossFloorRouteCandidate | null
): boolean => {
  if (!currentBest) {
    return true;
  }
  if (candidate.startStairsDistance !== currentBest.startStairsDistance) {
    return candidate.startStairsDistance < currentBest.startStairsDistance;
  }
  if (candidate.endStairsDistance !== currentBest.endStairsDistance) {
    return candidate.endStairsDistance < currentBest.endStairsDistance;
  }
  return candidate.distance < currentBest.distance;
};

const findCrossFloorRoute = (from: Place, to: Place): CrossFloorRouteCandidate | null => {
  const startStairsCandidates = getSortedStartStairsCandidates(from);
  const destinationStairsCandidates = getSortedDestinationStairsCandidates(to);

  let bestCandidate: CrossFloorRouteCandidate | null = null;

  for (const startCandidate of startStairsCandidates) {
    for (const destinationCandidate of destinationStairsCandidates) {
      const stairsTravel = findStairsOnlyPath(startCandidate.stair, destinationCandidate.stair);
      if (!hasFiniteDistance(stairsTravel.distance)) {
        continue;
      }

      const candidate: CrossFloorRouteCandidate = {
        path: mergeNodePaths(startCandidate.path, stairsTravel.path, destinationCandidate.path),
        distance:
          startCandidate.distance + stairsTravel.distance + destinationCandidate.distance,
        startStairsDistance: startCandidate.distance,
        endStairsDistance: destinationCandidate.distance,
      };

      if (isBetterCrossFloorCandidate(candidate, bestCandidate)) {
        bestCandidate = candidate;
      }
    }
  }

  return bestCandidate;
};

export const findShortestRouteByPlaceIds = (
  fromId: string,
  toId: string
): RouteResult | null => {
  const from = placeById.get(fromId);
  const to = placeById.get(toId);

  if (!from || !to) {
    return null;
  }
  const searchResult: PathSearchResult | null =
    from.floorId === to.floorId
      ? findCorridorPathOnFloor(from, to, from.floorId)
      : findCrossFloorRoute(from, to);
  const path = toPlacePath(searchResult?.path ?? []);
  const distance = searchResult?.distance ?? Number.POSITIVE_INFINITY;

  return {
    from,
    to,
    path,
    distance,
    found: path.length > 0 && hasFiniteDistance(distance),
  };
};

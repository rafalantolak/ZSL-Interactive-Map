import { floorLayout, type Place } from "../core/layout";
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
  floorLayout.places.map((place) => [place.id, place])
);

const placeByNode = new Map<Node, Place>(
  floorLayout.places.map((place) => [place.node, place])
);

export const getAllPlaces = (): Place[] => floorLayout.places;

export const getMarkedPlaces = (): Place[] =>
  floorLayout.places.filter((place) => place.marked);

export const findShortestRouteByPlaceIds = (
  fromId: string,
  toId: string
): RouteResult | null => {
  const from = placeById.get(fromId);
  const to = placeById.get(toId);

  if (!from || !to) {
    return null;
  }

  const result = dijkstra(from.node, to.node);
  const path = result.path
    .map((node) => placeByNode.get(node))
    .filter((place): place is Place => Boolean(place));

  return {
    from,
    to,
    path,
    distance: result.distance,
    found: path.length > 0 && Number.isFinite(result.distance),
  };
};

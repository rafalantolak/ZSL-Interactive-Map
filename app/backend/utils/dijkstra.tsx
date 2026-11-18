import Node from "../core/node";

export type ShortestPathResult = {
  path: Node[];
  distance: number;
};
export type DijkstraOptions = {
  canVisitNode?: (node: Node) => boolean;
};

const edgeCost = (from: Node, to: Node, overrideCost?: number): number =>
  overrideCost ?? Math.hypot(from.posX - to.posX, from.posY - to.posY);

const getClosestNode = (queue: Set<Node>, distances: Map<Node, number>): Node => {
  let closestNode: Node | null = null;
  let shortestDistance = Number.POSITIVE_INFINITY;

  for (const node of queue) {
    const distance = distances.get(node) ?? Number.POSITIVE_INFINITY;
    if (distance < shortestDistance) {
      shortestDistance = distance;
      closestNode = node;
    }
  }

  if (!closestNode) {
    throw new Error("Queue cannot be empty when selecting the closest node.");
  }

  return closestNode;
};

const rebuildPath = (target: Node, previousNodes: Map<Node, Node | null>): Node[] => {
  const path: Node[] = [];
  let current: Node | null | undefined = target;

  while (current) {
    path.unshift(current);
    current = previousNodes.get(current) ?? null;
  }

  return path;
};

export const dijkstra = (
  start: Node,
  target: Node,
  options: DijkstraOptions = {}
): ShortestPathResult => {
  const canVisitNode = options.canVisitNode ?? (() => true);

  if (!canVisitNode(start) || !canVisitNode(target)) {
    return { path: [], distance: Number.POSITIVE_INFINITY };
  }
  if (start === target) {
    return { path: [start], distance: 0 };
  }

  const distances = new Map<Node, number>();
  const previousNodes = new Map<Node, Node | null>();
  const queue = new Set<Node>();

  distances.set(start, 0);
  previousNodes.set(start, null);
  queue.add(start);

  while (queue.size > 0) {
    const currentNode = getClosestNode(queue, distances);
    queue.delete(currentNode);

    if (currentNode === target) {
      break;
    }

    const currentDistance = distances.get(currentNode) ?? Number.POSITIVE_INFINITY;

    for (const edge of currentNode.neighbors) {
      const neighbor = edge.node;
      if (!canVisitNode(neighbor)) {
        continue;
      }
      const candidateDistance =
        currentDistance + edgeCost(currentNode, neighbor, edge.cost);

      if (candidateDistance < (distances.get(neighbor) ?? Number.POSITIVE_INFINITY)) {
        distances.set(neighbor, candidateDistance);
        previousNodes.set(neighbor, currentNode);
        queue.add(neighbor);
      }
    }
  }

  const totalDistance = distances.get(target);
  if (totalDistance === undefined) {
    return { path: [], distance: Number.POSITIVE_INFINITY };
  }

  return { path: rebuildPath(target, previousNodes), distance: totalDistance };
};

export default dijkstra;
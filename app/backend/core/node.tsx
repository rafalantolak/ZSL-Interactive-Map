export type NeighborEdge = {
  node: Node;
  cost?: number;
};
export default class Node {
  posX: number;
  posY: number;
  neighbors: NeighborEdge[];

  constructor(posX = 0, posY = 0) {
    this.posX = posX;
    this.posY = posY;
    this.neighbors = [];
  }
  addNeighbor(node: Node, cost?: number): void {
    const existingEdge = this.neighbors.find((edge) => edge.node === node);
    if (existingEdge) {
      if (cost !== undefined) {
        existingEdge.cost = cost;
      }
      return;
    }

    this.neighbors.push({ node, cost });
  }
}

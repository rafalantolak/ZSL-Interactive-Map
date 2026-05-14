export default class Node {
  posX: number;
  posY: number;
  neighbors: Node[];

  constructor(posX = 0, posY = 0) {
    this.posX = posX;
    this.posY = posY;
    this.neighbors = [];
  }

  addNeighbor(node: Node): void {
    if (!this.neighbors.includes(node)) {
      this.neighbors.push(node);
    }
  }
}

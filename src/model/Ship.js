const shipData = new Map();

shipData.set(0, { className: "Carrier", size: 5 });
shipData.set(1, { className: "Battleship", size: 4 });
shipData.set(2, { className: "Destroyer", size: 3 });
shipData.set(3, { className: "Submarine", size: 3 });
shipData.set(4, { className: "Patrol Boat", size: 2 });

export default class Ship {
  constructor(id) {
    if (!shipData.has(id) || typeof id !== "number")
      throw new Error("ArgError: Unable to create Ship");
    this.className = shipData.get(id).className;
    this.size = shipData.get(id).size;
    this.damage = 0;
    this.isSet = false;
    this.posX = [];
    this.posY = [];
  }
  hit() {
    if (this.damage + 1 > this.size)
      throw new Error("Cannot damage this ship further");
    this.damage++;
  }
  isSunk() {
    if (this.damage < this.size) return false;
    else return true;
  }
}

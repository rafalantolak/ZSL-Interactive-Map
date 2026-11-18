import Node from "./node";

export type FloorId = "workshops" | "low-ground" | "ground" | "first" | "second";

export type PlaceKind =
  | "room"
  | "corridor"
  | "stairs"
  | "entrance"
  | "exit"
  | "service";

export type FloorViewport = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export type SchoolFloor = {
  id: FloorId;
  name: string;
  shortName: string;
  viewport: FloorViewport;
};

export type Place = {
  id: string;
  label: string;
  kind: PlaceKind;
  marked: boolean;
  floorId: FloorId;
  node: Node;
};

const schoolFloors: SchoolFloor[] = [
  {
    id: "workshops",
    name: "Pracownie zawodowe",
    shortName: "Pracownie",
    viewport: { x: 24, y: 54, width: 720, height: 252 },
  },
  {
    id: "low-ground",
    name: "Niski parter",
    shortName: "Niski parter",
    viewport: { x: 30, y: 298, width: 730, height: 224 },
  },
  {
    id: "ground",
    name: "Parter",
    shortName: "Parter",
    viewport: { x: 30, y: 502, width: 730, height: 362 },
  },
  {
    id: "first",
    name: "I piętro",
    shortName: "I piętro",
    viewport: { x: 30, y: 850, width: 730, height: 174 },
  },
  {
    id: "second",
    name: "II piętro",
    shortName: "II piętro",
    viewport: { x: 30, y: 1018, width: 730, height: 164 },
  },
];

const createPlace = (
  id: string,
  label: string,
  kind: PlaceKind,
  floorId: FloorId,
  posX: number,
  posY: number,
  marked = kind !== "corridor" && kind !== "stairs"
): Place => ({
  id,
  label,
  kind,
  marked,
  floorId,
  node: new Node(posX, posY),
});

const connectBidirectional = (a: Place, b: Place, cost?: number): void => {
  a.node.addNeighbor(b.node, cost);
  b.node.addNeighbor(a.node, cost);
};

// ============================================================
// PARTER (ground) – viewport y: 502–864, x: 30–760
// Korytarz główny przebiega poziomo ok. y=736
// Pomieszczenia na północ od korytarza (y~630–710)
// Pomieszczenia na południe od korytarza (y~760–830)
// Wejście główne od południa ok. y=856
// ============================================================
const placesByKey = {
  // Wejście/wyjście – dolna krawędź parteru
    entranceMain: createPlace("entrance-main", "Wejście główne", "entrance", "ground", 430, 814),
  exitGroundSouth: createPlace("exit-ground-south", "Wyjście ewakuacyjne (parter)", "exit", "ground", 430, 807),
  reception: createPlace("reception", "Recepcja", "room", "ground", 435, 777),
  room10Projekty: createPlace("room-10-projekty-techniczne", "10 Projekty techniczne", "room", "ground", 505, 726),
  room18Pomoc: createPlace("room-18-pomoc-przedmedyczna", "18 Pomoc przedmedyczna", "room", "ground", 402, 641),
  room19Kronika: createPlace("room-19-kronika", "19 Kronika szkolna", "room", "ground", 390, 710),
  room20Spotkania: createPlace("room-20-spotkania-absolwentow", "20 Spotkania absolwentów", "room", "ground", 333, 712),
  room21Lawka: createPlace("room-21-lawka-szkolna", "21 Ławka szkolna", "room", "ground", 287, 710),
  room22SalaKinowa: createPlace("room-22-sala-kinowa", "22 Sala kinowa", "room", "ground", 183, 712),
  room24Informatyka: createPlace("room-24-informatyka", "24 Informatyka", "room", "ground", 96, 710),
  kawiarenka: createPlace("kawiarenka", "Kawiarenka", "room", "ground", 378, 619),
  boisko: createPlace("boisko", "Boisko", "room", "ground", 288, 514),
  grill: createPlace("grill", "Grill", "room", "ground", 185, 652),
  wcGround: createPlace("room-wc-ground", "WC (parter)", "service", "ground", 402, 788),
  corridorGroundWest: createPlace("corridor-ground-west", "Korytarz zachodni (parter)", "corridor", "ground", 244, 758, false),
  corridorGroundCenter: createPlace("corridor-ground-center", "Korytarz centralny (parter)", "corridor", "ground", 430, 674, false),
  corridorGroundReception: createPlace("corridor-ground-reception", "Korytarz przy recepcji", "corridor", "ground", 431, 740, false),
  corridorGroundEast: createPlace("corridor-ground-east", "Korytarz wschodni (parter)", "corridor", "ground", 430, 736, false),
  corridorGroundNorth: createPlace("corridor-ground-north", "Przejście północne (parter)", "corridor", "ground", 421, 486, false),
  corridorGroundSouth: createPlace("corridor-ground-south", "Przejście południowe (parter)", "corridor", "ground", 400, 676, false),
  stairsGroundWest: createPlace("stairs-ground-west", "Schody zachodnie (parter)", "stairs", "ground", 115, 764, false),
  stairsGroundEast: createPlace("stairs-ground-east", "Schody wschodnie (parter)", "stairs", "ground", 402, 755, false),
  room101: createPlace("room-101-druk-3d", "101 Pracownia druku 3D", "room", "first", 94, 865),
  room103: createPlace("room-103-spotkania-absolwentow", "103 Spotkania absolwentów", "room", "first", 237, 865),
  room104: createPlace("room-104-lingwistyka", "104 Lingwistyka", "room", "first", 302, 865),
  room105: createPlace("room-105-lingwistyka", "105 Lingwistyka", "room", "first", 357, 867),
  room106: createPlace("room-106-spotkania-absolwentow", "106 Spotkania absolwentów", "room", "first", 418, 867),
  room107: createPlace("room-107-spotkania-absolwentow", "107 Spotkania absolwentów", "room", "first", 471, 882),
  room108: createPlace("room-108-spotkania-absolwentow", "108 Spotkania absolwentów", "room", "first", 524, 884),
  room109: createPlace("room-109-sala-kinowa", "109 Sala kinowa", "room", "first", 573, 895),
  room110: createPlace("room-110-pokoj-nauczycielski", "110 Pokój nauczycielski", "room", "first", 523, 939),
  wcFirst: createPlace("room-wc-first", "WC (I piętro)", "service", "first", 400, 939),
  corridorFirstWest: createPlace("corridor-first-west", "Korytarz zachodni (I piętro)", "corridor", "first", 264, 893, false),
  corridorFirstCenter: createPlace("corridor-first-center", "Korytarz centralny (I piętro)", "corridor", "first", 430, 912, false),
  corridorFirstEast: createPlace("corridor-first-east", "Korytarz wschodni (I piętro)", "corridor", "first", 430, 913, false),
  corridorFirstSouth: createPlace("corridor-first-south", "Przejście południowe (I piętro)", "corridor", "first", 430, 926, false),
  stairsFirstWest: createPlace("stairs-first-west", "Schody zachodnie (I piętro)", "stairs", "first", 115, 920, false),
  stairsFirstEast: createPlace("stairs-first-east", "Schody wschodnie (I piętro)", "stairs", "first", 402, 915, false),
  room201: createPlace("room-201-spotkania-absolwentow", "201 Spotkania absolwentów", "room", "second", 89, 987),
  room202: createPlace("room-202-geografia", "202 Geografia", "room", "second", 154, 986),
  room203: createPlace("room-203-matematyka", "203 Matematyka", "room", "second", 225, 986),
  room204: createPlace("room-204-matematyka", "204 Matematyka", "room", "second", 295, 989),
  room205: createPlace("room-205-polski", "205 Polski", "room", "second", 349, 986),
  room206: createPlace("room-206-matematyka", "206 Matematyka", "room", "second", 404, 989),
  room207: createPlace("room-207-polski", "207 Polski", "room", "second", 462, 1005),
  room208: createPlace("room-208-humor-zeszytow", "208 Humor zeszytów", "room", "second", 519, 1003),
  room209: createPlace("room-209-strzelnica-wirtualna", "209 Strzelnica wirtualna", "room", "second", 560, 1015),
  room210: createPlace("room-210-szachy", "210 Szachy", "room", "second", 542, 1062),
  room211: createPlace("room-211-80-modeli", "211 80 modeli na 80-lecie", "room", "second", 476, 1062),
  wcSecond: createPlace("room-wc-second", "WC (II piętro)", "service", "second", 392, 1065),
  corridorSecondWest: createPlace("corridor-second-west", "Korytarz zachodni (II piętro)", "corridor", "second", 247, 1017, false),
  corridorSecondCenter: createPlace("corridor-second-center", "Korytarz centralny (II piętro)", "corridor", "second", 416, 1039, false),
  corridorSecondEast: createPlace("corridor-second-east", "Korytarz wschodni (II piętro)", "corridor", "second", 420, 1034, false),
  corridorSecondSouth: createPlace("corridor-second-south", "Przejście południowe (II piętro)", "corridor", "second", 418, 1048, false),
  stairsSecondWest: createPlace("stairs-second-west", "Schody zachodnie (II piętro)", "stairs", "second", 106, 1037, false),
  stairsSecondEast: createPlace("stairs-second-east", "Schody wschodnie (II piętro)", "stairs", "second", 395, 1034, false),
  room031: createPlace("room-031-bufet", "031 Bufet", "room", "low-ground", 187, 357),

  room032: createPlace("room-032-bufet", "032 Bufet", "room", "low-ground", 237, 356),
  room036: createPlace("room-036-rodzice", "036 Rodzice", "room", "low-ground", 356, 356),
  wcLow: createPlace("room-wc-low-ground", "WC (niski parter)", "service", "low-ground", 406, 423),
  corridorLowMain: createPlace("corridor-low-main", "Korytarz główny (niski parter)", "corridor", "low-ground", 271, 380, false),
  corridorLowEast: createPlace("corridor-low-east", "Korytarz wschodni (niski parter)", "corridor", "low-ground", 426, 393, false),
  stairsLowWest: createPlace("stairs-low-west", "Schody zachodnie (niski parter)", "stairs", "low-ground", 116, 399, false),
  stairsLowEast: createPlace("stairs-low-east", "Schody wschodnie (niski parter)", "stairs", "low-ground", 400, 402, false),
  room02: createPlace("room-02-elektroniczna", "02 Elektroniczna", "room", "workshops", 204, 123),
  room09MP: createPlace("room-09-mp", "09 MP", "room", "workshops", 461, 128),
  room09a: createPlace("room-09a-montaz-utk", "09a Montaż UTK", "room", "workshops", 459, 163),
  room012: createPlace("room-012-laczeniowa-foto", "012 Łączeniowa Foto", "room", "workshops", 459, 245),
  room021: createPlace("room-021-robotyka", "021 Robotyka", "room", "workshops", 309, 183),
  room024: createPlace("room-024-spotkania-absolwentow", "024 Spotkania absolwentów", "room", "workshops", 225, 247),
  room026: createPlace("room-026-informatyczna", "026 Informatyczna", "room", "workshops", 380, 251),
  room028: createPlace("room-028-sieci-komputerowe", "028 Sieci komputerowe", "room", "workshops", 190, 185),
  room029: createPlace("room-029-automatyka", "029 Automatyka", "room", "workshops", 161, 187),
  room051: createPlace("room-051-bezpieczenstwa-sieci", "051 Bezpieczeństwo sieci", "room", "workshops", 536, 245),
  roomTeleinformatyczna: createPlace("room-teleinformatyczna", "Teleinformatyczna", "room", "workshops", 392, 192),
  roomSalaKonf: createPlace("room-sala-konferencyjna", "Sala konferencyjna", "room", "workshops", 288, 252),
  roomBiblioteka: createPlace("room-biblioteka-zawodowa", "Biblioteka zawodowa", "room", "workshops", 254, 252),
  roomSilownia: createPlace("room-silownia", "Siłownia", "room", "workshops", 395, 161),
  corridorWorkshopsWest: createPlace("corridor-workshops-west", "Korytarz zachodni (pracownie)", "corridor", "workshops", 130, 182, false),
  corridorWorkshopsMain: createPlace("corridor-workshops-main", "Korytarz centralny (pracownie)", "corridor", "workshops", 304, 147, false),
  corridorWorkshopsEast: createPlace("corridor-workshops-east", "Korytarz wschodni (pracownie)", "corridor", "workshops", 436, 202, false),
  stairsWorkshopsEast: createPlace("stairs-workshops-east", "Schody (pracownie)", "stairs", "workshops", 438, 280, false),
  // Lewe schody pracowni → niski parter (po lewej stronie budynku)
  stairsWorkshopsWest: createPlace("stairs-workshops-west", "Schody zachodnie (pracownie)", "stairs", "workshops", 55, 203, false),
  exitWorkshopsWest: createPlace("exit-workshops-west", "Wyjście ewakuacyjne W (pracownie)", "exit", "workshops", 106, 147),
  exitWorkshopsNorth: createPlace("exit-workshops-north", "Wyjście ewakuacyjne N (pracownie)", "exit", "workshops", 347, 89),
  exitWorkshopsSouth: createPlace("exit-workshops-south", "Wyjście ewakuacyjne S (pracownie)", "exit", "workshops", 433, 275)
  
} satisfies Record<string, Place>;

type PlaceKey = keyof typeof placesByKey;

const connections: Array<[PlaceKey, PlaceKey, number?]> = [
  ["entranceMain", "corridorGroundSouth"],
  ["exitGroundSouth", "corridorGroundSouth"],
  ["corridorGroundSouth", "corridorGroundReception"],
  ["corridorGroundReception", "corridorGroundCenter"],
  ["corridorGroundCenter", "corridorGroundWest"],
  ["corridorGroundReception", "corridorGroundEast"],
  ["corridorGroundReception", "corridorGroundNorth"],
  ["corridorGroundEast", "stairsGroundEast"],
  ["corridorGroundWest", "stairsGroundWest"],
  ["room24Informatyka", "corridorGroundWest"],
  ["room22SalaKinowa", "corridorGroundCenter"],
  ["room21Lawka", "corridorGroundCenter"],
  ["room20Spotkania", "corridorGroundCenter"],
  ["room19Kronika", "corridorGroundCenter"],
  ["reception", "corridorGroundEast"],
  ["room10Projekty", "corridorGroundEast"],
  ["room18Pomoc", "corridorGroundSouth"],
  ["kawiarenka", "corridorGroundNorth"],
  ["boisko", "corridorGroundNorth"],
  ["grill", "corridorGroundWest"],
  ["wcGround", "corridorGroundSouth"],

  ["stairsFirstWest", "corridorFirstWest"],
  ["stairsFirstEast", "corridorFirstEast"],
  ["corridorFirstWest", "corridorFirstCenter"],
  ["corridorFirstCenter", "corridorFirstEast"],
  ["corridorFirstEast", "corridorFirstSouth"],
  ["room101", "corridorFirstWest"],
  ["room103", "corridorFirstWest"],
  ["room104", "corridorFirstCenter"],
  ["room105", "corridorFirstCenter"],
  ["room106", "corridorFirstCenter"],
  ["room107", "corridorFirstEast"],
  ["room108", "corridorFirstEast"],
  ["room109", "corridorFirstEast"],
  ["room110", "corridorFirstSouth"],
  ["wcFirst", "corridorFirstSouth"],

  ["stairsSecondWest", "corridorSecondWest"],
  ["stairsSecondEast", "corridorSecondEast"],
  ["corridorSecondWest", "corridorSecondCenter"],
  ["corridorSecondCenter", "corridorSecondEast"],
  ["corridorSecondEast", "corridorSecondSouth"],
  ["room201", "corridorSecondWest"],
  ["room202", "corridorSecondWest"],
  ["room203", "corridorSecondCenter"],
  ["room204", "corridorSecondCenter"],
  ["room205", "corridorSecondCenter"],
  ["room206", "corridorSecondCenter"],
  ["room207", "corridorSecondEast"],
  ["room208", "corridorSecondEast"],
  ["room209", "corridorSecondEast"],
  ["room210", "corridorSecondSouth"],
  ["room211", "corridorSecondSouth"],
  ["wcSecond", "corridorSecondSouth"],

  ["stairsLowWest", "corridorLowMain"],
  ["stairsLowEast", "corridorLowEast"],
  ["corridorLowMain", "corridorLowEast"],
  ["room031", "corridorLowMain"],
  ["room032", "corridorLowMain"],
  ["room036", "corridorLowMain"],
  ["wcLow", "corridorLowEast"],

  ["exitWorkshopsWest", "corridorWorkshopsWest"],
  ["exitWorkshopsNorth", "corridorWorkshopsMain"],
  ["exitWorkshopsSouth", "corridorWorkshopsEast"],
  ["corridorWorkshopsWest", "corridorWorkshopsMain"],
  ["corridorWorkshopsMain", "corridorWorkshopsEast"],
  ["corridorWorkshopsEast", "stairsWorkshopsEast"],
  // Lewe schody pracowni — połączenie z korytarzem zachodnim pracowni
  ["stairsWorkshopsWest", "corridorWorkshopsWest"],
  ["room02", "corridorWorkshopsWest"],
  ["room029", "corridorWorkshopsWest"],
  ["room028", "corridorWorkshopsMain"],
  ["room026", "corridorWorkshopsMain"],
  ["room024", "corridorWorkshopsMain"],
  ["room021", "corridorWorkshopsEast"],
  ["room012", "corridorWorkshopsEast"],
  ["room09a", "corridorWorkshopsEast"],
  ["room09MP", "corridorWorkshopsEast"],
  ["roomTeleinformatyczna", "corridorWorkshopsEast"],
  ["roomSilownia", "corridorWorkshopsEast"],
  ["roomBiblioteka", "corridorWorkshopsMain"],
  ["roomSalaKonf", "corridorWorkshopsMain"],
  ["room051", "corridorWorkshopsEast"],

  ["stairsGroundWest", "stairsFirstWest", 42],
  ["stairsFirstWest", "stairsSecondWest", 42],
  ["stairsGroundEast", "stairsFirstEast", 40],
  ["stairsFirstEast", "stairsSecondEast", 40],
  ["stairsGroundWest", "stairsLowWest", 50],
  ["stairsGroundEast", "stairsLowEast", 48],
  ["stairsLowEast", "stairsWorkshopsEast", 52],
  // Lewe przejście: niski parter ↔ pracownie zawodowe (lewa strona)
  ["stairsLowWest", "stairsWorkshopsWest", 50],
];

for (const [fromKey, toKey, cost] of connections) {
  connectBidirectional(placesByKey[fromKey], placesByKey[toKey], cost);
}

const places = Object.values(placesByKey);

export const schoolLayout = {
  id: "zsl-building-plan",
  name: "Plan budynku szkoły",
  coordinateUnit: "plan-pixel",
  mapImagePath: "/school-plan-full.png",
  mapImageSize: { width: 842, height: 1191 },
  floors: schoolFloors,
  places,
  markedPlaceIds: places.filter((place) => place.marked).map((place) => place.id),
};

const placeById = new Map<string, Place>(places.map((place) => [place.id, place]));

export const getPlaceById = (id: string): Place | undefined => placeById.get(id);

export const getNodeByPlaceId = (id: string): Node | undefined => getPlaceById(id)?.node;

export const getFloorById = (id: FloorId): SchoolFloor | undefined =>
  schoolLayout.floors.find((floor) => floor.id === id);
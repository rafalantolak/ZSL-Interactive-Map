import Node from "./node";

export type PlaceKind = "room" | "corridor" | "stairs" | "entrance" | "exit";

export type Place = {
  id: string;
  label: string;
  kind: PlaceKind;
  marked: boolean;
  node: Node;
};

type PlaceKey =
  | "entranceMain"
  | "exitEmergencyWest"
  | "exitEmergencyEast"
  | "reception"
  | "projectyTechniczne"
  | "room18PomocPrzedmedyczna"
  | "wc"
  | "kawiarenka"
  | "bolsko"
  | "grill"
  | "room20SpotkaniaAbsolwentow"
  | "kronikaSzkolna"
  | "room21LalkaSzkolna"
  | "room22SalaKinowa"
  | "room24Informatyka"
  | "corridorEastEntry"
  | "corridorReceptionTop"
  | "corridorWestTop"
  | "corridorHallNorth"
  | "corridorHallCenter"
  | "corridorGrill"
  | "corridorRightTop"
  | "corridorRight20"
  | "corridorRight21"
  | "corridorRight22"
  | "corridorRight24"
  | "stairsCentral"
  | "stairsSouth";

const createPlace = (
  id: string,
  label: string,
  kind: PlaceKind,
  posX: number,
  posY: number,
  marked = false
): Place => ({
  id,
  label,
  kind,
  marked,
  node: new Node(posX, posY),
});

const connectBidirectional = (a: Place, b: Place): void => {
  a.node.addNeighbor(b.node);
  b.node.addNeighbor(a.node);
};

const placesByKey: Record<PlaceKey, Place> = {
  entranceMain: createPlace("entrance-main", "Wejście", "entrance", 842, 334, true),
  exitEmergencyWest: createPlace(
    "exit-emergency-west",
    "Wyjście ewakuacyjne (zachód)",
    "exit",
    152,
    336,
    true
  ),
  exitEmergencyEast: createPlace(
    "exit-emergency-east",
    "Wyjście ewakuacyjne (wschód)",
    "exit",
    792,
    348,
    true
  ),
  reception: createPlace("reception", "Recepcja", "room", 560, 304, true),
  projectyTechniczne: createPlace(
    "room-projekty-techniczne",
    "Projekty techniczne wczoraj i dziś",
    "room",
    706,
    192,
    true
  ),
  room18PomocPrzedmedyczna: createPlace(
    "room-18-pomoc-przedmedyczna",
    "18 Pomoc przedmedyczna",
    "room",
    532,
    366,
    true
  ),
  wc: createPlace("room-wc", "WC", "room", 806, 410, true),
  kawiarenka: createPlace("kawiarenka", "Kawiarenka", "room", 452, 430, true),
  bolsko: createPlace("bolsko", "Boisko", "room", 258, 640, true),
  grill: createPlace("grill", "Grill", "room", 498, 860, true),
  room20SpotkaniaAbsolwentow: createPlace(
    "room-20-spotkania-absolwentow",
    "20 Spotkania absolwentów",
    "room",
    628,
    536,
    true
  ),
  kronikaSzkolna: createPlace(
    "kronika-szkolna",
    "Odszukaj siebie w klasowej kronice szkolnej",
    "room",
    654,
    418,
    true
  ),
  room21LalkaSzkolna: createPlace(
    "room-21-lalka-szkolna",
    "21 Lalka szkolna",
    "room",
    624,
    628,
    true
  ),
  room22SalaKinowa: createPlace(
    "room-22-sala-kinowa",
    "22 Sala kinowa",
    "room",
    626,
    854,
    true
  ),
  room24Informatyka: createPlace(
    "room-24-informatyka",
    "24 Informatyka",
    "room",
    624,
    1050,
    true
  ),
  corridorEastEntry: createPlace("corridor-east-entry", "Korytarz wejściowy", "corridor", 770, 334),
  corridorReceptionTop: createPlace(
    "corridor-reception-top",
    "Korytarz przy recepcji",
    "corridor",
    610,
    336
  ),
  corridorWestTop: createPlace("corridor-west-top", "Korytarz zachodni", "corridor", 420, 336),
  corridorHallNorth: createPlace("corridor-hall-north", "Przejście północne hali", "corridor", 560, 398),
  corridorHallCenter: createPlace("corridor-hall-center", "Przejście centralne hali", "corridor", 430, 640),
  corridorGrill: createPlace("corridor-grill", "Przejście przy grillu", "corridor", 560, 862),
  corridorRightTop: createPlace("corridor-right-top", "Korytarz prawy (góra)", "corridor", 716, 392),
  corridorRight20: createPlace("corridor-right-20", "Korytarz prawy (s.20)", "corridor", 716, 536),
  corridorRight21: createPlace("corridor-right-21", "Korytarz prawy (s.21)", "corridor", 716, 628),
  corridorRight22: createPlace("corridor-right-22", "Korytarz prawy (s.22)", "corridor", 716, 854),
  corridorRight24: createPlace("corridor-right-24", "Korytarz prawy (s.24)", "corridor", 716, 1050),
  stairsCentral: createPlace("stairs-central", "Schody centralne", "stairs", 692, 350, true),
  stairsSouth: createPlace("stairs-south", "Schody południowe", "stairs", 760, 1022, true),
};

const connections: Array<[PlaceKey, PlaceKey]> = [
  ["entranceMain", "corridorEastEntry"],
  ["exitEmergencyEast", "corridorEastEntry"],
  ["corridorEastEntry", "corridorReceptionTop"],
  ["corridorReceptionTop", "corridorWestTop"],
  ["corridorReceptionTop", "corridorHallNorth"],
  ["corridorHallNorth", "corridorHallCenter"],
  ["corridorHallCenter", "corridorGrill"],
  ["corridorWestTop", "exitEmergencyWest"],
  ["corridorEastEntry", "corridorRightTop"],
  ["corridorRightTop", "corridorRight20"],
  ["corridorRight20", "corridorRight21"],
  ["corridorRight21", "corridorRight22"],
  ["corridorRight22", "corridorRight24"],
  ["corridorRight24", "stairsSouth"],
  ["corridorReceptionTop", "stairsCentral"],
  ["stairsCentral", "corridorRightTop"],
  ["reception", "corridorReceptionTop"],
  ["projectyTechniczne", "corridorRightTop"],
  ["room18PomocPrzedmedyczna", "corridorReceptionTop"],
  ["wc", "corridorEastEntry"],
  ["kawiarenka", "corridorHallNorth"],
  ["bolsko", "corridorHallCenter"],
  ["grill", "corridorGrill"],
  ["kronikaSzkolna", "corridorRightTop"],
  ["room20SpotkaniaAbsolwentow", "corridorRight20"],
  ["room21LalkaSzkolna", "corridorRight21"],
  ["room22SalaKinowa", "corridorRight22"],
  ["room24Informatyka", "corridorRight24"],
];

for (const [fromKey, toKey] of connections) {
  connectBidirectional(placesByKey[fromKey], placesByKey[toKey]);
}

export const floorLayout = {
  id: "floor-main",
  name: "Piętro - schemat oznaczonych miejsc",
  scale: 1,
  coordinateUnit: "plan-pixel",
  places: Object.values(placesByKey),
  markedPlaceIds: Object.values(placesByKey)
    .filter((place) => place.marked)
    .map((place) => place.id),
};

export const getPlaceById = (id: string): Place | undefined =>
  floorLayout.places.find((place) => place.id === id);

export const getNodeByPlaceId = (id: string): Node | undefined => getPlaceById(id)?.node;

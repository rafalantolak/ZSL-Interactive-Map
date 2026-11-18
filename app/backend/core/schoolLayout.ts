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

  // Pracownie zawodowe – Sale i wyjścia
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

  stairsWorkshopsEast: createPlace("stairs-workshops-east", "Schody (pracownie)", "stairs", "workshops", 438, 280, false),
  stairsWorkshopsWest: createPlace("stairs-workshops-west", "Schody zachodnie (pracownie)", "stairs", "workshops", 55, 203, false),
  exitWorkshopsWest: createPlace("exit-workshops-west", "Wyjście ewakuacyjne W (pracownie)", "exit", "workshops", 106, 147),
  exitWorkshopsNorth: createPlace("exit-workshops-north", "Wyjście ewakuacyjne N (pracownie)", "exit", "workshops", 347, 89),
  exitWorkshopsSouth: createPlace("exit-workshops-south", "Wyjście ewakuacyjne S (pracownie)", "exit", "workshops", 433, 275),

  // Pracownie zawodowe – Szczegółowa siatka korytarzy (punkt po punkcie)
  // 1. Główny korytarz poziomy (północny)
  cwMain01: createPlace("cw-main-01", "Korytarz pracownie M01", "corridor", "workshops", 106, 147, false),
  cwMain02: createPlace("cw-main-02", "Korytarz pracownie M02", "corridor", "workshops", 122, 147, false),
  cwMain03: createPlace("cw-main-03", "Korytarz pracownie M03", "corridor", "workshops", 138, 147, false),
  cwMain04: createPlace("cw-main-04", "Korytarz pracownie M04", "corridor", "workshops", 154, 147, false),
  cwMain05: createPlace("cw-main-05", "Korytarz pracownie M05", "corridor", "workshops", 170, 147, false),
  cwMain06: createPlace("cw-main-06", "Korytarz pracownie M06", "corridor", "workshops", 186, 147, false),
  cwMain07: createPlace("cw-main-07", "Korytarz pracownie M07", "corridor", "workshops", 204, 147, false),
  cwMain08: createPlace("cw-main-08", "Korytarz pracownie M08", "corridor", "workshops", 220, 147, false),
  cwMain09: createPlace("cw-main-09", "Korytarz pracownie M09", "corridor", "workshops", 236, 147, false),
  cwMain10: createPlace("cw-main-10", "Korytarz pracownie M10", "corridor", "workshops", 252, 147, false),
  cwMain11: createPlace("cw-main-11", "Korytarz pracownie M11", "corridor", "workshops", 268, 147, false),
  cwMain12: createPlace("cw-main-12", "Korytarz pracownie M12", "corridor", "workshops", 284, 147, false),
  cwMain13: createPlace("cw-main-13", "Korytarz pracownie M13", "corridor", "workshops", 300, 147, false),
  cwMain14: createPlace("cw-main-14", "Korytarz pracownie M14", "corridor", "workshops", 316, 147, false),
  cwMain15: createPlace("cw-main-15", "Korytarz pracownie M15", "corridor", "workshops", 332, 147, false),
  cwMain16: createPlace("cw-main-16", "Korytarz pracownie M16", "corridor", "workshops", 347, 147, false),
  cwMain17: createPlace("cw-main-17", "Korytarz pracownie M17", "corridor", "workshops", 362, 147, false),
  cwMain18: createPlace("cw-main-18", "Korytarz pracownie M18", "corridor", "workshops", 378, 147, false),
  cwMain19: createPlace("cw-main-19", "Korytarz pracownie M19", "corridor", "workshops", 394, 147, false),
  cwMain20: createPlace("cw-main-20", "Korytarz pracownie M20", "corridor", "workshops", 410, 147, false),
  cwMain21: createPlace("cw-main-21", "Korytarz pracownie M21", "corridor", "workshops", 424, 147, false),
  cwMain22: createPlace("cw-main-22", "Korytarz pracownie M22", "corridor", "workshops", 436, 147, false),

  // 2. Wyjście północne
  cwNorth01: createPlace("cw-north-01", "Korytarz pracownie N01", "corridor", "workshops", 347, 134, false),
  cwNorth02: createPlace("cw-north-02", "Korytarz pracownie N02", "corridor", "workshops", 347, 120, false),
  cwNorth03: createPlace("cw-north-03", "Korytarz pracownie N03", "corridor", "workshops", 347, 105, false),

  // 3. Zachodnie skrzydło (przy schodach i pracowniach 028/029)
  cwWest01: createPlace("cw-west-01", "Korytarz pracownie W01", "corridor", "workshops", 122, 162, false),
  cwWest02: createPlace("cw-west-02", "Korytarz pracownie W02", "corridor", "workshops", 122, 177, false),
  cwWest03: createPlace("cw-west-03", "Korytarz pracownie W03", "corridor", "workshops", 122, 192, false),
  cwWest04: createPlace("cw-west-04", "Korytarz pracownie W04", "corridor", "workshops", 122, 203, false),
  cwWest05: createPlace("cw-west-05", "Korytarz pracownie W05", "corridor", "workshops", 105, 203, false),
  cwWest06: createPlace("cw-west-06", "Korytarz pracownie W06", "corridor", "workshops", 88, 203, false),
  cwWest07: createPlace("cw-west-07", "Korytarz pracownie W07", "corridor", "workshops", 71, 203, false),
  cwWest08: createPlace("cw-west-08", "Korytarz pracownie W08", "corridor", "workshops", 138, 192, false),
  cwWest09: createPlace("cw-west-09", "Korytarz pracownie W09", "corridor", "workshops", 154, 192, false),
  cwWest10: createPlace("cw-west-10", "Korytarz pracownie W10", "corridor", "workshops", 172, 192, false),
  cwWest11: createPlace("cw-west-11", "Korytarz pracownie W11", "corridor", "workshops", 190, 192, false),

  // 4. Łącznik centralny pionowy i dolny korytarz poziomy (przy 024, bibliotece, 026)
  cwMid01: createPlace("cw-mid-01", "Korytarz pracownie C01", "corridor", "workshops", 268, 162, false),
  cwMid02: createPlace("cw-mid-02", "Korytarz pracownie C02", "corridor", "workshops", 268, 177, false),
  cwMid03: createPlace("cw-mid-03", "Korytarz pracownie C03", "corridor", "workshops", 268, 192, false),
  cwMid04: createPlace("cw-mid-04", "Korytarz pracownie C04", "corridor", "workshops", 268, 207, false),
  cwMid05: createPlace("cw-mid-05", "Korytarz pracownie C05", "corridor", "workshops", 268, 222, false),
  cwSouth01: createPlace("cw-south-01", "Korytarz pracownie S01", "corridor", "workshops", 225, 222, false),
  cwSouth02: createPlace("cw-south-02", "Korytarz pracownie S02", "corridor", "workshops", 240, 222, false),
  cwSouth03: createPlace("cw-south-03", "Korytarz pracownie S03", "corridor", "workshops", 254, 222, false),
  cwSouth04: createPlace("cw-south-04", "Korytarz pracownie S04", "corridor", "workshops", 284, 222, false),
  cwSouth05: createPlace("cw-south-05", "Korytarz pracownie S05", "corridor", "workshops", 300, 222, false),
  cwSouth06: createPlace("cw-south-06", "Korytarz pracownie S06", "corridor", "workshops", 316, 222, false),
  cwSouth07: createPlace("cw-south-07", "Korytarz pracownie S07", "corridor", "workshops", 332, 222, false),
  cwSouth08: createPlace("cw-south-08", "Korytarz pracownie S08", "corridor", "workshops", 348, 222, false),
  cwSouth09: createPlace("cw-south-09", "Korytarz pracownie S09", "corridor", "workshops", 364, 222, false),
  cwSouth10: createPlace("cw-south-10", "Korytarz pracownie S10", "corridor", "workshops", 380, 222, false),
  cwSouth11: createPlace("cw-south-11", "Korytarz pracownie S11", "corridor", "workshops", 396, 222, false),
  cwSouth12: createPlace("cw-south-12", "Korytarz pracownie S12", "corridor", "workshops", 412, 222, false),
  cwSouth13: createPlace("cw-south-13", "Korytarz pracownie S13", "corridor", "workshops", 424, 222, false),
  cwSouth14: createPlace("cw-south-14", "Korytarz pracownie S14", "corridor", "workshops", 436, 222, false),

  // 5. Wschodni ciąg pionowy (wzdłuż 09MP, 09a, 012, wyjścia S i schodów)
  cwEast01: createPlace("cw-east-01", "Korytarz pracownie E01", "corridor", "workshops", 436, 134, false),
  cwEast02: createPlace("cw-east-02", "Korytarz pracownie E02", "corridor", "workshops", 436, 162, false),
  cwEast03: createPlace("cw-east-03", "Korytarz pracownie E03", "corridor", "workshops", 436, 177, false),
  cwEast04: createPlace("cw-east-04", "Korytarz pracownie E04", "corridor", "workshops", 436, 192, false),
  cwEast05: createPlace("cw-east-05", "Korytarz pracownie E05", "corridor", "workshops", 436, 207, false),
  cwEast06: createPlace("cw-east-06", "Korytarz pracownie E06", "corridor", "workshops", 436, 236, false),
  cwEast07: createPlace("cw-east-07", "Korytarz pracownie E07", "corridor", "workshops", 436, 250, false),
  cwEast08: createPlace("cw-east-08", "Korytarz pracownie E08", "corridor", "workshops", 436, 264, false),

  // 6. Przejście wschodnie w kierunku sali 051 Bezpieczeństwo sieci
  cwFarEast01: createPlace("cw-fareast-01", "Korytarz pracownie FE01", "corridor", "workshops", 452, 222, false),
  cwFarEast02: createPlace("cw-fareast-02", "Korytarz pracownie FE02", "corridor", "workshops", 470, 222, false),
  cwFarEast03: createPlace("cw-fareast-03", "Korytarz pracownie FE03", "corridor", "workshops", 488, 222, false),
  cwFarEast04: createPlace("cw-fareast-04", "Korytarz pracownie FE04", "corridor", "workshops", 506, 222, false),
  cwFarEast05: createPlace("cw-fareast-05", "Korytarz pracownie FE05", "corridor", "workshops", 522, 234, false),
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

  // --- Połączenia piętra Pracownie zawodowe ---
  // Główny korytarz poziomy
  ["exitWorkshopsWest", "cwMain01"],
  ["cwMain01", "cwMain02"],
  ["cwMain02", "cwMain03"],
  ["cwMain03", "cwMain04"],
  ["cwMain04", "cwMain05"],
  ["cwMain05", "cwMain06"],
  ["cwMain06", "cwMain07"],
  ["cwMain07", "cwMain08"],
  ["cwMain08", "cwMain09"],
  ["cwMain09", "cwMain10"],
  ["cwMain10", "cwMain11"],
  ["cwMain11", "cwMain12"],
  ["cwMain12", "cwMain13"],
  ["cwMain13", "cwMain14"],
  ["cwMain14", "cwMain15"],
  ["cwMain15", "cwMain16"],
  ["cwMain16", "cwMain17"],
  ["cwMain17", "cwMain18"],
  ["cwMain18", "cwMain19"],
  ["cwMain19", "cwMain20"],
  ["cwMain20", "cwMain21"],
  ["cwMain21", "cwMain22"],

  // Odnoga do wyjścia północnego
  ["cwMain16", "cwNorth01"],
  ["cwNorth01", "cwNorth02"],
  ["cwNorth02", "cwNorth03"],
  ["cwNorth03", "exitWorkshopsNorth"],

  // Zachodnie skrzydło i schody zachodnie
  ["cwMain02", "cwWest01"],
  ["cwWest01", "cwWest02"],
  ["cwWest02", "cwWest03"],
  ["cwWest03", "cwWest04"],
  ["cwWest04", "cwWest05"],
  ["cwWest05", "cwWest06"],
  ["cwWest06", "cwWest07"],
  ["cwWest07", "stairsWorkshopsWest"],
  ["cwWest03", "cwWest08"],
  ["cwWest08", "cwWest09"],
  ["cwWest09", "cwWest10"],
  ["cwWest10", "cwWest11"],

  // Centralny łącznik pionowy i dolny korytarz poziomy
  ["cwMain11", "cwMid01"],
  ["cwMid01", "cwMid02"],
  ["cwMid02", "cwMid03"],
  ["cwMid03", "cwMid04"],
  ["cwMid04", "cwMid05"],
  ["cwMid05", "cwSouth03"],
  ["cwSouth01", "cwSouth02"],
  ["cwSouth02", "cwSouth03"],
  ["cwSouth03", "cwSouth04"],
  ["cwSouth04", "cwSouth05"],
  ["cwSouth05", "cwSouth06"],
  ["cwSouth06", "cwSouth07"],
  ["cwSouth07", "cwSouth08"],
  ["cwSouth08", "cwSouth09"],
  ["cwSouth09", "cwSouth10"],
  ["cwSouth10", "cwSouth11"],
  ["cwSouth11", "cwSouth12"],
  ["cwSouth12", "cwSouth13"],
  ["cwSouth13", "cwSouth14"],

  // Wschodni korytarz pionowy (góra–dół)
  ["cwMain22", "cwEast01"],
  ["cwMain22", "cwEast02"],
  ["cwEast02", "cwEast03"],
  ["cwEast03", "cwEast04"],
  ["cwEast04", "cwEast05"],
  ["cwEast05", "cwSouth14"],
  ["cwSouth14", "cwEast06"],
  ["cwEast06", "cwEast07"],
  ["cwEast07", "cwEast08"],
  ["cwEast08", "exitWorkshopsSouth"],
  ["cwEast08", "stairsWorkshopsEast"],

  // Przejście wschodnie do sali 051
  ["cwSouth14", "cwFarEast01"],
  ["cwFarEast01", "cwFarEast02"],
  ["cwFarEast02", "cwFarEast03"],
  ["cwFarEast03", "cwFarEast04"],
  ["cwFarEast04", "cwFarEast05"],

  // Połączenia sal na piętrze Pracownie zawodowe z najbliższymi punktami korytarza
  ["room02", "cwMain07"],
  ["room029", "cwWest09"],
  ["room028", "cwWest11"],
  ["room024", "cwSouth01"],
  ["roomBiblioteka", "cwSouth03"],
  ["roomSalaKonf", "cwSouth04"],
  ["room021", "cwMid03"],
  ["room026", "cwSouth10"],
  ["roomSilownia", "cwMain19"],
  ["roomTeleinformatyczna", "cwEast04"],
  ["room09MP", "cwEast01"],
  ["room09a", "cwEast02"],
  ["room012", "cwEast07"],
  ["room051", "cwFarEast05"],

  // Połączenia schodów między piętrami
  ["stairsGroundWest", "stairsFirstWest", 42],
  ["stairsFirstWest", "stairsSecondWest", 42],
  ["stairsGroundEast", "stairsFirstEast", 40],
  ["stairsFirstEast", "stairsSecondEast", 40],
  ["stairsGroundWest", "stairsLowWest", 50],
  ["stairsGroundEast", "stairsLowEast", 48],
  ["stairsLowEast", "stairsWorkshopsEast", 52],
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
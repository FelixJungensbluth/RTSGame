// Map between index and filename
var IsometricMap = {

  // Array inwelchen alle Bilder für die Tiles gespeichert werden
  tiles: [
    // "images/dirt.png",
    "assets/dirtHigh.png", // 0
    "assets/grass.png", // 1
    "assets/water.png", // 2
    "assets/waterBeachCornerEast.png", // 3
    "assets/waterBeachCornerNorth.png", // 4
    "assets/waterBeachCornerSouth.png", // 5
    "assets/waterBeachCornerWest.png", // 6
    "assets/waterBeachEast.png", // 7
    "assets/waterBeachNorth.png", // 8
    "assets/waterBeachSouth.png", // 9
    "assets/waterBeachWest.png", // 10
    "assets/waterCornerEast.png", // 11
    "assets/waterCornerNorth.png", // 12
    "assets/waterCornerSouth.png", // 13
    "assets/waterCornerWest.png", // 14
    "assets/waterEast.png", // 15
    "assets/waterNorth.png", // 16
    "assets/waterSouth.png", // 17
    "assets/waterWest.png", // 18
    "assets/bridgeEast.png", // 19
    "assets/bridgeNorth.png", // 20
    "assets/crossroad.png", // 21
    // "images/hillCornerEast.png",
    // "images/hillCornerNW.png",
    // "images/hillCornerSE.png",
    // "images/hillCornerWest.png",
    // "images/hillEast.png",
    // "images/hillNorth.png",
    // "images/hillRoadEast.png",
    // "images/hillRoadNorth.png",
    // "images/hillRoadSouth.png",
    // "images/hillRoadWest.png",
    // "images/hillSouth.png",
    // "images/hillWest.png",
    "assets/lot.png", // 22
    "assets/lotCornerEast.png", // 23
    "assets/lotCornerNorth.png", // 24
    "assets/lotCornerSouth.png", // 25
    "assets/lotCornerWest.png", // 26
    "assets/lotEast.png", // 27
    "assets/lotExitEast.png", // 28
    "assets/lotExitNorth.png", // 29
    "assets/lotExitSouth.png", // 30
    "assets/lotExitWest.png", // 31
    "assets/lotNorth.png", // 32
    "assets/lotPark.png", // 33
    "assets/lotSouth.png", // 34
    "assets/lotWest.png", // 35
    "assets/roadCornerES.png", // 36
    "assets/roadCornerNE.png", // 37
    "assets/roadCornerNW.png", // 38
    "assets/roadCornerWS.png", // 39
    "assets/roadEast.png", // 40
    "assets/roadEndEast.png", // 41
    "assets/roadEndNorth.png", // 42
    "assets/roadEndSouth.png", // 43
    "assets/roadEndWest.png", // 44
    "assets/roadNorth.png", // 45
    "assets/roadTEast.png", // 46
    "assets/roadTNorth.png", // 47
    "assets/roadTSouth.png", // 48
    "assets/roadTWest.png", //49
    "assets/mine.png", // 50


  ],

  // Array inwelchen alle Bilder für die Gebäude gespeichert werden
  buildings: [
    "assets/turm.png",
  ],

  // Map-Layout
  map: [
    [2, 1, 40, 1, 1, 40, 1, 1, 5, 10, 10, 2, 1,1,2],
    [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1,1,2],
    [2, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 2, 1,1,2],
    [2, 1, 0, 1, 0, 50, 0, 1, 0, 1, 0, 2, 1,1,2],
    [2, 23, 35, 24, 1, 40, 1, 41, 1, 1, 1, 2,1,1,2],
    [2, 32, 33, 34, 1, 39, 46, 49, 45, 37, 1, 2, 1,1,2],
    [2, 32, 33, 30, 45, 50, 49, 45, 45, 38, 1, 2, 1,1,2],
    [2, 25, 28, 26, 36, 37, 1, 1, 1, 1, 1, 2, 1,1,2],
    [2, 1, 48, 45, 38, 40, 1, 1, 3, 7, 7, 2, 1,1,2],
    [2, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 1,1,2],
    [2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,1,2],
    [2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,1,2],
    [2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,1,2],
    [2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,1,2],
    [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2,2,2],
  ],

  // Platzierte Gebäude Layout 
  buildingMap: [
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,0,0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,0,0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,0,0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,0,0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,0,0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,0,0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,0,0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,0,0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,0,0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,0,0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,0,0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,0,0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,0,0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,0,0],
  ],
  grid: [
    [0, 0, 0, 0, 0, 0, 5, 5, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 5, 5, 0, 0, 0, 0, 0,0,0],
    [0, 0, 0, 0, 0, 0, 5, 5, 0, 0, 0, 0, 0,0,0],
    [0, 0, 0, 0, 0, 0, 5, 5, 0, 0, 0, 0, 0,0,0],
    [0, 0, 0, 0, 0, 0, 5, 5, 0, 0, 0, 0, 0,0,0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,0,0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,0,0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,0,0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,0,0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,0,0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,0,0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,0,0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,0,0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,0,0],
  ],
};
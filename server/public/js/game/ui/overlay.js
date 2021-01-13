var mapOverlay;
var timeOverlay;
var resourceOverlay;
function displayOverlay(){
    mapOverlay = scene.add.image(200, window.innerHeight - 200, 'olMap').setScrollFactor(0);
    timeOverlay = scene.add.image(109,17,'olTime').setScrollFactor(0);
    resourceOverlay = scene.add.image(90, 48, 'olResource').setScrollFactor(0);
}
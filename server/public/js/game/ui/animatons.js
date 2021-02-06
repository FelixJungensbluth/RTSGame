var dmgAnimation;

/*
Eine Explosionsanimation wird abgespielt 
*/
function playExplosion(scene, x, y) {

    const config1 = {
        key: 'explode1',
        frames: 'boom',
        frameRate: 20,
    };

    scene.anims.create(config1);
    var explosion = scene.add.sprite(x, y, 'boom').play('explode1');
    explosion.setDepth(2000)
}
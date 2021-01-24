
var dmgAnimation;
function playExplosion(scene ,x ,y) {

    const config1 = {
        key: 'explode1',
        frames: 'boom',
        frameRate: 20,
    };

    scene.anims.create(config1);
    var explosion = scene.add.sprite(x, y, 'boom').play('explode1');
    explosion.setDepth(5)
}

function playDamage(scene ,x ,y) {

    const config1 = {
        key: 'explode2',
        frames: 'boom2',
        frameRate: 23,
    };

    scene.anims.create(config1);
    const dmgSprite = scene.add.sprite(x, y, 'boom2')
    dmgSprite.play('explode2');
    dmgSprite.setDepth(5)

   if(!play){
    dmgSprite.destroy();
   }

     
}


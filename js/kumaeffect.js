enchant();
var KUMA = "chara1.gif";
window.onload = function(){
  var game = new Game(320, 320);
  game.preload("chara1.gif");
  game.onload = function(){
    var scene = game.rootScene;
    scene.backgroundColor ="black";
    var kuma = new Sprite(32, 32);
    kuma.moveTo(-50, -50);
    kuma.image = game.assets["chara1.gif"];
    scene.addChild(kuma);
    
    kuma.tl.moveTo(160-16, 160-16, 30).cue({
        0: function(){this.frame =  1;},
       30: function(){this.frame =  2;},
       60: function(){this.frame =  3;},
       90: function(){this.frame =  4;},
      120: function(){this.frame =  5;},
      150: function(){this.frame =  6;},
      180: function(){this.frame =  7;},
      210: function(){this.frame =  8;},
      240: function(){this.frame = 10;},
      270: function(){this.frame = 11;},
      300: function(){this.frame = 12;},
      330: function(){this.frame = 13;},
      360: function(){
        this.frame = 0;
        alert("完了");
      },
    });
  };
  game.start();
};

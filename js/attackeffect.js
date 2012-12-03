//おまじない
enchant();
//定数
var WIDTH = 320;
var HEIGHT = 320;
var FPS = 60;
var AVATAR_CODE = "2:2:1:2004:21230:22480";

//メイン
window.onload = function(){
  var bg, hero, rival, label;
  var game = new Game(WIDTH, HEIGHT);
  game.fps = FPS;//FPSの設定
  game.touchFlag = true;
  game.popUp = 0;
  
  //ロード完了後呼び出し
  game.onload = function(){
    //背景生成・表示
    bg = new Sprite(WIDTH, HEIGHT);
    bg.backgroundColor = "white";
    game.rootScene.addChild(bg);
    
    //ラベル
    label = new Label("");
    game.rootScene.addChild(label);
    
    //自キャラ生成・表示
    hero = new Avatar(AVATAR_CODE);
    hero.moveTo(0, 50);//座標一括設定
    hero.power = 0;//攻撃力の設定
    hero.attackFlag = false;//攻撃フラグ
    hero.damageFlag = false;//ダメージフラグ
    game.rootScene.addChild(hero);
    //自キャラの定期処理
    hero.addEventListener(Event.ENTER_FRAME, function(){
      //攻撃時
      if(hero.attackFlag == true){
        hero.action = "run";//走るアニメーション
        hero.attackFlag = false;//自キャラの攻撃フラグを折る
        hero.power = Math.floor(Math.random() * 4 + 1);//与えるダメージ量を算出
        //敵前に移動した後に
        hero.tl.moveTo(rival.x - 64, rival.y, 10).then(function(){
          rival.damageFlag = true;//敵キャラのダメージフラグを立てる
        });
        hero.action = "attack";//攻撃アニメーション
        //30フレーム待った後に
        hero.tl.delay(30).then(function(){
          hero.scaleX *= -1;//キャラの向きを反転する(左向きへ)
          hero.action = "run";//走るアニメーション
          //30フレームかけて定位置へ移動した後に
          hero.tl.moveTo(0, 50, 30).then(function(){
            hero.action = "stop";//アニメーションを止める
            hero.scaleX *= -1;//キャラの向きを反転する(右向きへ)
          });
        });
      }
    });
    
    //敵キャラ生成・表示
    rival = new Avatar();
    rival.moveTo(150, 50);//座標一括設定
    rival.scaleX *= -1;//画像の向きを逆向きにする(左向き)
    rival.hp = 10;//HPの設定
    rival.power = 0;//攻撃力の設定
    rival.attackFlag = false;//攻撃フラグ
    rival.damageFlag = false;//ダメージフラグ
    game.rootScene.addChild(rival);
    //敵キャラの定期処理
    rival.addEventListener(Event.ENTER_FRAME, function(){
      //ダメージを受けたとき
      if(rival.damageFlag == true){
        rival.hp = rival.hp - hero.power;//ダメージ計算
        rival.damageFlag = false;//ダメージフラグを解除する
        rival.tl.delay(2).then(function(){
          rival.action = "damage";//被弾アニメーション
          //右へ5フレームかけて30px動いた後
          rival.tl.moveBy(30,0,5).then(function(){
            game.popUp = 2;//敵側にポップアップの準備をする
            //HPが残っていたら
            if(rival.hp > 0){
              //ダメージを受けたことを表す点滅処理をした後に
              rival.tl.fadeOut(10).fadeIn(10).delay(20).then(function(){
                rival.action = "run";//走るアニメーションへ
              });
              //左へ10フレームかけて30px動いた後
              rival.tl.moveBy(-20,0,10).then(function(){
                rival.action = "stop";//立ち止まる
                game.touchFlag = true;//タッチを可能にする
              });
            }else{
              rival.hp = 0;//HPのマイナス分を0へ戻す
              rival.action = "dead";//死ぬアニメーション
              //60フレームかけてフェードアウトした後に
              rival.tl.fadeOut(60).then(function(){
                game.rootScene.removeChild(rival);
              });
            }
          });
        });
      }
    });
  };
  //ダメージのポップアップ関数
  game.popUpDamage = function(x, y, damagetext){
    var damage = new Label(damagetext);
    damage.font = "16px monospace";//フォント指定
    damage.moveTo(x + 32, y);//ポップアップ座標
    game.rootScene.addChild(damage);
    //定期処理
    damage.addEventListener(Event.ENTER_FRAME, function(){
      //30フレームかけて上へ30px移動し、20フレームかけてフェードアウトした後に
      damage.tl.moveBy(0, -30, 30).fadeOut(20).then(function(){
        game.rootScene.removeChild(damage);
      });
    });
  };
  //ゲームの定期処理
  game.rootScene.addEventListener(Event.ENTER_FRAME, function(){
    //各種表示情報の更新
    label.text = "敵のHP：" + rival.hp +
      "<BR>ダメージ量：" + hero.power +
      "<BR>popUp：" + game.popUp;
    //ダメージポップアップ
    if(game.popUp != 0){
      if(game.popUp == 1){
        game.popUpDamage(hero.x, hero.y, rival.power);//自キャラにポップアップ
        game.popUp = 0;
      }else if(game.popUp == 2){
        game.popUpDamage(rival.x, rival.y, hero.power);//敵キャラにポップアップ
        game.popUp = 0;
      }
    }
  });
  //ゲームにタッチした時の処理
  game.rootScene.addEventListener(Event.TOUCH_START, function(){
    //タッチが可能なら
    if(game.touchFlag == true){
      game.touchFlag = false;//タッチを不可能にする
      hero.attackFlag = true;//攻撃へ移行する
    }
  });  
  //ゲームスタート
  game.start();
};

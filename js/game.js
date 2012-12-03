/**
 * Equipment Change sample
 *
 * The MIT License
 * 
 Copyright (c) 2012 alkaid_72th

 Permission is hereby granted, free of charge, to any person obtaining
 a copy of this software and associated documentation files (the
 "Software"), to deal in the Software without restriction, including
 without limitation the rights to use, copy, modify, merge, publish,
 distribute, sublicense, and/or sell copies of the Software, and to
 permit persons to whom the Software is furnished to do so, subject to
 the following conditions:

 The above copyright notice and this permission notice shall be
 included in all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
 MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS
 BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN
 ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
 CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 SOFTWARE.
*/



/*
 * おまじない
 */
enchant();



/*
 * 定数
 */
var GAME_WIDTH  = 320;//ゲームの幅
var GAME_HEIGHT = 320;//ゲームの高さ
var GAME_FPS    =  30;//ゲームの更新速度

var PLAYER_X = 128;//プレイヤーのx座標
var PLAYER_Y = 128;//プレイヤーのy座標

//状態
var MODE = [
  "性別",
  "髪型",
  "髪色",
  "武器",
  "防具",
  "装飾"
];

//性別
var SEX = [
  [1, "女性"],
  [2, "男性"]
];

//髪型
var HAIR = [
  [1, "髪型1"],
  [2, "髪型2"],
  [3, "髪型3"],
  [4, "髪型4"],
  [5, "髪型5"]
];

//髪色
var COLOR = [
  [1, "色1"],
  [2, "色2"],
  [3, "色3"],
  [4, "色4"],
  [5, "色5"]
];

//武器
var WEAPON = [
  //コード,名前,HP,攻撃,必殺,反撃
  [2088, "武器1", 1, 1, 1, 1],
  [2098, "武器2", 2, 2, 2, 2],
  [2099, "武器3", 3, 3, 3, 3],
  [2506, "武器4", 4, 4, 4, 4],
  [2597, "武器5", 5, 5, 5, 5]
];

//防具
var ARMOR = [
  [2114, "防具1", 1, 1, 1, 1],
  [2101, "防具2", 2, 2, 2, 2],
  [2105, "防具3", 3, 3, 3, 3],
  [21156,"防具4", 4, 4, 4, 4],
  [21250,"防具5", 5, 5, 5, 5]
];

//装飾
var ACCESSORIES = [
  [2200, "装飾1", 1, 1, 1, 1],
  [2214, "装飾2", 2, 2, 2, 2],
  [2215, "装飾3", 3, 3, 3, 3],
  [2211, "装飾4", 4, 4, 4, 4],
  [2206, "装飾5", 5, 5, 5, 5]
];



/*
 * グローバル変数
 */
var scene, pad, player;//表示させるモノ関連
var information_label, status_label, equipment_label;//テキスト関連
var player_cord;//プレイヤーのアバターコード
var mode = sex = hair = color = wea = arm = acc = 0;//装備変更関連
var direction_flag = 0;//十字キー押下関連フラグ



/*
 * メイン処理
 */
window.onload = function(){
  //ゲームオブジェクト生成
  game = new Game(GAME_WIDTH, GAME_HEIGHT);
  game.fps = GAME_FPS;//ゲームの更新速度を決定
  game.tick = 0;//ゲーム更新回数を初期化
  //ロード完了時に呼ばれる
  game.onload = function(){
    scene = game.rootScene;
    //バーチャルパッド生成
    
    pad = new Pad();
    pad.moveTo(0, 220);//座標
    scene.addChild(pad);
    
    //情報テキスト表示枠生成
    information_label = new Label("");
    scene.addChild(information_label);
    
    //ステータス表示テキスト枠生成
    status_label = new Label("");
    status_label.backgroundColor = "rgba(255, 200, 0, 0.6)";//背景色
    status_label.width = 160;//幅
    status_label.height = 48;//高さ
    status_label.moveTo(0, 40);//座標
    scene.addChild(status_label);
    
    //装備表示テキスト枠生成
    equipment_label = new Label("");
    equipment_label.backgroundColor = "rgba(0, 200, 255, 0.6)";//背景色
    equipment_label.width = 160;//幅
    equipment_label.height = 48;//高さ
    equipment_label.moveTo(160, 40);//座標
    scene.addChild(equipment_label);
    
    //プレイヤー生成
    player_cord = format(
      //プレイヤーのアバターコードの作成
      "{0}:{1}:{2}:{3}:{4}:{5}",
      SEX[sex][0], HAIR[hair][0], COLOR[color][0],
      WEAPON[wea][0], ARMOR[arm][0], ACCESSORIES[acc][0]
    );
    player = new Player();
  }
  game.rootScene.addEventListener(Event.ENTER_FRAME, function(){
    //ゲーム更新回数が6の倍数の時
    if(game.tick % 6 == 0){
      //十字キーを押した時の処理
      if(game.input.right){
        direction_flag = 1;//右を押した時
      }else if(game.input.left){
        direction_flag = 2;//左を押した時
      }else if(game.input.up){
        direction_flag = 3;//上を押した時
      }else if(game.input.down){
        direction_flag = 4;//下を押した時
      }
    }
    
    //十字キー入力で立てられたフラグ毎の処理
    if(direction_flag == 1 || direction_flag == 2){
      mode = cordChange(direction_flag, mode, MODE.length);//装備変更部位の変更
    }else if(direction_flag == 3 || direction_flag == 4){
      //装備の変更
      switch(mode){
        case 0: sex　 = cordChange(direction_flag, sex,   SEX.length);         break;
        case 1: hair  = cordChange(direction_flag, hair,  HAIR.length);        break;
        case 2: color = cordChange(direction_flag, color, COLOR.length);       break;
        case 3: wea   = cordChange(direction_flag, wea,   WEAPON.length);      break;
        case 4: arm   = cordChange(direction_flag, arm,   ARMOR.length);       break;
        case 5: acc   = cordChange(direction_flag, acc,   ACCESSORIES.length); break;
        default:alert("ERROR!!装備の変更");
      }
      //装備の更新
      player_cord = format(
        "{0}:{1}:{2}:{3}:{4}:{5}",
        SEX[sex][0], HAIR[hair][0], COLOR[color][0],
        WEAPON[wea][0], ARMOR[arm][0], ACCESSORIES[acc][0]
      );
      player.change();
    }
    
    direction_flag = 0;//何も押されてない状態へ戻す
    
    //情報テキストの更新
    information_label.text = format(
        "状態:{0}<br>状態実数:{1}<br>CORD：{2}:{3}:{4}:{5}:{6}:{7}",
        MODE[mode], mode, SEX[sex][0], HAIR[hair][0], COLOR[color][0],
        WEAPON[wea][0], ARMOR[arm][0], ACCESSORIES[acc][0]
    );
    
    //ステータス表示テキストの更新
    status_label.text = format(
        "HP：{0}<br>ATT：{1}<br>SPE：{2}<br>COU：{3}",
        player.hp, player.attack, player.special, player.counter
    );
    
    //装備表示テキストの更新
    equipment_label.text = format(
        "武器：{0}<br>防具：{1}<br>装飾：{2}",
        WEAPON[wea][1], ARMOR[arm][1], ACCESSORIES[acc][1]
    );
    
    game.tick++;//ゲームの更新回数をカウントする
  });
  game.start();//ゲームスタート
}



/*
 * コード変更関数
 */
function cordChange(direction, i, length){
  if(direction % 2 != 0){
    (i == length - 1)? i = 0 : i++;//奇数(上or右)なら足す、長さを超えたら0へ戻す
  }else if(direction % 2 == 0){
    (i == 0)? i = length - 1 : i--;//偶数(下or左)なら引く、マイナスになったら長さ－1にする
  }
  return i;
}



/*
 * 文字列結合関数
 */
function format(fmt){
  for(i = 1; i < arguments.length; i++){
    var reg = new RegExp("\\{" + (i - 1) + "\\}", "g")
    fmt = fmt.replace(reg,arguments[i]);
  }
  return fmt;
}



/*
 * プレイヤークラス
 */
var Player = Class.create(Avatar, {
  //初期化処理
  initialize: function(){
    //親の初期化呼出
    Avatar.call(this, player_cord);
    this.moveTo(PLAYER_X, PLAYER_Y);
    this.action  = "stop";
    this.hp      = WEAPON[wea][2] + ARMOR[arm][2] + ACCESSORIES[acc][2];
    this.attack  = WEAPON[wea][3] + ARMOR[arm][3] + ACCESSORIES[acc][3];
    this.special = WEAPON[wea][4] + ARMOR[arm][4] + ACCESSORIES[acc][4];
    this.counter = WEAPON[wea][5] + ARMOR[arm][5] + ACCESSORIES[acc][5];
    game.rootScene.addChild(this);
    this.addEventListener('touchstart', function(e){
      this.action = "demo";//デモアニメーションを行う
      this.tl.delay(360).then(function(){
        this.action = "stop";
      });
    });
  },
  //装備変更
  change: function(){
    this.setCode(player_cord);//外見変化
    //能力変化
    this.hp      = WEAPON[wea][2] + ARMOR[arm][2] + ACCESSORIES[acc][2];
    this.attack  = WEAPON[wea][3] + ARMOR[arm][3] + ACCESSORIES[acc][3];
    this.special = WEAPON[wea][4] + ARMOR[arm][4] + ACCESSORIES[acc][4];
    this.counter = WEAPON[wea][5] + ARMOR[arm][5] + ACCESSORIES[acc][5];
  }
});

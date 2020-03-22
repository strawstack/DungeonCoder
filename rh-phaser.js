var game;
var world_size = 2000;
var w = window.innerWidth;
var cell_size = 50;
var player;
var walls;

window.onload = function() {
  game = new Phaser.Game(w, 500, Phaser.AUTO, 'gameContainer', {preload: preload, create: create, update: update});
};

function preload(){

}

function create(){
  // 333 background
  game.stage.backgroundColor = "#333";

  // required for camera
  game.world.setBounds(0, 0, world_size, world_size);
  game.physics.startSystem(Phaser.Physics.P2JS);

  // grid of lightgrey lines
  var g_lines = game.add.graphics(0, 0);
    g_lines.beginFill(0xdddddd);
    g_lines.lineStyle(1, 0x777777, 1);
    for(var i=0; i < world_size / cell_size; i += 1){ // width
      g_lines.moveTo( i * cell_size, world_size);
      g_lines.lineTo( i * cell_size, 0);
    }
    for(var i=0; i< world_size / cell_size; i += 1){ // height
      g_lines.moveTo(0, i * cell_size);
      g_lines.lineTo(world_size, i * cell_size);
    }
    g_lines.endFill();

  // pale green player
  var g_player = game.add.graphics(0, 0);
    g_player.beginFill(0x00FF00);
    g_player.drawRect(0, 0, cell_size, cell_size);
    player = game.add.sprite(12 * cell_size + cell_size/2, 12 * cell_size + cell_size/2, g_player.generateTexture());
    player.anchor.set(0.5);
    g_player.destroy();

  // camera follows player
  game.physics.p2.enable(player);
  game.camera.follow(player, Phaser.Camera.FOLLOW_LOCKON, 0.2, 0.2);
  game.camera.deadzone = new Phaser.Rectangle(200, 200, w - 400, 500 - 400);

  //
  // white wall templates
  //
  vert_wall_template = [{x: 4, y: 4}, {x: 4, y: 3}, {x: 4, y: 2}, {x: 4, y: 6}, {x: 4, y: 7}, {x: 4, y: 8}];

  horz_wall_template = [];
  for(var i=5; i<16; i++){ horz_wall_template.push({x: i, y: 2}); }


  // transform wall templates and collect into one array called walls
  walls = [];

  // top
  for(var i=3; i<=33; i++){ walls.push({x: i, y: 3}); }

  // left
  for(var i=4; i<=33; i++){ walls.push({x: 3, y: i}); }

  // right
  for(var i=4; i<=33; i++){ walls.push({x: 33, y: i}); }

  // bottom
  for(var i=4; i<=32; i++){ walls.push({x: i, y: 33}); }

  // semis top
  for(var i=9; i<33; i += 6){
    walls.push({x: i, y: 4});
    walls.push({x: i, y: 4 + 1});
  }

  // semis left
  for(var i=9; i<33; i += 6){
    walls.push({x: 4, y: i});
    walls.push({x: 4 + 1, y: i});
  }

  // semis right
  for(var i=9; i<33; i += 6){
    walls.push({x: 31, y: i});
    walls.push({x: 31 + 1, y: i});
  }

  // semis bot
  for(var i=9; i<33; i += 6){
    walls.push({x: i, y: 31});
    walls.push({x: i, y: 31 + 1});
  }

  for(var i=9; i<=27; i += 6){
    for(var j=9; j<=27; j += 6){

      walls.push({x: i, y: j - 2});
      walls.push({x: i, y: j - 1});
      walls.push({x: i, y: j});
      walls.push({x: i, y: j + 1});
      walls.push({x: i, y: j + 2});

      walls.push({x: i - 1, y: j});
      walls.push({x: i - 2, y: j});

      walls.push({x: i + 1, y: j});
      walls.push({x: i + 2, y: j});

    }
  }

  //
  // Construct walls
  //
  for(var _w in walls){
    var g_wall = game.add.graphics(0, 0);
      g_wall.beginFill(0xFFFFFF);
      g_wall.drawRect(0, 0, cell_size, cell_size);
      wall = game.add.sprite(walls[_w].x * cell_size + cell_size/2, walls[_w].y * cell_size + cell_size/2, g_wall.generateTexture());
      wall.anchor.set(0.5);
      g_wall.destroy();
      game.physics.p2.enable(wall);
      walls[_w] = wall;
  }

  // blue doors - defined in game.js
  for(var d in doors){
    var g_door = game.add.graphics(0, 0);
      g_door.beginFill(0x0000FF);
      g_door.drawRect(0, 0, cell_size, cell_size);
      door = game.add.sprite(doors[d]["pos"].x * cell_size + cell_size/2, doors[d]["pos"].y * cell_size + cell_size/2, g_door.generateTexture());
      door.anchor.set(0.5);
      g_door.destroy();
      game.physics.p2.enable(door);
      doors[d]["objRef"] = door;
  }


  // arrow keys
  var up = this.game.input.keyboard.addKey(Phaser.Keyboard.UP);
  up.onDown.add(function(){ player_moves("up") });
  var down = this.game.input.keyboard.addKey(Phaser.Keyboard.DOWN);
  down.onDown.add(function(){ player_moves("down") });
  var left = this.game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
  left.onDown.add(function(){ player_moves("left") });
  var right = this.game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);
  right.onDown.add(function(){ player_moves("right") });


}

function update(){

}

function isWall(player, dir){
  var x = player.body.x;
  var y = player.body.y;

  switch(dir){
    case "up":
      y -= 50;
    break;
    case "down":
      y += 50;
    break;
    case "left":
      x -= 50;
    break;
    case "right":
      x += 50;
    break;
  }

  if( x < 0 ) return true;
  if( y < 0 ) return true;
  if( x > world_size ) return true;
  if( y > world_size ) return true;

  for(var w in walls){  // for each wall test if player hits
    var wx_start = walls[w].body.x - cell_size / 2;
    var wy_start = walls[w].body.y - cell_size / 2;

    if( x > wx_start && x < (wx_start + cell_size) ){
      if( y > wy_start && y < (wy_start + cell_size) ){
        return true;
      }
    }
  }

  for(var d in doors){ // same collision test but for doors
    var wx_start = doors[d]["objRef"].body.x - cell_size / 2;
    var wy_start = doors[d]["objRef"].body.y - cell_size / 2;

    if( x > wx_start && x < (wx_start + cell_size) ){
      if( y > wy_start && y < (wy_start + cell_size) ){
        return true;
      }
    }
  }

  return false; // player can move

}

function player_moves( dir ){

  if( isWall(player, dir) ) return 0; // player can't move through walls

  switch(dir){
    case "up":
      player.body.y -= 50;
    break;
    case "down":
      player.body.y += 50;
    break;
    case "left":
      player.body.x -= 50;
    break;
    case "right":
      player.body.x += 50;
    break;
  }

  var px = Math.floor( player.body.x / cell_size);
  var py = Math.floor( player.body.y / cell_size);

  // check for door
  var found = false;
  for(var d in doors){

    var dx = doors[d]["pos"].x;
    var dy = doors[d]["pos"].y;

    // up
    if( dx == px && dy == py - 1){
      log( doors[d]["log"] );
      currSol = doors[d]["solution"];
      doorId = doors[d]["id"];
      found = true;
      break;

      // left
    }else if( dx == px - 1 && dy == py){
      log( doors[d]["log"] );
      currSol = doors[d]["solution"];
      doorId = doors[d]["id"];
      found = true;
      break;

      // right
    }else if( dx == px + 1 && dy == py){
      log( doors[d]["log"] );
      currSol = doors[d]["solution"];
      doorId = doors[d]["id"];
      found = true;
      break;

      // down
    }else if( dx == px && dy == py + 1){
      log( doors[d]["log"] );
      currSol = doors[d]["solution"];
      doorId = doors[d]["id"];
      found = true;
      break;
    }
  }
  if( !found ){
    currSol = undefined;
    doorId = undefined;
    log( "welcome" );
  }
}

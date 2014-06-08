Glitch.GREY = 0;
Glitch.RED = 1;
Glitch.GREEN = 2;
Glitch.BLUE = 3;
Glitch.ZERO = 4;

function Glitch(x, y, glitch_type){
	GameSprite.call(this, x, y, 2, 5, 14, 24, "glitch_sheet");
	this.type = "Glitch";
	this.glitch_type = glitch_type;
	this.animation.frame_delay = 15;
	this.animation.frame_height = 24;
	this.animation.Change(0, 0, 8);
}
Glitch.prototype.Import = function(obj){
	GameSprite.prototype.Import.call(this, obj);
	this.glitch_type = obj.glitch_type;
}
Glitch.prototype.Export = function(){
	var obj = GameSprite.prototype.Export.call(this);
	obj.glitch_type = this.glitch_type;
	return obj;
}

Glitch.prototype.Update = function(delta, map){
	GameSprite.prototype.Update.call(this, delta, map);
	
	if (this.IsColliding(map.player)){
		this.delete_me = true;
		map.player.glitches[this.glitch_type] = true;
		Glitch.TransformPlayer(map, this.glitch_type);
	}
}

Glitch.TransformPlayer = function(map, glitch_type){
	var glitches = map.player.glitches;
	var facing = map.player.facing;
	map.player = new Player(map.player.x, map.player.y);
	map.player.on_ground = false;
	map.player.facing = facing;
	map.player.glitches = glitches;
	
	
	room.tilesheet_name = "grey_tile_sheet";

	var oldbb = map.player.bb;
	map.player.glitch_type = glitch_type;
	switch (glitch_type){
		case Glitch.GREY:
			break;
		case Glitch.RED:
			Glitch.RedTransform(map.player);
			break;
		case Glitch.GREEN:
			Glitch.GreenTransform(map.player);
			break;
		case Glitch.BLUE:
			Glitch.BlueTransform(map.player);
			break;
		case Glitch.ZERO:
			Glitch.ZeroTransform(map.player);
			break;
		default: break;
	}

	map.player.y += oldbb - map.player.bb;
	map.player.image = eval("resource_manager." + map.player.img_name);
}
extend(GameSprite, Glitch);

//******GLITCH TRANSFORMATION DEFINTIIONS***************************/
Glitch.RedTransform = function(player){
	player.img_name = "player_red_sheet";
	room.tilesheet_name = "red_tile_sheet";
			
	player.HandleCollisionsAndMove = function(map){
		var left_tile = Math.floor((this.x + this.lb + this.vel.x) / Tile.WIDTH);
		var right_tile = Math.ceil((this.x + this.rb + this.vel.x) / Tile.WIDTH);
		var top_tile = Math.floor((this.y + this.tb + this.vel.y) / Tile.HEIGHT);
		var bottom_tile = Math.ceil((this.y + this.bb + this.vel.y) / Tile.HEIGHT);
		
		// Reset flag to search for ground collision.
		var was_on_ground = this.on_ground;
		//this.on_ground = false;
		var q_horz = 3; //q is used to minimize height checked in horizontal collisions and etc.
		var q_vert = 3;
		var floor_tile = null;
		
		floor_tile = this.HandleHorizontalCollisions(map, left_tile, right_tile, top_tile, bottom_tile, q_horz, floor_tile);
		this.x += this.vel.x;
		this.HandleVerticalCollisions(map, left_tile, right_tile, top_tile, bottom_tile, q_vert);
		this.y += this.vel.y;
		this.CompensateForSlopes(was_on_ground, floor_tile);
	}
}

Glitch.GreenTransform = function(player){
	player.img_name = "player_green_sheet";
	room.tilesheet_name = "green_tile_sheet";
	player.terminal_vel = 1.0;
	player.original_grav_acc = 0.2;
	player.float_grav_acc = 0.2;
	player.jump_time_limit = 60;
	player.jump_vel = 3.2;
			
	player.Move = function(mult){
		this.pressed_down = false;

		var acc;
		this.horizontal_input = true;
		//if ((this.vel.x * mult) < 0) this.vel.x = 0;
		if (this.on_ground){
			acc = this.gnd_run_acc / 10;
			this.move_state = MoveState.RUNNING;
		}
		else{ acc = this.air_run_acc / 10; }
		
		if (Math.abs(this.vel.x) < this.max_run_vel*2.5){
			this.vel.x += acc * mult;
			//this.CorrectVelocity(mult);
		}
		/*else if (Math.abs(this.vel.x) > this.max_run_vel){
			this.vel.x -= acc * mult;
			if (Math.abs(this.vel.x) < this.max_run_vel)
				this.vel.x = this.max_run_vel * mult;
		}*/
	}
	
	player.MoveStop = function(){
		if (this.on_ground){
			if (this.vel.x > 0){
				this.vel.x -= this.gnd_run_dec / 10;
				if (this.vel.x < 0) this.vel.x = 0;
			}else if (this.vel.x < 0){
				this.vel.x += this.gnd_run_dec / 10;
				if (this.vel.x > 0) this.vel.x = 0;
			}
			//this.move_state = MoveState.STANDING;
		}else{
			if (this.vel.x > 0){
				this.vel.x -= this.air_run_dec / 10;
				if (this.vel.x < 0) this.vel.x = 0;
			}else if (this.vel.x < 0){
				this.vel.x += this.air_run_dec / 10;
				if (this.vel.x > 0) this.vel.x = 0;
			}
		}
	}
}

Glitch.BlueTransform = function(player){
	player.img_name = "player_blue_sheet";
	room.tilesheet_name = "blue_tile_sheet";
			
	player.StartJump = function(){
		if (this.on_ground){
			this.vel.y = -this.jump_vel;
			this.is_jumping = true;
			this.jump_timer = 0;
			this.on_ground = false;
		}
		else if (!this.has_double_jumped){	
			this.has_double_jumped = true;
			var q_vert = 3;
			this.vel.x = 0;
			this.vel.y = -32;
			var left_tile = Math.floor((this.x + this.lb + this.vel.x) / Tile.WIDTH);
			var right_tile = Math.ceil((this.x + this.rb + this.vel.x) / Tile.WIDTH);
			var top_tile = Math.floor((this.y + this.tb + this.vel.y) / Tile.HEIGHT);
			var bottom_tile = Math.ceil((this.y + this.bb + this.vel.y) / Tile.HEIGHT);
			var vel = this.vel;
		
			this.HandleVerticalCollisions(room, left_tile, right_tile, top_tile, bottom_tile, q_vert);
			this.y += this.vel.y;
			this.vel = vel;
			this.vel.y = -this.jump_vel;
		}
	}
}

Glitch.ZeroTransform = function(player){
	player.img_name = "player_zero_sheet";
	room.tilesheet_name = "zero_tile_sheet";
		
	player.HandleHorizontalCollisions = function(map, left_tile, right_tile, top_tile, bottom_tile, q, floor_tile){
		this.horizontal_collision = false;
	}

	player.HandleVerticalCollisions = function(map, left_tile, right_tile, top_tile, bottom_tile, q){
		//Check all potentially colliding tiles
		for (var i = top_tile; i <= bottom_tile; i++){
			for (var j = left_tile; j <= right_tile; j++){
				if (!map.isValidTile(i, j)) continue;
				var tile = map.tiles[i][j];
				//don't check for collisions if potential tile is "out of bounds" or not solid
				if (tile.collision == Tile.GHOST) continue;
					
				//Check for bottom collisions
				if (this.vel.y >= 0 && this.IsRectColliding(tile, this.x + this.lb + q, this.y + this.bb, this.x + this.rb - q, this.y + this.bb + this.vel.y + 1)){
					//Don't count bottom collision for fallthrough platforms if we're not at the top of it
					if (tile.y < this.y + this.bb || (this.pressing_down && !this.touching_door))
						continue;
					this.vel.y = 0;
					this.on_ground = true;
					this.has_double_jumped = false;
					this.y = tile.y - this.bb;
				}
			}
		}
	}
}
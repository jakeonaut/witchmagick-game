function InputManager(key_manager){
	this.key_manager = key_manager;
}

InputManager.prototype.Update = function(player){
//	console.log(this.key_manager.keys_down);
	if (this.key_manager.keys_down[KeyManager.RIGHT] || this.key_manager.keys_down[KeyManager.D]){
		player.MoveRight();
	}
	else if (this.key_manager.keys_down[KeyManager.LEFT] || this.key_manager.keys_down[KeyManager.A]){
		player.MoveLeft();
	}
	
	if (this.key_manager.keys_pressed[KeyManager.UP] || this.key_manager.keys_pressed[KeyManager.W]){
		player.StartJump();
	}
	else if (this.key_manager.keys_down[KeyManager.UP] || this.key_manager.keys_down[KeyManager.W]){
		player.Jump();
	}
	if (this.key_manager.keys_up[KeyManager.UP] || this.key_manager.keys_up[KeyManager.W]){
		player.StopJump();
	}
	
	if (this.key_manager.keys_down[KeyManager.DOWN] || this.key_manager.keys_down[KeyManager.S]){
		player.PressDown();
	}
	else{
		player.StopPressingDown();
	}
}
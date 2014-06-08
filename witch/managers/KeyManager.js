function KeyManager(){
	this.keys_down = [];
	this.keys_pressed = [];
	this.keys_have_pressed = [];
	this.keys_up = [];
}

//KEY STATIC NAMES
KeyManager.LEFT = 37;
KeyManager.UP = 38;
KeyManager.RIGHT = 39;
KeyManager.DOWN = 40;
KeyManager.ENTER = 13;
KeyManager.SPACE = 32;
KeyManager.Q = 81;
KeyManager.W = 87;
KeyManager.E = 69;
KeyManager.R = 82;
KeyManager.A = 65;
KeyManager.S = 83;
KeyManager.D = 68;


KeyManager.prototype.KeyDown = function(e){
	this.keys_down[e.keyCode] = true;
	if (!this.keys_have_pressed[e.keyCode]){
		this.keys_pressed[e.keyCode] = true;
		this.keys_have_pressed[e.keyCode] = true;
	}
	
	this.PreventArrowDefaults(e); 
}

KeyManager.prototype.KeyUp = function(e){
	this.keys_up[e.keyCode] = true;
	
	delete this.keys_down[e.keyCode];
	delete this.keys_have_pressed[e.keyCode];
	if (this.keys_pressed[e.keyCode]) delete this.keys_pressed[e.keyCode];
	this.PreventArrowDefaults(e);
}

KeyManager.prototype.ForgetKeysPressed = function(){
	this.keys_pressed = {};
	this.keys_up = {};
}

KeyManager.prototype.PreventArrowDefaults = function(e){
	switch(e.keyCode){
    case KeyManager.LEFT: 
	case KeyManager.UP: 
	case KeyManager.RIGHT:  
	case KeyManager.DOWN:
    case KeyManager.SPACE: 
		e.preventDefault(); 
		break;
    default: break; // do not block other keys
  }
}
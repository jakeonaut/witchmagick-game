//Display the loading screen while everything else is loading...
function ResourceManager(){
	//IMAGE VARIABLE DECLARATION
	this.images_loaded = 0;
	//images
	this.bg_image = new Image();
	this.player_sheet = new Image();
	this.obj_sheet = new Image();
	
	//SOUND VARIABLE DECLARATION
	this.sounds_loaded = 0;
	//sounds
	this.catch_sound = document.createElement("audio");
}

ResourceManager.prototype.DisplayLoadScreen = function(){
	ctx.canvas.width = GAME_WIDTH*VIEW_SCALE;
	ctx.canvas.height = GAME_HEIGHT*VIEW_SCALE;
	ctx.scale(VIEW_SCALE,VIEW_SCALE);
	
	//Display the LOADING... screen
	ctx.fillStyle = "rgb(0, 0, 0)";
	ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
	
	ctx.fillStyle = "rgb(255,255,255)";
	//ctx.font = "24px pixelFont";
	ctx.textAlign = "left";
	ctx.textBaseline = "top";
	ctx.fillText("LOADING...", 134, GAME_HEIGHT/2-4);
}

ResourceManager.prototype.ImageLoad = function(){ 
	this.images_loaded++;
	this.CheckLoadedResources(); 
}
ResourceManager.prototype.SoundLoad = function(){ 
	this.sounds_loaded++; 
	this.CheckLoadedResources(); 
}

//LOAD ALL THE RESOURCES
ResourceManager.prototype.LoadResources = function(ctx){
	this.DisplayLoadScreen(ctx);

	this.num_images = 3;
	//Load Images
	this.bg_image.onload = this.ImageLoad.bind(this); 				this.bg_image.src = "witch/assets/images/background.png";
	this.player_sheet.onload = this.ImageLoad.bind(this); 			this.player_sheet.src = "witch/assets/images/witch_sheet.png";
	this.obj_sheet.onload = this.ImageLoad.bind(this); 			this.obj_sheet.src = "witch/assets/images/obj_sheet.png";
	
	this.num_sounds = 1;
	//Load Sounds
	this.catch_sound.addEventListener("canplaythrough", this.SoundLoad.bind(this));
		this.catch_sound.src = "witch/assets/sounds/catch.wav";
}

ResourceManager.prototype.CheckLoadedResources = function(){
	if (this.images_loaded >= this.num_images && this.sounds_loaded >= this.num_sounds){
		startGame();
	}
}
function House(){
	this.room_index_x = 0;
	this.room_index_y = 0;
	this.SetUpRooms();
}

House.prototype.SetUpRooms = function(){
	var path = "witch/rooms/";

	this.rooms = [
		[Room.Import(path + "room_0_0.txt")]
	];
}

House.prototype.GetRoom = function(){
	return this.rooms[this.room_index_x][this.room_index_y];
}
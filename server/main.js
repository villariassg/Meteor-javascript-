import { Meteor } from 'meteor/meteor';
Meteor.startup(() => {
	cPlayers = new Mongo.Collection('players');
  	Meteor.publish('thePlayers', function(){
		var currentUserId = this.userId;
		return cPlayers.find({createdBy : currentUserId});
	});
});
Meteor.methods({
	/////CREATE
	'createPlayer' : function (playerNameVar) {
		check(playerNameVar, String);
		var currentUserId = Meteor.userId();
		if (currentUserId){
			cPlayers.insert({name : playerNameVar, 
			score : 0, 
			createdBy: currentUserId});
		}
	},////REMOVE
	'removePlayer' : function (selectedPlayer) {
		check(selectedPlayer, String);
		var currentUserId = Meteor.userId();
		if (currentUserId) {
			cPlayers.remove({_id : selectedPlayer, createdBy : currentUserId});
		}
	},////RENAME
	'renamePlayer' : function (playerNameVar, selectedPlayer) {
		check(playerNameVar, String);
		check(selectedPlayer, String);
		var currentUserId = Meteor.userId();
		if (currentUserId) {
			cPlayers.update({ _id : selectedPlayer, createdBy : currentUserId}, 
				{$set : {name : playerNameVar}});
		}
	},////UPDATE
	'updateScore' : function (selectedPlayer, scoreValue) {
		check(selectedPlayer, String);
		check(scoreValue, Number);
		var currentUserId = Meteor.userId();
		if (currentUserId) {
			cPlayers.update({ _id : selectedPlayer, createdBy : currentUserId}, 
				{$inc : {score : scoreValue}});
		}
	},
	'transferPoint' : function (selectedPlayer, pointRecipient) {
		check(selectedPlayer, String);
		check(pointRecipient, String);
		var currentUserId = Meteor.userId();
		var recipientExists = cPlayers.find({name : pointRecipient} , {$exists : true}).count();
		if (currentUserId && recipientExists == 1) {
			cPlayers.update({ name : pointRecipient,  createdBy : currentUserId}, {$inc : {score : 1}});
			cPlayers.update({ _id : selectedPlayer, createdBy : currentUserId}, {$inc : {score : -1}});
		}
	}
});

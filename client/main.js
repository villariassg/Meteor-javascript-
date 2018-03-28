cPlayers = new Mongo.Collection('players');
Meteor.subscribe('thePlayers');
	////////HELPERS//////////
	Template.leaderboard.helpers({
		'player' : function() {
			var currentUserId = Meteor.userId();
			return cPlayers.find({createdBy : currentUserId}, 
				{sort : {score : -1, name : 1}});
		},
		'selectedClass' : function() {
			var playerId = this._id;
			var selectedPlayer = Session.get('selectedPlayer');
			if (playerId == selectedPlayer) {
				return "colorForSelected";
			}
		},
		'selectedPlayer' : function() {
			var selectedPlayer = Session.get('selectedPlayer');
			return cPlayers.findOne({_id : selectedPlayer});
		}
	});
	////////HELPERS////////
	////////EVENTS/////////
	Template.leaderboard.events({
		'click .PlayersScores' : function() {
			var playerId = this._id;
			Session.set('selectedPlayer', playerId);
		},
		'click .increment' : function() {
			var selectedPlayer = Session.get('selectedPlayer');
			Meteor.call('updateScore', selectedPlayer, 1);
		},
		'click .decrement' : function() {
			var selectedPlayer = Session.get('selectedPlayer');
			Meteor.call('updateScore', selectedPlayer, -1);
		},
		'click .remove' : function () {
			var selectedPlayer = Session.get('selectedPlayer');
			var selectedPlayerData = cPlayers.findOne({ _id : selectedPlayer});
			function checkPoints(i) {
				if (i != 0) {
					return "Note: All " + i + " points will be lost once confirmed";
				} else return "";
			}
			if (confirm("Are you sure you want to remove player "
				 + selectedPlayerData.name + "?\n" + 
				 	checkPoints(selectedPlayerData.score))) {
				Meteor.call('removePlayer', selectedPlayer);
			} else {

			}
		}
	});
	Template.renamePlayerForm.events({
		'submit form' : function(e) {
			e.preventDefault();
			var playerNameVar = e.target.newPlayerName.value;
			var selectedPlayer = Session.get("selectedPlayer");
			Meteor.call('renamePlayer', playerNameVar, selectedPlayer);
		}
	});
	Template.addPlayerForm.events({
		'submit form' : function(e) {
			e.preventDefault();
			var playerNameVar = e.target.playerName.value;
			e.target.playerName.value = "";
			Meteor.call('createPlayer', playerNameVar);
		}
	});
	Template.transferPointForm.events({
		'submit form' : function(e) {
			e.preventDefault();
			var pointRecipientVar = e.target.pointRecipient.value;
			var selectedPlayer = Session.get("selectedPlayer");
			Meteor.call('transferPoint', selectedPlayer, pointRecipientVar);
		}
	});
	///////EVENTS/////////
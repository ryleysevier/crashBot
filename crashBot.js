/*
	Ryley Zay Sevier
	1/6/2018

	installed as crashBot.service on terra
	systemd script in /etc/systemd/system/crashBot.service
	systemctl start crashBot.service
	
	will look into a folder called audio in the same directory as the working directory
	and use that as it's source of files. 
*/

var config = require('./config.json');
/*
	config.json should contain your bot's token 
	
	{"token": "KEYVALUEHERE"}
*/

const Discord = require('discord.js');
const client = new Discord.Client();

client.on('ready', () => {
	console.log("ready");
});

client.on("ready", () => {
  // This event will run if the bot starts, and logs in, successfully.
  console.log(`Bot has started, with ${client.users.size} users, in ${client.channels.size} channels of ${client.guilds.size} guilds.`); 
  // Example of changing the bot's playing game to something useful. `client.user` is what the
  // docs refer to as the "ClientUser".
  client.user.setGame('on the CrashPad');
});

client.on("guildCreate", guild => {
  // This event triggers when the bot joins a guild.
  console.log(`New guild joined: ${guild.name} (id: ${guild.id}). This guild has ${guild.memberCount} members!`);
  client.user.setGame(`on the CrashPad`);
});

client.on("guildDelete", guild => {
  // this event triggers when the bot is removed from a guild.
  console.log(`I have been removed from: ${guild.name} (id: ${guild.id})`);
  client.user.setGame(`on the CrashPad`);
});

client.on('guildMemberAdd', member => {
	const channel = member.guild.channels.find('name', 'general');
	//console.log(channel);
	if (!channel) return;
	channel.send(`🎺🎺🎺 ${member} 🎺🎺🎺`);
});

//var to make sure he can't play more that one channel intro at a time
let playing = false;

//command listener
client.on('message', message => {
  if(message.author.bot) return;
	
	//command stripper
	//be default it's going to hunt out an MP3 that matches it's command, 
	//if it's there, it'll play it.
	var command = "";
	//hunt the key for the sounds
	if(message.content.substring(0,1) === '/'){
		command = message.content.substring(1, message.content.length);
		console.log("Command: " + command);
	} else {	return;	}
	
	
	if (!message.guild) return;
		var fs = require('fs');
		if (fs.existsSync('./audio/'+command+'.mp3')) {
			message.delete(0);
			if(!playing){
				// Only try to join the sender's voice channel if they are in one themselves
				if (message.member.voiceChannel) {
				message.member.voiceChannel.join()
					.then(connection => { // Connection is an instance of VoiceConnection
						
						const dispatcher = connection.playFile('./audio/' + command + '.mp3');
						playing = true;
						dispatcher.on('end', () => {
							message.member.voiceChannel.leave();
							playing = false;
						});
					})
				.catch(console.log);
			} else {	}
		}
	}
		
	//show a list in a PM from the bot of all the available mp3's to use
	if (message.content === '/list') {
		if (message.member.voiceChannel) {
			message.delete(0);
			
			const fs = require('fs');
			
			var fileList = [];
			
			files = fs.readdirSync('./audio/');
			
			files.forEach(file => {
				console.log(file.substring(0, file.length-4));
				fileList.push(file.substring(0, file.length-4));
			});
			
			message.author.sendMessage("Here's the list of available audio bytes for the CrashPad: \n" + fileList);
		}
	}
	
	//override the sounds that are playing with a command
	if (message.content === '/stop') {
		if (message.member.voiceChannel) {
			message.delete(0);
			message.member.voiceChannel.leave();
			console.log("left a channel");
		} else {	}
	}
});


//announcement sounds!
client.on('voiceStateUpdate', (oldMember, newMember) => {
	let newUserChannel = newMember.voiceChannel
	let oldUserChannel = oldMember.voiceChannel
	
	//make sure the bot doesn't try to announce itself
	if(newMember.user.bot){ return;	}
	
	if(oldUserChannel === undefined && newUserChannel !== undefined) {
		console.log("Joined: " + newMember.displayName + 
					" into " + newMember.voiceChannel.name);
		let botChannel = newMember.voiceChannel;
		
		let soundIntro = '';
		
		var userSounds = {
			"acehax": 		"./audio/battle.mp3",
			"Tweak": 		"./audio/mannothot.mp3",
			"Ace0diamond": 	"./audio/crashintro.mp3",
			"bc_white": 	"./audio/meowmeow.mp3",
			"Spectre": 		"./audio/saxguy.mp3",
		};
				
		if(userSounds[newMember.displayName] === undefined) return;
		
		botChannel.join()
			.then(connection => { // Connection is an instance of VoiceConnection
				console.log("Announcing " + newMember.displayName);
				const dispatcher = connection.playFile(userSounds[newMember.displayName]);
				playing = true;
				dispatcher.on('end', () => {
					botChannel.leave();
					playing = false;
				});
			})
			.catch(console.log);
	
	} else if(newUserChannel === undefined){
		console.log("Left: " + newMember.displayName);
	}
})


client.login(config.token);

# crashBot
An MP3 playing Discord bot that will play clips for people as they enter the channel. 

Announcements are hard coded to the body of the script. 

Looks for a folder called "audio" in it's working directory and will use all mp3 files in that directory to feed to the audio stream.

Requires a config.json in the same directory that contains the token for the discord bot. 
~~~~
{
	"token" : "<TOKEN>"
}
~~~~


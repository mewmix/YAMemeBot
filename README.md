YAMemeBot
===

A Telegram Bot that generates meme.

Dependencies
===

System level
---
 - NodeJS

NodeJS level
---
 - node-telegram-bot
 - md5
 - request

How to Run
===
 - Install all above dependencies by running `npm install`
 - Make sure your OS user has write access to the bot's directory
 - Then run the bot like -

        $ YAMEMEBOT_TOKEN='Your Token' node app.js
        
        

/////////////////////////////////

 TEMPORARY FIX - EDIT CAUSES BOT TO CRASH 
 
 
 START AS NORMAL ----- 
 
 cd YAMemeBot/node_modules/node-telegram-bot/lib
 
 sudo rm Bot.js
 
 sudo nano ( copy paste this file ) https://github.com/depoio/node-telegram-bot/blob/master/lib/Bot.js
 
 /////
 
 Bot.js now in root of repo, move this to this folder and you're good! 
 /////////
 
 YAMEMEBOT_TOKEN='Your Token' node app.js
        
 or create a script an nohup ./script.sh (with your token saved in the script & chmod +x to make it executable!) 
 ///////////////
 
 Profit!

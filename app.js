var builder = require('botbuilder');
var restify = require('restify');

//Server setup
var server = restify.createServer();

server.listen(process.env.port || process.env.PORT || 3978, function() {
    console.log('%s listening to %s', server.name, server.url);
});

//Get secrets from server environment
var connector = new builder.ChatConnector({
    appId: process.env.MICROSOFT_APP_ID,
    appPassword: process.env.MICROSOFT_APP_PASSWORD
});

//Create chat bot
var bot = new builder.UniversalBot(connector);

bot.on('conversationUpdate', function (message) {
    if (message.membersAdded) {
         message.membersAdded.forEach(function (identity) {
            if (identity.id == message.address.bot.id) {                
                // var reply = new builder.Message()
                //         .address(message.address)
                //         .text("Welcome to my page");
                // bot.send(reply);
            } else {
                var address = Object.create(message.address);
                address.user = identity;
                var reply = new builder.Message()
                        .address(address)
                        .text("Hello %s I\'m botty McBotface", identity.name);
                bot.send(reply);
            }
        });
    }
});
//Handle bot framework messages
server.post('/api/messages', connector.listen());

bot.dialog('/',function(session) {
     session.send('Hello I\'m botty McBotface');
});

// END OF LINE

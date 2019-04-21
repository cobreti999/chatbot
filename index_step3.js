// restify library to create a web server hosting the bot REST service
const restify = require('restify');
const path = require('path');

// Bot framework adapter
const {BotFrameworkAdapter} = require('botbuilder');

// Bot Step 1 module
const {Bot_step3} = require('./bot_step3');

const dotenv = require('dotenv');

const ENV_FILE = path.join(__dirname, '.env');
dotenv.config({path: ENV_FILE});

// creation of the server hosting the bot
const server = restify.createServer({"name": "Weather-Bot Server step3"});
server.listen(process.env.PORT, () => {
    console.log(`${server.name} listening on http://localhost:${process.env.PORT}`);
});

// Creating the server hosting the bot
const adapter = new BotFrameworkAdapter();

// Error response function
adapter.onTurnError = async (context, error) => {
    // error log
    console.error(`\n[onTurnError]: ${error}`);
    // warn the user on the exchange channel
    await context.sendActivity("Sorry, but a technical problem has ocurred");
};

//creating the LUIS configuration
//gives access configuration to LUIS in the azure cloud
const luisApplication = {
    applicationId: process.env.LuisAppId,
    endpointKey: process.env.LuisEndpointKey,
    endpoint: process.env.LuisEndpoint,
    authoringKey: process.env.LuisAuthoringKey,
};

// Creating the configuration of LUIS's behavior
const luisPredictionOptions = {
    includeAllIntents: true,
};

// creating the bot
const bot = new Bot_step3(luisApplication, luisPredictionOptions, process.env.NLUThreshold);

// Starting the server listening on localhost:3978/api/messages
server.post('/api/messages', (req, res) => {
    adapter.processActivity(req, res, async (context) => {
        // route the message encapsulated in the turnContext to the bot
        await bot.onTurn(context);
    });
});
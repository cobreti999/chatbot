// enumeration of the types of activities
const {ActivityTypes} = require('botbuilder');
const {NLU_reg_Step2} = require('./nlu_reg_step2');
const nlureg = new NLU_reg_Step2();

class Bot_step2 {
    // processing message received from the channel (provided by the adapter)
    async onTurn(turnContext){
        // Depending on the type of message, different processing is done
        switch(turnContext.activity.type){
            case ActivityTypes.Message : {
                // get the message text
                var text = turnContext.activity.text.toLowerCase();
                // identification of intent by the module nlu
                let intent = nlureg.detectIntent(text);
                console.log(`intent: ${intent.intent} extract: ${intent.extract}`);
                // according to the intention detected, the bot reacts
                switch (intent.intent){ 
                    case "hello" : 
                        await turnContext.sendActivity("Hi, I'm a future weather chatbot who just knows how to say hello and say goodbye for the moment.");
                        break;
                    case "bye" :
                        await turnContext.sendActivity("Bye!");
                        break;
                    case "weather" :
                        // get the city parameter value
                        let city = intent.extract[1];
                        await turnContext.sendActivity(`I still do not know how to get the weather on [${city}] but it will be possible soon`);
                        break;
                        // in the case of "unknown" intent we go through the default
                    default:
                        await turnContext.sendActivity("Sorry, but I have no knowledge on this subject - I can only greet and say goodbye!");
                        break;
                };
                break;
            };
            case ActivityTypes.ConversationUpdate: {
                // present the bot on its arrival channel event
                var addedMembers = turnContext.activity.membersAdded;
                if (addedMembers[0].name == "Bot") {
                    await turnContext.sendActivity("Weather-Bot step 2 join you - ready to answer you");
                }
                break;
            }
            default: {
                // for any other activity type, a message is returned indicating its detection
                await turnContext.sendActivity(`[${turnContext.activity.type} detected and not processed by the bot]`);
                break;
            }
        }
    }
}
module.exports.Bot_step2 = Bot_step2;
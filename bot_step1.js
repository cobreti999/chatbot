// enumeration of the types of activities
const {ActivityTypes} = require('botbuilder');

class Bot_step1 {
    // processing message received from the channel (provided by the adapter)
    async onTurn(turnContext){
        // Depending on the type of message, different processing is done
        switch(turnContext.activity.type){
            case ActivityTypes.Message : {
                // get the message text
                var text = turnContext.activity.text.toLowerCase();
                //depending on the utterance
                switch (text){
                    case "hello" : 
                        await turnContext.sendActivity("Hi, I'm a future weather chatbot who just knows how to say hello and say goodbye for the moment.");
                        break;
                    case "bye" :
                        await turnContext.sendActivity("Bye!");
                        break;
                    default:
                        await turnContext.sendActivity("Sorry, but I have no knowledge on this subject - I can only greet and say goodbye!");
                }
                break;
            };
            case ActivityTypes.ConversationUpdate: {
                // present the bot on its arrival channel event
                var addedMembers = turnContext.activity.membersAdded;
                if (addedMembers[0].name == "Bot") {
                    await turnContext.sendActivity("Weather-Bot step 1 join you - ready to answer you");
                }
                break;
            }
            default: {
                // for any other activity type, a message is returned indicating its detection
                await turnContext.sendActivity(`[${turnContext.activity.type} detected and not processed by the bot]`);
            }
        }
    }
}
module.exports.Bot_step1 = Bot_step1;
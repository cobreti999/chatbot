// enumeration of the types of activities
const {ActivityTypes} = require('botbuilder');
// LUIS cloud service proxy
const {LuisRecognizer} = require('botbuilder-ai');
// nlu module based on regular expressions
const {NLU_reg_Step3} = require('./nlu_reg_step3');

const nlureg = new NLU_reg_Step3();

class Bot_step3 {
    
    //constructor with the LUIS configuration provided by the master program (index_step3.js)
    constructor(luisApp, luisOptions, NLUThreshold){
        //LUIS Proxy Creation - the 3rd parameter indicates to include the results of the API.
        this.LuisRecognizer = new LuisRecognizer(luisApp, luisOptions, true);
        //threshold of language understanding
        this.threshold = NLUThreshold;
    };

    // processing message received from the channel (provided by the adapter)
    async onTurn(turnContext){
        // Depending on the type of message, different processing is done
        switch(turnContext.activity.type){
            case ActivityTypes.Message : {
                // get the message text
                let text = turnContext.activity.text.toLowerCase();
                // identification of intent by the module nlu
                let intent = nlureg.detectIntent(text);
                // if an intent is determined - it is treated otherwise, we try to understand
                // language with LUIS
                console.log(`intent: ${intent.intent}`);
                if (intent.intent !== 'unknown'){
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
                } else{
                    //no understanding by regular expressions - we try with LUIS
                    const nluResultat = await this.LuisRecognizer.recognize(turnContext);
                    console.log(`LUIS: ${JSON.stringify(nluResultat)}`);
                    //retrieves the intention with the highest probability
                    const topIntent = nluResultat.luisResult.topScoringIntent;
                    //if confidence in understanding exceeds a configured threshold
                    if (topIntent.score > this.threshold){
                        //treatment of the intents recognized by LUIS
                        switch(topIntent.intent){
                            case 'CityWeather' : {
                                console.log(nluResultat.entities);
                                //recovery of the intent entity
                                let city = "ToBeDetermined";
                                if (nluResultat.entities["City"] !== undefined){
                                    city = nluResultat.entities["City"][0];
                                }
                                if (city === "ToBeDetermined"){
                                    //no city parameter identified
                                    await turnContext.sendActivity('I did not manage to determine the city whose weather you want');
                                } 
                                else{
                                    //city identified
                                    await turnContext.sendActivity(`I still do not know how to get the weather on [${city}] but it will be possible soon`);
                                }
                            }
                            break;
                            default : await turnContext.sendActivity(`I did not recognize this intent - I can only greet, read the weather and say goodbye`);
                        }
                    }
                    else{
                        await turnContext.sendActivity(`I did not recognize this intent - I can only greet, read the weather and say goodbye`);
                    }
                }
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
module.exports.Bot_step3 = Bot_step3;
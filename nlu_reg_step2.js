class NLU_reg_Step2 {
    constructor() {
        // declares three intentions that are detectable by the bot: hello, bye and weather
        let helloIntent = {"utterances":["hello", "hi", "good morning"], "intent": "hello"};
        let byeIntent = {"utterances":["goodbye", "bye", "so long"], "intent": "bye"};
        let weatherIntent = {"utterances":["what's the weather like in (.*)?", "what is the weather on (.*)", 
        "/weather (.*)"], "intent": "weather"};
        this.intents = [];
        this.intents.push(helloIntent);
        this.intents.push(byeIntent);
        this.intents.push(weatherIntent);
    }

    //Intent detection function using regular expression
    //go through the list of intents and look for the one that corresponds to the statement provided as input.
    //returns a structure with the found intent and the identified parameters
    detectIntent(statement){
        let ret = {"intent": "unknown"}; 
        for(let index in this.intents){
            let utterances = this.intents[index].utterances;
            for (let j in utterances){
                let extract = statement.match(utterances[j]);
                if (extract != null){
                    ret.intent = this.intents[index].intent;
                    ret.extract = extract;
                    return ret;
                }
            }
        }
        return ret;
    }
}
module.exports.NLU_reg_Step2 = NLU_reg_Step2;
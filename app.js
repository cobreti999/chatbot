const builder = require('botbuilder');
const restify = require('restify');

//Setup Restify Server
let server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function(){
    console.log('%s listening to %s', server.name, server.url);
});

//const connector = new builder.ConsoleConnector().listen();

let connector = new builder.ChatConnector();
server.post('/api/messages', connector.listen());

let bot = new builder.UniversalBot(connector, function(session){
    session.send('Olá eu sou um bot');
    session.beginDialog('setAppointment');
});

bot.dialog('setAppointment', [(session, args, next) => {
    builder.Prompts.text(session, "Qual o seu nome?");
}, (session, results) => {
    session.userData.name = results.response;
    builder.Prompts.number(session, "Ótimo! Qual a sua idade?");
}, (session, results) => {
    session.userData.age = results.response;
    builder.Prompts.choice(session, "Ok! Qual seu gênero?", ["Masculino", "Feminino"]);
}, (session, results) => {
    session.userData.gender = results.response.entity;
    builder.Prompts.time(session, "Para quando você quer marcar a consulta? Você pode dizer 'tomorrow 10 am or date and time in format ");
}, (session, results) => {
    session.userData.datetime = builder.EntityRecognizer.resolveTime([results.response]);
    let data = session.userData;
    session.send("Obrigado! Eu marquei uma consulta para você as " + data.datetime);
    session.send("Detalhes do agendamento: \nNome: " + data.name + "\nIdade: " + data.age + "\nGênero: " + data.gender);
}]);
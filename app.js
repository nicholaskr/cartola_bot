const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const fs = require('fs');
const axios = require('axios').default;

var Mercado = require('./app/Mercado');
var MaisEscalados = require('./app/MaisEscalados');
var Liga = require('./app/Liga');

const SESSION_FILE_PATH = './session.json';
let sessionData;
if(fs.existsSync(SESSION_FILE_PATH)) {
    sessionData = require(SESSION_FILE_PATH);
}

const client = new Client({
    authStrategy: new LocalAuth({ clientId: "cartola" })
});

client.on('qr', (qr) => {
    // Generate and scan this code with your phone
    console.log('QR Enviado', qr);

    qrcode.generate(qr);
});

client.on('ready', () => {
    console.log('Conectado!');
});

client.on('authenticated', (session) => {
    sessionData = session;
    fs.writeFile(SESSION_FILE_PATH, JSON.stringify(session), (err) => {
        if (err) {
            console.error(err);
        }
    });
});

client.on('message', msg => {
    if (msg.body == 'beron') {
        mensagem = 'Fala meu querido';
        client.sendMessage(msg.from, `${mensagem}`);
    }
});

client.on('message', msg => {
    if (msg.body == 'gol') {
        mensagem = 'De gol eu entendo, só num jogo eu fiz 7';
        client.sendMessage(msg.from, `${mensagem}`);
    }
});

client.on('message', msg => {
    if (msg.body == '!comandos') {
        mensagem = 'Olá, sou o *Bot Beron*, trago informações quentíssimas sobre o jogadores, liga e muito mais, veja os meus comandos abaixo.\n\n'
        mensagem += '*!rodada* - Trás informações sobre a rodada atual e o mercado.\n';
        mensagem += '*!maisescalados* - Lista os 20 jogadores mais escalados da rodada.\n';
        mensagem += '*!ranking* - Exibe o ranking da liga de forma resumida.\n';
        mensagem += '*!rankingcompleto* - Exibe o ranking da liga com informações mais completas.';
        client.sendMessage(msg.from, `${mensagem}`);
    }
});

client.on('message', msg => {
    if (msg.body == '!rodada') {
        Mercado.Infos(function(responseBody) {
            let rodada_atual = responseBody.rodada_atual;
            let status_mercado = responseBody.status_mercado;
            let data_fechamento = responseBody.data_fechamento;
            let hora_fechamento = responseBody.hora_fechamento;


            client.sendMessage(msg.from, `*RODADA Nº ${rodada_atual}*\n\n*Mercado ${status_mercado}*\nFechamento: ${data_fechamento} às ${hora_fechamento}`);
        })
    }
});

client.on('message', msg => {
    if (msg.body == '!maisescalados') {
        MaisEscalados.Infos(function(responseBody) {
            texto = '*Mais escalados da rodada:*';

            for (var i = 0; i < responseBody.length; i++){
                var obj = responseBody[i];
                
                texto += `\n\n*${obj.nome} // ${obj.posicao}*\n`;
                texto += `Time: ${obj.time}\n`;
                texto += `Preço: C$ ${obj.preco}\n`;
                texto += `Nº Escalações: ${obj.escalacoes}`;

            }

            client.sendMessage(msg.from, `${texto}`);
        })
    }
});

client.on('message', msg => {
    if (msg.body == '!ranking') {
        Liga.Infos(function(responseBody) {
            texto = '*Ranking Atual:*\n\n';

            for (var i = 0; i < responseBody.length; i++){
                var obj = responseBody[i];
                
                texto += `*${i+1}º* - ${obj.treinador} - ${obj.pontos_campeonato} pts\n`;

            }

            client.sendMessage(msg.from, `${texto}`);
        })
    }
});

client.on('message', msg => {
    if (msg.body == '!rankingcompleto') {
        Liga.Infos(function(responseBody) {
            texto = '*Ranking Atual (Completo):*';

            for (var i = 0; i < responseBody.length; i++){
                var obj = responseBody[i];
                
                texto += `\n\n*${i+1}º - ${obj.nome_time}*\n`;
                texto += `Treinador: *${obj.treinador}* \n`;
                texto += `Pontos turno: *${obj.pontos_turno}*\n`;
                texto += `Pontos campeonato: *${obj.pontos_campeonato}*\n`;
                texto += `Patrimônio: C$ *${obj.patrimonio}*`;

            }

            client.sendMessage(msg.from, `${texto}`);
        })
    }
});

client.initialize();
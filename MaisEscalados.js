const axios = require('axios');

var base = 'https://cartola.nrgsistemas.com.br/index.php?metodo=maisescalados';

async function Infos(callback) {

    const config = {
        method: 'get',
        url: base
    }

    let res = await axios(config)

    callback(res.data);
}

module.exports.Infos = Infos;

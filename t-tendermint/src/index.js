const request = require('request-promise');


async function sendTx( baseURL , tx) {
    try {
        let result;
        let error;
        let options = {
            url: baseURL + '/broadcast_tx_commit?tx=' + tx ,
        };

        await request.post(options, (err, res, body) => {
            if (err) error = err;
            result = res;
        });
        if (error) throw error;

        return result.body;
    } catch (err) {
        throw err;
    }
}

module.exports = {
    sendTx: sendTx
}

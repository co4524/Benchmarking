const request = require('request-promise');
const sleep = require('sleep');


async function getHorInfo( baseURL ) {
    try {
        let result;
        let error;
        let options = {
            url: baseURL  ,
        };

        await request.get(options, (err, res, body) => {
            if (err) error = err;
            result = res;
        });
        if (error) throw error;

        return JSON.parse(result.body);
    } catch (err) {
        throw err;
    }
}

async function getCoreInfo( baseURL ) {
    try {
        let result;
        let error;
        let options = {
            url: baseURL + '/info' ,
        };

        await request.get(options, (err, res, body) => {
            if (err) error = err;
            result = res;
        });
        if (error) throw error;

        return JSON.parse(result.body);
    } catch (err) {
        throw err;
    }
}

async function getLedger( baseURL , id ) {
    try {
        let result;
        let error;
        let options = {
            url: baseURL + '/ledgers/' + id,
        };

        await request.get(options, (err, res, body) => {
            if (err) error = err;
            result = res;
        });
        if (error) throw error;

        return JSON.parse(result.body);
    } catch (err) {
        throw err;
    }
}

async function getAccount( baseURL , address ) {
    try {
        let result;
        let error;
        let options = {
            url: baseURL + '/accounts/' + address,
        };

        await request.get(options, (err, res, body) => {
            if (err) error = err;
            result = res;
        });
        if (error) throw error;

        return JSON.parse(result.body);
    } catch (err) {
        throw err;
    }
}

async function getTransaction( baseURL , hash ) {
    try {
        let result;
        let error;
        let options = {
            url: baseURL + '/transactions/' + hash,
        };

        await request.get(options, (err, res, body) => {
            if (err) error = err;
            result = res;
        });
        if (error) throw error;

        return JSON.parse(result.body);
    } catch (err) {
        throw err;
    }
}

module.exports = {
    getLedger: getLedger,
    getAccount: getAccount,
    getTransaction: getTransaction,
    getCoreInfo: getCoreInfo,
    getHorInfo: getHorInfo
}
const api = require('/home/caideyi/evm-lite-js/index.js')
const sleep = require('sleep');
const keythereum = require('keythereum');
const ethTx = require('ethereumjs-tx');
const utils = require('/home/caideyi/evm-lite-js/test/utils.js');
const moment = require('moment');
const fs = require('fs');
const readline = require('readline');

// ethereum root directory (for retreive keystore) and keystore password
const URL_dir = '/home/caideyi/evm-lite-js/test/baseURL'
const source__AddressDir = '/home/caideyi/evm-lite-js//test/testAccount/address'
const source_privKeydir = '/home/caideyi/evm-lite-js/test/testAccount/pKey'
const ouput_dir = '/home/caideyi/evm-lite-js/test/txRequestTime'
const rawTx_dir = '/home/caideyi/evm-lite-js/test/transactions.json'
const threadNum = 1 ;
var privKey = [];
var sendTime = [];
//const baseURL = 'http://localhost:8080';
const iter = parseInt( process.argv[2] , 10) ; 
const threadId = 0;
const interval = 0;
var baseURL2 = [];
testBasicAPI()

async function testBasicAPI() {

    let baseURL = await getURL(URL_dir);

    await url(baseURL);
    console.log(baseURL2);

    let rawTxList = await GetRawTx (rawTx_dir) ; 
    await workload ( rawTxList , iter , interval) ;
    await txRequestTime();

}

async function url ( baseUrl ) {
	
	ii = baseUrl.length/threadNum;
	if (ii < 3) {
		baseURL2[0] = baseUrl[0];
		return true;
	}
	for ( var i = 0 ; i < ii ; i ++ ) {
		baseURL2[i] = baseUrl[threadId+i*threadNum];
	}
	return true;
}

async function workload ( rawTx , iter , interval) {

    ll = baseURL2.length;
	/*
    var start = interval/threadNum*threadId ;
    return new Promise((resolve, reject) => {
        for ( var i = 0 ; i < iter ; i++ ) {
            setTimeout( function (i) {
                if (i == iter - 1) {resolve();}
                if (i%1000 == 0) {console.log(i , "send");}	
                api.sendRawTx( baseURL2[i%ll] , rawTx[i] );
		sendTime[i] = moment().valueOf();

            }, start + (interval * i) , i ) ;
        }

    });
*/
	for ( var i =0 ; i < iter ; i++ ) {
		
		api.sendRawTx( baseURL2[i%ll] , rawTx[i] );
		console.log("send" , rawTx[i] );
		sendTime[i] = moment().valueOf();
	}

}


async function GetRawTx(dir) { 

    var rawList = [];
    var array = fs.readFileSync(dir).toString().split('","');
    var index = 0;
    console.log("Thread :" , threadId , "Send" , iter , "Raw txs")
    var num = iter*threadId;
    for (var i = num ; i < num+iter ; i++) {
        rawList[index] = array[i+1];
        index++;
    }
    return rawList;

}



async function txRequestTime() { 

    for (var i = 0 ; i < sendTime.length ; i ++){

        if(i == 0){

            fs.appendFileSync( ouput_dir , sendTime[i] + "\n" , function (err) {
                if (err)
                    console.log(err);
            });

        }

        else{

            fs.appendFileSync( ouput_dir , sendTime[i] + "\n" , function (err) {
                if (err)
                    console.log(err);
                else
                    console.log('Write operation complete.');
            });
        }
    }
    return true;

}


async function getURL(dir) { 

    var array = fs.readFileSync(dir).toString().split("\n");
    array.splice(array.length-1,1);
    return array;

}

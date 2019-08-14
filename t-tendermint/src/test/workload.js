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
const rawTx_dir = '/home/caideyi/evm-lite-js/test/RawTx'
const threadNum = 1 ;
var privKey = [];
var sendTime = [];
//const baseURL = 'http://localhost:8080';
const iter = parseInt( process.argv[3] ,10)/threadNum ; 
const threadId = parseInt( process.argv[4] , 10);
const interval = parseFloat( process.argv[2] , 10)*threadNum;
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
//		console.log("send" , baseURL2[i%ll] );
		sendTime[i] = moment().valueOf();
	}

}

async function genRawtx ( account , privateKey , iter ) {

    var rawTxList = [];
    var num = parseInt( process.argv[4] ,10) ;
    console.log("num",num);
    let des = await api.getAccount( baseURL[0], account[0] );
    let to = des.address
    for ( var i = 0 ; i < iter ; i++ ){

        result = await api.getAccount(baseURL[0] , account[num] );
        //console.log(result);
        let txParams = {
            nonce: result.nonce ,//+ addValue,
            to: to,
            gasLimit: '0x30000',
            value: '0x01'
        };
        let tx = new ethTx(txParams);
        tx.sign(privateKey[num]);
        let rawTx = '0x' + tx.serialize().toString('hex');
        rawTxList[i] = rawTx;
        num+=1;
    }
    return rawTxList;
}

//Read privKey buf from [dir]
function getKey ( dir ){
    var arr;
    var str;
    var pk = [];
    arr = fs.readFileSync(dir).toString().split("\n");
    // -1是因為切割後陣列最後面會多出一個空位置
    for (var i =0; i < arr.length-1; i++ ){
        const buf = new Buffer.from([0x8c, 0x3d, 0x71, 0x0e, 0xef, 0x05, 0x0e, 0xf3, 0xa1, 0x3d, 0x03, 0x5a, 0xd0, 0x05, 0xd0, 0x9e, 0x9d, 0x6b, 0xc7, 0x57, 0x6a, 0xf3, 0x5a, 0xd2, 0xf1, 0x3f, 0xf9, 0xde, 0xd3, 0x65, 0x29, 0x45]);
        str = arr[i].split(" ");
        for(var j =0; j < buf.length; j++){
            buf[j] = str[j+1];
            //+1 因為dir裡面array第一個值是序列
        }

        pk[i] = buf;
    }

    return pk;
}

async function GetRawTx(dir) { 

    var rawList = [];
    var array = fs.readFileSync(dir).toString().split("\n");
    var index = 0;
    console.log("Thread :" , threadId , "Send" , iter , "Raw txs")
    var num = iter*threadId;
    for (var i = num ; i < num+iter ; i++) {
        rawList[index] = array[i];
        index++;
    }
    return rawList;

}


async function getAccount(dir) { 

    var array = fs.readFileSync(dir).toString().split("\n");
    return array;

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

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
const output_dir = '/home/caideyi/evm-lite-js/test/RawTx'
const output_dir2 = '/home/caideyi/evm-lite-js/test/Nonce'
const des_address = '0x6666666666666666666666666666666666666666'
const threadNum = 6
var ac_nonce = [];
var privKey = [];
//const baseURL = 'http://localhost:8080';
const iter = parseInt( process.argv[2] ,10) ; 
var baseURL = [];
testBasicAPI()

async function testBasicAPI() {

    baseURL = await getURL(URL_dir);
    console.log('Getting node address');
    console.log(baseURL);

    let arr = await getAccount(source__AddressDir);
    console.log('Getting test account address');
    await sleep.sleep(1);

    await check();

    let key = await getKey( source_privKeydir );
    console.log('Getting test account privKey');
    sleep.sleep(1); 
    
    console.log( 'Generate ' , iter , 'Rawtx' );
    let rawTxList = await genRawtx( arr , key , iter );
    await sleep.sleep(1);

    console.log( 'Write RawTx File' );
    await writeRawTx( output_dir , rawTxList);
    //console.log( 'Write Nonce File' );
    //await writeRawTx( output_dir2 , ac_nonce );
    //console.log(time);
    //console.log("ST: ", moment(time).format('YYYY-MM-DDTHH:mm:ss.SSSS'));
    //console.log("ET: ", moment(time2).format('YYYY-MM-DDTHH:mm:ss.SSSS'));

}

async function check ( ) {
	for ( var i =0 ; i < baseURL.length ; i++){
		let result = await api.getAccount( baseURL[i] , des_address );
		console.log("node",i,"-ip: " ,baseURL[i]," query : ", result);
	}
	return true
}
async function genRawtx ( account , privateKey , iter ) {

    var rawTxList = [];
    var num = 0 ;
    var ll = baseURL.length
    for ( var i = 0 ; i < iter ; i++ ){

        result = await api.getAccount(baseURL[i%ll] , account[num] );
	ac_nonce[i] = result.nonce ;
        //console.log(result);
        let txParams = {
            nonce: result.nonce ,//+ addValue,
            to: des_address,
            gasLimit: '0x30000',
            value: '0x01'
        };
        let tx = new ethTx(txParams);
        tx.sign(privateKey[num]);
        let rawTx = '0x' + tx.serialize().toString('hex');
	//console.log(rawTx);
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


async function getAccount(dir) { 

    var array = fs.readFileSync(dir).toString().split("\n");
    return array;

}


async function writeRawTx( dir , array) { 

    for (var i = 0 ; i < array.length ; i ++){

        if(i == 0){

            fs.writeFileSync( dir , array[i] + "\n" , function (err) {
                if (err)
                    console.log(err);
            });

        }

        else{

            fs.appendFileSync( dir , array[i] + "\n" , function (err) {
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

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
const source_AddressDir = '/home/caideyi/evm-lite-js//test/testAccount/address'
const ouput_dir = '/home/caideyi/evm-lite-js/test/Nonce2'
const des_address = '6666666666666666666666666666666666666666'
var baseURL = [];
const threadNum = 1 ;
const iter = parseInt( process.argv[2] ,10) ; 
const init_v = parseInt( process.argv[3] ,10) ;
testBasicAPI()

async function testBasicAPI() {

    baseURL = await getURL(URL_dir);
    await checksum( init_v ) ;
    //var account = [] ;
    //account = await getURL(source_AddressDir);
    //var nonce = [] ;
    //nonce = await check( account ) ;
    //await writeFile( nonce ) ;

}
async function check( acc ) {
	
	var arr = [];
	for ( var i =0 ; i <iter ; i++){
		let result = await api.getAccount( baseURL[0] , acc[i])
		arr[i] = result.nonce;
	}
	return arr;
}
async function checksum ( init ) {

    cor = init + iter*threadNum ;
    ll = baseURL.length ;
    tmp = 0 ;
    time = 0 ;
    trigger = false ;
    num = 0 ;
    for ( var i = 0 ; i < 50 ; i++ ){
		num =0 ;
		for ( var j = 0 ; j < ll ; j++) {
        		let result = await api.getAccount( baseURL[j], des_address );
        		if (result.balance==cor ){ num+=1 ; console.log(num) ; }
			else {
				break;
			}
			if (num == ll ){
				trigger = true ;
			}
		}
	if (trigger == true){
		break;
	}
	else{
        	console.log( i , "wait tx done...");
        	await sleep.sleep(2);
	}
    }
    return true ;
}

async function writeFile(array) { 

    for (var i = 0 ; i < array.length ; i ++){

        if(i == 0){

            fs.writeFileSync( ouput_dir , array[i] + "\n" , function (err) {
                if (err)
                    console.log(err);
            });

        }

        else{

            fs.appendFileSync( ouput_dir , array[i] + "\n" , function (err) {
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

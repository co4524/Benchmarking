const API = require('/home/caideyi/Benchmarking/t-tendermint/src/index.js');
const moment = require('moment');
const fs = require('fs');
const sleep = require('sleep');
const URL_dir = '/home/caideyi/Benchmarking/t-tendermint/src/test/baseURL'
const Rawtx_dir = '/home/caideyi/Benchmarking/t-tendermint/src/test/RawTx'
const Requst_dir = '/home/caideyi/Benchmarking/t-tendermint/data/txRequestTime'
var sendTime = []
const iter = parseInt( process.argv[2] ,10); 
var baseURL = [];
testBasicAPI()

async function testBasicAPI() {

    // Get URL
    baseURL = await getURL(URL_dir)
    console.log(baseURL)

    //Read Raw transaction file
    let rawTxList = await GetRawTx (Rawtx_dir) 

    // Waitting for new block commit
    let tendermintInfo1 = await API.tendermintInfo( baseURL[0] ) 
    while(true){
        let tendermintInfo2 = await API.tendermintInfo( baseURL[0] ) 
        console.log("Current Block Height :　" , tendermintInfo2.result.sync_info.latest_block_height);
        if (tendermintInfo2.result.sync_info.latest_block_height!=tendermintInfo1.result.sync_info.latest_block_height){
            break
        }
        await sleep.msleep(500)
    }

    // Submit [iter] transactions
    await workload ( rawTxList , iter ) ;

    // Output every transavtions's request time
    await txRequestTime(Requst_dir);

}


async function workload ( rawTx , iter ) {

    ll = baseURL.length;

	for ( var i =0 ; i < iter ; i++ ) {
		API.sendTx( baseURL[i%ll] , rawTx[i] );
        sendTime[i] = moment().valueOf();
        if(i%2000==0){
            console.log("Send tx")
        }
	}
    await Promise.all(sendTime) ;
    return sendTime;
}


async function GetRawTx( dir ) { 

    var array = fs.readFileSync(dir).toString().split("\n");
    return array;

}


async function txRequestTime(ouput_dir) { 

    for (var i = 0 ; i < sendTime.length ; i ++){

        if(i == 0){

            fs.writeFileSync( ouput_dir , sendTime[i] + "\n" , function (err) {
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

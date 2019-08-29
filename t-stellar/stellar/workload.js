const api = require('/home/caideyi/Benchmarking/t-stellar/stellar/index.js');
const URL_dir = '/home/caideyi/Benchmarking/t-stellar/script/baseURL'
const path_CommitTime = '/home/caideyi/data/blockCommitTime.txt'
const path_txRequestTime = '/home/caideyi/data/txRequestTime'
const path_blockTxNum = '/home/caideyi/data/blockTxNum.txt'
const fs = require('fs');
const sleep = require('sleep');
const moment = require('moment');
var StellarSdk = require('stellar-sdk');
//var server = new StellarSdk.Server( baseURL ,{allowHttp: true});
var server = [];
//use private network
StellarSdk.Network.use(new StellarSdk.Network("stellar"));
//If the local Horizon connects with the testnet
//var server = new StellarSdk.Server('http://10.91.5.43:8000',{allowHttp:true});
// var rootAccount = require('./'+process.argv[3]);
// var wallet = require('./'+process.argv[2]);
//var sourceKeys = account.privateKey;
const total_tx = parseInt( process.argv[2] ,10) ; 
var source =  require('./keystore.json');
var acc =  require('./testAcc.json');
var baseURL2 = [];
const stellar_core = "http://10.140.3.0:11626"
//console.log(sourceKeys);
//var destinationId = 'GBBAJPWGVUWJM7DWKKKH5NOONYJL3NPWRZTQCYFQPAUYN34LH6NNNJZ3';
// Transaction will hold a built transaction we can resubmit if the result is unknown.
//testAPI()
main()
// async function testAPI(){
//   let res = await api.getHorInfo(horizon)
//   console.log(res.history_latest_ledger)
// }
async function main () {

  if (isNaN(total_tx)) {
    console.log( "Usage : node sendTx.js [total_txs] ")
    return true ;
  }


  let baseURL = await getURL(URL_dir);

  await url(baseURL);
  console.log(baseURL2);
  await getServer(baseURL2);
  let StartBalance = await LoadAccount(source.table[0].publicKey) ; 
  let EndBalance = Number(StartBalance)+total_tx ;
  console.log("Starting Value" , StartBalance) ;

  let txInfo = await workloader( total_tx );
  let request_time = txInfo[0];
  let startLedgerIndex = txInfo[1];
  let trigger = 0
  let trigger2 = 0
  let trigger3 = true

  while(trigger3){
    StartBalance = await LoadAccount(source.table[0].publicKey) ;
    console.log("Wait transaction compelete Now:" , Number(StartBalance) , " Expect : ", EndBalance)
    let Info2 = await api.getCoreInfo(stellar_core)
    let Info = await api.getHorInfo(baseURL2[0])
    let EndLedgerIndex = Info.history_latest_ledger
    console.log("StellarBlockHeight" , Info2.info.ledger.num )
    console.log("HorBlockHeight" , EndLedgerIndex  , "Trigger" , trigger , "Trigger2" , trigger2)
    if(Info2.info.ledger.num==EndLedgerIndex+1){
      trigger2+=1
    }
    if(Info2.info.ledger.num==EndLedgerIndex || trigger2 > 2 ){
      trigger+=1
      if (Number(StartBalance) == EndBalance || trigger==3 || trigger2 > 2 ) {
        console.log("transaction done")
        let data = await getLedgerInfo ( startLedgerIndex , EndLedgerIndex  ) ;

        //Output data
        await outputData( path_blockTxNum , data[0] );
        await outputData( path_CommitTime , data[1] );
        await outputData( path_txRequestTime , request_time );
        console.log("BlockHeight: " , EndLedgerIndex )
        break
      }
    }
    await sleep.sleep(5)
  }




}


async function LoadAccount ( pub ) {
  return new Promise((resolve, reject) => { 

    server[0].loadAccount(pub).then(function(Account) {
      Account.balances.forEach(function(balance) {
        resolve(balance.balance);
      });
    });
  })

}



async function getLedgerInfo ( start , end ) {

  var blockTxNum = []
  var blockCommitTime = []

  for (var i = start ; i < end+1 ; i++ ) {
    let result = await api.getLedger( baseURL2[0] , i ); 
    //console.log(moment.utc( result.closed_at.replace('Z','.500-00:00') ).valueOf())
    if(result.successful_transaction_count!=0){
      blockCommitTime.push(moment.utc( result.closed_at.replace('Z','.500-00:00') ).valueOf())
      blockTxNum.push(result.successful_transaction_count)
      console.log("Ledger" , i , "  :" , result.successful_transaction_count)
    }
  }

  return [ blockTxNum , blockCommitTime ] 

}


async function workloader ( amount ) {
  var from = acc.table;
  var to = source.table;
  var res = [];
  var tx = [];
  var sendTime = [];
  var ll = baseURL2.length;
  var rawtx = [];


  console.log("Generate transaction....");
  for (var i = 0 ; i < amount ; i++){
    tx[i] = GenRawTx( from[i].privateKey , to[0].publicKey , i%ll);
    // if (i%200==0){
    //   console.log("FF");
    // }
  }
  await Promise.all(tx) ;
  console.log("Done");
  for (var i = 0 ; i < amount ; i++ ){
    rawtx[i] = await tx[i];
  }

  var startLedgerIndex = 0 ;
  let Info = await api.getCoreInfo(stellar_core)
  console.log("NowBlockHeight" , Info.info.ledger.num )

  while(true){
    let Info2 = await api.getCoreInfo(stellar_core)
    console.log("NowBlockHeight" , Info2.info.ledger.num )
    if (Info.info.ledger.num!=Info2.info.ledger.num){ 
      startLedgerIndex = Info2.info.ledger.num 
      break;
    }
    await sleep.msleep(500)
  }
  console.log("BlockHeight: " , startLedgerIndex )

  console.log("Sending transaction....");
  for (var i = 0 ; i < amount ; i++){
    sendTx( rawtx[i] , i%ll );
    sendTime[i] = moment().valueOf();
  }


  await Promise.all(sendTime) ;
  return [sendTime , startLedgerIndex];

}

async function sendTx( tx , index ){
  return new Promise((resolve, reject) => { 
    return server[index].submitTransaction(tx)
    .then(function(result) {
      //console.log('Success! Results:',result);
      resolve( result.ledger );
    })
    .catch(function(error) {
      //console.error('Something went wrong!', error);
      resolve(error);
      // If the result is unknown (no response body, timeout etc.) we simply resubmit
      // already built transaction:
      // server.submitTransaction(transaction);
    });
  })
}


async function GenRawTx( from_privateKey , des_publicKey , index ){
  var transaction;
  var sourceKeys = StellarSdk.Keypair.fromSecret(from_privateKey);
  // First, check to make sure that the destination account exists.
  // You could skip this, but if the account does not exist, you will be charged
  // the transaction fee when the transaction fails.
  return new Promise((resolve, reject) => {

    server[index].loadAccount(sourceKeys.publicKey())
      .then(function(sourceAccount) {
        // Start building the transaction.
        transaction = new StellarSdk.TransactionBuilder(sourceAccount , opts={fee:100})
          .addOperation(StellarSdk.Operation.payment({
            destination: des_publicKey,
            // Because Stellar allows transaction in many currencies, you must
            // specify the asset type. The special "native" asset represents Lumens.
            asset: StellarSdk.Asset.native(),
            amount: "1"
          }))
          // A memo allows you to add your own metadata to a transaction. It's
          // optional and does not affect how Stellar treats the transaction.
          .addMemo(StellarSdk.Memo.text('Test Transaction'))
          .setTimeout(1000000)
          .build();
        // Sign the transaction to prove you are actually the person sending it.
        transaction.sign(sourceKeys);
        // And finally, send it off to Stellar!
        return transaction;
        //return server[index].submitTransaction(transaction);
      })
      .then(function(transaction) {
        //console.log('Success! Results:',result.ledger);
        resolve( transaction );
      })
      .catch(function(error) {
        console.error('Something went wrong!', error);
        resolve(error);
        // If the result is unknown (no response body, timeout etc.) we simply resubmit
        // already built transaction:
        // server.submitTransaction(transaction);
      });

  })
}



async function outputData( _path , _value ) { 

  for (var i = 0 ; i < _value.length ; i ++){

      if(i == 0){

          fs.writeFileSync( _path , _value[i] + "\n" , function (err) {
              if (err)
                  console.log(err);
          });

      }

      else{

          fs.appendFileSync( _path , _value[i] + "\n" , function (err) {
              if (err)
                  console.log(err);
              else
                  console.log('Write operation complete.');
          });
      }
  }
  return true;

}

async function getServer ( baseUrl ) {

  for ( var i = 0 ; i < baseUrl.length ; i ++ ) {
    server[i] =  new StellarSdk.Server(baseUrl[i],{allowHttp: true});
  }
  return true;
}

async function url ( baseUrl ) {
	
  ii = baseUrl.length;
  if (ii < 3) {
    baseURL2[0] = baseUrl[0];
    return true;
  }
  for ( var i = 0 ; i < ii ; i ++ ) {
    baseURL2[i] = baseUrl[i];
  }
  return true;
}

async function getURL(dir) { 

  var array = fs.readFileSync(dir).toString().split("\n");
  array.splice(array.length-1,1);
  return array;

}

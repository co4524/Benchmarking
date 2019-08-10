const api = require('/home/caideyi/stellar/stellar/index.js');
const path_CommitTime = '/home/caideyi/data/blockCommitTime.txt'
const path_txRequestTime = '/home/caideyi/data/txRequestTime'
const path_blockTxNum = '/home/caideyi/data/blockTxNum.txt'
const fs = require('fs');
const moment = require('moment');
var baseURL = 'http://localhost:8000';
var StellarSdk = require('stellar-sdk');
var server = new StellarSdk.Server( baseURL ,{allowHttp: true});
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
//console.log(sourceKeys);
//var destinationId = 'GBBAJPWGVUWJM7DWKKKH5NOONYJL3NPWRZTQCYFQPAUYN34LH6NNNJZ3';
// Transaction will hold a built transaction we can resubmit if the result is unknown.


main()



async function main () {

  if (isNaN(total_tx)) {
    console.log( "Usage : node sendTx.js [total_txs] ")
    return true ;
  }

  let txInfo = await workloader( total_tx );
  let request_time = txInfo[1];
  let ledger_id = txInfo[0];

  var LederID = [];
  for (var i = 0 ; i < ledger_id.length ; i++ ){
    LederID[i] = await ledger_id[i];
    //console.log( "transaction " , i , " ledger:   " , LederID[i] );
  }

  let data = await getLedgerInfo ( LederID , request_time ) ;

  //Output data
  await outputData( path_blockTxNum , data[0] );
  await outputData( path_CommitTime , data[1] );
  await outputData( path_txRequestTime , data[2] );

}

async function getLedgerInfo ( tx , reqTime) {

  var stat = {};
  var error = {};
  var time = {};
  var blockTxNum = [];
  var blockCommitTime = [];
  var reqestTime = [];


    //statistics tx's Info
    tx.forEach(function(item) {
      if (typeof item == "number") {
        stat[item] = stat[item] ? stat[item] + 1 : 1;
      }
      else {
        error[item] = error[item] ? error[item] + 1 : 1;
      }
    });


    //Get requestTime for each block
    for (var i = 0 ; i < Object.keys(stat).length ; i ++ ){
      time[Object.keys(stat)[i]] = reqestTime.slice();
    }

    for (var i = 0 ; i < reqTime.length ; i ++){
      for (var j = 0 ; j < Object.keys(stat).length ; j ++ ){

        if ( tx[i] == Object.keys(stat)[j] ){
          time[Object.keys(stat)[j]].push(reqTime[i]);
          break;
        }
        
      }
    }
    // for (var i = 0 ; i < Object.keys(stat).length ; i ++){
    //   console.log( "Ledger" , Object.keys(stat)[i] , "   " , time[Object.keys(stat)[i]].length);
    // }



    //Get transaction number for each block
    var num = 0;
    Object.keys(stat).forEach(function(item) {
      blockTxNum[num] = stat[item];
      num += 1;
    })

    //Get commit time for each block
    for (var i = 0 ; i < Object.keys(stat).length ; i ++){
      let result = await api.getLedger( baseURL , Object.keys(stat)[i] ); 
      blockCommitTime[i] = moment.utc( result.closed_at.replace('Z','.500-00:00') ).valueOf() ;
    }

    //Get requestTime for each block  - append to one array
    num = 0;
    for (var i = 0 ; i < Object.keys(stat).length ; i ++){
      let arr = time[Object.keys(stat)[i]] ;
      for (var j = 0 ; j < arr.length ; j ++){
        reqestTime[num] = arr[j];
        num += 1;
      }
    }

    //debug
     console.log( "ReqestTime" , reqestTime);
     console.log( "TxNum" , blockTxNum );
     console.log( "CommitTime" , blockCommitTime );
     console.log("Stat: " , stat );
     console.log("Error" , error );

    return [ blockTxNum , blockCommitTime , reqestTime ] ;



}


async function workloader ( amount ) {
  var from = acc.table;
  var to = source.table;
  var res = [];
  var sendTime = [];

  for (var i =0 ; i < amount ; i++){
    res[i] = SendTx( from[i].privateKey , to[0].publicKey );
    sendTime[i] = moment().valueOf();
  }

  await Promise.all(res) ;
  return [res , sendTime ];

}

async function SendTx( from_privateKey , des_publicKey ){
  var transaction;
  var sourceKeys = StellarSdk.Keypair.fromSecret(from_privateKey);
  // First, check to make sure that the destination account exists.
  // You could skip this, but if the account does not exist, you will be charged
  // the transaction fee when the transaction fails.
  return new Promise((resolve, reject) => { 

    server.loadAccount(des_publicKey)
      // If the account is not found, surface a nicer error message for logging.
      .catch(StellarSdk.NotFoundError, function (error) {
        throw new Error('The destination account does not exist!');
      })
      // If there was no error, load up-to-date information on your account.
      .then(function() {
        return server.loadAccount(sourceKeys.publicKey());
      })

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
          .setTimeout(10000)
          .build();
        // Sign the transaction to prove you are actually the person sending it.
        transaction.sign(sourceKeys);
        // And finally, send it off to Stellar!
        return server.submitTransaction(transaction);
      })
      .then(function(result) {
        //console.log('Success! Results:',result.ledger);
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

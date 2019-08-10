var StellarSdk = require('stellar-sdk');
var rootAccount = require('./rootAccount.json');
const URL_dir = '/home/caideyi/Benchmarking/t-stellar/script/baseURL'
const sleep = require('sleep');
var fs = require('fs');
StellarSdk.Network.use(new StellarSdk.Network("stellar"));
var server ;
var sourceKeys = StellarSdk.Keypair.fromSecret(rootAccount.privateKey);
const ManyAcc = 20000 ;
const MaxOperation = 5000 ;

main();

async function main(){


  await URL();
  console.log("Create Account");
  await createStartingAccount () ;
  await console.log("Done");

  await createKey( ManyAcc , "testAcc.json" );

  for ( var i =0 ; i < ManyAcc/MaxOperation ; i ++){

    await createManyAccount (i*MaxOperation) ;
    console.log("Done!!") ;
  
  }
  
}

async function createManyAccount ( num ) {

  var source = await require('./keystore.json');
  var acc = await require('./testAcc.json');
  var res = [];

    
    for ( var i = 0 ; i < 50 ; i++){
      var sourceKey = StellarSdk.Keypair.fromSecret(source.table[i].privateKey)
      if (i!=49) {
        res[i] = createAcc( sourceKey , "10000" , i*100+num , (i+1)*100+num, acc);
      }
      else {
        res[i] = createAcc( sourceKey , "10000" , i*100+num , (i+1)*100+num , acc);
      }
    }

    await Promise.all(res);


}

async function createStartingAccount () { 

  
  await createKey( 50 , "keystore.json" );
  var acc = require('./keystore.json');
  await createAcc( sourceKeys , "50000000" , 0 , 50 , acc );
  return true ;

}


async function createKey( end , fileName){

  var pub = [];
  var priv = [];
  var obj = {
    table: []
  };

  console.log("Create", end , "Key" );

  return new Promise((resolve, reject) => { 

    for (var i = 0 ; i< end ; i++ ){
      var pair = StellarSdk.Keypair.random();
      pub[i] = pair.publicKey();
      priv[i] = pair.secret();
      obj.table.push({publicKey:pub[i], privateKey:priv[i]});
      // console.log('privateKey: '+ priv[i] );
      // console.log('publicKey: '+ pub[i] );
    }

    var json = JSON.stringify(obj);
    fs.writeFile( fileName , json, 'utf8' , function(err) {
      if (err) {
        console.log("writeError" , err);
        resolve();
      }
      else {
        console.log('Write operation complete.');
        resolve();
      }
    });

  })
  

}

async function createAcc( keypair , amount , start , end , acc){

  var transaction;
  console.log("Create " , end-start , " Account With" , amount);

  return new Promise((resolve, reject) => { 
    server.loadAccount(keypair.publicKey())
    .then(function(sourceAccount) {
      //console.log(sourceAccount)
      transaction = new StellarSdk.TransactionBuilder(sourceAccount, opts={fee:100})
      return transaction;
    })
      .then(function(transaction) {
        for (var i = start ; i < end ; i ++){
          transaction = transaction.addOperation(StellarSdk.Operation.createAccount({
            destination: acc.table[i].publicKey,
            startingBalance: amount
          }))
        }
        transaction = transaction.addMemo(StellarSdk.Memo.text('Hello world!'))
        .setTimeout(30)
        .build(); 
        transaction.sign(keypair);
        return server.submitTransaction(transaction);
      })
      .then(function(result) {
        console.log('Success! Results:');
        resolve(result);
      })
      .catch(function(error) {
        console.error('Something went wrong!', error);
        resolve(error);
      });

    })
      
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

  async function getURL(dir) { 

    var array = fs.readFileSync(dir).toString().split("\n");
    array.splice(array.length-1,1);
    return array;

}

async function URL(){
  let baseURL = await getURL(URL_dir);
  console.log(baseURL);
  server = new StellarSdk.Server(baseURL[0],{allowHttp: true});
  return true ;
}
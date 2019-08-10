var StellarSdk = require('stellar-sdk');
var acc =  require('./keystore.json');
//var server = new StellarSdk.Server('https://horizon-testnet.stellar.org');
//var server = new StellarSdk.Server('https://horizon.stellar.org');
//If the local Horizon connects with the testnet
var server = new StellarSdk.Server('http://localhost:8000',{allowHttp: true});

// SAV76USXIJOBMEQXPANUOQM6F5LIOTLPDIDVRJBFFE2MDJXG24TAPUU7
//var publicKey = 'GBM32CRNBXJSP4VWH7FWYZ7F2RDBKRTFEAC6GOB24BUD3VCWBDLK6YKS';
// get a list of transactions that occurred in ledger 1400
/*
server.transactions()
    .forLedger(0)
    .call().then(function(r){ console.log(r); });
*/
// get a list of transactions submitted by a particular account
/*
server.transactions()
    .forAccount('GAJKWBSYMR46PHG2KJQBE33LQN3T5LJJC7P6CQW7MDU2ZNSGPBLDHU3O')
    .call().then(function(r){ console.log(r); });
*/
//get the balance of a particular account
main();
async function main(){
  
    getBalance(acc.table[0].publicKey);
  
}

async function getBalance(publicKey){
  server.loadAccount(publicKey).then(function(Account) {
    //console.log(Account);
    console.log('Balances for account: ' + publicKey);
    Account.balances.forEach(function(balance) {
      console.log('Type:', balance.asset_type, ', Balance:', balance.balance);
    });
  });
}

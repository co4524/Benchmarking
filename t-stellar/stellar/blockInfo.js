var StellarSdk = require('stellar-sdk');
var server = new StellarSdk.Server('http://localhost:8000',{allowHttp: true});
const api = require('/home/caideyi/stellar/stellar/index.js')
var baseURL = 'http://localhost:8000';
var id = parseInt( process.argv[2] ,10) ;
var acc = require('./testAcc.json');

testBasicAPI()

async function testBasicAPI() {

    if (isNaN(id)) {
        console.log( "Usage : node blockInfo.js [ledger_id] ")
        return true ;
      }

    let result = await api.getLedger( baseURL , id ); 
    console.log(result.closed_at);

    // for ( var i =0 ; i < acc.table.length ; i++ ){
    //     let result = await api.getAccount( baseURL , acc.table[i].publicKey ); 
    //     console.log(result);
    // }

}
// server.transactions()
//     .forLedger(1012)
//     .limit("100")
//     .call().then(function(r){ console.log("Result" , r.records[0]); });




//const URL_dir = '/home/caideyi/evm-lite-js/test/baseURL'
const fs = require('fs');
const tx_dir = '/home/caideyi/evm-lite-js/test/transactions.json';

//console.log(obj);
testBasicAPI()
async function testBasicAPI() {
    let arr = await getURL(tx_dir);
    console.log(arr.length);
}
async function getURL(dir) { 

    var array = fs.readFileSync(dir).toString().split('","');
    array.splice(array.length-1,1);
    return array;

}




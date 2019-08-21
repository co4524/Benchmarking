const sleep = require('sleep');
const ethTx = require('ethereumjs-tx');
const fs = require('fs');

// ethereum root directory (for retreive keystore) and keystore password
const source_privKeydir = '/home/caideyi/Benchmarking/t-tendermint/src/test/testAccount/pKey'
const output_dir = '/home/caideyi/Benchmarking/t-tendermint/src/test/RawTx'
const des_address = '0x6666666666666666666666666666666666666666'
//const baseURL = 'http://localhost:8080';
const ITER = parseInt( process.argv[2] ,10) ; 
const NONCE = parseInt( process.argv[3] ,10) ; 

testBasicAPI()

async function testBasicAPI() {

//  Get private key
    let key = await getKey( source_privKeydir );
    console.log('Getting test account privKey');

//  Generate Raw transactions
    console.log( 'Generate ' , ITER , 'Rawtx' );
    let rawTxList = await genRawtx( NONCE , key , ITER );

//  Output RawTx to [output_dir]
    console.log( 'Write RawTx File' );
    await writeRawTx( output_dir , rawTxList);

}


async function genRawtx ( _nonce , privateKey , _iter ) {

    var rawTxList = [];
    var num = 0 ;
    for ( var i = 0 ; i < _iter ; i++ ){
        let txParams = {
            nonce: _nonce ,//+ addValue,
            to: des_address,
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

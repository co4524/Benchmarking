# Flow
1.create N node configure & start M tendermint node
```sh
$ ./command.sh active N M
```
2.start testing(repeat n time)
```sh
$ ./command.sh benchmark N 
```
# Struture

## configAutoGen
 - configGen.sh [$nodeNum] : generate configure file for N nodes
 - template.toml : template configure file , All nodes have the same settings

## data
 - checkSum.py [$total_txs] : checking sum of blockTxNum.txt is equal to $total_txs

## nodeScript
 - abciServer.sh :start abci server
 - dataReset.sh : reset data(blockTxNum , blockCommitTime)
 - kill.sh : kill tendermint&abci process 
 - start.sh : start tendermint node
 - scp.sh : transfer data(blockTxNum , blockCommitTime) from node0 to workloader

## src
  - index.js : define rpc features

## src/test
 - workloader.js [$total_txs]: send txs tool
 - genRaw.js [$total_txs]: generate txs
 - cal.py [$total_txs] : calculate performance
 - baeURL : node's private ip address

 ## script
  - command.sh : Some tools for testing
  - oneRoundTesting.sh [$tx_num] [$iter] [$nonce]: test sending [$tx_num] transactions repeat [$iter] time
  - variance.py : calculate variance & mean


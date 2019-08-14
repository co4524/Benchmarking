path=$HOME/TendermintOnEvm_benchmark/data
path_blockTxNum=$path/blockTxNum.txt
path_blockCommitTime=$path/blockCommitTime.txt
path_txRequestTime=$HOME//evm-lite-js/test/txRequestTime


#rm pro_BlockCommitTime.txt
#touch pro_BlockCommitTime.txt
rm $path_blockTxNum
rm $path_blockCommitTime
rm $path_txRequestTime
rm $path_txList
#################################
touch $path_blockTxNum
touch $path_blockCommitTime
touch $path_txRequestTime
touch $path_txList

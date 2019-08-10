path=$HOME/TendermintOnEvm_benchmark/data
path_blockTxNum=$path/blockTxNum.txt
path_blockCommitTime=$path/blockCommitTime.txt
path_txRequestTime=$path/txRequestTime.txt
path_rawData=$path/rawData
path_log=$path/log
path_repeatHash=$path/repeatHash
path_nonce=$path/nonceTooHigh
path_preCommitTime=$path/pre_BlockCommitTime.txt
path_tf=$path/tf
####################################################
path2=$HOME/TendermintOnEvm_benchmark/report
path_report=$path2/report
path_tps=$path2/tps.txt
path_txRate=$path2/txRate.txt
path_latency=$path2/latency.txt
path_fail=$path2/fail.txt
path_txList=$HOME/evm-lite-js/test/txList
####################################################
path_avg_tps=$path2/tps
path_avg_latency=$path2/latency
path_avg_txRate=$path2/txRate
path_avg_fail=$path2/fail
path_workload=$HOME/evm-lite-js/test/workload.js
path_genRaw=$HOME/evm-lite-js/test/genRaw.js
path_cal=$HOME/evm-lite-js/test/cal.py
path_checksum=$HOME/evm-lite-js/test/checkSum.js
path_checkbalance=$HOME/evm-lite-js/test/checkBalance.js

threadNum=1



ResetLogFile(){
	./reset.sh
}

Reset(){
	rm $path_tps
	rm $path_txRate
	rm $path_latency
	rm $path_fail
	touch $path_tps
	touch $path_txRate
	touch $path_latency
	touch $path_fail
}

WorkLoad(){
	node $path_workload $1 $2 $3
}

SCP_instance(){

	nohup gcloud compute --project "caideyi" ssh --zone "asia-east1-b" "$1" -- './TendermintOnEvm_benchmark/scp.sh' > nohup.out 2>&1 
	echo "Transfer done!!"

}

main(){

	echo "-------------------Start Testing-------------------"
	for ((j=0 ; j<$3 ; j++)){
		echo "---------------------------------------------------"
		echo "Testing interArrival Time : $1 totalTxNum : $2"
		ResetLogFile
		init=$(node $path_checkbalance)
		node $path_genRaw $2
		sleep 1
		echo "Sending transaction ......"
		for ((i=0 ; i< $threadNum ; i++)) {
			WorkLoad $1 $2 $i 
		}

		node $path_checksum $2 $init
	    echo "Transfer data....."	
		SCP_instance node0
		echo "CalPerformance....."
		python $path_cal
		sleep 2

	}
}

Reset
main $1 $2 $3  ##[1] sleep time : ms  [2] tx_num  [3]: iter [4]: instance name
echo "Evaluate Variance&Mean..."
python variance.py

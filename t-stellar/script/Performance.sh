export TZ=UTC-8

path2=$HOME/report
path_report=$path2/report
path_tps=$path2/tps.txt
path_txRate=$path2/txRate.txt
path_latency=$path2/latency.txt
path_fail=$path2/fail.txt
path_time=$path2/time
####################################################
path_avg_tps=$path2/tps
path_avg_latency=$path2/latency
path_avg_txRate=$path2/txRate
path_avg_fail=$path2/fail

path_workload=$HOME/Benchmarking/t-stellar/stellar/workload.js
path_cal=$HOME/Benchmarking/t-stellar/stellar/cal.py

path_CommitTime=$HOME/data/blockCommitTime.txt
path_txRequestTime=$HOME/data/txRequestTime
path_blockTxNum=$HOME/data/blockTxNum.txt

ResetData(){
	rm $path_CommitTime
	rm $path_txRequestTime
	rm $path_blockTxNum
	touch $path_blockTxNum
	touch $path_txRequestTime
	touch $path_CommitTime
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
	node $path_workload $1 $2
}



main(){

	echo "-------------------Start Testing-------------------"
	for ((j=0 ; j<$2 ; j++)){
		ResetData
		echo "---------------------------------------------------"
		echo "Testing totalTxNum : $1"
		WorkLoad $1
		echo "CalPerformance....."
		python $path_cal $1
		sleep 1

	}
}

Reset
a=$(date)
echo $path_time
echo "total : $1  , time : $a" >> $path_time
main $1 $2   #[1] tx_num  [2]: iter 
echo "Evaluate Variance&Mean..."
python3 variance.py

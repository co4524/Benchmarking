path2=$HOME/report

path_report=$path2/report
path_avg_tps=$path2/tps
path_avg_latency=$path2/latency
path_avg_txRate=$path2/txRate
path_avg_fail=$path2/fail
path_time=$path2/time

path_var_tps=$path2/vTps
path_var_latency=$path2/vLatency
path_var_txRate=$path2/vTxRate
path_var_fail=$path2/vFail

################################

txTotalSend=(
100
200
400
800
1200
2000
3000
4000
5000
6000
8000
10000
12000
14000
16000
18000
20000
#22000
#24000
#26000
#28000
#30000
)

ResetReport(){
	rm $path_avg_tps
	rm $path_avg_latency
	rm $path_avg_txRate
	rm $path_report
	rm $path_var_tps
	rm $path_var_latency
	rm $path_var_txRate
	rm $path_avg_fail
	rm $path_var_fail
	rm $path_time
	touch $path_avg_tps
	touch $path_avg_latency
	touch $path_avg_txRate
	touch $path_report
	touch $path_var_tps
	touch $path_var_latency
	touch $path_var_txRate
	touch $path_avg_fail
	touch $path_var_fail
	touch $path_time
}

Benchmark() {

	for i in "${txTotalSend[@]}"
	do
		./Performance.sh $i $1 
	done

}

ResetReport
Benchmark 5
#[1]:iter

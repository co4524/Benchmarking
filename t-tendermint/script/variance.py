import numpy as np

path_tps="/home/caideyi/Benchmarking/t-tendermint/report/tps.txt"
path_txRate="/home/caideyi/Benchmarking/t-tendermint/report/txRate.txt"
path_latency="/home/caideyi/Benchmarking/t-tendermint/report/latency.txt"
path_fail="/home/caideyi/Benchmarking/t-tendermint/report/fail.txt"

path_avg_tps="/home/caideyi/Benchmarking/t-tendermint/report/tps"
path_avg_latency="/home/caideyi/Benchmarking/t-tendermint/report/latency"
path_avg_txRate="/home/caideyi/Benchmarking/t-tendermint/report/txRate"
path_avg_fail="/home/caideyi/Benchmarking/t-tendermint/report/fail"

path_var_tps="/home/caideyi/Benchmarking/t-tendermint/report/vTps"
path_var_latency="/home/caideyi/Benchmarking/t-tendermint/report/vLatency"
path_var_txRate="/home/caideyi/Benchmarking/t-tendermint/report/vTxRate"
path_var_fail="/home/caideyi/Benchmarking/t-tendermint/report/vFail"

fp_tps = open(path_tps, "r")
fp_txRate = open(path_txRate, "r")
fp_latency = open(path_latency, "r")
fp_fail = open(path_fail, "r")

tps = fp_tps.readlines()
txRate = fp_txRate.readlines()
latency = fp_latency.readlines()
fail = fp_fail.readlines()

fp_tps.close()
fp_txRate.close()
fp_latency.close()
fp_fail.close()

def StringToFloat(array):
    arr = []
    for i in range(len(array)):
        arr.append(float(array[i]))
    return arr

def calMean(array , dir):
    f = open( dir , "a")
    arr = StringToFloat(array)
    value = np.mean(arr)
    f.write( str(value) + "\n")
    f.close()

def calVar(array , dir):
    f = open( dir , "a")
    arr = StringToFloat(array)
    value = np.var(arr)
    f.write( str(value) + "\n")
    f.close()


calMean(tps , path_avg_tps)
calVar(tps , path_var_tps)

calMean(latency , path_avg_latency)
calVar(latency , path_var_latency)

calMean(txRate , path_avg_txRate)
calVar(txRate , path_var_txRate)

calMean(fail , path_avg_fail)
calVar(fail , path_var_fail)

import numpy as np
import sys

PATH_TPS="/home/caideyi/Benchmarking/t-tendermint/data/tps"
PATH_TX_RATE="/home/caideyi/Benchmarking/t-tendermint/data/txRate"
PATH_LATENCY="/home/caideyi/Benchmarking/t-tendermint/data/latency"
PATH_FAIL="/home/caideyi/Benchmarking/t-tendermint/data/fail"

PATH_AVG_TPS="/home/caideyi/Benchmarking/t-tendermint/report/tps"
PATH_AVG_LATENCY="/home/caideyi/Benchmarking/t-tendermint/report/latency"
PATH_AVG_TX_RATE="/home/caideyi/Benchmarking/t-tendermint/report/txRate"
PATH_AVG_FAIL="/home/caideyi/Benchmarking/t-tendermint/report/fail"

PATH_VAR_TPS="/home/caideyi/Benchmarking/t-tendermint/report/vTps"
PATH_VAR_LATENCY="/home/caideyi/Benchmarking/t-tendermint/report/vLatency"
PATH_VAR_TX_RATE="/home/caideyi/Benchmarking/t-tendermint/report/vTxRate"
PATH_VAR_FAIL="/home/caideyi/Benchmarking/t-tendermint/report/vFail"

OVER_WRITE = False

# start testing , over write report data : tps , latency , fail , txRate
def writeFileOption():
    if ( int(sys.argv[1]) ==1 ):
        global OVER_WRITE
        OVER_WRITE = True

# read file
def readFile( _file_path ):
    fp = open(_file_path, "r")
    obj = fp.readlines()
    fp.close()
    return obj

# change array type from string to float
def StringToFloat(_array):
    arr = []
    for i in range(len(_array)):
        arr.append(float(_array[i]))
    return arr

# calculate average
def calMean(_array , _dir):
    if (OVER_WRITE==True):
        f = open( _dir , "w")
    else:
        f = open( _dir , "a")
    arr = StringToFloat(_array)
    value = np.mean(arr)
    f.write( str(value) + "\n")
    f.close()

# calculate variance
def calVar(_array , _dir):
    if (OVER_WRITE==True):
        f = open( _dir , "w")
    else:
        f = open( _dir , "a")
    arr = StringToFloat(_array)
    value = np.var(arr)
    f.write( str(value) + "\n")
    f.close()


def outputValue( _read_path , _avg_out_path , _var_out_path):
    value=readFile(_read_path)
    calMean(value , _avg_out_path)
    calVar(value , _var_out_path)


def main():
    writeFileOption()
    outputValue( PATH_TPS , PATH_AVG_TPS , PATH_VAR_TPS)
    outputValue( PATH_TX_RATE , PATH_AVG_LATENCY , PATH_VAR_LATENCY)
    outputValue( PATH_LATENCY , PATH_AVG_TX_RATE , PATH_VAR_TX_RATE)
    outputValue( PATH_FAIL , PATH_AVG_FAIL , PATH_VAR_FAIL)

main()

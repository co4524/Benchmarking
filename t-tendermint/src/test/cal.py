import sys
OVER_WRITE = False

PATH_BLOCK_COMMIT_TIME = '/home/caideyi/Benchmarking/t-tendermint/data/blockCommitTime.txt'
PATH_TX_REQUEST_TIME = '/home/caideyi/Benchmarking/t-tendermint/data/txRequestTime'
PATH_BLOCK_TX_NUM = '/home/caideyi/Benchmarking/t-tendermint/data/blockTxNum.txt'

PATH_REPORT = '/home/caideyi/Benchmarking/t-tendermint/report/report'
PATH_TPS = '/home/caideyi/Benchmarking/t-tendermint/data/tps'
PATH_LATENCY = '/home/caideyi/Benchmarking/t-tendermint/data/latency'
PATH_TX_RATE = '/home/caideyi/Benchmarking/t-tendermint/data/txRate'
PATH_FAIL = '/home/caideyi/Benchmarking/t-tendermint/data/fail'

TOTAL_SEND = int( sys.argv[1] )

# read file
def readFile( _file_path ):
    fp = open(_file_path, "r")
    obj = fp.readlines()
    fp.close()

    return obj

# new round start , overwrite data (tps , latency , fail , txRate)
def writeFileOption():
    if ( int(sys.argv[2]) ==0 ):
        global OVER_WRITE
        OVER_WRITE = True

# debug , when submit lots of txs , there may be some "undefined" value in txReqestTime file
def deBug(_txRequestTime):
    for i in range(len(_txRequestTime)):
        if(_txRequestTime[i]=='undefined\n'):
            _txRequestTime[i]=_txRequestTime[i-1]

    return _txRequestTime

# static fail transaction
def detetFail( _block_tx_num ):
    suc = 0 
    for i in range(len(_block_tx_num)):
        suc += int(_block_tx_num[i])
    fail = TOTAL_SEND - suc
    print("BlockInfo : " , _block_tx_num)
    print("total send : " , TOTAL_SEND)
    print("commit tx : " , suc)

    return float(fail)/float(TOTAL_SEND) 

# calulate transaction rate : "total_send/(reqest_start_time - reqest_end_time)"
def calculateTxRate( _tx_request_time ):
    start = _tx_request_time[0]
    end = _tx_request_time[len(_tx_request_time)-1]
    dur = (float(end) - float(start)) / 1000
    tx_rate = float(len(_tx_request_time)) / float(dur)
    print("TransactionRate : " , tx_rate)

    return tx_rate

# calculate tps : "success txs/(reqest_start_time - last block commit time)"
def calculateTps (_tx_request_time , _block_commit_time , _block_tx_num ):
    start_time=_tx_request_time[0]
    end_time=_block_commit_time[len(_block_commit_time)-1]
    dur_time=(float(end_time)-float(start_time))/ 1000
    total = 0 
     
    for i in range(0,len(_block_tx_num)):
        total += int(_block_tx_num[i])

    print("TPS : " , total/dur_time)

    return (total/dur_time)

# calculate latency : sigma[block_commit_time - request_time] / success_txs
def calculateLatency( _tx_request_time ,_block_commit_time , _block_tx_num):
    total = 0 
    total_latency= 0
    start=0

    for i in range(0,len(_block_tx_num)):
        total += int(_block_tx_num[i])
        
    for i in range(0,len(_block_tx_num)):
        for j in range(int(_block_tx_num[i])):
            total_latency += (float(_block_commit_time[i])-float(_tx_request_time[start])) / 1000
            start+=1

    avg_latency = float(total_latency) / float(total)
    print("Latency : " , avg_latency)
    return avg_latency

# write Report 
def writeReport(_tx_rate , _tps , _fail_tx , _latency , _block_tx_num):
    f = open(PATH_REPORT, "a")
    f.write("-----------Report---------------\n")
    f.write("TotalSend: " +str(TOTAL_SEND)+ "\n")
    f.write("BlockInfo: " +str(_block_tx_num)+ "\n")
    f.write("TxRate: " +str(_tx_rate)+ "\n")
    f.write("Tps: " +str(_tps)+ "\n")
    f.write("FailRate: " + str(_fail_tx) + "\n" )
    f.write("Latency: " +str(_latency)+ "\n")

# write Report 
def writeFile( _path , _value ):
    if (OVER_WRITE==True):
        f = open(_path, "w")
    else :
        f = open(_path, "a")
    f.write(str(_value)+ "\n")
    f.close()


def main():

    #Read file : request_time , block_tx_num , block_commit_time
    tx_request_time=readFile(PATH_TX_REQUEST_TIME)
    block_tx_num=readFile(PATH_BLOCK_TX_NUM)
    block_commit_time=readFile(PATH_BLOCK_COMMIT_TIME)

    #Calculate performance metric
    tx_request_time=deBug(tx_request_time)
    sorted_tx_request_time = sorted (tx_request_time )
    fail = detetFail( block_tx_num )
    tx_rate = calculateTxRate( sorted_tx_request_time )
    tps = calculateTps( sorted_tx_request_time , block_commit_time , block_tx_num )
    latency = calculateLatency( sorted_tx_request_time , block_commit_time , block_tx_num )

    #write Report
    writeFileOption()
    writeReport( tx_rate , tps , fail , latency , block_tx_num)
    writeFile( PATH_TX_RATE , tx_rate)
    writeFile( PATH_TPS , tps)
    writeFile( PATH_LATENCY , latency)
    writeFile( PATH_FAIL , fail)


main()

path_CommitTime = '/home/caideyi/Benchmarking/t-tendermint/data/blockCommitTime.txt'
path_txRequestTime = '/home/caideyi/Benchmarking/t-tendermint/data/txRequestTime'
path_blockTxNum = '/home/caideyi/Benchmarking/t-tendermint/data/blockTxNum.txt'


path_report = '/home/caideyi/Benchmarking/t-tendermint/report/report'
path_tps = '/home/caideyi/Benchmarking/t-tendermint/report/tps.txt'
path_latency = '/home/caideyi/Benchmarking/t-tendermint/report/latency.txt'
path_txRate = '/home/caideyi/Benchmarking/t-tendermint/report/txRate.txt'
path_fail = '/home/caideyi/Benchmarking/t-tendermint/report/fail.txt'


fp_blockTxNum = open(path_blockTxNum, "r")
fp_txRequestTime = open(path_txRequestTime, "r")
fp_preCommitTime = open(path_CommitTime, "r")


blockTxNum = fp_blockTxNum.readlines()
txRequestTime = fp_txRequestTime.readlines()
commitTime = fp_preCommitTime.readlines()


fp_blockTxNum.close()
fp_txRequestTime.close()
fp_preCommitTime.close()


def Debug():
    for i in range(len(txRequestTime)):
        if(txRequestTime[i]=='undefined\n'):
            txRequestTime[i]=txRequestTime[i-1]
Debug()
print (blockTxNum)
s_txRequestTime = sorted (txRequestTime )


def detetFail():
    suc = 0 
    for i in range(len(blockTxNum)):
        suc += int(blockTxNum[i])
    fail = total_send - suc
    print("total send" , total_send)
    print("commit tx" , suc)
    return float(fail)/float(total_send) 

def txRate():
    start = s_txRequestTime[0]
    end = s_txRequestTime[len(s_txRequestTime)-1]
    print("start",start)
    print("end",end)
    dur = (float(end) - float(start)) / 1000
    txRate = float(len(s_txRequestTime)) / float(dur)
    return txRate

def tps():
    start=0
    start_time=s_txRequestTime[int(start)]
    end_time=commitTime[len(commitTime)-1]
    dur_time=(float(end_time)-float(start_time))/ 1000
    total = 0 
     
    for i in range(0,len(blockTxNum)):
        total += int(blockTxNum[i])

    return (total/dur_time)


def latency():
    total = 0 
    total_latency= 0
    start=0

    for i in range(0,len(blockTxNum)):
        total += int(blockTxNum[i])
        
    for i in range(0,len(blockTxNum)):
        for j in range(int(blockTxNum[i])):
            la = (float(commitTime[i])-float(txRequestTime[start])) / 1000
            total_latency += la
            start+=1

    avg_latency = float(total_latency) / float(total)
    return avg_latency

def cal():

    f = open(path_report, "a")
    ftps = open(path_tps, "a")
    flatency = open(path_latency, "a")
    ftxRate = open(path_txRate, "a")
    ffail = open(path_fail, "a")
    _failTx = detetFail()
    _txRate = txRate()
    _tps = tps()
    f.write("-----------Report---------------\n")
    f.write("txRate: " +str(_txRate)+ "\n")
    f.write("tps: " +str(_tps)+ "\n")
    f.write("failRate: " + str(_failTx) + "\n" )
    ftps.write(str(_tps)+ "\n")
    ftxRate.write(str(_txRate)+ "\n")
    ffail.write(str(_failTx) + "\n")
    print( "txRate: " , _txRate)
    print( "tps" , _tps)
    print( "failRate" , _failTx)

    _latency = latency()
    f.write("latency: " +str(_latency)+ "\n")
    flatency.write(str(_latency)+ "\n")
    print( "Latency" , _latency)

    f.close()
    ftps.close()
    ftxRate.close()
    ffail.close()
    flatency.close()

cal()
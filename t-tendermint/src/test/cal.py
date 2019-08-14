path_CommitTime = '/home/caideyi/TendermintOnEvm_benchmark/data/blockCommitTime.txt'
path_txRequestTime = '/home/caideyi/evm-lite-js/test/txRequestTime'
path_blockTxNum = '/home/caideyi/TendermintOnEvm_benchmark/data/blockTxNum.txt'
path_report = '/home/caideyi/TendermintOnEvm_benchmark/report/report'
path_tps = '/home/caideyi/TendermintOnEvm_benchmark/report/tps.txt'
path_latency = '/home/caideyi/TendermintOnEvm_benchmark/report/latency.txt'
path_txRate = '/home/caideyi/TendermintOnEvm_benchmark/report/txRate.txt'
path_fail = '/home/caideyi/TendermintOnEvm_benchmark/report/fail.txt'
path_nonce = '/home/caideyi/evm-lite-js/test/Nonce'
path_nonce2 = '/home/caideyi/evm-lite-js/test/Nonce2'
path_txList = '/home/caideyi/evm-lite-js/test/txList'

fp_blockTxNum = open(path_blockTxNum, "r")
fp_txRequestTime = open(path_txRequestTime, "r")
fp_preCommitTime = open(path_CommitTime, "r")
#fp_nonce = open(path_nonce , "r")
#fp_nonce2 = open(path_nonce2 , "r")

blockTxNum = fp_blockTxNum.readlines()
txRequestTime = fp_txRequestTime.readlines()
commitTime = fp_preCommitTime.readlines()
#nonce = fp_nonce.readlines()
#nonce2 = fp_nonce2.readlines()

fp_blockTxNum.close()
fp_txRequestTime.close()
fp_preCommitTime.close()
#fp_nonce.close()
#fp_nonce2.close()

def Debug():
    for i in range(len(txRequestTime)):
        if(txRequestTime[i]=='undefined\n'):
            txRequestTime[i]=txRequestTime[i-1]
Debug()
print (blockTxNum)
s_txRequestTime = sorted (txRequestTime )

def detet():
	fList = open(path_txList , "a")
	num = 0;
	suc = 0;
	index = 0 ;
	latency = 0;
	total_latency = 0;
	total_success = 0;
	
	for i in range(len(nonce)):
		if(int(nonce[i])==int(nonce2[i])):
			num+=1
			fList.write( "F" + "\n")
		elif(int(nonce[i])!=int(nonce2[i])):
			suc+=1
			total_success+=1
			fList.write( "T" + "\n")
			latency = float(commitTime[index]) - float(txRequestTime[i])
			total_latency += latency
		if(suc==int(blockTxNum[index]) and index < len(blockTxNum)-1 ):
			fList.write( "----" + "\n")
			#print(index , suc)
			suc = 0
			index+=1
	print("AVG_LATENCY: ", (total_latency/(total_success*1000)) )
	print("FAIL: ",num)
		
#detet()

def detetFail():
    suc = 0 
    total_send = len(s_txRequestTime)
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
            la = (float(commitTime[i])-float(s_txRequestTime[start])) / 1000
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

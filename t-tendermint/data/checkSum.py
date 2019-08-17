import time
import sys
total_send = int(sys.argv[1] )

path_blockTxNum = 'blockTxNum.txt'
trigger=True
while(trigger):
    fp_blockTxNum = open(path_blockTxNum, "r")
    blockTxNum = fp_blockTxNum.readlines()
    suc = 0
    for i in range(len(blockTxNum)):
        suc+=int(blockTxNum[i])
    print("Waiting for transaction complete..." , "  Expect" , total_send , "  CommitTx : ",suc)
    if (suc == total_send):
        trigger = False
        break
    time.sleep( 5 )
    
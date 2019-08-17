#rm -r ~/.tendermint
#tendermint init
#!/bin/bash
export GOROOT=/usr/local/go
export GOPATH=$HOME/go
export PATH=$GOPATH/bin:$GOROOT/bin:$PATH
#tendermint node 
nohup tendermint node > /dev/null 2> /dev/null < /dev/null &
cd /home/caideyi/Benchmarking/t-tendermint/nodeScript
nohup ./abciServer.sh > /dev/null 2> /dev/null < /dev/null &

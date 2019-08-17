#!/bin/bash
tendermint_pid=$(ps aux | grep "tendermint" | grep -v "grep" | awk '{ print $2 }')
abci_pid=$(ps aux | grep "SimpleABCI" | grep -v "grep" | awk '{ print $2 }')

#echo "Kill tendermint"
#sudo kill -9 $tendermint_pid

sudo kill -9 $abci_pid

sudo kill -9 $tendermint_pid

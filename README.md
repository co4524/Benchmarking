# Benchmarking

Benchmarking for different consensus

## Tendermint with simplest abci

There are three ways to implemnet ABCI
* In-process
* ABCI-socket
* GRPC

t-tendermint/abci.py implements the **ABCI-socket** method by listening to \[port\]\(26658 by default\) by running
```
python SimpleABCI.py [port]
```

## Filenaming Convensions

To make input for configuration and output experimental result be discernible by gitignore, please follow these naming conventions.

1. All the output txt results ends with .out instead of .txt: result.out
2. All the input txt templates still ends with .txt: template.txt

# HackMD
https://hackmd.io/SbNY5nNjQPe2CC7IC_sUMw?view


if [ "$#" -lt 1 ]; then
    echo "Illegal number of parameters"
fi

help(){
    echo "-----Usage-----"
    echo "./command ACTION"
    echo "-----ACTION-----"
    echo "[active] [number of nodes configure you want to build] [number of nodes you want to active]"
    echo "[kill] [n : kill process from node0 to node{n} ]"
    echo "[test] [number of transactions you want to submit] [nonce value]"
    echo "[benchmark] : start testing"
}

rainBow(){
    while :
    do
        echo -ne "\r"
        sleep 0.2
        while [ $LENGTH != 7 ] ;
        do
                sleep 0.05
                if [ $LENGTH -eq 0 ]; then
                    echo -en "\x1b[37mr"
                fi
                if [ $LENGTH -eq 1 ]; then
                    echo -en "\x1b[31ma"
                fi
                if [ $LENGTH -eq 2 ]; then
                    echo -en "\x1b[32mi"
                fi
                if [ $LENGTH -eq 3 ]; then
                    echo -en "\x1b[33mn"
                fi
                if [ $LENGTH -eq 4 ]; then
                    echo -en "\x1b[34mb"
                fi
                if [ $LENGTH -eq 5 ]; then
                    echo -en "\x1b[35mo"
                fi
                if [ $LENGTH -eq 6 ]; then
                    echo -en "\x1b[36mw"
                fi
                (( LENGTH++ ))
        done
        LENGTH=0
        echo -en "\x1b[0m"
        sleep 0.2
        echo -en "\r        "
    done
}

active(){
    if [ -z "$1" -o -z "$2" ]; then
        help
    fi
}

ext=$1
case "$1" in
    active) active $2 $3
        ;;
    kill) echo "$ext : kill."
        ;;
    benchmark) echo "$ext : benchmark."
        ;;
    *) help
esac
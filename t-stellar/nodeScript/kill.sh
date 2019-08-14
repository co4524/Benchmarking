stellar_pid=$(ps aux | grep "stellar" | grep -v "grep" | awk '{ print $2 }')
hor_pid=$(ps aux | grep "horizon" | grep -v "grep" | awk '{ print $2 }')

# stellar_pid="bla@some.com;john@home.com"
PIDs=$(echo $stellar_pid | tr " " "\n")

echo "Kill horizon"
sudo kill -9 $hor_pid

for pid in $PIDs
do
    echo "Kill stellar-core"
    sudo kill -9 $pid
done


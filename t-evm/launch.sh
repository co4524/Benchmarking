launch(){
gcloud compute --project "caideyi" disks create "node$1" --size "100" --zone "asia-east1-b" --source-snapshot "node" --type "pd-standard"

gcloud compute --project=caideyi instances create node$1 --zone=asia-east1-b --machine-type=n1-highcpu-8 --subnet=default --private-network-ip=10.140.1.$1 --network-tier=PREMIUM --maintenance-policy=MIGRATE --service-account=1047714368688-compute@developer.gserviceaccount.com --scopes=https://www.googleapis.com/auth/devstorage.read_only,https://www.googleapis.com/auth/logging.write,https://www.googleapis.com/auth/monitoring.write,https://www.googleapis.com/auth/servicecontrol,https://www.googleapis.com/auth/service.management.readonly,https://www.googleapis.com/auth/trace.append --tags=http-server,https-server --disk=name=node$1,device-name=node$1,mode=rw,boot=yes,auto-delete=yes
}

for ((i=$1 ; i< $2 ; i++)){
	echo "launching node$i..."
	launch $i &
}

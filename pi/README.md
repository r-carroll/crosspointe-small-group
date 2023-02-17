## Raspi code and tools
This folder contains the database and node app that are meant to run locally on a raspberry pi. 

### Helpful linux commands and tools
Commands and tools to help with getting the system up and running

#### List and mount storage volume
* See existing mounts: `findmnt`
* List all storage devices: `lsblk`
* Create folder to mount to: `sudo mkdir /media/usbdrive`
* Create the mount: `sudo mount /dev/sda1 /media/usbdrive`
* To unmount: `sudo umount /media/usbdrive`

### Services
The node app runs on the system via `systemctl`. 
* Copy the service file into `/etc/systemd/system`
* Start it with `systemctl start smallgroup-api`
> Swap out `start` for `enable` so it starts on boot.
* View logs `journalctl -u smallgroup-api -n 100 --no-pager -f`
* Enable it to run on boot with `systemctl enable smallgrou-api`
* List services with `systemctl list-units --type=service`
* View all ports that are in use `sudo netstat -tulpn | grep LISTEN`
* View process details by ID `ps -p 1337 -o command`

### Environment 
This application depends on certain environment variables being in place on the system for postgres to function properly. These environment variables are as follows:

```
PGPASSWORD=fillinpassword
PGUSER=fillinuser
PGHOST=127.0.0.1
PGDATABASE=smallgroupdb
PGPORT=5432
```

Be sure to place these variables in the `/etc/environment` file
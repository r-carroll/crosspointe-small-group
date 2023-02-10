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
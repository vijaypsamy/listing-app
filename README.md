# Pre-requisites

1. An AWS account with valid VPC and Subnet.
2. aws cli configured in local machine with credentials to access the AWS account.


## Overview of repository contents

1. **cft/cft.json** - Cloudformation template to create 1 EC2 instance and 1 Security group. EC2 instance bootstraps with some software like ansible, docker and git. 

2. **ansible-playbooks** - 

	**main.yaml** - Contains ansible playbooks for installing pre-requisites, initial build/deploy docker images and to start application.

	**builddeploy.yaml** - Basic build and deploy demonstration for the 2 services.

3. **gateway** - NodeJS code for the front end service.

4. **accomodation-listing-service** - NodeJS code for backend service which reads from NATS and writes to a MongoDB instance.

## Setup Application

There are 2 ways to setup the application - 

1. Setup both infrastructure and application  
	
2. Setup application only in an existing Linux server


#### Setup both infrastructure and application

1. Create an EC2 keypair - ec2key and store the key in a pem file.
(You will need this to log into the EC2 instance)

   ```bash
    aws ec2 create-key-pair --key-name ec2key
   ```
	
2. Execute a Cloudformation template

```bash
      aws cloudformation create-stack --template-body file:\\<path-to-cft.json> --stack-name <stack-name>
```
	
    Example - When in repo's cft directory, in Windows -

```bash
      aws cloudformation create-stack --template-body file:\\cft.json --stack-name listing-app-stack01
```

3. Wait for 6-7 minutes after the EC2 instance's 2/2 checked have passed so that the bootstrap script completes.
	Alternatively, in the EC2 instance you can tail this file to check progress of the bootstrap script - 
	
```bash
	cat /var/log/cloud-init-output.log
```
	
4. Check if 4 containers are running - 

   gateway, accomodation-listing-service, nats-server and mongodb
  
```bash
        docker ps
```
	
Thats it! Scroll below on how to access application.

#### Setup application only in an existing Linux server

If you already have a Linux server to setup application in, follow below steps.

 **Pre-requisites** - The server should have following installed - curl, git (version 2.18.2), ansible (version 2.9.2), docker (version 19.03.5), docker-compose

1. Copy/Clone repo to a directory

2. Switch to repo's "ansible-playbooks" directory and run - 

```bash
	ansible-playbook main.yaml --tags "deploy-all-svc" --verbose
```

   Done! Scroll below on how to access application

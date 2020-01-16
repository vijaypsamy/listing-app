Welcome to the demo accomodation listing app!

**IMPORTANT - Please read notes bottom of page before starting!**

Lets start off with the pre-requisites needed setup the application. And then see how to set it up.

## Pre-requisites

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

#### Access the application - 

**Swagger UI**

   HTTP Method: *GET*, URL: *http://<EC2PublicIP>/api-docs*
   
   Get all accomodation listings (empty response until you create a listing) - 

   HTTP Method: *GET*, URL: *http://<EC2PublicIP>/accomodations*
   
   **Create an accomodation listing**

   HTTP Method: *POST*, URL: *http://<EC2PublicIP>/accomodations*

   Sample request body: *application/json*
   
   ```bash
     {
    "name": "Vijay Anand",
    "rating": 5,
    "category": "guesthouse",
    "location": {
      "city": "Chennai",
      "state": "Tamil Nadu",
      "country": "India",
      "zip_code": "600020",
      "address": "Old no. 6/1, Venkateswara Nagar, Adyar, Chennai"
       },
    "image": "https://google.com"
    }
   ```

### NOTES

1. The Cloudformation template contains the PRIVATE KEY of my private Github repo's deploy keypair. Only provided to automate setup from scratch for demo purpose to provide an automated flow. I am aware that anyone with the key can access my private repo on Github.com
2. Security group opens few ports to outside world! i.e., CIDR - 0.0.0.0/0. Please edit this template to restrict to a subnet/IP if you wish to.

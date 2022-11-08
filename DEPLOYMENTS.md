# Deployment Guide

This guide shows the different options used to provision cloud resources.

## Frontend

For frontend, log into Vercel using Github account.
Give access to Ai-vs-Ai repo. Then select that repo.
Select ./frontend as the root of the project and select Create React App as the template.

## Backend

Signed up for 100 dollars of Azure credit via student deal.

Created three resource groups:

- Backend
- Simulation
- DevOps

Created a Container Registry:

- within DevOps resource group
- named AVAContainers...
- on the Basic tier

Created a Virtual Network:

- within Backend resource group
- named avanet
- uses 10.0.0.0/16 address range (65k addresses)
- has default subnet of (10.0.0.0/24)

Created Azure Database for MySQL:

- within Backend resource group
- named avadatabase
- with MySQL v5.7
- with workload type "For development or hobby projects"
- with compute size of Standard_B1ms (1 vCore, 2 GiB memory, 640 max iops)
- with 128 GB of storage
- with administrator account named "ava"
- with administrator password as _same one used at Ellucian_
- with connectivity method set to Private access
- with connection to avanet
- with default subnet
- after provisioning, created database called app

Created Backend Container App:

- within Backend resource group
- named avabackend
- in East US region
- with new environment named avaenvironment
  - with virtual network avanet
  - with new subnet 10.0.2.0/23 called containers
  - with external virtual ip
- without quickstart image
  - with container name avabackend-dev
  - with image source of Azure Container Registry
  - with registry avacontainers.azurecr.io
  - with image name avabackend
  - with image tag dev
  - with CPU and Memory of 0.25 CPU cores, 0.5 Gi memory
  - with applicable environment variables
  - with ingress traffic set as Accepting traffic from anywhere
  - with target port 443

Created RabbitMQ Container App:

- within Simulation resource group
- named avabroker
- in East US region
- without quickstart image
  - with container name avabroker
  - with image source of Docker Hub
  - with registry docker.io
  - with image name rabbitmq:3-management
  - with CPU and Memory of 0.25 CPU cores, 0.5 Gi memory
  - with environment variables of RABBITMQ_DEFAULT_USER and RABBITMQ_DEFAULT_PASS (ava and !ava_app!)

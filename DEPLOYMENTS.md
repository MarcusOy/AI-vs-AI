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
- uses 10.0.1.0/24 address range (251 addresses)
- only has 1 subnet (entire 10.0.1.0/24 space)

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

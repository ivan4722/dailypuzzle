#!/bin/bash

# Load necessary modules and set up the environment
module load gcc-11.2  # Add other module load commands as needed

# Navigate to your application directory
/usr/local/lib/node_modules/pm2/bin/pm2 reload all



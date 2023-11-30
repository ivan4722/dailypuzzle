#!/bin/bash

# Load necessary modules and set up the environment
module load gcc-11.2  # Add other module load commands as needed

# Navigate to your application directory
cd /path/to/your/application

# Start your application using pm2
pm2 start your_app_start_command --name YourAppName

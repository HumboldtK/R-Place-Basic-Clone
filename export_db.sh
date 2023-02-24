

# Create a cron job to automatically create snapshots of the current state of the database 
#I use every 3 hours, but you can set the command to run at your own prefered interval
#command to use is "/websitename/public_html/export_db.sh" -- make sure the path is correct to your setup . 
#Make sure the path is correct. If possible, put the export file in the website home directory before the public_html folder .

#!/bin/bash

# Set database credentials
DB_HOST="localhost"
DB_USER=""
DB_PASSWORD=""
DB_NAME=""

# Set the path to the folder where you want to save the backups
BACKUP_DIR=" /websitename/public_html/snapshots"

# Get the current date and time in the format YYYY-MM-DD_HH:MM:SS
CURRENT_DATE=$(date +"%Y-%m-%d_%H:%M:%S")

# Use the mysqldump command to export the whole database table
mysqldump --host=$DB_HOST --user=$DB_USER --password=$DB_PASSWORD $DB_NAME > $BACKUP_DIR/$DB_NAME_$CURRENT_DATE.sql

# If the mysqldump command was successful, print a message to the console
if [ "$?" -eq 0 ]; then
  echo "Database backup successful at $CURRENT_DATE"
else
  echo "Error: Database backup failed"
fi



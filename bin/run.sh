#!/bin/sh
# launch web server
cd `dirname $0`/../web && node app.js&
# launch ROS
roslaunch turtlebot_web gmapping_explore.launch

#!/bin/bash
# launch web server
cd ../web &&node ../web/app.js&
# launch ROS
roslaunch turtlebot_web turtlebot_web.launch

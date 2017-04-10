# Install

## Installing ros turtlebot dependance
	sudo apt-get install ros-kinetic-turtlebot ros-kinetic-turtlebot-apps ros-kinetic-turtlebot-interactions ros-kinetic-turtlebot-simulator ros-kinetic-kobuki-ftdi ros-kinetic-ar-track-alvar-msgs

## Installing ros dependance	
	sudo apt install ros-kinetic-rosbridge-server 

## Installing web-server dependance	
	sudo apt install nodejs-legacy

## Installing project
	cd <catkin_repo>/src
	wget https://github.com/CARMinesDouai/turtlebot_web/archive/master.zip
	unzip master.zip
	...

## Cleaning
	rm master.zip
	
# How to use

First:
	log into the robot's SSH server
	rosrun turtlebot_web run.sh

Then access to <robot ip>:8080

# Install

This install assumes that you have completed the previous tutorials: [TurtleBot Bringup](http://wiki.ros.org/turtlebot_bringup/Tutorials/indigo/TurtleBot%20Bringup), [PC Bringup](http://wiki.ros.org/turtlebot_bringup/Tutorials/indigo/PC%20Bringup). 

## Installing ros dependance	
	sudo apt install ros-kinetic-rosbridge-server 

## Installing web-server dependance	
	sudo apt install nodejs-legacy

## Installing project
	cd <catkin_repo>/src
	wget https://github.com/CARMinesDouai/turtlebot_web/archive/master.zip
	unzip master.zip
	cd ..
	catkin_make
	rm src/master.zip
	
# How to use
First : 

	ssh <robot ip>
	rosrun turtlebot_web run.sh

Then :

	access to http://<robot ip>:8080

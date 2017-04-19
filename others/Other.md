# tests

## web-video-server

### installation

sudo apt install ros-kinetic-web-video-server

### lancement

rosrun web_video_server web_video_server
=> http://localhost:8080/stream_viewer?topic=map

### usage
HTTP Streaming of ROS Image Topics in Multiple Formats

## wviz

plus maintenu

## ros2djs

### installation

sudo apt install ros-kinetic-rosbridge-server
(permet la création du web socket qui "parle" en json)
fichier html avec js

### lancement

roslaunch rosbridge_server rosbridge_websocket.launch
lancement du fichier html

### usage

affichage de la map

## nav2djs

### installation

sudo apt install ros-kinetic-rosbridge-server
(permet la création du web socket qui "parle" en json)
fichier html avec js

### lancement

roslaunch rosbridge_server rosbridge_websocket.launch
lancement du fichier html

### usage

affichage de la map, du robot et deplacement de celui-ci

# move_base topics
Subscribed Topics
move_base_simple/goal (geometry_msgs/PoseStamped)

    Provides a non-action interface to move_base for users that don't care about tracking the execution status of their goals.

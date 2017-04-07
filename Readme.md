



# Install

regarder ce que rosbridge_server peut envoyer

--------	web-video-server
sudo apt install ros-kinetic-web-video-server
rosrun web_video_server web_video_server
=> http://localhost:8080/stream_viewer?topic=map
HTTP Streaming of ROS Image Topics in Multiple Formats

--------	wviz
plus maintenu

--------	ros2djs
sudo apt install ros-kinetic-rosbridge-server
roslaunch rosbridge_server rosbridge_websocket.launch
(permet la création du web socket qui "parle" en json)
=> fichier html avec js
affichage de la map

--------	nav2djs
utilise aussi rosbridge-server
=> fichier html avec js
! theorique ! affichage de la map, du robot et deplacement de celui-ci

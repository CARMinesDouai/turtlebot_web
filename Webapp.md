# Turtlebot_web - **webapp**

this manual assumes that you have completed the previous install: [Readme.md](Readme.md)

## ROS depends 

### Base

* **rosbridge_websocket** - *websocket*
* **robot_pose_publisher** - *remote the robot pose*

### Vmap

* **map_to_vmap** - *vmap creator*

### Camera

* **freenect** - *kinect camera*
* **web_video_server** - *video steam*

## Topics used

| name                        |                   type                   |                         use |  editable                            | ref        |
| --------------------------- |:----------------------------------------:| --------------------------- |:------------------------------------:|------------|
| move_base                   |  move_base_msgs/MoveBaseAction           | Set a goal                  | a.serverName, a.actionName           | Map, Vmap  |
| move_base/NavfnROS/plan     |  nav_msgs/Path                           | View the planned path       | a.navServerName, a.navActionName     | Map, Vmap  |
| map_metadata                | nav_msgs/MapMetaData                     | Adjust map display          | -                                    | Map, Vmap  |
| robot_pose                  | geometry_msgs/Pose                       | View robot pose             | -                                    | Map, Vmap  |
| map                         | nav_msgs/OccupancyGrid                   | View the map                | -                                    | Map        |
| vmap                        | torob_msgs/VectorMap                     | View the Vmap               | a.vmapServerName                     | Vmap       |
| initialpose                 | geometry_msgs/PoseWithCovarianceStamped  | Set robot pose              | -                                    | Vmap       |
| laptop_charge               | sensor_msgs/BatteryState                 | Displays the laptop battery | a.laptopTopicName, a.laptopTopicType | Status     |
| mobile_base/sensors/core    | kobuki_msgs/SensorState                  | Displays the robot battery  | a.botTopicName, a.botTopicType       | Status     |


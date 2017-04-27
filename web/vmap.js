var Vmap = function (a) {
  var that  = this;
  this.ros  = a.ros;
  this.continuous = a.continuous || false;
  this.divID = a.divID || 'vmap';
  this.utils =  { rosQuaternionToGlobalTheta : function(orientation) {
                    var q0 = orientation.w;
                    var q1 = orientation.x;
                    var q2 = orientation.y;
                    var q3 = orientation.z;
                    return -Math.atan2(2 * (q0 * q3 + q1 * q2), 1 - 2 * (q2 * q2 + q3 * q3)) * 180.0 / Math.PI;},
                  globalToRos : function (x,y) {
                    var transform = 1.0/that.transMatrix[0];
                    return {x : (((x-that.transMatrix[4])*transform)-that.decaX)/that.scale,
                            y : -(((y-that.transMatrix[5])*transform)-that.decaY)/that.scale };
                    }
                  };
  this.eventsVar =  { position : null,
                      positionVec3 : null,
                      thetaRadians : 0,
                      thetaDegrees : 0,
                      orientationMarker : null,
                      mouseDown : false,
                      xDelta : 0,
                      yDelta : 0,
                      lastTimeStamp : 0};
  this.serverName = a.serverName || '/move_base';
  this.actionName = a.actionName || 'move_base_msgs/MoveBaseAction';
  this.actionClient = new ROSLIB.ActionClient({
    ros : that.ros,
    actionName : that.actionName,
    serverName : that.serverName
  });
  this.transMatrix = [1,0,0,1,0,0];
  this.init = function () {
    document.getElementById(that.divID).innerHTML =
    "<svg id='svg_vmap' transform='matrix(1 0 0 1 0 0)' height='0' width='0'></svg>";
    that.svg = document.getElementById('svg_vmap');
    that.initMeta();
    that.botPos = {x : that.decaX, y : that.decaY};
    var bot_pos = new ROSLIB.Topic({
      ros : that.ros,
      name : '/robot_pose',
      messageType : 'geometry_msgs/Pose'
    });
    bot_pos.subscribe(function(pos) {
      var botSVGPos = document.getElementById('bot');
      if (botSVGPos === null) {
        return;
      }
      that.botPos = {x : (that.decaX + (pos.position.x*that.scale)), y : (that.decaY - (pos.position.y*that.scale))};
      botSVGPos.setAttribute("cx",that.botPos.x);
      botSVGPos.setAttribute("cy",that.botPos.y);
    });
    var map = new ROSLIB.Topic({
      ros : that.ros,
      name : '/vmap',
      messageType : 'torob_msgs/VectorMap'
    });
    map.subscribe(function(message) {
      that.svg.innerHTML=that.toSVG(message);
      if (!that.continuous) {
        map.unsubscribe();
      }
    });
    that.svg.onmousedown = function (event) {
      if (event.buttons == 1) {
        that.mouseEventHandler(event,'down');
      }
    };
    that.svg.onmousemove = function(event) {
      if (event.buttons == 1) {
        that.mouseEventHandler(event,'move');
      }
    };
    that.svg.onmouseup = function(event) {
        that.mouseEventHandler(event,'up');
   };
  };
  this.initMeta = function () {
    var map_metadata = new ROSLIB.Topic({
      ros : that.ros,
      name : '/map_metadata',
      messageType : 'nav_msgs/MapMetaData'
    });
    map_metadata.subscribe(function(meta) {
      that.meta = meta;
      that.resolution = meta.resolution.toFixed(8);
      that.scale = 1/that.resolution;
      that.width = meta.width;
      that.height = meta.height;
      that.decaX = (that.width/2.0);
      that.decaY = (that.height/2.0);
      that.svg.setAttributeNS(null, "width", meta.width);
      that.svg.setAttributeNS(null, "height", meta.height);
      map_metadata.unsubscribe();
    });
  };
  this.toSVG =  function (matrix) {
    that.initMeta();
    var SVG = "";
    var edges = matrix.edges;
    var nodes = matrix.nodes;
    SVG += " <circle cx='"+that.decaX+"' cy='"+that.decaY+"' r='1' stroke='black' stroke-width='3' />";
    SVG += " <circle id='bot' cx='"+that.decaX+"' cy='"+that.decaY+"' r='1' stroke='blue' stroke-width='3' />";
    for (var i = 0; i < edges.length; i++) {
      SVG += that.edgeToSVG(   i,
        {
          src : nodes[edges[i].src],
          trg : nodes[edges[i].trg],
          type : edges[i].type,
          weight : edges[i].weight
        });
      }
      return SVG;
  };
  this.edgeToSVG = function(id, edge) {
    var color = "red";
    if (edge.src.type == 2) {
      color = "green";
    }
    var line = "<line ";

    if (id !== null) {
      line += "id='" + id + "' ";
    }
    line += "x1='"+(that.decaX + (edge.src.x*that.scale))+"' y1='"+(that.decaY - (edge.src.y*that.scale))+"' "
    +"x2='"+(that.decaX + (edge.trg.x*that.scale))+"' y2='"+(that.decaY -(edge.trg.y*that.scale))+"' "
    +"style='stroke:"+color+";stroke-width:2' />";
    return line;
  };
  this.sendGoal = function(pose) {
    // create a goal
    var goal = new ROSLIB.Goal({
      actionClient : that.actionClient,
      goalMessage : {
        target_pose : {
          header : {
            frame_id : '/map'
          },
          pose : pose
        }
      }
    });
    goal.send();
    var posTmp = {x : (that.decaX + (pose.position.x*that.scale)), y : (that.decaY -(pose.position.y*that.scale))};
    var rotation = 165 + that.utils.rosQuaternionToGlobalTheta(pose.orientation);
    var goalMarker = document.createElementNS('http://www.w3.org/2000/svg','polygon');
    goalMarker.setAttribute('points',posTmp.x+","+posTmp.y+
                      " "+(posTmp.x + 10)+","+posTmp.y+
                      " "+(posTmp.x + 8.76)+","+(posTmp.y + 4.42));
    goalMarker.setAttribute('style',"fill:#39bda7;stroke:#39bda7;stroke-width:1;transform-origin:"+
    posTmp.x+"px "+posTmp.y+"px;transform:rotate("+rotation+"deg)");
    that.svg.appendChild(goalMarker);
    goal.on('result', function() {
      that.svg.removeChild(goalMarker);
    });
  };
  this.mouseEventHandler = function(event, mouseState) {
      if (mouseState === 'down'){
        // get position when mouse button is pressed down
        that.eventsVar.position = that.utils.globalToRos(event.layerX, event.layerY);
        that.eventsVar.positionVec3 = new ROSLIB.Vector3(that.eventsVar.position);
        that.eventsVar.mouseDown = true;
      }
      else if (mouseState === 'move'){
        // remove obsolete orientation marker
        if (event.timeStamp - that.eventsVar.lastTimeStamp < 25) {
          return;
        } else {
          that.eventsVar.lastTimeStamp = event.timeStamp;
        }
        if ( that.eventsVar.mouseDown === true) {
          var currentPos = that.utils.globalToRos(event.layerX, event.layerY);
          var currentPosVec3 = new ROSLIB.Vector3(currentPos);

          if (that.eventsVar.orientationMarker === null) {
            that.eventsVar.orientationMarker = document.createElementNS('http://www.w3.org/2000/svg','polygon');
            that.svg.appendChild(that.eventsVar.orientationMarker);
          }
          that.eventsVar.xDelta =  currentPosVec3.x - that.eventsVar.positionVec3.x;
          that.eventsVar.yDelta =  currentPosVec3.y - that.eventsVar.positionVec3.y;
          that.eventsVar.thetaRadians  = Math.atan2(that.eventsVar.xDelta,that.eventsVar.yDelta);
          if (that.eventsVar.thetaRadians >= 0 && that.eventsVar.thetaRadians <= Math.PI) {
            that.eventsVar.thetaRadians += (3 * Math.PI / 2);
          } else {
            that.eventsVar.thetaRadians -= (Math.PI/2);
          }
          that.eventsVar.thetaDegrees = that.eventsVar.thetaRadians * (180.0 / Math.PI);
          var posTmp = {x : (that.decaX + (that.eventsVar.positionVec3.x*that.scale)),
            y : (that.decaY -(that.eventsVar.positionVec3.y*that.scale))};

          that.eventsVar.orientationMarker.setAttribute('points',posTmp.x+","+posTmp.y+
                            " "+(posTmp.x + 10)+","+posTmp.y+
                            " "+(posTmp.x + 8.76)+","+(posTmp.y + 4.42));
          that.eventsVar.orientationMarker.setAttribute('style',"fill:red;stroke:red;stroke-width:1;transform-origin:"+
          posTmp.x+"px "+posTmp.y+"px;transform:rotate("+(165+that.eventsVar.thetaDegrees)+"deg)");
        }
      } else if (that.eventsVar.mouseDown) { // mouseState === 'up'
        // if mouse button is released
        // - get current mouse position (goalPos)
        // - calulate direction between stored <position> and goal position
        // - set pose with orientation
        // - send goal
        that.eventsVar.mouseDown = false;
        if (that.eventsVar.orientationMarker !== null) {
          that.svg.removeChild(that.eventsVar.orientationMarker);
          that.eventsVar.orientationMarker = null;
        }

        var goalPos = that.utils.globalToRos(event.layerX, event.layerY);

        var goalPosVec3 = new ROSLIB.Vector3(goalPos);

        that.eventsVar.xDelta =  goalPosVec3.x - that.eventsVar.positionVec3.x;
        that.eventsVar.yDelta =  goalPosVec3.y - that.eventsVar.positionVec3.y;

        that.eventsVar.thetaRadians  = Math.atan2(that.eventsVar.xDelta,that.eventsVar.yDelta);

        if (that.eventsVar.thetaRadians >= 0 && that.eventsVar.thetaRadians <= Math.PI) {
          that.eventsVar.thetaRadians += (3 * Math.PI / 2);
        } else {
          that.eventsVar.thetaRadians -= (Math.PI/2);
        }

        var qz =  Math.sin(-that.eventsVar.thetaRadians/2.0);
        var qw =  Math.cos(-that.eventsVar.thetaRadians/2.0);

        var orientation = new ROSLIB.Quaternion({x:0, y:0, z:qz, w:qw});

        var pose = new ROSLIB.Pose({
          position :    that.eventsVar.positionVec3,
          orientation : orientation
        });
        that.sendGoal(pose);
      }
    };
  this.zoom = function (scale) {
    if (that.transMatrix[0] <= 0.25 && (scale < 1)) {
      return;
    }
    that.transMatrix[0] = that.transMatrix[3] += (scale-1);
    that.transMatrix[1] *= scale;
    that.transMatrix[2] *= scale;
    that.transMatrix[4] += (1-scale)*that.width/4;
    that.transMatrix[5] += (1-scale)*that.height/4;
    if (that.transMatrix[0] > 1) {
      that.svg.setAttributeNS(null, "width", that.width*that.transMatrix[0]);
      that.svg.setAttributeNS(null, "height", that.height*that.transMatrix[0]);
    } else {
      that.svg.setAttributeNS(null, "width", that.width);
      that.svg.setAttributeNS(null, "height", that.height);
    }
    var newMatrix = "matrix(" +  that.transMatrix.join(' ') + ")";
    that.svg.setAttributeNS(null, "transform", newMatrix);
  };
};
  // arg : torob_msgs/VectorMap
  // var toto = document.getElementById("1");
  // toto.setAttribute("x1",50);
  // edgeToSVG(2,{src : {y:2.570664882659912,x:7.478055477142334,type:2,weight:0},trg : {y:1.7749994993209839,x:7.924130439758301,type:2,weight:0},type : 0,weight : 0})

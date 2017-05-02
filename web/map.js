var Map = function (a) {
  var that  = this;
  this.ros  = a.ros;
  this.continuous = a.continuous || false;
  this.divID = a.divID || 'map';
  this.withOrientation = a.withOrientation || true;
  this.serverName = a.serverName || '/move_base';
  this.actionName = a.actionName || 'move_base_msgs/MoveBaseAction';
  this.viewer = new ROS2D.Viewer({
    divID : that.divID,
    width : 1000,
    height : 1000,
    background : '#7F7F7F'
  });
  this.init = function () {
    that.initMeta();
    setTimeout(function () {
      that.viewer.scene.children[2].scaleX = that.viewer.scene.children[2].scaleY = 0.02;
    },2000);

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
      that.viewer.width = that.viewer.scene.canvas.width = meta.width;
      that.viewer.height = that.viewer.scene.canvas.height = meta.height;
      that.scale = 1/that.resolution;
      map_metadata.unsubscribe();
      if (that.zoomView === undefined) {
        that.nav = new NAV2D.OccupancyGridClientNav({
          ros : that.ros,
          viewer : {
            scaleToDimensions : function () {},
            shift : function () {}
          },
          rootObject : that.viewer.scene,
          continuous : that.continuous,
          withOrientation : that.withOrientation,
          actionName : that.actionName,
          serverName : that.serverName
        });
        that.zoomView = new ROS2D.ZoomView({rootObject : that.viewer.scene,minScale : that.resolution});
        that.zoomView.startZoom(0,1000);
        that.zoomView.zoom(that.scale);
        that.viewer.shift(-that.viewer.width/(that.scale*2),((that.viewer.height/2.0)-1000)/that.scale);
      }
    });
  };
  this.zoom = function (scale) {
    if (that.viewer.scene.scaleX + that.scale * (scale-1) == 0) {
      return;
    }
    that.viewer.scene.x += (scale-1)*that.viewer.width/4;
    that.viewer.scene.y += (scale-1)*that.viewer.height/4;
    that.viewer.scene.scaleX += that.scale * (scale-1);
    that.viewer.scene.scaleY += that.scale * (scale-1);
    if (that.viewer.scene.canvas.width + that.viewer.width * (scale-1) > that.viewer.width) {
      that.viewer.scene.canvas.width += that.viewer.width * (scale-1);
      that.viewer.scene.canvas.height += that.viewer.height * (scale-1);
    }
  };
  this.init();
}

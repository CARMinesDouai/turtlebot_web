var Viewer = function (a) {
  var that  = this;
  this.map =  a.map;
  this.vmap = a.vmap;
  this.currentView = this.map.divID;
  this.changeView = function (event) {
    document.getElementById('indicator').style.width = event.clientWidth+'px';
    document.getElementById('indicator').style.left = event.offsetLeft+'px';
    var v = document.getElementById('viewer').children;
    for (var i=0; i<v.length; i++) {
      v[i].style.display = 'none';
    }
    that.currentView = event.innerHTML;
    document.getElementById(event.innerHTML).style.display = 'block';
  };
  this.zoom = function (scale) {
    if (that.currentView == that.map.divID) {
      that.map.zoom(scale);
    } else if (that.currentView == that.vmap.divID) {
      that.vmap.zoom(scale);
    }
  };
};

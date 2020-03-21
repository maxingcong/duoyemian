var Cross, ToolWithStroke, createShape,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

ToolWithStroke = require('./base').ToolWithStroke;

createShape = require('../core/shapes').createShape;

module.exports = Cross = (function(superClass) {
  extend(Cross, superClass);

  function Cross() {
    return Cross.__super__.constructor.apply(this, arguments);
  }

  Cross.prototype.name = 'Cross';

  Cross.prototype.iconName = 'cross';

  Cross.prototype.eventTimeThreshold = 10;

  Cross.prototype.begin = function(x, y, lc) {
    this.color = lc.getColor('primary');
    this.currentShape = this.makePointX(x, y, lc);
    lc.saveShape(this.currentShape);
    lc.saveShape(this.makePointY(x, y, lc));
    return this.lastEventTime = Date.now();
  };

  Cross.prototype["continue"] = function(x, y, lc) {
    // var timeDiff;
    // timeDiff = Date.now() - this.lastEventTime;
    // if (timeDiff > this.eventTimeThreshold) {
    //   this.lastEventTime += timeDiff;
    //   // this.currentShape.addPoint(this.makePoint(x, y, lc));
    //   return lc.drawShapeInProgress(this.currentShape);
    // }
  };

  Cross.prototype.end = function(x, y, lc) {
    return this.currentShape = void 0;
  };

  Cross.prototype.makePointX = function(x, y, lc) {
    return createShape('Line', {
      x1: x - 20 / lc.scale, y1: y - 20 / lc.scale,
      x2: x + 20 / lc.scale, y2: y + 20 / lc.scale,
      strokeWidth: this.strokeWidth,
      color: this.color
    });
  };

  Cross.prototype.makePointY = function(x, y, lc) {
    return createShape('Line', {
      x1: x - 20 / lc.scale, y1: y + 20 / lc.scale,
      x2: x + 20 / lc.scale, y2: y - 20 / lc.scale,
      strokeWidth: this.strokeWidth,
      color: this.color
    });
  };

  Cross.prototype.makeShape = function() {
    return createShape('Line');
  };

  return Cross;

})(ToolWithStroke);

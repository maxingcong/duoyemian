var Tick, ToolWithStroke, createShape,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

ToolWithStroke = require('./base').ToolWithStroke;

createShape = require('../core/shapes').createShape;

module.exports = Tick = (function(superClass) {
  extend(Tick, superClass);

  function Tick() {
    return Tick.__super__.constructor.apply(this, arguments);
  }

  Tick.prototype.name = 'Tick';

  Tick.prototype.iconName = 'tick';

  Tick.prototype.eventTimeThreshold = 10;

  Tick.prototype.begin = function(x, y, lc) {
    this.color = lc.getColor('primary');
    this.currentShape = this.makePointX(x, y, lc);
    lc.saveShape(this.currentShape);
    lc.saveShape(this.makePointY(x, y, lc));
    return this.lastEventTime = Date.now();
  };

  Tick.prototype["continue"] = function(x, y, lc) {
    
  };

  Tick.prototype.end = function(x, y, lc) {
    return this.currentShape = void 0;
  };

  Tick.prototype.makePointX = function(x, y, lc) {
    return createShape('Line', {
      x1: x - 15 / lc.scale, y1: y - 10 / lc.scale,
      x2: x, y2: y + 5 / lc.scale,
      strokeWidth: this.strokeWidth,
      color: this.color
    });
  };

  Tick.prototype.makePointY = function(x, y, lc) {
    return createShape('Line', {
      x1: x , y1: y + 5 / lc.scale,
      x2: x + 30 / lc.scale, y2: y - 30 / lc.scale,
      strokeWidth: this.strokeWidth,
      color: this.color
    });
  };

  Tick.prototype.makeShape = function() {
    return createShape('Line');
  };

  return Tick;

})(ToolWithStroke);

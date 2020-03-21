var DOM, React, _, classSet, createReactClass, createToolButton;

React = require('./React-shim');

DOM = require('../reactGUI/ReactDOMFactories-shim');

createReactClass = require('../reactGUI/createReactClass-shim');

classSet = require('../core/util').classSet;

_ = require('../core/localization')._;

createToolButton = function(tool) {
  var displayName, imageName;
  displayName = tool.name;
  imageName = tool.iconName;
  return React.createFactory(createReactClass({
    displayName: displayName,
    getDefaultProps: function() {
      return {
        isSelected: false,
        lc: null
      };
    },
    componentWillMount: function() {
      if (this.props.isSelected) {
        return this.props.lc.setTool(tool);
      }
    },
    render: function() {
      var className, div, imageURLPrefix, img, isSelected, onSelect, ref, src;
      div = DOM.div, img = DOM.img;
      ref = this.props, imageURLPrefix = ref.imageURLPrefix, isSelected = ref.isSelected, onSelect = ref.onSelect;
      var classKey = 'lc-tool-' + _(displayName);
      var titleMap = {Pencil: '涂鸦', Text: '文本', Rectangle: '框', Ellipse: '圆', Pan: '拖动', Tick: '打勾', Cross: '打叉', Eraser: '橡皮擦'};
      className = classSet({
        'lc-pick-tool': true,
        'toolbar-button': true,
        'thin-button': true,
        'selected': isSelected,
        [classKey]: true,
      });
      src = imageURLPrefix + "/" + imageName + ".png";
      return div({
        className: className,
        style: {
          'backgroundImage': "url(" + src + ")"
        },
        onClick: (function() {
          return onSelect(tool);
        }),
        title: titleMap[_(displayName)]
      });
    }
  }));
};

module.exports = createToolButton;

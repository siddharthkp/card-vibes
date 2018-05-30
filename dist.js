'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function VanillaTilt(element) {
  this.width = null;
  this.height = null;
  this.left = null;
  this.top = null;
  this.transitionTimeout = null;
  this.updateCall = null;

  this.updateBind = this.update.bind(this);
  this.resetBind = this.reset.bind(this);

  this.element = element;

  this.settings = this.getSettings();

  this.element.style.boxShadow = this.getShadow(this.settings);

  this.reverse = this.settings.reverse ? -1 : 1;

  this.addEventListeners();
}

VanillaTilt.prototype.getShadow = function getShadow(settings, values) {
  if (!values) values = { percentageX: 50, percentageY: 50 };
  var shadow = this.settings.shadow;

  return shadow.color + ' ' + (shadow.x.min + 0.01 * values.percentageX * (shadow.x.max - shadow.x.min)) + 'px ' + (shadow.y.min + 0.01 * values.percentageY * (shadow.y.max - shadow.y.min)) + 'px ' + shadow.spread + 'px';
};

VanillaTilt.prototype.isSettingTrue = function isSettingTrue(setting) {
  return setting === '' || setting === true || setting === 1;
};

VanillaTilt.prototype.addEventListeners = function addEventListeners() {
  this.onMouseEnterBind = this.onMouseEnter.bind(this);
  this.onMouseMoveBind = this.onMouseMove.bind(this);
  this.onMouseLeaveBind = this.onMouseLeave.bind(this);

  this.element.addEventListener('mouseenter', this.onMouseEnterBind);
  this.element.addEventListener('mousemove', this.onMouseMoveBind);
  this.element.addEventListener('mouseleave', this.onMouseLeaveBind);
};

VanillaTilt.prototype.removeEventListeners = function removeEventListeners() {
  this.element.removeEventListener('mouseenter', this.onMouseEnterBind);
  this.element.removeEventListener('mousemove', this.onMouseMoveBind);
  this.element.removeEventListener('mouseleave', this.onMouseLeaveBind);
};

VanillaTilt.prototype.destroy = function destroy() {
  clearTimeout(this.transitionTimeout);
  if (this.updateCall !== null) cancelAnimationFrame(this.updateCall);

  this.reset();

  this.removeEventListeners();
  this.element.vanillaTilt = null;
  delete this.element.vanillaTilt;

  this.element = null;
};

VanillaTilt.prototype.onMouseEnter = function onMouseEnter(event) {
  this.updateElementPosition();
  this.element.style.willChange = 'transform';
  this.setTransition();
};

VanillaTilt.prototype.onMouseMove = function onMouseMove(event) {
  if (this.updateCall !== null) {
    cancelAnimationFrame(this.updateCall);
  }

  this.event = event;
  this.updateCall = requestAnimationFrame(this.updateBind);
};

VanillaTilt.prototype.onMouseLeave = function onMouseLeave(event) {
  this.setTransition();
  requestAnimationFrame(this.resetBind);
};

VanillaTilt.prototype.reset = function reset() {
  this.event = {
    pageX: this.left + this.width / 2,
    pageY: this.top + this.height / 2
  };

  this.element.style.transform = 'perspective(' + this.settings.perspective + 'px) ' + 'rotateX(0deg) ' + 'rotateY(0deg) ' + 'scale3d(1, 1, 1)';

  this.element.style.boxShadow = this.getShadow(this.settings);
};

VanillaTilt.prototype.getValues = function getValues() {
  var x = (this.event.clientX - this.left) / this.width;
  var y = (this.event.clientY - this.top) / this.height;

  x = Math.min(Math.max(x, 0), 1);
  y = Math.min(Math.max(y, 0), 1);

  var tiltX = (this.reverse * (this.settings.max / 2 - x * this.settings.max)).toFixed(2);
  var tiltY = (this.reverse * (y * this.settings.max - this.settings.max / 2)).toFixed(2);
  var angle = Math.atan2(this.event.clientX - (this.left + this.width / 2), -(this.event.clientY - (this.top + this.height / 2))) * (180 / Math.PI);

  return {
    tiltX: tiltX,
    tiltY: tiltY,
    percentageX: x * 100,
    percentageY: y * 100,
    angle: angle
  };
};

VanillaTilt.prototype.updateElementPosition = function updateElementPosition() {
  var rect = this.element.getBoundingClientRect();

  this.width = this.element.offsetWidth;
  this.height = this.element.offsetHeight;
  this.left = rect.left;
  this.top = rect.top;
};

VanillaTilt.prototype.update = function update() {
  var values = this.getValues();

  this.element.style.transform = 'perspective(' + this.settings.perspective + 'px) ' + 'rotateX(' + (this.settings.axis === 'x' ? 0 : values.tiltY) + 'deg) ' + 'rotateY(' + (this.settings.axis === 'y' ? 0 : values.tiltX) + 'deg) ' + 'scale3d(' + this.settings.scale + ', ' + this.settings.scale + ', ' + this.settings.scale + ')';

  this.element.style.boxShadow = this.getShadow(this.settings, values);

  this.element.dispatchEvent(new CustomEvent('tiltChange', { detail: values }));

  this.updateCall = null;
};

VanillaTilt.prototype.setTransition = function setTransition() {
  var _this = this;

  clearTimeout(this.transitionTimeout);
  this.element.style.transition = this.settings.speed + 'ms ' + this.settings.easing;

  this.transitionTimeout = setTimeout(function () {
    _this.element.style.transition = '';
  }, this.settings.speed);
};

VanillaTilt.prototype.getSettings = function getSettings() {
  var defaultSettings = {
    reverse: true,
    max: 15,
    perspective: 1000,
    easing: 'cubic-bezier(.03,.98,.52,.99)',
    scale: '1',
    speed: '300',
    transition: true,
    axis: null,
    reset: true,
    shadow: {
      color: 'rgba(20, 26, 40, 0.2)',
      x: { min: -5, max: 5 },
      y: { min: 3.5, max: 10.5 },
      spread: 42
    }
  };

  return defaultSettings;
};

VanillaTilt.init = function init(elements, settings) {
  if (elements instanceof Node) {
    elements = [elements];
  }

  if (elements instanceof NodeList) {
    elements = [].slice.call(elements);
  }

  if (!(elements instanceof Array)) {
    return;
  }

  elements.forEach(function (element) {
    if (!('vanillaTilt' in element)) {
      element.vanillaTilt = new VanillaTilt(element, settings);
    }
  });
};

var cardStyles = {
  width: '300px',
  padding: '30px',
  margin: '10px',
  background: '#fff',
  borderRadius: '4px',
  color: '#364962',
  fontSize: '16px',
  lineHeight: 1.6
};

var Card = function (_React$Component) {
  _inherits(Card, _React$Component);

  function Card() {
    _classCallCheck(this, Card);

    return _possibleConstructorReturn(this, (Card.__proto__ || Object.getPrototypeOf(Card)).apply(this, arguments));
  }

  _createClass(Card, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      VanillaTilt.init(document.querySelectorAll('[data-tilt]'));
    }
  }, {
    key: 'render',
    value: function render() {
      var styles = Object.assign({}, cardStyles, this.props.style);
      return _react2.default.createElement('div', _extends({ 'data-tilt': true, style: styles }, this.props));
    }
  }]);

  return Card;
}(_react2.default.Component);

exports.default = Card;

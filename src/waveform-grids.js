/**
 * @file
 *
 * Defines the {@link WaveformGrids} class.
 *
 * @module waveform-grids
 */

import Konva from 'konva/lib/Core';

/**
 * Creates the waveform grids shapes and adds them to the given view layer.
 *
 * @class
 * @alias WaveformGrids
 *
 * @param {WaveformOverview|WaveformZoomView} view
 * @param {Object} options
 */

function WaveformGrids(view, options) {
  const self = this;

  self._intermediateMajorGridlineColor = options.intermediateMajorGridlineColor;
  self._intermediateMinorGridlineColor = options.intermediateMinorGridlineColor;
  self._intermediateSize = options.intermediateSize;
  self._hidden = false;

  self._gridShape = new Konva.Shape({
    sceneFunc: function(context) {
      self.drawGrid(context, view);
    }
  });
}

WaveformGrids.prototype.addToLayer = function(layer) {
  layer.add(this._gridShape);
};

WaveformGrids.prototype.setIntermediateMajorGridlineColor = function(color) {
  this._intermediateMajorGridlineColor = color;
};

WaveformGrids.prototype.setIntermediateMinorGridlineColor = function(color) {
  this._intermediateMinorGridlineColor = color;
};

/**
 * Draws the time axis and labels onto a view.
 *
 * @param {Konva.Context} context The context to draw on.
 * @param {WaveformOverview|WaveformZoomView} view
 */

WaveformGrids.prototype.drawGrid = function(context, view) {
  context.setAttr('lineWidth', 1);

  const channelCount = view._data._channels.length;

  for (let channel = 0; channel < channelCount; channel++) {
    const gridCount = 1 / this._intermediateSize;
    const midway = gridCount * 0.5;
    const channelHeight = view._height / channelCount;
    const segmentHeightSize = channelHeight * this._intermediateSize;

    for (let i = 1; i < gridCount; i++) {
      if (i % 2 === 0) {
        if (midway === i) {
          context.setAttr('strokeStyle', this._intermediateMinorGridlineColor);
        }
      }
      else {
        context.setAttr('strokeStyle', this._intermediateMajorGridlineColor);
      }

      context.beginPath();
      context.moveTo(0, segmentHeightSize * i + (channel * channelHeight));
      context.lineTo(view._width, segmentHeightSize * i + (channel * channelHeight));
      context.stroke();
    }
  }
};

WaveformGrids.prototype.toggleGrid = function(view) {
  if (this._hidden) {
    view._gridLinesLayer.show();
    this._hidden = false;
  }
  else {
    view._gridLinesLayer.hide();
    this._hidden = true;
  }
};

export default WaveformGrids;

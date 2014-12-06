var board = require('state/board').board

board.add_animation(new Animation({
  frame_x: 0,
  frame_y: 0,
  xw: runtime.width,
  yh: 20,
  get_gfx: function()
  {
    var self = this;
    var gfx = this.gfx

    gfx.reset()

    var c = gfx.context

    c.fillStyle = 'hsl(170,100%,25%)'
    c.fillRect(0, 0, gfx.xw(), gfx.yh());

    return gfx
  },

}));

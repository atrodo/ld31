var board = require('state/board').board
var actions = require('state/board').actions

board.add_animation(new Animation({
  frame_x: 0,
  frame_y: 40,
  xw: runtime.width,
  yh: runtime.height - 40,
  get_gfx: function()
  {
    var self = this;
    var gfx = this.gfx

    gfx.reset()

    var c = gfx.context

    var set_click = function(n, x, y, xw, yh)
    {
      c.strokeRect(x * 2, y * 2, xw * 2, yh * 2)
      if (actions[n].click == null)
      {
        actions[n].set_trigger(new triggers.click({
          x: x * 2,
          y: y * 2,
          xw: xw * 2,
          yh: yh * 2,
        }))
      }
    }

    c.translate(0, this.yh)
    c.scale(1, -1);

    c.font = "24px Georgia"

    c.fillStyle = '#3B70B4'
    c.fillRect(0, 0, gfx.xw(), gfx.yh());

    c.lineWidth = 12
    c.strokeStyle = "rgb(255, 255, 255)"
    c.strokeRect(0, 0, gfx.xw(), gfx.yh());

    c.lineWidth = 6
    c.fillStyle = "rgb(255, 255, 255)"
    c.strokeStyle = "rgb(255, 255, 255)"

    // Kitchen
    c.fillText('Kitchen', 20, 40)
    set_click('kitchen', 0, 0, 160, 60)

    // Bed
    c.fillText('Bed', 540, 180)
    set_click('bed', 260, 60, 60, 120)

    // Couch
    c.save()
    c.translate(380, 280)
    c.rotate(1.5707)
    c.translate(-380, -280)
    c.fillText('Couch', 360, 280)
    c.restore()
    set_click('couch', 180, 120, 30, 100)

    // Table
    c.fillText('Table', 140, 200)
    set_click('table', 60, 80, 60, 60)

    // Mail
    c.fillText('Mailbox', 500, 40)
    set_click('mailbox', 240, 0, 80, 30)

    // Dresser
    c.fillText('Dresser', 540, 428)
    set_click('dresser', 260, 200, 60, 20)

    // Bathroom
    c.fillText('Bathroom', 20, 360)
    set_click('bathroom', 0, 160, 160, 60)

    return gfx
  },

}));

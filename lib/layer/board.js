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

    var m = {
      r: ( 59 - 186),
      g: (112 - 186),
      b: (180 -  63),
    }
    var select_color = function(percent)
    {
      var result = [
        'rgb(',
        (m.r * percent + 186) | 0, ',',
        (m.g * percent + 186) | 0, ',',
        (m.b * percent +  63) | 0,
        ')',
      ].join('')
      return result
    }

    var set_click = function(n, x, y, xw, yh)
    {
      if (actions[n].cooldown != null)
      {
        c.fillStyle = select_color(actions[n].cooldown.get_pctdone())
        c.fillRect(x * 2, y * 2, xw * 2, yh * 2)
        c.fillStyle = "rgb(255, 255, 255)"
      }

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

    c.lineWidth = 6
    c.fillStyle = "rgb(255, 255, 255)"
    c.strokeStyle = "rgb(255, 255, 255)"

    // Kitchen
    set_click('kitchen', 0, 0, 160, 60)
    c.fillText('Kitchen', 20, 40)

    // Bed
    set_click('bed', 260, 60, 60, 120)
    c.fillText('Bed', 540, 180)

    // Couch
    set_click('couch', 180, 120, 30, 100)
    c.save()
    c.translate(380, 280)
    c.rotate(1.5707)
    c.translate(-380, -280)
    c.fillText('Couch', 360, 280)
    c.restore()

    // Table
    set_click('table', 60, 80, 60, 60)
    c.fillText('Table', 140, 200)

    // Mail
    set_click('mailbox', 240, 0, 80, 30)
    c.fillText('Mailbox', 500, 40)

    // Dresser
    set_click('dresser', 260, 200, 60, 20)
    c.fillText('Dresser', 540, 428)

    // Bathroom
    set_click('bathroom', 0, 160, 160, 60)
    c.fillText('Bathroom', 20, 360)

    c.lineWidth = 12
    c.strokeStyle = "rgb(255, 255, 255)"
    c.strokeRect(0, 0, gfx.xw(), gfx.yh());

    return gfx
  },

}));

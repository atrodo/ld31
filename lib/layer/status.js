var status_bar = require('state/status').status_bar
var clock = require('state/status').clock
var cash = require('state/status').cash
var current_message = require('state/status').current_message

status_bar.add_animation(new Animation({
  frame_x: 0,
  frame_y: 0,
  xw: runtime.width,
  yh: 40,
  get_gfx: function()
  {
    var self = this;
    var gfx = this.gfx

    gfx.reset()

    var c = gfx.context

    c.translate(0, this.yh)
    c.scale(1, -1);

    c.fillStyle = '#1F3A6B'
    c.fillRect(0, 0, gfx.xw(), gfx.yh());

    c.font = "12px Arial"
    c.fillStyle = "rgb(255, 255, 255)"

    var amt  = cash()
    var time = clock();

    c.fillText(amt, this.xw - 10 - c.measureText(amt).width, 14)
    c.fillText('$', this.xw - 15 - c.measureText(amt).width, 14)
    c.fillText(time, this.xw - 10 - c.measureText(time).width, 32)

    var message = current_message()
    var swap = 18 * message.pctdone
    c.fillText(message.current, 10, 14-swap)
    c.fillText(message.next, 10, 32-swap)
    c.fillText(message.next2, 10, 50-swap)

    var board = require('state/board')
    c.font = "8px Arial"

    /*
    c.fillText('m', 452, 34)
    c.fillRect(460, 34, 8, -(min(28, board.incoming())))
    c.fillText('o', 472, 34)
    c.fillRect(480, 34, 8, -(min(28, board.outgoing())))
    */
    c.fillText('P', 492, 34)
    c.fillRect(500, 34, 8, -(min(28, board.postcards())))
    c.fillText('F', 512, 34)
    c.fillRect(520, 34, 8, -(min(28, board.food())))
    c.fillText('H', 532, 34)
    c.fillRect(540, 34, 8, -(min(28, board.hunger()/6)))

    return gfx
  },

}));

var status_bar = runtime.add_layer('game.status_bar', { });
exports.status_bar = status_bar

var clock = 410;
var cash  = 1337;

var time = null
var with_colon = true;
var clock_speed = 1;
var adj_clock   = 0

var messages = []

var hour = function(time)
{
  return (((time % 1440) | 0) / 60 ) | 0
}

var speedup_time = 20
var max_speedup  = 60 + speedup_time
var cooler = new Cooldown("1s", function()
{
  clock_speed++
  var log_time = clock_speed - speedup_time + 2
  var clock_adj = clock_speed <= speedup_time ? 1
                : clock_speed <= max_speedup  ? 10 * Math.log(log_time)
                :                               40

  clock_adj += adj_clock
  adj_clock = 0

  if (hour(clock) < 7 && hour(clock+clock_adj) >= 7)
  {
    require('state/board').new_day( 1 + (clock / 1440) | 0)
    clock_speed = 1;
    clock_adj = (7 * 60) - (clock % 1440)
    console.log(clock, clock_adj)
  }

  clock = (clock + clock_adj) | 0
  time = null
})

status_bar.events.on("frame_logic", cooler);

exports.clock = function(adj)
{
  if (adj)
  {
    adj_clock = adj
    cooler.frames = 1;
  }

  if (with_colon != cooler.get_pctdone() < 0.5)
  {
    with_colon = !with_colon
    time = null
  }

  if (time == null)
  {
    var day = 1 + (clock / 1440) | 0
    var hr  = hour(clock)
    var min = 0 + (clock % 60) | 0
    var sep = with_colon ? ':' : ' '

    min = min < 10 ? "0" + min : min
    hr  = hr  < 10 ? "0" + hr  : hr

    time = ["Day", day, "-", hr + sep + min].join(" ")
  }
  return time
}

exports.cash = function(adj)
{
  cash += adj || 0
  return '$' + cash
}

var messages_show = new Cooldown("12s", function()
{
  messages.shift();
})

status_bar.events.on("frame_logic", messages_show);

var f5s = 2 * runtime.fps

[% WRAPPER scope %]
  var action = new Action(function() {
    if (messages_show.frames > f5s)
      messages_show.frames = f5s
  }, 'space');
  var input = new Input({layer: status_bar})
  input.add_action(action);
[% END %]

exports.current_message = function()
{
  var m = messages_show
  var pctdone = 0

  if (m.frames < f5s)
  {
    pctdone = 1 - (m.frames / f5s)
  }

  return {
    current: messages[0] || '',
    next:    messages[1] || '',
    next2:   messages[2] || '',
    pctdone: pctdone,
  }
}

exports.add_message = function(msg)
{
  if (messages.length == 0)
  {
    messages_show.reset()
  }
  messages.push.apply(messages, arguments)
  clock_speed = 1;
}

var status_bar = runtime.add_layer('game.status_bar', { });
exports.status_bar = status_bar

var clock = 400;
var cash  = 1337;

var time = null
var with_colon = true;
var clock_speed = 1;

var messages = ['Message 1', 'Message 2', 'Message 3']

var cooler = new Cooldown("1s", function()
{
  clock_speed++
  clock += clock_speed <= 30 ? 1
         : clock_speed <= 90 ? 10 * Math.log(clock_speed - 30)
         :                     40
  clock = clock | 0
  time = null
})

status_bar.events.on("frame_logic", cooler);

exports.clock = function()
{
  if (with_colon != cooler.get_pctdone() < 0.5)
  {
    with_colon = !with_colon
    time = null
  }

  if (time == null)
  {
    var day = 1 + (clock / 1440) | 0
    var hr  = 0 + (((clock % 1440) | 0) / 60 ) | 0
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

var messages_show = new Cooldown("15s", function()
{
  messages.shift();
})

status_bar.events.on("frame_logic", messages_show);

var f5s = 5 * runtime.fps

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

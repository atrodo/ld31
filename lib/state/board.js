var board = runtime.add_layer('game.board', { });

var mailbox = {
  outgoing_mail: 0,
  incoming_mail: 0,
  postcards    : 0,
  contests     : 0,
  food         : 0,
  headline     : '',
}
var table = {
  outgoing_mail: 0,
  incoming_mail: 0,
  postcards    : 0,
}

var postard_min = 10;
var contests    = 0;
var rng         = new lprng(null, 2);

var food     = 10
var hunger   = 0
var last_ate = 0
var last_hunger = 0;

var add_message = require('state/status').add_message

var actions = {
  kitchen: new Action(function() {
    var result = new Cooldown('2s')
    var now = require('state/status').raw_clock()

    if (now - last_ate < 2 * 60)
    {
      add_message('You ate not too long ago, so you forgo more food')
      return result
    }

    if (food <= 0)
    {
      add_message('Walking into the kitchen, you remember you are out of food')
      return result
    }

    var amt = min(min(8, food), hunger)
    hunger -= amt
    food   -= amt

    var msg = 'That was some good food'

    if (food <= 0)
    {
      msg += ' but that was the end of your food';
    }
    else
    {
      last_ate = now
    }

    add_message(msg)
    return result
  }, 'k'),
  bed: new Action(function() {
    require('state/status').clock(6 * 60)
    add_message('You lay down for a little while')
    return new Cooldown("2s");
  }, 'b'),
  couch: new Action(function() {
    add_message('The couch is not that comfortable')
    return new Cooldown("2s");
  }, 'c'),
  table: new Action(function() {
    var result = new Cooldown('2s')
    if (table.incoming_mail <= 0)
    {
      add_message('You don\'t have any more magazines with contests to enter')
      return result;
    }

    if (table.postcards <= 0)
    {
      add_message('You don\'t have any more postcards to send to contests')
      return result;
    }

    table.postcards--
    table.outgoing_mail++

    var msg = 'You have filled out a contest postcard'
    if ((rng.random(2)) < 1)
    {
      table.incoming_mail--
      msg += ' and that was the last contest in ' + 'this magazine'
    }

    add_message(msg)
    return result
  }, 't'),
  mailbox: new Action(function() {
    var msg = ''
    var is_first = true;

    if (mailbox.incoming_mail)
    {
      if (is_first)
      {
        msg = 'You picked up'
      }
      else
      {
        msg += ','
      }
      msg += ' your mail'
      is_first = false
    }

    if (mailbox.postcards)
    {
      if (is_first)
      {
        msg = 'You picked up'
      }
      else
      {
        msg += ','
      }
      msg += ' extra postcards'
      is_first = false
    }

    if (table.outgoing_mail)
    {
      if (is_first)
      {
        msg = 'You'
      }
      else
      {
        msg += ' and'
      }
      msg += '  dropped off your filled out postcards'
      is_first = false
    }

    if (is_first)
    {
      msg = 'There is nothing to do with that'
    }

    add_message(msg)

    mailbox.outgoing_mail += table.outgoing_mail

    table.outgoing_mail  = 0
    table.incoming_mail += mailbox.incoming_mail
    table.postcards     += mailbox.postcards;

    mailbox.incoming_mail = 0
    mailbox.postcards     = 0

    if (mailbox.contests > 0 || mailbox.food > 0)
    {
      var winnings = []

      if (mailbox.contests > 0)
        winnings.push('$$' + mailbox.contests + ' in cash and prizes')

      if (mailbox.food > 0)
      {
        var meals = (mailbox.food / 8) | 0
        if (meals == 0)
          winnings.push('less than 1 meal in food')
        else
          winnings.push(meals + ' meals in food')
      }

      add_message('Good news! You have won '
          + winnings.join(' and '))
      
      var cash = require('state/status').cash(mailbox.contests)
      food += mailbox.food

    }

    mailbox.contests = 0;
    mailbox.food     = 0;

    // winning
    if (require('state/status').raw_cash() > 10000)
    {
      finish('Congratulations')
    }

    return new Cooldown("2s");
  }, 'm'),
  dresser: new Action(function() {
    add_message('Not entirely sure why there is a dresser here')
    return new Cooldown("2s");
  }, 'd'),
  bathroom: new Action(function() {
    add_message('Thankfully, the bathroom always works')
    return new Cooldown("2s");
  }, '.'),
}

$.each(actions, function(k, action)
{
  var input = new Input({layer: board})
  input.add_action(action);
});

exports.new_day = function(day)
{
  add_message('The doorbell rings as new mail is delievered')
  contests += mailbox.outgoing_mail

  mailbox.outgoing_mail  = 0
  mailbox.incoming_mail += rng.randomint(4);
  mailbox.postcards     += postard_min;

  if (day == 1)
  {
    mailbox.incoming_mail += 3;
  }

  while (contests > 1)
  {
    var count = rng.randomint( (min(contests, 6) + 1) )

    // Slightly higher chance of no contests
    if (count > 1)
    {
      count--
      var food_count = rng.randomint((count / 2) | 0)

      if (food_count > 0)
      {
        count -= food_count
        mailbox.food += rng.randomint(food_count * 8 * 2)
      }

      mailbox.contests += rng.randomint(count * 200)
          + max(rng.randomint(count * 3 ) - count * 2, 0) * (rng.randomint(500) + 100)
    }

    contests -= count
  }
}

exports.new_hour = function(hour_diff)
{
  console.log("hunger", hunger, hour_diff)
  hunger += hour_diff

  if (hunger < 8)
    return;

  if (hunger > 168)
  {
    add_message('Suddenly the door is knocked down by zombies, attracted by your hunger.')
    finish('Because, Zombies')
  }

  var now = require('state/status').raw_clock()
  if (now - last_hunger > 4)
  {
    var msg;
    msg = hunger <  18 ? 'You are starting to get hungry'
        : hunger <  48 ? 'You are hungry'
        : hunger <  96 ? 'You are very hungry'
        : hunger < 120 ? 'The couch looks tasty today'
        : hunger < 144 ? 'No, the couch is not a suitable dietary supplement'
        : hunger < 168 ? 'Your hunger is becoming overwhelming'
                       : null
    if (msg != null)
      add_message(msg)
  }

  last_hunger = now
}

exports.board = board
exports.actions = actions

exports.incoming = function()
{
  return table.incoming
}
exports.outgoing = function()
{
  return table.outgoing + mailbox.outgoing
}
exports.postcards = function()
{
  return table.postcards
}
exports.food = function()
{
  return (food / 8) | 0
}
exports.hunger = function()
{
  return hunger
}

var finish = function(text)
{
  require('state/board').board.deactivate()

  var winning = runtime.add_layer('game.winning', { });
  winning.add_animation(new Animation({
    frame_x: runtime.width / 4,
    frame_y: runtime.height / 4,
    xw: runtime.width / 2,
    yh: runtime.height / 2,
    get_gfx: function()
    {
      var self = this;
      var gfx = this.gfx

      gfx.reset()

      var c = gfx.context
      c.translate(0, this.yh)
      c.scale(1, -1);

      c.font = "24px Georgia"

      c.fillStyle = '#3B70B4'
      c.fillRect(0, 0, gfx.xw(), gfx.yh());
      c.fillStyle = "rgb(255, 255, 255)"

      c.fillText(text, 70, 130)

      return gfx
    }
  }))

}

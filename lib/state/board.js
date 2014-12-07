var board = runtime.add_layer('game.board', { });

var mailbox = {
  outgoing_mail: 0,
  incoming_mail: 0,
  postcards    : 0,
}
var table = {
  outgoing_mail: 0,
  incoming_mail: 0,
  postcards    : 0,
}

var postard_min = 10;
var contests    = 0;
var rng         = new lprng(null);

var add_message = require('state/status').add_message

var actions = {
  kitchen: new Action(function() {
  }, 'k'),
  bed: new Action(function() {
    require('state/status').clock(6 * 60)
  }, 'b'),
  couch: new Action(function() {
  }, 'c'),
  table: new Action(function() {
    var result = new Cooldown('4s')
    console.log(table, mailbox)
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
    if ((rng.random() % 2) < 1)
    {
      table.incoming_mail--
      msg += ' and that was the last contest in ' + 'this magazine'
    }

    add_message(msg)
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

    console.log(table, mailbox)
    return new Cooldown("4s");
  }, 'm'),
  dresser: new Action(function() {
  }, 'd'),
  bathroom: new Action(function() {
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
  mailbox.incoming_mail += rng.random() % 4;
  mailbox.postcards     += postard_min;

  console.log(day)
  if (day == 1)
  {
    mailbox.incoming_mail += 3;
  }
}

exports.board = board
exports.actions = actions

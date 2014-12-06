var board = runtime.add_layer('game.board', { });

var actions = {
  kitchen: new Action(function() { console.log(arguments) }, 'k'),
  bed: new Action(function() { console.log(arguments) }, 'b'),
  couch: new Action(function() { console.log(arguments) }, 'c'),
  table: new Action(function() { console.log(arguments) }, 't'),
  mailbox: new Action(function() { console.log(arguments) }, 'm'),
  dresser: new Action(function() { console.log(arguments) }, 'd'),
  bathroom: new Action(function() { console.log(arguments) }, '.'),
}

$.each(actions, function(k, action)
{
  var input = new Input({layer: board})
  input.add_action(action);
});

exports.board = board
exports.actions = actions

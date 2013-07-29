"use strict";
/*global _*/
$(function() {

  //### 'jquery' UI elements for game manipulation
  var game              = $('#game');   // the game container           
  var board             = $('#board');    // the board  container       
  var status_indicators = $('#teams li');   // status bar container     
  var tiles             = [];                         // all the "tiles"

  var players = [                         // player data
    {
      name:      'Ernie',
      marker:    '&times;',
      img_url:   'img/ernie.jpg',
      indicator: $(status_indicators[0]),
      tracker: []
    },
    {
      name:      'Bert',
      marker:    '&oslash;',
      img_url:   'img/bert.jpg',
      indicator: $(status_indicators[1]),
      tracker: []
    }
  ];

  var current_player;                     // player data
  var first_player;
  var first_player_selected = [];
  var second_player;
  var second_player_selected = [];
  var turns  = 0;                         // elapsed turns

  //### There are eight winning combos, the first two are supplied.
  //### What are the other six? Add 'em.
  var win_combos = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [2, 4, 6], [0, 4,8]
  ];

  var initialize = function() {
    //### ready the board for game play
    // Unhide the board
    // $('#game').css('display', 'block');
    //### 1.) Create nine tiles. Each is a div, each needs to be bound ;to 'handle_click'.
    //### Make sure giving each tile a unique 'id' for targeting. Find tile's 'class' in css.
    //### Append tiles to board.

    _(9).times(function(n){
      // Create Title divs with tile class and tile# id
      var tile = "<div class='tile' id='tile" + n + "'></div>";
      var id = '#tile' + n;
      // Push the tile into the tiles array
      tiles.push(tile);
      // Append tile divs onto the board
      $('#board').append(tile);
      // Add event listener handle_click
      $(id).on('click', handle_click);
    });

    //### 2.) Make first player the current_player
    first_player = players[0];
    second_player = players[1];
    //### 3.) Set up the players 'indicators' in UI
    //### - set player image, name, marker
    //### - set player name
    //### - the 'current_player' has a different style (see css '.current')

    // First Player
    // First Player image
    $("li img:first").attr({
      src: first_player.img_url
    });
    // First Player name
    $(".player:first").text(first_player.name);
    // Set first player as current player
    current_player = first_player;
    $("#teams li:first").addClass("current");
    // Set first player marker
    $(".team:first").html(first_player.marker);

    // Second Player
    // Second Player image
    $("li img:last").attr({
      src: second_player.img_url
    });
    // Second Player name
    $(".player:last").text(second_player.name);
    // Set second player marker
    $(".team:last").html(second_player.marker);

    //### 4.) fade in the game
    $('#game').fadeIn(1000);

  }; // End of Initialize()

  var handle_click = function() {
    //### this function is bound to a click event for each tile on the board
    if (!is_active($(this))) {
      activate_tile($(this));
      // Check win condition
      if (is_win()) handle_win();
      // Check tie condition
      else if (is_tie()) handle_tie();
      // Toggle player
      else toggle_player();
    } 
  };

  var is_active = function(tile) {
    //### boolean - is tile active?
    if(tile[0].innerHTML.length > 0) return true; // Tile already chosen
    else return false; // Tile not chosen
  };
  
  var activate_tile = function(tile) {
    //### activate tile
    tile.html(current_player.marker);
    //### don't forget to up 'turn' count
    turns++;
    if (current_player.name === "Ernie") {
      var et = parseInt(_.last(tile[0].id));
      players[0].tracker.push(et);
    }
    if (current_player.name === "Bert") {
      var bt = parseInt(_.last(tile[0].id));
      players[1].tracker.push(bt);
    }
  };

  var toggle_player = function() {
    //### After each turn, toggle the current player and update player indicators
    // Remove current class from current player
    current_player.indicator.removeClass();
    // Toggle current player
    current_player = _.difference(players, current_player)[0];
    // Add current class to new current player
    current_player.indicator.addClass("current");
  };

  var is_win = function() {
    var winner_found = false;
    // ### whether or not the current player's positions result in a win
    // ### returns boolean
    _.each(win_combos, function(combo) {
      if (_.intersection(combo, current_player.tracker).length === 3) {
        winner_found = true;
      }
    });
    if (winner_found === true) return true;
    else return false;
  };

  var is_tie = function() {
    //### has the game resulted in a tie?
    if (turns === 9) return true;
    else return false;
    //### returns boolean
  };

  var handle_win = function() {
    //### update the UI to reflect that a win has occurred.
    // Dim Indicators and enable overlay to dim board
    hide_indicators();
    //### - show results panel
    $("#results").css("display", "block");
    //### - display winner name and image
    $("#results h1").text(current_player.name + ' Won!!!');
    $("#results span").append('<img src="' + current_player.img_url + '" />');
    //### - congrats message
    //### - show new_game button
    $("#results button").on('click', new_game);
  };

  var handle_tie = function() {
    //### update the UI to reflect that a tie game has occurred.
    // Dim Indicators and enable overlay to dim board
    hide_indicators();
    //### - show results panel
    $("#results").css("display", "block");
    //### - display tie and rubber ducky image
    $("#results h1").text("Tie Game!!!");
    $("#results span").append('<img src="img/rubberduckie.jpg" />');
    //### - show new_game button
    $("#results button").on('click', new_game);
  };

  var hide_indicators = function() {
    //### optional: call this to hide the "status" container after detecting a win or a tie
    $("li").removeClass("current");
    $("#overlay").css("display", "block");
  };

  var show_combo = function(combo) {
    //### optional: call this to highlight the combination of tiles that resulted in a win
    //### e.g. colors winning XXX or OOO red.
  }

  var new_game = function() {
    // see http://stackoverflow.com/questions/2405117/difference-between-window-location-href-window-location-href-and-window-location
    // nothing to add here
    window.location.href = window.location.href
  };

  // call initialize() to get the party started
  initialize();
});

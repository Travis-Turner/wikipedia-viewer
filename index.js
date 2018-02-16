$(document).ready(function() {
  var searchButton = $('#searchButton');
  var textInput = $('#textInput');
  var backgroundTxt = $('#background-text');
  var opacityFilter = $('.opacityFilter');
  var container = $('#main-container');
  var resultRow1 = $('#row1');
  var resultRow2 = $('#row2');

  /* EVENT HANDLERS TO CONTROL BACKGROUND EFFECT */
  textInput.on('keyup', function() {
    backgroundTxt.text(textInput.val());
    opacityFilter.addClass('changeOpacity');
  });

  resultRow1.children().on('mouseenter', function(){
    backgroundTxt.text($(this).children(':first').text());
    opacityFilter.addClass('changeOpacity');
  });

  resultRow2.children().on('mouseenter', function(){
    backgroundTxt.text($(this).children(':first').text());
    opacityFilter.addClass('changeOpacity');
  });

  textInput.on('focus', function(){
    /* CLEAR RESULT TABLE FOR A NEW SEARCH */
    resultRow1.fadeOut('slow', function(){
      resultRow1.children().empty();
    });
    resultRow2.fadeOut('slow', function(){
      resultRow2.children().empty();
    });
  });

  textInput.on('focusout', function() {
    backgroundTxt.text("");
    opacityFilter.removeClass('changeOpacity');
  });

  searchButton.on('click', function(e) {
    textInput.blur();
    var row1 = $('#row1');
    e.preventDefault();
    /* SET UP WIKIPEDIA API REQUEST TO RECIEVE JSONP DATA */
    var wikiURL = "https://en.wikipedia.org/w/api.php";
    /* GET SEARCH TERM FROM USER INPUT */
    var searchTerms = textInput.val();
    wikiURL += '?' + $.param({
      'action': 'opensearch',
      'search': searchTerms,
      'prop': 'revisions',
      'rvprop': 'content',
      'format': 'json',
      'limit': 8
    });
    $.ajax({
      url: wikiURL,
      dataType: 'jsonp',
      success: function(data) {
        resultRow1.children().empty();
        resultRow2.children().empty();
        /* IF NO RESULTS ARE FOUND */
        if (data[1].length === 0){
          $("#row1").append("<h3 id='noResults'>NO RESULTS</h3>");
          resultRow1.fadeIn("slow");
          return;
        }
        /* SETUP INDEPENDENT COUNTER FOR 2ND RESULT ROW */
        var counter = 1;
        for (i = 0; i < data[1].length; i ++){
          $("#row1 div:nth-child(" + counter  + ")").append('<h4 class="resultTitle">' + data[1][i] + '</h4>');
          $("#row1 div:nth-child(" + counter  + ")").append('<p class="resultText">' + data[2][i] + '</p>');
          $("#row1 div:nth-child(" + counter  + ")").append('<button class="btn btn-outline-primary btn-result"><a href=' + data[3][i] + ' target="_blank">MORE</a></button>');
          if (data[1][i + 4]){
            $("#row2 div:nth-child(" + counter + ")").append('<h4 class="resultTitle">' + data[1][i + 4] + '</h4>');
            $("#row2 div:nth-child(" + counter  + ")").append('<p class="resultText">' + data[2][i + 4] + '</p>');
            $("#row2 div:nth-child(" + counter  + ")").append('<button class="btn btn-outline-primary btn-result"><a href=' + data[3][i] + 4 + ' target="_blank">MORE</a></button>');

          }
          counter++;
        }
        /* FADE IN RESULTS */
        resultRow1.fadeIn("slow");
        resultRow2.fadeIn("slow");
      }
    });
  });
});

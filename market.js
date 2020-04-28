// Fallens dodgy JS

var myjson;

$.getJSON("https://api.coingecko.com/api/v3/coins/bitcoin?tickers=true&market_data=true&community_data=true&developer_data=true&sparkline=true", function(data) {
  myjson = `${data.market_data.current_price.usd}`;
});

//Chain Node USD
$.getJSON('https://asymetrex.com/api/tickers/xerobtc', function(data) {

  var text = (`${data.ticker.last}` * 5000) * myjson;
  var usdm = text.toFixed(3);

  $(".chainu").html(usdm);
});


//XERO Node USD
$.getJSON('https://asymetrex.com/api/tickers/xerobtc', function(data) {

  var text = (`${data.ticker.last}` * 20000) * myjson;
  var usdm = text.toFixed(3);

  $(".xerou").html(usdm);

});



//Link Node USD
$.getJSON('https://asymetrex.com/api/tickers/xerobtc', function(data) {

  var text = (`${data.ticker.last}` * 40000) * myjson;
  var usdm = text.toFixed(3);

  $(".linku").html(usdm);

});



//Super Node USD
$.getJSON('https://asymetrex.com/api/tickers/xerobtc', function(data) {

  var text = (`${data.ticker.last}` * 80000) * myjson;
  var usdm = text.toFixed(3);

  $(".superu").html(usdm);

});

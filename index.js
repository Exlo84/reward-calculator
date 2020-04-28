var myjson;

$.getJSON("https://api.coingecko.com/api/v3/coins/bitcoin?tickers=true&market_data=true&community_data=true&developer_data=true&sparkline=true", function(data) {
  myjson = `${data.market_data.current_price.usd}`;
});

window.addEventListener('load', function () {
  window.web3 = new Web3(new Web3.providers.HttpProvider("https://rpc.xerom.cloud"));
})
var address = "";
var balanceIncreaseCounter = 0;
var txIncreaseCounter = 0;
var loopCount = 0;
var balanceAdjustment = 0;
var currentBalance = 0;
var originalBalance = 0;
var blockHistoryCount = 1000;

function getNodeStats() {
  address = document.getElementById('address').value;
  document.getElementById("nodeaddress").innerHTML = "Node Address: " + address;
  document.getElementById("status").innerHTML = "Node Status: Loading";
  document.getElementById("blockcount").innerHTML = "Payment History: Loading";
  document.getElementById("totalrewards").innerHTML = "Total Rewards Received: Loading";
  document.getElementById("dailyreward").innerHTML = "Estimated Daily Reward: Loading";

  web3.eth.getBlockNumber((err, number) => {
    if (err == null) {
      for(var i=0; i<blockHistoryCount; i++) {
        getBlockDetails(i, number);
      }
    } else {
      console.log(err);
      setTimeout(getNodeStats(), 3000);
    }
  });
}

function getBlockDetails(i, number) {
  web3.eth.getBlock((number-i), true, (err, data) => {
    if (err == null) {
      web3.eth.getBalance(address, (number-i), (err, balance) => {
        if (err == null) {
          if (i == 0) {currentBalance = balance;}
          if (i == (blockHistoryCount-1)) {originalBalance = balance;}
            data.transactions.forEach(txLoop)
            loopCount++;
            if (loopCount == blockHistoryCount) {
              setTimeout(outputStats(originalBalance, currentBalance, balanceAdjustment), 500);
            }
        } else {
          console.log(err);
          setTimeout(getBlockDetails(i, number), 100);
        }
      });
    } else {
      console.log(err);
      setTimeout(getBlockDetails(i, number), 100);
    }
  });
}

function txLoop(tx, index, txs) {
  console.log("TX To Address: " + tx.to + "   TX From Address: " + tx.from);
  if (tx.to.toLowerCase() == address.toLowerCase()) {
    balanceAdjustment += (tx.value / 1000000000000000000);
    console.log("Found Incoming TX To Address - Value: " + tx.value + "   Balance Adjustment Total: " + balanceAdjustment);
    if (loopCount == blockHistoryCount) {outputStats(originalBalance, currentBalance, balanceAdjustment);}
  } else if (tx.from.toLowerCase() == address.toLowerCase()) {
    balanceAdjustment -= (tx.value / 1000000000000000000);
    console.log("Found Outgoing TX From Address - Value: " + tx.value + "   Balance Adjustment Total: " + balanceAdjustment);
    if (loopCount == blockHistoryCount) {outputStats(originalBalance, currentBalance, balanceAdjustment);}
  }
}

function outputStats(originalBalance, currentBalance, balanceAdjustment) {
  currentBalance = currentBalance / 1000000000000000000;
  adjustedBalance = (currentBalance - balanceAdjustment);
  originalBalance = originalBalance / 1000000000000000000;

  if (adjustedBalance > originalBalance) {
    console.log("Xero Node Is Active\n");
    document.getElementById("status").innerHTML = "Node Status: Active";
    console.log("Balance Increase: " + (adjustedBalance - originalBalance) + "\n");
    document.getElementById("blockcount").innerHTML = "Payment History: " + blockHistoryCount + " Blocks";
    document.getElementById("totalrewards").innerHTML = "Total Rewards Received: " + (adjustedBalance - originalBalance) + " XERO";
    console.log("Estimated Daily Reward: " + ((adjustedBalance - originalBalance) * (6646 / blockHistoryCount)) + "\n");
    document.getElementById("dailyreward").innerHTML = "Estimated Daily Reward: " + ((adjustedBalance - originalBalance) * (6646 / blockHistoryCount)) + " XERO";
    console.log("Current Balance: " + currentBalance + "   Original Balance: " + originalBalance + "    Adjusted Balance: " + adjustedBalance + "    Balance Adjustment: " + balanceAdjustment +"\n");
  } else {
    console.log("Xero Node Is Not Active\n");
    document.getElementById("status").innerHTML = "Node Status: Inactive";
    document.getElementById("blockcount").innerHTML = "Payment History: " + blockHistoryCount + " Blocks";
    document.getElementById("totalrewards").innerHTML = "Total Rewards Received: 0 XERO";
    document.getElementById("dailyreward").innerHTML = "Estimated Daily Reward: 0 XERO";
    console.log("Current Balance: " + currentBalance + "   Original Balance: " + originalBalance + "    Adjusted Balance: " + adjustedBalance + "    Balance Adjustment: " + balanceAdjustment +"\n");
  }
}

console.log("Fetching your Xerom node stats..");
getNodeStats();

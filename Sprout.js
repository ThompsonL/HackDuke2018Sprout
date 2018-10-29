/**
 * 
 */
var MY_KEY = '227f36b88e9a1e6a0bd0d45755b082be';
var customerKey = '5bc24355322fa06b67793da3';
var LoansPath = ("/customers/" + customerKey + "loans?key=" + MY_KEY);
var BillsPath = ("/customers/" + customerKey + "bills?key=" + MY_KEY);
var AccountsPath = ("/customers/" + customerKey + "/accounts?key=" + MY_KEY);
var DepositsPath = ("/customers/" + customerKey + "/deposits?key=" + MY_KEY);
var http = require("node_modules/http");
// ACCOUNTS
// The map accountMaps holds the total balances of each type of account; credit, savings and checking
// The types of these accounts are the keys to the map
// accountInfo is the (very basic) parsed json output, but holding onto it is important because I said so
var options = {
		"method": "GET",
		"hostname": "api.reimaginebanking.com",
		"port": null,
		"path": AccountsPath,
		"headers": {
			"cache-control": "no-cache",
			"postman-token": "4e556cc8-1592-3ae4-3e32-668e2f90b212"
		}
};

var accountMap = new Map();
var accountInfo = [];
var loanPay = [];
var billPay = []; 
var req = http.request(options, function (res) {
	var chunks = [];

	res.on("data", function (chunk) {
		chunks.push(chunk);
	});

	res.on("end", function () {
		var body = Buffer.concat(chunks);
		var bodyString = body.toString();
		accountInfo = bodyString.split(",");
		// console.log(accountInfo);
		for(var k = 1; k < accountInfo.length; k = k + 6){
			var accountTypeHolder = accountInfo[k];
			accountType = accountTypeHolder.split(":")[1];
			accountType = accountType.substring(1, accountType.length-1);
//			console.log(accountType);
			if(!(accountMap.has(accountType))){
				accountMap.set(accountType, 0);
			}
			var tempBalance = accountInfo[k+3].split("\"")[2];
			tempBalance = tempBalance.substring(1,tempBalance.length);
//			console.log(tempBalance);
			balanceVal = parseInt(tempBalance);
			var balance = accountMap.get(accountType) + balanceVal;
			accountMap.set(accountType, balance);
			//console.log(accountInfo);
		}
		// Since accountInfo has all the pertinent data inside this request, this console.log call works 
		// correctly while the other doesn't.
		console.log(accountMap);
		tempInfo1(accountInfo);
	});
});
req.end();

function tempInfo1(tInfo) {
	accountInfo = tInfo;
	console.log(tInfo);

	console.log(accountMap);

}
// BILLS
// This is probably the simplest one out there, it just puts all the bill values into an array
var options = {
		"method": "GET",
		"hostname": "api.reimaginebanking.com",
		"port": null,
		"path": BillsPath,
		"headers": {
			"cache-control": "no-cache",
			"postman-token": "4e556cc8-1592-3ae4-3e32-668e2f90b212"
		}
};

//var accountMap = new Map();
var billInfo = [];
var req = http.request(options, function (res) {
	var chunks = [];

	res.on("data", function (chunk) {
		chunks.push(chunk);
	});

	res.on("end", function () {
		var body = Buffer.concat(chunks);
		var bodyString = body.toString();
		billInfo = bodyString.split(",");
		// console.log(accountInfo);
		for(var k = 8; k < billInfo.length; k = k + 10){
			var j = k + 4;
				var billTime = billInfo[k].split("\"")[2];
				billMonth = billTime.split("-")[1];
				
				billAmount = billInfo[k].split("\"")[2];
				billAmount = parseInt(bill);
				billAmount = billInfo[j].split("\"")[2];
				billAmount = billFloat(billAmount);
				billPay[j] = billAmount;
			
			billAmount = billInfo[k].split("\"")[2];
			billAmount = parseInt(billAmount);
			billInfo.push(billAmount);
		}
		// Since accountInfo has all the pertinent data inside this request, this console.log call works 
		// correctly while the other doesn't.
		console.log(billInfo);
		tempInfo2(billInfo);
	});
});
req.end();

function tempInfo2(tInfo) {
	billInfo = tInfo;
	console.log(tInfo);

	console.log(billInfo);

}
// LOANS
// A slight modification on bills, this puts the value for every loan into an array whose last entry
// is the credit score of the user. I can add functionality for parsing different types of loans
// (auto, home, small business), but it does not exist yet.
var options = {
		"method": "GET",
		"hostname": "api.reimaginebanking.com",
		"port": null,
		"path": LoansPath,
		"headers": {
			"cache-control": "no-cache",
			"postman-token": "4e556cc8-1592-3ae4-3e32-668e2f90b212"
		}
};

var creditScore = 0;
var loans = [];
var req = http.request(options, function (res) {
	var chunks = [];

	res.on("data", function (chunk) {
		chunks.push(chunk);
	});

	res.on("end", function () {
		var body = Buffer.concat(chunks);
		var bodyString = body.toString();
		loanInfo = bodyString.split(",");
		// console.log(accountInfo);
		for(var k = 5; k < loanInfo.length; k = k + 8){
			var loanTime = loanInfo[k].split("\"")[2];
			loanMonth = loanTime.split("-")[1];
			var j = k + 4;
			loanAmount = loanInfo[k].split("\"")[2];
			loanAmount = parseInt(loanAmount);
			loanAmount = loanInfo[j].split("\"")[2];
			loanAmount = loanFloat(billAmount);
			loanPay[j] = loanAmount;
			loans.push(loanAmount);
		}
		creditScore = parseInt(loanInfo[4].split(":"));
		loans.push(creditScore);
		// Since accountInfo has all the pertinent data inside this request, this console.log call works 
		// correctly while the other doesn't.
		console.log(loans);
		tempInfo3(loanInfo);
	});
});
req.end();

function tempInfo3(tInfo) {
	loanInfo = tInfo;
	console.log(tInfo);
	// Note that the last element of loans is the credit score
	console.log(loans);

}
// DEPOSITS AND WITHDRAWALS
// The user's deposit history should only be set to the past year and ordered, so that it can be parsed
// accordingly. The withdrawals are subtracted from deposits and p2p transactions to get the monthly
// net deposit. If any part of the code does something weird it will probably be this one.
var options = {
		"method": "GET",
		"hostname": "api.reimaginebanking.com",
		"port": null,
		"path": DepositsPath,
		"headers": {
			"cache-control": "no-cache",
			"postman-token": "4e556cc8-1592-3ae4-3e32-668e2f90b212"
		}
};

//var accountMap = new Map();
var depositData = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
var req = http.request(options, function (res) {
	var chunks = [];

	res.on("data", function (chunk) {
		chunks.push(chunk);
	});

	res.on("end", function () {
		var body = Buffer.concat(chunks);
		var bodyString = body.toString();
		depositInfo = bodyString.split(",");
		// console.log(accountInfo);
		for(var k = 2; k < depositInfo; k = k + 8){
		var depositTime = depositInfo[k].split("\"")[2];
		depositMonth = depositTime.split("-")[1];
		var j = k + 4;
			depositAmount = depositInfo[j].split("\"")[2];
			depositAmount = parseFloat(billAmount);
			if(depositInfo[k-1] == "withdrawal"){
			depositData[depositMonth] = depositData[depositMonth] - deposit;
			}
			else{
				depositData[depositMonth] = depositData[depositMonth] + deposit;
			}
		}
		// Since accountInfo has all the pertinent data inside this request, this console.log call works 
		// correctly while the other doesn't.
		console.log(depositData);
		tempInfo4(depositInfo);
	});
});
req.end();

function tempInfo4(tInfo) {
	depositInfo = tInfo;
	console.log(tInfo);

	console.log(depositData);

}
http.createServer(function (request, response) {
    response.writeHead(200, {
        'Content-Type': 'text/plain',
        'Access-Control-Allow-Origin' : '*'
    });
    response.end('Hello World\n');
}).listen(8080);



var inincome = document.getElementById("incomeDescInput").value;
var income = parseDouble(inincome)/12.0;
var dd = document.getElementById("userMonthInput").value;
var d = parseInt(dd);
var netDep = 0;
for(var q = 0; q < depositData.length; q++){
	if(d === q){
		netDep = depositData[q];
		break;
	}
}
var loanMon = 0;
var billMon = 0;
for(var q = 0; q < loanPay; q++){
	if(d === q){
		loanMon = loanPay[q];
		break;
	}
}
for(var q = 0; q < billMon.length; q++){
	if(d === q){
		billMon = billPay[q];
		break;
	}
}
var expenses = billMon + loanMon;
var threshold = netDep + income - expenses;



	//Checks to see if file is the right file to use for following calculation
$.ajax({
		  url: 'fixedincome.csv',
		  dataType: 'text',
		}).done(successFunction);
	//This Function cpmverted the CSV file into an HTML table that can be iterated through
var tab = $.get('/.settings/fixedincome.csv', function(data) {
	var build = '<table border="1" cellpadding="2" cellspacing="0" style="border-collapse: collapse" width="100%">\n';
	var head = data.split("\n");
	for(var i=0;i<1;i++){
	build += "<tr><th>" + head[i] + "</th></tr>";
	for(var i=1;i<head.length;i++){
	build += "<tr><td>" + head[i].split("\n") + "</td></tr>";
	}
	}
	build += "</table>";
	$('#wrap').append(build);
	});
	//Stores previous, unadded state of income
var incomeStore = 0;
	//This function adds the value of the MINiMUM increased income that can be possible given the threshold


	
function addToIncome(){
		incomeStore = income;
		for (var i = 0, row; row = tab.rows[i]; i++) {
			   //iterate through rows
			   //rows would be accessed using the "row" variable assigned in the for loop
			
			   for (var j = 0, col; col = row.cells[j]; j++) {
			     //iterate through columns
			     //columns would be accessed using the "col" variable assigned in the for loop
				   if(col === threshold){
					   income += col;
					   break;
				   }
			   }  
			   if(incomeStore !== income){
				   break;
			   }
			}
		return income;
	
	}
	
	


const app = document.getElementById('root');

const container = document.createElement('div');
container.setAttribute('class', 'container');

var mstIndCatID=10003;
var request = new XMLHttpRequest();
request.open('POST', 'http://imescustomerapi.evalai.com/api/StaticData/GetIndustryNames', true);
request.onload = function () {

  // Begin accessing JSON data here
  var data = JSON.parse(this.response);
	console.log(data);
}

request.send();
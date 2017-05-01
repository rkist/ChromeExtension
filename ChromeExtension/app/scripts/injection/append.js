//msg must be set before script exec

var p = document.createElement('p');
var node = document.createTextNode(msg);
p.appendChild(node);

var element = document.getElementById('status');
element.appendChild(p);


msg

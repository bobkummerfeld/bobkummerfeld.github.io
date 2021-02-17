
var eBookdata = {}
eBookdata.EBlogin = "bob";
eBookdata.EBtopic = "eBook";

for (x in eBookdata)
{
	localStorage.setItem(x, eBookdata[x]);
}

console.log("eBook Starting....");
// Create a client instance
client = new Paho.MQTT.Client("192.168.87.29", 1884, "/", "");

// set callback handlers
client.onConnectionLost = onConnectionLost;
client.onMessageArrived = onMessageArrived;

// connect the client
client.connect({onSuccess:onConnect, useSSL: false, userName:"bob", password:"mqtt-red-node"});

// called when the client connects
function onConnect() {
  // Once a connection has been made, make a subscription and send a message.
  console.log("onConnect");
  client.subscribe("eBook");
  message = new Paho.MQTT.Message("eBook starting....");
  message.destinationName = "eBook";
  client.send(message);
}

// called when the client loses its connection
function onConnectionLost(responseObject) {
  if (responseObject.errorCode !== 0) {
    console.log("onConnectionLost:"+responseObject.errorMessage);
  }
}

// called when a message arrives
function onMessageArrived(message) {
  console.log("onMessageArrived:"+message.payloadString);
}

function checkans(qid)
{
        var ansid = qid+"-answers";
        var ansval = document.getElementById(qid).value;
        var fbackid = qid+"-feedback";
        var ansobj = JSON.parse(document.getElementById(ansid).innerHTML);

        for (ans in ansobj)
        {
                rx = ansobj[ans].regex;
                if (rx == "x") // x means nothing matches
                {
                        document.getElementById(fbackid).innerHTML = ansobj[ans].feedback;
                        return ansobj[ans].result;
                }

                if (ansval.indexOf(rx) == 0)
                {
                        document.getElementById(fbackid).innerHTML = ansobj[ans].feedback;
                        return ansobj[ans].result;
                }
        }
        document.getElementById(fbackid).innerHTML = "Not correct";
	return ansobj[ans].result;
}


function sendfitb(ansid)
{
  var msg = {
		login: localStorage.getItem("EBlogin"),
		qid: ansid, 
		compname: document.getElementById(ansid).getAttribute("data-component"), 
		value: document.getElementById(ansid).value,
		result: checkans(ansid)
            };
  var msgJSON = JSON.stringify(msg);
  message = new Paho.MQTT.Message(msgJSON);
  message.destinationName = eBookdata.EBtopic;
  client.send(message);
}

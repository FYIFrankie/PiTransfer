var app = require('http').createServer(handler)
  , io = require('socket.io').listen(app)
  , fs = require('fs')
  , Files = {}
  , url = require("url")

app.listen(8080)
 
function handler (req, res) {
    var pathname = url.parse(req.url).pathname;
    console.log("Request for " + pathname + " received.");

    res.writeHead(200);

    if(pathname == "/") {
        html = fs.readFileSync("index.html", "utf8");
        res.write(html);
    } else if (pathname == "/client.js") {
        script = fs.readFileSync("client.js", "utf8");
        res.write(script);
    }


    res.end();
}
 
io.sockets.on('connection', function (socket) {
    socket.on('SendText', function (data) {
        console.log(data['Text'])
    })
    socket.on('Start', function (data) { 
        console.log("Initiating transfer of file " + data['Name'])
        var Name = data['Name']
        Files[Name] = { 
            FileSize : data['Size'],
            Data     : "",
            Downloaded : 0
        }
        var Place = 0
        try {
            var Stat = fs.statSync('Temp/' +  Name)
            if(Stat.isFile()) {
                console.log("File is already in folder")
                Files[Name]['Downloaded'] = Stat.size
                Place = Stat.size / 524288
            }
        }
        catch(er){} //It's a New File
        fs.open('Temp/' + Name, "a", 0755, function(err, fd){
            if(err) {
                console.log("It is an Error")
                console.log(err)
            }
            else {
                Files[Name]['Handler'] = fd //We store the file handler so we can write to it later
                socket.emit('MoreData', { 'Place' : Place})
            }
        })
    })

    socket.on('Upload', function (data){
        var Name = data['Name']
        Files[Name]['Downloaded'] += data['Data'].length
        Files[Name]['Data'] += data['Data']
        if(Files[Name]['Downloaded'] == Files[Name]['FileSize']) {
            console.log("About to write data")
            fs.write(Files[Name]['Handler'], Files[Name]['Data'], null, 'Binary', function(err, Writen){
            })
            console.log("Completed transfer of file " + data['Name'])
        }
        else if(Files[Name]['Data'].length > 10485760) { //If the Data Buffer reaches 10MB
            console.log("Going to write and then clear the buffer")
            fs.write(Files[Name]['Handler'], Files[Name]['Data'], null, 'Binary', function(err, Writen){
                Files[Name]['Data'] = "" //Reset The Buffer
                var Place = Files[Name]['Downloaded'] / 524288
                socket.emit('MoreData', { 'Place' : Place})
            })
        }
        else
        {
            var Place = Files[Name]['Downloaded'] / 524288
            socket.emit('MoreData', { 'Place' : Place})
        }
    })
})
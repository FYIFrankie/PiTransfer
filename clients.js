window.addEventListener("load", Ready)


function Ready(){ 

    if(window.File && window.FileReader){
        document.getElementById('UploadButton').addEventListener('click', StartUpload)

        document.getElementById('FileBox').addEventListener('change', FileChosen)
    }
    else
    {
        document.getElementById('UploadArea').innerHTML = "Your Browser Doesn't Support The File API Please Update Your Browser"
    }
}
var socket = io.connect('192.168.22.128:8080')
	, fReader
	, name
	, selectedFile


function FileChosen(evnt) {
    selectedFile = evnt.target.files[0]
    console.log(selectedFile)
    document.getElementById('NameBox').value = selectedFile.name
}

function StartUpload(){

    if(document.getElementById('FileBox').value != "") {
        fReader = new FileReader()
        name = document.getElementById('NameBox').value
        fReader.onload = function(evnt){
            socket.emit('Upload', { 'Name' : name, Data : evnt.target.result })
        }
        console.log("About to send Start")
        socket.emit('Start', { 'Name' : name, 'Size' : selectedFile.size })
    }
    else if (document.getElementById('TextBox').value != "") {
        text = document.getElementById('TextBox').value
        socket.emit('SendText', {'Text' : text })
    }
    else {
        alert("Please Select A File or add text to pass")
    }
}

socket.on('MoreData', function (data){
    var Place = data['Place'] * 524288 //The Next Blocks Starting Position
    var NewFile //The Variable that will hold the new Block of Data

    if(selectedFile.webkitSlice) {
        NewFile = selectedFile.webkitSlice(Place, Place + Math.min(524288, (selectedFile.size-Place)))
    }
    else {
        NewFile = selectedFile.slice(Place, Place + Math.min(524288, (selectedFile.size-Place)))
    }
    fReader.readAsBinaryString(NewFile)
})
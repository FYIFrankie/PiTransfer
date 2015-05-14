PiTransfer
==========

Node.js sever which allows clients to send files and text to server. This is a mini project to learn about Node.js and it's features along with socket.io. It's original goal was to send files around a network of raspberry pies easily.

# Run

First Edit the IP addresses to your local IP the client.js line 16 and index.html line 2

Then to run the server, run
$ node app.js

The server is run on port 8080 so to test naviagate to

http://localhost:8080 and try to upload a file!


If a client connects and sends text, it will show up in the console that the server is running on. If they upload a file, the file will reside in the Temp folder which is located in the dirtory that app.js is being run from.

# To-do

Hoping to improve the website, and add more features by learning more about what Node can do

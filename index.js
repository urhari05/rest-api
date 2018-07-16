//import { StringDecoder } from 'string_decoder';

const http = require('http');
const url = require('url');
const {StringDecoder} = require('string_decoder');

const server = http.createServer(function(req, res){
    const parsedUrl = url.parse(req.url, true);
    let path = parsedUrl.pathname;
    const trimmedPath = path.replace(/^\/+|\/+$/g, '');

    //Get the query string as an obect
    const queryStringObject = parsedUrl.query;

    //Get the htp mehod
    const method = req.method.toLowerCase();

    //Get The headers object
    const headers = req.headers;

    //Get the payload
    const decoder = new StringDecoder('utf-8');
    var buffer = '';
    req.on('data', function(data){
        buffer += decoder.write(data);
    });

    req.on('end', function(){
        buffer += decoder.end();

        // log the request
        res.end('hello world\n');
        console.log('Request received with payload', buffer);
    });

});

server.listen(3001, function(){
    console.log('server is listening to port 3001 now');
});
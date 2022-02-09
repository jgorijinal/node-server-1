import * as http from 'http';
import {IncomingMessage, ServerResponse} from 'http';
import * as p from 'path';
import * as fs from 'fs';
import * as url from 'url';

const server = http.createServer();
const publicDir = p.resolve(__dirname, 'public');
server.on('request', (request: IncomingMessage, response: ServerResponse) => {
  const {method, url: path, headers} = request;

  if(method !== 'GET'){
    response.statusCode = 405
    response.end()
    return
  }
  console.log(path)
  const object = url.parse(path)
  const {pathname, search} = object
  console.log(pathname)
  let filename = pathname.substr(1)
  if(filename == ''){
    filename = 'index.html'
  }
  // response.setHeader('Content-Type','text/html;charset=utf-8')
  fs.readFile(p.resolve(publicDir, filename), (error, data) => {
    if (error){
      if(error.errno === -4058) {
        response.statusCode = 404
        fs.readFile(p.resolve(publicDir,'404.html'),(error,data)=>{
          response.end(data)
        })
      }else if(error.errno === -4068){
        response.statusCode = 403
          response.end('你无权限查看目录')
      }else {
        response.statusCode = 500
        response.end()
      }
    }else {
      response.setHeader('Cache-Control','public, max-age=31536000')
      response.end(data)
    }
  })
  ;
})
server.listen(8888);


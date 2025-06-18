const http = require('http');

function testEdit() {
  const data = 'titulo=Teste Simple&autor=Autor Simple&status=lido';
  
  const options = {
    hostname: 'localhost',
    port: 3000,
    path: '/livros/editar/1',
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Content-Length': Buffer.byteLength(data)
    }
  };

  const req = http.request(options, (res) => {
    console.log(`Status: ${res.statusCode}`);
    console.log(`Headers: ${JSON.stringify(res.headers)}`);
    
    res.on('data', (chunk) => {
      console.log(`Body: ${chunk}`);
    });
    
    res.on('end', () => {
      console.log('Request completed');
    });
  });

  req.on('error', (e) => {
    console.error(`Problem with request: ${e.message}`);
  });

  req.write(data);
  req.end();
}

testEdit(); 
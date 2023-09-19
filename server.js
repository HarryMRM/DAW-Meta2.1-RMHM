const http = require('http');
const url = require('url');
const fs = require('fs');
const path = require('path');

const server = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url, true);
    // Carga el formulario en caso que se haya pedido la URL
    // indicada
    if (req.method === 'GET' && req.url == '/formulario') {
        const filePath = path.join(__dirname, 'formulario.html');
        fs.readFile(filePath, 'utf8', (err, data) => {
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(data);
        });
    // Servidor central, este es el apartado donde esta la central
    // de carga general, parsea los datos solicitados por el URL
    } else if (req.method === 'GET') {
        res.writeHead(200,{'Content-Type': 'text/html'});
        res.end(`
        <html>
        <head></head>
            <body>
                <h2>Request headers:</h2>
                <pre>${JSON.stringify(req.headers, null, 4)}</pre>
                <h2>Metodo: GET</h2> 
                <h2>Respuesta</h2> 
                <h2>URL: ${parsedUrl.href}</h2>
            </body>
        </html>
        `);
    // Atiende al servicio POST, este acude al llamado de la
    // solicitud de el formulario.
    } else if (req.method === 'POST' && req.url == '/') {
        let body = '';
        req.on('data', (chunk) => {
            body += chunk;
        });
        req.on('end', () => {
            res.statusCode = 200;
            const datos = decodeURIComponent(body);
            res.writeHead(200,{'Content-Type': 'text/html'});
            res.end(`
                <html>
                <head></head>
                <body>
                    <h2>Request headers:</h2>
                    <pre>${JSON.stringify(req.headers, null, 4)}</pre>
                    <h2>Metodo: POST</h2> 
                    <h2>Respuesta</h2> 
                    <h2>URL: ${parsedUrl.href}</h2>
                    <h3>Datos enviados: ${body}</h3>
                </body>
                </html>
            `);
        });
    }else {
        // Metodo http no implementado
        res.statusCode = 405; // No permitido
        res.setHeader('Content-Type', 'text/plain');
        res.end('Error 405\n');
    }
});

// Configuracion del puerto del servidor
const puerto = 3000;
const direccion = 'localhost';
server.listen(puerto, direccion, () => {
    console.log(`Servidor en ejecución en http://${direccion}:${puerto}/`);
});
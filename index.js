const cors = require('cors')
const express = require('express')
const routes = require('./src/routes')
const app = express()
const bodyParser = require('body-parser');
const port = process.env.PORT || 3000;

app.use(cors())
function _serverConfigurate() {
    const configuredBodyParser = bodyParser.urlencoded({
        limit: '50mb',
        extended: true
    });
    app.use(express.json());
    app.use(express.urlencoded({extended: true}));
    app.use(configuredBodyParser)
}

async function _loadRoutes() {
    await routes.start();
    routes.routes.forEach((route) => {
        app.use(route);
    });
}

async function _initiateServer() {
    _serverConfigurate()
    app.listen(port) //Aqui é onde inicia o servidor
    await _loadRoutes()
    console.log('--------------------------SERVIDOR INICIADO-------------------------------')
}

_initiateServer()
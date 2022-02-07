"use strict";
const fs = require ('fs');
const path = require('path');
const asyncHandler = require('express-async-handler');
const routes = [];


const createRoutes = asyncHandler(async () => {
    fs.readdirSync(__dirname).filter(function(file) {
        return (file.indexOf(".") !== 0) && (file !== "index.js" && (file !== "view_validators"));
    }).forEach((function (file) {
        const viewArchive = (path.join(__dirname, file));
        const routerFunction = require(viewArchive);
        routes.push(routerFunction);
    }))
});



const router ={
    start:createRoutes,
    routes:routes
}


module.exports = router;
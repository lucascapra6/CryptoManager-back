const router = require('express')();
const asyncHandler = require('express-async-handler');
const {handle} = require("express/lib/router");
const database = require("../databaseClass")

const cadastrarWhitelist = asyncHandler(async (req, res) => {
    const token = req.body.token
    const dataInicio = req.body.data_inicio
    const dataFinal = req.body.data_final
    database.cadastrarWhitelist(token, dataInicio, dataFinal)
    res.json({token:token, dataInicio:dataInicio, dataFinal:dataFinal})
})

const getWhitelists = asyncHandler(async(req, res) => {
    const response = await database.getWhitelists()
    res.json(response)
})

const alterarDatafinal = asyncHandler(async (req, res) => {
    const id = req.body.id
    const dataFinal = req.body.data_final
    await database.atualizarDataFinal(id, dataFinal)
    res.json({id: id, dataFinal:dataFinal})
})

router.get('/whitelists', getWhitelists)
router.post('/cadastrarWhitelist', cadastrarWhitelist)
router.put('/alterarDataFinal', alterarDatafinal)

module.exports = router
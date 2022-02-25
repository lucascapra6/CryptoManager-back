const router = require('express')();
const asyncHandler = require('express-async-handler');
const {handle} = require("express/lib/router");
const database = require("../databaseClass")
const gerenciadorDeJogos = require("../business")

const sayHello = asyncHandler(async (req, res) => {
    const response = 'Hello World'
    res.json(response)
})

const getJogos = asyncHandler(async (req, res) => {
    const response = await database.getJogos()
    res.json(response)
})
const cadastrarJogo = asyncHandler(async (req, res) => {
    const jogo = req.body.jogo
    const enderecoToken = req.body.enderecoToken
    const qtdTokensAdquiridos = req.body.qtdTokensAdquiridos
    const precoMedio = req.body.precoMedio
    const investimento = gerenciadorDeJogos.calcularInvestimento(qtdTokensAdquiridos, precoMedio)
    const tokensMediaDiaria = req.body.mediaTokensFarmDia
    await database.cadastrarJogo(jogo, enderecoToken, qtdTokensAdquiridos, precoMedio, investimento,tokensMediaDiaria)
    res.json({jogo: enderecoToken, investimento: qtdTokensAdquiridos, precoMedio: precoMedio})
})
const deletarJogo = asyncHandler(async (req, res) => {
    const id = req.body.id
    database.deletarJogo(id)
    res.json({idJogoDeletado: id})
})
const atualizarPrecoMedio = asyncHandler(async (req, res) => {
    const id = req.body.id
    const precoMedioAtualizado = req.body.precoMedioAtualizado
    const tokensAdquiridos = await database.getQtdTokensAdquiridos(id)
    const totalLiquidado = await database.getTotalLiquidadoAtual(id)
    const investimento = gerenciadorDeJogos.calcularInvestimento(tokensAdquiridos, precoMedioAtualizado)
    const profitAtualizado = gerenciadorDeJogos.calcularProfit(investimento, totalLiquidado)
    await database.setProfit(id, profitAtualizado)
    await database.setInvestimento(id, investimento)
    await database.setNovoPrecoMedio(id, precoMedioAtualizado)
    res.json({investimento: investimento, precoMedioAtualizado: precoMedioAtualizado})
})

//adiciona a qtd de tokens farmados/dia na carteira
const atualizarBalanco = asyncHandler(async (req, res) => {
    const id = req.body.id
    const tokensFarmados = req.body.tokensFarmados
    await database.setDataNullTo0('tokens_farmados', id)
    await database.setTokensFarmadosNoDia(id, tokensFarmados)
    res.json({id: id, tokensFarmados: tokensFarmados})
})

//calcula a quantidade de tokens disponíveis na carteira do usuário de acordo com a cotação atual para chegar num valor total.
const setTotalEmCarteira = asyncHandler(async (req, res) => {
    const id = req.body.id
    const tokensFarmados = req.body.tokensFarmados
    const cotacaoAtual = req.body.cotacaoAtual
    const totalEmCarteira = gerenciadorDeJogos.calcularTotalEmCarteira(tokensFarmados, cotacaoAtual)
    await database.setTotalCarteira(id, totalEmCarteira)
    res.json({totalEmCarteira:totalEmCarteira})
})

//calcula o quanto o usuário já definitivamente vendeu de seus tokens, o que irá determinar seu profit
const setTotalLiquidado = asyncHandler(async (req, res) => {
    const id = req.body.id
    const totalLiquidadoAtual = await database.getTotalLiquidadoAtual(id)
    const totalCarteira = await database.getTotalCarteira(id)
    const totalLiquidado = gerenciadorDeJogos.calcularTotalLiquidado(totalLiquidadoAtual, totalCarteira)
    database.setTotalLiquidado(id, totalLiquidado)
    database.resetTotalCarteira(id)
    database.resetTokensFarmados(id)
    res.json({totalLiquidado: totalLiquidado})
})
const setCotacaoAtual = asyncHandler(async (req, res) => {
    const id = req.body.id
    const cotacaoToken = req.body.cotacaoToken
    _cotacaoAtualTokens.push({id: id, cotacaoToken: cotacaoToken})
    res.json({id: id, cotacaoToken: cotacaoToken})
})

//Profit obtido de acordo com o total liquidado (obs: total em carteira não conta como profit)
const setProfit = asyncHandler(async (req, res) => {
    const id = req.body.id
    const totalLiquidado = await database.getTotalLiquidadoAtual(id)
    const investimento = await database.getInvestimento(id)
    const profit = gerenciadorDeJogos.calcularProfit(investimento, totalLiquidado)
    await database.setProfit(id, profit)
    res.json({profit: profit})
})

//Return of investiment: Em quantos dias o usuário terá o investimento de volta de acordo com a cotação atual
const setRoi = asyncHandler(async (req, res) => {
    //coletar informações, fazer o cálculo do roi, enviar para o banco de dados e puxar na API jogos
    const id = req.body.id
    const investimento = req.body.investimento
    const totalMaximo = req.body.totalMaximo
    const cotacaoAtual = req.body.cotacaoAtual
    const mediaTokensFarmadosDia = req.body.mediaTokensFarmadosDia
    //Pega o farm diario de tokens gravados pela primeira vez e ao editar
    const roi = gerenciadorDeJogos.calcularROI(investimento, cotacaoAtual, mediaTokensFarmadosDia, totalMaximo)
    await database.setTokensFarmMediaDiaria(id, mediaTokensFarmadosDia)
    database.setRoi(id, roi)
    res.json({id: id, roi: roi})
})

//essencial para recalcular o ROI em virtude da mudança constante de preços dos ativos.
const recalcularRoi = asyncHandler(async (req, res) => {
    //atualiza o roi sempre que atualizar a pagina
    const id = req.body.id
    const investimento = req.body.investimento
    const totalMaximo = req.body.totalMaximo
    const cotacaoAtual = req.body.cotacaoAtual
    const carregarTokensFarmadosDia = req.body.tokensMediaDiaria
    const roi = gerenciadorDeJogos.calcularROI(investimento, cotacaoAtual, carregarTokensFarmadosDia, totalMaximo)
    database.setRoi(id, roi)
    res.json({id: id, roi: roi})
})

router.get('/', sayHello)
router.get('/jogos', getJogos)
router.post('/cadastrarJogo', cadastrarJogo)
router.put('/atualizarBalanco', atualizarBalanco)
router.put('/totalEmCarteira', setTotalEmCarteira)
router.put('/liquidar', setTotalLiquidado)
router.put('/cotacaoAtual', setCotacaoAtual)
router.post('/deletarJogo', deletarJogo)
router.put('/profit', setProfit)
router.put('/atualizarPrecoMedio', atualizarPrecoMedio)
router.put('/calculaRoi', setRoi)
router.put('/recalcularRoi', recalcularRoi)


module.exports = router
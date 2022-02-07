class GerenciadorDeJogos {
    calcularInvestimento(tokensAdquiridos, precoMedio) {
       const investimento = tokensAdquiridos * precoMedio
        return Number(investimento).toFixed(2)
    }
    calcularTotalEmCarteira(tokensFarmados, cotacaoAtual) {
        const totalEmCarteira = tokensFarmados * cotacaoAtual
        return Number(totalEmCarteira.toFixed(2))
    }

    calcularTotalLiquidado(totalLiquidadoAtual, totalCarteira) {
        const totalLiquidado = Number(totalLiquidadoAtual) + Number(totalCarteira)
        return Number(totalLiquidado).toFixed(2)
    }

    calcularProfit(investimento, totalLiquidado) {
        const profit = totalLiquidado - investimento
        return Number(profit).toFixed(2)
    }
    calcularROI(investimento, cotacaoAtual,mediaTokensFarmadosDia, totalMaximoEmCarteira ) {
        const valorFarmMedioDiarioAdquirido = cotacaoAtual * mediaTokensFarmadosDia
        let ROI = (investimento - totalMaximoEmCarteira) / valorFarmMedioDiarioAdquirido
        if(ROI  === Infinity) ROI = 0
        return Number(ROI).toFixed(1)
    }
}

module.exports = new GerenciadorDeJogos
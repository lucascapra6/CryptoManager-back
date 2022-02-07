const Client = require('pg').Client
const bancoConection = new Client({
    user: "postgres",
    password: "Doboldo123",
    host: "localhost",
    port: "8080",
    database: "gerenciamento-jogos-nft"
})

class DatabaseClass {
    constructor() {
        bancoConection.connect().then(() => {
            console.log('Conectado ao banco de dados')
        })
    }

    async cadastrarJogo(jogo, enderecoToken, qtdTokensAdquiridos, precoMedio, investimento, tokensMediaDiaria) {
        try {
            await bancoConection.query(`insert into jogos(jogo, endereco_token, qtd_tokens_adquiridos, preco_medio, investimento, tokens_media_diaria) values('${jogo}','${enderecoToken}', ${qtdTokensAdquiridos}, ${Number(precoMedio).toFixed(3)}, ${investimento}, ${tokensMediaDiaria})`)
        } catch (ex) {
            console.log(`Ocorreu um erro. Erro: ${ex}`)
        }
    }

//////////////////////////////////////////////////GETTERS//////////////////////////////////////////////
    async getJogos() {
        try {
            const resultado = await bancoConection.query("select * from jogos")
            return resultado.rows
        } catch (ex) {
            console.log(ex)
        }
    }

    async getTotalLiquidadoAtual(id) {
        try {
            const resultado = await bancoConection.query(`select total_liquidado from jogos where id = ${id}`)
            return resultado.rows[0].total_liquidado
        } catch (e) {
            console.log(e)
        }
    }

    async getInvestimento(id) {
        try {
            const resultado = await bancoConection.query(`select investimento from jogos where id = ${id}`)
            return resultado.rows[0].investimento
        } catch (e) {
            console.log(e)
        }
    }

    async getTotalCarteira(id) {
        try {
            const resultado = await bancoConection.query(`select total_carteira from jogos where id = ${id}`)
            return resultado.rows[0].total_carteira
        } catch (e) {
            console.log(e)
        }
    }

    async getTokensFarmadosTotal(id) {
        try {
            const resultado = await bancoConection.query(`select tokens_farmados from jogos where id = ${id}`)
            return resultado.rows[0].tokens_farmados
        } catch (ex) {
            console.log(ex)
        }
    }

    async getQtdTokensAdquiridos(id) {
        try {
            const resultado = await bancoConection.query(`select qtd_tokens_adquiridos from jogos where id = ${id}`)
            return resultado.rows[0].qtd_tokens_adquiridos
        } catch (ex) {
            console.log(ex)
        }
    }

    //////////////////////////////////////////////////SETTERS//////////////////////////////////////////////
    setProfit(id, profit) {
        try {
            bancoConection.query(`update jogos set profit = ${profit} where id = ${id}`)
        } catch (e) {
            console.log(e)
        }
    }

    async setTokensFarmadosNoDia(id, tokensFarmados) {
        try {
            await bancoConection.query(`update jogos set tokens_farmados = tokens_farmados + ${tokensFarmados} where id = ${id}`)
        } catch (ex) {
            console.log(ex)
        }
    }

    async setTotalCarteira(id, totalCarteira) {
        try {
            await bancoConection.query(`update jogos set total_carteira = ${totalCarteira} where id = ${id}`)
        } catch (ex) {
            console.log(ex)
        }
    }

    async setTotalLiquidado(id, totalLiquidado) {
        try {
            await bancoConection.query(`update jogos set total_liquidado = ${totalLiquidado} where id = ${id}`)
        } catch (ex) {
            console.log(ex)
        }
    }

    async setInvestimento(id, investimento) {
        try {
            await bancoConection.query(`update jogos set investimento = ${investimento} where id = ${id}`)
        } catch (e) {
            console.log(e)
        }
    }

    async setNovoPrecoMedio(id, precoMedio) {
        try {
            await bancoConection.query(`update jogos set preco_medio = ${precoMedio} where id = ${id}`)
        } catch (e) {
            console.log(e)
        }
    }

    async setRoi(id, roi) {
        try {
            await bancoConection.query(`update jogos set roi = ${roi} where id = ${id}`)
        } catch (e) {
            console.log(e)
        }
    }

    async setTokensFarmMediaDiaria(id, tokensMediaDiaria) {
        try {
            await bancoConection.query(`update jogos set tokens_media_diaria = ${tokensMediaDiaria} where id = ${id}`)
        } catch (e) {
            console.log(e)
        }
    }


    async setDataNullTo0(dataName, id) {
        const data = await bancoConection.query(`select ${dataName} from jogos where id = ${id}`)
        const response = await data.rows[0][dataName]
        if (response === null) {
            return await bancoConection.query(`update jogos set ${dataName} = 0 where id = ${id}`)
        }
    }


//////////////////////////////////////////////////DELETES/RESETS//////////////////////////////////////////////
    async deletarJogo(id) {
        try {
            await bancoConection.query(`delete from jogos where id = ${id}`)
        } catch (e) {
            console.log(e)
        }
    }

    async resetTotalCarteira(id) {
        try {
            await bancoConection.query(`update jogos set total_carteira = 0 where id = ${id}`)
        } catch (ex) {
            console.log(ex)
        }
    }

    async resetTokensFarmados(id) {
        try {
            await bancoConection.query(`update jogos set tokens_farmados = 0 where id = ${id}`)
        } catch (ex) {
            console.log(ex)
        }
    }

    //////////////////////////////////////////////////WHITELISTS/////////////////////////////////////////
    async getWhitelists() {
       const resultado = await bancoConection.query('select * from whitelists')
        return resultado.rows
    }

    async cadastrarWhitelist(token, dataInicio, dataFinal) {
        try {
            await bancoConection.query(`insert into whitelists(token_nome, data_inicio, data_final) values('${token}', '${dataInicio}', '${dataFinal}')`)
        } catch (e) {
            console.log(e)
        }
    }

    async atualizarDataFinal(id, dataFinal) {
        try {
            await bancoConection.query(`update whitelists set data_final = '${dataFinal}' where id = ${id}`)
        } catch (e) {
            console.log(e)
        }
    }
    async deletarWhitelist(id) {
        try {
            await bancoConection.query(`delete from whitelists where id = ${id}`)
        } catch (e) {
            console.log(e)
        }
    }

}

module.exports = new DatabaseClass()
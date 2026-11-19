// npm init
// npm i mysql2

// npm i dotenv
const dotenv = require("dotenv")
dotenv.config()

// npm i express
const express = require('express')
const app = express()
const port = process.env.API_PORT

app.use(express.json())

const db = require('./db')

// npm i bcrypt
const bcrypt = require('bcrypt')

// npm i jsonwebtoken
const jwt = require("jsonwebtoken")

// npm i cors
const cors = require("cors")
app.use(cors())

const path = require("path")
app.use("/img", express.static(path.join(__dirname, 'img')))

app.post("/cliente", async (req, res) => {
    try {
        const cliente = req.body
        const senhaCript = bcrypt.hashSync(cliente.senha, 10)
        cliente.senha = senhaCript

        const [resultado] = await db.pool.query(
            `INSERT INTO cliente(nome, cpf, celular, email, senha) VALUES (?, ?, ?, ?, ?)`,
            [cliente.nome, cliente.cpf, cliente.celular, cliente.email, cliente.senha]
        )
        
        res.status(201).json({
            mensagem: "Cliente cadastrado com sucesso!",
            id: resultado.insertId
        })
    } catch (error) {
        res.status(500).json({ erro: error.message })
    }
})

app.post("/login", async (req,res) => {
    try{
        const user = req.body
        const resultado = await db.pool.query(
             "SELECT id, nome, email, senha FROM cliente WHERE email = ?", [user.email]
        )
        const dados_db = resultado[0][0]
        if (!dados_db){
            return res.status(401).json({msg: "EMAIL não cadastrado"})
        }
        
        const senha_valida = await bcrypt.compare(user.senha, dados_db.senha)

        if(!senha_valida){
            return res.status(401).json({msg: "Credenciais inválidas"})
        }
         
        const payload = {
            id: dados_db.id,
            email: dados_db.email
        }
        const token = jwt.sign(payload, process.env.JWT_SECRET,{expiresIn: "3m" })
        return res.status(200).json({nome: dados_db.nome, token: token})

    } catch (error) {
        res.status(500).json({ erro: error.message })
    }
})

app.get("/cliente", async (req, res) => {
    try {
        const [clientes] = await db.pool.query("SELECT id, nome, cpf, celular, email FROM cliente")
        res.status(200).json(clientes)
    } catch (error) {
        res.status(500).json({ erro: error.message })
    }
})

app.get("/cliente/perfil",autenticar , async (req, res) => {
    try {
        const id = req.usuario.id
        const clientes = await db.pool.query("SELECT id, nome, cpf, celular, email FROM cliente WHERE id = ?", [id]);
        const perfil = clientes[0][0]
        res.status(200).json(perfil)
    } catch (err) {
        res.status(500).json({ erro: "ERRO INTERNO" });
        throw err;
    }
})

app.put("/cliente/:id", async (req, res) => {
    try {
        const { id } = req.params
        const cliente = req.body

        if (cliente.senha) {
            cliente.senha = bcrypt.hashSync(cliente.senha, 10)
        }

        const [linhas] = await db.pool.query("SELECT * FROM cliente WHERE id = ?", [id])
        if (linhas.length === 0) {
            return res.status(404).json({ mensagem: "Cliente não encontrado." })
        }

        const clienteAtual = linhas[0]

        const nome = cliente.nome || clienteAtual.nome
        const cpf = cliente.cpf || clienteAtual.cpf
        const celular = cliente.celular || clienteAtual.celular
        const email = cliente.email || clienteAtual.email
        const senha = cliente.senha || clienteAtual.senha

        await db.pool.query(
            `UPDATE cliente SET nome = ?, cpf = ?, celular = ?, email = ?, senha = ? WHERE id = ?`,
            [nome, cpf, celular, email, senha, id]
        )

        res.status(200).json({ mensagem: "Cliente atualizado com sucesso!" })
    } catch (error) {
        res.status(500).json({ erro: error.message })
    }
})

app.delete("/cliente/:id", async (req, res) => {
    try {
        const { id } = req.params
        const [resultado] = await db.pool.query("DELETE FROM cliente WHERE id = ?", [id])
        
        if (resultado.affectedRows === 0) {
            return res.status(404).json({ mensagem: "Cliente não encontrado." })
        }

        res.status(200).json({ mensagem: "Cliente excluído com sucesso!" })
    } catch (error) {
        res.status(500).json({ erro: error.message })
    }
})


app.get("/produto", async (req, res) => {
    try {
        let sql = "SELECT * FROM produto WHERE 1=1"
        const params = []
        const { busca, ordenacao } = req.query

        if (busca) {
            sql += " AND (nome LIKE ? OR descricao LIKE ?)"
            params.push(`%${busca}%`, `%${busca}%`)
        }

        if (ordenacao && !["menor preco", "maior preco", ""].includes(ordenacao)) {
            const mapa = {
                "controle":   "Controles",
                "teclado":    "Periféricos",
                "monitor":    "Monitores",
                "jogo":       "Jogos",
                "console":    "Consoles",
                "assinatura": "Assinaturas"
            }
            const cat = mapa[ordenacao.toLowerCase()] || ordenacao
            sql += " AND categoria LIKE ?"
            params.push(`%${cat}%`)
        }

        if (ordenacao === "maior preco") {
            sql += " ORDER BY preco DESC"
        } else if (ordenacao === "menor preco") {
            sql += " ORDER BY preco ASC"
        } else {
            sql += " ORDER BY nome ASC"
        }

        const [resultado] = await db.pool.query(sql, params)
        res.status(200).json(resultado)
    } catch (error) {
        res.status(500).json({ erro: error.message })
    }
})

app.get("/produto/:id", async (req, res) => {
    try {
        const id = req.params.id
        const resultado = await db.pool.query("SELECT * FROM produto WHERE id = ?", [id])
        const produto = resultado[0][0]
        res.status(200).json(produto)
    } catch (error) {
        res.status(500).json({erro: error.message})
    }
})

app.post("/compra", autenticar, async (req, res) => {
    const connection = await db.pool.getConnection()
    try {
        await connection.beginTransaction()

        const { itens, forma_pagamento } = req.body

        if (!itens || !Array.isArray(itens) || itens.length === 0) {
            return res.status(400).json({ erro: "Envie uma lista de produtos em 'itens'" })
        }

        let valorTotal = 0
        const itensValidados = []

        // Valida cada produto e calcula o total
        for (const item of itens) {
            const [produtos] = await connection.query(
                "SELECT id, preco FROM produto WHERE id = ?",
                [item.id_produto]
            )

            if (produtos.length === 0) {
                throw new Error(`Produto com id ${item.id_produto} não encontrado`)
            }

            const preco = Number(produtos[0].preco)
            const quantidade = Number(item.quantidade) || 1

            if (quantidade <= 0) {
                throw new Error(`Quantidade inválida para o produto ${item.id_produto}`)
            }

            valorTotal += preco * quantidade
            itensValidados.push({
                id_produto: produtos[0].id,
                quantidade,
                valor_unitario: preco
            })
        }

        // Insere a compra
        const [compraResult] = await connection.query(
            `INSERT INTO compra (id_cliente, forma_pagamento, valor_total)
             VALUES (?, ?, ?)`,
            [req.usuario.id, forma_pagamento || "Não informado", valorTotal]
        )

        const idCompra = compraResult.insertId

        // Insere os itens da compra
        for (const item of itensValidados) {
            await connection.query(
                `INSERT INTO item_compra (id_compra, id_produto, quantidade, valor_unitario)
                 VALUES (?, ?, ?, ?)`,
                [idCompra, item.id_produto, item.quantidade, item.valor_unitario]
            )
        }

        await connection.commit()

        res.status(201).json({
            mensagem: "Compra registrada com sucesso!",
            id_compra: idCompra,
            valor_total: valorTotal
        })
    } catch (error) {
        await connection.rollback()
        res.status(500).json({ erro: error.message })
    } finally {
        connection.release()
    }
})

// Lista todas as compras do usuário autenticado (com os itens)
app.get("/compras", autenticar, async (req, res) => {
    try {
        const [compras] = await db.pool.query(
            `SELECT id, data, forma_pagamento, valor_total
             FROM compra
             WHERE id_cliente = ?
             ORDER BY data DESC`,
            [req.usuario.id]
        )

        // Busca os itens de cada compra
        for (const compra of compras) {
            const [itens] = await db.pool.query(
                `SELECT 
                    ic.quantidade,
                    ic.valor_unitario,
                    p.id          AS id_produto,
                    p.nome,
                    p.caminho_img
                 FROM item_compra ic
                 JOIN produto p ON p.id = ic.id_produto
                 WHERE ic.id_compra = ?`,
                [compra.id]
            )
            compra.itens = itens
        }

        res.status(200).json(compras)
    } catch (error) {
        res.status(500).json({ erro: error.message })
    }
})

app.listen(port, () => {
    console.log('API rodando na porta ' + port)
})

function autenticar(req, res, next){
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    if (token == null){
        return res.status(401).json({erro: "Token não enviado, usar Authorization Bearer <token>"})
    }
    jwt.verify(token, process.env.JWT_SECRET, (err, usuario) => {
        if (err) return res.status(403).json({erro: "Token inválido"})
        req.usuario = usuario
        next()
    })   
}
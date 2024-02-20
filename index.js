const express = require('express')
const uuid = require('uuid')
const port = 3000
const app = express()

app.use(express.json())

const customer = []

const checkOrderId = (request, response, next) => {
    const { id } = request.params
    const index = customer.findIndex(order => order.id === id)

    if (index < 0) {
        return response.status(404).json({ message: "Order not found" })
    }

    request.orderIndex = index
    request.orderId = id

    next()
}

const allMethodAndURL = (request, response, next) => {
    const method = request.method
    const url = request.url

    console.log(` método: ${method} acionado, usando a  URL: ${url}`)

    next()
}

/* ROTA POST => Criar a informação */
app.post('/order', allMethodAndURL, (request, response) => {
    try {

        const { order, clientName, price, status } = request.body

        const NewClient = { id: uuid.v4(), order, clientName, price, status: "Em Preparação" }

        customer.push(NewClient)

        return response.status(201).json(NewClient)
    } catch (err) {
        return response.status(500).json({ error: err.message })
    } finally {
        console.log("Finished");
    }
})

/* ROTA GET => Buscar a informação */
app.get('/order', allMethodAndURL, (request, response) => {
    return response.status(200).json(customer)
})

/* ROTA ATUALIZAR PUT/PATCH  => alterar/atualizar a informação */
app.put('/order/:id', checkOrderId, allMethodAndURL, (request, response) => {
    const index = request.orderIndex
    const id = request.orderId
    const { order, clientName, price, status } = request.body
    const updatedOrder = { id: uuid.v4(), order, clientName, price, status: "Em Andamento" }

    customer[index] = updatedOrder

    return response.status(202).json(updatedOrder)
})

/* ROTA DELETE => Deletar a informação */
app.delete('/order/:id', checkOrderId, allMethodAndURL, (request, response) => {
    const index = request.orderIndex
    const id = request.orderId

    customer.splice(index, 1)
    return response.status(204).json(customer)
})

/* ROTA GET => buscar informação */
app.get('/order/:id', checkOrderId, allMethodAndURL, (request, response) => {
    const index = request.orderIndex

    return response.status(202).json(customer[index])
})

/* ROTA PUT/PATCH  => Alterar/atualizar a informação */
app.patch('/order/:id', checkOrderId, allMethodAndURL, (request, response) => {
    const index = request.orderIndex
    const id = request.orderId
    const newStatus = { ...customer[index], status: "Pedido Pronto" }

    customer[index] = newStatus

    return response.status(202).json(newStatus)
})

app.listen(port, () => {
    console.log(`🚀 Server started on ${port}🚀`);
});

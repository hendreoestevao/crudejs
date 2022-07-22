'use strict'

const openModal = () => document.getElementById('modal')
    .classList.add('active')

const closeModal = () => {
    clearFields()
    document.getElementById('modal').classList.remove('active')
}


const getLocalStorage = () => JSON.parse(localStorage.getItem('db_produto')) ?? []
const setLocalStorage = (dbproduto) => localStorage.setItem("db_produto", JSON.stringify(dbproduto))

// CRUD - create read update delete
const deleteproduto = (index) => {
    const dbproduto = readproduto()
    dbproduto.splice(index, 1)
    setLocalStorage(dbproduto)
}

const updateproduto = (index, produto) => {
    const dbproduto = readproduto()
    dbproduto[index] = produto
    setLocalStorage(dbproduto)
}

const readproduto = () => getLocalStorage()

const createproduto = (produto) => {
    const dbproduto = getLocalStorage()
    dbproduto.push (produto)
    setLocalStorage(dbproduto)
}

const isValidFields = () => {
    return document.getElementById('form').reportValidity()
}

//Interação com o layout

const clearFields = () => {
    const fields = document.querySelectorAll('.modal-field')
    fields.forEach(field => field.value = "")
    document.getElementById('nome').dataset.index = 'new'
}

const saveproduto = () => {
    
    if (isValidFields()) {
        const produto = {
            nome : document.getElementById('nome').value,
            fabricante: document.getElementById('fabricante').value,
            categoria: document.getElementById('categoria').value,
            quantidade: document.getElementById('quantidade').value,
            valor: document.getElementById('valor').value
        }
        const index = document.getElementById('nome').dataset.index
        if (index == 'new') {
            createproduto(produto)
            updateTable()
            closeModal()
        } else {
            updateproduto(index, produto)
            updateTable()
            closeModal()
        }
    }
}

const createRow = (produto, index) => {
    const newRow = document.createElement('tr')
    newRow.innerHTML = `
       
        <th>${produto.nome}</th><br>
        <th>${produto.fabricante}</th>
        <th>${produto.categoria}</th>
        <th>${produto.quantidade}</th>
        <th>R$${produto.valor},00</th>
        
            <button type="button" class="button green" id="edit-${index}">Editar</button>
            <button type="button" class="button red" id="delete-${index}" >Excluir</button>
        
    `
    document.querySelector('#tableproduto>tbody').appendChild(newRow)
}

const clearTable = () => {
    const rows = document.querySelectorAll('#tableproduto>tbody tr')
    rows.forEach(row => row.parentNode.removeChild(row))
}

const updateTable = () => {
    const dbproduto = readproduto()
    clearTable()
    dbproduto.forEach(createRow)
}

const fillFields = (produto) => {
    document.getElementById('nome').value = produto.nome
    document.getElementById('fabricante').value = produto.fabricante
    document.getElementById('categoria').value = produto.categoria
    document.getElementById('quantidade').value = produto.quantidade
    document.getElementById('valor').value = produto.valor
    document.getElementById('nome').dataset.index = produto.index
}

const editproduto = (index) => {
    const produto = readproduto()[index]
    produto.index = index
    fillFields(produto)
    openModal()
}

const editDelete = (event) => {
    if (event.target.type == 'button') {

        const [action, index] = event.target.id.split('-')

        if (action == 'edit') {
            editproduto(index)
        } else {
            const produto = readproduto()[index]
            const response = confirm(`Deseja realmente excluir o produto ${produto.nome}`)
            if (response) {
                deleteproduto(index)
                updateTable()
            }
        }
    }
}

updateTable()

// Eventos
document.getElementById('cadastrarproduto')
    .addEventListener('click', openModal)

document.getElementById('modalClose')
    .addEventListener('click', closeModal)

document.getElementById('salvar')
    .addEventListener('click', saveproduto)

document.querySelector('#tableproduto>tbody')
    .addEventListener('click', editDelete)

document.getElementById('cancelar')
    .addEventListener('click', closeModal)
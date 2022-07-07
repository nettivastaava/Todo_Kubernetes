import axios from 'axios'
const baseUrl = 'http://localhost:8081/api/todos'

const getAllTodos = () => {
  return axios.get(baseUrl)
}

const createTodo = newObject => {
  return axios.post(baseUrl, newObject)
}

export default {
  getAllTodos: getAllTodos,
  createTodo: createTodo
}
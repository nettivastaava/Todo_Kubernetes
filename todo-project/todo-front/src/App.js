import React, { useState, useEffect } from 'react'
import todoService from './services/todos'
import imageService from './services/images'

const App = () => {
  const [todos, setTodos] = useState([])
  const [todoText, setTodoText] = useState('')
  const [image, setImage] = useState(null)

  useEffect(() => {
    todoService
      .getAllTodos()
      .then(response => {
        setTodos(response.data)
      })
    imageService
      .getImage()
      .then(response => {
        setImage(response.data)
      })
  }, [])

  const handleSubmit = (event) => {
    event.preventDefault()

    const todoObject = {
      text: todoText
    }

    todoService
      .createTodo(todoObject)
        .then(response => {
          setTodos(todos.concat(response.data))
          setTodoText('')
        })

    
  }
  console.log('image ', image)

  return (
    <div>
      {image &&
        <img src='http://localhost:8081/api/image' alt='image' width='600' height='600'/>
      }
      <h2>TODOS</h2>
      <ol>
      {todos?.map(todo => (
        <li>
          {todo.text}
        </li>
      ))}
      </ol>
      <form onSubmit={handleSubmit}>
        <textarea id="w3review" value={todoText} onChange={({ target }) => setTodoText(target.value)} name="w3review" rows="4" cols="50" maxLength="140"></textarea>
        <div>
          <button type="submit">Submit todo</button>
        </div>     
     </form>
    </div>
  )
}

export default App;

require('dotenv').config()
const http = require('http')

const express = require('express')
const morgan = require('morgan')
const bodyParser = require('body-parser')
const axios = require('axios')
const cors = require('cors')
const { Sequelize, Model, DataTypes } = require('sequelize')

const fs = require('fs')
const path = require('path')

const app = express()
const server = http.createServer(app)
const directory = path.join('/', 'usr', 'src', 'app', 'files')
const imagePath = path.join(directory, 'image.jpg')
const timestampPath = path.join(directory, 'timestamps.txt')

app.use(bodyParser.json())
app.use(express.json())
app.use(cors())

morgan.token('body', function (req) {return JSON.stringify(req.body)})

app.use(morgan(' :method :url :status :res[content-length] - :response-time ms :body'))

const sequelize = new Sequelize("todo-db", "postgres",
    process.env.POSTGRES_PASSWORD, {
    host: "postgres-svc",
    dialect: "postgres"
})

class Todo extends Model {}
  Todo.init({  
    id: {    
      type: DataTypes.INTEGER,    
      primaryKey: true,    
      autoIncrement: true  
    },  
    text: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  }, {  
    sequelize,   
    timestamps: false,  
    modelName: 'todo'
  })

Todo.sync()

const shouldFetchAnother = () => {
  if (!fs.existsSync(timestampPath)) {
    console.log('timestamps do not exists')
    return true
  } else {
    // console.log('should not refetch')
    const date = new Date(fs.readFileSync(timestampPath, 'utf8'))
    const present = new Date()
    if (date.toDateString() !== present.toDateString()) {
      // console.log('day has passed')
      return true
    } 
  }
  // console.log('nothing happens')
  return false
}

const findAFile = async () => {
  await new Promise(res => fs.mkdir(directory, (_err) => res()))
  const response = await axios.get('https://picsum.photos/1200', { responseType: 'stream' })
  response.data.pipe(fs.createWriteStream(imagePath))
  const date = new Date()
  fs.writeFile(timestampPath, date.toString(), (err) => { 
    if (err) { 
      console.log(err)
    }  
  })
  console.log('writing')
}

const removeFile = async () => new Promise(res => fs.unlink(timestampPath, (err) => res()))

app.post('/api/todos', async (req, res) => {  
  if (req.body.text.length > 140) {
    return res.status(400).json({
      error: 'TODO length cannot exceed 140 characters'
    })
  }
  console.log('posting')
  const newTodo = await Todo.create({text: req.body.text})
  console.log('new todo ', newTodo)  
  res.json(newTodo)
})

app.get('/api/todos', async (request, response) => {
  const todos = await Todo.findAll({})
  console.log('all todos ', todos)
  response.json(todos)
})


app.get('/api/image', async (_req, res) => {
  const shouldFetch = shouldFetchAnother()
  // console.log('should fetch is ', shouldFetch)
  if (shouldFetch) {
    // console.log('NOT EXECUTED')
    await removeFile()

    await findAFile()
  }

  res.sendFile(imagePath)
})

const PORT = process.env.PORT || 3001

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
  
const axios = require('axios')
const serviceURL = 'http://todo-project-dep-svc:2345/api/todos'

console.log('starting')
const postDailyTodo = async () => {
  const daily = await axios.get('https://en.wikipedia.org/wiki/Special:Random')

  // console.log('daily todo ', daily.request.res.responseUrl)
  await axios.post(serviceURL, { text: `READ: ${daily.request.res.responseUrl}`})
  console.log('posted')
}

postDailyTodo()

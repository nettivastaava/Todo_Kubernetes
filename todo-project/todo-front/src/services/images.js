import axios from 'axios'
const baseUrl = 'http://localhost:8081/api/image'

const getImage = () => {
  return axios.get(baseUrl)
}
  
export default {
  getImage: getImage,
}
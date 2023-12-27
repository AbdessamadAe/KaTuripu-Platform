const Pool = require('pg').Pool
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'KaTuripu', 
  password: ' ',
  port: 5432,
})

const getCategories = (request, response) => {
  pool.query('SELECT category_name from category', (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })  
}


module.exports = {
  getCategories
}

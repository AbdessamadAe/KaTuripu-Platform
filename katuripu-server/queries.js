const Pool = require('pg').Pool
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'KaTuripu', 
  password: ' ',
  port: 5432,
})

const getCategories = (request, response) => {
  pool.query('SELECT category_id, category_name from category', (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })  
}

const getTopics = (request, response) => {
  const categoryID = request.params.categoryid
  pool.query('SELECT topic.* FROM category NATURAL JOIN topic WHERE category_id = $1 ', [categoryID], (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
}


module.exports = {
  getCategories,
  getTopics,
}

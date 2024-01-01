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

const getTopicsForCateg = (request, response) => {
  const categoryID = request.params.categoryid
  pool.query('SELECT * FROM topic WHERE category_id = $1 ', [categoryID], (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
}

const getContentWithTopicId = (request, response) => {
  const topic_id = request.params.topic_id
  pool.query('SELECT * FROM topic_content NATURAL JOIN topic WHERE topic_id = $1 ', [topic_id], (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
}


module.exports = {
  getCategories,
  getTopicsForCateg,
  getContentWithTopicId
}

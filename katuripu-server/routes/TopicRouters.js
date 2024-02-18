const express = require('express');
const Topic = require('../models/topic');

const router = express.Router();

router.get('/:subjectid', async (request, response) => {
  const subjectID = parseInt(request.params.subjectid);
  try {
    const topics = await Topic.find({ subjectId: subjectID });
    response.status(200).json(topics);
  } catch (error) {
    console.error(error);
    response.status(500).json({ message: 'Error fetching topics for subject' });
  }
});

module.exports = router;
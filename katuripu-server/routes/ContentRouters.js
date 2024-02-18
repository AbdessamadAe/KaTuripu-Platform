const express = require('express');
const Content = require('../models/TopicContent');

const router = express.Router();

router.get('/:topicid', async (request, response) => {
  const topicID = parseInt(request.params.topicid);
  try {
    const content = await Content.find({ topicId: topicID });
    response.status(200).json(content);
  } catch (error) {
    console.error(error);
    response.status(500).json({ message: 'Error fetching content for topic' });
  }
});

module.exports = router;
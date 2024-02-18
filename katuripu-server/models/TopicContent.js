const mongoose = require('mongoose');

const topicContentSchema = new mongoose.Schema({
  contentId: {
    type: Number,
    required: true
  },
  topicId: {
    type: Number,
    required: true,
    ref: 'Topic'
  },
  title: {
    type: String
  },
  contentBody: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  contentVideoLink: {
    type: String
  },
  contentOrder: {
    type: Number
  }
});

const TopicContent = mongoose.model('TopicContent', topicContentSchema);

module.exports = TopicContent;

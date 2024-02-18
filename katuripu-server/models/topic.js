const mongoose = require('mongoose');

const topicSchema = new mongoose.Schema({
  topicId: {
    type: Number,
    required: true
  },
  subjectId: {
    type: Number,
    required: true,
    ref: 'Subject'
  },
  topicTitle: {
    type: String,
    required: true
  },
  topicOverview: {
    type: String
  },
  topicContent: {
    type: String
  },
  topicImageUrl: {
    type: String
  },
  topicAdditionalResources: {
    type: String
  }
});

const Topic = mongoose.model('Topic', topicSchema);

module.exports = Topic;

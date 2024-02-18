const mongoose = require('mongoose');

const subjectSchema = new mongoose.Schema({
  subjectId: {
    type: Number,
    required: true
  },
  subjectName: {
    type: String,
    required: true
  }
});

const Subject = mongoose.model('Subject', subjectSchema);

module.exports = Subject;

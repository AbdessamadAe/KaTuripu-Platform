require('dotenv').config();
const mongoose = require('mongoose');
const subject = require('../models/subject');
const Topic = require('../models/topic');
const TopicContent = require('../models/TopicContent');
const connectDB = require('../config/db');

const uri = process.env.MONGODB_URI;
connectDB(uri);

const categories = [
  { subjectId: 1, subjectName: 'حساب التفاضل والتكامل' },
  { subjectId: 2, subjectName: 'الجبر' },
];

const topics = [
  { topicId: 1, subjectId: 1, topicTitle: 'الإتصال', topicOverview: 'درس مهم في حساب التفاضل والتكامل', topicContent: 'Content about the definition and importance of continuity in calculus.', topicImageUrl: 'image_url_of_continuity_graph', topicAdditionalResources: 'link_to_continuity_resources' },
];

const topicContents = [
  {
    contentId: 1
    , topicId: 1
    , title: 'الاشتقاق - السرعة المتوسطة',
    contentBody: `
باسم الله الرحمان الرحيم

هذا خط **غليظ** أليس كذلك؟

* لائحة
* [ ] todo
* [x] done

$$10^{10} \\approx 1500$$

## End
`
    , contentVideoLink: 'https://www.youtube.com/watch?v=example1', contentOrder: 1
  },
];

const seedDatabase = async () => {
  try {
    await subject.deleteMany();
    await Topic.deleteMany();
    await TopicContent.deleteMany();
    await subject.insertMany(categories);
    await Topic.insertMany(topics);
    await TopicContent.insertMany(topicContents);
    console.log('Database seeded successfully!');
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    mongoose.connection.close();
  }
};

seedDatabase();

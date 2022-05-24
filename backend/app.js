const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

// const Post = require('./models/post');
const postsRoutes = require('./routes/posts');
const usersRoutes = require('./routes/users');

const app = express();

mongoose.connect('mongodb://<database>:<password>@cluster-aws-mumbai-shard-00-00.zi5ij.mongodb.net:27017,\
                  cluster-aws-mumbai-shard-00-01.zi5ij.mongodb.net:27017,\
                  luster-aws-mumbai-shard-00-02.zi5ij.mongodb.net:27017/myFirstDatabase?ssl=true&replicaSet=atlas-ls8ily-shard-0&authSource=admin&retryWrites=true&w=majority')
  .then(() => {
    console.log('Connection established to database for the project Konnect.');
  })
  .catch((err) => {
    console.log(err);
  });

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use('/images', express.static(path.join('backend/images')));

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, PUT, DELETE, OPTIONS');
  next();
})

app.use('/api/posts', postsRoutes);
app.use('/api/users', usersRoutes)

module.exports = app;

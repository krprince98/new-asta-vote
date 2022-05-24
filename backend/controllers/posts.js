const Post = require('../models/post');


exports.createPost = (req, res, next) => {
  const url = req.protocol + '://' + req.get('host');
  const post = new Post({
    title: req.body.title,
    content: req.body.content,
    imagePath: url + '/images/' + req.file.filename,
    creator: req.userData.userId
  });
  post.save().then(createdPost => {
    res.status(201).json({
      post: {
        ...createdPost,
        id: createdPost._id
      },
      message: 'Post Added by server through POST call'
    });
  }).catch(err => {
    res.status(500).json({
      message: 'Post creation failed.'
    });
  });
}

exports.updatePost = (req, res, next) => {
  var imagePath = req.body.imagePath;
  if (req.file) {
    const url = req.protocol + '://' + req.get('host');
    imagePath = url + '/images/' + req.file.filename;
  }
  const post = new Post ({
    _id: req.body.id,
    title: req.body.title,
    content: req.body.content,
    imagePath: imagePath,
    creator: req.userData.userId
  });
  console.log('Updated by: ', post);
  Post.updateOne({ _id: req.params.id, creator: req.userData.userId }, post).then(result => {
    if (result.modifiedCount > 0){
      res.status(200).json({message: 'Update successful!'});
    } else {
      res.status(401).json({message: 'Not authorized!'});
    }
  }).catch(err => {
    res.status(500).json({
      message: 'Updating post failed.'
    });
  });
}

exports.getPosts = (req, res, next) => {
  const pageSize = +req.query.pagesize;
  const currentPage = +req.query.page;
  var fetchedPosts;
  const postsQuery = Post.find();
  if (currentPage && pageSize) {
    postsQuery.skip(pageSize * (currentPage - 1)).limit(pageSize);
  }
  postsQuery.then(documents => {
    fetchedPosts = documents;
    return Post.count();
  }).then(counts => {
    res.status(200).json({
      message: 'Post fetched sucessfully!',
      posts: fetchedPosts,
      postsCount: counts
      });
  }).catch(err => {
    res.status(500).json({
      message: 'Fetching posts failed!'
    });
  });
}

exports.getPost = (req, res, next) => {
  Post.findById(req.params.id).then(post => {
    if (post) {
      res.status(200).json(post);
    } else {
      res.status(404).json({
        message: 'Post Not Found!'
      });
    }
  }).catch(err => {
    res.status(500).json({
      message: 'Fetching post failed!'
    });
  });
}

exports.deletePost = (req, res, next) => {
  Post.deleteOne({ _id: req.params.id, creator: req.userData.userId }).then(result => {
    if (result.deletedCount > 0){
      res.status(200).json({message: 'Delete successful!'});
    } else {
      res.status(401).json({message: 'Not authorized!'});
    }
  }).catch(err => {
    res.status(500).json({
      message: 'Post deletion failed!'
    });
  });
}

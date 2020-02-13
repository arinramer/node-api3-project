const express = require('express');

const router = express.Router();

const posts = require("./postDb");

router.get('/', (req, res) => {
  posts.get().then(posts => {
    res.status(200).json(posts);
  }).catch(err => {
    console.log(err);
    res.status(500).json({ message: "Unable to fulfill request" });
  })
});

router.get('/:id', validatePostId, (req, res) => {
  res.status(200).json(req.post);
});

router.delete('/:id', validatePostId, (req, res) => {
  const id = req.params.id;
  posts.remove(id)
  .then(deleted => {
    res.status(200).json(deleted);
  }).catch(err => {
    console.log(err);
    res.status(500).json({ error: "Unable to fulfill request"})
  })
});

router.put('/:id', validatePostId, validatePost, (req, res) => {
  const id = req.params.id;
  const body = req.body;
  posts.update(id, body)
  .then(updated => {
    res.status(200).json(updated);
  }).catch(err => {
    console.log(err);
    res.status(500).json({ error: "Unable to fulfill request"})
  })
});

// custom middleware

function validatePostId(req, res, next) {
  const id = req.params.id;
  posts.getById(id)
  .then(post => {
    if(post !== undefined) {
      req.post = post;
      next();
    } else {
      res.status(400).json({ message: "Invalid post id" });
    }
  }).catch(err => {
    console.log(err);
    res.status(500).json({ message: "Unable to fulfill request" });
  })
}

function validatePost(req, res, next) {
  const text = req.body.text;
  const body = req.body;
  if(JSON.stringify(body) === '{}') {
    res.status(400).json({ message: "missing post data" });
  } else if(JSON.stringify(body) !== '{}' && !text) {
    res.status(400).json({ message: "missing required text field" });
  } else {
    req.body = body;
    next();
  }
}

module.exports = router;

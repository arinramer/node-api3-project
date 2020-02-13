const express = require('express');

const router = express.Router();

const users = require("./userDb");

const posts = require("../posts/postDb");

router.post('/', validateUser, (req, res) => {
  const body = req.body;
  users.insert(body)
  .then(user => {
    res.status(200).json(user);
  }).catch(err => {
    console.log(err);
    res.status(500).json({ error: "Unable to fulfill request"})
  })
});

router.post('/:id/posts', validateUserId, validatePost, (req, res) => {
  posts.insert(req.body)
  .then(post => {
    res.status(200).json(post);
  }).catch(err => {
    console.log(err);
    res.status(500).json({ error: "Unable to fulfill request"})
  })
});

router.get('/', (req, res) => {
  const id = req.params.id;
  users.get(id)
  .then(user => {
    res.status(200).json(user);
  }).catch(err => {
    console.log(err);
    res.status(500).json({ error: "Unable to fulfill request"})
  })
});

router.get('/:id', validateUserId, (req, res) => {
  res.status(200).json(req.user);
});

router.get('/:id/posts', validateUserId, (req, res) => {
  const id = req.params.id;
  users.getUserPosts(id)
  .then(posts => {
    res.status(200).json(posts);
  }).catch(err => {
    console.log(err);
    res.status(500).json({ error: "Unable to fulfill request"})
  })
});

router.delete('/:id', validateUserId, (req, res) => {
  const id = req.params.id;
  users.remove(id)
  .then(deleted => {
    res.status(200).json(deleted);
  }).catch(err => {
    console.log(err);
    res.status(500).json({ error: "Unable to fulfill request"})
  })
});

router.put('/:id', validateUserId, validateUser, (req, res) => {
  const id = req.params.id;
  const body = req.body;
  users.update(id, body)
  .then(updated => {
    res.status(200).json(updated);
  }).catch(err => {
    console.log(err);
    res.status(500).json({ error: "Unable to fulfill request"})
  })
});

//custom middleware

function validateUserId(req, res, next) {
  const id = req.params.id;
  users.getById(id)
  .then(user => {
    if(user !== undefined) {
      req.user = user;
      next();
    } else {
      res.status(400).json({ message: "Invalid user id" });
    }
  }).catch(err => {
    console.log(err);
    res.status(500).json({ message: "Unable to fulfill request" });
  })
}

function validateUser(req, res, next) {
  const name = req.body.name;
  const body = req.body;
  if(JSON.stringify(body) === '{}') {
    res.status(400).json({ message: "missing user data" });
  } else if(JSON.stringify(body) !== '{}' && !name) {
    res.status(400).json({ message: "missing required name field" });
  } else {
    next();
  }
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

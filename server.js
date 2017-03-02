const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

const app = express();


app.use(morgan('common'));

// you need to import `blogPostsRouter` router and route
// requests to HTTP requests to `/blog-posts` to `blogPostsRouter`
const {BlogPosts} = require('./models');
app.get('/blog-posts', (req, res) => {
  res.json(BlogPosts.get());
});

function lorem() {
  return 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod ' +
    'tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, '
    'quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo ' +
    'consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse ' +
    'cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non ' +
    'proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'
}

// seed some posts so initial GET requests will return something
BlogPosts.create(
  '10 things -- you won\'t believe #4', lorem(), 'Billy Bob');
BlogPosts.create(
  'Lions and tigers and bears oh my', lorem(), 'Lefty Lil');




BlogPosts.create('This is the life', 'You know you are end deep when...', 'John Smith');

app.post('/blog-posts', jsonParser, (req, res) => {

  // console.log('---request body---',req.body);
  const requiredFields = ['title', 'content', 'author'];
  for (let i=0; i<requiredFields.length; i++) {
    const field = requiredFields[i];
    if (!(field in req.body)) {
      const message = `Missing \`${field}\` in request body`
      console.error(message);
      return res.status(400).send(message);
    }
  }

  const item = BlogPosts.create(req.body.title, req.body.content, req.body.author);
  res.status(201).json(item);
});
app.delete('/blog-posts/:id', (req, res) => {
  BlogPosts.delete(req.params.id);
  console.log(`Deleted item \`${req.params.id}\``);
  res.status(204).end();
});

app.put('/blog-posts/:id', jsonParser, (req, res) => {
  const requiredFields = ['title', 'content', 'author'];
  for (let i=0; i<requiredFields.length; i++) {
    const field = requiredFields[i];
    if (!(field in req.body)) {
      const message = `Missing \`${field}\` in request body`
      console.error(message);
      return res.status(400).send(message);
    }
  }
  // if (req.params.id !== req.body.id) {
  //   const message = (
  //     `Request path id (${req.params.id}) and request body id `
  //     `(${req.body.id}) must match`);
  //   console.error(message);
  //   return res.status(400).send(message);
  // }
  console.log(`Updating item \`${req.params.id}\``);
  const updatedItem = BlogPosts.update({
    id: req.params.id,
    title: req.body.title,
    content: req.body.content,
    author: req.body.author
  });
  res.status(200).json(updatedItem);
});



app.listen(process.env.PORT || 8080, () => {
  console.log(`Your app is listening on port ${process.env.PORT || 8080}`);
});

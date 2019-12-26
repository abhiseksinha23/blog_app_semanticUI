const express = require('express');
const app = express();
const bodyparser = require('body-parser');
const mongoose = require('mongoose');
const methodoverride = require('method-override');
const expresssanitizer = require('express-sanitizer');
//app setup
mongoose.connect("mongodb://localhost:27017/restful_blog_app", {useNewUrlParser : true, useUnifiedTopology: true});
mongoose.set('useFindAndModify', false);

app.set("view engine","ejs");
app.use(express.static("public"));
app.use(bodyparser.urlencoded({extended: true}));
app.use(methodoverride("_method"));
app.use(expresssanitizer());
//mongoose model config
const blogschema = new mongoose.Schema({
  title: String,
  image: String,
  body: String,
  created:{type: Date, default: Date.now}
});

const blog = mongoose.model("blog", blogschema);

//RESTFUL ROUTES...
app.get("/", (req, res)=>{
  res.redirect("/blogs");
});
app.get("/blogs", (req, res)=>{
  blog.find({}, (err, blogs)=>{
    if(err){
      console.log(err);
    }else{
      res.render("index", {blogs:blogs});
    }
  });
});
//NEW BLOG
app.get("/blogs/new", (req,res)=>{
  res.render("new");
});
//CREATE BLOG
app.post("/blogs", (req, res)=>{
  req.body.blog.body = req.sanitize(req.body.blog.body);
  blog.create(req.body.blog, (err, newblog)=>{
    if(err){
      res.render("new");
    }else{
      res.redirect("/blogs");
    }
  });
});
//SHOW BLOG
app.get("/blogs/:id", (req,res)=>{
  blog.findById(req.params.id, (err, foundblog)=>{
    if(err){
      res.render("/blogs");
    }else{
      res.render("show", {blog: foundblog});
    }
  });
});
//EDIT BLOG
app.get("/blogs/:id/edit", (req, res)=>{
  blog.findById(req.params.id, (err, foundblog)=>{
    if(err){
      res.render("/blogs");
    }else{
      res.render("edit", {blog: foundblog});
    }
  });
});

//UPDATE ROUTES
app.put("/blogs/:id", (req, res)=>{
  req.body.blog.body = req.sanitize(req.body.blog.body);
  blog.findByIdAndUpdate( req.params.id, req.body.blog, (err, updatedblog)=>{
    if(err){
      res.redirect("/blogs");
    }else{
      res.redirect("/blogs/" + req.params.id);
    }
  });
});

//DELETE ROUTES
app.delete("/blogs/:id", (req, res)=>{
//  res.send("hello");
  blog.findByIdAndRemove(req.params.id, (err)=>{
    if(err){
      res.redirect("/blogs");
    }else{
      res.redirect("/blogs");
    }
  });
});
app.listen(3000, ()=>{
  console.log("Blog app started............!!!");
});

//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const _ = require('lodash');
mongoose.set('strictQuery', true);

const app = express();
app.use(express.json());

const home = " ";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";



//const posts = [];

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));


//Mongo Commands
mongoose.connect("mongodb://127.0.0.1:27017/blogDB", {useNewUrlParser: true})
.then(() => {
  console.log("connected");
});

let postSchema = mongoose.Schema({
  title: String,
  content: String,
});


const Post = mongoose.model("Post", postSchema);



app.get("/", function(req, res){
  Post.find({}, function(err, posts){
    res.render("home",{
      homeContent: home,
      posts: posts,
    });
  });

})


//for contact button in navbar
app.get("/contact", function(req,res){
  res.render("contact", {CONTACT: contactContent})
})


//for ADD Blog Button in Navbar
app.get("/compose", function(req, res){
  res.render("compose");
});



 app.get(["/posts/:postId"], function(req, res){                                //EJS Format to go around pages by adding the url you wish
   const requestedPostId= req.params.postId;                                    //use of lodash
   Post.findOne({_id: requestedPostId}, function(err, post){
    res.render("blog", {title: post.title, content: post.content});
   })
 });


//for compose page
app.post("/compose", function(req,res){                          
  const post= new Post(
  {
    title: req.body.postTitle,
    content: req.body.postbody
  });
  
  post.save(function(err){
    if(!err){
      res.redirect("/");
    }else{
      console.log("your error is: "+ err);
    }
  });
});


app.post("/delete", function(req, res){
  id = req.params._id;
  Post.findOneAndDelete(id, function(err) {
    if (!err) {
        console.log("Post successfully deleted");
        res.redirect("/");
    }
    else {
        console.log(err);
    }
  });
});



app.listen(3000, function() {
  console.log("Server started on port 3000");
});


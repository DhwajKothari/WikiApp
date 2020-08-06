const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const app = express();

app.use(bodyParser.urlencoded({
  extended: true
}));
// app.use(express.static("public"));
mongoose.connect("mongodb://localhost:27017/WikiDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false
});
const articlesSchema = mongoose.Schema({
  title: String,
  content: String
});
const Article = mongoose.model("article", articlesSchema);
app.route("/articles")
.get( function(req, res) {
  Article.find({}, function(err, foundArticles) {
    if (!err) {
      res.send(foundArticles);
    };
  });
})
.post(function(req,res){
  const item=new Article({
    title:req.body.title,
    content:req.body.content
  });
  item.save();

})
.delete(function(req,res){
  Article.deleteMany({},function(err){
    if(!err){
      res.send("Successfully deleted all articles.")
    }else{
      console.log(err);
    }
  });
});

app.route("/articles/:articleTitle")
.get(function(req,res){
  Article.findOne({title:req.params.articleTitle},function(err,foundArticle){
    if(foundArticle){
      res.send(foundArticle);
    }
    else{
      res.send("No article matching that title was found!");
    }
  });
})
.put(function(req,res){
  Article.update(
    {title:req.params.articleTitle},
    {title:req.body.title,content:req.body.content},
    {overwrite:true},
    function(err){
      if(err){
        console.log(err);
      }
      else{
        res.send("Successfully updated the article.");
      }
    });
})
.patch(function(req,res){
  Article.update(
    {title:req.params.articleTitle},
    {$set:req.body},
    function(err){
      if(!err){
          res.send("Successfully updated the article.");
      }
      else{
          res.send(err);
      }
    }
  )
})
.delete(function(req,res){
  Article.deleteOne(
    {title:req.params.articleTitle},
    function(err){
      if(!err){
          res.send("Successfully deleted the article.");
      }
      else{
          res.send(err);
      }
    }
  )
});


app.listen(3000, () => {
  console.log("Server up and running on port 3000.");
});

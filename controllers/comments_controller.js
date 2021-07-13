const Comment = require('../models/comment');
const Post = require('../models/posts');

module.exports.create = async function(req,res){
  try{

    let post = await Post.findById(req.body.post);
      if(post){
        let comment = await Comment.create({
          content:req.body.content,
          post:req.body.post,
          user:req.user._id
        });
        post.comments.push(comment);
          post.save();
        
          req.flash('success','You commented on the post');
          res.redirect('/');
      }
      
  }catch(err){
    req.flash('error',err);
    res.redirect('/');
  }
  
}

module.exports.destroy = async function(req,res){

  try{

    let comment = await Comment.findById(req.params.id);
    if(comment.user == req.user.id){
      let postId = comment.post;

      comment.remove();

      let post = await Post.findByIdAndUpdate(postId,{$pull : {comments: req.params.id}});

      req.flash('success','You deleted the comment');
      return res.redirect('back');

    }else{
      req.flash('error','You cannot delete this post');
      return redirect('back');
    }
    
  }catch(err){
    req.flash('error',err);
    return redirect('back');
  }
  
}
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Post = require('../models/Post');


const adminLayout = '../views/layouts/index';
const jwtsecret = process.env.JWT_SECRET;
/* Admin - Login */
router.get('/admin/login', (req, res) => {
    try {
       const local = {
        title: 'Login Admin Panel',
        description: 'Login Your credential'
       } 

       res.render('admin/index', { local, layout: adminLayout })
    } catch (error) {
        console.log(error);
        
    }
})

router.get('/admin/register', (req, res) => {
    try {
       const local = {
        title: 'Register Admin Panel',
        description: 'Become our writer'
       } 

       res.render('admin/register', { local, layout: adminLayout })
    } catch (error) {
        console.log(error);
        
    }
})

router.post('/admin/login', async (req, res) => {
    try {
       const local = {
        title: 'Login Admin Panel',
        description: 'Login Your credential',
        message: undefined
       } 

       const { username, password } = req.body;

       const user = await User.findOne({ username });

       if(!user){
        local.message = "User doesn't exist"
        return res.status(401).render('admin/index', { local, layout: adminLayout });
       } 

       const isPassword = await bcrypt.compare(password, user.password);

       if(!isPassword){
        local.message = "Password is wrong"
        return res.status(401).render('admin/index', { local, layout: adminLayout  });
        
       }

       const token = jwt.sign({userId: user._id}, jwtsecret);

       res.cookie('token',token, { httpOnly: true});
       res.redirect('/dashboard');

    } catch (error) {
        console.log(error);
    }
})

router.post('/admin/register', async (req, res) => {
    const local = {
        title: 'Register Admin Panel',
        description: 'Become our writer',
        message: undefined
       } 
    try {
       const { username, password, email } = req.body;
       const passwordhashed = await bcrypt.hash(password, 10);


       await User.create({ username, password: passwordhashed, email});

       res.status(200).redirect('/admin/login')

    } catch (error) {
    
        local.message = 'email' in error.keyPattern ? 'Email is already used' : 'User has existed';
        res.status(400).render('admin/register', { local, layout: adminLayout})
        
    }
})

/* authentication middleware */

const authMiddleware = (req, res, next) => {

    const token = req.cookies.token;

    if(!token){
        return res.redirect('/admin/login');
    }

    try{
        const decoded = jwt.verify(token, jwtsecret);
        req.userId = decoded.userId;
        next();
    }
    catch(error){
        console.log(error);
        return res.redirect('/admin/login');
    }
}

/* admin dashboard */
router.get('/dashboard', authMiddleware, async (req, res) => {
    try {
        const local = {
            title: "Dashboard",
            description: "Manage your content"
        }

        const data = await Post.find()

        res.render('admin/dashboard', {
            local,
            data
        })
    } catch (error) {
        
    }
    
})

/**
 * GET /
 * Admin - Create New Post
*/
router.get('/add-post', authMiddleware, async (req, res) => {
    try {
      const local = {
        title: 'Add Post',
        description: 'Simple Blog created with NodeJs, Express & MongoDb.'
      }
  
      const data = await Post.find();
      res.render('admin/add-post', {
        local,
        layout: adminLayout
      });
  
    } catch (error) {
      console.log(error);
    }
  
  });
  
  
  /**
   * POST /
   * Admin - Create New Post
  */
  router.post('/add-post', authMiddleware, async (req, res) => {
    try {
      try {
        const newPost = new Post({
          title: req.body.title,
          body: req.body.body
        });
  
        await Post.create(newPost);
        res.redirect('/dashboard');
      } catch (error) {
        console.log(error);
      }
  
    } catch (error) {
      console.log(error);
    }
  });
  
  
  /**
   * GET /
   * Admin - Create New Post
  */
  router.get('/edit-post/:id', authMiddleware, async (req, res) => {
    try {
  
      const local = {
        title: "Edit Post",
        description: "Free NodeJs User Management System",
      };
  
      const data = await Post.findOne({ _id: req.params.id });
  
      res.render('admin/edit-post', {
        local,
        data,
        layout: adminLayout
      })
  
    } catch (error) {
      console.log(error);
    }
  
  });
  
  
  /**
   * PUT /
   * Admin - Create New Post
  */
  router.put('/edit-post/:id', authMiddleware, async (req, res) => {
    try {
  
      await Post.findByIdAndUpdate(req.params.id, {
        title: req.body.title,
        body: req.body.body,
        updatedAt: Date.now()
      });
  
      res.redirect(`/edit-post/${req.params.id}`);
  
    } catch (error) {
      console.log(error);
    }
  
  });

  router.delete('/delete-post/:id', authMiddleware, async (req, res) => {

    try {
      await Post.deleteOne( { _id: req.params.id } );
      res.redirect('/dashboard');
    } catch (error) {
      console.log(error);
    }
  
  });
  
  
  /**
   * GET /
   * Admin Logout
  */
  router.get('/logout', (req, res) => {
    res.clearCookie('token');
    //res.json({ message: 'Logout successful.'});
    res.redirect('/');
  });

module.exports = router;
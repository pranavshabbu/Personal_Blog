//This file contains routed to all pages

const express = require('express');
const router = express.Router();
const Post = require('../models/Post');
const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
 

const adminLayout = '../views/layouts/admin';
const jwtSecret = process.env.JWT_SECRET;


//MiddleWare to prevent unauthorised access to pages (dashboard for example, if token expires, u wont see the dashboard)
const authMiddleware = (req, res, next) => {
    const token = req.cookies.token;
    if(!token){
        return res.status(401).json({message:'Unauthorized'});
    }

    try{
        const decoded = jwt.verify(token, jwtSecret);
        req.userId = decoded.userId;
        next();
    }catch(error){
        return res.status(401).json({message:'Unauthorized'});
    }
} //Now add this authMiddleware to the dashboard call to make it protected


//Home Page
router.get('/admin', async (req, res) => {
    const locals = {
        title:"Admin",
        desc:"Simple blog"
    }

    try {
        res.render('admin/index', {locals, layout: adminLayout});
    } catch (error) {
        console.log(error);
    }

});


//Login:
router.post('/admin', async (req, res) => {
    try {
        const {username, password} =req.body;

        const user = await User.findOne({username});
        if(!user){
            return res.status(401).json({message:'Invalid Credentials'});
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if(!isPasswordValid){
            return res.status(401).json({message:'Invalid Credentials'});
        }
        const token = jwt.sign({userId: user._id}, jwtSecret);
        res.cookie('token', token, {httpOnly: true});
        res.redirect('/dashboard');

    } catch (error) {
        console.log(error);
    }

});


//Admin dashboard
router.get('/dashboard', authMiddleware, async (req, res) => {
    try {
        const locals = {
            title:"Admin",
            desc:"Simple blog"
        }

        const data = await Post.find();
        res.render('admin/dashboard', {locals, data, layout: adminLayout});

    } catch (error) {
        console.log(error);
    }
})


//Admin - Add Post page:
router.get('/add-post', authMiddleware, async (req, res) => {
    try {
        const locals = {
            title:"Admin",
            desc:"Simple blog"
        }

        const data = await Post.find();
        res.render('admin/add-post', {locals, layout: adminLayout});

    } catch (error) {
        console.log(error);
    }
})


//Admin: Add post to DB:
router.post('/add-post', authMiddleware, async (req, res) => {
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
})


//Admin: Find Post to edit
router.get('/edit-post/:id', authMiddleware, async (req, res) => {
    try {
        const locals = {
            title:"Edit-Post",
            desc:"Simple blog"
        }

        const data = await Post.findOne({ _id: req.params.id});

        res.render('admin/edit-post', {locals, data, layout: adminLayout})

    } catch (error) {
        console.log(error);
    }
});


//Admin-Edit Post:
router.put('/edit-post/:id', authMiddleware, async (req, res) => {
    try {
        await Post.findByIdAndUpdate(req.params.id, {
            title: req.body.title,
            body: req.body.body,
            updatedAt: Date.now()
        });

        res.redirect('/dashboard');

    } catch (error) {
        console.log(error);
    }
});


//Admin: Delete Post:
router.delete('/delete-post/:id', authMiddleware, async (req, res) => {
    try {
        await Post.deleteOne({ _id: req.params.id });
        res.redirect('/dashboard');

    } catch (error) {
        console.log(error);
    }
});


//Register:
// router.post('/register', async (req, res) => {
//     try {
//         const {username, password} =req.body;
//         const hashedPassword = await bcrypt.hash(password, 10);

//         try {
//             const user = await User.create({username, password: hashedPassword});
//             res.send('User created');
//         } catch (error) {
//             console.log(error);
//         }
//     } catch (error) {
//         console.log(error);
//     }

// });


//Admin: Logout:
router.get('/logout', (req, res) => {
    res.clearCookie('token');
    res.redirect('/');
})


module.exports = router;
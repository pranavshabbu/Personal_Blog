const express = require('express');
const router = express.Router();
const Post = require('../models/Post');


router.get('', async (req, res) => {
    const locals = {
        title:"Nodejs Blog",
        desc:"Simple blog"
    }

    try {
        let perPage = 6;
        let page = req.query.page || 1;

        const data = await Post.aggregate([{ $sort: {createdAt: -1}}])
        .skip(perPage * page -perPage)
        .limit(perPage)
        .exec();

        const count = await Post.countDocuments();
        const nextPage = parseInt(page) + 1;
        const hasNextPage = nextPage <= Math.ceil(count / perPage);

        res.render('index', {
            locals,
            data,
            current: page,
            nextPage: hasNextPage ? nextPage : null
        });

    } catch (error) {
        console.log(error);
    }

});


router.get('/post/:id', async (req, res) => {
    const locals = {
        title:"Nodejs Blog",
        desc:"Simple blog"
    }

    try {
        let slug = req.params.id;

        const data = await Post.findById({_id: slug});
        res.render('post', {locals, data});
    } catch (error) {
        console.log(error);
    }

});


router.post('/search', async (req, res) => {
    const locals = {
        title:"Nodejs Blog",
        desc:"Simple blog"
    }

    try {
        let searchTerm = req.body.searchTerm;
        const data = await Post.find({
            $or: [
                {title: {$regex: new RegExp(searchTerm, 'i')}},
                {body: {$regex: new RegExp(searchTerm, 'i')}},
            ]
        })
        res.render("search", {data, locals});
    } catch (error) {
        console.log(error);
    }

});


router.get('/about', (req, res) => {
    res.render('about');
});

router.get('/contact', (req, res) => {
    res.render('contact');
});

module.exports = router;



//Inserted data:
//function insertPostData() {
    //     Post.insertMany([
    //         {
    //             title:"Building a blog",
    //             body:"This is the body text"
    //         },
    //         {
    //             title:"2nd post",
    //             body:"This is the body text"
    //         },
    //         {
    //             title:"3rd post",
    //             body:"This is the body text"
    //         },
    //         {
    //             title:"4th post",
    //             body:"This is the body text"
    //         },
    //         {
    //             title:"5th post",
    //             body:"This is the body text"
    //         },
    //         {
    //             title:"6th post",
    //             body:"This is the body text"
    //         },
    //     ])
    // }
    // insertPostData();
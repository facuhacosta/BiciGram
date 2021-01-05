const router = require('express').Router();

const pool = require('../database');

router.get('/add', (req,res) => {
    res.render('foro/addPost', {title: 'Add New Post'});
});

router.post('/add', async (req, res) => {
    console.log(req.body);
    const { title , content , img } = req.body;
    const newPost = {
        title,
        content,
        img
    };
    await pool.query('INSERT INTO posts SET ?',[newPost]);
    req.flash('success', 'Post Creado Exitosamente');
    res.redirect('/foro');
});

router.get('/', async(req,res) =>{
    const posts = await pool.query('SELECT * FROM posts');
    res.render('foro/main', {posts});
});

router.get('/delete/:id', async(req,res)=>{
    const { id } = req.params;
    await pool.query('DELETE FROM posts WHERE id = ?', [id]);
    res.redirect('/foro');
});

router.get('/edit/:id', async(req,res) => {
    const { id } = req.params;
    const post = await pool.query('SELECT * FROM posts WHERE id = ?' [id]);
    res.render('foro/edit', {post: post[0]});
});

router.post('/edit/:id', async(req,res) => {
    const {id} = req.params;
    const { title, content, img} = req.body;
    const newPost = {
        title,
        content,
        img
    };
    await pool.query('UPDATE posts SET ? WHERE id = ?', [newPost,id]);
    res.redirect('/foro');
});

module.exports = router;
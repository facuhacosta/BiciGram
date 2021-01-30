const router = require('express').Router();
const { isLoggedIn } = require('../lib/auth');
const pool = require('../database');

router.get('/add', isLoggedIn, (req,res) => {
    res.render('foro/addPost', {title: 'Add New Post'});
});

router.post('/add',  async (req, res) => {
    const { title , content , img } = req.body;
    const newPost = {
        user: req.user.id,
        title,
        content,
        img,
        
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

router.get('/:id', async (req,res) => {
    const post = await pool.query('SELECT * FROM posts WHERE id = ?', [req.params.id]);
    const comments = await pool.query('SELECT * FROM comments WHERE post = ? AND parent IS NULL', [post[0].id]);
    for (const comment of comments){
        comment.replys = await pool.query('SELECT * FROM comments WHERE post = ? AND parent = ?',[post[0].id,comment.id]);
        comment.userData = (await pool.query('SELECT username FROM user WHERE id = ?',[comment.user]))[0];
        for (const reply of comment.replys){
            reply.userData = (await pool.query('SELECT username FROM user WHERE id = ?', [reply.user]))[0];
        }
    }

    res.render('foro/post', {post: post[0] , comments});
});

router.post('/:id', isLoggedIn ,async (req,res) => {
    console.log(req.user);
    console.log(req.params.id);
    const comment = {
        user: req.user.id,
        post: parseInt(req.params.id,10),
        content: req.body.content
    };
    console.log(comment);
    await pool.query('INSERT INTO comments SET ?', [comment]);
    res.redirect('/foro/' + req.params.id);
    
});
module.exports = router;
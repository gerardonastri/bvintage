require('dotenv').config()


const express = require('express');
const app = express();
const Product = require('./models/Product');
const User = require('./models/User');
const path = require('path');
const session = require('express-session')
const flash = require('connect-flash');
const ejsMAte = require('ejs-mate');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const isLogged = require('./isLogged');
const Cart = require('./models/Cart')


//stripe
const stripe = require('stripe')('sk_test_51Jb6v8CpJYHo6sxy0qDyT0SoRcRCwMJjGm3pdcc0MaUEjYdCjhfCIqyJjmvkBus6R4V8cI2olSJwSJr3wQYGukJ600yzwUvX9k');



//database
mongoConnect = 'mongodb+srv://gerardo:gerardo06@e-commerce.ur7sz.mongodb.net/ecommerce?retryWrites=true&w=majority'
const mongoose = require('mongoose');
mongoose.connect( mongoConnect, {
    useNewUrlParser: true,
    useUnifiedTopology: true 
})
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('mongoDB connected');
});

//middleware
//EJS
app.engine('ejs', ejsMAte) //EJS-MATE
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))
//post method
app.use(express.urlencoded({extended: true}))
//session and flash
const sessionConfig = {
  secret: 'thisshouldbeabettersecret!',
  resave: false,
  saveUninitialized: true,
  cookie: {
      httpOnly: true,
      expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
      maxAge: 1000 * 60 * 60 * 24 * 7
  }
}
app.use(session(sessionConfig))
app.use(flash());
//passport
app.use(passport.initialize());
app.use(passport.session())
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error');
  next();
})

///////////////////////////////////////////////

//request
app.get('/', async (req,res) => {
  const products = await Product.find({});
  res.render('home', {products})
})

app.get('/details/:id', async(req,res) => {
  const product = await Product.findById(req.params.id);
  res.render('details', {product})
})

//user
app.get('/login', (req,res) => {
  res.render('users/login')
})

app.get('/signup', (req,res) => {
  res.render('users/signup')
})

//authentication
app.post('/signup', async(req,res) => {
  try {
    const {email, username, password} = req.body;
    const user = new User({email, username});
    const registerUser = await  User.register(user, password);
    req.login(registerUser, err => {
        if(err) return next(err);
        req.flash('succes', 'welcome to yelp camp');
        res.redirect('/')
    })
} catch (e) {
    req.flash('error', e.message);
    res.redirect('/signup')
}
})

app.post('/login',  passport.authenticate('local', {failureFlash: true, failureRedirect: '/login'}),  async(req,res) => {
  req.flash('success', 'welcome back');
  const redirectUrl = '/'
  res.redirect(redirectUrl)
})

//logout
app.get('/logout', (req,res) => {
  req.session.destroy();
  res.redirect('/')
})


//cart
app.get('/cart', isLogged,  async (req,res) => {
  const carts = await Cart.find({})
  res.render('cart', {carts})
})

//checkout
/*
app.get('/cart/checkout', isLogged,  async (req,res) => {
  const carts = await Cart.find({})
  res.render('cart', {carts})
})

app.post('/cart/checkout', async (req,res) => {
  try{
    const paymentIntent = await stripe.paymentIntents.create({
      amount: 1999,
      currency: 'usd',
      payment_method_types: ['card']
    });
  } catch(e){
    res.status(400).flash('error', e.message);
    res.redirect('/cart/checkout')
  }
  


})
*/


//cart
app.post('/cart/:id', async (req,res) => {
    const {quantity} = req.body;
    const product = await Product.findById(req.params.id);
    const newCart = new Cart({
      name: product.name,
      price: product.price,
      quantity: quantity,
      image: product.image
    }) 
    await newCart.save()
  res.redirect(`/details/${req.params.id}`)
})

app.get('/cart/delete', async(req,res) => {
  await Cart.deleteMany({});
  res.redirect('/cart')
})

//ebook
app.get('/ebook', async(req,res) => {
  const products = await Product.find({category: 'ebook'});
  res.render('category/ebook', {products})
})

//libri
app.get('/libri', async(req,res) => {
  const products = await Product.find({category: 'libri'});
  res.render('category/libri', {products})
})


app.listen( process.env.PORT || 3000)
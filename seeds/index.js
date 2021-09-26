
const Product = require('../models/Product');

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

const sample = array => array[Math.floor(Math.random() * array.length)];


const seedDB = async () => {
    await Product.deleteMany({});
        const product = new Product({
            name: "Harry Potter and the Sorcerer's Stone",
            price: 20.00,
            author: 'J. K. Rowling',
            image: 'https://images.justwatch.com/poster/87608067/s592',
            description: 'A 11 anni, Harry Potter scopre di essere il figlio orfano di due potenti maghi. Frequenta la scuola di magia e stregoneria di Hogwarts dove scopre la verità su se stesso e sulla morte dei suoi genitori.',
            category: 'libri'
        })
        await product.save();
        const product2 = new Product({
            name: "Severus Snape and the Marauders",
            price: 15.00,
            author: 'Justin Zagri',
            image: 'https://assets.mycast.io/posters/the-marauders-fan-casting-poster-71460-large.jpg?1607974085',
            description: "The Marauders[9] were a group of four Gryffindors and classmates: Remus Lupin, Peter Pettigrew, Sirius Black, and James Potter. The four attended Hogwarts School of Witchcraft and Wizardry from 1971-1978. They had a knack for rule-breaking and mischief-making. While at Hogwarts they also created the Marauder's Map, which continued to help future generations of mischief-makers.[1]",
            category: 'ebook'
        })

        await product2.save()
    
}

seedDB().then(() => {
    mongoose.connection.close();
})
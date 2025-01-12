const express = require('express'); 
const mysql = require('mysql2'); 
const bodyParser = require('body-parser'); 
const methodOverride = require('method-override'); 
const path = require('path'); 
const app = express(); 
const PORT = 3000; 
const db = require('./dbConnect'); 


app.set('view engine', 'ejs'); 
app.set('views', path.join(__dirname, 'views')); 
app.use(bodyParser.urlencoded({ extended: true })); 
app.use(methodOverride('_method')); 
app.use(express.static('public')); 

app.get('/', (req, res) => {
    res.render('home'); 
});

// ********** CATEGORY CRUD **************
app.get('/categories', (req, res) => {
    db.query('SELECT * FROM Category', (err, categories) => {
        if (err) throw err; 
        res.render('categories', { categories }); 
    });
});

app.post('/categories', (req, res) => {
    const { CategoryName } = req.body; 
    db.query('INSERT INTO Category (CategoryName) VALUES (?)', [CategoryName], (err) => {
        if (err) throw err; 
        res.redirect('/categories'); 
    });
});

app.delete('/categories/:id', (req, res) => {
    const { id } = req.params; 
   
    db.query('SELECT COUNT(*) AS count FROM Product WHERE CategoryId = ?', [id], (err, results) => {
        if (err) throw err;
        const count = results[0].count;
        if (count > 0) {
            db.query('SELECT * FROM Category', (err, categories) => {
                if (err) throw err;
                res.render('categories', {
                    error: 'Please delete all products before deleting the category.',
                    categories: categories
                });
            });
        } else {
            db.query('DELETE FROM Category WHERE CategoryId = ?', [id], (err) => {
                if (err) throw err;
                res.redirect('/categories'); 
            });
        }
    });
});


app.get('/categories/update/:id', (req, res) => {
    const { id } = req.params;
    db.query('SELECT * FROM Category WHERE CategoryId = ?', [id], (err, results) => {
        if (err) throw err;
        const category = results[0];
        res.render('updateCategory', { category });
    });
});


app.post('/categories/update/:id', (req, res) => {
    const { id } = req.params;
    const { CategoryName } = req.body;
    db.query('UPDATE Category SET CategoryName = ? WHERE CategoryId = ?', [CategoryName, id], (err) => {
        if (err) throw err;
        res.redirect('/categories');
    });
});


//**********PRODUCT CRUD ************
app.get('/products', (req, res) => {
    const page = parseInt(req.query.page) || 1; 
    const pageSize = 10; 
    const offset = (page - 1) * pageSize; 

    const countQuery = 'SELECT COUNT(*) AS total FROM Product';
    const dataQuery = `SELECT Product.ProductId, Product.ProductName, Category.CategoryId, Category.CategoryName
                        FROM Product
                        JOIN Category ON Product.CategoryId = Category.CategoryId
                        LIMIT ?, ?`;

    db.query(countQuery, (err, countResults) => {
        if (err) throw err;
        const total = countResults[0].total; 
        const totalPages = Math.ceil(total / pageSize); 

        db.query(dataQuery, [offset, pageSize], (err, products) => {
            if (err) throw err;
            db.query('SELECT * FROM Category', (err, categories) => {
                if (err) throw err;
                res.render('products', { products, page, totalPages, categories });
            });
        });
    });
});

app.post('/products', (req, res) => {
    const { ProductName, CategoryId } = req.body; 
    db.query('INSERT INTO Product (ProductName, CategoryId) VALUES (?, ?)', [ProductName, CategoryId], (err) => {
        if (err) throw err;
        res.redirect('/products'); 
    });
});

app.delete('/products/:id', (req, res) => {
    const { id } = req.params; 
    db.query('DELETE FROM Product WHERE ProductId = ?', [id], (err) => {
        if (err) throw err;
        res.redirect('/products'); 
    });
});

app.get('/products/update/:id', (req, res) => {
    const { id } = req.params;
    db.query('SELECT * FROM Product WHERE ProductId = ?', [id], (err, productResults) => {
        if (err) throw err;
        const product = productResults[0];
        db.query('SELECT * FROM Category', (err, categoryResults) => {
            if (err) throw err;
            res.render('updateProduct', { product, categories: categoryResults });
        });
    });
});


app.post('/products/update/:id', (req, res) => {
    const { id } = req.params;
    const { ProductName, CategoryId } = req.body;
    db.query('UPDATE Product SET ProductName = ?, CategoryId = ? WHERE ProductId = ?', [ProductName, CategoryId, id], (err) => {
        if (err) throw err;
        res.redirect('/products');
    });
});


app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});

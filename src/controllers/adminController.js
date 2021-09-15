const { products, writeProductsJSON } = require('../data/dataBase.js');
const { validationResult } = require('express-validator')
//let save = (dato) => fs.writeFileSync(path.join(__dirname,'..','data','products.json'),JSON.stringify(dato,null,2),'utf-8') /* gurada en el json products */


module.exports ={
adminLogin: (req, res) => {
        res.render('admin_login')
    },

    admin: (req, res) => {
		res.render('admin', {
            session: req.session
        })
    },
	products: (req, res) => {
        res.render('admin_products', {
            products,
            session: req.session
        })
    }, 
	productsCreate: (req, res) => {
        res.render('admin_form', {
            // categories, 
            // subcategories,
            session: req.session
        })
    }, 
    productStore: (req, res) => {
        let errors = validationResult(req)
        console.log(errors);
        console.log(products);

        if(errors.isEmpty()){
            let lastId = 1;

            products.forEach(product => {
                if(product.id > lastId){
                    lastId = product.id
                }
            })
    
            let arrayImages = [];
            if(req.files){
                req.files.forEach(image => {
                    arrayImages.push(image.filename)
                })
            }
    
            let {
                name, 
                price, 
                discount, 
                category, 
                description
                } = req.body;
    
            let newProduct = {
                id: lastId + 1,
                name,
                price,
                description,
                discount,
                category,
                image: arrayImages.length > 0 ? arrayImages : "default-image.png"
            };
    
            products.push(newProduct);
    
            writeProductsJSON(products)
    
            res.redirect('/admin/products')
        }else {
            res.render("admin_crear", {
                categories,
                errors: errors.mapped(),
                old: req.body,
                session: req.session
            })
        }
     
    }, 
    productEdit: (req, res) => {
        let product = products.find(product => product.id === +req.params.id)
        res.render('admin_edit', {
            categories, 
            subcategories,
            product,
            session: req.session
        })
    },
    productUpdate: (req, res) => {
        let errors = validationResult(req)

        if(errors.isEmpty()){

        let arrayImages = [];
        if(req.files){
            req.files.forEach(image => {
                arrayImages.push(image.filename)
            })
        }
        
        let {
            name, 
            price, 
            discount, 
            category, 
            subcategory, 
            description
            } = req.body;
        
        products.forEach( product => {
            if(product.id === +req.params.id){
                product.id = product.id,
                product.name = name,
                product.price = price,
                product.description = description,
                product.discount = discount,
                product.category = category,
                product.subcategory = subcategory,
                product.image = arrayImages > 0 ? arrayImages : product.image
                console.log(product)
            }
        })
        writeProductsJSON(products)

        res.redirect('/admin/products')
        } else {
            let product = products.find(product => product.id === +req.params.id)

            res.render("admin_edit", {
                subcategories,
                categories,
                product,
                errors: errors.mapped(),
                old: req.body,
                session: req.session
            })
        }
    },
    productDestroy: (req, res) => {
        products.forEach( product => {
            if(product.id === +req.params.id){
               let productToDestroy = products.indexOf(product);
               products.splice(productToDestroy, 1)
            }
        })
        
        writeProductsJSON(products)

        res.redirect('/admin/products')
    }
}





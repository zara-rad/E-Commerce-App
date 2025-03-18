import ProductsModel from "../models/productsSchema.js"
//GET
export const getAllProducts = async (req, res, next) => {
    //get all products from DB and send to client
    try {
        const products = await ProductsModel.find()//reading data from products collection
        res.send({ success: true, data: products })
    } catch (err) {
        //res.send({ success: false, message: err.message })
        next(err)
    }
}

//GET single product
export const getSingleProduct = async (req, res, next) => {
    //get all products from DB and send to client
    try {
        const singleProduct = await ProductsModel.findById(req.params.id)
        res.send({ success: true, data: singleProduct })

    } catch (err) {
        //res.send({ success: false, message: err.message })
        next(err)
    }

    //res.send("We recieved get request on /products")
}


//POST single product--create product
export const createNewProduct = async (req, res, next) => {
    //create new product in DB and send to client
    try {
        const product = await ProductsModel.create(req.body)//reading data from products collection
        res.send({ success: true, data: product })
    } catch (err) {
        //res.send({ success: false, message: err.message })
        next(err)
    }

    //res.send("We recieved post request on /products")
}

//PATCH updating single product
export const updateSingleProduct = async (req, res, next) => {
    //update product in DB and send to client
    try {
        //find the item,update it depends on id and change it on body/accept the update by this code:{ new: true }
        const updatedProduct = await ProductsModel.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        )
        res.send({ success: true, data: updatedProduct })
    } catch (err) {
        //we wrote middleware so we can get rid of this line from whole code and just write next()
        // res.send({ success: false, message: err.message })
        next(err)
    }
    //res.send("We recieved patch request on /products")
}


//DELETE single product
export const deleteSingleProduct = async (req, res, next) => {
    try {
        const deletedProduct = await ProductsModel.findByIdAndDelete(req.params.id)
        res.send({ success: true, data: deletedProduct })

    } catch (err) {
        //res.send({ success: false, message: err.message })
        next(err)
    }


    //ProductsModel.deleteManyy()... delete everything
    //ProductsModel.deleteManyy("price":2000)... delete all products with this price

    //res.send("We recieved delete request on /products")
}

//model.find()
//model.findById()
//model.findOne()
//model.create()
////model.findByIdAndUpdate()
////model.findByIdAndDelete()

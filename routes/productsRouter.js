const express = require("express")
const router = express.Router()

// // GET ALL PRODUCTS
// router.get("/", (req, res) => {
//   res.send("Get all products")
// // })

// // GET SINGLE PRODUCT
// router.get("/:id", (req, res) => {
//   res.send("Get single product")
// // })

// // FILTER / SEARCH
// router.get("/category/:category", (req, res) => {
//   res.send("Products by category")
// // })


router.get("/", function(req, res){
    res.send("CHAL RAHA HAI!")
})

module.exports = router

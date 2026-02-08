const express = require("express")
const router = express.Router()

// // AUTH
// router.post("/register", (req, res) => {
//   res.send("User register")
// })

// router.post("/login", (req, res) => {
//   res.send("User login")
// })

// // PROFILE
// router.get("/profile", (req, res) => {
//   res.send("User profile")
// })

// // CART
// router.post("/cart/add", (req, res) => {
//   res.send("Add to cart")
// })

// router.put("/cart/update", (req, res) => {
//   res.send("Update cart")
// })

// router.delete("/cart/remove/:productId", (req, res) => {
//   res.send("Remove from cart")
// })

// // ORDERS
// router.post("/order/create", (req, res) => {
//   res.send("Create order")
// })

// router.get("/orders", (req, res) => {
//   res.send("Get user orders")
// })

router.get("/", function(req, res){
    res.send("CHAL RAHA HAI!")
})

module.exports = router

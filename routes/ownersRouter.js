const express = require("express")
const router = express.Router()

// // AUTH
// router.post("/register", (req, res) => {
//   res.send("Owner register")
// })

// router.post("/login", (req, res) => {
//   res.send("Owner login")
// })

// // DASHBOARD
// router.get("/dashboard", (req, res) => {
//   res.send("Owner dashboard")
// })

// // PRODUCT MANAGEMENT
// router.post("/product/create", (req, res) => {
//   res.send("Create product")
// })

// router.put("/product/update/:id", (req, res) => {
//   res.send("Update product")
// })

// router.delete("/product/delete/:id", (req, res) => {
//   res.send("Delete product")
// })

// // ORDER MANAGEMENT
// router.get("/orders", (req, res) => {
//   res.send("All orders")
// })

// router.put("/order/status/:orderId", (req, res) => {
//   res.send("Update order status")
// })

router.get("/", function(req, res){
    res.send("CHAL RAHA HAI!")
})

router.post("/create", function(req, res){
    res.send("CHAL RAHA HAI!")
})

module.exports = router

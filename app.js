const express = require("express")
const app = express()

const db = require("./config/mongoose-connection")
const cookieParser = require("cookie-parser")
const path = require("path")
const ownersRouter = require("./routes/ownersRouter")
const usersRouter = require("./routes/usersRouter")
const productsRouter = require("./routes/productsRouter")

// Middlewares
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, "public")))

// Routes
app.use("/owners", ownersRouter)
app.use("/users", usersRouter)
app.use("/products", productsRouter)

// Health check
app.get("/", (req, res) => {
  res.send("APP is running 🟢");
});

app.listen(3000, () => {
  console.log(`Server is running on port ${3000}`);
})

module.exports = app;

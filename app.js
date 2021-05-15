const express = require("express")
const app = express()

const connectDB = require("./back/database/database")

connectDB()
app.set("view-engine", "ejs")
app.use(express.urlencoded({ extended: false }))
app.use(express.json())
app.use(express.static("./front/static"))

// views
const viewRoute = require("./back/controller/view")
app.use("/", viewRoute)

// users
const userRoute = require("./back/controller/user")
app.use("/", userRoute)

// comments
const commentRoute = require("./back/controller/comment")
app.use("/api", commentRoute)

// subs
const subRoute = require("./back/controller/sub")
app.use("/api", subRoute)

// themes
const themeRoute = require("./back/controller/theme")
app.use("/api", themeRoute)

// startup
const port = 3000
app.listen(port, () => {
    console.log("Listening on port: " + port)
})
import express from "express"

const app = express()

app.use(express.json())


app.post("/website", (req, res) => {
    
})

app.get("/status/:websiteId", (req, res) => {
    
})


app.listen(3000 , ()=>console.log("server running at 3000"))
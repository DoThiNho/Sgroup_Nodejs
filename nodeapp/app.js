const express = require('express')
const app = express()
const port = 3000

const userRoute = require('./routes/user')

app.use(express.json())
app.use('/user', userRoute);

app.listen(port, function(){
    console.log(`Your app running on port ${port}`);
})




const mongoose = require('mongoose')

const connectDB = (url) => {
  return mongoose.connect(url).then(()=>{
    console.log("MongoDB is Connected")
  })
}

module.exports = connectDB

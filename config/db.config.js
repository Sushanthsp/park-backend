const config = require("./config");
const mongoose = require('mongoose')

const connnectDb = async () =>{
    try {
        await mongoose.set('strictQuery', false);

        await mongoose.connect(config.DATABASE_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
          });
          console.log(`Connection established: ${mongoose.connection.name} at ${mongoose.connection.host}:${mongoose.connection.port}`);
    }
    catch (err) {
        process.exit()
        console.log(err)
    }
}

module.exports = connnectDb
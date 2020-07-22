const express = require('express');
const app = express();
const cors = require('cors');
const path = require('path');

// middleware
app.use(cors());
app.use(express.json());

// port && production specs
const port = process.env.PORT || 5000;
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "client/build")));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname,  "client/build", "index.html"));
    });
}


// routes
app.use('/auth', require('./routes/auth'));
app.use('/dashboard', require('./routes/dashboard'));

// server catchall

// server
app.listen(port, ()=>{
  console.log("Server running on port: ", port)
})

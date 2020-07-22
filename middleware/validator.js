module.exports = (req, res, next) => {
  
    const {name, email, password} = req.body;

    const validEmail = (testEmail) => {
      return /^\w+([\.\+-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(testEmail);}
    
    if (req.path ==="/register"){
      if (![name, email, password].every(Boolean)){
        return res.status(403).json('Invalid credentials')
      } else if (!validEmail(email)){
        return res.status(403).json('Invalid email')
      }
    }
    if (req.path === "/login"){
      if (![email, password].every(Boolean)){
        return res.status(403).json('Invalid credentials')
      } else if (!validEmail(email)){
        return res.status(403).json('Invalid email')
      }
    }

  
  next()
}
//middleware to authenticate user using bearer token

const authenticationToken = (req, res, next) => {
    const authHeader = req.headers["authorization"];
    // console.log(authHeader);
    //console.log(req.authorziaion)
    const token = authHeader && authHeader.split(" ")[1];

    if (token === 'token') {
        console.log("Token Authenticated!!!");
        next();
    } else {
        res.status(401).send("Invalid Token");
    }
}

module.exports = authenticationToken;
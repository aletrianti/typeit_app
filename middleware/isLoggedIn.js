const jwt = require("jsonwebtoken");
const jwtSecret = require("../config/config").jwtSecret;

module.exports = (req, res, next) => {
    // Check if the "Authorization" header contains a token;
    const token = req.header('Authorization');

    // If it does not contain a token, send a 401 status with an error and redirect to the '/login route
    if (!token) {
        // res.status(401).send({ error: 'You must log in first.' }); 
        res.redirect('/login');
    }

    // Check if the token corresponds to the one sent when logging in
    // If it is, assign it to the user again when making a new request
    // Otherwise, send a 400 status with an error
    try {
        const verifiedToken = jwt.verify(token, jwtSecret);
        req.user = verifiedToken;
    } catch(err) {
        res.status(400).send(err);
    }

    next();
}
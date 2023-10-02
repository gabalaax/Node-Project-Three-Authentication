// set up token middleware here
import Jwt  from "jsonwebtoken";
import 'dotenv/config';
const PRIVATE_KEY = process.env.PRIVATE_KEY;

function authenticate (req, res, next) {
    const token = req.header.authorization

    if(!token){
        return res.status(403).json({
            massega: "invalid token - missing token",
        });
    }

    const tokenWithOutBearer = token.split(" ") [1];

    //verify token 

    Jwt.verify(tokenWithOutBearer,  PRIVATE_KEY, (error, decoded) => {
        if(error){
            return res.status(401).json({
                massage: "invalid token"
            })
        }
        // decoded
        res.decoded = decoded;

        // sii wad
        next();

    })
}

export default authenticate;
// Setup Sign up and Login API for Owner
import express from 'express';
import prisma from './lib/index.js';
import bcrypt from 'bcrypt';
import JWT from "jsonwebtoken";
import 'dotenv/config';
const PRIVATE_KEY = process.env.PRIVATE_KEY;


const router = express.Router();

router.post("/signup", async (req, res) => {
    const { name, email, password } = req.body

    // sign up owner
    try {
        const existingOwner = await prisma.owner.findUnique({
            where: {
                email, email
            }
        });
        if (existingOwner) {
            return res.status(404).json({ massage: "owner already exist " })
        }
        // hashing password

        const hashedpassword = await bcrypt.hash(password, 10);

        // create owner
        const newOwner = await prisma.owner.create({
            data: {
                name: name,
                email: email,
                password: hashedpassword,
            },

        });
        return res.status(202).json({
            massage: "owner has successfully created ",
            owner: newOwner
        });

    }
    catch (error) {
        return res.status(500).json({ massage: "owner not created" })
    }
});


// owner log in 

router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body

        const existingOwner = await prisma.owner.findUnique({
            where: {
                email, email
            }
        });

        if (!existingOwner) {
            return res.status(404).json({ massage: " owner was not found " })
        };
        // checking password
        const isPasswordCorrect = await bcrypt.compare(
            password, existingOwner.password
        );
        if (!isPasswordCorrect) {
            return res.status(404).json({ massage: "invalid password" })
        }

        // create a token

        const token = JWT.sign(
            { id: existingOwner.id, email: existingOwner.email },
            PRIVATE_KEY,
            { expiresIn: "1hr" }
        )

        return res.status(202).json({ massage: "done", token: token });

    }
    catch (error) {
        return res.status(500).json({ massage: " invalid server" })
    }

});

export default router;
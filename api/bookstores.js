// Create endpoints for bookstores, make sure to use the middleware to authenticate the token
import express from 'express';
import prisma from './lib/index.js';
import authenticate from './middleware/authenticate.js';

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const bookstores = await prisma.bookstore.findMany();
        if (bookstores.length === 0) {
            return res.status(404).json({ error: 'Bookstores not found' });
        }
        res.json(bookstores);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const bookstore = await prisma.bookstore.findUnique({
            where: {
                id: Number(id),
            },
        });

        if (!bookstore) {
            return res.status(404).json({ message: "Bookstore not found" });
        }

        res.json(bookstore);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/', authenticate, async (req, res) => {
    try {
        const { ownerId, name, location } = req.body;
        const bookstore = await prisma.bookstore.create({
            data: {
                ownerId,
                name,
                location,
            },
        });
        if (!bookstore) {
            return res.status(404).json({ error: 'Not created' });
        }
        res.json(bookstore);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.put('/:id', authenticate, async (req, res) => {
    try {
        const { id } = req.params;
        const { ownerId, name, location } = req.body;

        const bookstore = await prisma.bookstore.update({
            where: {
                id: Number(id),
            },
            data: {
                ownerId,
                name,
                location,
            },
        });
        if (!bookstore) {
            return res.status(404).json({ error: 'Not updated' });
        }
        res.json(bookstore);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.delete('/:id', authenticate, async (req, res) => {
    try {
        const { id } = req.params;
        const bookstore = await prisma.bookstore.delete({
            where: {
                id: Number(id),
            },
        });
        if (!bookstore) {
            return res.status(404).json({ error: 'Bookstore not deleted' });
        }
        res.json(bookstore);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

export default router;

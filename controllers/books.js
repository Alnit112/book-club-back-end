const express = require('express');
const verifyToken = require('../middleware/verify-token');
const Book = require('../models/book');
const router = express.Router();

router.post('/', verifyToken, async (req, res) => {
    try {
        req.body.author = req.user._id
        const book = await Book.create(req.body)
        book._doc.author = req.user
        res.status(201).json(book)

    } catch (err) {
        res.status(500).json({ err: err.message })
    }
})

router.get('/', verifyToken, async (req, res) => {
    try {
        const books = await Book.find({})
            .populate('author')
            .sort({ createdAt: 'desc' })
        res.status(200).json(books)


    } catch (err) {
        res.status(500).json({ err: err.message })
    }
})

router.get('/:hootId', verifyToken, async (req, res) => {
    try {
        const book = await Book.findById(req.params.hootId).populate('author')
        res.status(200).json(book)
    } catch (err) {
        res.status(500).json({ err: err.message })
    }
})

router.put('/:bookId', verifyToken, async (req, res) => {
    try {
        const book = await Book.findById(req.params.bookId)

        if (!book.author.equals(req.user._id)) {
            return res.status(403).send("not allowed")
        }

        const updatedBook = await Book.findByIdAndUpdate(
            req.params.bookId,
            req.body,
            { new: true }
        )

        updatedBook._doc.author = req.user

        res.status(200).json(updatedBook);

    } catch (err) {
        res.status(500).json({ err: err.message })
    }
})

router.delete('/:bookId', verifyToken, async (req, res) => {
    try {
        const book = await Book.findById(req.params.bookId)

        if (!book.author.equals(req.user._id)) {
            return res.status(403).send("not allowed")
        }

        const deletedBook = await Book.findByIdAndDelete(req.params.bookId)

        res.status(200).json(deletedBook);
    } catch (err) {
        res.status(500).json({ err: err.message })
    }
})

router.post('/:bookId/comments', verifyToken, async (req, res) => {
    try {
        req.body.author = req.user._id
        const book = await Book.findById(req.params.bookId)
        book.comments.push(req.body)
        await book.save()

        const newComment = book.comments[book.comments.lenght - 1]

        newComment._doc.author = req.user

        res.status(200).json(newComment);
    } catch (err) {
        res.status(500).json({ err: err.message })
    }
})

router.put('/:bookId/comments/:commentId', verifyToken, async (req, res) => {
    try {
        const book = await Book.findById(req.params.bookId)
        const comment = book.comments.id(req.params.commentId)

        if (!comment.author.toString(req.user._id)) {
            return res.status(403).json({message: "not allowed"})
        }
        comment.text = req.body.text
        await book.save()

    } catch (err) {
        res.status(500).json({ err: err.message })
    }
})

router.delete('/:bookId/comments/:commentId', verifyToken, async (req, res) => {
    try {
        const book = await Book.findById(req.params.bookId)
        const comment = book.comments.id(req.params.commentId)
        if (!comment.author.toString(req.user._id)) {
            return res.status(403).json({message: "not allowed"})
        }

        book.comments.remove({ _id: req.params.commentId})
        await book.save()
        res.status(200).json({message: "comment deleted"})

    } catch (err) {
        res.status(500).json({ err: err.message })
    }
})

module.exports = router
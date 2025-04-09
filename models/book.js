const { text } = require('express');
const mongoose = require('mongoose');

const commentSchema = mongoose.Schema({
    text: {
        type: String,
        required: true,
    },
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
})

const bookSchema = mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    text: {
        type: String,
        required: true,
    },
    genre : {
        type: String,
        required: true,
        enum: ['fantasy', 'horror', 'romance', 'sci-fi', 'mystery'],
    },
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    comments: [commentSchema]},
    {timestamps: true})

const Book = mongoose.model('Book', bookSchema);

module.exports = Book
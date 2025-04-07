const mongoose = require('mongoose');

const Book = mongoose.model('Book', bookSchema);

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
})

module.exports = Book
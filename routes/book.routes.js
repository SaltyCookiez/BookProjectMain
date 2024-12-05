/**
 * @swagger
 * components:
 *   schemas:
 *     Book:
 *       type: object
 *       required:
 *         - title
 *         - authorId
 *       properties:
 *         id:
 *           type: integer
 *           description: The auto-generated id of the book
 *         title:
 *           type: string
 *           description: The title of the book
 *         isbn:
 *           type: string
 *           description: The ISBN of the book
 *         publishedYear:
 *           type: integer
 *           description: The publication year
 *         authorId:
 *           type: integer
 *           description: The id of the author
 */

/**
 * @swagger
 * /api/books:
 *   get:
 *     summary: Returns the list of all books
 *     tags: [Books]
 *     responses:
 *       200:
 *         description: The list of books
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Book'
 *   post:
 *     summary: Create a new book
 *     tags: [Books]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Book'
 *     responses:
 *       200:
 *         description: The created book
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Book'
 * 
 * /api/books/{id}:
 *   get:
 *     summary: Get book by id
 *     tags: [Books]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The book id
 *     responses:
 *       200:
 *         description: The book data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Book'
 *       404:
 *         description: The book was not found
 *   put:
 *     summary: Update the book
 *     tags: [Books]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The book id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Book'
 *     responses:
 *       200:
 *         description: The updated book
 *       404:
 *         description: The book was not found
 *   delete:
 *     summary: Delete the book
 *     tags: [Books]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The book id
 *     responses:
 *       200:
 *         description: The book was deleted
 *       404:
 *         description: The book was not found
 */

module.exports = app => {
  const router = require("express").Router();
  const db = require("../models");
  const Book = db.books;

  // Create a new Book
  router.post("/", async (req, res) => {
    console.log('Received POST request to create book:', req.body);
    try {
      // Validate required fields
      if (!req.body.title) {
        return res.status(400).json({ message: "Title is required" });
      }
      if (!req.body.authorId) {
        return res.status(400).json({ message: "Author ID is required" });
      }

      const book = await Book.create(req.body);
      console.log('Book created successfully:', book);
      res.json(book);
    } catch (err) {
      console.error('Error creating book:', err);
      if (err.name === 'SequelizeValidationError') {
        return res.status(400).json({
          message: 'Validation error',
          errors: err.errors.map(e => ({ field: e.path, message: e.message }))
        });
      }
      if (err.name === 'SequelizeForeignKeyConstraintError') {
        return res.status(400).json({
          message: 'Invalid author ID. The specified author does not exist.'
        });
      }
      res.status(500).json({ 
        message: 'Error creating book',
        error: err.message 
      });
    }
  });

  // Get all Books
  router.get("/", async (req, res) => {
    console.log('Received GET request for all books');
    try {
      const books = await Book.findAll({ 
        include: ["author"],
        order: [['createdAt', 'DESC']]
      });
      console.log(`Found ${books.length} books`);
      res.json(books);
    } catch (err) {
      console.error('Error fetching books:', err);
      res.status(500).json({ 
        message: 'Error fetching books',
        error: err.message 
      });
    }
  });

  // Get Book by id
  router.get("/:id", async (req, res) => {
    console.log('Received GET request for book:', req.params.id);
    try {
      const book = await Book.findByPk(req.params.id, { include: ["author"] });
      if (!book) {
        console.log('Book not found:', req.params.id);
        return res.status(404).json({ message: "Book not found" });
      }
      console.log('Found book:', book);
      res.json(book);
    } catch (err) {
      console.error('Error fetching book:', err);
      res.status(500).json({ 
        message: 'Error fetching book',
        error: err.message 
      });
    }
  });

  // Update Book
  router.put("/:id", async (req, res) => {
    console.log('Received PUT request for book:', req.params.id, req.body);
    try {
      const book = await Book.findByPk(req.params.id);
      if (!book) {
        console.log('Book not found for update:', req.params.id);
        return res.status(404).json({ message: "Book not found" });
      }
      await book.update(req.body);
      console.log('Book updated successfully:', book);
      res.json(book);
    } catch (err) {
      console.error('Error updating book:', err);
      if (err.name === 'SequelizeValidationError') {
        return res.status(400).json({
          message: 'Validation error',
          errors: err.errors.map(e => ({ field: e.path, message: e.message }))
        });
      }
      if (err.name === 'SequelizeForeignKeyConstraintError') {
        return res.status(400).json({
          message: 'Invalid author ID. The specified author does not exist.'
        });
      }
      res.status(500).json({ 
        message: 'Error updating book',
        error: err.message 
      });
    }
  });

  // Delete Book
  router.delete("/:id", async (req, res) => {
    console.log('Received DELETE request for book:', req.params.id);
    try {
      const book = await Book.findByPk(req.params.id);
      if (!book) {
        console.log('Book not found for deletion:', req.params.id);
        return res.status(404).json({ message: "Book not found" });
      }
      await book.destroy();
      console.log('Book deleted successfully:', req.params.id);
      res.json({ message: "Book deleted successfully" });
    } catch (err) {
      console.error('Error deleting book:', err);
      res.status(500).json({ 
        message: 'Error deleting book',
        error: err.message 
      });
    }
  });

  app.use('/api/books', router);
};
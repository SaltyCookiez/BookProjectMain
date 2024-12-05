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
    try {
      const book = await Book.create(req.body);
      res.json(book);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });

  // Get all Books
  router.get("/", async (req, res) => {
    try {
      const books = await Book.findAll({ include: ["author"] });
      res.json(books);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });

  // Get Book by id
  router.get("/:id", async (req, res) => {
    try {
      const book = await Book.findByPk(req.params.id, { include: ["author"] });
      if (!book) {
        return res.status(404).json({ message: "Book not found" });
      }
      res.json(book);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });

  // Update Book
  router.put("/:id", async (req, res) => {
    try {
      const book = await Book.findByPk(req.params.id);
      if (!book) {
        return res.status(404).json({ message: "Book not found" });
      }
      await book.update(req.body);
      res.json(book);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });

  // Delete Book
  router.delete("/:id", async (req, res) => {
    try {
      const book = await Book.findByPk(req.params.id);
      if (!book) {
        return res.status(404).json({ message: "Book not found" });
      }
      await book.destroy();
      res.json({ message: "Book deleted successfully" });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });

  app.use('/api/books', router);
};
/**
 * @swagger
 * components:
 *   schemas:
 *     Author:
 *       type: object
 *       required:
 *         - firstName
 *         - lastName
 *       properties:
 *         id:
 *           type: integer
 *           description: The auto-generated id of the author
 *         firstName:
 *           type: string
 *           description: The author's first name
 *         lastName:
 *           type: string
 *           description: The author's last name
 *         biography:
 *           type: string
 *           description: The author's biography
 */

/**
 * @swagger
 * /api/authors:
 *   get:
 *     summary: Returns the list of all authors
 *     tags: [Authors]
 *     responses:
 *       200:
 *         description: The list of authors
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Author'
 *   post:
 *     summary: Create a new author
 *     tags: [Authors]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Author'
 *     responses:
 *       200:
 *         description: The created author
 * 
 * /api/authors/{id}:
 *   get:
 *     summary: Get author by id
 *     tags: [Authors]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The author id
 *     responses:
 *       200:
 *         description: The author data
 *       404:
 *         description: The author was not found
 *   put:
 *     summary: Update the author
 *     tags: [Authors]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The author id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Author'
 *     responses:
 *       200:
 *         description: The updated author
 *       404:
 *         description: The author was not found
 *   delete:
 *     summary: Delete the author
 *     tags: [Authors]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The author id
 *     responses:
 *       200:
 *         description: The author was deleted
 *       404:
 *         description: The author was not found
 */

module.exports = app => {
  const router = require("express").Router();
  const db = require("../models");
  const Author = db.authors;

  // Create a new Author
  router.post("/", async (req, res) => {
    console.log('Received POST request to create author:', req.body);
    try {
      const author = await Author.create(req.body);
      console.log('Author created successfully:', author);
      res.json(author);
    } catch (err) {
      console.error('Error creating author:', err);
      if (err.name === 'SequelizeValidationError') {
        return res.status(400).json({
          message: 'Validation error',
          errors: err.errors.map(e => ({ field: e.path, message: e.message }))
        });
      }
      res.status(500).json({ 
        message: 'Error creating author',
        error: err.message 
      });
    }
  });

  // Get all Authors
  router.get("/", async (req, res) => {
    console.log('Received GET request for all authors');
    try {
      const authors = await Author.findAll({ include: ["books"] });
      console.log(`Found ${authors.length} authors`);
      res.json(authors);
    } catch (err) {
      console.error('Error fetching authors:', err);
      res.status(500).json({ 
        message: 'Error fetching authors',
        error: err.message 
      });
    }
  });

  // Get Author by id
  router.get("/:id", async (req, res) => {
    console.log('Received GET request for author:', req.params.id);
    try {
      const author = await Author.findByPk(req.params.id, { include: ["books"] });
      if (!author) {
        console.log('Author not found:', req.params.id);
        return res.status(404).json({ message: "Author not found" });
      }
      console.log('Found author:', author);
      res.json(author);
    } catch (err) {
      console.error('Error fetching author:', err);
      res.status(500).json({ 
        message: 'Error fetching author',
        error: err.message 
      });
    }
  });

  // Update Author
  router.put("/:id", async (req, res) => {
    console.log('Received PUT request for author:', req.params.id, req.body);
    try {
      const author = await Author.findByPk(req.params.id);
      if (!author) {
        console.log('Author not found for update:', req.params.id);
        return res.status(404).json({ message: "Author not found" });
      }
      await author.update(req.body);
      console.log('Author updated successfully:', author);
      res.json(author);
    } catch (err) {
      console.error('Error updating author:', err);
      if (err.name === 'SequelizeValidationError') {
        return res.status(400).json({
          message: 'Validation error',
          errors: err.errors.map(e => ({ field: e.path, message: e.message }))
        });
      }
      res.status(500).json({ 
        message: 'Error updating author',
        error: err.message 
      });
    }
  });

  // Delete Author
  router.delete("/:id", async (req, res) => {
    console.log('Received DELETE request for author:', req.params.id);
    try {
      const author = await Author.findByPk(req.params.id);
      if (!author) {
        console.log('Author not found for deletion:', req.params.id);
        return res.status(404).json({ message: "Author not found" });
      }
      await author.destroy();
      console.log('Author deleted successfully:', req.params.id);
      res.json({ message: "Author deleted successfully" });
    } catch (err) {
      console.error('Error deleting author:', err);
      res.status(500).json({ 
        message: 'Error deleting author',
        error: err.message 
      });
    }
  });

  app.use('/api/authors', router);
};
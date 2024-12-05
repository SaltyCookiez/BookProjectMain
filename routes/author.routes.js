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
    try {
      const author = await Author.create(req.body);
      res.json(author);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });

  // Get all Authors
  router.get("/", async (req, res) => {
    try {
      const authors = await Author.findAll({ include: ["books"] });
      res.json(authors);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });

  // Get Author by id
  router.get("/:id", async (req, res) => {
    try {
      const author = await Author.findByPk(req.params.id, { include: ["books"] });
      if (!author) {
        return res.status(404).json({ message: "Author not found" });
      }
      res.json(author);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });

  // Update Author
  router.put("/:id", async (req, res) => {
    try {
      const author = await Author.findByPk(req.params.id);
      if (!author) {
        return res.status(404).json({ message: "Author not found" });
      }
      await author.update(req.body);
      res.json(author);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });

  // Delete Author
  router.delete("/:id", async (req, res) => {
    try {
      const author = await Author.findByPk(req.params.id);
      if (!author) {
        return res.status(404).json({ message: "Author not found" });
      }
      await author.destroy();
      res.json({ message: "Author deleted successfully" });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });

  app.use('/api/authors', router);
};
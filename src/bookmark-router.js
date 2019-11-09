const express = require('express')
const uuid = require('uuid/v4')
const logger = require('./logger')
const { bookmarks } = require('./store')

const bookmarkRouter = express.Router()
const bodyParser = express.json()

bookmarkRouter.route('/bookmarks')
  .get((req, res) => {
    res.json(bookmarks)
  })
  .post(bodyParser, (req, res) => {
    const { name, url } = req.body
    if (!name) {
      logger.error('Name is required')
      return res.status(400).send('Invalid data')
    }
    if (!url) {
      logger.error('URL is required')
      return res.status(400).send('Invalid data')
    }
    const id = uuid()
    const bookmark = {
      id,
      name,
      url
    }
    bookmarks.push(bookmark)
    logger.info(`Card with id ${id} created`)
    res.status(201).location(`http://localhost:8000/bookmarks/${id}`).json(bookmark)
  })

bookmarkRouter.route('/bookmarks/:id')
  .get((req, res) => {
    const { id } = req.params
    const bookmark = bookmarks.find(b => b.id == id)
    if (!bookmark) {
      logger.error(`Bookmark with id ${id} not found.`)
      return res.status(404).send('Bookmark not found')
    }
    res.json(bookmark)
  })
  .delete((req, res) => {
    const { id } = req.params
    const bmarkIndex = bookmarks.findIndex(b => b.id == id)
    if (bmarkIndex === -1) {
      logger.error(`Bookmark with id ${id} not found`)
      return res.status(404).send('Not Found')
    }
    bookmarks.splice(bmarkIndex, 1)
    logger.info(`Bookmark with id ${id} deleted`)
    return res.status(204).end()
  })

module.exports = bookmarkRouter

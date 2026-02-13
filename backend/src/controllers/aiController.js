import aiService from '../services/aiService.js'

const aiController = {
  chat: async (req, res, next) => {
    try {
      const { message, history = [] } = req.body
      if (!message?.trim()) {
        return res.status(400).json({ status: 'fail', message: 'Message is required' })
      }
      const reply = await aiService.chat(message, history)
      res.json({ status: 'success', data: { reply } })
    } catch (err) { next(err) }
  },

  getRecommendations: async (req, res, next) => {
    try {
      const preferences = req.body
      const recommendations = await aiService.getRecommendations(req.user?.userId, preferences)
      res.json({ status: 'success', data: { recommendations } })
    } catch (err) { next(err) }
  },
}

export default aiController

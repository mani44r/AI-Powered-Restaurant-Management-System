import { GoogleGenerativeAI } from '@google/generative-ai'
import menuModel from '../models/menuModel.js'
import ApiError from '../utils/apiError.js'

let genAI = null
const getClient = () => {
  if (!genAI) {
    if (!process.env.GEMINI_API_KEY) throw new ApiError(503, 'AI service is not configured')
    genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
  }
  return genAI
}

const aiService = {
  // AI chatbot — answers questions about the restaurant
  chat: async (message, history = []) => {
    const client = getClient()
    const model = client.getGenerativeModel({ model: 'gemini-1.5-flash' })

    const systemPrompt = `You are a helpful assistant for "Spice Garden", an AI-powered Indian restaurant. 
You help customers with menu inquiries, food recommendations, ordering help, and restaurant information.
Be friendly, concise, and always try to suggest menu items when relevant.
Restaurant hours: 11 AM - 11 PM daily.
Location: 123 Food Street, Bangalore, India.
Phone: +91 98765 43210.
Only answer questions related to the restaurant, food, or orders.`

    const chat = model.startChat({
      history: [
        { role: 'user', parts: [{ text: systemPrompt }] },
        { role: 'model', parts: [{ text: 'I understand. I am the Spice Garden assistant, ready to help!' }] },
        ...history.map(h => ({
          role: h.role,
          parts: [{ text: h.content }],
        })),
      ],
    })

    const result = await chat.sendMessage(message)
    return result.response.text()
  },

  // AI food recommendations based on preferences
  getRecommendations: async (userId, preferences = {}) => {
    const client = getClient()
    const model = client.getGenerativeModel({ model: 'gemini-1.5-flash' })

    // Get all available menu items
    const { items } = await menuModel.findAll({ available: true, limit: 50, page: 1 })
    const menuText = items.map(i =>
      `- ${i.name} (${i.category_name}, ₹${i.price}, ${i.is_vegetarian ? 'Veg' : 'Non-veg'}): ${i.description}`
    ).join('\n')

    const prompt = `You are a food recommendation AI for an Indian restaurant.
Based on the customer's preferences and our menu, suggest 4-5 items.

Customer preferences:
- Dietary: ${preferences.dietary || 'No preference'}
- Mood/Occasion: ${preferences.mood || 'Regular meal'}
- Budget per person: ${preferences.budget ? '₹' + preferences.budget : 'Any'}
- Spice level: ${preferences.spice || 'Medium'}

Available menu:
${menuText}

Respond with ONLY a JSON array in this exact format, no other text:
[
  {
    "name": "Item Name",
    "reason": "Why this is recommended in one sentence",
    "price": 280
  }
]`

    const result = await model.generateContent(prompt)
    const text = result.response.text()

    try {
      const jsonMatch = text.match(/\[[\s\S]*\]/)
      if (!jsonMatch) throw new Error('No JSON found')
      const recommendations = JSON.parse(jsonMatch[0])

      // Enrich with actual menu data
      return recommendations.map(rec => {
        const item = items.find(i => i.name.toLowerCase() === rec.name.toLowerCase())
        return {
          ...rec,
          ...( item ? { id: item.id, image_url: item.image_url, category: item.category_name } : {} ),
        }
      })
    } catch {
      throw new ApiError(500, 'Could not parse AI recommendations')
    }
  },
}

export default aiService

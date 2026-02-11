import bcrypt from 'bcryptjs'
import userModel from '../models/userModel.js'
import generateToken from '../utils/generateToken.js'
import ApiError from '../utils/apiError.js'

const authService = {
  register: async ({ name, email, password, phone }) => {
    const exists = await userModel.emailExists(email)
    if (exists) throw new ApiError(409, 'An account with this email already exists')

    const hashedPassword = await bcrypt.hash(password, 12)
    const user = await userModel.create({ name, email, password: hashedPassword, phone })
    const token = generateToken(user)

    return { user, token }
  },

  login: async ({ email, password }) => {
    const user = await userModel.findByEmail(email)
    if (!user) throw new ApiError(401, 'Invalid email or password')

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) throw new ApiError(401, 'Invalid email or password')

    const { password: _, ...safeUser } = user
    const token = generateToken(safeUser)

    return { user: safeUser, token }
  },

  getProfile: async (userId) => {
    const user = await userModel.findById(userId)
    if (!user) throw new ApiError(404, 'User not found')
    return user
  },

  changePassword: async (userId, { currentPassword, newPassword }) => {
    const user = await userModel.findByEmail(
      (await userModel.findById(userId)).email
    )
    const fullUser = await userModel.findByEmail(user.email)
    const isMatch = await bcrypt.compare(currentPassword, fullUser.password)
    if (!isMatch) throw new ApiError(400, 'Current password is incorrect')

    const hashed = await bcrypt.hash(newPassword, 12)
    await userModel.updatePassword(userId, hashed)
  },
}

export default authService

/*
  WHY THIS FILE EXISTS:
  This middleware implements Role-Based Access Control (RBAC).
  It ensures only admins can access admin routes.

  RESPONSIBILITY:
  - Checks if the logged-in user has the 'admin' role
  - Must be used AFTER protect middleware (needs req.user to exist)
  - Rejects non-admin users with 403 Forbidden

  DIFFERENCE BETWEEN 401 AND 403:
  401 Unauthorized = "You are not logged in (not authenticated)"
  403 Forbidden    = "You are logged in but don't have permission (not authorized)"

  USAGE IN ROUTES:
  router.delete('/menu/:id', protect, adminOnly, deleteMenuItem)
                              ↑          ↑
                        checks login  checks admin role

  INTERVIEW QUESTION:
  Q: What is RBAC (Role-Based Access Control)?
  A: A security model where access is granted based on a user's role 
     rather than their individual identity. Instead of saying "user #42 
     can delete menu items", we say "admins can delete menu items."
     This is easier to manage at scale.
*/

import ApiError from '../utils/apiError.js'

// Must be used after protect middleware
export const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next() // User is an admin — proceed
  } else {
    next(new ApiError(403, 'Access denied. Admins only.'))
  }
}

export default adminOnly

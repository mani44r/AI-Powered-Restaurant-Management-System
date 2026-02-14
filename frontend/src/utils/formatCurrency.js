/*
  WHY THIS FILE EXISTS:
  Utility functions are small, pure, reusable helpers.
  
  Instead of writing new Intl.NumberFormat('en-IN', ...) in every 
  component that shows a price, we write it once here.

  INTERVIEW QUESTION:
  Q: What is a pure function?
  A: A function that always returns the same output for the same input,
     and has no side effects (doesn't modify external state).
     formatCurrency(150) will ALWAYS return "₹150.00" — that's pure.
*/

// Format number as Indian Rupees
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
  }).format(amount)
}

// Format a date string to readable format
export const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

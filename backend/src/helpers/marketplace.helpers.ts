interface MarketplaceItemInput {
  title: string;
  description: string;
  price: number | string;
}

interface ValidationResult {
  isValid: boolean;
  error?: string;
}

/**
 * Validate marketplace item input data
 */
export const validateMarketplaceItem = (data: MarketplaceItemInput): ValidationResult => {
  const { title, description, price } = data;

  // Check required fields
  if (!title || title.trim().length === 0) {
    return { isValid: false, error: 'Title is required' };
  }

  if (!description || description.trim().length === 0) {
    return { isValid: false, error: 'Description is required' };
  }

  if (price === undefined || price === null || price === '') {
    return { isValid: false, error: 'Price is required' };
  }

  // Validate title length
  if (title.trim().length > 100) {
    return { isValid: false, error: 'Title must be 100 characters or less' };
  }

  // Validate description length
  if (description.trim().length > 500) {
    return { isValid: false, error: 'Description must be 500 characters or less' };
  }

  // Validate price
  const numericPrice = typeof price === 'string' ? parseFloat(price) : price;
  if (isNaN(numericPrice) || numericPrice < 0) {
    return { isValid: false, error: 'Price must be a valid positive number' };
  }

  if (numericPrice > 10000) {
    return { isValid: false, error: 'Price must be $10,000 or less' };
  }

  return { isValid: true };
};

/**
 * Format marketplace item for API response
 */
export const formatMarketplaceItem = (item: any) => {
  return {
    id: item.id,
    title: item.title,
    description: item.description,
    price: item.price,
    status: item.status,
    user: {
      id: item.user.id,
      name: item.user.name,
      email: item.user.email
    },
    createdAt: item.createdAt,
    updatedAt: item.updatedAt
  };
};
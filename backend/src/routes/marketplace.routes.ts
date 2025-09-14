import { Router } from 'express';
import {
  getAllMarketplaceItems,
  getUserMarketplaceItems,
  getRecommendedMarketplaceItems,
  getMarketplaceItemById,
  createMarketplaceItem,
  updateMarketplaceItem,
  deleteMarketplaceItem
} from '../controllers/marketplace.controllers';

const router = Router();

// GET /marketplace - Get all marketplace items
router.get('/', getAllMarketplaceItems);

// GET /marketplace/user/:userId - Get marketplace items for a specific user
router.get('/user/:userId', getUserMarketplaceItems);

// GET /marketplace/recommended/:userId - Get recommended items (excluding user's own items)
router.get('/recommended/:userId', getRecommendedMarketplaceItems);

// GET /marketplace/:id - Get a specific marketplace item by ID
router.get('/:id', getMarketplaceItemById);

// POST /marketplace - Create a new marketplace item
router.post('/', createMarketplaceItem);

// PUT /marketplace/:id - Update a marketplace item
router.put('/:id', updateMarketplaceItem);

// DELETE /marketplace/:id - Delete a marketplace item
router.delete('/:id', deleteMarketplaceItem);

export default router;
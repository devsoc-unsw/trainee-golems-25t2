import { Request, Response } from 'express';
import { marketplaceService } from '../services/marketplace.service';
import { validateMarketplaceItem } from '../helpers/marketplace.helpers';

/**
 * Get all marketplace items
 */
export const getAllMarketplaceItems = async (req: Request, res: Response) => {
  try {
    const items = await marketplaceService.getAllItems();
    res.json(items);
  } catch (error) {
    console.error('Error fetching marketplace items:', error);
    res.status(500).json({ error: 'Failed to fetch marketplace items' });
  }
};

/**
 * Get marketplace items for current user
 */
export const getUserMarketplaceItems = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const items = await marketplaceService.getUserItems(userId);
    res.json(items);
  } catch (error) {
    console.error('Error fetching user marketplace items:', error);
    res.status(500).json({ error: 'Failed to fetch user marketplace items' });
  }
};

/**
 * Get recommended marketplace items (excluding current user's items)
 */
export const getRecommendedMarketplaceItems = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const items = await marketplaceService.getRecommendedItems(userId);
    res.json(items);
  } catch (error) {
    console.error('Error fetching recommended marketplace items:', error);
    res.status(500).json({ error: 'Failed to fetch recommended marketplace items' });
  }
};

/**
 * Get a specific marketplace item by ID
 */
export const getMarketplaceItemById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const item = await marketplaceService.getItemById(id);
    
    if (!item) {
      return res.status(404).json({ error: 'Marketplace item not found' });
    }
    
    res.json(item);
  } catch (error) {
    console.error('Error fetching marketplace item:', error);
    res.status(500).json({ error: 'Failed to fetch marketplace item' });
  }
};

/**
 * Create a new marketplace item
 */
export const createMarketplaceItem = async (req: Request, res: Response) => {
  try {
    const { userId, title, description, price } = req.body;
    
    // Validate input
    const validation = validateMarketplaceItem({ title, description, price });
    if (!validation.isValid) {
      return res.status(400).json({ error: validation.error });
    }
    
    const newItem = await marketplaceService.createItem({
      userId,
      title,
      description,
      price: parseFloat(price),
      status: 'available'
    });
    
    res.status(201).json(newItem);
  } catch (error) {
    console.error('Error creating marketplace item:', error);
    res.status(500).json({ error: 'Failed to create marketplace item' });
  }
};

/**
 * Update a marketplace item
 */
export const updateMarketplaceItem = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { title, description, price, status } = req.body;
    
    // Validate input
    const validation = validateMarketplaceItem({ title, description, price });
    if (!validation.isValid) {
      return res.status(400).json({ error: validation.error });
    }
    
    const updatedItem = await marketplaceService.updateItem(id, {
      title,
      description,
      price: parseFloat(price),
      status
    });
    
    if (!updatedItem) {
      return res.status(404).json({ error: 'Marketplace item not found' });
    }
    
    res.json(updatedItem);
  } catch (error) {
    console.error('Error updating marketplace item:', error);
    res.status(500).json({ error: 'Failed to update marketplace item' });
  }
};

/**
 * Delete a marketplace item
 */
export const deleteMarketplaceItem = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const deletedItem = await marketplaceService.deleteItem(id);
    
    if (!deletedItem) {
      return res.status(404).json({ error: 'Marketplace item not found' });
    }
    
    res.json({ message: 'Marketplace item deleted successfully' });
  } catch (error) {
    console.error('Error deleting marketplace item:', error);
    res.status(500).json({ error: 'Failed to delete marketplace item' });
  }
};
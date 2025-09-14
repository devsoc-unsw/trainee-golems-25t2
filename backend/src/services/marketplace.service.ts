import { prisma } from '../lib/prisma';

interface CreateMarketplaceItemData {
    userId: string;
    title: string;
    description: string;
    price: number;
    status: string;
}

interface UpdateMarketplaceItemData {
    title?: string;
    description?: string;
    price?: number;
    status?: string;
}

export const marketplaceService = {
    /**
     * Get all marketplace items with user information
     */
    async getAllItems() {
        return await prisma.marketplaceItem.findMany({
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        });
    },

    /**
     * Get marketplace items for a specific user
     */
    async getUserItems(userId: string) {
        return await prisma.marketplaceItem.findMany({
            where: {
                userId: userId
            },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        });
    },

    /**
     * Get recommended items (excluding user's own items)
     */
    async getRecommendedItems(userId: string) {
        return await prisma.marketplaceItem.findMany({
            where: {
                userId: {
                    not: userId
                }
            },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        });
    },

    /**
     * Get a specific marketplace item by ID
     */
    async getItemById(id: string) {
        return await prisma.marketplaceItem.findUnique({
            where: {
                id: id
            },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true
                    }
                }
            }
        });
    },

    /**
     * Create a new marketplace item
     */
    async createItem(data: CreateMarketplaceItemData) {
        return await prisma.marketplaceItem.create({
            data: {
                userId: data.userId,
                title: data.title,
                description: data.description,
                price: data.price,
                status: data.status
            },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true
                    }
                }
            }
        });
    },

    /**
     * Update a marketplace item
     */
    async updateItem(id: string, data: UpdateMarketplaceItemData) {
        try {
            return await prisma.marketplaceItem.update({
                where: {
                    id: id
                },
                data: {
                    ...(data.title && { title: data.title }),
                    ...(data.description && { description: data.description }),
                    ...(data.price && { price: data.price }),
                    ...(data.status && { status: data.status })
                },
                include: {
                    user: {
                        select: {
                            id: true,
                            name: true,
                            email: true
                        }
                    }
                }
            });
        } catch (error: unknown) {
            // If record not found, return null
            if (error && typeof error === 'object' && 'code' in error && error.code === 'P2025') {
                return null;
            }
            throw error;
        }
    },

    /**
     * Delete a marketplace item
     */
    async deleteItem(id: string) {
        try {
            return await prisma.marketplaceItem.delete({
                where: {
                    id: id
                }
            });
        } catch (error: unknown) {
            // If record not found, return null
            if (error && typeof error === 'object' && 'code' in error && error.code === 'P2025') {
                return null;
            }
            throw error;
        }
    }
};
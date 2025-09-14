import { requestHelper } from "./wrapper";

// Test helper functions for marketplace endpoints
export async function requestGetAllMarketplaceItems() {
  return await requestHelper({
    method: "GET",
    path: "/api/marketplace",
  });
}

export async function requestGetUserMarketplaceItems(userId: string) {
  return await requestHelper({
    method: "GET",
    path: `/api/marketplace/user/${userId}`,
  });
}

export async function requestGetRecommendedMarketplaceItems(userId: string) {
  return await requestHelper({
    method: "GET",
    path: `/api/marketplace/recommended/${userId}`,
  });
}

export async function requestGetMarketplaceItemById(id: string) {
  return await requestHelper({
    method: "GET",
    path: `/api/marketplace/${id}`,
  });
}

export async function requestCreateMarketplaceItem(
  userId: string,
  title: string,
  description: string,
  price: number
) {
  return await requestHelper({
    method: "POST",
    path: "/api/marketplace",
    payload: {
      userId,
      title,
      description,
      price,
    },
  });
}

export async function requestUpdateMarketplaceItem(
  id: string,
  title?: string,
  description?: string,
  price?: number,
  status?: string
) {
  return await requestHelper({
    method: "PUT",
    path: `/api/marketplace/${id}`,
    payload: {
      ...(title && { title }),
      ...(description && { description }),
      ...(price && { price }),
      ...(status && { status }),
    },
  });
}

export async function requestDeleteMarketplaceItem(id: string) {
  return await requestHelper({
    method: "DELETE",
    path: `/api/marketplace/${id}`,
  });
}

export async function requestClear() {
  return await requestHelper({
    method: "DELETE",
    path: "/clear",
  });
}
/**
 * Integration guide for connecting Frontend and Backend
 */

# 🔗 Frontend-Backend Integration Guide

## Backend Endpoints Overview

### 1. **Products API**
- `GET /api/products` - Get all products
- `GET /api/products/{id}` - Get product by ID
- `GET /api/products/category/{category}` - Get products by category

### 2. **Authentication API**
- `POST /api/auth/verify` - Verify Firebase token
- Headers: `Authorization: Bearer <firebase_token>`

### 3. **Users API**
- `GET /api/users/{firebaseUid}` - Get user profile
- `PUT /api/users/{firebaseUid}` - Update user profile
- `GET /api/users/{firebaseUid}/preferences` - Get user preferences
- `GET /api/users/{firebaseUid}/addresses` - Get user addresses

### 4. **Basket API**
- `GET /api/basket/user/{firebaseUid}` - Get basket
- `POST /api/basket/add` - Add item to basket
  - Params: `firebaseUid`, `productId`, `quantity`
- `DELETE /api/basket/user/{firebaseUid}` - Clear basket
- `DELETE /api/basket/user/{firebaseUid}/item/{productId}` - Remove item
- `PUT /api/basket/user/{firebaseUid}/item/{productId}` - Update quantity

### 5. **Subscriptions API**
- `GET /api/subscriptions/user/{firebaseUid}` - Get user subscriptions
- `POST /api/subscriptions` - Create subscription
- `PUT /api/subscriptions/{id}` - Update subscription
- `DELETE /api/subscriptions/{id}` - Cancel subscription
- `POST /api/subscriptions/{id}/pause` - Pause subscription
- `POST /api/subscriptions/{id}/resume` - Resume subscription

### 6. **Orders API**
- `POST /api/orders/create` - Create order from basket
- `GET /api/orders/user/{firebaseUid}` - Get user orders
- `GET /api/orders/{id}` - Get order details
- `POST /api/orders/{id}/cancel` - Cancel order

### 7. **Recommendations API**
- `GET /api/recommendations/user/{firebaseUid}` - Get recommendations for user
- `GET /api/recommendations/product/{productId}` - Get similar products

### 8. **Wishlist API**
- `GET /api/wishlist/user/{firebaseUid}` - Get wishlist
- `POST /api/wishlist/user/{firebaseUid}/product/{productId}` - Add to wishlist
- `DELETE /api/wishlist/user/{firebaseUid}/product/{productId}` - Remove from wishlist

---

## Setup Instructions

### Step 1: Configure Environment Variables
Create `.env.local` in the frontend root:

```env
VITE_API_BASE_URL=http://localhost:8081/api
VITE_FIREBASE_API_KEY=your_key
VITE_FIREBASE_AUTH_DOMAIN=your_domain
VITE_FIREBASE_PROJECT_ID=your_project
VITE_FIREBASE_STORAGE_BUCKET=your_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_id
VITE_FIREBASE_APP_ID=your_app_id
```

### Step 2: Import API Services
```javascript
import { productAPI, basketAPI, userAPI } from '@/services/api';
```

### Step 3: Use in Components
```javascript
import { useFetch, useApiMutation } from '@/services/useApi';

function ProductsList() {
  // Fetch products on mount
  const { data: products, loading, error } = useFetch(productAPI.getAll);
  
  // Handle API calls with mutation
  const { execute: addToBasket, loading: isAdding } = useApiMutation(
    (productId, quantity) => basketAPI.addItem(userUid, productId, quantity),
    { onSuccess: () => alert('Added to basket!') }
  );

  return (
    <>
      {loading && <div>Loading...</div>}
      {error && <div>Error: {error}</div>}
      {products?.map(product => (
        <div key={product.id}>
          <h3>{product.name}</h3>
          <button onClick={() => addToBasket(product.id, 1)}>
            {isAdding ? 'Adding...' : 'Add to Basket'}
          </button>
        </div>
      ))}
    </>
  );
}
```

### Step 4: Authentication Flow

1. **User signs up/login with Firebase** (on frontend)
2. **Frontend gets Firebase token** from `getAuth().currentUser.getIdToken()`
3. **API client automatically adds token** to Authorization header
4. **Backend validates token** and identifies user

```javascript
// Automatic in apiClient.js
const token = await getAuth().currentUser.getIdToken();
headers.Authorization = `Bearer ${token}`;
```

### Step 5: Error Handling

```javascript
import { getErrorMessage } from '@/services/errorHandler';

try {
  await productAPI.getAll();
} catch (error) {
  const userMessage = getErrorMessage(error);
  console.error(userMessage);
}
```

---

## Testing Connection

### 1. Test Products Endpoint
```bash
curl http://localhost:8081/api/products
```

### 2. Test with Authentication
```bash
curl -H "Authorization: Bearer YOUR_FIREBASE_TOKEN" \
     http://localhost:8081/api/users/USER_UID
```

### 3. Frontend Test
```javascript
import { productAPI } from '@/services/api';

// Test in browser console
productAPI.getAll().then(products => console.log(products));
```

---

## CORS Configuration (Backend)

Ensure your backend has CORS enabled:

```java
@Configuration
public class CorsConfig implements WebMvcConfigurer {
  @Override
  public void addCorsMappings(CorsRegistry registry) {
    registry.addMapping("/api/**")
      .allowedOrigins("http://localhost:5173", "http://localhost:3000")
      .allowedMethods("GET", "POST", "PUT", "DELETE")
      .allowedHeaders("*")
      .allowCredentials(true);
  }
}
```

---

## API Documentation Files

- **`apiClient.js`** - HTTP client with Firebase auth
- **`api.js`** - All API endpoint modules
- **`useApi.js`** - React hooks for API calls
- **`errorHandler.js`** - Error handling utilities
- **`config.js`** - Centralized configuration

---

## Common Issues & Solutions

### Issue: "CORS error"
**Solution**: Add CORS configuration to backend

### Issue: "401 Unauthorized"
**Solution**: Check Firebase token is being sent in Authorization header

### Issue: "API not found"
**Solution**: Verify `VITE_API_BASE_URL` matches backend port (8081)

### Issue: "Network Error"
**Solution**: Ensure backend is running on `http://localhost:8081`


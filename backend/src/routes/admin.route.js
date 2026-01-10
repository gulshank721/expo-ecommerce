import { Router } from 'express';
import {
  createProduct,
  deleteProduct,
  getAllCustomers,
  getAllOrders,
  getAllProducts,
  getDashboardStats,
  updateOrderStatus,
  updateProduct,
} from '../controllers/admin.controller.js';
import { adminOnly, protectRoute } from '../middleware/auth.middleware.js';
import { upload } from '../middleware/multer.middleware.js';

const router = Router();
// Apply authentication and admin authorization middleware
router.use(protectRoute, adminOnly);
router.get('/dashboard', (req, res) => {
  res.json({ message: 'Welcome to the Admin Dashboard' });
});
router.get('/products', getAllProducts);
router.post('/products', upload.array('images', 3), createProduct);
router.delete('/products/:id', deleteProduct);
router.put('/products/:id', upload.array('images', 3), updateProduct);

//PUT is used to update full resource replacement, update the entire product
//PATCH is used to update partial resource, update only specific fields of the product
router.get('/orders', getAllOrders);
router.patch('/orders/:id/status', updateOrderStatus);
router.get('/customers', getAllCustomers);
router.get('/stats', getDashboardStats);

export default router;

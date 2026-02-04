import express from 'express';
import {
    getAllProductsController,
    getProductByIdController,
    createProductController,
    updateProductController,
    deleteProductController,
    getReportController
} from '../controllers/productController.js';
import upload from '../middleware/upload.js';

const router = express.Router();

router.get('/', getAllProductsController)
router.get('/report', getReportController)
router.get('/:id', getProductByIdController)
router.post('/', upload.single('image'), createProductController)
router.put('/:id', upload.single('image'), updateProductController)
router.delete('/:id', deleteProductController)


export default router;
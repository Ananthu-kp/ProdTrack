import * as productService from '../services/productService.js';


export const getAllProductsController = async (req, res) => {
    try {
        const products = await productService.getAllProducts();

        res.status(200).json({
            success: true,
            data: products
        });
    } catch (error) {
        console.error('Get products error:', error);
        res.status(500).json({ message: 'Failed to fetch products' });
    }
};


export const getProductByIdController = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await productService.getProductById(id);

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        res.status(200).json({
            success: true,
            data: product
        });
    } catch (error) {
        console.error('Get product error:', error);
        res.status(500).json({ message: 'Failed to fetch product' });
    }
};


export const createProductController = async (req, res) => {
    try {
        const validation = productService.validateProductData(req.body);

        if (!validation.valid) {
            if (req.file) {
                productService.deleteProductImage(req.file.filename);
            }

            return res.status(400).json({
                success: false,
                message: 'Validation failed',
                errors: validation.errors
            });
        }

        const imageName = req.file ? req.file.filename : 'default-product.jpg';

        const newProduct = await productService.createProduct(req.body, imageName);

        res.status(201).json({
            success: true,
            message: 'Product created successfully',
            data: newProduct
        });

    } catch (error) {
        console.error('Create product error:', error);

        if (req.file) {
            productService.deleteProductImage(req.file.filename);
        }
        res.status(500).json({ message: 'Failed to create product' });
    }
};


export const updateProductController = async (req, res) => {
    try {
        const { id } = req.params;

        const newImageName = req.file ? req.file.filename : null;

        const updatedProduct = await productService.updateProduct(id, req.body, newImageName);

        res.status(200).json({
            success: true,
            message: 'Product updated successfully',
            data: updatedProduct
        });

    } catch (error) {
        console.error('Update product error:', error);

        if (req.file) {
            productService.deleteProductImage(req.file.filename);
        }

        if (error.message === 'Product not found') {
            return res.status(404).json({ message: error.message });
        }
        res.status(500).json({ message: 'Failed to update product' });
    }
};


export const deleteProductController = async (req, res) => {
    try {
        const { id } = req.params;

        await productService.deleteProduct(id);

        res.status(200).json({
            success: true,
            message: 'Product deleted successfully'
        });

    } catch (error) {
        console.error('Delete product error:', error);

        if (error.message === 'Product not found') {
            return res.status(404).json({ message: error.message });
        }
        res.status(500).json({ message: 'Failed to delete product' });
    }
};


export const getReportController = async (req, res) => {
    try {
        const reportData = await productService.getProductReport();

        res.status(200).json({
            success: true,
            data: reportData
        });

    } catch (error) {
        console.error('Get report error:', error);
        res.status(500).json({ message: 'Failed to generate report' });
    }
};
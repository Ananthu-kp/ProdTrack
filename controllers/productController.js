import db from '../config/db.js';
import fs from 'fs';
import path from 'path';


export const getAllProducts = async (req, res) => {
    try {
        const [products] = await db.query(
            'SELECT * FROM products ORDER BY created_at DESC'
        );

        res.status(200).json({
            success: true,
            data: products
        });

    } catch (error) {
        console.error('Get products error:', error);
        res.status(500).json({ message: "Failed to fetch products" });
    }
};


export const getProductById = async (req, res) => {
    try {
        const { id } = req.params;

        const [products] = await db.query(
            'SELECT * FROM products WHERE id = ?',
            [id]
        );

        if (products.length === 0) {
            return res.status(404).json({ message: 'Product not found' });
        }

        res.status(200).json({
            success: true,
            data: products[0]
        });

    } catch (error) {
        console.error('Get product error:', error);
        res.status(500).json({ message: 'Failed to fetch product' });
    }
};


export const createProduct = async (req, res) => {
    try {
        const { name, description, price, quantity, category } = req.body;

        if (!name || !price || !quantity) {
            return res.status(400).json({ message: 'Name, price and quantity are required' });
        }

        const image = req.file ? req.file.filename : 'default-product.jpg';

        // Insert product into database
        const [result] = await db.query(
            'INSERT INTO products (name, description, price, quantity, category, image) VALUES (?, ?, ?, ?, ?, ?)',
            [name, description, price, quantity, category, image]
        );

        const [newProduct] = await db.query(
            'SELECT * FROM products WHERE id = ?',
            [result.insertId]
        );

        res.status(201).json({
            success: true,
            message: 'Product created successfully',
            data: newProduct[0]
        });

    } catch (error) {
        console.error('Create product error:', error);
        if (req.file) {
            fs.unlinkSync(req.file.path);
        }
        res.status(500).json({ message: 'Failed to create product' });
    }
};


export const updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description, price, quantity, category } = req.body;

        const [existingProduct] = await db.query(
            'SELECT * FROM products WHERE id = ?',
            [id]
        );

        if (existingProduct.length === 0) {
            return res.status(404).json({ message: 'Product not found' });
        }

        let image = existingProduct[0].image;

        if (req.file) {
            image = req.file.filename;

            const oldImage = existingProduct[0].image;
            if (oldImage !== 'default-product.jpg') {
                const oldImagePath = path.join('public/uploads', oldImage);
                if (fs.existsSync(oldImagePath)) {
                    fs.unlinkSync(oldImagePath);
                }
            }
        }

        await db.query(
            'UPDATE products SET name = ?, description = ?, price = ?, quantity = ?, category = ?, image = ? WHERE id = ?',
            [name, description, price, quantity, category, image, id]
        );

        const [updatedProduct] = await db.query(
            'SELECT * FROM products WHERE id = ?',
            [id]
        );

        res.status(200).json({
            success: true,
            message: 'Product updated successfully',
            data: updatedProduct[0]
        });

    } catch (error) {
        console.error('Update product error:', error);
        if (req.file) {
            fs.unlinkSync(req.file.path);
        }
        res.status(500).json({ message: 'Failed to update product' });
    }
};


export const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;

        // Get product to find image filename
        const [product] = await db.query(
            'SELECT * FROM products WHERE id = ?',
            [id]
        );

        if (product.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }

        // Delete product from database
        await db.query('DELETE FROM products WHERE id = ?', [id]);

        // Delete product image if not default
        const imageName = product[0].image;
        if (imageName !== 'default-product.jpg') {
            const imagePath = path.join('public/uploads', imageName);
            if (fs.existsSync(imagePath)) {
                fs.unlinkSync(imagePath);
            }
        }

        res.status(200).json({
            success: true,
            message: 'Product deleted successfully'
        });

    } catch (error) {
        console.error('Delete product error:', error);
        res.status(500).json({ message: 'Failed to delete product' });
    }
};


export const getReport = async (req, res) => {
    try {
        // Get total number of products
        const [countResult] = await db.query(
            'SELECT COUNT(*) as totalProducts FROM products'
        );

        // Get total inventory value 
        const [valueResult] = await db.query(
            'SELECT SUM(price * quantity) as totalValue FROM products'
        );

        // Get total quantity of all products
        const [quantityResult] = await db.query(
            'SELECT SUM(quantity) as totalQuantity FROM products'
        );

        // Get category-wise count
        const [categoryResult] = await db.query(
            'SELECT category, COUNT(*) as count FROM products GROUP BY category'
        );

        res.status(200).json({
            success: true,
            data: {
                totalProducts: countResult[0].totalProducts,
                totalValue: valueResult[0].totalValue || 0,
                totalQuantity: quantityResult[0].totalQuantity || 0,
                categoryBreakdown: categoryResult
            }
        });

    } catch (error) {
        console.error('Get report error:', error);
        res.status(500).json({ message: 'Failed to generate report' });
    }
};
import db from '../config/db.js';
import fs from 'fs';
import path from 'path';


export const getAllProducts = async () => {
    const [products] = await db.query(
        'SELECT * FROM products ORDER BY created_at DESC'
    );
    return products;
};


export const getProductById = async (id) => {
    const [products] = await db.query(
        'SELECT * FROM products WHERE id = ?',
        [id]
    );
    return products.length > 0 ? products[0] : null;
};


export const createProduct = async (productData, imageName = 'default-product.jpg') => {
    const { name, description, price, quantity, category } = productData;
    
    const [result] = await db.query(
        'INSERT INTO products (name, description, price, quantity, category, image) VALUES (?, ?, ?, ?, ?, ?)',
        [name, description, price, quantity, category, imageName]
    );
    
    // Fetch and return created product
    return await getProductById(result.insertId);
};


export const updateProduct = async (id, productData, newImageName = null) => {
    const { name, description, price, quantity, category } = productData;
    
    const existingProduct = await getProductById(id);
    
    if (!existingProduct) {
        throw new Error('Product not found');
    }
    
    const imageName = newImageName || existingProduct.image;
    
    // If new image uploaded, delete old one
    if (newImageName && existingProduct.image !== 'default-product.jpg') {
        deleteProductImage(existingProduct.image);
    }
    
    await db.query(
        'UPDATE products SET name = ?, description = ?, price = ?, quantity = ?, category = ?, image = ? WHERE id = ?',
        [name, description, price, quantity, category, imageName, id]
    );
    
    return await getProductById(id);
};


export const deleteProduct = async (id) => {
    const product = await getProductById(id);
    
    if (!product) {
        throw new Error('Product not found');
    }
    
    await db.query('DELETE FROM products WHERE id = ?', [id]);
    
    if (product.image !== 'default-product.jpg') {
        deleteProductImage(product.image);
    }
    
    return true;
};


export const deleteProductImage = (imageName) => {
    const imagePath = path.join('public/uploads', imageName);
    if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
    }
};


export const getProductReport = async () => {
    const [countResult] = await db.query(
        'SELECT COUNT(*) as totalProducts FROM products'
    );
    
    // Total inventory value
    const [valueResult] = await db.query(
        'SELECT SUM(price * quantity) as totalValue FROM products'
    );
    
    // Total quantity
    const [quantityResult] = await db.query(
        'SELECT SUM(quantity) as totalQuantity FROM products'
    );
    
    // Category breakdown
    const [categoryResult] = await db.query(
        'SELECT category, COUNT(*) as count FROM products GROUP BY category'
    );
    
    return {
        totalProducts: countResult[0].totalProducts,
        totalValue: valueResult[0].totalValue || 0,
        totalQuantity: quantityResult[0].totalQuantity || 0,
        categoryBreakdown: categoryResult
    };
};


export const validateProductData = (productData) => {
    const errors = [];
    const { name, price, quantity } = productData;
    
    if (!name || name.trim() === '') {
        errors.push('Product name is required');
    }
    
    if (!price || isNaN(price) || price <= 0) {
        errors.push('Valid price is required');
    }
    
    if (quantity === undefined || isNaN(quantity) || quantity < 0) {
        errors.push('Valid quantity is required');
    }
    
    return {
        valid: errors.length === 0,
        errors
    };
};
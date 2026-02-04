import express from 'express'
import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'

import authRoutes from './routes/authRoutes.js'
import productRoutes from './routes/productRoutes.js'

dotenv.config()

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
const PORT = process.env.PORT || 3000

// middleware
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static(path.join(__dirname, 'public')))

// routes
app.use('/api/auth', authRoutes)
app.use('/api/products', productRoutes)

// pages
app.get('/', (_, res) =>
    res.sendFile(path.join(__dirname, 'public/login.html'))
)

app.get('/dashboard', (_, res) =>
    res.sendFile(path.join(__dirname, 'public/dashboard.html'))
)

// 404
app.use((_, res) =>
    res.status(404).json({ message: 'Route not found' })
)

// error handler
app.use((err, req, res, next) => {
    console.error(err)
    res.status(500).json({ message: 'Internal server error' })
})

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`)
})

export default app

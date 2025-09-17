import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import 'dotenv/config'
import path from 'path'
import { fileURLToPath } from 'url'
import express from 'express'
// Cấu hình Swagger

const port = process.env.PORT || 4000

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const rootDir = path.resolve(__dirname, '..')

const swaggerDistPath = path.join(rootDir, 'node_modules', 'swagger-ui-dist');

const servers = process.env.NODE_ENV === 'production'
    ? [
        {
            url: 'https://ecommerce-be-psi-five.vercel.app',
            description: 'Production server',
        },
    ]
    : [
        {
            url: `http://localhost:${port}`,
            description: 'Development server',
        },
    ]

const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'E-Commerce API',
            version: '1.0.0',
        },
        servers,
        tags: [
            { name: "Users", description: "User management" },
            { name: "Admin", description: "Admin login" },
            { name: "Products", description: "Product management (Admin)" },
            { name: "Carts", description: "Cart management (User)" },
            { name: "Orders", description: "Order management" },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: "http",
                    scheme: "bearer",
                    bearerFormat: "JWT",
                },
            },
        },
        security: [
            {
                bearerAuth: [],
            },
        ],
    },
    apis: [
        path.join(rootDir, 'swagger/paths/*.yml'),
        path.join(rootDir, 'models/*.js'),
    ],
}


const swaggerSpec = swaggerJSDoc(swaggerOptions)

export default (app) => {
    // Serve static files từ swagger-ui-dist trước (fix MIME type issues)
    app.use('/api/docs', express.static(swaggerDistPath, { index: false }))
    app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))
}
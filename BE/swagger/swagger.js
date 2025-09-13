import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import 'dotenv/config'

// Cấu hình Swagger

const port = process.env.PORT || 4000

const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'E-Commerce API',
            version: '1.0.0',
        },
        servers: [
            {
                url: `http://localhost:${port}`,
                description: 'Development server',
            },
            {
                url: `https://ecommerce-be-psi-five.vercel.app`,
                description: 'Deploy(Vercel) server',
            }
        ],
        tags: [
            { name: "Users", description: "User management" },
            { name: "Admin", description: "Admin login" },
            { name: "Products", description: "Product management" },
            { name: "Carts", description: "Cart management" },
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
    apis: ['./swagger/paths/*.yml', './models/*.js'],
};


const swaggerSpec = swaggerJSDoc(swaggerOptions)

export default (app) => {
    app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))
}
import db from "../../utils/db.mjs";

export const handler = async (event) => {
    try {
        const { queryStringParameters } = event;
        const query = queryStringParameters?.query || "";

        // Get products from DynamoDB
        const products = await db.scan(process.env.PRODUCT_TABLE);

        console.log("Nhat");

        // If query parameter is provided, filter products
        let filteredProducts = products;
        if (query) {
            const lowercaseQuery = query.toLowerCase();
            filteredProducts = products.filter(
                (product) =>
                    product.name.toLowerCase().includes(lowercaseQuery) ||
                    product.description.toLowerCase().includes(lowercaseQuery)
            );
        }

        return {
            statusCode: 200,
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
            },
            body: JSON.stringify(filteredProducts),
        };
    } catch (error) {
        console.error("Error fetching products:", error);

        return {
            statusCode: 500,
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
            },
            body: JSON.stringify({
                message: "Error fetching products",
                error: error.message,
            }),
        };
    }
};

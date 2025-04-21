import db from '../../utils/db.mjs';

/**
 * Lambda handler to get a single product by ID
 */
export const handler = async (event) => {
  try {
    const { id } = event.pathParameters;
    
    // Get product from DynamoDB
    const product = await db.get(process.env.PRODUCT_TABLE, id);
    
    if (!product) {
      return {
        statusCode: 404,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({ message: 'Product not found' })
      };
    }
    
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify(product)
    };
  } catch (error) {
    console.error('Error fetching product:', error);
    
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({ message: 'Error fetching product', error: error.message })
    };
  }
};
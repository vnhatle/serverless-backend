import { v4 as uuidv4 } from 'uuid';
import db from '../../utils/db.mjs';

export const handler = async (event) => {
  try {
    const { body } = event;
    const orderData = JSON.parse(body);
    
    // Get user information from the event context (Auth from Cognito)
    const userId = event.requestContext.authorizer.claims.sub;
    const userEmail = event.requestContext.authorizer.claims.email;
    
    // Create new order with generated ID
    const order = {
      id: uuidv4(),
      userId,
      userEmail,
      items: orderData.items,
      totalPrice: orderData.totalPrice,
      status: 'pending',
      shippingAddress: orderData.shippingAddress,
      paymentMethod: orderData.paymentMethod,
      createdAt: new Date().toISOString(),
    };
    
    // Save order to DynamoDB
    const result = await db.put(process.env.ORDER_TABLE, order);
    
    return {
      statusCode: 201,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify(result)
    };
  } catch (error) {
    console.error('Error creating order:', error);
    
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({ message: 'Error creating order', error: error.message })
    };
  }
};
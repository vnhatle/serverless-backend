import db from '../../utils/db.mjs';

export const handler = async (event) => {
  try {
    // Get user ID from the event context (Auth from Cognito)
    const userId = event.requestContext.authorizer.claims.sub;
    
    // Query orders by userId from the global secondary index
    const params = {
      TableName: process.env.ORDER_TABLE,
      IndexName: 'UserIdIndex',
      KeyConditionExpression: 'userId = :userId',
      ExpressionAttributeValues: {
        ':userId': userId
      }
    };
    
    const result = await db.query(params);
    
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify(result.Items || [])
    };
  } catch (error) {
    console.error('Error fetching orders:', error);
    
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({ message: 'Error fetching orders', error: error.message })
    };
  }
};
import db from '../../utils/db.mjs';

export const handler = async (event) => {
  try {
    // Get user ID from the event context (Auth from Cognito)
    const requestingUserId = event.requestContext.authorizer.claims.sub;
    
    // Get requested user ID from path parameters
    const { id } = event.pathParameters;
    
    // Users can only access their own profile
    if (id !== requestingUserId && id !== 'me') {
      return {
        statusCode: 403,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({ message: 'Forbidden: You can only access your own profile' })
      };
    }
    
    // If 'me' is specified, use the requesting user's ID
    const userId = id === 'me' ? requestingUserId : id;
    
    // Get user from DynamoDB
    const user = await db.get(process.env.USER_TABLE, userId);
    
    if (!user) {
      return {
        statusCode: 404,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({ message: 'User not found' })
      };
    }
    
    // Don't return sensitive information
    const { password, ...userInfo } = user;
    
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify(userInfo)
    };
  } catch (error) {
    console.error('Error fetching user:', error);
    
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({ message: 'Error fetching user', error: error.message })
    };
  }
};
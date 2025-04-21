import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { 
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
  QueryCommand,
  ScanCommand,
  DeleteCommand
} from "@aws-sdk/lib-dynamodb";

// Initialize the DynamoDB client
const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

// Common DB operations
const db = {
  /**
   * Get an item from a DynamoDB table by ID
   * @param {string} table - Table name
   * @param {string} id - Item ID
   * @returns {Promise} - Item data
   */
  get: async (table, id) => {
    const params = {
      TableName: table,
      Key: { id }
    };
    
    const { Item } = await docClient.send(new GetCommand(params));
    return Item;
  },

  /**
   * Query items from a DynamoDB table
   * @param {Object} params - Query parameters
   * @returns {Promise} - Query result
   */
  query: async (params) => {
    return await docClient.send(new QueryCommand(params));
  },

  /**
   * Scan all items from a DynamoDB table
   * @param {string} table - Table name
   * @returns {Promise} - Scan result
   */
  scan: async (table) => {
    const params = {
      TableName: table
    };
    
    const { Items } = await docClient.send(new ScanCommand(params));
    return Items;
  },

  /**
   * Put an item into a DynamoDB table
   * @param {string} table - Table name
   * @param {Object} item - Item to put
   * @returns {Promise} - Put result
   */
  put: async (table, item) => {
    const params = {
      TableName: table,
      Item: item
    };
    
    await docClient.send(new PutCommand(params));
    return item;
  },

  /**
   * Delete an item from a DynamoDB table
   * @param {string} table - Table name
   * @param {string} id - Item ID
   * @returns {Promise} - Delete result
   */
  delete: async (table, id) => {
    const params = {
      TableName: table,
      Key: { id }
    };
    
    return await docClient.send(new DeleteCommand(params));
  }
};

export default db;
import { Client, Databases } from 'node-appwrite';

// This Appwrite function will be executed every time your function is triggered
export default async ({ req, res, log, error }) => {
  // Hardcoded Appwrite configuration
  const APPWRITE_ENDPOINT = "https://cloud.appwrite.io/v1"; // Replace with your endpoint
  const PROJECT_ID = "67317d0100250021489f"; // Replace with your project ID
  const DATABASE_ID = "67317e6000069e6c10c9"; // Replace with your database ID
  const COLLECTION_ID = "67317eca00290232aa78"; // Replace with your collection ID
  const APPWRITE_API_KEY = "standard_ebc15b8b03726bfeb75ee3153cda1c16c0d353697508f691e3552a0e3c5e07d2d376c62e0b9c8ee742dec9f206eaa48f2916388d7fb907b32a69a0cad3f7571e52758602c60841549ed475cc557cbb9324404387d31f5d123e5c9ba1f126abab5cc14a8efbec8197afffba59636c2359f4618b48d396aac79134203d4563af6a"; // Replace with your API key

  // Initialize Appwrite client
  const client = new Client()
    .setEndpoint(APPWRITE_ENDPOINT)
    .setProject(PROJECT_ID)
    .setKey(APPWRITE_API_KEY);

  // Initialize Databases service
  const databases = new Databases(client);

  try {
    // List documents from the collection, sorted by $createdAt in descending order
    const response = await databases.listDocuments(
      DATABASE_ID, // Your database ID
      COLLECTION_ID, // Your collection ID
      [], // Optional filters (empty in this case)
      1, // Limit the result to just 1 document
      0, // Skip 0 documents (you can adjust this for pagination)
      ['$createdAt:desc'] // Sort by $createdAt field in descending order
    );

    // Check if there are any documents returned
    if (response.documents.length > 0) {
      // Return the most recent document
      const latestDocument = response.documents[0];
      log("Latest document:", latestDocument);
      return res.json(latestDocument);
    } else {
      // No documents found
      const errorResponse = { error: "No documents found in the collection" };
      log(errorResponse);
      return res.json(errorResponse);
    }
  } catch (err) {
    // Log and return any error that occurs
    log("Error fetching the latest document:", err);
    return res.json({ error: "Could not fetch the latest document", message: err.message });
  }
};

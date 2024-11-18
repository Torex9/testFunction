import { Client, Databases } from 'node-appwrite';

// This Appwrite function will be executed every time your function is triggered
export default async ({ req, res, log, error }) => {
  // Initialize Appwrite client
  const client = new Client()
    .setEndpoint(process.env.APPWRITE_FUNCTION_API_ENDPOINT)
    .setProject(process.env.APPWRITE_FUNCTION_PROJECT_ID)
    .setKey(req.headers['x-appwrite-key'] ?? '');

  // Initialize Databases service
  const databases = new Databases(client);

  try {
    // Check if the request is for fetching the latest item from the collection
    if (req.path === "/latest-item") {
      // List documents from the collection, sorted by createdAt in descending order
      const response = await databases.listDocuments(
        process.env.APPWRITE_DATABASE_ID, // Your database ID
        process.env.APPWRITE_COLLECTION_ID, // Your collection ID
        [], // Optional filters (empty in this case)
        1, // Limit the result to just 1 document
        0, // Skip 0 documents (you can adjust this for pagination)
        ['createdAt:desc'] // Sort by createdAt field in descending order
      );

      // Check if there are any documents returned
      if (response.documents.length > 0) {
        // Return the most recent document
        return res.json(response.documents[0]);
      } else {
        // No documents found
        return res.json({ error: "No documents found in the collection" });
      }
    }

    // Default response for other paths
    return res.json({
      motto: "Build like a team of hundreds_",
      learn: "https://appwrite.io/docs",
      connect: "https://appwrite.io/discord",
      getInspired: "https://builtwith.appwrite.io",
    });

  } catch (err) {
    // Log and return any error that occurs
    error("Could not fetch the latest document: " + err.message);
    return res.json({ error: "Could not fetch the latest document", message: err.message });
  }
};

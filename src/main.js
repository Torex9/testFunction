import { Client, Databases } from 'node-appwrite';

// This Appwrite function will be executed every time your function is triggered
export default async ({ req, res, log, error }) => {
 
  // Initialize Appwrite client
  const client = new Client()
    .setEndpoint(process.env.NEXT_PUBLIC_ENDPOINT)
    .setProject(process.env.PROJECT_ID)
    .setKey(process.env.API_KEY);

  // Initialize Databases service
  const databases = new Databases(client);

  try {
    // List documents from the collection, sorted by $createdAt in descending order
    const response = await databases.listDocuments(
      process.env.DATABASE_ID, // Your database ID
      process.env.APPOINTMENT_COLLECTION_ID, // Your collection ID
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

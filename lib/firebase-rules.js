// This file is for reference only - you need to copy these rules to your Firebase console

// Firestore Rules
rules_version = "2"
\
service cloud.firestore
{
  match / databases / { database } / documents
  // Allow read access to all documents for all users
  match / { document=** }
  allow
  if true;

  // Temporarily allow all write operations while debugging
  // IMPORTANT: Change this back to more restrictive rules after fixing the issue
  allow
  if true;
}


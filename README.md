Project Reflection: The Digital Gallery

For this project, I integrated The Metropolitan Museum of Art Collection API. It’s a massive, open-access RESTful service that provides data on over 470,000 objects. Unlike many modern APIs that require complex OAuth handshakes, The Met’s API is beautifully public, though it requires a bit of "data mining" to get exactly what you need.

The Problem It Solves

Museums can be overwhelming. When you’re standing in a gallery or browsing a massive website, it’s easy to lose the "story" of a piece behind walls of text or confusing navigation. This app aims to solve the accessibility and focus problem. It takes the sprawling data of the world’s largest art museum and distills it into a minimalist, "catalog-first" mobile experience. It’s designed for the user who wants to appreciate a high-resolution image first, then dive into the academic provenance (medium, period, and dimensions) without being buried in a cluttered UI. It turns a massive database into a private, pocket-sized exhibition.

The Most Difficult Part of Integration

The most challenging aspect wasn't actually the "fetch"—it was the data consistency and parsing. Because The Met’s collection spans thousands of years, the data is inherently "messy." Some objects have high-res primary images; others only have small thumbnails or no images at all.

Handling the itemData transfer between the gallery list and the detail screen was a specific pain point. I had to ensure that if a user clicked a piece with missing metadata, the app wouldn't crash. I spent a significant amount of time writing "guard clauses" and safety checks—like the logic to switch between primaryImage and primaryImageSmall—to ensure the UI stayed elegant even when the API returned incomplete information. Dealing with the "Unexpected token" errors during JSON parsing taught me a lot about how expo-router handles stringified objects versus actual objects.

What I Would Improve with More Time

If I had another week, I’d focus on interactive immersion.

Shared Element Transitions: I’d love to make the transition from the list to the detail screen "seamless," where the image physically grows into the cover photo rather than just a standard screen slide.

Pinch-to-Zoom: While the fullscreen modal works, adding a true pinch-to-zoom gesture (using Reanimated and Gesture Handler) would let users inspect the brushstrokes of a painting, which is vital for an art app.

Offline Caching: Currently, the app relies entirely on a live connection. Implementing a caching layer (like react-native-fast-image) would allow users to revisit their "Favorite" pieces even when they’re in a basement gallery with no signal.

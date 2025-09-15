 
# Blogging Platform – AI-Powered Community Engagement

The Blogging Platform is an interactive, AI-driven space built with React, Material UI, Firebase, and Docker-powered ElasticSearch. It allows users to explore diverse topics, create and engage with posts, and receive AI-generated replies. With personalized recommendations, real-time notifications, and advanced search capabilities, the platform enhances community interaction and knowledge sharing, while offering role-based permissions.


## Features

- **Navigation Bar** with the following topics:
  - Academic Resources  
  - Career Services  
  - Campus  
  - Culture  
  - Local Community Resources  
  - Social  
  - Sports  
  - Health and Wellness  
  - Technology  
  - Travel  
  - Alumni  

- **User Authentication**  
  - Users can log in as one of the following personas:
    - Student  
    - Faculty  
    - Staff  
    - Moderator  
    - Administrator  

- **Post Management**  
  - Every user can:
    - Create a post  
    - Reply to a post  
    - View a post  
 
- **Moderator Permissions**  
  - Moderators can delete posts from any topic.

- **Administrator Permissions**  
  - Administrators can enable or disable user login accounts.

- **Subscribe and Unsubscribe to Topics**  
  - Users can subscribe or unsubscribe to topics and will be notified of new posts within the subscribed topics.

- **OpenAI-Generated Replies**  
  - Users can generate replies to posts using the OpenAI Chat Completion Endpoint.
  - A toggle switch is provided to enable or disable OpenAI-generated replies.

- **ElasticSearch for Post Storage and Search**  
  - All posts are stored in **ElasticSearch** for fast and scalable storage.
  - Users can search for posts on any topic using ElasticSearch.

- **OpenAI-Assisted Activity Recommendations**  
  - Users can ask the OpenAI-assisted agent for activity recommendations based on:
    - Current weather conditions.
    - Real-time events (e.g., sports events).
    - The user’s location for nearby activities.

## Technologies Used
- React
- Material UI
- React Router
- Firebase
- ElasticSearch
- OpenAI API
- SERP API (for activity recommendations)

## Setup Instructions

### **1. OpenAI API Key Configuration**
Before running the project, make sure to replace the placeholder in the OpenAI configuration file with your actual API key.

- **File to update**: `openai.ts`
- **Steps**:
  1. Go to the **OpenAI website** (https://platform.openai.com/) and generate a new API key.
  2. Copy your API key and replace the placeholder in `openai.ts`:
    ```ts
    const openaiApiKey = "YOUR_OPENAI_API_KEY_HERE"; // Replace with your API key
    ```

### **2. SERP API Key for Activity Recommendations**
For the OpenAI-assisted agent to recommend activities, you'll need an API key from **SERP API**.

- **File to update**: `activityRecommendation.tsx`
- **Steps**:
  1. Go to the **SERP API website** (https://serpapi.com/) and sign up.
  2. Generate a new **API key**.
  3. Replace the placeholder in `activityRecommendation.tsx` with your API key:
    ```tsx
    const serpApiKey = "YOUR_SERP_API_KEY_HERE"; // Replace with your SERP API key
    ```

### **3. Firebase Configuration**
Set up Firebase for authentication and database management.

- **File to update**: `firebase.ts`
- **Steps**:
  1. Go to the **Firebase Console** (https://console.firebase.google.com/).
  2. Create a new Firebase project or use an existing one.
  3. Add a new web app and copy the Firebase configuration details.
  4. Replace the placeholders in `firebase.ts`:
    ```ts
    const firebaseConfig = {
      apiKey: "YOUR_API_KEY_HERE",
      authDomain: "YOUR_PROJECT_DOMAIN_HERE",
      projectId: "YOUR_PROJECT_NAME_HERE",
      appId: "YOUR_APP_ID_HERE",
    };
    ```

---

## **Usage**
- Run `npm start` to launch the development server.
- Navigate through the different topics using the navigation bar.
- Log in as different user personas (Student, Faculty, Staff, Moderator, Administrator) to test permissions.
- Create, reply to, and view posts based on topics.
- Test the admin and moderator functionalities.
- Subscribe and unsubscribe from topics to receive notifications.
- Generate OpenAI-powered replies and toggle the feature on or off.
- Search for posts using the ElasticSearch feature.
- Ask the OpenAI-assisted agent for activity recommendations based on weather, real-time events, and location.

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.  
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.  
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.  
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the build folder.  
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.  
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you eject, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can eject at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc.) right into your project so you have full control over them. All of the commands except eject will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use eject. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)

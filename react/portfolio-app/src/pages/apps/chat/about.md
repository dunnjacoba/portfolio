# Chat Feature

The Chat.jsx is a functional component that, when mounted to the VDOM, leverages the ChatArea.jsx and ChatUsers.jsx information to allow the display of user profiles and conversations between the currently logged in user and their selected recipient.

The ChatUsers.jsx creates a list of the databases user profiles through information gathered via an API call using the Axios library. When the page is loaded, an asynchronous call goes through the API channels built in ASP.Net, is then verified, and then the request is fulfilled and returned to the client.

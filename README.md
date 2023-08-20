# Art Museum Senior Project

This project is a social media chat application, intended to simulate the
interactions found in a physical art museum.

## Available Services

The project application comes equipped with these services to enhance the 
user experience:

### `Global Chat`

Talk to every user on the application!
Users are allowed to react to each other's messages with emojis, as well as
post them individually in the interface. Owned messages can also be edited
and deleted if need be.

### `Image Board`

The image board allows all users to post any images and videos of artistic
nature. This interface currently accepts .jpg/jpeg, png, .mp4 and .webm file
formats. Users are also able to react to each other's posts on the board.

### `Comment Sections/Threads`

In addition to the image board's functionalities, users may also set up
private threads under any post they desire. This allows for users
to have one-on-one conversations about a particular artpiece (Max 200 words
per message).

## Usage Notes

### `Instructions`
A fully functional version of the application can be found at the URL https://art-museum-project.github.io/. Users are required to input their email in order to receive a "magic link" in their inbox, which will send them to the chat page or redirect them to a user setup page if they're new to the system. The application may take 20 seconds or more to load up sometimes, usually for new users or ones who haven't used it in a while.  
The main app will not operate locally as a result of Supabase's authentication settings (the email login link will always redirect to the website instead of localhost).

### `Known Issues`

-At times, the emoji picker will turn into a "1" when slow mode is toggled in a channel. This issue also affects the deactivated picker on the image board.  
  
-Videos can be sent to the web version of the image board, but they can't be played. For now, the current workaround is to right-click the video and play it in a new tab.  
  
-When logging in, the app opens a separate page in order to send users to the chat/setup page. No fix has been found for this yet, so users are encouraged to close the email login tab after receiving their magic link.  
  
-There is no logout button for the application yet. In order to logout properly, tech-savvy users can utilize their browser's page inspector and manually delete their user access token. (On Chrome, this can be done by going to Application >> Local Storage >> [Page Name] and deleting the key with the phrase "auth-token" in it.)  
  
-When entering the app's login page, there is an error that says "Cannot read properties of null (reading 'id')". This is presumably caused by App.js trying to render the Chat Page before a session is properly established, and no fix has been found for it yet. It doesn't stop the app from functioning, though, so it can be safely ignored.
  
-On the Username Setup page, there is a similar error that says "invalid input syntax for type uuid: 'undefined'". This error does not impact the functionality of the app, and can be safely accepted and ignored.
  
-The Stream Chat system utilizes the username values as a user's ID value as well. Due to this, the app enters an infinite loading cycle on the Username Setup page if the name contains a space or special characters. This can be fixed by refreshing the page and inputting a different username.  

## Development Information

This project was developed using these tools:  

### `Coding Languages`

JavaScript  
CSS  
HTML5  

### `Frontend/Backend Services`
Create React App  
Stream Chat API  
Supabase Database Platform  
Render Web Services  

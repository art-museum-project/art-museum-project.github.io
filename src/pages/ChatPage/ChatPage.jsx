import React, { useEffect, useState } from 'react';
import {
  Chat,
  Channel,
  MessageList,
  MessageInput,
  Thread,
  Window,
  ChannelHeader,
} from 'stream-chat-react';
import UpdateUserProfile from "./../UpdateUserProfile/UpdateUserProfile";
import { supabase } from "./../../supabaseClient";
import { StreamChat } from 'stream-chat';
import axios from "axios";
import ReactLoading from "react-loading";

import 'stream-chat-react/dist/css/index.css';
import './../../style.css';

const apiKey = process.env.REACT_APP_STREAM_API_KEY

export const ChatPage = ({ session }) => {
  // Keep track of chat instance state
  const [client, setClient] = useState(null);
  const [username, setUsername] = useState(null);
  const [loading, setLoading] = useState(true);

  // Initial user setup (acquiring data from Supabase server)
  useEffect(() => {
    async function getProfile() {
      try {
        setLoading(true);
        const { data: { user } } = await supabase.auth.getUser();
        let { data, error, status } = await supabase
          .from("profiles")
          .select(`username`)
          .eq("id", user.id) // Cause of "Cannot read properties of null (reading 'id')",
          // required to send users directly to chat page when logged in (it forces the user
          // to set up their username every time if removed)
          .single();
        if (error && status !== 406) {
          throw error;
        }
        if (data) {
          setUsername(data.username);
        }
      } catch (error) {
        alert(error.message);
      } finally {
        setLoading(false);
      }
    }
    // If the user is authenticated by the time the page loads, get their username
    // session from Supabase
    if (session) {
      getProfile();
    }
  }, []);

  // The next two useEffect() functions handle the initialization of the app's channels.
  const [channel, setChannel] = useState(null);

    useEffect(() => {
      async function initChat() {

        // 1. create a new Stream Chat client
        const chatClient = StreamChat.getInstance(process.env.REACT_APP_STREAM_API_KEY)

        // 2. Generate a user token for the current user (use your port)
        const res = await axios.post("https://art-museum-backend.onrender.com/getToken", {
          id: username,
        });
        // 3. Connect the current user to the Stream Chat API
        await chatClient.connectUser(
          {
            id: username,
           name: username,
          },
          res.data.token
        );
        
        // 4. Acquire data for the current channel
        const channel = chatClient.channel('messaging', 'art-chat', {
          name: "ArtMakers Inc.",
        })
        await channel.watch;
        // 5. Add the current user to the channel members
        channel.addMembers([username]);
        setChannel(channel)
        setClient(chatClient)
      }

      if (username) {
        // initialize the chat app
        initChat();
      }

      return () => {
        // disconnect the chat client when the component unmounts
        if (client) {
          client.disconnectUser();
        }
      };

    }, [username])

    const [channel2, setChannel2] = useState(null);

    useEffect(() => {
      async function initChat() {
        // 1. create a new Stream Chat client
        const chatClient = StreamChat.getInstance(process.env.REACT_APP_STREAM_API_KEY)

        // 2. Generate a user token for the current user (use your port)
        const res = await axios.post("https://art-museum-backend.onrender.com/getToken", {
          id: username,
        });
        // 3. Connect the current user to the Stream Chat API
        await chatClient.connectUser(
          {
            id: username,
           name: username,
          },
          res.data.token
        );

        // 4. Acquire data for the current channel
        const channel2 = chatClient.channel('images', 'image-board', {
          name: "Image Board",
        })

        await channel2.watch()
        // 5. Add the current user to the channel members
        channel2.addMembers([username]);
        setChannel2(channel2)
        setClient(chatClient)
      }

      if (username) {
        // initialize the chat app
        initChat();
      }

      return () => {
        // disconnect the chat client when the component unmounts
        if (client) {
          client.disconnectUser();
        }
      };

    }, [username])

    // Display loading bars if channel isn't initialized yet
    if (username && (!client || !channel)) {
      return <div className= {"LoadingBars"}>
      <ReactLoading
      type={"bars"}
      color={"#1e90ff"}
      height={100}
      width={100}
      />
      </div>;
    }

    // Display loading bars during Supabase authentication check
    if (loading) {
      return <div className = {"LoadingBars"}>
      <ReactLoading
      type={"bars"}
      color={"#1e90ff"}
      height={100}
      width={100}
      />
      </div>;
    }

    // If email doesn't have an associated username, redirect user to setup page
    const noUsername = !username;
    if (noUsername) {
      return (
        <UpdateUserProfile
          key={session.user.id}
          session={session}
          setChatUsername={setUsername}
        />
      );
    }

    // Custom object to disable the use of text emojis in image board channel
     const CustomEmoji = () => {
      return null;
     }

    // This return function tells the application how its chat interface should be structured
    return (
    <Chat client={client} theme="messaging dark">
      <Channel channel = {channel}>
        <Window>
          <ChannelHeader />
          <MessageList hideDeletedMessages='true' messageActions={ ["edit", "delete", "quote", "react", "reply"] }/>
          <MessageInput />
        </Window>
      </Channel>
      <Channel channel = {channel2} EmojiIcon={CustomEmoji} EmojiPicker={CustomEmoji}>
        <Window >
          <MessageList hideDeletedMessages='true' messageActions={ ["edit", "delete", "react", "reply"] }/>
          <MessageInput disabled={true}/>
        </Window>
        <Thread />
      </Channel>
    </Chat>
    )
}


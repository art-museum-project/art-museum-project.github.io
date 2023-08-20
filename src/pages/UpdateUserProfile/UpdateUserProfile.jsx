// pages/UpdateUserProfile/UpdateUserProfile.jsx
import { useState, useEffect } from "react";
import { supabase } from "./../../supabaseClient";
import Styles from "./../../main.module.css";

export default function UpdateUserProfile({ session, setChatUsername }) {
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState(null);

  useEffect(() => {
    getProfile();
  }, [session]);

  // Initial user setup (acquiring data from Supabase server)
  async function getProfile() {
    try {
      setLoading(true);
      const user = supabase.auth.getUser();
      let { data, error, status } = await supabase
        .from("profiles")
        .select(`username`)
        .eq("id", user.id) // Appears to be the source of the undefined UUID error,
        // but required to login users properly.
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

  // This function handles the addition of a username to a designated user,
  // establishing it in the Supabase and Stream Chat databases.
  async function updateProfile({ username }) {
    try {
      setLoading(true);
      const user = supabase.auth.getUser();
      const updates = {
        id: user.id,
        username,
        updated_at: new Date(),
      };
      let { error } = await supabase.from("profiles").upsert(updates, {
        returning: "minimal", // Supabase shouldn't return the value after inserting
      });
      if (error) {
        throw error;
      }
      // update the chatpage component about the new username
      setChatUsername(username);
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  }
  return (
    <div className={Styles.Container}>
      <div className={Styles.FormWrap}>
        <h1 className={Styles.Heading}>Please choose a username!</h1>
        <p className={Styles.Description}>This cannot be changed later, so choose wisely. <br />
        Username Characters Allowed: a-z, 0-9, @, _, -</p>
        <div className={Styles.InputWrapper}>
          <label htmlFor='email'>Email</label>
          <input
            className={Styles.InputField}
            id='email'
            type='text'
            value={session.user.email}
            disabled
          />
        </div>
        <div className={Styles.InputWrapper}>
          <label htmlFor='username'>Username</label>
          <input
            className={Styles.InputField}
            id='username'
            type='text'
            value={username || ""}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div className={Styles.InputWrapper}>
          <button
            className={Styles.Button}
            onClick={() => updateProfile({ username })}
            disabled={loading}
          >
            {loading ? "Loading ..." : "Update"}
          </button>
        </div>
      </div>
    </div>
  );
}
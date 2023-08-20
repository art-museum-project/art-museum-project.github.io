// pages/Auth.jsx
import { useState } from "react";
import { supabase } from "./../../supabaseClient";
import Styles from "./../../main.module.css";

// This function handles the authentication service, sending a magic link to
// the designated email.
export default function Auth() {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const handleAuthentication = async (email) => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signInWithOtp({ email });
      if (error) throw error;
      alert("Magic link sent! Please check your email for a message from noreply@mail.app.supabase.io, and close this page afterwards.");
    } catch (error) {
      alert(error.error_description || error.message);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className={Styles.Container}>
      <div className={Styles.FormWrap}>
        <h1 className={Styles.Heading}>Welcome to the Art Museum!</h1>
        <p className={Styles.Description}>
          Enter your email to sign in via magic link.
        </p>
        <div className={Styles.InputWrapper}>
          <input
            className={Styles.InputField}
            type='email'
            placeholder='john.doe@email.com'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className={Styles.InputWrapper}>
          <button
            onClick={(e) => {
              e.preventDefault();
              handleAuthentication(email);
            }}
            className={Styles.Button}
            disabled={loading}
          >
            {loading ? <span>Loading</span> : <span>Send my magic link</span>}
          </button>
        </div>
      </div>
    </div>
  );
}
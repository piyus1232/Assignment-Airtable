import axios from "axios";
import qs from "qs";
import crypto from "crypto";
import User from "../models/User.js";

// utils
function base64URLEncode(buffer) {
  return buffer
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

function sha256(buffer) {
  return crypto.createHash("sha256").update(buffer).digest();
}

// Step 1: Redirect to Airtable
export const loginWithAirtable = (req, res) => {
  const state = crypto.randomBytes(16).toString("hex");
  const codeVerifier = base64URLEncode(crypto.randomBytes(32));
  const codeChallenge = base64URLEncode(sha256(Buffer.from(codeVerifier)));

  req.session.codeVerifier = codeVerifier;
  req.session.state = state;

  const redirectUri = encodeURIComponent(process.env.AIRTABLE_REDIRECT_URI);

  const authUrl = `https://airtable.com/oauth2/v1/authorize?client_id=${process.env.AIRTABLE_CLIENT_ID}&redirect_uri=${redirectUri}&response_type=code&scope=data.records:read data.records:write schema.bases:read&state=${state}&code_challenge=${codeChallenge}&code_challenge_method=S256`;

  res.redirect(authUrl);
};

// Step 2: Handle callback
export const airtableCallback = async (req, res) => {
  const { code, state } = req.query;

  if (!state || state !== req.session.state) {
    return res.redirect(`${process.env.CLIENT_URL}/login?error=invalid_state`);
  }

  try {
    const credentials = Buffer.from(
      `${process.env.AIRTABLE_CLIENT_ID}:${process.env.AIRTABLE_CLIENT_SECRET}`
    ).toString("base64");

    const tokenResponse = await axios.post(
      "https://airtable.com/oauth2/v1/token",
      qs.stringify({
        grant_type: "authorization_code",
        code,
        redirect_uri: process.env.AIRTABLE_REDIRECT_URI,
        code_verifier: req.session.codeVerifier,
      }),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: `Basic ${credentials}`,
        },
      }
    );

    const tokens = tokenResponse.data;

    // 🔹 Fetch Airtable user profile
    let email = "unknown@example.com";
    try {
      const profile = await axios.get("https://api.airtable.com/v0/meta/whoami", {
        headers: { Authorization: `Bearer ${tokens.access_token}` },
      });
      email = profile.data?.user?.email || email;
    } catch (err) {
      console.warn(
        "Could not fetch Airtable user profile:",
        err.response?.data || err.message
      );
    }

    // 🔹 Save/update Mongo user
    let user = await User.findOne({ email });
    if (!user) {
      user = await User.create({
        email,
        airtableToken: tokens.access_token,
        airtableRefreshToken: tokens.refresh_token,
      });
    } else {
      user.airtableToken = tokens.access_token;
      user.airtableRefreshToken = tokens.refresh_token;
      await user.save();
    }

    // ✅ Redirect to frontend (production)
    res.redirect(`${process.env.CLIENT_URL}/dashboard?user_id=${user._id}`);
  } catch (err) {
    console.error(
      "OAuth token exchange failed:",
      err.response?.data || err.message
    );
    res.redirect(`${process.env.CLIENT_URL}/login?error=oauth_failed`);
  }
};

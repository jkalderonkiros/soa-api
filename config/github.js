/**
 * Created by raphaeljlps on 30/01/17.
 */

module.exports.github = {
  clientId: process.env.GH_CLIENT_ID || "09b4a517b0346943a4cd",
  secret: process.env.GH_CLIENT_SECRET || "8c385cdca26311a7b869f9255087854870917835",

  authorize_url: "https://github.com/login/oauth/authorize",
  access_token_url: "https://github.com/login/oauth/access_token",
  user_url: "https://api.github.com/user",
  user_emails_url: "https://api.github.com/user/emails",

  scopes: "user:email,repo"
};

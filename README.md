# zapier-alert-script

A Zapier trigger for OpenBazaar alerts.

This script connects to your OpenBazaar server to gather new notifications and chat messages. It formats them into readable lines, and passes them to Zapier, an automation service similar to IFTTT. Zapier can send them to email, SMS, Slack, and many other apps. This is one way to receive alerts in lieu of a mobile client for OpenBazaar.

The script runs directly in Zapier's Code Trigger environment—just copy and paste it in.

## How to use

[Install and manually run](https://slack-files.com/T02FPGBKB-F0KJU1CLX-cbbcf8a02c) the OpenBazaar Server, if you haven't already.

> You'll need to include the flag `-a 0.0.0.0` so that the Zapier endpoint can connect.

Note your server's public IP address, as well as the username and password stored in `ob.cfg`. They'll be pasted in with the script.

#### Set up Zapier

Sign up on [zapier.com](https://zapier.com) (“zappy-er”). After logging in and choosing your favorite apps,
- Click “Make a New Zap”

- Scroll down to Built-In Apps, and choose "Code"

- "Run Javascript" -> "Save and Continue"

- Delete the default code

Now open [`alerts.js`](https://cdn.rawgit.com/BazaarGuard/zapier-alert-script/master/alerts.js), copy the whole thing, and paste it into the Code box.

Scroll back to the top and you'll see three variables with Xes. Fill them in with the connection info:

    var host = "http://XXX.XXX.XXX.XXX:18469/api/v1"; // your server's ip
    var username = 'XXXXXXXX';                        // OpenBazaar username
    var password = 'XXXXXXXX';                        // OpenBazaar password

Now unless your OpenBazaar server has an unread message or notification pending, you'll need to tweak the code temporarily to pass Zapier's test. Normally the script returns no data when there aren't any alerts, but Zapier needs to know how data will look.

#### to be continued…

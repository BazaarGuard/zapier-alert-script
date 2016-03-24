# zapier-alert-script

A Zapier trigger for OpenBazaar alerts.

This script connects to your OpenBazaar server to gather new notifications and chat messages. It formats them into readable lines, and passes them to Zapier, an automation service similar to IFTTT. Zapier can send them to email, SMS, Slack, and many other apps. This is one way to receive alerts in lieu of a mobile client for OpenBazaar.

The script runs directly in Zapier's Code Trigger environment—just copy and paste it in.

## How to use

[Install and manually run](https://slack-files.com/T02FPGBKB-F0KJU1CLX-cbbcf8a02c) the OpenBazaar Server, if you haven't already.

> You'll need to include the flag `-a 0.0.0.0` so that the Zapier endpoint can connect.

Note your server's public IP address, as well as the username and password stored in `ob.cfg`. They'll be pasted in with the script.

#### Create Zapier trigger

Sign up on [zapier.com](https://zapier.com) (“zappy-er”). After logging in and choosing your favorite apps,
- Click “Make a New Zap”

- Scroll down to Built-In Apps, and choose "Code"

- "Run Javascript" -> "Save and Continue"

- Delete the default code

Now open [`alerts.js`](https://cdn.rawgit.com/BazaarGuard/zapier-alert-script/master/alerts.js), copy the whole thing, and paste it into the Code box.

Scroll back to the top and you'll see three variables with Xes. Fill them in with your connection info:

    var host = "http://XXX.XXX.XXX.XXX:18469/api/v1"; // your server's ip
    var username = 'XXXXXXXX';                        // OpenBazaar username
    var password = 'XXXXXXXX';                        // OpenBazaar password

Unless your OpenBazaar server has an unread message or notification pending, you'll need to tweak the code temporarily to pass Zapier's test. Normally the script returns no data when there aren't any alerts, but Zapier needs to know how data will look.

Go to the 6th line from the bottom:

      if (!output.messages) output = [];

Comment it out with two forward slashes.

      // if (!output.messages) output = [];

Click "Continue" -> "Fetch and Continue" to let Zapier test the script. It should pass. (If not, double-check the credentials and port number, and that your server is running.)

Now, *instead* of clicking the orange "Continue", mouse over to the sidebar and click "Edit Options". Scroll down and remove the slashes to uncomment that same line. Click "Continue". It should still read Test Successful. Now click the orange "Continue" to finish this section. Congratulations, you've made a custom trigger using the OpenBazaar API.

#### Forward the alerts

From here you can choose from many apps to receive the alerts. Examples include SMS, email, and Slack. Configuration is different for all of them, but be sure to include data from the Run Javascript trigger **from a field called Messages**. This is where the OpenBazaar alerts are stored, formatted as lines of text.

When finished configuring the action, give it a name and hit the ON switch. Zapier will run the script every five minutes. If your server has any new, unread chat messages or notifications, they will be sent to your service of choice. Otherwise nothing will happen.

> After the free trial expires, the script will be run every 15 minutes and forwading actions will be limited to 100 per month unless an upgrade plan is chosen.

You are now be receiving alerts from your OpenBazaar node through Zapier. I hope you find this useful!

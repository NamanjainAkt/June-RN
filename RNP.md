Yes! Clerk provides the useSSO() hook that uses expo-web-browser to handle OAuth authentication directly inside your Expo app.1

Here's how to use it:

Using useSSO() for in-app OAuth
tsx
import { useSSO } from '@clerk/clerk-expo'
import { Button } from 'react-native'

function GoogleSignInButton() {
  const { startSSOFlow } = useSSO()

  const onPress = async () => {
    try {
      const { createdSessionId, setActive } = await startSSOFlow({
        strategy: 'oauth_google'
      })

      if (createdSessionId && setActive) {
        await setActive({ session: createdSessionId })
      }
    } catch (err) {
      console.error('OAuth error:', err)
    }
  }

  return <Button title="Sign in with Google" onPress={onPress} />
}
How it works
The useSSO() hook handles the OAuth flow by:

Creating a redirect URL using AuthSession.makeRedirectUri() with the path 'sso-callback'
Opening the OAuth provider's authentication page using WebBrowser.openAuthSessionAsync()
Handling the callback with the authorization code
Completing the sign-in or sign-up process automatically
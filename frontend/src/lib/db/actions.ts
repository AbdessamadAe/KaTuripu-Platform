import createClientForBrowser from "./client"

const singInWith = (provider:any) => async () => {
    const supabase = await createClientForBrowser()
    const { data, error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
            redirectTo: `${process.env.NEXT_PUBLIC_BASE_URL}/auth/callback`,
        },
    })
    if (error) {
        throw error
    }
    
    if (data?.url) {
        window.location.href = data.url;
    }
    
    return data
}

const signInWithGoogle = singInWith('google')

const handleSignOut = async () => {
    const supabase = await createClientForBrowser()
    try {
      await supabase.auth.signOut();
      window.location.href = `${process.env.NEXT_PUBLIC_BASE_URL}`;
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

export { signInWithGoogle, handleSignOut }

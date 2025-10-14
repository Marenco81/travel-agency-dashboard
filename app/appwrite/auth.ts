import { ID, OAuthProvider, Query } from "appwrite"
import { account, appwriteConfig, database } from "./client"
import { redirect } from "react-router"

export const loginWithGoogle = async () => {
    try {
        account.createOAuth2Session(
            OAuthProvider.Google
        )
    } catch (error) {
        console.log('loginWithGoogle', error)       
    }
}

export const getUser = async () => {
    try {
        const user = await account.get();

        if(!user) return redirect('/sign-in');

        const {documents} = await database.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.usersCollectionId,
            [
                Query.equal('accountId', user.$id),
                Query.select(['name', 'email', 'imageUrl', 'joinedAt', 'accountId'])
            ]
        )
    } catch (error) {
        console.log(error)       
    }
}

export const logoutUser = async () => {
    try {
        await account.deleteSession('current')
        return true;
    } catch (error) {
        console.log('logout user error:' , error)
        return false;       
    }
}

export const getGooglePicture = async () => {
    try {
        //Get the current user session
        const session = await account.getSession('current');

        //Get the OAuth2 token from session
        const oAuthToken = session.providerAccessToken;

        if(!oAuthToken) {
            console.log('No OAuth token available')
            return null;
        }

        //Make a request to the Google People API to get the profile photo
        const response = await fetch(
            'https://people.google.com/v1/people/me?personFields=photos',
            {
                headers: {
                    Authorization: `Bearer ${oAuthToken}`
                }
            }
        );
        if(!response.ok) {
            console.log('Failed to fetch profile photo frrom Google People API');
            return null;
        }

        const data = await response.json();

        // Extract the profile photo URL from the response
        const photoUrl = data.photo && data.photos.length > 0
            ? data.photos[0].url
            : null;

        return photoUrl;    
    } catch (error) {
        console.log(error)       
        return null;
    }
}

export const storeUserdata = async () => {
    try {
        const user = await account.get()

        if(!user) return null;

        // Check if user already exists in the database
        const {documents} = await database.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.usersCollectionId,
            [Query.equal('accountId', user.$id)]
        );

        if(documents.length > 0) return documents[0];

        //Get profile photo from Google
        const imageUrl = await getGooglePicture();

        //Create new user document
        const newUser = await database.createDocument(
            appwriteConfig.databaseId,
            appwriteConfig.usersCollectionId,
            ID.unique(),
            {
                accountId: user.$id,
                email: user.email,
                name: user.name,
                imageUrl: imageUrl || '',
                joinedAt: new Date().toISOString(),
            }
        );
        return newUser;
    } catch (error) {
        console.log('storeUserDate:', error)  
        return null;     
    }
}

export const getExistingUser = async (id: string) => {
    try {
        const {documents, total} = await database.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.usersCollectionId,
            [Query.equal("accountId", id)]
        );
        return total > 0 ? documents[0] : null;
    } catch (error) {
        console.log('Error fetching user', error)
        return null;
    }
}; 
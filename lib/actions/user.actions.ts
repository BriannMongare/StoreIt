"use server"
import { ID, Query } from "appwrite";
import { createAdminClient } from "../appwrite";
import appwriteConfig from "/config.ts";

const getUserByEmail = async (email: string) =>  {
    const {databases} = await createAdminClient();

    const result = await databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.userCollectionId,
        [
            Query.equal("email", [email])
        ]
    )
    return result.total > 0 ? result.documents[0] : null;
};

const handleError =(error: unknown, message: string) => {
    console.error(error);
    throw new error;
}

const sendEmailOTP = async ({email}:{email: string}) =>{
    const {account} = await createAdminClient();

    try{
        const session = await account.createEmailToken(ID.unique(), email);
        console.log(session);
        return session.userId;
    } catch (error) {
        handleError(error,"Failed to send email OTP");

    }
}

const createAccount = async ({fullName,email}:{fullName: string, email: string}) => {
    const existingUser = await getUserByEmail(email);
    const accountId = await sendEmailOTP(email);


    if(existingUser) {
        throw new Error("User already exists");
    }
    const {databases} = await createAdminClient();
    const result = await databases.createDocument(
        appwriteConfig.databaseId,
        appwriteConfig.userCollectionId,
        accountId,
        {
            fullName,
            email
        }
    )
    return result;
}




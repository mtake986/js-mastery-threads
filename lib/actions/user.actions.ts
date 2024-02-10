// they can be defined inside server components and/or called from Client components.
"use server";

import { revalidatePath } from "next/cache";
import User from "../models/user.model";
import { connectToDB } from "../mongoose";

type Params = {
  userId: string;
  username: string;
  name: string;
  bio: string;
  image: string;
  path: string;
};

export async function updateUser({
  userId,
  username,
  name,
  bio,
  image,
  path,
}: Params): Promise<void> {
  connectToDB();

  try {
    console.log(
      "=== here is the uploading info: ",
      { id: userId },
      {
        username: username.toLowerCase(),
        name,
        bio,
        image,
        onboarded: true,
      },
      {
        upsert: true,
      },
      "==========="
    );
    await User.findOneAndUpdate(
      { id: userId },
      {
        username: username.toLowerCase(),
        name,
        bio,
        image,
        onboarded: true,
      },
      {
        upsert: true,
      }
    );

    console.log("User.findOneAndUpdate is done");

    if (path === "/profile/edit") {
      revalidatePath(path);
    }
  } catch (error: any) {
    throw new Error(`Failed to create/upate user ${error.message}`);
  }
}

export async function fetchUser(userId: string) {
  try {
    connectToDB();
    return await User.findOne({ id: userId })
    //   .populate({
    //   path: "communities",
    //   model: Community,
    // });
  } catch (error: any) {
    throw new Error(`Failed to fetch user: ${error.message}`)
  }
}

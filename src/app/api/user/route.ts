import { connectMongoDB } from '@/lib/mongodb';
import User from '@/models/User';
import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';

interface UserPayload {
  name: string;
  email: string;
  image: string;
}

export async function POST(request: NextRequest) {
  try {
    const { name, email, image }: UserPayload = await request.json();
    await connectMongoDB();
    const userExists = await User.findOne({ email });

    if (userExists) {
      userExists.name = name;
      userExists.image = image;
      const updatedUser = await userExists.save();

      return NextResponse.json(
        { message: 'User Exists', data: updatedUser },
        { status: 200 }
      );
    }

    const newUser = new User({ name, email, image });
    const createdUser = await newUser.save();

    if (createdUser) {
      return NextResponse.json(
        { message: 'User created', data: createdUser },
        { status: 201 }
      );
    }

    return NextResponse.json(
      { message: 'Something went wrong' },
      { status: 500 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: 'Something went wrong', error },
      { status: 400 }
    );
  }
}

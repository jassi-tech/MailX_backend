import { connectDB } from './config/db';
import { User } from './models/User';
import { templateService } from './services/templateService';
import mongoose from 'mongoose';

const seed = async () => {
  try {
    console.log('Connecting to database...');
    await connectDB();

    const user = await User.findOne();
    if (!user) {
      console.log('No user found in the database. Please create a user first.');
      process.exit(1);
    }

    console.log(`Found user: ${user.email}. Seeding templates...`);

    const templates = [
      {
        name: 'Welcome Email',
        subject: 'Welcome to {{app_name}}!',
        html: `<div style="font-family: Arial, sans-serif; padding: 40px; background-color: #f9fafb; color: #111827;">
  <div style="max-width: 600px; margin: 0 auto; background-color: white; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
    <div style="background-color: #6366f1; padding: 32px; text-align: center;">
      <h1 style="color: white; margin: 0; font-size: 28px;">Welcome to {{app_name}}!</h1>
    </div>
    <div style="padding: 32px;">
      <h2 style="margin-top: 0; font-size: 20px;">Hi {{name}},</h2>
      <p style="font-size: 16px; line-height: 1.6; color: #4b5563;">
        We're thrilled to have you on board! You're now a part of our growing community. Get ready to explore all the features we have prepared for you.
      </p>
      <div style="text-align: center; margin: 32px 0;">
        <a href="{{login_url}}" style="background-color: #6366f1; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 16px;">
          Get Started Now
        </a>
      </div>
      <p style="font-size: 16px; line-height: 1.6; color: #4b5563;">
        If you have any questions, our support team is always here to help. Just reply to this email!
      </p>
      <p style="font-size: 16px; margin-bottom: 0; color: #4b5563;">
        Cheers,<br>The {{app_name}} Team
      </p>
    </div>
  </div>
</div>`
      },
      {
        name: 'OTP Verification',
        subject: '{{otp}} is your verification code',
        html: `<div style="font-family: Arial, sans-serif; padding: 40px; background-color: #f9fafb; color: #111827;">
  <div style="max-width: 600px; margin: 0 auto; background-color: white; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
    <div style="padding: 32px; text-align: center; border-bottom: 1px solid #e5e7eb;">
      <h1 style="margin: 0; font-size: 24px;">Verify your email address</h1>
    </div>
    <div style="padding: 32px;">
      <p style="font-size: 16px; line-height: 1.6; color: #4b5563; text-align: center;">
        Here is your one-time verification code. It will expire in 10 minutes.
      </p>
      <div style="margin: 32px auto; width: fit-content; background-color: #f3f4f6; padding: 16px 32px; border-radius: 8px; letter-spacing: 4px;">
        <h2 style="margin: 0; font-size: 32px; color: #1f2937;">{{otp}}</h2>
      </div>
      <p style="font-size: 14px; line-height: 1.6; color: #6b7280; text-align: center; margin-bottom: 0;">
        If you didn't request this code, you can safely ignore this email.
      </p>
    </div>
  </div>
</div>`
      },
      {
        name: 'Feedback Request',
        subject: 'How was your experience, {{name}}?',
        html: `<div style="font-family: Arial, sans-serif; padding: 40px; background-color: #f9fafb; color: #111827;">
  <div style="max-width: 600px; margin: 0 auto; background-color: white; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
    <div style="padding: 32px; text-align: center;">
      <h1 style="margin: 0; font-size: 24px;">We'd love your feedback!</h1>
    </div>
    <div style="padding: 32px; border-top: 1px solid #e5e7eb;">
      <h2 style="margin-top: 0; font-size: 18px;">Hi {{name}},</h2>
      <p style="font-size: 16px; line-height: 1.6; color: #4b5563;">
        We hope you're enjoying your recent experience with us. We're constantly trying to improve, and your input is incredibly valuable.
      </p>
      <p style="font-size: 16px; line-height: 1.6; color: #4b5563;">
        Could you take a 2-minute survey to let us know how we're doing?
      </p>
      <div style="text-align: center; margin: 32px 0;">
        <a href="{{survey_link}}" style="background-color: #10b981; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 16px;">
          Take the Survey
        </a>
      </div>
      <p style="font-size: 14px; color: #6b7280; margin-bottom: 0;">
        Thank you for helping us deliver a better experience!
      </p>
    </div>
  </div>
</div>`
      }
    ];

    for (const data of templates) {
      console.log(`Creating template: ${data.name}`);
      await templateService.create(user._id.toString(), data);
    }
    
    console.log('Seeding complete! Successfully added default templates.');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seed();

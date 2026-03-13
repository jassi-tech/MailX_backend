import mongoose from 'mongoose';
import * as dotenv from 'dotenv';
import { Template } from './models/Template';
import { templateService } from './services/templateService';

dotenv.config();

async function verify() {
  await mongoose.connect(process.env.MONGODB_URI as string);
  console.log('Connected to MongoDB');

  const userId = '65f0a0e0e0e0e0e0e0e0e0e0'; // Mock/Test user
  
  // Test Protection
  try {
    const list = await templateService.list(userId);
    const defaultT = list.find(t => t.isDefault);
    if (defaultT) {
      console.log('Attempting to delete default template:', defaultT.name);
      await templateService.delete(userId, (defaultT._id as any).toString());
      console.log('FAIL: Deleted default template!');
    } else {
      console.log('No default template found to test deletion');
    }
  } catch (err: any) {
    console.log('PASS: Deletion prevented with error:', err.message);
  }

  // Test Create (Custom)
  const newT = await templateService.create(userId, {
    name: 'Custom Test',
    subject: 'Test Subject',
    html: '<h1>Test</h1>'
  });
  console.log('New Custom Template ID:', newT.templateId, '| isDefault:', newT.isDefault);

  // Test Delete (Custom)
  try {
    await templateService.delete(userId, (newT._id as any).toString());
    console.log('PASS: Custom template deleted successfully');
  } catch (err: any) {
    console.log('FAIL: Could not delete custom template:', err.message);
  }

  await mongoose.disconnect();
}

verify().catch(console.error);

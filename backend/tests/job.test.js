import request from 'supertest';
import app from '../server.js';
import User from '../models/User.js';
import Job from '../models/Job.js';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';

describe('Job Tests', () => {
  let employerToken;
  let employerId;

  beforeAll(async () => {
    await mongoose.connect(process.env.MONGODB_URI);
    
    const employer = await User.create({
      name: 'Employer Cyprus',
      email: 'employer@cyprus.com',
      password: 'password123',
      role: 'employer',
      companyName: 'Cyprus Tech Ltd'
    });
    
    employerId = employer._id;
    employerToken = jwt.sign({ id: employer._id }, process.env.JWT_SECRET);
  });

  afterAll(async () => {
    await Job.deleteMany({ title: /Test Job/ });
    await User.deleteMany({ email: 'employer@cyprus.com' });
    await mongoose.connection.close();
  });

  describe('POST /api/jobs', () => {
    test('should create job with valid data', async () => {
      const res = await request(app)
        .post('/api/jobs')
        .set('Authorization', `Bearer ${employerToken}`)
        .send({
          title: 'Test Job in Cyprus',
          description: 'Software Developer position in Nicosia',
          location: 'Nicosia, Cyprus',
          category: 'Technology',
          jobType: 'Full-time',
          salary: '€40,000 - €60,000',
          requirements: ['JavaScript', 'React', 'Node.js']
        });

      expect(res.status).toBe(201);
      expect(res.body.title).toBe('Test Job in Cyprus');
      expect(res.body.location).toBe('Nicosia, Cyprus');
    });

    test('should fail without authentication', async () => {
      const res = await request(app)
        .post('/api/jobs')
        .send({
          title: 'Test Job',
          description: 'Description',
          location: 'Cyprus'
        });

      expect(res.status).toBe(401);
    });

    test('should fail for non-employer role', async () => {
      const jobseeker = await User.create({
        name: 'Job Seeker',
        email: 'seeker@cyprus.com',
        password: 'password123',
        role: 'jobseeker'
      });
      
      const token = jwt.sign({ id: jobseeker._id }, process.env.JWT_SECRET);

      const res = await request(app)
        .post('/api/jobs')
        .set('Authorization', `Bearer ${token}`)
        .send({
          title: 'Test Job',
          description: 'Description',
          location: 'Cyprus'
        });

      expect(res.status).toBe(403);
      await User.deleteOne({ _id: jobseeker._id });
    });
  });

  describe('GET /api/jobs', () => {
    test('should get jobs with Cyprus location filter', async () => {
      const res = await request(app)
        .get('/api/jobs')
        .query({ location: 'Cyprus' });

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('jobs');
      expect(Array.isArray(res.body.jobs)).toBe(true);
    });
  });
});

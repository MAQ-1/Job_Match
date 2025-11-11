import request from 'supertest';
import app from '../server.js';
import User from '../models/User.js';
import Job from '../models/Job.js';
import Application from '../models/Application.js';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';

describe('Application Tests', () => {
  let jobseekerToken;
  let employerToken;
  let jobId;

  beforeAll(async () => {
    await mongoose.connect(process.env.MONGODB_URI);
    
    const employer = await User.create({
      name: 'Employer',
      email: 'employer2@cyprus.com',
      password: 'password123',
      role: 'employer'
    });
    
    const jobseeker = await User.create({
      name: 'Job Seeker',
      email: 'jobseeker@cyprus.com',
      password: 'password123',
      role: 'jobseeker',
      resume: 'uploads/resume.pdf'
    });

    const job = await Job.create({
      title: 'Developer in Cyprus',
      description: 'Great opportunity',
      location: 'Limassol, Cyprus',
      category: 'Technology',
      jobType: 'Full-time',
      company: employer._id
    });

    jobId = job._id;
    employerToken = jwt.sign({ id: employer._id }, process.env.JWT_SECRET);
    jobseekerToken = jwt.sign({ id: jobseeker._id }, process.env.JWT_SECRET);
  });

  afterAll(async () => {
    await Application.deleteMany({});
    await Job.deleteMany({ title: 'Developer in Cyprus' });
    await User.deleteMany({ email: /.*@cyprus\.com/ });
    await mongoose.connection.close();
  });

  describe('POST /api/applications', () => {
    test('should apply to job with valid data', async () => {
      const res = await request(app)
        .post('/api/applications')
        .set('Authorization', `Bearer ${jobseekerToken}`)
        .send({
          jobId: jobId.toString(),
          coverLetter: 'I am interested in this position in Cyprus'
        });

      expect(res.status).toBe(201);
      expect(res.body.coverLetter).toContain('Cyprus');
    });

    test('should fail to apply twice to same job', async () => {
      const res = await request(app)
        .post('/api/applications')
        .set('Authorization', `Bearer ${jobseekerToken}`)
        .send({
          jobId: jobId.toString(),
          coverLetter: 'Second application'
        });

      expect(res.status).toBe(400);
      expect(res.body.message).toBe('Already applied to this job');
    });

    test('should fail without authentication', async () => {
      const res = await request(app)
        .post('/api/applications')
        .send({
          jobId: jobId.toString(),
          coverLetter: 'Cover letter'
        });

      expect(res.status).toBe(401);
    });

    test('should fail for employer role', async () => {
      const res = await request(app)
        .post('/api/applications')
        .set('Authorization', `Bearer ${employerToken}`)
        .send({
          jobId: jobId.toString(),
          coverLetter: 'Cover letter'
        });

      expect(res.status).toBe(403);
    });
  });
});

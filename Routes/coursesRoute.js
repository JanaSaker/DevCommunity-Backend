import { createCourse, getCourses, updateCourse, deleteCourse } from '../Controllers/coursesController.js';
import { Router } from 'express';
import {authorizeAccess}  from '../middleware/userAuth.js'; // Adjust the import path as necessary
import { createCourseModel } from '../Models/coursesModel.js';
const Course =createCourseModel
const router = Router();


// Route to create a new course
router.post('/courses', createCourse);

// Route to get all courses
router.get('/courses', getCourses);

// Route to update a course
// Apply authorizeAccess middleware to ensure only the course owner can update it
router.put('/courses/:id',  updateCourse);

// Route to delete a course
// Apply authorizeAccess middleware to ensure only the course owner can delete it
router.delete('/courses/:id',  deleteCourse);

export default router;
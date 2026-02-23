import fs from 'node:fs';

const TRAINEE_DATA_FILE_PATH = './data/trainees.json';
const COURSE_DATA_FILE_PATH = './data/courses.json';

// ---------- TRAINEES ----------

export function loadTraineeData() {
  try {
    const data = fs.readFileSync(TRAINEE_DATA_FILE_PATH, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error loading trainee data:', error.message);
    return [];
  }
}

export function saveTraineeData(updatedData) {
  try {
    fs.writeFileSync(
      TRAINEE_DATA_FILE_PATH,
      JSON.stringify(updatedData, null, 2)
    );
  } catch (error) {
    console.error('Error saving trainee data:', error.message);
  }
}

// ---------- COURSES ----------

export function loadCourseData() {
  try {
    const data = fs.readFileSync(COURSE_DATA_FILE_PATH, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error loading course data:', error.message);
    return [];
  }
}

export function saveCourseData(updatedData) {
  try {
    fs.writeFileSync(
      COURSE_DATA_FILE_PATH,
      JSON.stringify(updatedData, null, 2)
    );
  } catch (error) {
    console.error('Error saving course data:', error.message);
  }
}

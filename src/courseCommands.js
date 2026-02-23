import chalk from 'chalk';
import { saveCourseData, loadCourseData, loadTraineeData } from './storage.js';

function generateUniqueId(existingIds) {
  let id;
  do {
    id = Math.floor(Math.random() * 100000);
  } while (existingIds.has(id));
  return id;
}

function isValidStartDate(dateStr) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return false;

  const [y, m, d] = dateStr.split('-').map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d));

  return (
    dt.getUTCFullYear() === y &&
    dt.getUTCMonth() === m - 1 &&
    dt.getUTCDate() === d
  );
}

function countTraineeCourses(traineeId, courses) {
  return courses.filter(
    (c) => Array.isArray(c.participants) && c.participants.includes(traineeId)
  ).length;
}

function addCourse(args) {
  if (!args || args.length < 2) {
    console.log(chalk.red('ERROR: Must provide course name and start date'));
    return;
  }

  const [name, startDate] = args;

  if (!isValidStartDate(startDate)) {
    console.log(
      chalk.red('ERROR: Invalid start date. Must be in yyyy-MM-dd format')
    );
    return;
  }

  const courses = loadCourseData();
  const existingIds = new Set(courses.map((c) => c.id));
  const id = generateUniqueId(existingIds);

  const newCourse = { id, name, startDate, participants: [] };
  courses.push(newCourse);

  saveCourseData(courses);

  console.log(`CREATED: ${id} ${name} ${startDate}`);
}

function updateCourse(args) {
  if (!args || args.length < 3) {
    console.log(chalk.red('ERROR: Must provide ID, name and start date.'));
    return;
  }

  const [idRaw, name, startDate] = args;
  const id = Number(idRaw);

  const courses = loadCourseData();
  const course = courses.find((c) => c.id === id);

  if (!course) {
    console.log(chalk.red(`ERROR: Course with ID ${idRaw} does not exist`));
    return;
  }

  if (!isValidStartDate(startDate)) {
    console.log(
      chalk.red('ERROR: Invalid start date. Must be in yyyy-MM-dd format')
    );
    return;
  }

  course.name = name;
  course.startDate = startDate;

  saveCourseData(courses);

  console.log(`UPDATED: ${idRaw} ${name} ${startDate}`);
}

function deleteCourse(args) {
  const [idRaw] = args || [];
  const id = Number(idRaw);

  const courses = loadCourseData();
  const index = courses.findIndex((c) => c.id === id);

  if (index === -1) {
    console.log(chalk.red(`ERROR: Course with ID ${idRaw} does not exist`));
    return;
  }

  const [deleted] = courses.splice(index, 1);
  saveCourseData(courses);

  console.log(`DELETED: ${deleted.id} ${deleted.name}`);
}

function joinCourse(args) {
  if (!args || args.length < 2) {
    console.log(chalk.red('ERROR: Must provide course ID and trainee ID'));
    return;
  }

  const [courseIdRaw, traineeIdRaw] = args;
  const courseId = Number(courseIdRaw);
  const traineeId = Number(traineeIdRaw);

  const courses = loadCourseData();
  const trainees = loadTraineeData();

  const course = courses.find((c) => c.id === courseId);
  if (!course) {
    console.log(
      chalk.red(`ERROR: Course with ID ${courseIdRaw} does not exist`)
    );
    return;
  }

  const trainee = trainees.find((t) => t.id === traineeId);
  if (!trainee) {
    console.log(
      chalk.red(`ERROR: Trainee with ID ${traineeIdRaw} does not exist`)
    );
    return;
  }

  if (course.participants.includes(traineeId)) {
    console.log(chalk.red('ERROR: The Trainee has already joined this course'));
    return;
  }

  if (course.participants.length >= 20) {
    console.log(chalk.red('ERROR: The course is full.'));
    return;
  }

  const currentCourseCount = countTraineeCourses(traineeId, courses);
  if (currentCourseCount >= 5) {
    console.log(
      chalk.red('ERROR: A trainee is not allowed to join more than 5 courses.')
    );
    return;
  }

  course.participants.push(traineeId);
  saveCourseData(courses);

  const traineeName = `${trainee.firstName} ${trainee.lastName}`;
  console.log(`${traineeName} Joined ${course.name}`);
}

function leaveCourse(args) {
  if (!args || args.length < 2) {
    console.log(chalk.red('ERROR: Must provide course ID and trainee ID'));
    return;
  }

  const [courseIdRaw, traineeIdRaw] = args;
  const courseId = Number(courseIdRaw);
  const traineeId = Number(traineeIdRaw);

  const courses = loadCourseData();
  const trainees = loadTraineeData();

  const course = courses.find((c) => c.id === courseId);
  if (!course) {
    console.log(
      chalk.red(`ERROR: Course with ID ${courseIdRaw} does not exist`)
    );
    return;
  }

  const trainee = trainees.find((t) => t.id === traineeId);
  if (!trainee) {
    console.log(
      chalk.red(`ERROR: Trainee with ID ${traineeIdRaw} does not exist`)
    );
    return;
  }

  const idx = course.participants.indexOf(traineeId);
  if (idx === -1) {
    console.log(chalk.red('ERROR: The Trainee did not join the course'));
    return;
  }

  course.participants.splice(idx, 1);
  saveCourseData(courses);

  const traineeName = `${trainee.firstName} ${trainee.lastName}`;
  console.log(`${traineeName} Left ${course.name}`);
}

function getCourse(args) {
  const [idRaw] = args || [];
  const id = Number(idRaw);

  const courses = loadCourseData();
  const trainees = loadTraineeData();

  const course = courses.find((c) => c.id === id);
  if (!course) {
    console.log(chalk.red(`ERROR: Course with ID ${idRaw} does not exist`));
    return;
  }

  console.log(`${course.id} ${course.name} ${course.startDate}`);

  const participantObjects = (course.participants || [])
    .map((pid) => trainees.find((t) => t.id === pid))
    .filter(Boolean);

  console.log(`Participants (${participantObjects.length}):`);
  for (const t of participantObjects) {
    console.log(`- ${t.id} ${t.firstName} ${t.lastName}`);
  }
}

function getAllCourses() {
  const courses = loadCourseData();

  const sorted = [...courses].sort((a, b) =>
    a.startDate.localeCompare(b.startDate)
  );

  console.log('Courses:');
  for (const c of sorted) {
    const count = Array.isArray(c.participants) ? c.participants.length : 0;
    const fullLabel = count >= 20 ? ' FULL' : '';
    console.log(`${c.id} ${c.name} ${c.startDate} ${count}${fullLabel}`);
  }

  console.log(`\nTotal: ${sorted.length}`);
}

export function handleCourseCommand(subcommand, args) {
  switch (subcommand) {
    case 'ADD':
      addCourse(args);
      break;
    case 'UPDATE':
      updateCourse(args);
      break;
    case 'DELETE':
      deleteCourse(args);
      break;
    case 'JOIN':
      joinCourse(args);
      break;
    case 'LEAVE':
      leaveCourse(args);
      break;
    case 'GET':
      getCourse(args);
      break;
    case 'GETALL':
      getAllCourses();
      break;
    default:
      console.log(chalk.red('ERROR: Invalid COURSE command'));
  }
}

import chalk from 'chalk';
import { saveTraineeData, loadTraineeData, loadCourseData } from './storage.js';

function generateUniqueId(existingIds) {
  let id;
  do {
    id = Math.floor(Math.random() * 100000);
  } while (existingIds.has(id));
  return id;
}

function addTrainee(args) {
  if (!args || args.length < 2) {
    console.log(chalk.red('ERROR: Must provide first and last name'));
    return;
  }

  const [firstName, lastName] = args;
  const trainees = loadTraineeData();

  const existingIds = new Set(trainees.map((t) => t.id));
  const id = generateUniqueId(existingIds);

  const newTrainee = { id, firstName, lastName };
  trainees.push(newTrainee);

  saveTraineeData(trainees);

  console.log(`CREATED: ${id} ${firstName} ${lastName}`);
}

function updateTrainee(args) {
  if (!args || args.length < 3) {
    console.log(chalk.red('ERROR: Must provide ID, first name and last name'));
    return;
  }

  const [idRaw, firstName, lastName] = args;
  const id = Number(idRaw);

  const trainees = loadTraineeData();
  const trainee = trainees.find((t) => t.id === id);

  if (!trainee) {
    console.log(chalk.red(`ERROR: Trainee with ID ${idRaw} does not exist`));
    return;
  }

  trainee.firstName = firstName;
  trainee.lastName = lastName;

  saveTraineeData(trainees);

  console.log(`UPDATED: ${idRaw} ${firstName} ${lastName}`);
}

function deleteTrainee(args) {
  const [idRaw] = args || [];
  const id = Number(idRaw);

  const trainees = loadTraineeData();
  const index = trainees.findIndex((t) => t.id === id);

  if (index === -1) {
    console.log(chalk.red(`ERROR: Trainee with ID ${idRaw} does not exist`));
    return;
  }

  const [deleted] = trainees.splice(index, 1);
  saveTraineeData(trainees);

  console.log(
    `DELETED: ${deleted.id} ${deleted.firstName} ${deleted.lastName}`
  );
}

function fetchTrainee(args) {
  const [idRaw] = args || [];
  const id = Number(idRaw);

  const trainees = loadTraineeData();
  const trainee = trainees.find((t) => t.id === id);

  if (!trainee) {
    console.log(chalk.red(`ERROR: Trainee with ID ${idRaw} does not exist`));
    return;
  }

  console.log(`${trainee.id} ${trainee.firstName} ${trainee.lastName}`);

  const courses = loadCourseData();
  const enrolledCourseNames = courses
    .filter(
      (c) =>
        Array.isArray(c.participants) && c.participants.includes(trainee.id)
    )
    .map((c) => c.name);

  if (enrolledCourseNames.length === 0) {
    console.log('Courses: None');
  } else {
    console.log(`Courses: ${enrolledCourseNames.join(', ')}`);
  }
}

function fetchAllTrainees() {
  const trainees = loadTraineeData();
  const sorted = [...trainees].sort((a, b) =>
    a.lastName.localeCompare(b.lastName)
  );

  console.log('Trainees:');
  for (const t of sorted) {
    console.log(`${t.id} ${t.firstName} ${t.lastName}`);
  }
  console.log(`\nTotal: ${sorted.length}`);
}

export function handleTraineeCommand(subcommand, args) {
  switch (subcommand) {
    case 'ADD':
      addTrainee(args);
      break;
    case 'UPDATE':
      updateTrainee(args);
      break;
    case 'DELETE':
      deleteTrainee(args);
      break;
    case 'GET':
      fetchTrainee(args);
      break;
    case 'GETALL':
      fetchAllTrainees();
      break;
    default:
      console.log(chalk.red('ERROR: Invalid TRAINEE command'));
  }
}

import { faker } from "@faker-js/faker";
import { v4 as uuidv4 } from "uuid";

const EMAILS = ["anya@ivanova", "alex@petrov", "ivan@sidorov", "maria@petrova"];

const SUBJECTS = [
  "Hello from Anya",
  "Meeting tomorrow",
  "Project update",
  "Weekly report",
];

export const generateMessage = () => ({
  id: uuidv4(),
  from: faker.helpers.arrayElement(EMAILS),
  subject: faker.helpers.arrayElement(SUBJECTS),
  body: faker.lorem.paragraph(),
  received: Date.now() - Math.floor(Math.random() * 86400000),
});

export const generateMessages = (count = 1) => {
  return Array(count)
    .fill()
    .map(() => generateMessage());
};

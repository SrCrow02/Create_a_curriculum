import fs from 'fs';
import puppeteer from 'puppeteer';
import inquirer from 'inquirer';

const htmlTemplate = fs.readFileSync('index.html', 'utf-8');

async function collectInformation() {
  return inquirer.prompt([
    {
      type: 'input',
      name: 'nome',
      message: 'Type your name:'
    },
    {
      type: 'input',
      name: 'email',
      message: 'Type your e-mail:'
    },
    {
      type: 'input',
      name: 'phone',
      message: 'Type your phone number:'
    },
    {
      type: 'input',
      name: 'address',
      message: 'Type your addres:'
    },
    {
      type: 'input',
      name: 'title',
      message: 'Enter company title:'
    },
    {
      type: 'input',
      name: 'jobTitle',
      message: 'Enter company role:'
    },
    {
      type: 'input',
      name: 'jobPeriod',
      message: 'Enter your period in the company:'
    },
    {
      type: 'input',
      name: 'jobDescription',
      message: 'Enter a Description:'
    },
    {
      type: 'input',
      name: 'university',
      message: 'Enter university name:'
    },
    {
      type: 'input',
      name: 'degree',
      message: 'Type what you studied:'
    },
    {
      type: 'input',
      name: 'graduationDate',
      message: 'Enter university completion:'
    },
  ]);
}

async function generatePdf(variables) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await page.setContent(htmlTemplate, { waitUntil: 'networkidle0' });

  await page.evaluate(variables => {
    const nomeElement = document.getElementById('name');
    const emailElement = document.getElementById('email');
    const phoneElement = document.getElementById('phone');
    const addressElement = document.getElementById('address');

    const titleCompany = document.getElementById('title');
    const jobTitle = document.getElementById('jobTitle');
    const jobPeriod = document.getElementById('jobPeriod')
    const jobDescription = document.getElementById('jobDescription')

    const university = document.getElementById('university');
    const degree = document.getElementById('degree')
    const graduationDate = document.getElementById("graduationDate")

    nomeElement.textContent = variables.nome;
    emailElement.textContent = variables.email;
    phoneElement.textContent = variables.phone;
    addressElement.textContent = variables.address; // Corrigido o nome da variável
    titleCompany.textContent = variables.title;
    jobTitle.textContent = variables.jobTitle;
    jobPeriod.textContent = variables.jobPeriod;
    jobDescription.textContent = variables.jobDescription;
    university.textContent = variables.university
    degree.textContent = variables.degree
    graduationDate.textContent = variables.graduationDate

  }, variables);

  const pdfBuffer = await page.pdf({ format: 'A4' });

  await browser.close();

  fs.writeFileSync('curriculum.pdf', pdfBuffer);

  console.log('PDF Created!');
}

(async () => {
  try {
    const answers = await collectInformation();
    await generatePdf(answers);
  } catch (error) {
    console.error('Erro:', error);
  }
})();
import express from 'express';
import cors from 'cors';
import multer from 'multer';
import path from 'path';
import dotenv from 'dotenv'
import {OpenAI} from 'openai';
dotenv.config();
const app = express();
const PORT = 4000;

const generateId = () => Math.random().toString(36).substring(2,10);
const database = [];


const openai = new OpenAI({ apiKey: process.env.SECRET_KEY });

// const openai =  new OpenAIApi(configuration);

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use('/uploads', express.static('uploads'));

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 1024 * 1024 * 5 },
});

const GPTfunction = async (text) => {
  const response = await openai.completions.create({
      model: 'gpt-3.5-turbo-instruct',
      prompt: text,
      temperature: 0.6,
      max_tokens: 250,
      frequency_penalty: 1,
      presence_penalty: 1
  })

  return response.choices[0].text;
}

app.get('/api', (req, res) => {
  res.json({
    message: 'Hello World',
  });
});

app.post('/resume/create', upload.single('headshotImage'), async (req, res) => {
  const { name, address, education, email, phone, skills, experience } = req.body;
  const image = req.file;

  let parsedExperience = [];
  if (experience) {
    try {
      parsedExperience = JSON.parse(experience);
    } catch (error) {
      console.error('Error parsing experience:', error);
      return res.status(400).send('Invalid experience format');
    }
  }
  
  const newEntry = {
    id:generateId(),
    name,
    address,
    education,
    email,
    phone,
    skills,
    experience: parsedExperience,
    image:`http://localhost:4000/uploads/${req.file.filename}`
  }

  const prompt1 = `I am writing a resume, my details are \n name: ${name} \n education: ${education}. \n I have the following skills: ${skills}. can you write a 100 words description for top of the resume (first person writing)`
  const prompt2 = `I am writing a resume, my details are \n name: ${name} \n education: ${education}. \n I have the following skills: ${skills}. can you write a 10 points for resume on what i am good at?`
 
  const experienceText = () =>{
    let stringText = ''
    for(let i=0; i<parsedExperience.length;i++){
        stringText += `${parsedExperience[i].name} as a ${parsedExperience[i].position}` 
    }
    return stringText;
  }

  const prompt3 =  `I am writing a resume, my details are \n name: ${name} \n education: ${education}. \n I have the following skills: ${skills}. During my years i worked at ${parsedExperience.length} companies. ${experienceText()}\n can you write me in brief for each company seperated by succession in the company (first person writing) `


  const objective = await GPTfunction(prompt1)
  const keypoints = await GPTfunction(prompt2)
  const jobResponsibilities = await GPTfunction(prompt3)

  const chatGptData = {objective,keypoints,jobResponsibilities}

 const data = {...newEntry,...chatGptData}
 database.push(data)


  console.log({
    name,
    address,
    education,
    email,
    phone,
    skills,
    experience: parsedExperience,
    image,
    chatGptData
  });

  res.json({
    message:'request successful',
    data
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on the Port ${PORT}`);
});

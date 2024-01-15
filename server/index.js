import express from 'express';
import cors from 'cors';
import OpenAI from 'openai';
import * as dotenv from 'dotenv'
import path from 'path'
import fs from 'fs'

const app = express();
app.use(cors());
app.use(express.json());

dotenv.config();

const openai = new OpenAI({
    apiKey: process.env.API_KEY
})

app.get('/', async(req, res) => {
    res.status(200).send({
        message: "Hello from APP"
    })
})

app.post('/', async(req, res) => {
    try {
        console.log(req.body.message)
        const response = await openai.chat.completions.create(
            {
                messages: req.body.message,
                model: "gpt-3.5-turbo"
            }
        );
        console.log("Successfully got response from openai")
        res.status(200).json({
            gptresponse: response.choices[0].message.content,
        })
    } 
    catch(error) {
        console.log(error)
    }
});

app.post('/text-to-speech', async(req, res) => {
    try {
        const ttsaudio = await openai.audio.speech.create({
            model: "tts-1",
            voice: "alloy",
            input: req.body.message,
        });
        const mp3 = Buffer.from(await ttsaudio.arrayBuffer());

        const speechFile = path.resolve("./speech.mp3");
        // const buffer = Buffer.from(await data.audio.arrayBuffer());
        await fs.promises.writeFile(speechFile, mp3);
        res.status(200).sendFile("src/audioFile.mpe", "./speech.mp3");
    } catch(error) {
        console.log(error)
    }
})

app.listen(3000, () => console.log('Server is running on port 3000'))

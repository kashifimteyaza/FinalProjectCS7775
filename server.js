// import OpenAI from "openai";
import fetch from 'node-fetch';
import express from 'express';
import cors from 'cors';
const PORT = 7000
//const express = require('express')
//const cors = require('cors')
//const fetch = require('node-fetch')
const app = express()
app.use(express.json())
app.use(cors())


const API_KEY = 'I have deleted my API Key'

app.get('/',(req,res)=>{res.send("hello");});

app.post('/completions', async(req, res) => {
    console.log('Incoming Request:', req.body);

    const options = {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${API_KEY}`,
            "Content-Type": "application/json"
            
        }, 
        body: JSON.stringify({
            model: "gpt-3.5-turbo",
            // object: "chat.completion",
            messages: [{role: "user", content: req.body.message}],
            max_tokens: 1000,           
        })
    }
    
    try {
       const response = await fetch('https://api.openai.com/v1/chat/completions', options)
       const data = await response.json()
       res.send(data)
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: 'Internal server error.' });
    }
})


// import routes
app.listen(PORT, () => console.log('Your server is running on PORT ' + PORT))
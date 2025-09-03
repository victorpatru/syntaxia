## What is this?

Syntaxia it's a technical phone screen service that takes in a job description, parses it with smart ai to get tailored questions and then passes it to a conversational AI that helps make the whole phone screening experience very real. After all of that you get a good/bad review plus potential improvements.

Main flow:
- User inputs a job description
- We parse it using smart LLM models and generate data we then pass to the Elevenlabs Conversational AI
- The interview session starts and goes on for 15 minutes
- The Conversational AI nudges for a gentle end of interview
- Conversation gets processed and we see a "did good + potential improvements + next steps" screen

TODO:
- add rate limiting on how many sessions can be created per user
- add setup failure handling


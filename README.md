# CSYE 7380 Midterm & Final projects
## Chatbot-chatgptapi (mid)  && Rash-generator (final)

### Chatbot
A chatbot for a travel agent company. There are two parts to work in sync when the chatbot interacts with a user: a front-end user interface client and a backend ChatGPT-based server.

#### workflow
![chatbot_workflow](./assets/chatGPT%20API.png)

### Rash Generator
Generate common skin rashes based on textual commands varying the following three factors:

1) Skin rash type (e.g., eczema, ringworm, dermatitis)

2) Skin color (e.g., fair, brown, black)

3) Affected area (e.g., chest, neck, hand)

An example command will be like "generate a few images of a ringworm type of rash at the back of the neck area on a fair skin". Build an interface and a deep generative model to process such queries and visualize the output. Please deal with 3-4 rash types that you are not uncomfortable to look at.

Hint: Explore using latent diffusion model, fine-tuning its CLIP model component. Make sure to collect some training images from the internet.

## Frameworks
Frontend: react, axios

Backend: express

Database: MySQL

UI package: [@chatscope/chat-ui-kit-styles](https://chatscope.io/storybook/react/?path=/docs/documentation-introduction--docs)


### Database
Database: Mysql, data source from Kaggle [flights](https://www.kaggle.com/datasets/muhammadbinimran/flight-price-prediction)
[hotels](https://www.kaggle.com/datasets/praneethkumar12/hotel-recommendation-india?rvi=1)
[Rash](https://www.kaggle.com/datasets/sshikamaru/lyme-disease-rashes)

---

<b>Run backend: </b>
`npm i`
`npm run backend`

<b>Run frontend: </b>
`npm i`
`npm start`

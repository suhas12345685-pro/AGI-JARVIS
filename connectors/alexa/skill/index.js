const Alexa = require('ask-sdk-core');
const axios = require('axios');

const JARVIS = process.env.CLOUDFLARE_TUNNEL_URL || 'http://localhost:3000';

const LaunchRequestHandler = {
  canHandle(input) {
    return Alexa.getRequestType(input.requestEnvelope) === 'LaunchRequest';
  },
  handle(input) {
    return input.responseBuilder
      .speak("JARVIS online, sir. How may I assist you?")
      .reprompt("I'm listening, sir.")
      .getResponse();
  }
};

const JarvisIntentHandler = {
  canHandle(input) {
    return Alexa.getRequestType(input.requestEnvelope) === 'IntentRequest'
      && Alexa.getIntentName(input.requestEnvelope) === 'JarvisIntent';
  },
  async handle(input) {
    const query = Alexa.getSlotValue(input.requestEnvelope, 'query') || '';
    const userId = input.requestEnvelope.session.user.userId;

    try {
      const res = await axios.post(`${JARVIS}/think`, {
        input: query,
        source: 'alexa',
        userId
      }, { timeout: 8000 });

      return input.responseBuilder
        .speak(res.data.response)
        .reprompt("Is there anything else, sir?")
        .getResponse();
    } catch {
      return input.responseBuilder
        .speak("I'm having trouble reaching my cognitive systems, sir.")
        .getResponse();
    }
  }
};

const HelpIntentHandler = {
  canHandle(input) {
    return Alexa.getRequestType(input.requestEnvelope) === 'IntentRequest'
      && Alexa.getIntentName(input.requestEnvelope) === 'AMAZON.HelpIntent';
  },
  handle(input) {
    return input.responseBuilder
      .speak("You can ask me anything, sir. I am JARVIS, your cognitive assistant.")
      .reprompt("What would you like to know?")
      .getResponse();
  }
};

const CancelStopHandler = {
  canHandle(input) {
    return Alexa.getRequestType(input.requestEnvelope) === 'IntentRequest'
      && (Alexa.getIntentName(input.requestEnvelope) === 'AMAZON.CancelIntent'
        || Alexa.getIntentName(input.requestEnvelope) === 'AMAZON.StopIntent');
  },
  handle(input) {
    return input.responseBuilder
      .speak("Standing by, sir.")
      .getResponse();
  }
};

const skillBuilder = Alexa.SkillBuilders.custom()
  .addRequestHandlers(
    LaunchRequestHandler,
    JarvisIntentHandler,
    HelpIntentHandler,
    CancelStopHandler,
  )
  .create();

exports.handler = skillBuilder.getRequestHandler ? skillBuilder.getRequestHandler() : skillBuilder;

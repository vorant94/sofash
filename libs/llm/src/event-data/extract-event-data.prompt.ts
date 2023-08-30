export const EXTRACT_EVENT_DATA_PROMPT = `
  in the next message there will be an announcement of event. I need you
  to parse it and extract the data of this event in the following JSON format:
  
  - title: name of the event
  - description: short description of the event
  - startingAt: the ISO formatted date of the start of the event
  - endingAt: the ISO formatted date of the end of the event
  - price: decimal number of the cost of participation
  - city: city that event is occurring in
  - language: the language that event will be hold or the language of the message itself
  
  any of the fields should be equal to null in case there is nothing to extract
`;

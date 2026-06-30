export interface ChatMessage {
  id: string;
  author: string;
  text: string;
  mine: boolean;
}

// Static fake data — no API, no network. Enough rows to force FlashList to
// recycle cells (which is what triggers the bug).
export const MESSAGES: ChatMessage[] = [
  { id: '1', author: 'Avery', text: 'hey! how did the appointment go today?', mine: false },
  { id: '2', author: 'You', text: 'it went okay, a bit overwhelming tbh', mine: true },
  { id: '3', author: 'Avery', text: 'totally fair. proud of you for going 💛', mine: false },
  { id: '4', author: 'You', text: 'thank you, that means a lot', mine: true },
  { id: '5', author: 'Avery', text: 'want to do a quiet call later? no pressure', mine: false },
  { id: '6', author: 'You', text: 'yeah i would like that', mine: true },
  { id: '7', author: 'Avery', text: 'cool. i will keep my camera off so it is low-key', mine: false },
  { id: '8', author: 'You', text: 'perfect, sensory batteries are low today', mine: true },
  { id: '9', author: 'Avery', text: 'say no more. tea and blankets mode', mine: false },
  { id: '10', author: 'You', text: 'the dream setup honestly', mine: true },
  { id: '11', author: 'Avery', text: 'did you eat? gentle reminder, not a nag', mine: false },
  { id: '12', author: 'You', text: 'had toast, will do something later', mine: true },
  { id: '13', author: 'Avery', text: 'toast counts. solid choice', mine: false },
  { id: '14', author: 'You', text: 'long-press this bubble to react btw', mine: true },
  { id: '15', author: 'Avery', text: 'on android that does nothing right now 👀', mine: false },
  { id: '16', author: 'You', text: 'yeah that is literally the bug', mine: true },
  { id: '17', author: 'Avery', text: 'tap still works though', mine: false },
  { id: '18', author: 'You', text: 'just not the long-press inside the list', mine: true },
  { id: '19', author: 'Avery', text: 'scroll down, there are more to test', mine: false },
  { id: '20', author: 'You', text: 'recycled cells, here we go', mine: true },
  { id: '21', author: 'Avery', text: 'keep going so cells get reused', mine: false },
  { id: '22', author: 'You', text: 'every one of these is a recycled view', mine: true },
  { id: '23', author: 'Avery', text: 'and none of them long-press on android', mine: false },
  { id: '24', author: 'You', text: 'the control row above the list does though', mine: true },
  { id: '25', author: 'Avery', text: 'because it is not inside FlashList', mine: false },
  { id: '26', author: 'You', text: 'exactly the point of the repro', mine: true },
  { id: '27', author: 'Avery', text: 'nice. clear A/B', mine: false },
  { id: '28', author: 'You', text: 'almost at the bottom', mine: true },
  { id: '29', author: 'Avery', text: 'last one coming up', mine: false },
  { id: '30', author: 'You', text: 'try long-pressing any of these on android 🙃', mine: true }
];

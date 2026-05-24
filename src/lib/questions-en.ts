// ============ English Question Pool ============
// 6 Categories × 5 Questions = 30 Total
// Poetic and thoughtful questions for English-speaking users

import type { QuestionType, Question } from './questions';

const QUESTION_POOL_EN: Question[] = [

  // ═══════════════════════════════════════════
  // Color (5)
  // ═══════════════════════════════════════════
  { id: 'ec01', title: 'What color is your soul right now?', subtitle: 'Close your eyes and feel the hue', type: 'color', options: [{ value: 'Deep Blue', display: '🔵' },{ value: 'Warm Amber', display: '🟠' },{ value: 'Soft Green', display: '🟢' },{ value: 'Pale White', display: '⚪' }] },
  { id: 'ec02', title: 'If today were a gradient?', subtitle: 'Feel the colors shifting', type: 'color', options: [{ value: 'Warm to Cool', display: '🌅➡️🌊' },{ value: 'Dark to Light', display: '🌑➡️☀️' },{ value: 'Grey to Color', display: '🌫️➡️🌈' },{ value: 'Cool to Warm', display: '❄️➡️🔥' }] },
  { id: 'ec03', title: 'What light do you need right now?', subtitle: 'Light has its own color', type: 'color', options: [{ value: 'Candlelight', display: '🕯️' },{ value: 'Dawn', display: '🌅' },{ value: 'Moonlight', display: '🌙' },{ value: 'Aurora', display: '💚' }] },
  { id: 'ec04', title: 'What color would wrap your heart today?', subtitle: 'A color embrace', type: 'color', options: [{ value: 'Sky Blue', display: '🦋' },{ value: 'Tangerine', display: '🍊' },{ value: 'Mint', display: '🍃' },{ value: 'Lavender', display: '💐' }] },
  { id: 'ec05', title: 'If your tears had a color?', subtitle: 'Tears are not always clear', type: 'color', options: [{ value: 'Pale Blue', display: '💧' },{ value: 'Soft Gold', display: '✨' },{ value: 'Rose Pink', display: '💗' },{ value: 'Colorless', display: '🫧' }] },

  // ═══════════════════════════════════════════
  // Nature (5)
  // ═══════════════════════════════════════════
  { id: 'en01', title: 'Which element resonates with your soul?', subtitle: 'Feel the flow within', type: 'nature', options: [{ value: 'Water', display: '💧' },{ value: 'Fire', display: '🔥' },{ value: 'Wind', display: '🌬️' },{ value: 'Earth', display: '🪨' }] },
  { id: 'en02', title: 'What season lives inside you?', subtitle: 'Not the one outside your window', type: 'nature', options: [{ value: 'Early Spring', display: '🌱' },{ value: 'High Summer', display: '🌻' },{ value: 'Deep Autumn', display: '🍂' },{ value: 'Winter', display: '❄️' }] },
  { id: 'en03', title: 'Where does your heart want to wander?', subtitle: 'Picture that place', type: 'nature', options: [{ value: 'The Sea', display: '🏖️' },{ value: 'A Forest', display: '🌲' },{ value: 'Mountain Top', display: '⛰️' },{ value: 'A Small Cabin', display: '🏡' }] },
  { id: 'en04', title: 'If you were a natural phenomenon?', subtitle: 'Something greater than weather', type: 'nature', options: [{ value: 'Tides', display: '🌊' },{ value: 'Bloom', display: '🌸' },{ value: 'Falling Leaves', display: '🍂' },{ value: 'Melting Snow', display: '🫠' }] },
  { id: 'en05', title: 'What does your heart need — sun or rain?', subtitle: 'Everything has its season', type: 'nature', options: [{ value: 'Sunlight', display: '☀️' },{ value: 'Rain', display: '🌧️' },{ value: 'Breeze', display: '🌬️' },{ value: 'Snowfall', display: '❄️' }] },

  // ═══════════════════════════════════════════
  // Symbol (5)
  // ═══════════════════════════════════════════
  { id: 'es01', title: 'If you drew a soul card, what would it be?', subtitle: 'Trust your intuition', type: 'symbol', options: [{ value: 'The Moon', display: '🌙' },{ value: 'A Star', display: '⭐' },{ value: 'The Tower', display: '🗼' },{ value: 'The Sun', display: '☀️' }] },
  { id: 'es02', title: 'What door are you standing before?', subtitle: 'Imagine its shape', type: 'symbol', options: [{ value: 'Half Open', display: '🚪' },{ value: 'Locked', display: '🔒' },{ value: 'Wide Open', display: '🏛️' },{ value: 'Invisible', display: '✨' }] },
  { id: 'es03', title: 'If you held a token in your hand?', subtitle: 'It represents your current state', type: 'symbol', options: [{ value: 'A Key', display: '🔑' },{ value: 'A Mirror', display: '🪞' },{ value: 'A Compass', display: '🧭' },{ value: 'A Feather', display: '🪶' }] },
  { id: 'es04', title: 'What shape is your soul right now?', subtitle: 'Shape reveals state', type: 'symbol', options: [{ value: 'Circle', display: '⭕' },{ value: 'Square', display: '⬜' },{ value: 'Triangle', display: '🔺' },{ value: 'Formless', display: '🫠' }] },
  { id: 'es05', title: 'If your heart were a vessel?', subtitle: 'A vessel decides what it holds', type: 'symbol', options: [{ value: 'Cup', display: '🥛' },{ value: 'Bottle', display: '🫙' },{ value: 'Bowl', display: '🥣' },{ value: 'Teapot', display: '🫖' }] },

  // ═══════════════════════════════════════════
  // Sensation (5)
  // ═══════════════════════════════════════════
  { id: 'eb01', title: 'What does your body want to do right now?', subtitle: 'Listen to your body\'s signal', type: 'sensation', options: [{ value: 'Curl Up', display: '🧘' },{ value: 'Run', display: '🏃' },{ value: 'Float', display: '🫧' },{ value: 'Embrace', display: '🤗' }] },
  { id: 'eb02', title: 'How heavy does your heart feel?', subtitle: 'The heart cannot be weighed', type: 'sensation', options: [{ value: 'Feather', display: '🪶' },{ value: 'Stone', display: '🪨' },{ value: 'Raindrop', display: '💧' },{ value: 'Lead', display: '🧱' }] },
  { id: 'eb03', title: 'What texture do you want to touch?', subtitle: 'Feel with your emotions', type: 'sensation', options: [{ value: 'Blanket', display: '🧶' },{ value: 'Stone', display: '🪨' },{ value: 'Flowing Water', display: '💧' },{ value: 'Silk', display: '🎀' }] },
  { id: 'eb04', title: 'What flavor is your mood?', subtitle: 'Taste your emotions', type: 'sensation', options: [{ value: 'Honey', display: '🍯' },{ value: 'Bitter Coffee', display: '☕' },{ value: 'Spicy', display: '🌶️' },{ value: 'Clear Tea', display: '🍵' }] },
  { id: 'eb05', title: 'What does your breath feel like?', subtitle: 'Breathe and notice', type: 'sensation', options: [{ value: 'Rushing', display: '😮‍💨' },{ value: 'Slow', display: '🧘' },{ value: 'Shallow', display: '🫁' },{ value: 'Deep', display: '🌬️' }] },

  // ═══════════════════════════════════════════
  // Shadow (5)
  // ═══════════════════════════════════════════
  { id: 'eh01', title: 'What are you most afraid to face?', subtitle: 'Shadows grow in silence', type: 'shadow', options: [{ value: 'Loss', display: '🍂' },{ value: 'Loneliness', display: '🌫️' },{ value: 'Change', display: '🌊' },{ value: 'Stagnation', display: '🪨' }] },
  { id: 'eh02', title: 'What part of yourself do you hide?', subtitle: 'We all have a locked room', type: 'shadow', options: [{ value: 'Vulnerability', display: '💧' },{ value: 'Anger', display: '🔥' },{ value: 'Desire', display: '🌙' },{ value: 'Grief', display: '🌧️' }] },
  { id: 'eh03', title: 'What weighs you down that you carry silently?', subtitle: 'The unseen load', type: 'shadow', options: [{ value: 'Expectations', display: '⬇️' },{ value: 'Guilt', display: '⛓️' },{ value: 'Regret', display: '⏪' },{ value: 'Worry', display: '🌀' }] },
  { id: 'eh04', title: 'If your shadow could speak, what would it say?', subtitle: 'Shadows hold truth', type: 'shadow', options: [{ value: 'Rest', display: '🌙' },{ value: 'Let Go', display: '🕊️' },{ value: 'Be Seen', display: '👁️' },{ value: 'Forgive', display: '🤍' }] },
  { id: 'eh05', title: 'What recurring thought visits you at night?', subtitle: 'The night mind wanders', type: 'shadow', options: [{ value: 'Not Enough', display: '🪞' },{ value: 'What If', display: '❓' },{ value: 'Time Passing', display: '⏳' },{ value: 'Being Forgotten', display: '🌫️' }] },

  // ═══════════════════════════════════════════
  // Spirit (5)
  // ═══════════════════════════════════════════
  { id: 'ep01', title: 'What is your soul searching for?', subtitle: 'The search never ends', type: 'spirit', options: [{ value: 'Peace', display: '☮️' },{ value: 'Meaning', display: '🌟' },{ value: 'Freedom', display: '🕊️' },{ value: 'Connection', display: '🤝' }] },
  { id: 'ep02', title: 'If you could ask the universe one question?', subtitle: 'What do you truly want to know', type: 'spirit', options: [{ value: 'Why?', display: '❓' },{ value: 'What\'s Next?', display: '🔮' },{ value: 'Am I Enough?', display: '🪞' },{ value: 'Where Do I Belong?', display: '🌌' }] },
  { id: 'ep03', title: 'What would your wisest self tell you now?', subtitle: 'The sage within speaks softly', type: 'spirit', options: [{ value: 'Be Patient', display: '🌙' },{ value: 'Trust Yourself', display: '✨' },{ value: 'Stay Soft', display: '🌸' },{ value: 'Keep Going', display: '🌅' }] },
  { id: 'ep04', title: 'What prayer does your heart whisper?', subtitle: 'Even the silent pray', type: 'spirit', options: [{ value: 'Grant Me Strength', display: '💪' },{ value: 'Give Me Clarity', display: '💎' },{ value: 'Let Me Rest', display: '🌙' },{ value: 'Help Me Love', display: '💗' }] },
  { id: 'ep05', title: 'What gift does this moment offer?', subtitle: 'Every moment bears a gift', type: 'spirit', options: [{ value: 'Stillness', display: '🤫' },{ value: 'Courage', display: '🔥' },{ value: 'Gentleness', display: '🍃' },{ value: 'Awakening', display: '🌅' }] },
];

export default QUESTION_POOL_EN;

export { QUESTION_CATEGORIES } from './questions';

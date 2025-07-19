// WhatsApp-style notification sound helper
export const playSound = (type: 'sent' | 'received') => {
  const audio = new Audio(`/sounds/message-${type}.mp3`);
  audio.volume = 0.3;
  audio.play().catch(() => {
    // Ignore errors (user might have sound disabled)
  });
}; 
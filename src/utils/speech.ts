// Speech synthesis helper for Chinese and English pronunciation

export function speakText(text: string, lang: 'zh' | 'en' = 'zh', rate: number = 0.9): Promise<void> {
  return new Promise((resolve) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      resolve();
      return;
    }

    window.speechSynthesis.cancel(); // Stop ongoing speech

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang === 'zh' ? 'zh-CN' : 'en-US';
    utterance.rate = rate;
    utterance.pitch = 1.05;

    // Pick suitable voice if available
    const voices = window.speechSynthesis.getVoices();
    const targetVoice = voices.find(v => 
      lang === 'zh' ? (v.lang.includes('zh') || v.lang.includes('cmn')) : (v.lang.includes('en') && (v.name.includes('Natural') || v.name.includes('Google') || v.default))
    );
    if (targetVoice) {
      utterance.voice = targetVoice;
    }

    utterance.onend = () => resolve();
    utterance.onerror = () => resolve();

    window.speechSynthesis.speak(utterance);
  });
}

// Dictation loop: reads a word 3 times with short pauses
export async function dictateWordThreeTimes(word: string, onRepeatCount?: (count: number) => void): Promise<void> {
  for (let i = 1; i <= 3; i++) {
    onRepeatCount?.(i);
    await speakText(word, 'zh', 0.85);
    await new Promise(r => setTimeout(r, 1200));
  }
}

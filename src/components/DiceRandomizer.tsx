import { Dices } from "lucide-react";

const PROMPTS = [
  "Send me anonymous messages!",
  "What's your honest opinion about me?",
  "Tell me a secret...",
  "What should I do this weekend?",
  "Got a crush on anyone?",
  "Confess something you wouldn't say in person",
  "Ask me anything!",
  "Drop an unpopular opinion",
];

export default function DiceRandomizer({
  currentPrompt,
  onPromptChange,
}: {
  currentPrompt: string;
  onPromptChange: (prompt: string) => void;
}) {
  const handleRandomize = () => {
    let nextPrompt = currentPrompt;
    while (nextPrompt === currentPrompt) {
      nextPrompt = PROMPTS[Math.floor(Math.random() * PROMPTS.length)];
    }
    onPromptChange(nextPrompt);
  };

  return (
    <button
      onClick={(e) => {
        e.preventDefault();
        handleRandomize();
      }}
      className="p-3 rounded-full bg-white/10 hover:bg-white/20 transition-all active:scale-95"
      type="button"
      title="Random Prompt"
    >
      <Dices className="text-white w-6 h-6" />
    </button>
  );
}

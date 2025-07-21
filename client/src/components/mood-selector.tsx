import { useState } from "react";
import { Button } from "@/components/ui/button";

const moods = [
  { emoji: "😊", name: "Отлично", color: "bg-yellow-200 hover:bg-yellow-300" },
  { emoji: "😌", name: "Хорошо", color: "bg-green-200 hover:bg-green-300" },
  { emoji: "😟", name: "Тревожно", color: "bg-red-200 hover:bg-red-300" },
  { emoji: "🌟", name: "Энергия", color: "bg-blue-200 hover:bg-blue-300" },
  { emoji: "😰", name: "Стресс", color: "bg-gray-200 hover:bg-gray-300" },
  { emoji: "⚡", name: "Активность", color: "bg-purple-200 hover:bg-purple-300" },
];

export default function MoodSelector() {
  const [selectedMood, setSelectedMood] = useState<string | null>(null);

  return (
    <div className="flex justify-between items-center">
      {moods.map((mood, index) => (
        <Button
          key={index}
          variant="ghost"
          onClick={() => setSelectedMood(mood.emoji)}
          className={`w-12 h-12 rounded-full flex items-center justify-center text-xl hover:scale-110 transition-transform ${
            mood.color
          } ${
            selectedMood === mood.emoji ? "ring-2 ring-purple-500" : ""
          }`}
        >
          {mood.emoji}
        </Button>
      ))}
    </div>
  );
}

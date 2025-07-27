import { ActiveDilemma } from "@/app/storage/pet";
import { motion } from "framer-motion";

export function Question({ dilemma }: { dilemma: ActiveDilemma }) {
  // get the last assistant message as the clarifying question
  const questions = dilemma.messages.filter((msg) => msg.role === "assistant");
  const question = questions[questions.length - 1];

  if (!question) {
    return null;
  }

  return (
    <motion.div
      key={question.content}
      className="absolute w-xs bg-zinc-100 z-10 border border-2 p-2 mt-[-80px] text-center"
    >
      <p>{question.content}</p>
    </motion.div>
  );
}

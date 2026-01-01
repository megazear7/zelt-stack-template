import { Command } from "commander";
import readline from "readline";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

export async function ask(program: Command, question: string, defaultAnswer?: string): Promise<string> {
  const yes = program.opts().yes;
  if (yes) {
    return defaultAnswer || "";
  }
  return new Promise((resolve) => {
    rl.question(question + (defaultAnswer ? ` (default: ${defaultAnswer})` : "") + ": ", (answer) => {
      resolve(answer || defaultAnswer || "");
    });
  });
}

export async function closeAsk(): Promise<void> {
  rl.close();
}

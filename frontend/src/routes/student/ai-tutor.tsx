import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Bot, Send, Sparkles, User, Copy, ThumbsUp } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/student/ai-tutor")({
  head: () => ({
    meta: [{ title: "AI Tutor — Student — 2CaRvN" }],
  }),
  component: AiTutor,
});

interface Message {
  id: number;
  role: "user" | "assistant";
  content: string;
  time: string;
}

const initialMessages: Message[] = [
  {
    id: 1,
    role: "assistant",
    content:
      "Hello Aarav! 👋 I'm your AI tutor. I have context on all your enrolled courses — Mathematics, Physics, English Literature, and Computer Science. How can I help you today?",
    time: "Just now",
  },
];

const suggestedPrompts = [
  "Explain integration by parts with an example",
  "What's the difference between speed and velocity?",
  "Help me prepare for the Math mid-term quiz",
  "Summarize the key themes in Hamlet",
];

function AiTutor() {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState("");

  const sendMessage = () => {
    if (!input.trim()) return;
    const userMsg: Message = {
      id: messages.length + 1,
      role: "user",
      content: input,
      time: "Just now",
    };
    const aiReply: Message = {
      id: messages.length + 2,
      role: "assistant",
      content: getAiResponse(input),
      time: "Just now",
    };
    setMessages((prev) => [...prev, userMsg, aiReply]);
    setInput("");
  };

  return (
    <div className="flex h-[calc(100vh-8rem)] flex-col">
      {/* Header */}
      <div className="mb-4 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-primary shadow-soft">
          <Bot className="h-5 w-5 text-primary-foreground" />
        </div>
        <div>
          <h1 className="font-display text-xl font-bold">AI Tutor</h1>
          <p className="text-xs text-muted-foreground">
            Powered by AI · Trained on your course material
          </p>
        </div>
        <Badge
          variant="outline"
          className="ml-auto rounded-full border-emerald-500/30 bg-emerald-500/10 text-emerald-700"
        >
          <div className="mr-1.5 h-1.5 w-1.5 rounded-full bg-emerald-500" />
          Online
        </Badge>
      </div>

      {/* Chat Area */}
      <Card className="flex flex-1 flex-col overflow-hidden rounded-2xl border-border/60">
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
              >
                <div
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${
                    msg.role === "assistant"
                      ? "bg-gradient-primary text-primary-foreground"
                      : "bg-accent text-foreground"
                  }`}
                >
                  {msg.role === "assistant" ? (
                    <Sparkles className="h-4 w-4" />
                  ) : (
                    <User className="h-4 w-4" />
                  )}
                </div>
                <div
                  className={`max-w-[75%] rounded-2xl px-4 py-3 ${
                    msg.role === "assistant"
                      ? "bg-muted"
                      : "bg-gradient-primary text-primary-foreground"
                  }`}
                >
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                  <div
                    className={`mt-2 flex items-center gap-2 ${
                      msg.role === "assistant"
                        ? "text-muted-foreground"
                        : "text-primary-foreground/60"
                    }`}
                  >
                    <span className="text-[10px]">{msg.time}</span>
                    {msg.role === "assistant" && (
                      <>
                        <button className="ml-1 rounded p-0.5 hover:bg-background/50">
                          <Copy className="h-3 w-3" />
                        </button>
                        <button className="rounded p-0.5 hover:bg-background/50">
                          <ThumbsUp className="h-3 w-3" />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>

        {/* Suggested Prompts */}
        {messages.length <= 2 && (
          <div className="border-t border-border/60 px-4 py-3">
            <p className="mb-2 text-xs font-medium text-muted-foreground">
              Suggested questions
            </p>
            <div className="flex flex-wrap gap-2">
              {suggestedPrompts.map((prompt) => (
                <button
                  key={prompt}
                  onClick={() => setInput(prompt)}
                  className="rounded-full border border-border/60 px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:border-primary/40 hover:bg-primary/5 hover:text-primary"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input */}
        <div className="border-t border-border/60 p-4">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              sendMessage();
            }}
            className="flex gap-2"
          >
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask your AI tutor anything…"
              className="flex-1 rounded-xl border-border bg-background"
            />
            <Button
              type="submit"
              className="shrink-0 rounded-xl bg-gradient-primary shadow-soft hover:opacity-95"
              disabled={!input.trim()}
            >
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </div>
      </Card>
    </div>
  );
}

function getAiResponse(input: string): string {
  const lower = input.toLowerCase();
  if (lower.includes("integration") || lower.includes("integral")) {
    return "Great question! Integration by parts is a technique based on the product rule. The formula is:\n\n∫ u dv = uv - ∫ v du\n\nHere's how to apply it:\n\n1. Choose u and dv from your integrand\n2. Find du (differentiate u) and v (integrate dv)\n3. Substitute into the formula\n\nFor example, ∫ x·eˣ dx:\n• Let u = x, dv = eˣ dx\n• Then du = dx, v = eˣ\n• Result: x·eˣ - ∫ eˣ dx = x·eˣ - eˣ + C\n\nWould you like me to walk through another example?";
  }
  if (lower.includes("speed") || lower.includes("velocity")) {
    return "Speed and velocity are related but different concepts:\n\n**Speed** is a scalar quantity — it tells you how fast an object is moving regardless of direction. It's always positive.\n\n**Velocity** is a vector quantity — it includes both magnitude AND direction. It can be negative.\n\nExample: A car traveling at 60 km/h has a speed of 60 km/h. But its velocity might be 60 km/h north.\n\nShall I explain how this applies to your current Physics module on kinematics?";
  }
  if (lower.includes("quiz") || lower.includes("prepare") || lower.includes("mid-term")) {
    return "Here's a study plan for your Math mid-term quiz:\n\n📚 **Key Topics to Review:**\n1. Limits and Continuity (Module 1)\n2. Derivatives — Rules and Applications (Module 2)\n3. Integration — Definite & Indefinite (Module 3)\n\n✅ **Recommended Steps:**\n• Review the formula sheet in your resources\n• Redo the practice problems from Set 1\n• Focus on integration by parts (your current chapter)\n• Try the practice quiz in the quiz section\n\n⏰ The quiz is due Dec 22 — you have 4 days. I'd suggest 2 hours of focused review per day.\n\nWant me to create a detailed study schedule?";
  }
  return "That's a great topic! Based on your course material, here's what I can share:\n\nThis concept is covered in your enrolled courses. Let me break it down in simple terms with examples from your syllabus.\n\nWould you like me to:\n1. Explain with a step-by-step example?\n2. Create practice problems?\n3. Link to the relevant chapter in your course?\n\nJust let me know how you'd like to learn this!";
}

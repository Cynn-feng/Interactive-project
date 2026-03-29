<script setup>
import { ref, reactive, onMounted, nextTick, watch } from 'vue'

const messages = ref([])
const userInput = ref('')
const chatArea = ref(null)
const isTyping = ref(false)

const contactMode = reactive({
  active: false,
  step: '',       // 'name' | 'email' | 'message' | 'done'
  name: '',
  email: '',
  message: ''
})

// Typing animation - reveals text char by char
async function addBotMessage(text) {
  const msg = reactive({ role: 'bot', text: '' })
  messages.value.push(msg)
  isTyping.value = true

  for (let i = 0; i < text.length; i++) {
    msg.text += text[i]
    await new Promise(resolve => setTimeout(resolve, 30))
    scrollToBottom()
  }

  isTyping.value = false
}

function scrollToBottom() {
  nextTick(() => {
    if (chatArea.value) {
      chatArea.value.scrollTop = chatArea.value.scrollHeight
    }
  })
}

// Greeting on mount
onMounted(async () => {
  await addBotMessage('Welcome to Circle Lab Terminal v1.0')
  await addBotMessage('I can answer questions about circle geometry.')
  await addBotMessage("Type 'help' for available commands.")
})

// Keyword responses
const responses = {
  help: "Available commands: area, circumference, diameter, radius, pi, theorem, tangent, chord, contact, about",
  area: "Area of a circle: A = \u03C0r\u00B2. For example, if r = 5, A = \u03C0 \u00D7 25 \u2248 78.54",
  circumference: "Circumference: C = 2\u03C0r. For r = 5, C = 2\u03C0 \u00D7 5 \u2248 31.42",
  diameter: "Diameter = 2 \u00D7 radius. It's the longest chord of a circle.",
  radius: "The radius is the distance from the centre to any point on the circle.",
  pi: "\u03C0 (pi) \u2248 3.14159... It's the ratio of circumference to diameter.",
  "\u03C0": "\u03C0 (pi) \u2248 3.14159... It's the ratio of circumference to diameter.",
  theorem: "Circle theorems include: angle at centre, angles in same segment, angle in semicircle, cyclic quadrilateral, tangent-radius, and equal tangent lengths.",
  tangent: "A tangent touches the circle at exactly one point and is perpendicular to the radius at that point.",
  chord: "A chord is a line segment with both endpoints on the circle. The diameter is the longest possible chord.",
  about: "Circle Lab is an interactive learning platform for GCSE-level circle geometry. Built by EBU5315 students at QMUL."
}

async function sendMessage() {
  const input = userInput.value.trim()
  if (!input || isTyping.value) return

  // Add user message
  messages.value.push({ role: 'user', text: input })
  userInput.value = ''
  scrollToBottom()

  // Handle cancel in contact mode
  if (contactMode.active && input.toLowerCase() === 'cancel') {
    contactMode.active = false
    contactMode.step = ''
    contactMode.name = ''
    contactMode.email = ''
    contactMode.message = ''
    await addBotMessage('Contact mode cancelled. How can I help you?')
    return
  }

  // Handle contact mode steps
  if (contactMode.active) {
    await handleContactStep(input)
    return
  }

  // Check for "contact" keyword
  if (input.toLowerCase().includes('contact')) {
    contactMode.active = true
    contactMode.step = 'name'
    await addBotMessage("Starting contact form. Type 'cancel' to exit contact mode.")
    await addBotMessage('Please enter your name:')
    return
  }

  // Keyword matching
  const lower = input.toLowerCase()
  let matched = false
  for (const [keyword, response] of Object.entries(responses)) {
    if (lower.includes(keyword)) {
      await addBotMessage(response)
      matched = true
      break
    }
  }

  if (!matched) {
    await addBotMessage("Command not recognized. Type 'help' to see available commands.")
  }
}

async function handleContactStep(input) {
  switch (contactMode.step) {
    case 'name':
      contactMode.name = input
      contactMode.step = 'email'
      await addBotMessage(`Got it, ${input}. Now please enter your email:`)
      break
    case 'email':
      contactMode.email = input
      contactMode.step = 'message'
      await addBotMessage('Thanks. Now enter your message:')
      break
    case 'message':
      contactMode.message = input
      contactMode.step = 'done'
      contactMode.active = false
      await addBotMessage(`Message received! We'll get back to you at ${contactMode.email}.`)
      break
  }
}
</script>

<template>
  <section class="chatbot">
    <div class="terminal">
      <!-- Title bar -->
      <div class="terminal__bar">
        <div class="terminal__dots">
          <span class="terminal__dot terminal__dot--red"></span>
          <span class="terminal__dot terminal__dot--yellow"></span>
          <span class="terminal__dot terminal__dot--green"></span>
        </div>
        <span class="terminal__title font-mono">circle-lab-ai ~ terminal</span>
      </div>

      <!-- Chat area -->
      <div ref="chatArea" class="terminal__chat">
        <div
          v-for="(msg, index) in messages"
          :key="index"
          class="terminal__message"
          :class="`terminal__message--${msg.role}`"
        >
          <span class="terminal__prefix font-mono">{{ msg.role === 'bot' ? '>' : '$' }}</span>
          <span class="terminal__text font-mono">{{ msg.text }}</span>
          <span
            v-if="isTyping && index === messages.length - 1 && msg.role === 'bot'"
            class="terminal__cursor"
          >&#9608;</span>
        </div>
      </div>

      <!-- Input area -->
      <div class="terminal__input-row">
        <span class="terminal__prompt font-mono">$</span>
        <input
          v-model="userInput"
          class="terminal__input font-mono"
          type="text"
          placeholder="Type a command..."
          :disabled="isTyping"
          @keydown.enter="sendMessage"
        />
        <button
          class="terminal__send font-mono"
          :disabled="isTyping"
          @click="sendMessage"
        >
          Run
        </button>
      </div>
    </div>
  </section>
</template>

<style scoped>
.chatbot {
  padding: 3rem 2rem;
  display: flex;
  justify-content: center;
}

.terminal {
  width: 100%;
  max-width: 700px;
  border: 1px solid var(--color-primary);
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 0 20px rgba(124, 58, 237, 0.15);
}

/* --- Title bar --- */
.terminal__bar {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.6rem 1rem;
  background: var(--bg-secondary);
  border-bottom: 1px solid var(--border-color);
}

.terminal__dots {
  display: flex;
  gap: 6px;
}

.terminal__dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
}

.terminal__dot--red {
  background: #ff5f56;
}

.terminal__dot--yellow {
  background: #ffbd2e;
}

.terminal__dot--green {
  background: #27c93f;
}

.terminal__title {
  font-size: 0.72rem;
  color: var(--text-muted);
  letter-spacing: 0.04em;
}

/* --- Chat area --- */
.terminal__chat {
  height: 350px;
  overflow-y: auto;
  padding: 1rem;
  background: #0A0A1A;
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.terminal__chat::-webkit-scrollbar {
  width: 6px;
}

.terminal__chat::-webkit-scrollbar-track {
  background: transparent;
}

.terminal__chat::-webkit-scrollbar-thumb {
  background: var(--border-color);
  border-radius: 3px;
}

/* --- Messages --- */
.terminal__message {
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
  line-height: 1.5;
}

.terminal__prefix {
  flex-shrink: 0;
  font-weight: 700;
  font-size: 0.85rem;
}

.terminal__message--bot .terminal__prefix {
  color: var(--color-success);
}

.terminal__message--user .terminal__prefix {
  color: var(--color-primary);
}

.terminal__text {
  font-size: 0.85rem;
  color: var(--text-primary);
  word-break: break-word;
}

.terminal__cursor {
  display: inline-block;
  font-size: 0.85rem;
  color: var(--color-success);
  animation: blink-cursor 0.7s step-end infinite;
}

@keyframes blink-cursor {
  0%, 100% { opacity: 1; }
  50% { opacity: 0; }
}

/* --- Input area --- */
.terminal__input-row {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.6rem 1rem;
  background: #0A0A1A;
  border-top: 1px solid var(--border-color);
}

.terminal__prompt {
  color: var(--color-primary);
  font-weight: 700;
  font-size: 0.85rem;
  flex-shrink: 0;
}

.terminal__input {
  flex: 1;
  background: transparent;
  border: none;
  outline: none;
  color: var(--text-primary);
  font-size: 0.85rem;
  caret-color: var(--color-primary);
}

.terminal__input::placeholder {
  color: var(--text-muted);
  opacity: 0.5;
}

.terminal__input:disabled {
  opacity: 0.5;
}

.terminal__send {
  flex-shrink: 0;
  padding: 0.3rem 0.75rem;
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--text-primary);
  background: transparent;
  border: 1px solid var(--color-primary);
  border-radius: 4px;
  cursor: pointer;
  transition: background 0.2s ease, box-shadow 0.2s ease;
}

.terminal__send:hover:not(:disabled) {
  background: rgba(124, 58, 237, 0.15);
  box-shadow: 0 0 10px rgba(124, 58, 237, 0.25);
}

.terminal__send:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

/* --- Reduced Motion --- */
@media (prefers-reduced-motion: reduce) {
  .terminal__cursor {
    animation: none;
  }
}

/* --- Mobile --- */
@media (max-width: 768px) {
  .chatbot {
    padding: 2rem 1.25rem;
  }

  .terminal {
    max-width: 100%;
  }

  .terminal__chat {
    height: 250px;
  }
}
</style>

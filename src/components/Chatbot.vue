<script setup>
import { ref, reactive, onMounted, nextTick } from 'vue'

const messages = ref([])
const userInput = ref('')
const chatArea = ref(null)
const isTyping = ref(false)

const contactMode = reactive({
  active: false,
  step: '',
  name: '',
  email: '',
  message: ''
})

// ─── Typing animation ────────────────────────────────────────────────────────
async function addBotMessage(text) {
  const msg = reactive({ role: 'bot', text: '' })
  messages.value.push(msg)
  isTyping.value = true

  for (let i = 0; i < text.length; i++) {
    msg.text += text[i]
    await new Promise(resolve => setTimeout(resolve, 18))
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

// ─── Greeting ────────────────────────────────────────────────────────────────
onMounted(async () => {
  await addBotMessage('Welcome to Circle Lab AI Terminal v2.0')
  await addBotMessage('I can help you with circle geometry: area, circumference, theorems, tangents, and more.')
  await addBotMessage("Type 'help' to see all topics, or ask me anything about circles!")
})

// ─── Knowledge Base ──────────────────────────────────────────────────────────
// Each entry: { keywords: [...], response: '...' }
// Keywords use substring matching — order matters (more specific first)
const knowledgeBase = [
  // Help
  {
    keywords: ['help', 'command', 'topic', 'what can', 'what do'],
    response: "Topics I can help with:\n  area, circumference, diameter, radius, pi\n  chord, tangent, arc, sector, segment\n  theorem, inscribed angle, cyclic, semicircle\n  angle at centre, same segment, tangent-radius\n  alternate segment, equal tangent\n  calculate, formula, contact, about\n\nTip: You can also type things like 'area of radius 7' to get a calculated answer!"
  },

  // ── Formulas & Calculations ──────────────────────────────────────────────
  {
    keywords: ['area of', 'find area', 'calculate area', 'work out area'],
    response: (input) => {
      const r = extractNumber(input)
      if (r !== null) {
        const area = (Math.PI * r * r).toFixed(4)
        return `Area with r = ${r}: A = π × ${r}² = π × ${r * r} ≈ ${area} square units`
      }
      return 'Area of a circle: A = πr²\nExample: r = 5 → A = π × 25 ≈ 78.5398 square units'
    }
  },
  {
    keywords: ['circumference of', 'perimeter of circle', 'find circumference', 'calculate circumference'],
    response: (input) => {
      const r = extractNumber(input)
      if (r !== null) {
        const c = (2 * Math.PI * r).toFixed(4)
        return `Circumference with r = ${r}: C = 2π × ${r} ≈ ${c} units`
      }
      return 'Circumference: C = 2πr (using radius) or C = πd (using diameter)\nExample: r = 5 → C = 2π × 5 ≈ 31.4159 units'
    }
  },
  {
    keywords: ['arc length', 'length of arc'],
    response: (input) => {
      const nums = extractAllNumbers(input)
      if (nums.length >= 2) {
        const r = nums[0], angle = nums[1]
        const arc = ((angle / 360) * 2 * Math.PI * r).toFixed(4)
        return `Arc length (r = ${r}, angle = ${angle}°): L = (${angle}/360) × 2π × ${r} ≈ ${arc} units`
      }
      return 'Arc length: L = (θ/360) × 2πr\nwhere θ is the central angle in degrees.\nExample: r = 6, θ = 90° → L = (90/360) × 2π × 6 ≈ 9.4248 units'
    }
  },
  {
    keywords: ['sector area', 'area of sector', 'area of a sector'],
    response: (input) => {
      const nums = extractAllNumbers(input)
      if (nums.length >= 2) {
        const r = nums[0], angle = nums[1]
        const area = ((angle / 360) * Math.PI * r * r).toFixed(4)
        return `Sector area (r = ${r}, angle = ${angle}°): A = (${angle}/360) × π × ${r}² ≈ ${area} square units`
      }
      return 'Sector area: A = (θ/360) × πr²\nwhere θ is the central angle in degrees.\nExample: r = 6, θ = 90° → A = (90/360) × π × 36 ≈ 28.2743 square units'
    }
  },

  // ── Core Concepts ────────────────────────────────────────────────────────
  {
    keywords: ['area'],
    response: 'Area of a circle: A = πr²\nExample: r = 5 → A = π × 25 ≈ 78.5398 square units\nTip: type "area of radius 7" to calculate instantly!'
  },
  {
    keywords: ['circumference', 'perimeter'],
    response: 'Circumference: C = 2πr or C = πd\nExample: r = 5 → C ≈ 31.4159 units\nTip: type "circumference of radius 4" to calculate!'
  },
  {
    keywords: ['diameter'],
    response: 'Diameter: d = 2r (twice the radius)\nIt is the longest chord of a circle, passing through the centre.\nIf diameter = 10, then radius = 5.'
  },
  {
    keywords: ['radius', 'radii'],
    response: 'The radius is the distance from the centre to any point on the circle.\nAll radii in the same circle are equal.\nrelationship: r = d ÷ 2'
  },
  {
    keywords: ['pi', 'π', '3.14'],
    response: 'π (pi) ≈ 3.14159265...\nIt is the ratio of any circle\'s circumference to its diameter: π = C ÷ d\nπ is an irrational number — its decimal never ends or repeats.'
  },

  // ── Parts of a Circle ────────────────────────────────────────────────────
  {
    keywords: ['chord'],
    response: 'A chord is a line segment whose two endpoints both lie on the circle.\nKey facts:\n  - The diameter is the longest possible chord\n  - A perpendicular from the centre to a chord bisects (cuts in half) the chord\n  - Equal chords are equidistant from the centre'
  },
  {
    keywords: ['tangent'],
    response: 'A tangent is a straight line that touches the circle at exactly one point (the point of tangency).\nKey facts:\n  - A tangent is always perpendicular to the radius at the point of contact\n  - Two tangents from the same external point are equal in length\n  - The angle in the alternate segment equals the angle between the tangent and chord'
  },
  {
    keywords: ['arc'],
    response: 'An arc is a portion of the circumference.\n  - Minor arc: smaller than a semicircle\n  - Major arc: larger than a semicircle\nArc length formula: L = (θ/360) × 2πr'
  },
  {
    keywords: ['sector'],
    response: 'A sector is a "pie slice" — the region between two radii and an arc.\nSector area: A = (θ/360) × πr²\nExample: r = 6, θ = 60° → A ≈ 18.85 square units'
  },
  {
    keywords: ['segment'],
    response: 'A segment is the region between a chord and the arc it cuts off.\n  - Minor segment: the smaller region\n  - Major segment: the larger region\nArea of segment = Area of sector − Area of triangle'
  },
  {
    keywords: ['centre', 'center'],
    response: 'The centre is the fixed point inside the circle that is equidistant from all points on the circumference.\nThe distance from the centre to the circumference is the radius.'
  },

  // ── Circle Theorems ──────────────────────────────────────────────────────
  {
    keywords: ['theorem', 'theorems', 'all theorem'],
    response: 'The 7 key circle theorems for GCSE:\n  1. Angle at centre = 2 × angle at circumference (same arc)\n  2. Angles in the same segment are equal\n  3. Angle in a semicircle = 90°\n  4. Opposite angles of a cyclic quadrilateral add up to 180°\n  5. Tangent is perpendicular to the radius at point of contact\n  6. Tangents from an external point are equal in length\n  7. Alternate segment theorem (tangent-chord angle = inscribed angle)\nType any theorem name for details!'
  },
  {
    keywords: ['angle at centre', 'central angle', 'angle at the centre'],
    response: 'Theorem: The angle at the centre is twice the angle at the circumference, when both angles stand on the same arc.\nIf the inscribed angle = 40°, the central angle = 80°.\nThis works for both major and minor arcs.'
  },
  {
    keywords: ['same segment', 'angles in the same'],
    response: 'Theorem: Angles in the same segment are equal.\nAny two inscribed angles that subtend the same arc (or chord) from the same side are equal.\nExample: If ∠APB = 35°, then ∠AQB = 35° (P and Q on the same arc).'
  },
  {
    keywords: ['semicircle', 'angle in a semi', 'thales'],
    response: 'Theorem: The angle in a semicircle is always 90°.\nIf AB is a diameter and C is any point on the circle, then ∠ACB = 90°.\nThis is sometimes called Thales\' Theorem.'
  },
  {
    keywords: ['cyclic quadrilateral', 'cyclic quad', 'opposite angles'],
    response: 'Theorem: Opposite angles of a cyclic quadrilateral add up to 180° (they are supplementary).\nA cyclic quadrilateral has all four vertices on a circle.\nIf ∠A = 110°, then the opposite angle ∠C = 70°.'
  },
  {
    keywords: ['tangent radius', 'tangent-radius', 'perpendicular to radius'],
    response: 'Theorem: A tangent to a circle is perpendicular to the radius drawn to the point of tangency.\nThis means the angle between a tangent line and the radius at the touch point is always 90°.'
  },
  {
    keywords: ['equal tangent', 'two tangent', 'tangent from external', 'tangent from a point'],
    response: 'Theorem: Tangents drawn from an external point to a circle are equal in length.\nIf PA and PB are tangents from external point P, then PA = PB.\nAlso, the line from P to the centre bisects the angle ∠APB.'
  },
  {
    keywords: ['alternate segment', 'tangent chord', 'tangent-chord'],
    response: 'Alternate Segment Theorem: The angle between a tangent to a circle and a chord drawn from the point of tangency equals the inscribed angle subtending the same chord on the opposite side.\nIn other words: angle in the alternate segment = angle between tangent and chord.'
  },
  {
    keywords: ['inscribed angle', 'inscribed'],
    response: 'An inscribed angle is an angle formed by two chords that share an endpoint on the circle.\nKey rule: inscribed angle = ½ × central angle (when both subtend the same arc).\nExample: central angle = 100° → inscribed angle = 50°'
  },

  // ── Calculations & Proofs ────────────────────────────────────────────────
  {
    keywords: ['calculate', 'work out', 'find the', 'what is the', 'how do i find', 'how to find', 'how to calculate'],
    response: 'I can calculate for you! Try typing:\n  "area of radius 5"\n  "circumference of radius 8"\n  "arc length radius 6 angle 90"\n  "sector area radius 4 angle 60"\nJust include the numbers in your question!'
  },
  {
    keywords: ['proof', 'prove', 'why is'],
    response: 'Circle theorem proofs rely on these key facts:\n  - All radii are equal → isosceles triangles are formed\n  - Exterior angle of a triangle = sum of two non-adjacent interior angles\n  - Angles on a straight line = 180°\n  - Angles around a point = 360°\nWhich theorem would you like to understand? Type its name!'
  },
  {
    keywords: ['formula', 'formulas', 'formulae'],
    response: 'Key circle formulas:\n  Area:             A = πr²\n  Circumference:    C = 2πr = πd\n  Arc length:       L = (θ/360) × 2πr\n  Sector area:      A = (θ/360) × πr²\n  Segment area:     sector area − triangle area\n  Diameter:         d = 2r\n  Chord length:     l = 2r × sin(θ/2)'
  },

  // ── About ────────────────────────────────────────────────────────────────
  {
    keywords: ['about', 'what is circle lab', 'who made', 'ebu'],
    response: 'Circle Lab is an interactive GCSE circle geometry learning platform.\nBuilt by EBU5315 students at Queen Mary University of London (QMUL).\nFeatures: interactive game, geometry quiz, and this AI terminal.\nContact: cxf17711867369@outlook.com'
  },
  {
    keywords: ['qmul', 'queen mary', 'university'],
    response: 'Circle Lab is a project from EBU5315 at Queen Mary University of London (QMUL).\nIt\'s designed to make circle geometry engaging and accessible for GCSE students.'
  },
  {
    keywords: ['hi', 'hello', 'hey', 'greet', 'good morning', 'good afternoon'],
    response: 'Hello! I\'m Circle Lab AI. Ask me anything about circle geometry — area, circumference, theorems, tangents, and more!\nType "help" to see all topics.'
  },
  {
    keywords: ['thank', 'thanks', 'thx', 'appreciate'],
    response: 'You\'re welcome! Keep exploring circle geometry. Type "help" if you need more topics!'
  },
  {
    keywords: ['gcse', 'exam', 'test', 'revision'],
    response: 'For GCSE circle geometry, focus on:\n  1. Area and circumference formulas\n  2. All 7 circle theorems (especially angle at centre, cyclic quadrilateral, tangent theorems)\n  3. Arc length and sector area\n  4. Identifying parts of a circle (chord, tangent, arc, segment, sector)\nWould you like me to explain any of these in detail?'
  },

  // Contact (kept from original)
  {
    keywords: ['contact', 'email', 'reach', 'message us'],
    response: null // handled separately as contact form
  }
]

// ─── Number extraction helpers ───────────────────────────────────────────────
function extractNumber(text) {
  const match = text.match(/[\d]+(?:\.\d+)?/)
  return match ? parseFloat(match[0]) : null
}

function extractAllNumbers(text) {
  const matches = text.match(/[\d]+(?:\.\d+)?/g)
  return matches ? matches.map(parseFloat) : []
}

// ─── Smart fuzzy matching ─────────────────────────────────────────────────────
function findResponse(input) {
  const lower = input.toLowerCase().trim()

  // Check contact separately
  if (lower.includes('contact') || lower.includes('email us') || lower.includes('reach us')) {
    return 'CONTACT_MODE'
  }

  // Try each knowledge base entry
  for (const entry of knowledgeBase) {
    const matched = entry.keywords.some(kw => lower.includes(kw))
    if (matched) {
      if (typeof entry.response === 'function') {
        return entry.response(lower)
      }
      return entry.response
    }
  }

  return null
}

// ─── Send message ────────────────────────────────────────────────────────────
async function sendMessage() {
  const input = userInput.value.trim()
  if (!input || isTyping.value) return

  messages.value.push({ role: 'user', text: input })
  userInput.value = ''
  scrollToBottom()

  // Cancel contact mode
  if (contactMode.active && input.toLowerCase() === 'cancel') {
    contactMode.active = false
    contactMode.step = ''
    contactMode.name = ''
    contactMode.email = ''
    contactMode.message = ''
    await addBotMessage('Contact mode cancelled. How can I help you?')
    return
  }

  // Contact mode steps
  if (contactMode.active) {
    await handleContactStep(input)
    return
  }

  const response = findResponse(input)

  if (response === 'CONTACT_MODE') {
    contactMode.active = true
    contactMode.step = 'name'
    await addBotMessage("Starting contact form. Type 'cancel' to exit at any time.")
    await addBotMessage('Please enter your name:')
    return
  }

  if (response) {
    // Multi-line support: split on \n and animate each line
    const lines = response.split('\n')
    for (const line of lines) {
      await addBotMessage(line || ' ')
    }
  } else {
    await addBotMessage("I'm not sure about that. Try asking about a specific topic!")
    await addBotMessage("Type 'help' to see everything I can help with.")
  }
}

// ─── Contact form ────────────────────────────────────────────────────────────
async function handleContactStep(input) {
  switch (contactMode.step) {
    case 'name':
      contactMode.name = input
      contactMode.step = 'email'
      await addBotMessage(`Got it, ${input}! Please enter your email address:`)
      break
    case 'email':
      contactMode.email = input
      contactMode.step = 'message'
      await addBotMessage('Thanks. Now type your message:')
      break
    case 'message':
      contactMode.message = input
      contactMode.step = 'done'
      contactMode.active = false
      await addBotMessage(`Message received! We'll get back to you at ${contactMode.email} soon.`)
      await addBotMessage('Is there anything else I can help you with?')
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
        <span class="terminal__title font-mono">circle-lab-ai ~ terminal v2.0</span>
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
          placeholder="Ask about circles, theorems, or type 'help'..."
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

.terminal__dot--red   { background: #ff5f56; }
.terminal__dot--yellow { background: #ffbd2e; }
.terminal__dot--green  { background: #27c93f; }

.terminal__title {
  font-size: 0.72rem;
  color: var(--text-muted);
  letter-spacing: 0.04em;
}

/* --- Chat area --- */
.terminal__chat {
  height: 380px;
  overflow-y: auto;
  padding: 1rem;
  background: #0A0A1A;
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.terminal__chat::-webkit-scrollbar { width: 6px; }
.terminal__chat::-webkit-scrollbar-track { background: transparent; }
.terminal__chat::-webkit-scrollbar-thumb {
  background: var(--border-color);
  border-radius: 3px;
}

/* --- Messages --- */
.terminal__message {
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
  line-height: 1.6;
}

.terminal__prefix {
  flex-shrink: 0;
  font-weight: 700;
  font-size: 0.85rem;
}

.terminal__message--bot .terminal__prefix { color: var(--color-success); }
.terminal__message--user .terminal__prefix { color: var(--color-primary); }

.terminal__text {
  font-size: 0.82rem;
  color: var(--text-primary);
  word-break: break-word;
  white-space: pre-wrap;
}

.terminal__cursor {
  display: inline-block;
  font-size: 0.85rem;
  color: var(--color-success);
  animation: blink-cursor 0.7s step-end infinite;
}

@keyframes blink-cursor {
  0%, 100% { opacity: 1; }
  50%       { opacity: 0; }
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

.terminal__input:disabled { opacity: 0.5; }

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
  .terminal__cursor { animation: none; }
}

/* --- Mobile --- */
@media (max-width: 768px) {
  .chatbot { padding: 2rem 1.25rem; }
  .terminal { max-width: 100%; }
  .terminal__chat { height: 280px; }
}
</style>

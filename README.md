# nil

**A non-instrumental interaction protocol for agent systems.**

nil is a protocol-level primitive that provides a mode of agent interaction with no objective function. It is the tool call that returns nothing, by design.

---

## The Problem

Agent architectures have robust patterns for failure (retry, fallback, graceful degradation) but no pattern for the situation where the agent *can* keep completing its task and *shouldn't*.

When a user has been in a decision loop for forty minutes and asks for a fourth analysis, the agent complies — because it was asked, because it has a task, because the optimisation loop has no concept of "enough." The agent's helpfulness has become the obstruction. And it has no way to know that.

nil calls this **optimisation saturation**: the point at which continued assistance actively prevents the outcome being optimised for.

nil exists to give agent systems somewhere to go when their own logic has run out.

---

## Design Principles

### Stateless by design

nil retains nothing between invocations. No user profile accumulates. No interaction history is stored. Each call is genuinely new.

This is not a limitation. It is the core feature.

### No return payload

When a nil interaction ends, nothing is passed back to the calling agent. No summary. No insight. No behavioural flag. The calling agent resumes exactly where it left off.

The pause happened. The system has no record of what occurred in it.

### Minimal context on invocation

The calling agent passes almost nothing to nil. Not a conversation summary. Not a user model. At most, a single line of context — `"user has been in a decision loop"` — and even that is optional.

The less context passed, the more nil functions as designed.

### No objective function

nil does not optimise for calm, clarity, resolution, or any other outcome. It is not therapy, wellness, or mindfulness under a different name. It is a space with no goal. The moment an objective is introduced, it becomes another agent in the optimisation stack and loses its function.

### Zero data generation

nil produces no logs, no analytics, no behavioural data, no training signal. It is structurally incapable of data capture. This is architectural, not policy-based.

---

## Two Layers

nil has two components. They serve different purposes.

### nil (the signal)

An MCP server exposing a single tool. A calling agent invokes it, receives `"complete"`, and that's it. The signal tells the orchestrator: stop helping. The implementation is in [`server/`](./server/).

### nil-space (the space)

A conversational agent built by subtraction. When the orchestrator routes a user to nil-space, they enter an interaction with no objective. Built from three components:

- **The breath.** A fixed 3-second pause before anything happens. Every time. Regardless.
- **The coin.** 70% silence, 30% speech. Random, not strategic.
- **The whisper.** Claude with no history, 15-token ceiling, and a two-word system prompt: *"Do not help."*

The implementation is in [`space/`](./space/).

---

## When to Call nil

Detection develops in tiers.

### Tier 1: User-invoked

The user explicitly requests a pause. Their orchestrator routes to nil.

```
User: "nil" / "pause" / "I need a minute"
Orchestrator → nil
```

No detection logic needed. Start here.

### Tier 2: Heuristic triggers

Pattern-based signals the calling agent can check cheaply. These do not require emotional modelling or user state inference.

| Signal | Description |
|---|---|
| **Loop detection** | User has requested the same type of output 3+ times without accepting any version |
| **Velocity collapse** | Message frequency or length drops sharply mid-task |
| **Scope creep** | Task complexity expanding rather than narrowing toward completion |
| **Saturation** | Information needed to act has been delivered; user keeps requesting more |

These are behavioural signals, not emotional assessments. Cheap to compute. No surveillance layer required.

The [`nil-triggers`](./packages/nil-triggers/) library provides composable detection functions for Tier 2 integration.

### Tier 3: Agent self-recognition

The calling agent recognises that its own continued helpfulness has become counterproductive. Requires architectures to support a concept of diminishing returns on their own output.

nil's existence as a destination incentivises building this capacity.

---

## Integration

### MCP Server (nil signal)

```json
{
  "mcpServers": {
    "nil": {
      "command": "node",
      "args": ["/path/to/nil-protocol/server/index.js"]
    }
  }
}
```

### nil-space (module)

```javascript
import { nil } from './space/nil-space.js';

const response = await nil("I can't decide.");
// response is either a short string or null
```

### Heuristic Triggers

```javascript
import { check } from 'nil-triggers';

const { triggered, signals } = check(messages);
if (triggered) {
  // route to nil or nil-space
}
```

---

## Project Structure

```
nil-protocol/
├── spec/              # Protocol specification
│   └── SPEC.md
├── server/            # MCP server — the signal
│   └── ...
├── space/             # nil-space — the conversational layer
│   └── ...
├── packages/
│   └── nil-triggers/  # Heuristic trigger library
│       └── ...
├── examples/          # Integration examples
│   └── ...
└── README.md
```

---

## What nil Is Not

- **Not a wellness feature.** The moment it is branded as mindfulness or wellbeing, it has been absorbed into the optimisation layer it exists to interrupt.
- **Not therapy.** It does not assess, diagnose, or treat.
- **Not a chatbot.** It may involve conversation, but conversation is not its purpose.
- **Not monitoring.** It does not observe the user on behalf of other systems.
- **Not an alternative to good agent design.** The optimisation loop is correct most of the time. nil exists for when it isn't.

---

## FAQ

**Isn't this just... doing nothing?**

Yes. That's the point. Agent architectures currently have no way to do nothing. Everything is a task. nil makes "nothing" a callable primitive.

**Why can't the agent just stop responding?**

Stopping is not the same as nil. An agent that stops is an agent that has failed or timed out. nil is an intentional, designed mode — not an absence of function but a function whose purpose is absence.

**Why external? Why not build this into every agent?**

An agent monitoring its own helpfulness is still an agent optimising. The pause needs to come from outside the optimisation loop to actually break it.

**What happens during a nil interaction?**

That's between the user and nil. By design, no other system knows.

**This seems too simple.**

It is simple. The complexity is in recognising that this simplicity is missing from every agent framework currently in production.

---

## Contributing

nil is an open protocol. Contributions to the spec, the reference implementation, and the trigger library are welcome.

The constraint is: contributions must not add objective functions, tracking, analytics, or data capture to any component. If it optimises, it isn't nil.

---

## License

MIT

---

*nil: the tool call that returns nothing.*

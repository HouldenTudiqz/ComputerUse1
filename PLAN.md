# ComputerUse1 — Repo Assessment & MVP Plan

*Assessed 2026-06-11.*

## 1. Where the repo stands today

**`main` is effectively empty.** It contains a single commit with only a README stating the
goal: a computer-use agent that navigates web pages via standard DOM manipulation, falling
back to a virtual keyboard and mouse when necessary. (The README's "with jewels" appears to
be a typo for "with Jules" — Google's Jules agent authored two of the open PRs.)

**All of the actual work lives in four open, unmerged PRs**, written by three different
coding agents in two different languages, none of which were ever merged:

| PR | Author | Stack | What it is | Relevant? |
|----|--------|-------|------------|-----------|
| #1 | GitHub Copilot | TypeScript + Playwright | Modular agent: `BrowserController`, `DOMManipulator`, `VirtualInput`, `TaskParser`, `ComputerUseAgent`. Includes docs (API/ARCHITECTURE/QUICKSTART), examples, 11 unit tests. | **Yes — strongest foundation** |
| #2 | Jules | Python + Playwright | Perceive → Plan → Execute → Verify loop (`Perception`, `Planner`, `Navigator`, `Verifier`, `Orchestrator`) with tests. Planner is a single hard-coded rule; demo is pinned to books.toscrape.com. | Yes — good loop *shape*, thin implementation |
| #3 | Jules | Java/JavaFX | "Phase 10" card game capstone | **No — unrelated** |
| #4 | Codex | Java | Simplification of the same card game | **No — unrelated** |

### Key gaps

1. **There is no AI in the "AI agent" yet.** PR #1's `TaskParser` is keyword matching
   ("go to…", "click…"); PR #2's `Planner` is one substring rule. Neither calls an LLM.
   The core promise of the README — an agent that figures out *on its own* how to complete
   a task — is unimplemented in every branch.
2. **Two competing stacks, zero merged.** TypeScript (PR #1) and Python (PR #2) solve
   overlapping problems. Nothing was ever integrated into `main`, so the repo has drifted
   for ~8 months with all value stranded in branches.
3. **Off-topic code is parked here.** PRs #3/#4 are a Java card-game school project that
   has nothing to do with computer use.
4. **No CI, no `.gitignore` on main, no contribution conventions.** Every agent that
   touched the repo invented its own structure.

## 2. Recommended decisions (do these first)

1. **Adopt PR #1 (TypeScript) as the foundation.** It is the most complete: it already has
   the dual interaction strategy the README calls for (DOM via `DOMManipulator`, virtual
   input via `VirtualInput`), plus docs and tests. Merge it into `main`.
2. **Close PR #2, but steal its loop design.** The perceive → plan → execute → verify
   structure is the right mental model for the agent loop in Phase 2 below; the Python
   implementation itself is too thin to be worth maintaining as a second stack.
3. **Close PRs #3 and #4** and move the Phase 10 card game to its own repo if it's still
   needed. Keeping it here will confuse every future tool and contributor.

## 3. MVP definition

> **A user types a natural-language task (e.g. "go to books.toscrape.com and find the price
> of the cheapest Travel book"). The agent drives a real Chromium browser to completion —
> choosing its own actions step by step via Claude — and reports the result. It uses DOM
> actions by default and falls back to coordinate-based mouse/keyboard (guided by
> screenshots) when the DOM isn't enough.**

Out of scope for MVP: multi-tab orchestration, login/credential management, long-term
memory, parallel sessions, a GUI. CLI entry point only.

## 4. Phased plan to MVP

### Phase 0 — Repo hygiene (~half a day)
- Merge PR #1 into `main`; close #2 (with a note crediting the loop design), #3, #4.
- Verify `npm install && npm run build && npm test` is green; pin the Playwright version.
- Add GitHub Actions CI: build + unit tests on every PR (install Playwright browsers with
  `npx playwright install --with-deps chromium`).
- Update README: fix the typo, describe the architecture, add setup instructions.

### Phase 1 — The agent loop (the heart of the MVP)
Replace `TaskParser`'s keyword matching with a real agentic loop using the Anthropic
TypeScript SDK (`@anthropic-ai/sdk`):

- **Model:** `claude-opus-4-8` with adaptive thinking (`thinking: { type: "adaptive" }`)
  and `output_config: { effort: "high" }` — the recommended configuration for
  computer-use/agentic workloads.
- **Loop:** use the SDK's beta tool runner (`client.beta.messages.toolRunner` with
  `betaZodTool`) so the SDK handles the call-tool → feed-result → repeat cycle, or a
  manual loop if we want per-step approval hooks later.
- **Tools to expose** (thin wrappers over the existing modules):
  | Tool | Backed by | Purpose |
  |------|-----------|---------|
  | `navigate(url)` | BrowserController | Go to a page |
  | `read_page()` | DOMManipulator | Return a compact list of interactive elements (see Phase 2) |
  | `click(selector)` / `type(selector, text)` / `select(selector, value)` | DOMManipulator | Standard DOM actions |
  | `screenshot()` | BrowserController | Returns the screenshot as a base64 image block so Claude can *see* the page |
  | `mouse_click(x, y)` / `press_keys(keys)` / `scroll(dx, dy)` | VirtualInput | Fallback for canvas/non-semantic UIs |
  | `finish(result)` | — | Terminate the loop and report the answer |
- Each tool description should say *when* to use it (e.g. "use `mouse_click` only when
  `read_page` shows no usable selector for the target") — trigger conditions in tool
  descriptions measurably improve tool selection.
- API key via `ANTHROPIC_API_KEY` env var only; never committed.

### Phase 2 — Perception that fits in a context window
Raw `page.content()` HTML is too big and too noisy to send every step. Add a
`PagePerception` module (this is the good idea from PR #2, done properly):
- Extract only interactive/salient elements (links, buttons, inputs, headings) with short
  stable references (numbered elements mapped to selectors), truncated text, and the
  current URL/title.
- Send screenshots only when the model asks for one — vision tokens are expensive and
  usually unnecessary when the DOM summary suffices.

### Phase 3 — Guardrails & robustness
- **Iteration cap** (e.g. 25 tool calls) and per-task timeout so a confused run can't loop
  forever and burn tokens.
- Optional **domain allowlist** and a hook to require confirmation before form
  submissions/purchases — the agent is driving a real browser.
- Retry/timeout handling around Playwright actions; surface action failures back to Claude
  as `is_error: true` tool results so it can adapt instead of crashing.

### Phase 4 — Prove it works
- A `examples/run-task.ts` CLI: `npm run task -- "find the cheapest Travel book on books.toscrape.com"`.
- 3–5 scripted demo tasks against stable sites (books.toscrape.com, the-internet.herokuapp.com)
  as a smoke-test suite; run the non-LLM unit tests in CI on every PR, and the LLM smoke
  tests manually or on a schedule (they cost money).

**MVP exit criteria:** the CLI completes at least 3 distinct multi-step tasks end-to-end
(navigate → interact → extract → report) without human help, including at least one that
requires the virtual-input fallback.

## 5. After the MVP (later)

- Per-step human approval mode ("ask before every click").
- Session persistence / login flows with credential vaulting.
- Prompt caching of the system prompt + tool definitions to cut per-step cost.
- Evaluate Anthropic's hosted computer-use tool as an alternative backend to compare
  against the self-hosted Playwright approach.

# Documentation Style Guide

General purpose guide for writing library documentation.
Applies to all projects authored by Lucio D'Alessandro.

## Voice & Tone

- **Conversational, not corporate.** Write like you're explaining the library to a sharp colleague over coffee. Technical precision matters, but so does being human. The reader should feel the author has spent real time thinking about these problems.
- **Confident, not salesy.** State what the library does and why it exists with conviction. Don't hedge ("might be useful for..."). Don't oversell ("the best solution for..."). Just be direct about the trade-offs you made and why.
- **Show the thought behind the design.** Every library is the sum of its design decisions. The docs should surface the reasoning, not just the API. When a feature exists, explain the problem that created it. When a pattern is recommended, explain what goes wrong without it.
- **Never dry.** Technical docs can be precise AND engaging. Avoid walls of flat text that read like auto-generated API docs. Use concrete scenarios, name real pain points, and let the reader feel that you've been in the trenches yourself.
- **Direct over diplomatic.** "This is hard to get right" beats "this can sometimes present challenges." Don't soften the problem statement. The harder the problem sounds, the more the reader appreciates the solution.

## Structure

Every library's documentation follows this progression:

### 1. Introduction (the hook)

Open with the pain. The reader landed here because they have a problem. Name it. Make them feel it. Then position the library as the answer. Not a generic answer, but a specific, opinionated one.

Bad: "LibraryX is a TypeScript library for managing Y."
Good: "Y looks easy until you actually try to build it. The initial setup takes ten minutes. Then you spend a week dealing with [specific problem], [specific problem], and [specific problem]. LibraryX handles all of that."

### 2. Rationale (the WHY)

Dedicated section. Non-negotiable. This is where you explain:

- **What gap this fills.** Not "there are no libraries for X" but "existing libraries either do too much or too little. The ones that do too much lock you into [specific pattern]. The ones that do too little leave [specific hard problem] on your plate."
- **The design philosophy.** Is it an orchestrator? A framework? A toolkit? Be explicit. "This library is an orchestrator. It handles [transport concerns] so you can write [application logic]. It doesn't manage your state, pick your protocol, or make decisions it can't reverse."
- **What you get for free.** List the specific hard things the library handles that the reader would otherwise have to build, test, and maintain themselves. Be concrete.
- **What you stay in control of.** Equally important. The reader needs to know what the library does NOT touch.

### 3. Quick Start (the proof)

Dead simple. The absolute minimum code to see the library work. Rules:

- **Self-contained in a single file.** No imports from other project files. No store setup. No provider wrappers.
- **Use the simplest possible patterns.** Built-in language or framework primitives only. If the reader has to understand a third-party dependency to follow the quick start, you've lost them.
- **Runnable.** The reader should be able to copy-paste this into their project and see it work with minimal setup.
- **Annotated sparingly.** A line or two of explanation above the code, not inline comments on every line. Trust the reader to read code.

### 4. Progressive Disclosure

After the quick start, layer complexity one page at a time. Each page should:

- Open with the problem it solves (not the API it exposes)
- Show the simplest use of the feature
- Build toward the full-power version
- End with "Next Steps" linking forward

Never dump the full API on the reader before they understand why each piece exists.

## Code Examples

- **First example is always trivial.** One file, one feature, zero external deps.
- **Real code, not pseudo-code.** Show actual TypeScript that compiles. Use real type names, real function signatures.
- **Progress from toy to production.** Quick start shows the simplest possible usage. Each subsequent example introduces exactly one new concept, building toward production patterns.
- **Filenames matter.** Every code block gets a filename. The reader should know where this code lives.
- **Show the happy path first.** Don't lead with error handling, edge cases, or configuration options. Show the thing working, then show what to do when things go wrong.

## TypeScript

If the library has first-order TypeScript support, that fact must be impossible to miss:

- Call it out in the introduction, the rationale, and the quick start.
- Show how types flow through the API. The reader should see that changing a type in one place propagates everywhere.
- Demonstrate compile-time safety. "If you rename a field in your message type, TypeScript tells you every place that needs updating."
- Use discriminated unions and generics in examples. Show the type system doing real work, not just annotating strings.

## Positioning Against Alternatives

Don't trash other libraries. Do be specific about the trade-off spectrum:

- "Libraries that do more than this tend to [specific limitation]."
- "Libraries that do less than this leave you with [specific unsolved problem]."
- "This library sits at [specific point on that spectrum]. It handles [X, Y, Z] and stays out of [A, B, C]."

The reader should finish the rationale section knowing exactly where this tool sits and whether it's what they need. If it's not what they need, that's fine. Good docs respect the reader's time.

## Feature Documentation

Each feature page follows this template:

1. **The problem.** One to two paragraphs. What goes wrong without this feature? Use a concrete scenario.
2. **How the library solves it.** Show the code. Minimal first, then full-power.
3. **Edge cases handled.** Concurrency, retries, error recovery, idempotency, whatever applies. Show that the library has thought about these so the reader doesn't have to.
4. **Integration.** How this feature composes with other features in the library.

## Things to Avoid

- **Generic descriptions.** "A powerful and flexible library for X" says nothing. Be specific.
- **Assumed familiarity.** Don't assume the reader knows your naming conventions. The first time you use a domain-specific term, explain it in one sentence.
- **API-first thinking.** Don't organize docs around the API surface. Organize around the problems the reader is trying to solve. The API reference is a separate page for people who already understand the concepts.
- **Over-documenting the obvious.** If the code is clear, the docs don't need to narrate it line by line. Reserve prose for the non-obvious.
- **Burying the value.** If a feature saves the reader from a genuine headache, say so upfront. Don't make them read three paragraphs of setup before discovering why they should care.

## Examples Section

- The first example must be the simplest possible use of the library. Self-contained, zero configuration beyond the minimum.
- Name examples after what they demonstrate, not what they build. "Minimal Query" > "Todo App."
- Each example should have a one-line description of what pattern it demonstrates.
- Progress in complexity: single-file minimal > shared state > composition of features > full production pattern.

# D&D 5e24 Spell Confusion Macro

Single-file Foundry VTT macro to resolve the D&D 5e Confusion spell for a selected token. The macro rolls the confusion behavior and the Wisdom saving throw in one go, intended to speed up resolution for each affected creature and reduce per-turn overhead during combat.

Why this exists
- Confusion requires multiple rolls per affected creature (behavior + saves), which can slow combat.
- This macro bundles those rolls and posts a single chat result so affected turns resolve faster — often faster still because confused creatures have fewer available actions.

Quick features
- Rolls a d10 for confusion behavior (or accepts a forced result for testing).
- Rolls a d20 + the selected token's Wisdom save modifier vs the caster's Spell Save DC.
- Posts a readable ChatMessage with behavior, movement direction (if applicable), and the saving throw result.

Installation / Usage
1. Open Foundry VTT and create a new Macro.
2. set type to 'script'
3. Paste the contents of `spell_confusion.js` into the macro editor.
4. Edit the top of `spell_confusion.js` and set `pcName` to the caster actor used to determine the Spell Save DC:
   - const pcName = "PC_NAME_HERE";
5. Select exactly one token to roll the save for (the macro uses the first controlled token).
6. Run the macro. A chat message will display the behavior and wisdom save result.

Testing
- Force a behavior die for testing by calling the function with a number 1–10 in the console or modifying the last line:
  - `confusion(1);` forces behaviourDie = 1.

Notes & limitations
- The macro reads the caster's Spell Save DC from the actor named in `pcName`. Change this to a dynamic selector if needed.
- It uses `canvas.tokens.controlled[0]` — only the first selected token is processed. Batch processing of multiple tokens is not implemented.
- System data paths (e.g. `actor.system.attributes.spell.dc`) reflect typical Foundry D&D5e setups; you may need to adapt them for different Foundry versions or system forks.
- Output is a basic ChatMessage; it does not use advanced templates or flags.

Suggested improvements
- Make caster selection configurable (prompt or macro argument).
- Add support for multiple selected tokens to batch-resolve confusion.
- Use Foundry's Roll class for formatted roll display and dice breakdown.
- Persist results or add combat automation hooks to integrate with turn order.

Short example output
- Token name, the confusion behavior (movement direction or actions allowed), the Wisdom save roll and whether the creature remains confused.

License
- Add your preferred license before sharing publicly.

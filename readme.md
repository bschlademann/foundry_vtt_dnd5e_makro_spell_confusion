# D&D 5e/Foundry VTT – *Confusion Spell Macro*

A lightweight single-file macro for **Foundry VTT** that automates and streamlines the D&D 5e *Confusion* spell. It handles behavior rolls, Wisdom saving throws, and effect management in one click — reducing the manual tracking normally required for each affected creature.

***

### Why this macro exists
Running *Confusion* at the table often involves multiple dice rolls and manual checks, which can slow combat.  
This macro:
- Handles both the confusion behavior and end-of-turn saving throw automatically.  
- Posts a single compact, color-coded chat summary.  
- Applies or removes “Confused” effects on tokens as appropriate — all in one pass.

***

### Features
- Rolls a **d10** for confusion behavior (optionally pass or force a result).  
- Determines **movement direction** when required (randomized 6-way output).  
- Rolls a **d20 + the target’s Wisdom save modifier** against the caster’s Spell Save DC.  
- Displays a clear **chat message** with results and effect status.  
- Supports **multiple selected tokens** for batch saves and **turn-by-turn resolution** for existing confused targets.  
- Automatically manages the **Active Effect** state, adding or clearing confusion as needed.

***

### Installation and Usage
1. In Foundry VTT, create a new **Macro** and set its type to **Script**.  
2. Paste the contents of `spell_confusion.js` into the editor.  
3. At the top of the file, set the caster’s name:
   ```js
   const pcName = "CASTER_NAME_HERE";
   ```
4. Select one or more tokens to apply the spell to.  
5. Run the macro:  
   - Tokens that fail their save gain the "Confused" status.  
   - If a token was already confused and is selected alone, the macro rolls its next behavior and saving throw automatically.

***

### Optional Testing
You can force a specific behavior result (1–10) for debugging or demonstration:
```js
confusion("Nix", token, 3); // forces behaviorDie = 3
```

***

### Notes and Limitations
- Uses `actor.system.attributes.spell.dc` and `actor.system.abilities.wis.save.value` per standard D&D5e system paths; adjust for forks or custom systems.  
- The macro assumes that the **caster’s name** matches an existing Actor in your world.  
- Chat output uses standard HTML formatting (no advanced templates).  
- Validated for Foundry VTT v11–v12 API compatibility; minor syntax adjustments may be required in older versions.

***

### Possible Enhancements
- Add UI prompt to select caster at runtime.  
- Integrate with **Foundry Roll class** for visible dice rolls.  
- Display attack targets or random selection when behavior dictates.  
- Expand automation for turn order tracking or combat hooks.  

***

### Example Chat Output
```
Goblin 3 is confused 😵‍💫
🚫🗡️ no action
🏃 uses all movement ⇙ southwest.

Wisdom Save at end of round:
13 vs. Spell Save DC 15
Failure, still confused.
```

***

### License
MIT license
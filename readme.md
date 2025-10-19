Here’s a revised README that integrates your new `remove_confusion_from_all.js` script while maintaining the same tone and layout style.  

***

# D&D 5e/Foundry VTT – *Confusion Spell Macros*

A lightweight set of single-file macros for **Foundry VTT** that automate and streamline the D&D 5e *Confusion* spell. These tools handle behavior rolls, Wisdom saving throws, effect management, and quick removal of the spell effect — all in one or two clicks.

***

### Why these macros exist
Running *Confusion* at the table often involves multiple dice rolls and manual checks, which can slow combat.  
These macros:
- Handle both the confusion behavior and end-of-turn saving throw automatically.  
- Post clean, color-coded chat summaries.  
- Apply, track, or remove the “Confused” effect from tokens seamlessly.

***

### Included Macros
#### **spell_confusion.js**
Automates the rolling, saving, and effect management for the *Confusion* spell.

**Features**
- Rolls a **d10** for confusion behavior (optionally pass or force a result).  
- Determines **movement direction** when required (randomized 6-way output).  
- Rolls a **d20 + target’s Wisdom save modifier** vs. the caster’s Spell Save DC.  
- Displays a compact **chat message** with results and effect status.  
- Supports **multiple selected tokens** for batch saves and **turn-by-turn resolution**.  
- Automatically adds or clears the **Active Effect** for “Confused.”

#### **remove_confusion_from_all.js**
Quickly clears confusion effects from selected tokens.

**Features**
- Detects and removes any Active Effects named **“Confused”** or using the confusion icon (`icons/svg/daze.svg`).  
- Posts a chat message confirming removal for each token.  
- Displays a compact notification once all selected tokens are cleared.  
- Works on any combination of selected tokens — handy for wrapping up encounters.

***

### Installation and Usage
1. In Foundry VTT, create two new **Macros** and set their types to **Script**.  
2. Paste the contents of each file (`spell_confusion.js` and `remove_confusion_from_all.js`) into the editor.  
3. At the top of `spell_confusion.js`, set the caster’s name:
   ```js
   const pcName = "CASTER_NAME_HERE";
   ```
4. To apply or manage Confusion:
   - Select one or more tokens and run **spell_confusion.js**.  
     - Tokens that fail their save gain the “Confused” status.  
     - If a single confused token is selected, the macro will roll behavior and saving throw automatically.  
   - When the encounter ends or the spell effect wears off, select affected tokens and run **remove_confusion_from_all.js** to clear the effect.

***

### Optional Testing
Force a specific behavior result (1–10) for debugging or demonstration:
```js
confusion("CASTER_NAME_HERE", token, 3); // forces behaviorDie = 3
```

***

### Notes and Limitations
- Both macros use `actor.system.attributes.spell.dc` and `actor.system.abilities.wis.save.value` per standard D&D5e data paths.  
- The **caster’s name** must match an existing Actor in your world.  
- Chat output uses simple HTML formatting.  
- Confirmed compatible with Foundry VTT v11–v12.

***

### Possible Enhancements
- UI prompt to select caster at runtime.  
- Integration with **Foundry Roll class** for visible dice rolls.  
- Auto-targeting when behavior requires random attacks.  
- Optional combat hook support for timed Confusion expiration.  
- Add a single macro that chains both spell and removal logic.

***

### Example Chat Output
```
Goblin 3 is confused 😵‍💫
🚫🗡️ no action
🏃 uses all movement ⇙ southwest.

Wisdom Save at end of round:
13 vs. Spell Save DC 15
Failure, still confused.

✅ Goblin 3 is no longer confused.
```

***

### License
MIT license

***

Would you like the two macro scripts summarized together under one “Usage Example” section with combined sample commands?
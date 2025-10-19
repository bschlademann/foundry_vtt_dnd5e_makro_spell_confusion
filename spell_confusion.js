/**
 * Name of the spellcaster used to determine spell save DC
 * @constant {string}
 */
const pcName = "CASTER_NAME_HERE";

/**
 * Reference to the spellcaster's actor
 * @constant {Actor}
 */
const pcActor = game.actors.getName(pcName);
if (!pcActor) return ui.notifications.warn("Enter a valid PC name at the top of the macro!");

// Get selected tokens
const tokens = canvas.tokens.controlled;
if (!tokens.length) return ui.notifications.warn("Select at least one token.");

/**
 * Simulates rolling a die with given number of sides
 * @param {number} sides - Number of sides on the die
 * @returns {number} Random number between 1 and sides
 */
const rollDie = (sides) => Math.floor(Math.random() * sides) + 1;

// Get spellcaster's spell save DC
const pcSpellSaveDc = pcActor.system.attributes.spell.dc;

/**
 * Determines random movement direction for confused creatures
 * @returns {string} Direction with arrow emoji
 */
const getMovementDirection = () => {
  switch (rollDie(6)) {
    case 1: return "⇗ northeast";
    case 2: return "⇒ east";
    case 3: return "⇘ southeast";
    case 4: return "⇙ southwest";
    case 5: return "⇐ west";
    case 6: return "⇖ northwest";
    default: return "in a random direction";
  }
};

/**
 * Handles confusion behavior and saving throws for a token
 * @param {string} pcName - Name of the spellcaster
 * @param {Token} token - The confused token
 * @param {number} [forcedResult=0] - Optional forced behavior roll (1-10)
 */
const confusion = (pcName, token, forcedResult = 0) => {
  let behaviour = `🚫✚ no bonus action <br>🚫⚡ no reaction<br>`;
  const behaviourDie = forcedResult === 0 ? rollDie(10) : forcedResult;
  
  // Determine behavior based on d10 roll
  if (behaviourDie === 1)
    behaviour += `🚫🗡️ no action<br>🏃 use all movement: ${getMovementDirection()}.`;
  else if (behaviourDie >= 2 && behaviourDie <= 6)
    behaviour += `🚫🗡️ no action<br>🚫🏃 no movement`;
  else if (behaviourDie >= 7 && behaviourDie <= 8)
    behaviour += `🚫🏃 no movement<br>🗡️ one melee attack vs random creature<br><i>No creature in range?</i> ↷ 🚫🗡️ <i>no action</i>`;
  else
    behaviour += "👍 The target chooses its behavior.";

  // Handle Wisdom saving throw
  const wisdomSaveMod = token.actor.system.abilities.wis.save.value;
  const wisdomSaveRoll = rollDie(20) + wisdomSaveMod;
  const wisdomSaveSuccess = wisdomSaveRoll >= pcSpellSaveDc;

  let wisdomSaveResult = wisdomSaveSuccess
    ? `<span style="color: green; font-weight: bold;">Success, no longer confused</span>`
    : `<span style="color: red; font-weight: bold;">Failure, still confused</span>`;

  // Create chat message with results
  const content = `
  <p><strong>${token.name}</strong> is confused 😵‍💫</p>
  ${behaviour}<br>
  <p><strong>Wisdom Save at end of round:</strong><br>
  ${wisdomSaveRoll} vs. Spell Save DC ${pcSpellSaveDc}<br>
  (${wisdomSaveResult})<br></p>`;

  ChatMessage.create({ content });

  // Remove confusion effect on successful save
  if (wisdomSaveSuccess) {
    const effects = token.actor.effects.filter((e) => e.name === "Confused");
    for (let e of effects) e.delete();
  }
};

/**
 * Toggles the Confused status effect on a token
 * @param {Token} token - Target token
 * @param {boolean} isConfused - Whether to add or remove the effect
 */
const toggleConfusionEffect = async (token, isConfused) => {
  const icon = "icons/svg/daze.svg";
  const hasEffect = token.actor.effects.some((e) => e.icon === icon);

  if (isConfused && !hasEffect) {
    const effect = {
      name: "Confused",
      label: "Confused",
      icon,
      origin: `Token.${token.id}`,
      disabled: false,
      duration: { rounds: 10 },
      flags: { core: { statusId: "stunned" } },
    };
    await token.actor.createEmbeddedDocuments("ActiveEffect", [effect]);
  } else if (!isConfused && hasEffect) {
    const effects = token.actor.effects.filter((e) => e.icon === icon);
    for (let e of effects) await e.delete();
  }
};

// Main execution loop
for (let token of tokens) {
  const hasConfused = token.actor.effects.some((e) => e.name === "Confused");
  const wisdomSaveMod = token.actor.system.abilities.wis.save.value;
  const roll = rollDie(20) + wisdomSaveMod;

  // Handle initial saves for non-confused tokens
  if (!hasConfused) {
    if (roll >= pcSpellSaveDc) {
      ChatMessage.create({ 
        content: `<p><b>${token.name}</b> resisted the confusion.</p>
        <p><strong>Wisdom Save:</strong><br>
        ${roll} vs. Spell Save DC ${pcSpellSaveDc}</p>` 
      });
    } else {
      ChatMessage.create({ 
        content: `<p><b>${token.name}</b> is confused 😵‍💫</p>
        <p><strong>Wisdom Save:</strong><br>
        ${roll} vs. Spell Save DC ${pcSpellSaveDc}</p>` 
      });
      await toggleConfusionEffect(token, true);
    }
  } else if (tokens.length === 1) {
    // Process single confused token
    confusion(pcName, token);
  }
}
const pcName = "Nix";
const pcActor = game.actors.getName(pcName);
if (!pcActor) return ui.notifications.warn("Enter a valid PC name at the top of the macro!");

const tokens = canvas.tokens.controlled;
if (!tokens.length) return ui.notifications.warn("Select at least one token.");

const rollDie = (sides) => Math.floor(Math.random() * sides) + 1;

const pcSpellSaveDc = pcActor.system.attributes.spell.dc;

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

const confusion = (token, forcedResult = 0) => {
  let behaviour = `<i>Effects this turn:</i><br> 🚫✚ no bonus action <br>🚫⚡ no reaction<br>`;
  const behaviourDie = forcedResult === 0 ? rollDie(10) : forcedResult;
  if (behaviourDie === 1)
    behaviour += `🚫🗡️ no action<br>🏃 use all movement: ${getMovementDirection()}.`;
  else if (behaviourDie >= 2 && behaviourDie <= 6)
    behaviour += `🚫🗡️ no action<br>🚫🏃 no movement`;
  else if (behaviourDie >= 7 && behaviourDie <= 8)
    behaviour += `🚫🏃 no movement<br>🗡️ one melee attack vs random creature<br><i>No creature in range?</i> ↷ 🚫🗡️ <i>no action</i>`;
  else
    behaviour += "👍 The target chooses its behavior.";

  const wisdomSaveMod = token.actor.system.abilities.wis.save.value;
  const wisdomSaveRoll = rollDie(20) + wisdomSaveMod;
  const wisdomSaveSuccess = wisdomSaveRoll >= pcSpellSaveDc;

  let wisdomSaveResult = wisdomSaveSuccess
    ? `<span style="color: green; font-weight: bold;">Success, no longer confused</span>`
    : `<span style="color: red; font-weight: bold;">Failure, still confused</span>`;

  const content = `
  <p><strong>${token.name}</strong> is confused 😵‍💫</p>
  ${behaviour}<br>
  <p><strong>Wisdom Save at end of round:</strong><br>
  ${wisdomSaveRoll} vs. Spell Save DC ${pcSpellSaveDc}<br>
  (${wisdomSaveResult})<br></p>`;

  ChatMessage.create({ content });

  if (wisdomSaveSuccess) {
    const effects = token.actor.effects.filter((e) => e.name === "Confused");
    for (let e of effects) e.delete();
  }
};

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

for (let token of tokens) {
  const hasConfused = token.actor.effects.some((e) => e.name === "Confused");
  const wisdomSaveMod = token.actor.system.abilities.wis.save.value;
  const roll = rollDie(20) + wisdomSaveMod;

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
    // One confused token selected -> resolution logic
    confusion(pcName, token);
  }
}
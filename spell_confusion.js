const pcName = "CASTER_NAME_HERE"; // Set the PC (caster) name
const pcActor = game.actors.getName(pcName);
if (!pcActor) return ui.notifications.warn("Enter a valid PC name at the top of the macro!");

const tokens = canvas.tokens.controlled;
if (!tokens.length) return ui.notifications.warn("Select at least one token.");

const rollDie = sides => Math.floor(Math.random() * sides) + 1;
const pcSpellSaveDc = pcActor.system.attributes.spell.dc;
const confusionIcon = "icons/svg/daze.svg";

const sendChatMessage = (content) => ChatMessage.create({ content });

const getMovementDirection = () => {
  const dirs = ["⇗ northeast", "⇒ east", "⇘ southeast", "⇙ southwest", "⇐ west", "⇖ northwest"];
  return dirs[rollDie(6) - 1];
};

const getConfusionBehavior = (result = rollDie(10)) => {
  let behavior = `<i>Effects this turn:</i><br> 🚫✚ no bonus action <br>🚫⚡ no reaction<br>`;

  if (result === 1)
    behavior += `🚫🗡️ no action<br>🏃 use all movement: ${getMovementDirection()}.`;
  else if (result <= 6)
    behavior += `🚫🗡️ no action<br>🚫🏃 no movement`;
  else if (result <= 8)
    behavior += `🚫🏃 no movement<br>🗡️ one melee attack vs random creature<br><i>No creature in range?</i> ↷ 🚫🗡️ <i>no action</i>`;
  else
    behavior += "👍 The target chooses its behavior.";

  return behavior;
};

const handleWisdomSave = (token) => {
  const mod = token.actor.system.abilities.wis.save.value;
  const roll = rollDie(20) + mod;
  const success = roll >= pcSpellSaveDc;
  return { roll, success };
};

const toggleConfusedEffect = async (token, enable) => {
  const hasEffect = token.actor.effects.some(e => e.icon === confusionIcon);
  if (enable && !hasEffect) {
    const effect = {
      name: "Confused",
      label: "Confused",
      icon: confusionIcon,
      origin: `Token.${token.id}`,
      disabled: false,
      duration: { rounds: 10 },
      flags: { core: { statusId: "stunned" } },
    };
    await token.actor.createEmbeddedDocuments("ActiveEffect", [effect]);
  } else if (!enable && hasEffect) {
    const toRemove = token.actor.effects.filter(e => e.icon === confusionIcon);
    for (let e of toRemove) await e.delete();
  }
};

const applyConfusionTurn = async (pcName, token) => {
  const { roll, success } = handleWisdomSave(token);
  const behavior = getConfusionBehavior();

  const saveResult = success
    ? `<span style="color: green; font-weight: bold;">Success, no longer confused</span>`
    : `<span style="color: red; font-weight: bold;">Failure, still confused</span>`;

  const content = `
    <p><strong>${token.name}</strong> is confused 😵‍💫</p>
    ${behavior}<br>
    <p><strong>Wisdom Save at end of round:</strong><br>
    ${roll} vs. Spell Save DC ${pcSpellSaveDc}<br>
    (${saveResult})<br></p>
  `;
  sendChatMessage(content);

  if (success) await toggleConfusedEffect(token, false);
};

for (let token of tokens) {
  const isConfused = token.actor.effects.some(e => e.name === "Confused");
  const { roll, success } = handleWisdomSave(token);

  if (!isConfused) {
    const content = success
      ? `<p><b>${token.name}</b> resisted the confusion.</p><p><strong>Wisdom Save:</strong><br>${roll} vs. Spell Save DC ${pcSpellSaveDc}</p>`
      : `<p><b>${token.name}</b> is confused 😵‍💫</p><p><strong>Wisdom Save:</strong><br>${roll} vs. Spell Save DC ${pcSpellSaveDc}</p>`;
    sendChatMessage(content);
    if (!success) await toggleConfusedEffect(token, true);
  } else if (tokens.length === 1) {
    await applyConfusionTurn(pcName, token);
  }
}
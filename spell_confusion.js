const pcName = "PC_NAME_HERE";

if (pcName === "" || !game.actors.getName(pcName))
  return ui.notifications.warn(
    "Enter a valid PC name at the top of the makro!"
  );

let token = canvas.tokens.controlled[0];
if (!token)
  return ui.notifications.warn(
    "You must select a token to roll the saving throw for."
  );

const rollDie = (sides) => {
  return Math.floor(Math.random() * sides) + 1;
};

const getSavingThrowContent = (pcName, token) => {
  const pcActor = game.actors.getName(pcName);

  const pcSpellSaveDc = pcActor.system.attributes.spell.dc;

  const wisdomSaveMod = token.actor.system.abilities.wis.save.value;
  let wisdomSaveRoll = rollDie(20) + wisdomSaveMod;
  let wisdomSaveSuccess = wisdomSaveRoll >= pcSpellSaveDc;

  return {
    tokenName: token.name,
    pcSpellSaveDc,
    wisdomSaveRoll,
    wisdomSaveSuccess,
  };
};

const getMovementDirection = () => {
  const directionRoll = rollDie(6);
  switch (directionRoll) {
    case 1:
      return "⇗ northeast";
    case 2:
      return "⇒ east";
    case 3:
      return "⇘ southeast";
    case 4:
      return "⇙ southwest";
    case 5:
      return "⇐ west";
    case 6:
      return "⇖ northwest";

    default:
      return "in a random direction";
  }
};

const confusion = (pcName, forcedResult = 0) => {
  let behaviour = `🚫✚ no bonus action <br>🚫⚡ no reaction<br>`;
  const behaviourDie = forcedResult === 0 ? rollDie(10) : forcedResult;
  if (behaviourDie === 1) {
    behaviour += `🚫🗡️ no action
    <br>🏃 use all movement: ${getMovementDirection()}.`;
  } else if (behaviourDie >= 2 && behaviourDie <= 6)
    behaviour += `🚫🗡️ no action
    <br>🚫🏃 no movement`;
  else if (behaviourDie >= 7 && behaviourDie <= 8)
    behaviour += `🚫🏃 no movement
    <br>🗡️ one melee attack vs random creature
    <br><i>No creature in range?</i> ↷ 🚫🗡️ <i>no action</i>`;
  else behaviour += "👍 The target chooses its behavior.";

  const savingthrowResult = getSavingThrowContent(pcName, token);
  const { tokenName, pcSpellSaveDc, wisdomSaveRoll, wisdomSaveSuccess } =
    savingthrowResult;

  let wisdomSaveResult = wisdomSaveSuccess
    ? `<span style="color: green; font-weight: bold;">Success, no longer confused</span>`
    : `<span style="color: red; font-weight: bold;">Failure, still confused</span>`;

  const content = `
<p><strong>"${tokenName}" </strong> is confused 😵‍💫</p>
${behaviour}<br>
<p><strong>Wisdom Save at end of round:<br>
</strong> ${wisdomSaveRoll} vs. Spell Save DC ${pcSpellSaveDc}<br>
(${wisdomSaveResult})<br> 
</p>
`;

  ChatMessage.create({
    content: content,
  });
};
confusion(pcName, token);

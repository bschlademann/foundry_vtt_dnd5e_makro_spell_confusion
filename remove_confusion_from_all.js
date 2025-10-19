const confusionIcon = "icons/svg/daze.svg";
const tokens = canvas.tokens.controlled;

if (!tokens.length) return ui.notifications.warn("Select at least one token.");

for (let token of tokens) {
  const confusedEffects = token.actor.effects.filter(e => 
    e.name === "Confused" || e.icon === confusionIcon
  );
  if (confusedEffects.length === 0) continue;

  for (let effect of confusedEffects) {
    await effect.delete();
  }

  ChatMessage.create({
    content: `<p>✅ <strong>${token.name}</strong> is no longer confused.</p>`
  });
}
ui.notifications.info("Removed 'Confused' status from all selected tokens.");

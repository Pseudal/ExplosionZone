export function ModConfig(config) {
  if (ModConfigMenu !== undefined) {
    ModConfigMenu.RemoveCategory("BoomZone!");

    ModConfigMenu.AddSpace("BoomZone", "About");
    ModConfigMenu.AddText("BoomZone","About",() => "BoomZone",);
    ModConfigMenu.AddSpace("BoomZone", "About");
    ModConfigMenu.AddText("BoomZone", "About", () => `Version 0.8`);

    ModConfigMenu.AddSpace("BoomZone", "About");
    ModConfigMenu.AddText("BoomZone", "About", () => "Mod made by Tidloas with love");
    ModConfigMenu.AddSpace("BoomZone", "About");

    ModConfigMenu.AddSetting("BoomZone", `Main`, {
      Type: ModConfigMenuOptionType.BOOLEAN,
      CurrentSetting() {
        return config.AllowFoetus;
      },
      Display() {
        let onOff = "Disabled";
        if (config.AllowFoetus == true) {
          onOff = "Enabled";
        }
        return `Dr Foetus: ${onOff}`;
      },
      OnChange(IsOn) {
        config.AllowFoetus = IsOn as boolean;
      },
      Info: [`Dr Foetus have a danger zone ?`],
    });

    function addItem(entity, type, name, desc) {
      ModConfigMenu.AddSetting("BoomZone", `${type}`, {
        Type: ModConfigMenuOptionType.BOOLEAN,
        CurrentSetting() {
          return config[entity];
        },
        Display() {
          let onOff = "Disabled";
          if (config[entity] == true) {
            onOff = "Enabled";
          }
          return `${name}: ${onOff}`;
        },
        OnChange(IsOn) {
          config[entity] = IsOn as boolean;
        },
        Info: [`${desc}`],
      });
    }
    addItem("Hitbox", "Main", "Real Hitbox", "Shows the real hitbox of some lasers, mainly the holy laser of uriel and gabriel..");

    ModConfigMenu.AddSpace("BoomZone", "ChangeLog");
    ModConfigMenu.AddText("BoomZone", "ChangeLog", () => "+Fix some bugs");
    ModConfigMenu.AddText("BoomZone", "ChangeLog", () => "+Fix for tracing on pets or other.");
    ModConfigMenu.AddText("BoomZone", "ChangeLog", () => "+Delirium v1(Disabled by default)");
  }
}

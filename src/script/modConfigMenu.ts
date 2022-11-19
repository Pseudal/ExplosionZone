export function ModConfig(config) {
  if (ModConfigMenu !== undefined) {
    ModConfigMenu.RemoveCategory("Watch out, boom!");

    ModConfigMenu.AddSpace("Watch out, boom!", "About");
    ModConfigMenu.AddText("Watch out, boom!","About",() => "Watch out, boom!",);
    ModConfigMenu.AddSpace("Watch out, boom!", "About");
    ModConfigMenu.AddText("Watch out, boom!", "About", () => `Version 0.5`);

    ModConfigMenu.AddSpace("Watch out, boom!", "About");
    ModConfigMenu.AddText("Watch out, boom!", "About", () => "Mod made by Tidloas with love");
    ModConfigMenu.AddSpace("Watch out, boom!", "About");

    ModConfigMenu.AddSetting("Watch out, boom!", `Mains`, {
      Type: ModConfigMenuOptionType.BOOLEAN,
      CurrentSetting() {
        return config.Pulse;
      },
      Display() {
        let onOff = "Disabled";
        if (config.Pulse == true) {
          onOff = "Enabled";
        }
        return `Pulse effect: ${onOff}`;
      },
      OnChange(IsOn) {
        config.Pulse = IsOn as boolean;
      },
      Info: [`Danger zone has pulse effect ?`],
    });

    ModConfigMenu.AddSetting("Watch out, boom!", `Mains`, {
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
      ModConfigMenu.AddSetting("Watch out, boom!", `${type}`, {
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
    addItem("Bomb", "Mains", "Bomb", "Displays the area for 'classic' bombs");
    addItem("Troll", "Mains", "Troll", "Displays the area for 'troll' bombs");
    addItem("Megabomb", "Mains", "Mega bomb", "Displays the area for 'mega' bombs");
    addItem("TNT", "Mains", "TNT", "Displays the area for 'tnt'");
    addItem("Mouche", "Mains", "Boom Fly", "Displays the area for Boom Fly");
    addItem("Mulliboom", "Mains", "Mulliboom", "Displays the area for Mulliboom");
    addItem("PoisonMind", "Mains", "PoisonMind", "Displays the area for PoisonMind");
    addItem("Leech", "Mains", "Leech", "Displays the area for Leech");
    addItem("Spider", "Mains", "Spider bomb", "Displays the area for Spider bomb");
    addItem("Maw", "Mains", "Black Maw", "Displays the area for Black Maw");
    addItem("BlackBony", "Mains", "Black Bony", "Displays the area for Black Bony");
    addItem("Poofer", "Mains", "Poofer", "Displays the area for Poofer");
    addItem("PootMine", "Mains", "Poot Mine", "Displays the area for Poot Mine");
    addItem("GreedCoin", "Mains", "Greed Coin", "Displays the area for Greed Bomb Coin");

    ModConfigMenu.AddSpace("Watch out, boom!", "ChangeLog");
    ModConfigMenu.AddText("Watch out, boom!", "ChangeLog", () => "Hello World");
  }
}

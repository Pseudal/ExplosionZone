export function ModConfig(configWOExplosion) {
  if (ModConfigMenu !== undefined) {
    ModConfigMenu.RemoveCategory("Watch out, explosion!");

    ModConfigMenu.AddSpace("Watch out, explosion!", "About");
    ModConfigMenu.AddText("Watch out, explosion!","About",() => "Watch out, explosion!",);
    ModConfigMenu.AddSpace("Watch out, explosion!", "About");
    ModConfigMenu.AddText("Watch out, explosion!", "About", () => `Version 0.8.1`);

    ModConfigMenu.AddSpace("Watch out, explosion!", "About");
    ModConfigMenu.AddText("Watch out, explosion!", "About", () => "Mod made by Tidloas with love");
    ModConfigMenu.AddSpace("Watch out, explosion!", "About");

    ModConfigMenu.AddSetting("Watch out, explosion!", `Mains`, {
      CurrentSetting: (): number => configWOExplosion.Effect,
      Maximum: 3,
      Minimum: 1,
      Display() {
        let onOff = "Full";
        if (configWOExplosion.Effect == 2) {
          onOff = "Pulse";
        }
        if (configWOExplosion.Effect == 3) {
          onOff = "Transparent";
        }
        return `Effect: ${onOff}`;
      },
      Info: [],
      OnChange: (currentValue: number | boolean | undefined): void => {
        configWOExplosion.Effect = currentValue as number;
      },
      Type: ModConfigMenuOptionType.NUMBER,
    });

    ModConfigMenu.AddSetting("Watch out, explosion!", `Mains`, {
      CurrentSetting: (): number => configWOExplosion.Opacity,
      Maximum: 10,
      Minimum: 0,
      Display() {
        let onOff = configWOExplosion.Opacity;
        return `Opacity: ${onOff*10}%`;
      },
      Info: [],
      OnChange: (currentValue: number | boolean | undefined): void => {
        configWOExplosion.Opacity = currentValue as number;
      },
      Type: ModConfigMenuOptionType.NUMBER,
    });

    ModConfigMenu.AddSetting("Watch out, explosion!", `Mains`, {
      Type: ModConfigMenuOptionType.BOOLEAN,
      CurrentSetting() {
        return configWOExplosion.AllowFoetus;
      },
      Display() {
        let onOff = "Disabled";
        if (configWOExplosion.AllowFoetus == true) {
          onOff = "Enabled";
        }
        return `Dr Foetus: ${onOff}`;
      },
      OnChange(IsOn) {
        configWOExplosion.AllowFoetus = IsOn as boolean;
      },
      Info: [`Dr Foetus have a danger zone ?`],
    });

    function addItem(entity, type, name, desc) {
      ModConfigMenu.AddSetting("Watch out, explosion!", `${type}`, {
        Type: ModConfigMenuOptionType.BOOLEAN,
        CurrentSetting() {
          return configWOExplosion[entity];
        },
        Display() {
          let onOff = "Disabled";
          if (configWOExplosion[entity] == true) {
            onOff = "Enabled";
          }
          return `${name}: ${onOff}`;
        },
        OnChange(IsOn) {
          configWOExplosion[entity] = IsOn as boolean;
        },
        Info: [`${desc}`],
      });
    }
    addItem("Ipecac", "Mains", "Ipecac", "Show Ipecac zone");
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

    ModConfigMenu.AddSpace("Watch out, explosion!", "ChangeLog");
    ModConfigMenu.AddText("Watch out, explosion!", "ChangeLog", () => "+some small fix");
  }
}

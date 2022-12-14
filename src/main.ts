import {
EntityFlag,
ModCallback,
ProjectileFlag,
TearFlag
} from "isaac-typescript-definitions";
import {
bitFlags,printConsole
} from "isaacscript-common";
import * as json from "json";
import { configWOExplosion } from "./script/Config";
import { ModConfig } from "./script/modConfigMenu";

interface DangerExplosionData {
  DangerExplosion: int | undefined;
  ExplosionZoneLink: Entity | undefined;
  Grid: GridEntity | undefined;
  Danger: int | undefined;
  exploded: int | undefined;
}

let ActiveEnemy = [] as Entity[];
let ActiveGrid = [];
let ActiveZone = [] as Entity[];
let ActiveProjectile = [] as Entity[];
let hasNoDmg = false;
let hasIpecac = false;

main();

function SpawnZoneExplosion(ent: Entity, EntSprite, data, scale, scale2, Ypos) {
  let idEffect = 0;
  switch (configWOExplosion.Effect) {
    case 1:
      idEffect = 8748;
      break;
    case 2:
      idEffect = 8746;
      break;
    case 3:
      idEffect = 8747;
      break;
  }
  // printConsole(`${ent.Variant}`);
  if (ent.Type == 4){
    if (ent.ToBomb().IsFetus == true && Isaac.GetPlayer().HasCollectible(330)) {
      scale -= 0.4;
      scale2 -= 0.4;
    }
  }
  if (ent.Type == 4){
  if (ent.SpawnerEntity?.Type == 1 && Isaac.GetPlayer().HasCollectible(106)) {
    scale += 0.27;
    scale2 += 0.27;
  }
}

  let anima = undefined;
  let BboyPos = [
    [0, 0],
    [0, -100],
    [0, 100],
    [-100, 0],
    [100, 0],
    [0, -50],
    [0, 50],
    [-50, 0],
    [50, 0],
  ];
  if (ent.Type == 4 && ent.SpawnerEntity?.Type == 1 && Isaac.GetPlayer().HasCollectible(353)) {
    for (let index = 0; index < 9; index++) {
      let scaleX = 0.65;
      let scaleY = 0.65;
      if (
        ent.SpawnerEntity?.Type == 1 &&
        Isaac.GetPlayer().HasCollectible(106)
      ) {
        scaleX += 0.15;
        scaleY += 0.15;
      }
      if (
        ent.ToBomb().IsFetus == true &&
        Isaac.GetPlayer().HasCollectible(330)
      ) {
        scaleX -= 0.4;
        scaleY -= 0.4;
        BboyPos = [
          [0, 0],
          [0, -25],
          [0, 25],
          [-25, 0],
          [25, 0],
          [0, -50],
          [0, 50],
          [-50, 0],
          [50, 0],
        ];
      }
      anima = Isaac.Spawn(
        1000,
        idEffect,
        0,
        Vector(
          ent.Position.X + BboyPos[index][0],
          ent.Position.Y + BboyPos[index][1],
        ),
        Vector(0, 0),
        undefined,
      );
      anima.SpriteScale = Vector(scaleX, scaleY);
      anima.Color = Color(1, 1, 1, configWOExplosion.Opacity * 0.1);
      //anim.ToNPC().CanShutDoors = false
      anima.RenderZOffset = -69999;
      anima.ToEffect().FollowParent(ent); //*make the animation follow the trigger entity
      anima.Parent = ent; //* make the animation parent the trigger entity, for the suppression
      ActiveZone.push(anima); //* activeZone used to retrieve the animation later
      data.ExplosionZoneLink = anima;
    }
  } else {
    anima = Isaac.Spawn(
      1000,
      idEffect,
      0,
      Vector(ent.Position.X, ent.Position.Y - Ypos),
      Vector(0, 0),
      undefined,
    );

    anima.SpriteScale = Vector(scale, scale2);
    anima.Color = Color(1, 1, 1, configWOExplosion.Opacity * 0.1);
    //anim.ToNPC().CanShutDoors = false
    anima.RenderZOffset = -69999;
    anima.ToEffect().FollowParent(ent); //*make the animation follow the trigger entity
    anima.Parent = ent; //* make the animation parent the trigger entity, for the suppression
    ActiveZone.push(anima); //* activeZone used to retrieve the animation later
    data.ExplosionZoneLink = anima;
  }
}

//*Detect tnt (grid)
function TntDetection() {
  if (hasIpecac !== false && configWOExplosion.Ipecac == true) {
    //For room change
    let player = Isaac.GetPlayer();
    let data = player.GetData() as unknown as DangerExplosionData;
    if (data.Danger !== 0) {
      data.Danger = 0;
    }
  }

  if (configWOExplosion.TNT == true) {
    let room = Game().GetRoom();
    let num = room.GetGridSize();
    let enemy = [];
    if (num == 0) {
    } else {
      for (let index = 0; index < num; index++) {
        const element = room.GetGridEntity(index);
        if (element !== undefined) {
          if (element.Desc.Type == 12 && element.State !== 4) {
            let anima = undefined;
            if (configWOExplosion.Effect == 2) {
              anima = Isaac.Spawn(
                1000,
                8746,
                0,
                Vector(element.Position.X, element.Position.Y),
                Vector(0, 0),
                undefined,
              );
            } //* spawn the animation
            else if (configWOExplosion.Effect == 3) {
              anima = Isaac.Spawn(
                1000,
                8747,
                0,
                Vector(element.Position.X, element.Position.Y),
                Vector(0, 0),
                undefined,
              );
            } else {
              anima = Isaac.Spawn(
                1000,
                8748,
                0,
                Vector(element.Position.X, element.Position.Y),
                Vector(0, 0),
                undefined,
              );
            }
            let data2 = anima.GetData() as DangerExplosionData;
            anima.Color = Color(1, 1, 1, configWOExplosion.Opacity * 0.1);
            anima.SpriteScale = Vector(1, 1);
            anima.RenderZOffset = -0;
            //enemy.push(element);
            data2.Grid = element;
            enemy.push(anima);
          }
        }
      }
    }
    ActiveGrid = enemy;
  }
}

//*Detect monsters & bomb in the room, first filtering
function mobDetection() {
  let entities = Isaac.GetRoomEntities();

  let enemy = [] as Entity[];
  if (entities.length === 0) {
  } else {
    entities.forEach((ent) => {
      if (ent.Type == 4 || ent.Type == 292 || ent.IsEnemy()) {
        enemy.push(ent);
      }
    });
  }
  ActiveEnemy = enemy;
  if (ActiveZone.length > 0) {
    for (let index = 0; index < ActiveZone.length; index++) {
      const element = ActiveZone[index];
      if (element.Parent == undefined) {
        element.Remove();
      }
    }
  }
}

//*Condition list for spawn
function spawnCondition() {
  ActiveEnemy.forEach((ent) => {
    if (ent.Parent?.Type == 906) {
      //fix hornfel bizarre visual bug
      if (ent.HasEntityFlags(bitFlags(EntityFlag.FREEZE))) {
        return;
      }
    }

    let data = ent.GetData() as unknown as DangerExplosionData;
    let EntSprite = ent.GetSprite();
    //debugComing(ent, EntSprite, data);

    if (hasNoDmg == false) {
      if (ent.Type == 4) {
        if (
          ent.ToBomb().IsFetus == true &&
          configWOExplosion.AllowFoetus == false
        ) {
          return;
        }

        if (
          ent.Type == 4 &&
          data.DangerExplosion !== 1 &&
          configWOExplosion.Bomb == true
        ) {
          if (
            ent.Variant == 0 ||
            ent.Variant == 1 ||
            ent.Variant == 2 ||
            ent.Variant == 5 ||
            ent.Variant == 6 ||
            ent.Variant == 7 ||
            ent.Variant == 8 ||
            ent.Variant == 9 ||
            ent.Variant == 10 ||
            ent.Variant == 11 ||
            ent.Variant == 12 ||
            ent.Variant == 13 ||
            ent.Variant == 14 ||
            ent.Variant == 16 ||
            ent.Variant == 19
          ) {
            data.DangerExplosion = 1;
            SpawnZoneExplosion(ent, EntSprite, data, 1, 1, 0);
          }
        }

        if (
          ent.Type == 4 &&
          data.DangerExplosion !== 1 &&
          configWOExplosion.Troll == true
        ) {
          //Troll
          if (ent.Variant == 3 || ent.Variant == 4 || ent.Variant == 18) {
            data.DangerExplosion = 1;
            SpawnZoneExplosion(ent, EntSprite, data, 1, 1, 0);
          }
        }
        if (
          ent.Type == 4 &&
          data.DangerExplosion !== 1 &&
          (ent.Variant == 17 || ent.Variant == 20) &&
          configWOExplosion.Megabomb == true &&
          configWOExplosion.Bomb == true
        ) {
          data.DangerExplosion = 1;
          SpawnZoneExplosion(ent, EntSprite, data, 1.5, 1.5, 0);
        }
      }
      if (
        ent.Type == 16 &&
        ent.Variant == 2 &&
        data.DangerExplosion !== 1 &&
        configWOExplosion.Mulliboom == true
      ) {
        data.DangerExplosion = 1;
        SpawnZoneExplosion(ent, EntSprite, data, 1, 1, 0);
      }

      if (
        ent.Type == 25 &&
        (ent.Variant == 2 || ent.Variant == 0 || ent.Variant == 5) &&
        data.DangerExplosion !== 1 &&
        configWOExplosion.Mouche == true
      ) {
        data.DangerExplosion = 1;
        SpawnZoneExplosion(ent, EntSprite, data, 1, 1, 0);
      }

      if (
        ent.Type == 301 &&
        ent.Variant == 0 &&
        data.DangerExplosion !== 1 &&
        configWOExplosion.Bomb == true &&
        configWOExplosion.PoisonMind == true
      ) {
        data.DangerExplosion = 1;
        SpawnZoneExplosion(ent, EntSprite, data, 1, 1, 0);
      }
      if (
        ent.Type == 55 &&
        ent.Variant !== 0 &&
        data.DangerExplosion !== 1 &&
        configWOExplosion.Leech == true
      ) {
        data.DangerExplosion = 1;
        SpawnZoneExplosion(ent, EntSprite, data, 0.9, 0.9, 0);
      }
      if (
        ent.Type == 250 &&
        ent.Variant == 0 &&
        data.DangerExplosion !== 1 &&
        configWOExplosion.Spider == true
      ) {
        data.DangerExplosion = 1;
        SpawnZoneExplosion(ent, EntSprite, data, 1, 1, 0);
      }
      if (
        ent.Type == 225 &&
        ent.Variant == 0 &&
        data.DangerExplosion !== 1 &&
        configWOExplosion.Maw == true
      ) {
        data.DangerExplosion = 1;
        SpawnZoneExplosion(ent, EntSprite, data, 1, 1, 0);
      }
      if (
        ent.Type == 277 &&
        ent.Variant == 0 &&
        data.DangerExplosion !== 1 &&
        configWOExplosion.BlackBony == true
      ) {
        data.DangerExplosion = 1;
        SpawnZoneExplosion(ent, EntSprite, data, 1, 1, 0);
      }
      if (
        ent.Type == 892 &&
        ent.Variant == 0 &&
        data.DangerExplosion !== 1 &&
        configWOExplosion.Poofer == true
      ) {
        data.DangerExplosion = 1;
        SpawnZoneExplosion(ent, EntSprite, data, 1, 1, 0);
      }
      if (
        ent.Type == 875 &&
        ent.Variant == 0 &&
        data.DangerExplosion !== 1 &&
        configWOExplosion.PootMine == true
      ) {
        data.DangerExplosion = 1;
        SpawnZoneExplosion(ent, EntSprite, data, 1, 1, 0);
      }
      if (
        ent.Type == 293 &&
        ent.Variant == 2 &&
        data.DangerExplosion !== 1 &&
        ent.GetSprite().IsPlaying("PulseBomb") &&
        configWOExplosion.GreedCoin == true
      ) {
        data.DangerExplosion = 1;
        SpawnZoneExplosion(ent, EntSprite, data, 1.6, 1.6, 0);
      }
      if (
        ent.Type == 292 &&
        data.DangerExplosion !== 1 &&
        ent.ToNPC().State == 3 &&
        ent.Variant !== 751 &&
        configWOExplosion.TNT == true
      ) {
        data.DangerExplosion = 1;
        SpawnZoneExplosion(ent, EntSprite, data, 1, 1, 0);
      }

      if (
        (ent.IsDead() ||
          ent.Exists() !== true ||
          (ent.Type == 292 && ent.ToNPC().State == 16) ||
          (ent.Type == 293 &&
            ent.Variant == 2 &&
            ent.GetSprite().IsFinished("PulseBomb"))) &&
        data.DangerExplosion == 1
      ) {
        data.ExplosionZoneLink.Remove();
        if (ent.Type == 293) data.DangerExplosion = -1;
        else data.DangerExplosion = 0;
      }
    }
  });
  //! security
}

function ipecacDetection(){
  if(Isaac.GetPlayer().HasCollectible(223)||Isaac.GetPlayer().HasCollectible(375)){
    hasNoDmg = true;
  }
  if (Isaac.GetPlayer().HasCollectible(149)) {
    hasIpecac = true;
  }
}
//*Main post update
function postUpdate() {
  mobDetection();
  spawnCondition();
  ProjectileCalculation();
  ipecacDetection();
  if (configWOExplosion.TNT == true) {
    for (let index = 0; index < ActiveGrid.length; index++) {
      //const elementGrid = ActiveGrid[index];
      const elementAnim = ActiveGrid[index];
      //      printConsole(`${ActiveGrid.length}`)
      let data = elementAnim.GetData() as DangerExplosionData;
      if (data.exploded !== 1) {
        if (data.Grid?.State == 4) {
          elementAnim.Remove();
          data.exploded = 1;
        }
      }
    }
  }

  //*Detects if Isaac gets Ipecac
  if (hasIpecac !== false && configWOExplosion.Ipecac == true) {
    let player = Isaac.GetPlayer();
    let data = player.GetData() as unknown as DangerExplosionData;
    if (data.Danger !== 1) {
      let anim = undefined;
      if (configWOExplosion.Effect == 2) {
        anim = Isaac.Spawn(
          1000,
          8749,
          0,
          Vector(player.Position.X, player.Position.Y),
          Vector(0, 0),
          undefined,
        ).ToEffect();
      } //* spawn the animation
      else if (configWOExplosion.Effect == 3) {
        anim = Isaac.Spawn(
          1000,
          8750,
          0,
          Vector(player.Position.X, player.Position.Y),
          Vector(0, 0),
          undefined,
        ).ToEffect();
      } else {
        anim = Isaac.Spawn(
          1000,
          8751,
          0,
          Vector(player.Position.X, player.Position.Y),
          Vector(0, 0),
          undefined,
        ).ToEffect();
      }
      anim.Color = Color(1, 1, 1, configWOExplosion.Opacity * 0.1);
      anim.Parent = player;
      anim.SpriteScale = Vector(0.7, 0.7);
      anim.FollowParent(player);
      data.Danger = 1;
    }
  }
}

//!PROJECTILE
function spawnProjectileDanger(Projectile) {
  let data = Projectile.GetData() as DangerExplosionData;
  let anim = undefined;
  if (configWOExplosion.Effect == 2) {
    anim = Isaac.Spawn(
      1000,
      8746,
      0,
      Vector(Projectile.Position.X, Projectile.Position.Y),
      Vector(0, 0),
      undefined,
    );
  } //* spawn the animation
  else if (configWOExplosion.Effect == 3) {
    anim = Isaac.Spawn(
      1000,
      8747,
      0,
      Vector(Projectile.Position.X, Projectile.Position.Y),
      Vector(0, 0),
      undefined,
    );
  } else {
    anim = Isaac.Spawn(
      1000,
      8748,
      0,
      Vector(Projectile.Position.X, Projectile.Position.Y),
      Vector(0, 0),
      undefined,
    );
  }
  //anim.ToEffect().FollowParent(Projectile)
  // anim.SetSize(-50, Vector(1,1), 0)
  anim.Color = Color(1, 1, 1, configWOExplosion.Opacity * 0.1);
  anim.SpriteScale = Vector(0.7, 0.7);
  anim.Parent = Projectile;
  ActiveProjectile.push(anim);
  data.Danger = 1;
}

//*Detect the new enemy projectile
function ProjectileDetect(Projectile: EntityProjectile) {
  if (configWOExplosion.Ipecac == true) {
    if (hasNoDmg == true) {
      return;
    }
    let data = Projectile.GetData() as unknown as DangerExplosionData;
    if (Projectile.HasProjectileFlags(bitFlags(ProjectileFlag.EXPLODE))) {
      if (data.Danger !== 1) {
        spawnProjectileDanger(Projectile);
        return;
      }
    }
  }
}

//*Detect the new isaac projectile
function TearDetect(Projectile: EntityTear) {
  if (configWOExplosion.Ipecac == true) {
    if (hasNoDmg == true) {
      return;
    }
    let data = Projectile.GetData() as unknown as DangerExplosionData;
    if (Projectile.HasTearFlags(bitFlags(TearFlag.EXPLOSIVE))) {
      if (data.Danger !== 1) {
        spawnProjectileDanger(Projectile);
        return;
      }
    }
  }
}

//*moves the area with the projectile
function ProjectileCalculation() {
  if (ActiveProjectile) {
    ActiveProjectile.forEach((p) => {
      if (!p?.Parent?.Exists()) {
        p.Remove();
        return;
      } else {
        // if(p.Parent.ToProjectile().Height>-20){
        //   p.SpriteScale = Vector(0.7, 0.7)
        // }else{
        //   p.SpriteScale = Vector(0.7/(p.Parent.ToProjectile().Height/23), 0.7/(p.Parent.ToProjectile().Height/23))
        // }
        p.Position = p.Parent.Position;
      }
    });
  }
}
//!END PROJECTILE
function gridCleaner() {
  if (ActiveGrid) {
    //printConsole(`trigger enemy`)
    ActiveGrid = [];
  }
}
function cleaner() {
  if (ActiveZone) {
    //printConsole(`trigger enemy`)
    ActiveZone = [] as Entity[];
  }
  if (ActiveProjectile) {
    //printConsole(`trigger enemy`)
    ActiveProjectile = [] as Entity[];
  }
}

function main() {
  const mod= RegisterMod("BoomZoneWarning", 1);
  // Instantiate a new mod object, which grants the ability to add callback functions that
  // correspond to in-game events.

  // //! MOD CONFIG MENU
  // //steal on another mod, idk how it's work
  function postGameStarted() {
    if (mod.HasData()) {
      const loadedFromSave = json.decode(Isaac.LoadModData(mod)) as Record<
        string,
        any
      >;

      for (const [k, v] of pairs(loadedFromSave)) {
        configWOExplosion[k] = v;
      }
    }
  }

  function preGameExit() {
    mod.SaveData(json.encode(configWOExplosion));
  }

  mod.AddCallback(ModCallback.PRE_GAME_EXIT, preGameExit);
  mod.AddCallback(ModCallback.POST_GAME_STARTED, postGameStarted);

  if (ModConfigMenu !== undefined) {
    ModConfig(configWOExplosion);
  }
  // //! END MOD CONFIG MENU

  mod.AddCallback(ModCallback.POST_PROJECTILE_RENDER, ProjectileDetect);
  mod.AddCallback(ModCallback.POST_TEAR_RENDER, TearDetect);
  mod.AddCallback(ModCallback.POST_UPDATE, postUpdate);
  mod.AddCallback(ModCallback.POST_NEW_ROOM, TntDetection);
  mod.AddCallback(ModCallback.POST_GAME_STARTED, () => {
    hasIpecac = false;
    hasNoDmg = false;
  });

  mod.AddCallback(ModCallback.POST_NEW_ROOM, cleaner);
  mod.AddCallback(ModCallback.PRE_GAME_EXIT, cleaner);
  mod.AddCallback(ModCallback.POST_NEW_LEVEL, gridCleaner);
  // mod.AddCallbackCustom(
  //   ModCallbackCustom.POST_ITEM_PICKUP,
  //   (player: EntityPlayer, pickingUpItem: PickingUpItem) => {
  //     if (pickingUpItem.subType == 223 || pickingUpItem.subType == 375) {
  //       hasNoDmg = true;
  //     }
  //     if (pickingUpItem.subType == 149) {
  //       hasIpecac = true;
  //     }
  //   },
  // );
}

// if(ent.ToNPC().IsChampion() == true){ //! useless, check if mod is explosive champion
//   if(ent.ToNPC().GetChampionColorIdx() == 5 && data.DangerExplosion !== 1 && configWOExplosion.Champion == true){
//     data.DangerExplosion = 1
//     SpawnZoneExplosion(ent, EntSprite, data, 1,1, 0)
//   }
// }

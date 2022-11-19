import { GridRoom, ModCallback } from "isaac-typescript-definitions";
import { ModCallbackCustom, PickingUpItem, upgradeMod } from "isaacscript-common";
import { config } from "./script/Config";
import { ModConfig } from "./script/modConfigMenu";
import { printConsole } from "isaacscript-common";
import * as json from "json";



interface DangerExplosionData {
  DangerExplosion: int | undefined;
  ExplosionZoneLink: Entity | undefined;
  Grid: int | undefined;
}

let ActiveEnemy = [] as Entity[];
let ActiveGrid = []
let ActiveZone = [] as Entity[];
let ActiveProjectile = [] as Entity[];
let hasNoDmg = false

main();

function SpawnZoneExplosion(ent, EntSprite, data, scale, Ypos) {
  let anima = Isaac.Spawn(
    1000,
    8746,
    0,
    Vector(ent.Position.X, ent.Position.Y-Ypos),
    Vector(0, 0),
    undefined,
  ); //* spawn the animation
  anima.SpriteScale = Vector(scale, scale);
  //anim.ToNPC().CanShutDoors = false
  anima.RenderZOffset = -6999;
  anima.ToEffect().FollowParent(ent); //*make the animation follow the trigger entity
  anima.Parent = ent; //* make the animation parent the trigger entity, for the suppression
  ActiveZone.push(anima); //* activeZone used to retrieve the animation later
  data.ExplosionZoneLink = anima;
}

function TntDetection() {
  let room = Game().GetRoom()
  let num = room.GetGridSize()
  let enemy = []
  if (num == 0) {
  } else {
    for (let index = 0; index < num; index++) {
      const element = room.GetGridEntity(index)
      if(element !== undefined){
        if(element.Desc.Type == 12 && element.State !== 4){
          let anima = Isaac.Spawn(
            1000,
            8746,
            0,
            Vector(element.Position.X, element.Position.Y-50),
            Vector(0, 0),
            undefined,
          ); //* spawn the animation
          anima.SpriteScale = Vector(0.95, 0.95);
          //anim.ToNPC().CanShutDoors = false
          anima.RenderZOffset = -9999;
          enemy.push(element);
          enemy.push(anima);
        }
      }
    }
  }
  ActiveGrid = enemy;
}

function mobDetection() {
  let entities = Isaac.GetRoomEntities();

  let enemy = [] as Entity[];
  if (entities.length === 0) {
  } else {
    entities.forEach((ent) => {
      if (
        (ent.Type == 4 || ent.Type ==292 || ent.IsEnemy())
      ) {
        enemy.push(ent);
      }
    });
  }
  ActiveEnemy = enemy;
}

function spawnCondition() {
  ActiveEnemy.forEach((ent) => {
    let data = ent.GetData() as unknown as DangerExplosionData;
    let EntSprite = ent.GetSprite();
    //debugComing(ent, EntSprite, data);

    if(hasNoDmg == false) {
      if(ent.Type == 4){
        if (ent.ToBomb().IsFetus == true && config.AllowFoetus == false) {
          return
        }

        if(ent.Type == 4 && data.DangerExplosion !== 1){
          if(ent.Variant == 0 || ent.Variant == 1|| ent.Variant == 2|| ent.Variant == 5|| ent.Variant == 6|| ent.Variant == 7|| ent.Variant == 8|| ent.Variant == 9|| ent.Variant == 10|| ent.Variant == 11|| ent.Variant == 12|| ent.Variant == 13|| ent.Variant == 14|| ent.Variant == 16|| ent.Variant == 19){
            data.DangerExplosion = 1
            SpawnZoneExplosion(ent, EntSprite, data, 0.95, 50)
          }
        }

        if(ent.Type == 4 && data.DangerExplosion !== 1){//Troll
          if(ent.Variant == 3 || ent.Variant == 4 || ent.Variant == 18){
            data.DangerExplosion = 1
            SpawnZoneExplosion(ent, EntSprite, data, 0.95, 50)
          }
        }
        if(ent.Type == 4 && data.DangerExplosion !== 1 && (ent.Variant == 17 || ent.Variant == 20) ){
          data.DangerExplosion = 1
          SpawnZoneExplosion(ent, EntSprite, data, 1.5, 80)
        }
      }
      if((ent.Type == 16 && ent.Variant ==2&& data.DangerExplosion !== 1)){
        data.DangerExplosion = 1
        SpawnZoneExplosion(ent, EntSprite, data, 0.95, 50)
      }

      if((ent.Type == 25 && (ent.Variant ==2||ent.Variant ==0||ent.Variant ==5)&& data.DangerExplosion !== 1)){
        data.DangerExplosion = 1
        SpawnZoneExplosion(ent, EntSprite, data, 0.95, 50)
      }

      if((ent.Type == 301 && (ent.Variant ==0)&& data.DangerExplosion !== 1)){
        data.DangerExplosion = 1
        SpawnZoneExplosion(ent, EntSprite, data, 0.95, 50)
      }
      if((ent.Type == 55 && (ent.Variant !==0)&& data.DangerExplosion !== 1)){
        data.DangerExplosion = 1
        SpawnZoneExplosion(ent, EntSprite, data, 0.95, 50)
      }
      if((ent.Type == 250 && (ent.Variant ==0)&& data.DangerExplosion !== 1)){
        data.DangerExplosion = 1
        SpawnZoneExplosion(ent, EntSprite, data, 0.95, 50)
      }
      if((ent.Type == 225 && (ent.Variant ==0)&& data.DangerExplosion !== 1)){
        data.DangerExplosion = 1
        SpawnZoneExplosion(ent, EntSprite, data, 0.95, 50)
      }
      if((ent.Type == 277 && (ent.Variant ==0)&& data.DangerExplosion !== 1)){
        data.DangerExplosion = 1
        SpawnZoneExplosion(ent, EntSprite, data, 0.95, 50)
      }
      if((ent.Type == 892 && (ent.Variant ==0)&& data.DangerExplosion !== 1)){
        data.DangerExplosion = 1
        SpawnZoneExplosion(ent, EntSprite, data, 0.95, 50)
      }
      if((ent.Type == 875 && (ent.Variant ==0)&& data.DangerExplosion !== 1)){
        data.DangerExplosion = 1
        SpawnZoneExplosion(ent, EntSprite, data, 0.95, 50)
      }
      if((ent.Type == 293 && (ent.Variant ==2)&& data.DangerExplosion !== 1)){
        data.DangerExplosion = 1
        SpawnZoneExplosion(ent, EntSprite, data, 0.95, 50)
      }
      if(ent.Type == 292 && data.DangerExplosion !== 1 && ent.ToNPC().State == 3 && ent.Variant !==751){
        data.DangerExplosion = 1
        SpawnZoneExplosion(ent, EntSprite, data, 0.95, 50)
      }

      if((ent.IsDead() || ent.Exists() !== true ||( ent.Type == 292 && ent.ToNPC().State == 16)) && data.DangerExplosion == 1){
        data.ExplosionZoneLink.Remove();
        data.DangerExplosion = 0;
      }
    }
  });
  //! security
}



function postUpdate() {
  mobDetection();
  spawnCondition();

  for (let index = 0; index < ActiveGrid.length-1; index++) {
    const elementGrid = ActiveGrid[index];
    const elementAnim = ActiveGrid[index+1];
      if(elementGrid.State == 4){
        elementAnim.Remove();
      }
  }
}


function main() {
  const modVanilla = RegisterMod("BoomZoneWarning", 1);
  const mod = upgradeMod(modVanilla);
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
        config[k] = v;
      }
    }
  }

  function preGameExit() {
    mod.SaveData(json.encode(config));
  }

  mod.AddCallback(ModCallback.PRE_GAME_EXIT, preGameExit);
  mod.AddCallback(ModCallback.POST_GAME_STARTED, postGameStarted);

  if (ModConfigMenu !== undefined) {
    ModConfig(config);
  }
  // //! END MOD CONFIG MENU

  mod.AddCallback(ModCallback.POST_UPDATE, postUpdate);
  mod.AddCallback(ModCallback.POST_NEW_ROOM, TntDetection);
  mod.AddCallbackCustom(ModCallbackCustom.POST_ITEM_PICKUP,
    (player: EntityPlayer, pickingUpItem: PickingUpItem) => {
      if(pickingUpItem.subType == 223 || pickingUpItem.subType == 375){
        hasNoDmg = true
      }
    },
  );
}

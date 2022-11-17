import { ModCallback } from "isaac-typescript-definitions";
import * as json from "json";
interface DangerExplosionData {
  DangerExplosion: int | undefined;
  ExplosionZoneLink: Entity | undefined;
}

let ActiveEnemy = [] as Entity[];
let ActiveZone = [] as Entity[];
let ActiveProjectile = [] as Entity[];

main();

function mobDetection() {
  let entities = Isaac.GetRoomEntities();
  let enemy = [] as Entity[];
  if (entities.length === 0) {
  } else {
    entities.forEach((ent) => {
      if (
        ent.IsActiveEnemy(true) ||
        (ent.Type == 1000 && ent.Variant == 29) ||
        (ent.Type == 1000 && ent.Variant == 3480)//rev glasstro
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
    if(ent.Type == 25 && data.DangerExplosion !== 1){
      data.DangerExplosion = 1
      let anima = Isaac.Spawn(
        1000,
        8746,
        0,
        Vector(ent.Position.X, ent.Position.Y-64),
        Vector(0, 0),
        undefined,
      ); //* spawn the animation
      anima.SpriteScale = Vector(0.95, 0.90);
      //anim.ToNPC().CanShutDoors = false
      anima.RenderZOffset = -6999;
      anima.ToEffect().FollowParent(ent); //*make the animation follow the trigger entity
      anima.Parent = ent; //* make the animation parent the trigger entity, for the suppression
      ActiveZone.push(anima); //* activeZone used to retrieve the animation later
      data.ExplosionZoneLink = anima;
    }
    if(ent.IsDead() || ent.Exists() !== true && data.DangerExplosion == 1){
      data.ExplosionZoneLink.Remove();
      data.DangerExplosion = 0;
    }
  });
  //! security
}



function postUpdate() {
  mobDetection();
  spawnCondition();
}


function main() {
  const mod = RegisterMod("BoomZoneWarning", 1);
  // Instantiate a new mod object, which grants the ability to add callback functions that
  // correspond to in-game events.


  // //! MOD CONFIG MENU
  // //steal on another mod, idk how it's work
  // function postGameStarted() {
  //   if (mod.HasData()) {
  //     const loadedFromSave = json.decode(Isaac.LoadModData(mod)) as Record<
  //       string,
  //       any
  //     >;

  //     for (const [k, v] of pairs(loadedFromSave)) {
  //       IRFconfig[k] = v;
  //     }
  //   }
  // }

  // function preGameExit() {
  //   mod.SaveData(json.encode(IRFconfig));
  // }

  // mod.AddCallback(ModCallback.PRE_GAME_EXIT, preGameExit);
  // mod.AddCallback(ModCallback.POST_GAME_STARTED, postGameStarted);

  // if (ModConfigMenu !== undefined) {
  //   ModConfig(IRFconfig);
  // }
  // //! END MOD CONFIG MENU

  mod.AddCallback(ModCallback.POST_UPDATE, postUpdate);
}

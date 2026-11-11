/* KeyPress CrazyGames integration and Arcade progression. */
(function () {
  "use strict";
  const $ = id => document.getElementById(id);
  const css = [
    "html,body{width:100%;height:100%;min-width:0;min-height:0;overflow:hidden;overscroll-behavior:none}",
    ".gameWrap{position:absolute;inset:0;width:100%;height:100%;min-width:0;min-height:0}",
    ".topbar{padding-left:max(8px,var(--safe-area-inset-left,0px));padding-right:max(8px,var(--safe-area-inset-right,0px))}",
    ".stats{min-width:0;flex:1;overflow:hidden;white-space:nowrap}",
    ".topbtns{flex:0 0 auto;align-items:center;flex-wrap:nowrap}",
    ".iconbtn{white-space:nowrap}",
    ".stage{position:absolute;inset:52px 0 0;height:auto;min-height:0;padding:12px;overflow:hidden}",
    ".boardWrap{transform:rotateX(var(--tilt)) scale(var(--kp-board-scale,1));transform-origin:center center;max-width:calc(100vw - 24px)}",
    ".keyboard{transform:none}",
    ".kp-hidden{display:none!important}",
    ".kp-modal,.kp-result{position:fixed;inset:0;z-index:80;display:none;align-items:center;justify-content:center;padding:16px;background:#05070bdc;backdrop-filter:blur(10px)}",
    ".kp-modal.open,.kp-result.open{display:flex}",
    ".kp-card{width:min(680px,100%);max-height:88dvh;overflow:auto;padding:22px;border:1px solid #29374e;border-radius:20px;background:linear-gradient(145deg,#151d2b,#090d15);box-shadow:0 24px 90px #000b}",
    ".kp-kicker{color:#00e7ef;font-size:11px;font-weight:800;letter-spacing:2px;text-transform:uppercase}",
    ".kp-title{font-size:clamp(24px,4vw,36px);font-weight:900;margin:7px 0}",
    ".kp-sub{color:#9eacc1;font-size:13px;line-height:1.5}",
    ".kp-mode-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:12px;margin:20px 0}",
    ".kp-mode{min-height:140px;text-align:left;padding:15px;border-radius:14px;border:1px solid #29374e;background:linear-gradient(155deg,#1b2739,#101722);color:#fff;cursor:pointer;transition:.18s}",
    ".kp-mode:hover,.kp-mode.selected{border-color:#00e7ef;transform:translateY(-2px);box-shadow:0 0 0 1px #00e7ef33}",
    ".kp-mode strong{display:block;margin:9px 0 5px;font-size:15px}.kp-mode small{color:#aab7c9;line-height:1.4}",
    ".kp-actions{display:flex;align-items:center;justify-content:space-between;gap:10px;flex-wrap:wrap}",
    ".kp-primary{border:0;border-radius:10px;padding:12px 20px;background:linear-gradient(100deg,#00d7e8,#0789ff);color:#04111c;font-weight:900;cursor:pointer}",
    ".kp-secondary{border:1px solid #34445c;border-radius:10px;padding:11px 16px;background:#172132;color:#dce8f8;cursor:pointer}",
    ".kp-hud{position:fixed;left:50%;top:62px;transform:translateX(-50%);z-index:35;display:none;align-items:center;gap:14px;padding:10px 16px;border:1px solid #24465a;border-radius:12px;background:#0b1522ef;white-space:nowrap}",
    ".kp-hud.active{display:flex}.kp-hud b{color:#00f5ff;font-variant-numeric:tabular-nums}.kp-timer{font-size:22px;font-weight:900}",
    ".kp-result-card{width:min(420px,100%);padding:28px;border-radius:20px;border:1px solid #30445d;background:linear-gradient(145deg,#18263a,#0a101a);text-align:center}",
    ".kp-result-score{font-size:58px;font-weight:950;color:#00f5ff;margin:8px}",
    ".kp-progress{height:5px;background:#202b3b;border-radius:99px;overflow:hidden;margin-top:8px}.kp-progress i{display:block;height:100%;background:#00e7ef}",
    ".kp-level{display:flex;align-items:center;gap:7px;font-size:10px;color:#a9b8cc;white-space:nowrap}.kp-level-track{width:64px;height:5px;background:#29364a;border-radius:9px;overflow:hidden}.kp-level-track i{display:block;height:100%;background:#00e7ef}",
    ".kp-toast{position:fixed;left:50%;bottom:20px;transform:translate(-50%,15px);z-index:100;padding:10px 15px;border-radius:10px;background:#152438;border:1px solid #2e526d;color:#e8f8ff;font-size:12px;opacity:0;pointer-events:none;transition:.2s}.kp-toast.show{opacity:1;transform:translate(-50%,0)}",
    "#kpArcadeBtn{border-color:#167b91;color:#7af6ff}#kpBoostBtn{border-color:#8b6b25;color:#ffe08a}",
    ".topbtns #kpProfileBtn{max-width:100px;overflow:hidden;text-overflow:ellipsis}",
    "@media(max-width:900px){.topbar{height:48px}.topbtns{gap:4px}.iconbtn{padding:7px 8px;font-size:11px}.stats{gap:7px;font-size:10px}.stats span:nth-child(n+3){display:none}.playerBadge{display:none!important}.topbtns #changeKeyBtn,.topbtns #prestigeShortcutBtn{display:none!important}}",
    "@media(max-width:640px){.topbtns #kpLevelHud{display:none}.topbtns #accountBtn,.topbtns #changeKeyBtn{display:none}.kp-mode-grid{grid-template-columns:1fr}.kp-mode{min-height:82px}.kp-card{padding:17px}.kp-hud{top:54px;gap:8px;padding:8px 10px;font-size:11px}}",
    "@media(prefers-reduced-motion:reduce){*,*::before,*::after{animation-duration:.01ms!important;transition-duration:.01ms!important}}"
  ].join("");
  const style=document.createElement("style");style.textContent=css;document.head.appendChild(style);

  // Keep the keyboard centered and scale only the board to fit the iframe.
  let resizeFrame=0;
  function fitBoard(){
    cancelAnimationFrame(resizeFrame);
    resizeFrame=requestAnimationFrame(function(){
      const board=$("boardWrap"),stage=document.querySelector(".stage");
      if(!board||!stage)return;
      board.style.setProperty("--kp-board-scale","1");
      const w=Math.max(220,stage.clientWidth-36),h=Math.max(140,stage.clientHeight-28);
      const r=board.getBoundingClientRect();
      const scale=Math.max(.34,Math.min(1,w/Math.max(r.width,1),h/Math.max(r.height,1)));
      board.style.setProperty("--kp-board-scale",String(scale));
    });
  }
  if(window.ResizeObserver)new ResizeObserver(fitBoard).observe(document.documentElement);
  window.addEventListener("resize",fitBoard,{passive:true});
  window.addEventListener("orientationchange",function(){setTimeout(fitBoard,120);},{passive:true});
  window.addEventListener("wheel",function(e){e.preventDefault();},{passive:false});
  window.addEventListener("keydown",function(e){
    if(["ArrowUp","ArrowDown","ArrowLeft","ArrowRight"," "].includes(e.key)&&
      !["INPUT","TEXTAREA"].includes(document.activeElement.tagName))e.preventDefault();
  },{passive:false});

  const ADS_ENABLED=false; // Enable only after CrazyGames approves Full Launch monetization.
  const topBtns=document.querySelector(".topbtns");
  const arcadeBtn=document.createElement("button");
  arcadeBtn.className="iconbtn";arcadeBtn.id="kpArcadeBtn";arcadeBtn.textContent="Arcade";
  const boostBtn=document.createElement("button");
  boostBtn.className="iconbtn";boostBtn.id="kpBoostBtn";boostBtn.textContent="2× Boost";
  const levelHud=document.createElement("div");levelHud.className="kp-level";levelHud.id="kpLevelHud";
  const profileBtn=document.createElement("button");profileBtn.className="iconbtn";profileBtn.id="kpProfileBtn";profileBtn.textContent="Login";profileBtn.title="Sign in with CrazyGames";profileBtn.style.display="none";
  if(topBtns){topBtns.insertBefore(arcadeBtn,topBtns.firstChild);topBtns.appendChild(levelHud);topBtns.appendChild(profileBtn);}

  const modal=document.createElement("div");modal.className="kp-modal";modal.id="kpArcadeModal";
  modal.innerHTML='<div class="kp-card"><div class="kp-kicker">KEYPRESS / ARCADE</div><div class="kp-title">Choose your challenge.</div><div class="kp-sub">Pick a key on the keyboard first, then compete for a personal best. Every run earns XP and coins.</div><div class="kp-mode-grid"><button class="kp-mode selected" data-mode="sprint"><span>⚡</span><strong>30 Second Sprint</strong><small>Press your chosen key as fast as possible before time runs out.</small></button><button class="kp-mode" data-mode="endurance"><span>🔥</span><strong>60 Second Endurance</strong><small>Keep your pace up for a full minute. Build a new personal best.</small></button><button class="kp-mode" data-mode="precision"><span>🎯</span><strong>Precision Run</strong><small>30 seconds. Wrong keys cost points, so stay accurate.</small></button></div><div class="kp-actions"><span class="kp-sub" id="kpSelectedKey">Choose a key on the keyboard first</span><div><button class="kp-secondary" id="kpArcadeClose">Back</button> <button class="kp-primary" id="kpStartRun">Start Run</button></div></div></div>';
  document.body.appendChild(modal);
  const hud=document.createElement("div");hud.className="kp-hud";hud.id="kpRunHud";
  hud.innerHTML='<span class="kp-timer" id="kpTimer">30.0</span><span>Hits <b id="kpHits">0</b></span><span>Misses <b id="kpMisses">0</b></span><span>Best <b id="kpBest">0</b></span>';
  document.body.appendChild(hud);
  const result=document.createElement("div");result.className="kp-result";result.id="kpResult";
  result.innerHTML='<div class="kp-result-card"><div class="kp-kicker">RUN COMPLETE</div><div class="kp-title" id="kpResultTitle">Nice run!</div><div class="kp-result-score" id="kpResultScore">0</div><div class="kp-sub" id="kpResultSub">+0 XP · +0 coins</div><div class="kp-progress"><i id="kpResultProgress"></i></div><div style="margin-top:20px"><button class="kp-primary" id="kpRunAgain">Run Again</button></div></div>';
  document.body.appendChild(result);
  boostBtn.className="kp-secondary";boostBtn.textContent="Watch video for 2× coins";boostBtn.style.display=ADS_ENABLED?"":"none";
  const rewardRow=document.createElement("div");rewardRow.style.cssText="display:flex;justify-content:center;gap:10px;flex-wrap:wrap;margin-top:16px";
  const skipBoost=document.createElement("button");skipBoost.id="kpResultClose";skipBoost.className="kp-secondary";skipBoost.textContent="Continue";
  rewardRow.appendChild(boostBtn);rewardRow.appendChild(skipBoost);result.querySelector(".kp-result-card").appendChild(rewardRow);
  const toast=document.createElement("div");toast.className="kp-toast";toast.id="kpToast";document.body.appendChild(toast);

  const oldRegisterPress=registerPress,oldSaveState=saveState,oldPlayClickSound=playClickSound,oldUpdateStats=updateStatsDisplay;
  Object.assign(state,{arcadeXP:0,arcadeRuns:0,arcadeBest:{sprint:0,endurance:0,precision:0},arcadeWins:0,rewardBoostUntil:0},state);
  let mode="sprint",run=null,runTimer=null,sdkReady=false,sdkDataReady=false,sdkEnv="disabled",sdkMuted=false,adBusy=false,gameplayActive=false,lastMidgameAdAt=0;
  let boostUntil=Number(state.rewardBoostUntil)||0;
  function xpLevel(xp){let level=1,rest=Math.max(0,Number(xp)||0),need=100;while(rest>=need&&level<999){rest-=need;level++;need=Math.round(100+level*30);}return{level:level,progress:rest,need:need};}
  function updateLevel(){const p=xpLevel(state.arcadeXP||0);levelHud.innerHTML="<strong>LV "+p.level+"</strong><span class=\"kp-level-track\"><i style=\"width:"+Math.min(100,p.progress/p.need*100)+"%\"></i></span><span>"+p.progress+"/"+p.need+" XP</span>";}
  let toastTimer=0;
  function notify(message){toast.textContent=message;toast.classList.add("show");clearTimeout(toastTimer);toastTimer=setTimeout(function(){toast.classList.remove("show");},2200);}
  function menuOpen(){return !!document.querySelector(".shop.open,#kpArcadeModal.open,#kpResult.open,#revealModal.show");}
  function setGameplay(active){if(!sdkReady||!window.CrazyGames||!window.CrazyGames.SDK.game||gameplayActive===active)return;gameplayActive=active;try{if(active)window.CrazyGames.SDK.game.gameplayStart();else window.CrazyGames.SDK.game.gameplayStop();}catch(e){console.debug("CrazyGames gameplay event",e);}}
  function syncGameplay(){if(!sdkReady||!document.querySelector(".gameWrap.visible")||adBusy)return;setGameplay(!menuOpen()&&!document.hidden&&!(run&&run.finished));}
  const observer=new MutationObserver(syncGameplay);
  document.querySelectorAll(".shop,.revealModal").forEach(function(el){observer.observe(el,{attributes:true,attributeFilter:["class"]});});
  observer.observe(modal,{attributes:true,attributeFilter:["class"]});observer.observe(result,{attributes:true,attributeFilter:["class"]});
  document.addEventListener("visibilitychange",syncGameplay);
  window.addEventListener("pagehide",function(){setGameplay(false);});

  function updateSelectedKey(){const el=$("kpSelectedKey");if(el)el.textContent=state.mainKey?"Selected key: "+state.mainKey:"Select a key on the keyboard first";}
  function openArcade(){if(run&&!run.finished)return;updateSelectedKey();modal.classList.add("open");syncGameplay();}
  function closeArcade(){modal.classList.remove("open");syncGameplay();}
  arcadeBtn.addEventListener("click",openArcade);
  $("kpArcadeClose").addEventListener("click",closeArcade);
  modal.querySelectorAll(".kp-mode").forEach(function(button){button.addEventListener("click",function(){mode=button.dataset.mode;modal.querySelectorAll(".kp-mode").forEach(function(b){b.classList.toggle("selected",b===button);});});});
  function best(){return Number(state.arcadeBest&&state.arcadeBest[mode])||0;}
  function startRun(){
    if(!state.mainKey){notify("Choose a key on the keyboard first.");return;}
    if(run&&!run.finished)return;
    closeArcade();const duration=mode==="endurance"?60:30;
    run={mode:mode,duration:duration,endsAt:performance.now()+duration*1000,hits:0,misses:0,finished:false};
    $("kpRunHud").classList.add("active");$("kpBest").textContent=best();$("kpHits").textContent="0";$("kpMisses").textContent="0";
    setGameplay(true);clearInterval(runTimer);runTimer=setInterval(tick,50);tick();
  }
  $("kpStartRun").addEventListener("click",startRun);
  function tick(){if(!run||run.finished)return;const left=Math.max(0,run.endsAt-performance.now());$("kpTimer").textContent=(left/1000).toFixed(1);if(left<=0)finishRun();}
  function finishRun(){
    if(!run||run.finished)return;run.finished=true;clearInterval(runTimer);$("kpRunHud").classList.remove("active");
    const score=run.mode==="precision"?Math.max(0,run.hits-run.misses*2):run.hits;
    const oldBest=Number(state.arcadeBest[run.mode])||0,isRecord=score>oldBest;
    state.arcadeBest[run.mode]=Math.max(oldBest,score);
    const xp=run.hits===0?0:Math.max(10,Math.round(score*(run.mode==="precision"?1.5:1))+Math.max(0,20-run.misses));
    const coins=run.hits===0?0:Math.max(5,Math.round(score*.5));
    const oldLevel=xpLevel(state.arcadeXP||0).level;
    state.arcadeXP=(state.arcadeXP||0)+xp;state.arcadeRuns=(state.arcadeRuns||0)+1;
    if(score>=20)state.arcadeWins=(state.arcadeWins||0)+1;
    state.clicks=Number((state.clicks+coins).toFixed(2));state.lifetimeClicks=Number((state.lifetimeClicks+coins).toFixed(2));
    updateStatsDisplay();updateLevel();saveState();
    $("kpResultTitle").textContent=isRecord?"NEW PERSONAL BEST":"Run complete";
    $("kpResultScore").textContent=String(score);
    $("kpResultSub").textContent=run.hits+" hits · "+run.misses+" misses · +"+xp+" XP · +"+coins+" coins";
    const p=xpLevel(state.arcadeXP);$("kpResultProgress").style.width=(p.progress/p.need*100)+"%";
    result.classList.add("open");syncGameplay();
    if(sdkReady&&(p.level>oldLevel||(isRecord&&score>=50))){try{const task=window.CrazyGames.SDK.game.happytime();if(task&&typeof task.catch==="function")task.catch(function(){});}catch(e){}}
    if(ADS_ENABLED&&sdkReady&&state.arcadeRuns%4===0)requestMidgameAd();
    if(p.level>oldLevel)notify("Level up! You reached level "+p.level+".");else if(isRecord)notify("New personal best!");
  }
  function closeResult(){result.classList.remove("open");run=null;syncGameplay();}
  $("kpResultClose").addEventListener("click",closeResult);
  $("kpRunAgain").addEventListener("click",function(){result.classList.remove("open");run=null;startRun();});
  document.addEventListener("keydown",function(e){
    if(!run||run.finished||e.repeat||e.metaKey||e.ctrlKey||e.altKey)return;
    const label=keyEventMap[e.key]||e.key.toUpperCase();
    if(label!==state.mainKey&&!["Escape","Tab","CapsLock","Shift"].includes(e.key)){run.misses++;$("kpMisses").textContent=run.misses;}
  },true);
  registerPress=function(label){
    const beforePresses=Number(state.totalPresses)||0;
    const before=Number(state.clicks)||0,beforeLife=Number(state.lifetimeClicks)||0;
    oldRegisterPress(label);
    if(run&&!run.finished&&(Number(state.totalPresses)||0)>beforePresses){run.hits++;$("kpHits").textContent=run.hits;}
    if(boostUntil>Date.now()){
      const earned=Math.max(0,(Number(state.clicks)||0)-before),life=Math.max(0,(Number(state.lifetimeClicks)||0)-beforeLife);
      state.clicks=Number((state.clicks+earned).toFixed(2));state.lifetimeClicks=Number((state.lifetimeClicks+life).toFixed(2));
      updateStatsDisplay();saveState();
    }
    if(run&&!run.finished)tick();
  };
  playClickSound=function(){if(!sdkMuted)oldPlayClickSound();};
  updateStatsDisplay=function(){oldUpdateStats();updateLevel();};

  function updateBoost(){
    const left=Math.max(0,boostUntil-Date.now());
    if(left){boostBtn.textContent="2× "+Math.ceil(left/1000)+"s";boostBtn.disabled=true;}
    else{boostBtn.textContent="2× Boost";boostBtn.disabled=false;state.rewardBoostUntil=0;}
  }
  boostBtn.addEventListener("click",async function(){
    if(!ADS_ENABLED)return;
    if(adBusy||boostUntil>Date.now())return;
    const sdk=window.CrazyGames&&window.CrazyGames.SDK;
    if(!sdkReady||!sdk.ad||!["local","crazygames"].includes(sdkEnv)){notify("Reward videos are available on CrazyGames.");return;}
    adBusy=true;setGameplay(false);let settled=false;
    function resume(){adBusy=false;sdkMuted=false;syncGameplay();}
    try{
      await sdk.ad.requestAd("rewarded",{
        adStarted:function(){sdkMuted=true;},
        adError:function(error){if(settled)return;settled=true;resume();notify("No video available. Try again later.");console.warn("Reward ad",error);},
        adFinished:function(){if(settled)return;settled=true;boostUntil=Date.now()+60000;state.rewardBoostUntil=boostUntil;saveState();resume();updateBoost();notify("2× coins active for 60 seconds!");}
      });
    }catch(e){if(!settled){settled=true;resume();notify("The video could not be loaded.");}console.warn("Rewarded ad failed",e);}
  });
  setInterval(updateBoost,250);updateBoost();

  async function requestMidgameAd(){
    if(!ADS_ENABLED||!sdkReady||!window.CrazyGames.SDK.ad||adBusy||Date.now()-lastMidgameAdAt<180000)return;
    lastMidgameAdAt=Date.now();adBusy=true;setGameplay(false);
    const buttons=[$("kpRunAgain"),$("kpResultClose"),skipBoost];buttons.forEach(function(b){if(b)b.disabled=true;});
    let settled=false;
    function resume(){adBusy=false;sdkMuted=false;buttons.forEach(function(b){if(b)b.disabled=false;});syncGameplay();}
    try{
      await window.CrazyGames.SDK.ad.requestAd("midgame",{
        adStarted:function(){sdkMuted=true;},
        adError:function(error){if(settled)return;settled=true;resume();console.warn("Midgame ad unavailable",error);},
        adFinished:function(){if(settled)return;settled=true;resume();}
      });
    }catch(e){if(!settled){settled=true;resume();}console.warn("Midgame ad failed",e);}
  }

  // Use SDK Data as the canonical save and migrate existing browser progress once.
  async function initCrazyGames(){
    const sdk=window.CrazyGames&&window.CrazyGames.SDK;
    if(!sdk||typeof sdk.init!=="function"){console.info("CrazyGames SDK not loaded; browser save mode.");return;}
    try{
      await sdk.init();sdkReady=true;sdkEnv=sdk.environment||"disabled";
      try{if(sdk.game)sdk.game.loadingStart();}catch(e){}
      if(sdkEnv!=="disabled"&&sdk.data){
        try{
          const cloud=sdk.data.getItem("keypress_save_v6");
          if(cloud){
            const parsed=JSON.parse(cloud);
            if(parsed&&typeof parsed==="object"){
              state=Object.assign(defaultState(),state,parsed);
              state.arcadeBest=Object.assign({sprint:0,endurance:0,precision:0},state.arcadeBest||{});
              state.charms=(state.charms||[]).map(normalizeCharm);
              renderKeyboard();updateStatsDisplay();
              muteBtn.textContent=state.muted?"🔇":"🔊";
              volumeSlider.value=Math.round(state.volume*100);
              boostUntil=Number(state.rewardBoostUntil)||0;updateBoost();
            }
          }else{
            const old=localStorage.getItem("keypress_save_v6");
            sdk.data.setItem("keypress_save_v6",old||JSON.stringify(state));
          }
          sdkDataReady=true;
        }catch(e){sdkDataReady=false;console.warn("CrazyGames Data module unavailable; local saving will continue.",e);}
      }
      if(sdkEnv!=="disabled"&&sdk.game){
        const applySettings=function(settings){sdkMuted=!!(settings&&settings.muteAudio);};
        applySettings(sdk.game.settings||{});
        if(typeof sdk.game.addSettingsChangeListener==="function")sdk.game.addSettingsChangeListener(applySettings);
      }
      // Use CrazyGames profile when signed in; otherwise continue as a guest.
      await refreshCrazyUser();
      if(sdk.user&&typeof sdk.user.addAuthListener==="function")sdk.user.addAuthListener(function(user){refreshCrazyUser(user);});
      try{if(sdk.game)sdk.game.loadingStop();}catch(e){}
      syncGameplay();console.info("CrazyGames SDK ready:",sdkEnv);
    }catch(e){sdkReady=false;console.warn("CrazyGames SDK initialization failed; local saves remain enabled.",e);}
  }
  async function refreshCrazyUser(existingUser){
    const sdk=window.CrazyGames&&window.CrazyGames.SDK;
    try{
      const available=!!(sdk&&sdk.user&&sdk.user.isUserAccountAvailable);
      profileBtn.style.display=available?"":"none";
      if(!available)return;
      const user=existingUser===undefined&&sdk&&sdk.user&&typeof sdk.user.getUser==="function"?await sdk.user.getUser():existingUser;
      if(user&&user.username){profileBtn.textContent=String(user.username);profileBtn.title="Signed in with CrazyGames";}
      else{profileBtn.textContent="Login";profileBtn.title="Sign in with your CrazyGames account";}
      if(user&&user.profilePictureUrl){profileBtn.style.backgroundImage="url("+JSON.stringify(user.profilePictureUrl)+")";profileBtn.style.backgroundPosition="8px center";profileBtn.style.backgroundRepeat="no-repeat";profileBtn.style.backgroundSize="20px 20px";profileBtn.style.paddingLeft="34px";}
      else{profileBtn.style.backgroundImage="";profileBtn.style.paddingLeft="8px";}
    }catch(e){profileBtn.textContent="Guest";console.debug("CrazyGames profile unavailable",e);}
  }
  profileBtn.addEventListener("click",async function(){
    const sdk=window.CrazyGames&&window.CrazyGames.SDK;
    if(!sdkReady||!sdk.user||!sdk.user.isUserAccountAvailable||typeof sdk.user.showAuthPrompt!=="function"){notify("CrazyGames accounts are available on the CrazyGames platform.");return;}
    try{const user=await sdk.user.showAuthPrompt();if(user){await refreshCrazyUser(user);saveState();notify("Your CrazyGames account is connected.");}}
    catch(e){if(e&&e.code!=="userCancelled")notify("Could not open the CrazyGames sign-in.");}
  });
  const baseSave=saveState;
  saveState=function(){
    const sdk=window.CrazyGames&&window.CrazyGames.SDK;
    try{
      if(sdkReady&&sdkDataReady&&sdkEnv!=="disabled"&&sdk&&sdk.data){sdk.data.setItem("keypress_save_v6",JSON.stringify(state));}
      else{baseSave();}
    }catch(e){sdkDataReady=false;console.warn("CrazyGames Data save failed; switching to browser fallback.",e);try{baseSave();}catch(localError){console.error("Local save also failed.",localError);}}
  };

  setInterval(function(){saveState();},5000);

  // Remove the forced Google sign-in gate and let players enter immediately.
  if($("accountBtn"))$("accountBtn").classList.add("kp-hidden");
  if($("accountBadge"))$("accountBadge").classList.add("kp-hidden");
  if($("loginModal"))$("loginModal").classList.remove("open");
  if(typeof accountsModal!=="undefined"&&accountsModal)accountsModal.classList.remove("open");
  if($("guestBanner"))$("guestBanner").classList.remove("show");
  // CrazyGames should open directly into the playable keyboard, without a forced sign-in or splash gate.
  if($("startScreen")){$("startScreen").classList.add("hidden");$("startScreen").style.display="none";}
  if($("gameWrap"))$("gameWrap").classList.add("visible");
  const keyboard=$("keyboard");
  if(keyboard)new MutationObserver(function(){updateSelectedKey();fitBoard();}).observe(keyboard,{childList:true,subtree:true,attributes:true,attributeFilter:["class"]});
  const oldKeyClick=handleKeyClick;
  handleKeyClick=function(label){
    if(run&&!run.finished&&label!==state.mainKey){if(run.mode==="precision"){run.misses++;$("kpMisses").textContent=run.misses;}notify("Keep using your selected key during a run.");return;}
    oldKeyClick(label);updateSelectedKey();fitBoard();
  };
  initCrazyGames();updateLevel();updateSelectedKey();fitBoard();
  window.addEventListener("beforeunload",function(){try{saveState();}catch(e){}});
})();
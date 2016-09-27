//ver1.6.3α
//Author: Nishisonic
//        Nekopanda

load("script/utils.js");
load("script/ScriptData.js");

data_prefix = "questStateEx_";

function header() {
	return [ "進捗詳細" ];
}

function begin() {}

function body(quest) {
	return toComparable([ getProgress(quest.getNo(), quest.getType(),quest.getProgressFlag()) ]);
}

function end() {}

function getProgress(questNo, questType, questProgressFlag) {
	if(questType != 4) {	//1回限りの任務は除外
		switch(questNo){
			case 214:	//あ号は特別扱い（切り捨てで計算）
				var cntSally214 = getData("cntSally214");
				var maxSally214 = getData("maxSally214");
				var rateSally214 = Math.min(cntSally214, maxSally214) / maxSally214 * 100;

				var cntSWin214 = getData("cntSWin214");
				var maxSWin214 = getData("maxSWin214");
				var rateSWin214 = Math.min(cntSWin214, maxSWin214) / maxSWin214 * 100;

				var cntBoss214 = getData("cntBoss214");
				var maxBoss214 = getData("maxBoss214");
				var rateBoss214 = Math.min(cntBoss214, maxBoss214) / maxBoss214 * 100;

				var cntBossWin214 = getData("cntBossWin214");
				var maxBossWin214 = getData("maxBossWin214");
				var rateBossWin214 = Math.min(cntBossWin214, maxBossWin214) / maxBossWin214 * 100;

				var sum214 = Math.floor((rateSally214 + rateSWin214 + rateBoss214 + rateBossWin214) / 4);

				switch(parseInt(questProgressFlag)){
					case 1:
						if(sum214 < 50) sum214 = 50;
						break;
					case 2:
						if(sum214 < 80) sum214 = 80;
						break;
				}

				setData("rate" + questNo, sum214 / 100);
				return String(sum214 + "%" +
					" 出撃:" + Math.min(cntSally214,maxSally214) + "/" + maxSally214 +
					" S勝利:" + Math.min(cntSWin214,maxSWin214) + "/" + maxSWin214 +
					" ボス戦:" + Math.min(cntBoss214,maxBoss214) + "/" + maxBoss214 +
					" ボス勝利:" + Math.min(cntBossWin214,maxBossWin214) + "/" + maxBossWin214);
			case 626: //精鋭「艦戦」隊の新編成(Ver1.4.1)
				var cntScrapType96Fighter_626 = getData("cntScrapType96Fighter_626");
				var maxScrapType96Fighter_626 = getData("maxScrapType96Fighter_626");
				var rateScrapType96Fighter_626 = Math.min(cntScrapType96Fighter_626, maxScrapType96Fighter_626) / maxScrapType96Fighter_626 * 100;

				var cntScrapType0FighterModel21_626 = getData("cntScrapType0FighterModel21_626");
				var maxScrapType0FighterModel21_626 = getData("maxScrapType0FighterModel21_626");
				var rateScrapType0FighterModel21_626 = Math.min(cntScrapType0FighterModel21_626, maxScrapType0FighterModel21_626) / maxScrapType0FighterModel21_626 * 100;

				var sum626 = Math.floor((rateScrapType96Fighter_626 + rateScrapType0FighterModel21_626) / 2);

				switch(parseInt(questProgressFlag)){
					case 1:
						if(sum626 < 50) sum626 = 50;
						break;
					case 2:
						if(sum626 < 80) sum626 = 80;
						break;
				}
				
				setData("rate" + questNo, sum626 / 100);
				return String(sum626 + "%" +
					" 96式:" + Math.min(cntScrapType96Fighter_626,maxScrapType96Fighter_626) + "/" + maxScrapType96Fighter_626 +
					" 21式:" + Math.min(cntScrapType0FighterModel21_626,maxScrapType0FighterModel21_626) + "/" + maxScrapType0FighterModel21_626);
			case 643: //主力「陸攻」の調達
				//零式艦戦21型
				var cntScrapType0FighterModel21_643 = getData("cntScrapType0FighterModel21_643");
				var maxScrapType0FighterModel21_643 = getData("maxScrapType0FighterModel21_643");
				var rateScrapType0FighterModel21_643 = Math.min(cntScrapType0FighterModel21_643, maxScrapType0FighterModel21_643) / maxScrapType0FighterModel21_643 * 100;

				//九七式艦攻
				var cntType97TorpedoBomber_643 = getData("cntType97TorpedoBomber_643");
				var maxType97TorpedoBomber_643 = getData("maxType97TorpedoBomber_643");
				var rateType97TorpedoBomber_643 = Math.min(cntType97TorpedoBomber_643, maxType97TorpedoBomber_643) / maxType97TorpedoBomber_643 * 100;
				
				//九六式陸攻
				var cntType96LandBasedAttackAircraft_643 = getData("cntType96LandBasedAttackAircraft_643");
				var maxType96LandBasedAttackAircraft_643 = getData("maxType96LandBasedAttackAircraft_643");
				var rateType96LandBasedAttackAircraft_643 = Math.min(cntType96LandBasedAttackAircraft_643, maxType96LandBasedAttackAircraft_643) / maxType96LandBasedAttackAircraft_643 * 100;

				var sum643 = Math.floor((rateScrapType0FighterModel21_643 + rateType97TorpedoBomber_643 + rateType96LandBasedAttackAircraft_643) / 3);

				switch(parseInt(questProgressFlag)){
					case 1:
						if(sum643 < 50) sum643 = 50;
						break;
					case 2:
						if(sum643 < 80) sum643 = 80;
						break;
				}

				setData("rate" + questNo, sum643 / 100);
				return String(sum643 + "%" +
					" 艦戦:" + Math.min(cntScrapType0FighterModel21_643, maxScrapType0FighterModel21_643)             + "/" + maxScrapType0FighterModel21_643 +
					" 艦攻:"   + Math.min(cntType97TorpedoBomber_643, maxType97TorpedoBomber_643)                     + "/" + maxType97TorpedoBomber_643 +
					" 陸攻:"   + Math.min(cntType96LandBasedAttackAircraft_643, maxType96LandBasedAttackAircraft_643) + "/" + maxType96LandBasedAttackAircraft_643);
			case 645: //「洋上補給」物資の調達
				//三式弾
				var cntScrapType3Shell_645 = getData("cntScrapType3Shell_645");
				var maxScrapType3Shell_645 = getData("maxScrapType3Shell_645");
				var rateScrapType3Shell_645 = Math.min(cntScrapType3Shell_645, maxScrapType3Shell_645) / maxScrapType3Shell_645 * 100;

				//九一式徹甲弾
				var cntType91AP_Shell_645 = getData("cntType91AP_Shell_645");
				var maxType91AP_Shell_645 = getData("maxType91AP_Shell_645");
				var rateType91AP_Shell_645 = Math.min(cntType91AP_Shell_645, maxType91AP_Shell_645) / maxType91AP_Shell_645 * 100;

				//ドラム缶(輸送用)
				var cntDrumCanisters_645 = getData("cntDrumCanisters_645");
				var maxDrumCanisters_645 = getData("maxDrumCanisters_645");
				var rateDrumCanisters_645 = Math.min(cntDrumCanisters_645, maxDrumCanisters_645) / maxDrumCanisters_645 * 100;

				//燃料
				var cntFuel_645 = getData("cntFuel_645");
				var maxFuel_645 = getData("maxFuel_645");
				var rateFuel_645 = Math.min(cntFuel_645, maxFuel_645) / maxFuel_645 * 100;

				//弾薬
				var cntAmmo_645 = getData("cntAmmo_645");
				var maxAmmo_645 = getData("maxAmmo_645");
				var rateAmmo_645 = Math.min(cntAmmo_645, maxAmmo_645) / maxAmmo_645 * 100;

				var sum645 = Math.floor((rateScrapType3Shell_645 + rateType91AP_Shell_645 + rateDrumCanisters_645 + rateFuel_645 + rateAmmo_645) / 5);

				switch(parseInt(questProgressFlag)){
					case 1:
						if(sum645 < 50) sum645 = 50;
						break;
					case 2:
						if(sum645 < 80) sum645 = 80;
						break;
				}

				setData("rate" + questNo, sum645 / 100);
				return String(sum645 + "%" +
					" 三式弾:" + Math.min(cntScrapType3Shell_645, maxScrapType3Shell_645) + "/" + maxScrapType3Shell_645 +
					" 徹甲弾:" + Math.min(cntType91AP_Shell_645, maxType91AP_Shell_645)   + "/" + maxType91AP_Shell_645 +
					" ﾄﾞﾗﾑ缶:" + Math.min(cntDrumCanisters_645, maxDrumCanisters_645)     + "/" + maxDrumCanisters_645 +
					" 燃料:"   + Math.min(cntFuel_645, maxFuel_645)                       + "/" + maxFuel_645 +
					" 弾薬:"   + Math.min(cntAmmo_645, maxAmmo_645)                       + "/" + maxAmmo_645);
			default:
				//新任務が追加されたらupdate_questStateExの方に書き込む
				var cnt = getData("cnt"+ questNo);
				var max = getData("max"+ questNo);
				setData("rate" + questNo, cnt / max);
				return String(Math.min(cnt, max) + "/"+ max);
		}
	} else {
		setData("rate" + questNo, -1);
		return null;
	}
}

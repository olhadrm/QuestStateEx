//ver1.7.4β
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
					" 21型:" + Math.min(cntScrapType0FighterModel21_626,maxScrapType0FighterModel21_626) + "/" + maxScrapType0FighterModel21_626);
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
			case 663: //新型艤装の継続研究
				//廃棄
				var cnt663 = getData("cnt663");
				var max663 = getData("max663");
				var rate663 = Math.min(cnt663, max663) / max663 * 100;
				//鋼材
				var cntSteel_663 = getData("cntSteel_663");
				var maxSteel_663 = getData("maxSteel_663");
				var rateSteel_663 = Math.min(cntSteel_663, maxSteel_663) / maxSteel_663 * 100;

				var sum663 = Math.floor((rate663 + rateSteel_663) / 2);

				switch(parseInt(questProgressFlag)){
					case 1:
						if(sum663 < 50) sum663 = 50;
						break;
					case 2:
						if(sum663 < 80) sum663 = 80;
						break;
				}

				setData("rate" + questNo, sum663 / 100);
				return String(sum663 + "%" +
					" 廃棄:" + Math.min(cnt663, max663) + "/" + max663 +
					" 鋼材:" + Math.min(cntSteel_663, maxSteel_663) + "/" + maxSteel_663);
			case 854: // 戦果拡張任務！「Z作戦」前段作戦
				//2-4
				var cnt2_4 = getData("cnt854_2-4");
				var max2_4 = getData("max854_2-4");
				var rate2_4 = Math.min(cnt2_4, max2_4) / max2_4 * 100;

				//九一式徹甲弾
				var cnt6_1 = getData("cnt854_6-1");
				var max6_1 = getData("max854_6-1");
				var rate6_1 = Math.min(cnt6_1, max6_1) / max6_1 * 100;

				//ドラム缶(輸送用)
				var cnt6_3 = getData("cnt854_6-3");
				var max6_3 = getData("max854_6-3");
				var rate6_3 = Math.min(cnt6_3, max6_3) / max6_3 * 100;

				//燃料
				var cnt6_4 = getData("cnt854_6-4");
				var max6_4 = getData("max854_6-4");
				var rate6_4 = Math.min(cnt6_4, max6_4) / max6_4 * 100;

				var sum854 = Math.floor((rate2_4 + rate6_1 + rate6_3 + rate6_4) / 4);

				switch(parseInt(questProgressFlag)){
					case 1:
						if(sum854 < 50) sum854 = 50;
						break;
					case 2:
						if(sum854 < 80) sum854 = 80;
						break;
				}

				setData("rate" + questNo, sum854 / 100);
				return String(sum854 + "%" +
					" 2-4:" + Math.min(cnt2_4, max2_4) + "/" + max2_4 +
					" 6-1:" + Math.min(cnt6_1, max6_1) + "/" + max6_1 +
					" 6-3:" + Math.min(cnt6_3, max6_3) + "/" + max6_3 +
					" 6-4:" + Math.min(cnt6_4, max6_4) + "/" + max6_4);
			case 426: // 海上通商航路の警戒を厳とせよ！
				// かなり省略
				var cntKeibi = getData("cnt426_keibi");
				var maxKeibi = getData("max426_keibi");
				var rateKeibi = Math.min(cntKeibi, maxKeibi) / maxKeibi * 100;
				var cntTaisen = getData("cnt426_taisen");
				var maxTaisen = getData("max426_taisen");
				var rateTaisen = Math.min(cntTaisen, maxTaisen) / maxTaisen * 100;
				var cntKaijo = getData("cnt426_kaijo");
				var maxKaijo = getData("max426_kaijo");
				var rateKaijo = Math.min(cntKaijo, maxKaijo) / maxKaijo * 100;
				var cntTeisatsu = getData("cnt426_teisatsu");
				var maxTeisatsu = getData("max426_teisatsu");
				var rateTeisatsu = Math.min(cntTeisatsu, maxTeisatsu) / maxTeisatsu * 100;
				var sum426 = Math.floor((rateKeibi + rateTaisen + rateKaijo + rateTeisatsu) / 4);

				switch(parseInt(questProgressFlag)){
					case 1:
						if(sum426 < 50) sum426 = 50;
						break;
					case 2:
						if(sum426 < 80) sum426 = 80;
						break;
				}

				setData("rate" + questNo, sum426 / 100);
				return String(sum426 + "%" +
					" 警備:" + Math.min(cntKeibi, maxKeibi) + "/" + maxKeibi +
					" 対潜:" + Math.min(cntTaisen, maxTaisen) + "/" + maxTaisen +
					" 海上:" + Math.min(cntKaijo, maxKaijo) + "/" + maxKaijo +
					" 偵察:" + Math.min(cntTeisatsu, maxTeisatsu) + "/" + maxTeisatsu);
			case 428: // 近海に侵入する敵潜を制圧せよ！
				var cntTaisen = getData("cnt428_taisen");
				var maxTaisen = getData("max428_taisen");
				var rateTaisen = Math.min(cntTaisen, maxTaisen) / maxTaisen * 100;
				var cntKaikyo = getData("cnt428_kaikyo");
				var maxKaikyo = getData("max428_kaikyo");
				var rateKaikyo = Math.min(cntKaikyo, maxKaikyo) / maxKaikyo * 100;
				var cntKeikai = getData("cnt428_keikai");
				var maxKeikai = getData("max428_keikai");
				var rateKeikai = Math.min(cntKeikai, maxKeikai) / maxKeikai * 100;
				var sum428 = Math.floor((rateTaisen + rateKaikyo + rateKeikai) / 3);

				switch(parseInt(questProgressFlag)){
					case 1:
						if(sum428 < 50) sum428 = 50;
						break;
					case 2:
						if(sum428 < 80) sum428 = 80;
						break;
				}

				setData("rate" + questNo, sum428 / 100);
				return String(sum428 + "%" +
					" 対潜:" + Math.min(cntTaisen, maxTaisen) + "/" + maxTaisen +
					" 海峡:" + Math.min(cntKaikyo, maxKaikyo) + "/" + maxKaikyo +
					" 長距離:" + Math.min(cntKeikai, maxKeikai) + "/" + maxKeikai);
			case 674: // 工廠環境の整備
				var cnt = getData("cnt674");
				var max = getData("max674");
				var rate = Math.min(cnt,max) / max * 100;
				var steel = getData("cntSteel_674");
				var maxSteel = getData("maxSteel_674");
				var rateSteel = Math.min(steel,maxSteel) / maxSteel * 100;
				var sum = Math.floor((rate + rateSteel) / 2);

				switch(parseInt(questProgressFlag)){
					case 1:
						if(sum < 50) sum = 50;
						break;
					case 2:
						if(sum < 80) sum = 80;
						break;
				}

				setData("rate" + questNo, sum / 100);
				return String(sum + "%" +
					" 機銃:" + Math.min(cnt, max) + "/" + max +
					" 鋼材:" + Math.min(steel, maxSteel) + "/" + maxSteel);
			case 873: // 北方海域警備を実施せよ！
				var cnt31 = getData("cnt873_31");
				var max31 = getData("max873_31");
				var rate31 = Math.min(cnt31,max31) / max31 * 100;
				var cnt32 = getData("cnt873_32");
				var max32 = getData("max873_32");
				var rate32 = Math.min(cnt32,max32) / max32 * 100;
				var cnt33 = getData("cnt873_33");
				var max33 = getData("max873_33");
				var rate33 = Math.min(cnt33,max33) / max33 * 100;
				var sum = Math.floor((rate31 + rate32 + rate33) / 3);

				switch(parseInt(questProgressFlag)){
					case 1:
						if(sum < 50) sum = 50;
						break;
					case 2:
						if(sum < 80) sum = 80;
						break;
				}

				setData("rate" + questNo, sum / 100);
				return String(sum + "%" +
					" 3-1:" + Math.min(cnt31, max31) + "/" + max31 +
					" 3-2:" + Math.min(cnt32, max32) + "/" + max32 +
					" 3-3:" + Math.min(cnt33, max33) + "/" + max33);
			case 675: // 運用装備の統合整備
				var cnt1 = getData("cnt675_1");
				var max1 = getData("max675_1");
				var rate1 = Math.min(cnt1,max1) / max1 * 100;
				var cnt2 = getData("cnt675_2");
				var max2 = getData("max675_2");
				var rate2 = Math.min(cnt2,max2) / max2 * 100;
				var cnt3 = getData("cnt675_3");
				var max3 = getData("max675_3");
				var rate3 = Math.min(cnt3,max3) / max3 * 100;
				var sum = Math.floor((rate1 + rate2 + rate3) / 3);

				switch(parseInt(questProgressFlag)){
					case 1:
						if(sum < 50) sum = 50;
						break;
					case 2:
						if(sum < 80) sum = 80;
						break;
				}

				setData("rate" + questNo, sum / 100);
				return String(sum + "%" +
					" 艦戦:" + Math.min(cnt1, max1) + "/" + max1 +
					" 機銃:" + Math.min(cnt2, max2) + "/" + max2 +
					" ﾎﾞｰｷ:" + Math.min(cnt3, max3) + "/" + max3);
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

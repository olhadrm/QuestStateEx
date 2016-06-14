//ver1.4.7
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

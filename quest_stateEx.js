//ver1.7.5
//Author: Nishisonic
//        Nekopanda

load("script/utils.js");
load("script/ScriptData.js");
load("script/questinfo.js");

data_prefix = "questStateEx_";

function header() {
	return ["進捗詳細"];
}

function begin() { }

function body(quest) {
	return toComparable([getProgress(quest.getNo(), quest.getType(), quest.getProgressFlag())]);
}

function end() { }

function getProgress(questNo, questType, questProgressFlag) {
	if (questType != 4) {	//1回限りの任務は除外
		var labels = function(){
			if(QUEST_LABELS[questNo] != null){
				return QUEST_LABELS[questNo];
			} else {
				return [["",questNo]];
			}
		}();
		//#region
		var sum = 0;
		var result = "";
		for (var i = 0; i < labels.length; i++) {
			var cnt = getData("cnt" + labels[i][1]);
			var max = getData("max" + labels[i][1]);
			var rate = Math.min(cnt, max) / max * 100;
			sum += rate;
			result += " " + labels[i][0] + Math.min(cnt, max) + "/" + max;
		}
		sum = Math.floor(sum / labels.length);
		switch (parseInt(questProgressFlag)) {
			case 1:
				if (sum < 50) sum = 50;
				break;
			case 2:
				if (sum < 80) sum = 80;
				break;
		}
		setData("rate" + questNo, sum / 100);
		return String(sum + "%" + result);
		//#endregion
	} else {
		setData("rate" + questNo, -1);
		return null;
	}
}

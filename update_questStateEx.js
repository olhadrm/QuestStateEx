/** 現在のバージョン */
VERSION = 1.70;

/**
 * 任務進捗詳細Ver1.7.0
 * Author:Nishisonic
 * LastUpdate:2017/06/23
 * 
 * ローカルで値を保持し、今○○回というのを表示します。
 * 
 * ScriptData.jsでよく使うものについて
 * flg + questNo：任務遂行中かどうか
 * cnt + questNo：カウントに使用
 */

//import js method
load("script/ScriptData.js");
/**  ScriptData.jsで使用 */
data_prefix = "questStateEx_";

//import class
ApplicationMain = Java.type("logbook.gui.ApplicationMain");
DataType        = Java.type("logbook.data.DataType");
GlobalContext   = Java.type("logbook.data.context.GlobalContext");
ItemDto         = Java.type("logbook.dto.ItemDto");
MaterialDto     = Java.type("logbook.dto.MaterialDto");
ShipDto         = Java.type("logbook.dto.ShipDto");
IntArrayType    = Java.type("int[]");
Arrays          = Java.type("java.util.Arrays");
Calendar        = Java.type("java.util.Calendar");
List            = Java.type("java.util.List");
Map             = Java.type("java.util.Map");
TimeZone        = Java.type("java.util.TimeZone");
TreeMap         = Java.type("java.util.TreeMap");

/** 熟練度最大値 */
var MAX_ALV = 7;
/** 改修最大値 */
var MAX_LV = 10;

/** 艦種 */
var SHIP_TYPE = {
	/** 海防艦(造語) */
	EE:1,
	/** 駆逐艦 */
	DD:2,
	/** 軽巡洋艦 */
	CL:3,
	/** 重雷装巡洋艦 */
	CLT:4,
	/** 重巡洋艦 */
	CA:5,
	/** 航空巡洋艦 */
	CVA:6,
	/** 軽空母 */
	CVL:7,
	/** 巡洋戦艦(高速戦艦) */
	BC:8,
	/** 戦艦 */
	BB:9,
	/** 航空戦艦 */
	CVB:10,
	/** 正規空母 */
	CV:11,
	/** 超弩級戦艦(造語) */
	BSD:12,
	/** 潜水艦 */
	SS:13,
	/** 潜水空母 */
	CVS:14,
	/** 補給艦(敵) */
	AOe:15,
	/** 水上機母艦 */
	AV:16,
	/**揚陸艦 */
	LHA:17,
	/** 装甲空母 */
	ACV:18,
	/** 工作艦 */
	AR:19,
	/** 潜水母艦 */
	AS:20,
	/** 練習巡洋艦 */
	TV:21,
	/** 補給艦 */
	AO:22,
};

/** 任務種別 */
var QUEST_TYPE = {
	/** デイリー */
	DAILY:1,
	/** ウィークリー */
	WEEKLY:2,
	/** マンスリー */
	MONTHLY:3,
	/** 単発 */
	ONCE:4,
	/** その他 */
	OTHERS:5,
};

/** 任務状態 */
var QUEST_STATE = {
	/** 未受注 */
	NOT_ORDER:1,
	/** 遂行中 */
	DOING:2,
	/**達成 */
	COMPLETE:3,
};

/**任務進捗状況 */
var QUEST_PROGRESS_FLAG = {
	/** 空白(達成含) */
	NONE:0,
	/** 50%以上 */
	HALF:1,
	/** 80%以上 */
	EIGHTY:2,
};

/** マス */
var EVENT_ID = {
	/** 初期位置 */
	INITIAL_POSITION:0,
	/** 存在せず */
	NONE:1,
	/** 資源 */
	MATERIAL:2,
	/** 渦潮 */
	MAELSTROM:3,
	/** 通常戦闘 */
	NORMAL_BATTLE:4,
	/** ボス戦闘 */
	BOSS_BATTLE:5,
	/** 気のせいだった */
	BATTLE_AVOIDED:6,
	/** 航空戦or航空偵察 */
	AIR:7,
	/** 船団護衛成功 */
	ESCORT_SUCCESS:8,
	/** 揚陸地点 */
	LANDING_POINT:9,
	/** 空襲戦 */
	AIR_RAID_BATTLE:10,
};

/** 近代化改修 */
var POWERUP_FLAG = {
	/** 成功 */
	SUCCESS:1,
	/** 失敗 */
	FAILURE:0,
}

/** 遠征帰還 */
var CLEAR_RESULT = {
	/** 失敗 */
	FAILURE:0,
	/** 成功 */
	SUCESS:1,
	/** 大成功 */
	GREAT_SUCCESS:2,
};

/** 図鑑表示 */
var ITEM_TYPE1 = {
	/** 機銃 */
	AA_GUN:6,
};

/** カテゴリ */
var ITEM_TYPE2 = {
	/** 大口径主砲 */
	L_MAIN_GUN:3,
};

/** 装備ID */
var ITEM_ID = {
	/** 九七式艦攻 */
	TYPE97_TORPEDO_BOMBER:16,
	/** 九六式艦戦 */
	TYPE96_FIGHTER:19,
	/** 零式艦戦21型 */
	TYPE0_FIGHTER_MODEL21:20,
	/** 零式艦戦52型 */
	TYPE0_FIGHTER_MODEL52:21,
	/** 三式弾 */
	TYPE3_SHELL:35,
	/** 九一式徹甲弾 */
	TYPE91_AP_SHELL:36,
	/** ドラム缶(輸送用) */
	DRUM_CANISTERS:75,
	/** 零式艦戦21型(熟練) */
	TYPE0_FIGHTER_MODEL21_SKILLED:96,
	/** 九六式陸攻 */
	TYPE96_LAND_BASED_ATTACK_AIRCRAFT:168,
};

/** 艦娘ID */
var SHIP_ID = {
	/** 妙高 */
	MYOKO:62,
	/** 妙高改 */
	MYOKO_R:265,
	/** 妙高改二 */
	MYOKO_R2:319,
	/** 那智 */
	NACHI:63,
	/** 那智改 */
	NACHI_R:266,
	/** 那智改二 */
	NACHI_R2:192,
	/** 羽黒 */
	HAGURO:65,
	/** 羽黒改 */
	HAGURO_R:268,
	/** 羽黒改二 */
	HAGURO_R2:194,
	/** 鳳翔 */
	HOSHO:89,
	/** 鳳翔改 */
	HOSHO_R:285,
	/** 大和 */
	YAMATO:131,
	/** 大和改 */
	YAMATO_R:136,
	/** 武蔵 */
	MUSASHI:143,
	/** 武蔵改 */
	MUSASHI_R:148,
	/** 長門 */
	NAGATO:80,
	/** 長門改 */
	NAGATO_R:275,
	/** 陸奥 */
	MUTSU:81,
	/** 陸奥改 */
	MUTSU_R:276,
	/** 扶桑 */
	FUSO:26,
	/** 扶桑改 */
	FUSO_R:286,
	/** 扶桑改二 */
	FUSO_R2:411,
	/** 山城 */
	YAMASHIRO:27,
	/** 山城改 */
	YAMASHIRO_R:287,
	/** 山城改二 */
	YAMASHIRO_R2:412,
	/** 伊勢 */
	ISE:77,
	/** 伊勢改 */
	ISE_R:82,
	/** 日向 */
	HYUGA:87,
	/** 日向改 */
	HYUGA_R:88,
	/** Warspite */
	WARSPITE:439,
	/** Warspite改 */
	WARSPITE_R:364,
};

/** 任務ID */
var QUEST_ID = {
	/** 調整例外リスト */
	ADJUSTMENT_EXCEPTION_LIST:[214,605,606,607,608,626,643,645,854],
};

/** 
 * @Override
 * 通信データを処理します
 * 
 * @param type データの種類
 * @param data データ
 */
function update(type, data){
	var json = data.getJsonObject();

	switch(type){
		//任務
		case DataType.QUEST_LIST:
			updateCheck();
			if(json.api_data.api_list instanceof List){
				json.api_data.api_list.stream().filter(function(data){
					//Ver1.5.0修正箇所:ちゃんとフィルターが掛けられてなかったので修正
					return parseInt(data) != -1;
				}).forEach(function(data){
					var api_no = data.api_no.intValue();
					var api_state = data.api_state.intValue();
					var api_type = data.api_type.intValue();
					setState(api_no, api_state, api_type);
					var api_progress_flag = data.api_progress_flag.intValue();
					questCountAdjustment(api_no, api_progress_flag, api_type, api_state);
				});
			}
		//母港
		case DataType.PORT:
			var secretary = GlobalContext.getSecretary();
			//Ver1.5.0修正箇所:null回避
			if(secretary instanceof ShipDto){
				//精鋭「艦戦」隊の新編成
				if(canClear626() && !isMatchSecretary626(secretary)){
					setData("flg626", false);
					setData("cntScrapType96Fighter_626", 0);
					setData("cntScrapType0FighterModel21_626", 0);
				}
				//機種転換
				if(canClear628() && !isMatchSecretary628(secretary)){
					setData("flg628", false);
					setData("cnt628", 0);
				}
				//「熟練搭乗員」養成
				if(isMatchSecretary637(secretary)){
					if(getData("flg637")) setData("cnt637",getData("cnt637") + 1);
				} else {
					setData("cnt637", 0);
				}
			}
			var itemMap = GlobalContext.getItemMap();
			if(itemMap instanceof Map){
				//初期化
				setData("cntType97TorpedoBomber_643",0);
				setData("cntType96LandBasedAttackAircraft_643",0);
				setData("cntType91AP_Shell_645",0);
				setData("cntDrumCanisters_645",0);
				itemMap.entrySet().stream().map(function(item){
					return item.getValue();
				}).map(function(itemDto){
					return itemDto.slotitemId;
				}).forEach(function(slotitemId){
					switch(slotitemId){
						//主力「陸攻」の調達
						case ITEM_ID.TYPE97_TORPEDO_BOMBER: //九七式艦攻
							setData("cntType97TorpedoBomber_643", getData("cntType97TorpedoBomber_643") + 1);
							break;
						case ITEM_ID.TYPE96_LAND_BASED_ATTACK_AIRCRAFT: //九六式陸攻
							setData("cntType96LandBasedAttackAircraft_643", getData("cntType96LandBasedAttackAircraft_643") + 1);
							break;
						//「洋上補給」物資の調達
						case ITEM_ID.TYPE91_AP_SHELL: //九一式徹甲弾
							setData("cntType91AP_Shell_645", getData("cntType91AP_Shell_645") + 1);
							break;
						case ITEM_ID.DRUM_CANISTERS: //ドラム缶(輸送用)
							setData("cntDrumCanisters_645", getData("cntDrumCanisters_645") + 1);
						default:
							break;
					}
				});
			}
			break;
		//戦闘
		case DataType.START:
			//あ号作戦（出撃）(Ver1.3.9修正箇所)
			if(getData("flg214")) setData("cntSally214",getData("cntSally214") + 1);
		case DataType.NEXT:
			setData("mapAreaId",json.api_data.api_maparea_id.intValue());
			setData("mapInfoNo",json.api_data.api_mapinfo_no.intValue());
			setData("eventId",json.api_data.api_event_id.intValue());
			break;
		case DataType.BATTLE_RESULT:
		case DataType.COMBINED_BATTLE_RESULT:
			var lastBattleDto = GlobalContext.getLastBattleDto();
			var enemys = lastBattleDto.getEnemy();
			var nowEnemyHp = lastBattleDto.getNowEnemyHp();
			var ships = lastBattleDto.getDock().getShips();

			for(var i=0;i<enemys.size();i++){
				if(nowEnemyHp[i] == 0){
					switch(enemys[i].stype){
						case SHIP_TYPE.AOe: //補給艦
							//敵補給艦を３隻撃沈せよ！
							if(getData("flg218")) setData("cnt218",getData("cnt218") + 1);
							//敵輸送船団を叩け！
							if(getData("flg212")) setData("cnt212",getData("cnt212") + 1);
							//海上通商破壊作戦
							if(getData("flg213")) setData("cnt213",getData("cnt213") + 1);
							//ろ号作戦
							if(getData("flg221")) setData("cnt221",getData("cnt221") + 1);
							break;
						case SHIP_TYPE.CVL: //軽空母
						case SHIP_TYPE.CV:  //正規空母
							//敵空母を３隻撃沈せよ！
							if(getData("flg211")) setData("cnt211",getData("cnt211") + 1);
							//い号作戦
							if(getData("flg220")) setData("cnt220",getData("cnt220") + 1);
							break;
						case SHIP_TYPE.SS: //潜水艦
							//敵潜水艦を制圧せよ！
							if(getData("flg230")) setData("cnt230",getData("cnt230") + 1);
							//海上護衛戦
							if(getData("flg228")) setData("cnt228",getData("cnt228") + 1);
							break;
						default:
							break;
					}
				}
			}
			//あ号作戦（ボス到達）
			if(getData("eventId") == EVENT_ID.BOSS_BATTLE){
				if(getData("flg214")) setData("cntBoss214",getData("cntBoss214") + 1);
			}
			//敵艦隊主力を撃滅せよ！
			if(getData("flg216")) setData("cnt216",getData("cnt216") + 1);
			//敵艦隊を10回邀撃せよ！
			if(getData("flg210")) setData("cnt210",getData("cnt210") + 1);
			var winRank = json.api_data.api_win_rank.toString();
			if(winRank == "S"|| winRank == "A"|| winRank == "B"){
				//あ号作戦（S勝利）
				if(winRank == "S"){
					if(getData("flg214")) setData("cntSWin214",getData("cntSWin214") + 1);
				}
				//敵艦隊を撃滅せよ！
				if(getData("flg201")) setData("cnt201",getData("cnt201") + 1);

				if(getData("eventId") == EVENT_ID.BOSS_BATTLE){
					//あ号作戦（ボス勝利）
					if(getData("flg214")) setData("cntBossWin214",getData("cntBossWin214") + 1);
					switch(getData("mapAreaId")){
						case 1:
							//「水雷戦隊」南西へ！(Ver1.3.3)
							if(getData("mapInfoNo") == 4 && winRank == "S"){
								var cntCL = 0;
								var cntDD = 0;
								if(ships.get(0).stype == SHIP_TYPE.CL){
									ships.stream().map(function(ship){
										return ship.stype;
									}).forEach(function(stype){
										switch(stype){
											case SHIP_TYPE.DD:
												cntDD++;
												break;
											case SHIP_TYPE.CL:
												cntCL++;
												break;
											default:
												break;
										}
									});
									//軽巡3隻以下、駆逐1隻以上、軽巡と駆逐のみ
									if(cntCL < 4 && cntDD > 0 && ships.size() == (cntCL + cntDD)){
										if(getData("flg257")) setData("cnt257",getData("cnt257") + 1);
									}
								}
							}
							if(getData("mapInfoNo") == 5 && winRank != "B"){
								//海上輸送路の安全確保に努めよ！
								if(getData("flg261")) setData("cnt261",getData("cnt261") + 1);
								//海上護衛強化月間
								if(getData("flg265")) setData("cnt265",getData("cnt265") + 1);
							}
							break;
						case 2:
							//南西諸島海域の制海権を握れ！
							if(getData("flg226")) setData("cnt226",getData("cnt226") + 1);
							if(getData("mapInfoNo") == 4 && (winRank == "A" || winRank == "S")){
								//戦果拡張任務！「Z作戦」前段作戦
								if(getData("flg854")) setData("cnt854_2-4",getData("cnt854_2-4") + 1);
							}
							if(getData("mapInfoNo") == 4 && winRank == "S"){
								//沖ノ島海域迎撃戦
								if(getData("flg822")) setData("cnt822",getData("cnt822") + 1);
							}
							if(getData("mapInfoNo") == 5 && winRank == "S"){
								//「第五戦隊」出撃せよ！
								var check249 = 0;

								ships.stream().map(function(ship){
									return ship.shipId;
								}).forEach(function(shipId){
									switch(shipId){
										case SHIP_ID.MYOKO:
										case SHIP_ID.MYOKO_R:
										case SHIP_ID.MYOKO_R2:
										case SHIP_ID.NACHI:
										case SHIP_ID.NACHI_R:
										case SHIP_ID.NACHI_R2:
										case SHIP_ID.HAGURO:
										case SHIP_ID.HAGURO_R:
										case SHIP_ID.HAGURO_R2:
											check249++;
										default:
											break;
									}
								});
								if(check249 == 3){
									if(getData("flg249")) setData("cnt249",getData("cnt249") + 1);
								}

								//「水上反撃部隊」突入せよ！
								var cntCA = 0;
								var cntCL = 0;
								var cntDD = 0;

								if(ships.get(0).stype == SHIP_TYPE.DD){
									ships.stream().map(function(ship){
										return ship.stype;
									}).forEach(function(stype){
										switch(stype){
											case SHIP_TYPE.CA: //重巡洋艦
												cntCA++;
												break;
											case SHIP_TYPE.CL: //軽巡洋艦
												cntCL++;
												break;
											case SHIP_TYPE.DD: //駆逐艦
												cntDD++;
												break;
											default:
												break;
										}
									});
									if(cntCA == 1 && cntCL == 1 && cntDD == 4){
										if(getData("flg266")) setData("cnt266",getData("cnt266") + 1);
									}
								}
							}
							break;
						case 3:
							//敵北方艦隊主力を撃滅せよ！
							if(getData("mapInfoNo") >= 3){
								if(getData("flg241")) setData("cnt241",getData("cnt241") + 1);
							}
							break;
						case 4:
							//「空母機動部隊」西へ！
							if(getData("mapInfoNo") == 2 && winRank == "S"){
								var cntCV = 0;
								var cntDD = 0;
								ships.stream().map(function(ship){
									return ship.stype;
								}).forEach(function(stype){
									switch(stype){
										case SHIP_TYPE.CVL: //軽空母
										case SHIP_TYPE.CV:  //正規空母
										case SHIP_TYPE.ACV: //装甲空母
											cntCV++;
											break;
										case SHIP_TYPE.DD:  //駆逐艦
											cntDD++;
											break;
									}
								});
								if(cntCV == 2 && cntDD == 2){
									if(getData("flg264")) setData("cnt264",getData("cnt264") + 1);
								}
							}
							//敵東方艦隊を撃滅せよ！
							if(getData("flg229")) setData("cnt229",getData("cnt229") + 1);
							//敵東方中枢艦隊を撃破せよ！
							if(getData("mapInfoNo") == 4){
								if(getData("flg242")) setData("cnt242",getData("cnt242") + 1);
							}
							break;
						case 5:
							//「水上打撃部隊」南方へ！
							if(getData("mapInfoNo") == 1 && winRank == "S"){
								var cnt259 = 0;
								var cntCL = 0;

								ships.stream().filter(function(ship){
									return !(ship.shipId == SHIP_ID.WARSPITE || ship.shipId == SHIP_ID.WARSPITE_R); //運営式その場凌ぎ対応
								}).map(function(ship){
									return ship.stype;
								}).forEach(function(stype){
									switch(stype){
										case SHIP_TYPE.BB:  //戦艦
										case SHIP_TYPE.BSD: //超弩級戦艦
											cnt259++;
											break;
										case SHIP_TYPE.CL:  //軽巡洋艦
											cntCL++;
											break;
										default:
											break;
									}
								});
								if(cnt259 == 3 && cntCL == 1){
									if(getData("flg259")) setData("cnt259",getData("cnt259") + 1);
								}
							}
							//南方海域珊瑚諸島沖の制空権を握れ！
							if(getData("mapInfoNo") == 2 && winRank == "S"){
								if(getData("flg243")) setData("cnt243",getData("cnt243") + 1);
							}
							break;
						case 6:
							//「潜水艦隊」出撃せよ！
							if(getData("mapInfoNo") == 1 && winRank == "S"){
								if(getData("flg256")) setData("cnt256",getData("cnt256") + 1);
							}
							if(getData("mapInfoNo") == 1 && (winRank == "A" || winRank == "S")){
								//戦果拡張任務！「Z作戦」前段作戦
								if(getData("flg854")) setData("cnt854_6-1",getData("cnt854_6-1") + 1);
							}
							if(getData("mapInfoNo") == 3 && (winRank == "A" || winRank == "S")){
								//戦果拡張任務！「Z作戦」前段作戦
								if(getData("flg854")) setData("cnt854_6-3",getData("cnt854_6-3") + 1);
							}
							if(getData("mapInfoNo") == 4 && winRank == "S"){ // S勝利のみ(他の海域は不明)
								//戦果拡張任務！「Z作戦」前段作戦
								if(getData("flg854")) setData("cnt854_6-4",getData("cnt854_6-4") + 1);
							}
							break;
						default:
							break;
					}
				}
			}
			break;
		//開発
		case DataType.CREATE_ITEM:
			//新装備「開発」指令
			if(getData("flg605")) setData("cnt605",getData("cnt605") + 1);
			//装備「開発」集中強化！
			if(getData("flg607")) setData("cnt607",getData("cnt607") + 1);
			break;
		//建造
		case DataType.CREATE_SHIP:
			//新造艦「建造」指令
			if(getData("flg606")) setData("cnt606",getData("cnt606") + 1);
			//艦娘「建造」艦隊強化！
			if(getData("flg608")) setData("cnt608",getData("cnt608") + 1);
			break;
		//解体
		case DataType.DESTROY_SHIP:
			//軍縮条約対応！
			if(getData("flg609")) setData("cnt609",getData("cnt609") + 1);
			break;
		//廃棄
		case DataType.DESTROY_ITEM2:
			//資源の再利用
			if(getData("flg613")) setData("cnt613",getData("cnt613") + 1);

			var storedItemMap = getStoredItemMap();
			if(storedItemMap instanceof Map){
				var destroyItemMap = getDestroyItemMap(storedItemMap,GlobalContext.itemMap);
				var secretary = GlobalContext.secretary;
				
				//精鋭「艦戦」隊の新編成
				if(isMatchSecretary626(secretary)){
					destroyItemMap.entrySet().stream().map(function(item){
						return item.getValue();
					}).map(function(itemDto){
						return itemDto.slotitemId;
					}).forEach(function(slotitemId){
						switch(slotitemId){
							case ITEM_ID.TYPE96_FIGHTER:
								if(getData("flg626")) setData("cntScrapType96Fighter_626", getData("cntScrapType96Fighter_626") + 1);
								break;
							case ITEM_ID.TYPE0_FIGHTER_MODEL21:
								if(getData("flg626")) setData("cntScrapType0FighterModel21_626", getData("cntScrapType0FighterModel21_626") + 1);
								break;
							default:
								break;
						}
					});
				}
				//機種転換
				if(isMatchSecretary628(secretary)){
					destroyItemMap.entrySet().stream().map(function(item){
						return item.getValue();
					}).map(function(itemDto){
						return itemDto.slotitemId;
					}).forEach(function(slotitemId){
						switch(slotitemId){
							case ITEM_ID.TYPE0_FIGHTER_MODEL52:
								if(getData("flg628")) setData("cnt628", getData("cnt628") + 1);
								break;
							default:
								break;
						}
					});
				}
				//対空機銃量産
				destroyItemMap.entrySet().stream().map(function(item){
					return item.getValue();
				}).map(function(itemDto){
					return itemDto.type1;
				}).forEach(function(type1){
					switch(type1){
						case ITEM_TYPE1.AA_GUN:
							if(getData("flg638")) setData("cnt638", getData("cnt638") + 1);
							break;
						default:
							break;
					}
				});
				//新型艤装の継続研究
				destroyItemMap.entrySet().stream().map(function(item){
					return item.getValue();
				}).map(function(itemDto){
					return itemDto.type2;
				}).forEach(function(type2){
					switch(type2){
						case ITEM_TYPE2.L_MAIN_GUN:
							if(getData("flg663")) setData("cnt663", getData("cnt663") + 1);
							break;
						default:
							break;
					}
				});
				destroyItemMap.entrySet().stream().map(function(item){
					return item.getValue();
				}).map(function(itemDto){
					return itemDto.slotitemId;
				}).forEach(function(slotitemId){
					switch(slotitemId){
						//主力「陸攻」の調達
						case ITEM_ID.TYPE0_FIGHTER_MODEL21: //零式艦戦21型
							if(getData("flg643")) setData("cntScrapType0FighterModel21_643", getData("cntScrapType0FighterModel21_643") + 1);
							break;
						//「洋上補給」物資の調達
						case ITEM_ID.TYPE3_SHELL: //三式弾
							if(getData("flg645")) setData("cntScrapType3Shell_645", getData("cntScrapType3Shell_645") + 1);
							break;
						default:
							break;
					}
				});
			}
			break;
		//近代化改修
		case DataType.POWERUP:
			var powerup_flag = json.api_data.api_powerup_flag.intValue();
			if(powerup_flag == POWERUP_FLAG.SUCCESS){
				//艦の「近代化改修」を実施せよ！
				if(getData("flg702")) setData("cnt702",getData("cnt702") + 1);
				//「近代化改修」を進め、戦備を整えよ！
				if(getData("flg703")) setData("cnt703",getData("cnt703") + 1);
			}
			break;
		//遠征（帰還）
		case DataType.MISSION_RESULT:
			//0=失敗、1=成功、2=大成功
			var clear_result = json.api_data.api_clear_result.intValue();
			switch(clear_result){
				case CLEAR_RESULT.GREAT_SUCCESS: //大成功
				case CLEAR_RESULT.SUCESS: //成功
					var quest_name = json.api_data.api_quest_name.toString();

					//「遠征」を3回成功させよう！
					if(getData("flg402")) setData("cnt402",getData("cnt402") + 1);
					//「遠征」を10回成功させよう！
					if(getData("flg403")) setData("cnt403",getData("cnt403") + 1);
					//大規模遠征作戦、発令！
					if(getData("flg404")) setData("cnt404",getData("cnt404") + 1);
					if(quest_name.equals("海上護衛任務")){
						//輸送船団護衛を強化せよ！
						if(getData("flg424")) setData("cnt424",getData("cnt424") + 1);
					}
					//api_no渡してこないので仕方なく
					if(quest_name.indexOf("東京急行") > - 1){
						//南方への輸送作戦を成功させよ！
						if(getData("flg410")) setData("cnt410",getData("cnt410") + 1);
						//南方への鼠輸送を継続実施せよ!
						if(getData("flg411")) setData("cnt411",getData("cnt411") + 1);
					}
					break;
				default:
					break;
			}
			break;
		//補給
		case DataType.CHARGE:
			//艦隊酒保祭り！
			if(getData("flg504")) setData("cnt504",getData("cnt504") + 1);
			break;
		//入渠開始
		case DataType.NYUKYO_START:
			//艦隊大整備！
			if(getData("flg503")) setData("cnt503",getData("cnt503") + 1);
			break;
		//装備改修
		case DataType.REMODEL_SLOT:
			//装備の改修強化
			if(getData("flg619")) setData("cnt619",getData("cnt619") + 1);
			break;
		//演習
		case DataType.PRACTICE_BATTLE_RESULT:
			//「演習」で練度向上！
			if(getData("flg303")) setData("cnt303",getData("cnt303") + 1);
			var PwinRank = json.api_data.api_win_rank.toString();
			if(PwinRank == "S"|| PwinRank == "A"|| PwinRank == "B"){
				//「演習」で他提督を圧倒せよ！
				if(getData("flg304")) setData("cnt304",getData("cnt304") + 1);
				//大規模演習
				if(getData("flg302")) setData("cnt302",getData("cnt302") + 1);
				//精鋭艦隊演習(Ver1.4.0)
				if(getData("flg311")) setData("cnt311",getData("cnt311") + 1);
			}
			break;
		default:
			break;
	}
	//精鋭「艦戦」隊の新編成・機種転換用
	storeItemMap();
	//「洋上補給」物資の調達
	var material = GlobalContext.getMaterial();
	if(material instanceof MaterialDto){
		var fuel = material.getFuel();
		var ammo = material.getAmmo();
		var steel = material.getMetal();
		setData("cntFuel_645",fuel);
		setData("cntAmmo_645",ammo);
		setData("cntSteel_663",steel);
	}
	//任務一覧の更新
	ApplicationMain.main.getQuestTable().update();
}

/**
 * 廃棄した装備を取得する
 * 
 * @param oldItemMap 古いItemMap
 * @param newItemMap 新しいItemMap
 * @return {TreeMap} 廃棄した装備のItemMap
 */
function getDestroyItemMap(oldItemMap,newItemMap){
	var destroyItemMap = new TreeMap();
	oldItemMap.keySet().stream().filter(function(key){
		return !newItemMap.containsKey(key);
	}).forEach(function(key){
		destroyItemMap.put(key, oldItemMap.get(key));
	});
	return destroyItemMap;
}

/**
 * 最新のitemMapをScriptData内に保存します
 */
function storeItemMap(){
	setTmpData("itemMap",new TreeMap(GlobalContext.itemMap));
}

/**
 * 保存されたitemMapを取り出します
 * 
 * @return {ItemMap} 装備一覧
 */
function getStoredItemMap(){
	return getData("itemMap");
}

/**
 * 日付が変わって回数がリセットされたり、
 * バージョンアップで新任務が追加されてないかなどをチェックします
 */
function updateCheck() {
	//最後に取得した任務更新時刻
	var questLastUpdateTime = getData("questLastUpdateTime");
    /** タイムゾーン(任務が更新される05:00JSTに0:00になるタイムゾーン) */
 	var nowTime = Calendar.getInstance(TimeZone.getTimeZone("GMT+04:00"));
 	nowTime.setFirstDayOfWeek(Calendar.MONDAY);
	
	// 頻繁に更新するよう変更
	initializeMaxCount();
	if (questLastUpdateTime instanceof Calendar) {
		//バージョンを確認(バージョンが低い場合は値を色々更新)
		versionCheck();
		//デイリー
		updateCheckDaily(questLastUpdateTime, nowTime);
		//ウィークリー
		updateCheckWeekly(questLastUpdateTime, nowTime);
		//マンスリー
		updateCheckMonthly(questLastUpdateTime, nowTime);
		//クォータリー
		updateCheckQuarterly(questLastUpdateTime, nowTime);
	} else {
		initializeDailyCount();
		initializeWeeklyCount();
		initializeMonthlyCount();
		initializeQuarterlyCount();
	}
	setData("questLastUpdateTime",nowTime);
}

/** デイリーID */
var dailyIDs = [201,216,210,211,218,212,226,230,303,304,402,403,503,504,605,606,607,608,609,619,702];
/** ウイークリーID (あ号作戦(ID:214)は除外) */
var weeklyIDs = [220,213,221,228,229,241,242,243,261,302,404,410,411,703,613,638];
/** マンスリーID (精鋭「艦戦」隊の新編成(ID:626)と「洋上補給」物資の調達(ID:645)は除外) */
var monthlyIDs = [249,256,257,259,264,265,266,311,628,424];
/** クォータリーID(主力「陸攻」の調達(ID:643)と戦果拡張任務！「Z作戦」前段作戦(ID:854)は除外) */
var quarterlyIDs = [822,637,663];

/**
 * 任務の回数を初期化します(デイリー)
 */
function initializeDailyCount() {
	Arrays.stream(Java.to(dailyIDs,IntArrayType)).forEach(function(dailyID){
		setData("cnt"+ dailyID, 0);
		setData("flg"+ dailyID, false);
	});
	setData("cnt311",0); //精鋭艦隊演習
}

/**
 * 任務の回数を初期化します(ウイークリー)
 */
function initializeWeeklyCount() {
	Arrays.stream(Java.to(weeklyIDs,IntArrayType)).forEach(function(weeklyID){
		setData("cnt"+ weeklyID, 0);
		setData("flg"+ weeklyID, false);
	});
	//あ号作戦
	setData("flg214",false);
	setData("cntSally214", 0);
	setData("cntSWin214", 0);
	setData("cntBoss214", 0);
	setData("cntBossWin214", 0);
}

/**
 * 任務の回数を初期化します(マンスリー)
 */
function initializeMonthlyCount() {
	Arrays.stream(Java.to(monthlyIDs,IntArrayType)).forEach(function(monthlyID){
		setData("cnt"+ monthlyID, 0);
		setData("flg"+ monthlyID, false);
	});
	//精鋭「艦戦」隊の新編成
	setData("flg626",false);
	setData("cntScrapType96Fighter_626",0);
	setData("cntScrapType0FighterModel21_626",0);
	//「洋上補給」物資の調達
	setData("flg645",false);
	setData("cntScrapType3Shell_645",0);
	//setData("cntFuel_645",0);
	//setData("cntAmmo_645",0);
	//setData("cntType91AP_Shell_645",0);
	//setData("cntDrumCanisters_645",0);
}

/**
 * 任務の回数を初期化します(クォータリー)
 */
function initializeQuarterlyCount() {
	Arrays.stream(Java.to(quarterlyIDs,IntArrayType)).forEach(function(quarterlyID){
		setData("cnt"+ quarterlyID, 0);
		setData("flg"+ quarterlyID, false);
	});
	//主力「陸攻」の調達
	setData("cntScrapType0FighterModel21_643",0);
	//setData("cntType97TorpedoBomber_643",0);
	//setData("cntType96LandBasedAttackAircraft_643",0);
	//戦果拡張任務！「Z作戦」前段作戦
	setData("cnt854_2-4",0);
	setData("cnt854_6-1",0);
	setData("cnt854_6-3",0);
	setData("cnt854_6-4",0);
}

/**
 * 任務更新判定(デイリー)
 * 
 * @param questLastUpdateTime 最後に任務が更新された時間
 * @param nowTime 現在の時間
 */
function updateCheckDaily(questLastUpdateTime, nowTime) {
	if (nowTime.get(Calendar.DAY_OF_YEAR) != questLastUpdateTime.get(Calendar.DAY_OF_YEAR)) {
		initializeDailyCount();
	}
}

/**
 * 任務更新判定(ウイークリー)
 * 
 * @param questLastUpdateTime 最後に任務が更新された時間
 * @param nowTime 現在の時間
 */
function updateCheckWeekly(questLastUpdateTime, nowTime) {
	if (nowTime.get(Calendar.WEEK_OF_YEAR) != questLastUpdateTime.get(Calendar.WEEK_OF_YEAR)) {
		initializeWeeklyCount();
	}
}

/**
 * 任務更新判定(マンスリー)
 * 
 * @param questLastUpdateTime 最後に任務が更新された時間
 * @param nowTime 現在の時間
 */
function updateCheckMonthly(questLastUpdateTime, nowTime) {
	if (nowTime.get(Calendar.MONTH) != questLastUpdateTime.get(Calendar.MONTH)) {
		initializeMonthlyCount();
	}
}

/**
 * 任務更新判定(クォータリー)
 * 
 * @param questLastUpdateTime 最後に任務が更新された時間
 * @param nowTime 現在の時間
 */
function updateCheckQuarterly(questLastUpdateTime, nowTime) {
	var season = function(month){
		switch(month){
			case Calendar.MARCH:
			case Calendar.APRIL:
			case Calendar.MAY:
				return 0;
			case Calendar.JUNE:
			case Calendar.JULY:
			case Calendar.AUGUST:
				return 1;
			case Calendar.SEPTEMBER:
			case Calendar.OCTOBER:
			case Calendar.NOVEMBER:
				return 2;
			case Calendar.DECEMBER:
			case Calendar.JANUARY:
			case Calendar.FEBRUARY:
				return 3;
			default:
				return -1;
		}
	};
	if (season(nowTime.get(Calendar.MONTH)) != season(questLastUpdateTime.get(Calendar.MONTH))) {
		initializeQuarterlyCount();
	}
}

/** 
 * 任務の遂行状態を変更します
 * 
 * @param questNo 任務ID
 * @param questState 遂行状態
 * @param questType 任務の種類
 */
function setState(questNo ,questState, questType) {
	if (questType != QUEST_TYPE.ONCE) { //1回限りは除外
		setData("flg"+ questNo,questState == QUEST_STATE.DOING);
	}
}

/**
 * 任務クリアに必要な値を設定します
 * api_noはAndanteさんのソースとスレの情報を参考にしています
 */
function initializeMaxCount(){
	/* デイリー */
	//敵艦隊を撃滅せよ！
	setData("max201",1);
	//敵艦隊主力を撃滅せよ！
	setData("max216",1);
	//敵艦隊を10回邀撃せよ！
	setData("max210",10);
	//敵空母を３隻撃沈せよ！
	setData("max211",3);
	//敵補給艦を３隻撃沈せよ！
	setData("max218",3);
	//敵輸送船団を叩け！
	setData("max212",5);
	//南西諸島海域の制海権を握れ！
	setData("max226",5);
	//敵潜水艦を制圧せよ！
	setData("max230",6);
	//「演習」で練度向上！
	setData("max303",3);
	//「演習」で他提督を圧倒せよ！
	setData("max304",5);
	//「遠征」を3回成功させよう！
	setData("max402",3);
	//「遠征」を10回成功させよう！
	setData("max403",10);
	//艦隊大整備！
	setData("max503",5);
	//艦隊酒保祭り！
	setData("max504",15);
	//新装備「開発」指令
	setData("max605",1);
	//新造艦「建造」指令
	setData("max606",1);
	//装備「開発」集中強化！
	setData("max607",3);
	//艦娘「建造」艦隊強化！
	setData("max608",3);
	//軍縮条約対応！
	setData("max609",2);
	//装備の改修強化
	setData("max619",1);
	//艦の「近代化改修」を実施せよ！
	setData("max702",2);
	/* ウィークリー */
	//あ号作戦
	setData("maxSally214",36);
	setData("maxSWin214",6);
	setData("maxBoss214",24);
	setData("maxBossWin214",12);
	//い号作戦
	setData("max220",20);
	//海上通商破壊作戦
	setData("max213",20);
	//ろ号作戦
	setData("max221",50);
	//海上護衛戦
	setData("max228",15);
	//敵東方艦隊を撃滅せよ！
	setData("max229",12);
	//敵北方艦隊主力を撃滅せよ！
	setData("max241",5);
	//敵東方中枢艦隊を撃破せよ！
	setData("max242",1);
	//南方海域珊瑚諸島沖の制空権を握れ！
	setData("max243",2);
	//海上輸送路の安全確保に努めよ！
	setData("max261",3);
	//大規模演習
	setData("max302",20);
	//大規模遠征作戦、発令！
	setData("max404",30);
	//南方への輸送作戦を成功させよ！
	setData("max410",1);
	//南方への鼠輸送を継続実施せよ!
	setData("max411",6);
	//「近代化改修」を進め、戦備を整えよ！
	setData("max703",15);
	//資源の再利用
	setData("max613",24);
	//対空機銃量産
	setData("max638",6);
	/* マンスリー */
	//「第五戦隊」出撃せよ！
	setData("max249",1);
	//「潜水艦隊」出撃せよ！
	setData("max256",3);
	//「水雷戦隊」南西へ！
	setData("max257",1);
	//「水上打撃部隊」南方へ！
	setData("max259",1);
	//「空母機動部隊」西へ！(ver1.2.7)
	setData("max264",1);
	//海上護衛強化月間(ver1.2.7)
	setData("max265",10);
	//「水上反撃部隊」突入せよ！
	setData("max266",1);
	//精鋭艦隊演習(Ver1.4.0)
	setData("max311",7);
	//精鋭「艦戦」隊の新編成(Ver1.4.1)
	setData("maxScrapType96Fighter_626",1);
	setData("maxScrapType0FighterModel21_626",2);
	//機種転換
	setData("max628",2);
	//「洋上補給」物資の調達
	setData("maxScrapType3Shell_645",1);
	setData("maxFuel_645",750);
	setData("maxAmmo_645",750);
	setData("maxType91AP_Shell_645",1);
	setData("maxDrumCanisters_645",2);
	//輸送船団護衛を強化せよ！
	setData("max424",4);
	/* クォータリー */
	//沖ノ島海域迎撃戦
	setData("max822",2);
	//「熟練搭乗員」養成
	setData("max637",1);
	//主力「陸攻」の調達
	setData("maxScrapType0FighterModel21_643",2);
	setData("maxType97TorpedoBomber_643",2);
	setData("maxType96LandBasedAttackAircraft_643",1);
	//戦果拡張任務！「Z作戦」前段作戦
	setData("max854_2-4",1);
	setData("max854_6-1",1);
	setData("max854_6-3",1);
	setData("max854_6-4",1);
	//新型艤装の継続研究
	setData("max663",10);
	setData("maxSteel_663",18000);
}

/** 
 * 回数のズレを調整します
 * 
 * @param questNo 任務ID
 * @param questProgressFlag 進捗フラグ
 * @param questType 任務の種類
 * @param questState 遂行状態
 */
function questCountAdjustment(questNo, questProgressFlag, questType, questState){
	//1回限り、あ号作戦、開発系、建造系、精鋭「艦戦」隊の新編成は除外
	if(questType != QUEST_TYPE.ONCE && !isQuestCountAdjustmentException(questNo)){
		switch(questProgressFlag){
			case QUEST_PROGRESS_FLAG.HALF: //50%以上
				//カウンタが50%を下回ってるのに、「50%以上」表示になっていたら
				if(getData("cnt" + questNo) < Math.ceil(getData("max" + questNo) * 0.5)){
					//maxの値を半分にして切り上げ
					setData("cnt" + questNo,Math.ceil(getData("max" + questNo) * 0.5));
				//カウンタが80%を超えているのに、「50%以上」表示になっていたら
				} else if(getData("cnt" + questNo) > Math.ceil(getData("max" + questNo) * 0.8)){
					//maxの値を80%したやつを-1する
					setData("cnt" + questNo,Math.ceil(getData("max" + questNo) * 0.8) - 1);
				}
				break;
			case QUEST_PROGRESS_FLAG.EIGHTY: //80%以上
				//カウンタが80%を下回ってるのに、「80%以上」表示になっていたら
				if(getData("cnt" + questNo) < Math.ceil(getData("max" + questNo) * 0.8)){
					//maxの値を80%にして切り上げ
					setData("cnt" + questNo,Math.ceil(getData("max" + questNo) * 0.8));
				//カウンタが100%を超えたのに、「80%以上」表示になっていたら
				} else if(getData("cnt" + questNo) >= getData("max" + questNo)){
					//maxの値を-1
					setData("cnt" + questNo,getData("max" + questNo) - 1);
				}
				break;
			default: //それ以外
				switch(questState){
					case QUEST_STATE.NOT_ORDER: //未受注
					case QUEST_STATE.DOING: //遂行中
						//カウンタが50%を超えたのに「50%以上」とかの表示がなかったら
						if(getData("cnt" + questNo) >= Math.ceil(getData("max" + questNo) * 0.5)){
							//maxの値を半分にしたやつを-1する
							setData("cnt" + questNo,Math.ceil(getData("max" + questNo) * 0.5) - 1);
						}
						break;
					case QUEST_STATE.COMPLETE: //達成
						//maxの値に合わせる
						setData("cnt" + questNo,getData("max" + questNo));
						break;
					default:
						break;
				}
				break;
		}
	}
}

/**
 * 新しい任務追加した際に、-1となるのを防ぎます
 * バージョンアップ時に使用
 */
function updateCount(){
	Arrays.stream(Java.to(dailyIDs,IntArrayType)).filter(function(dailyID){
		return getData("cnt" + dailyID) == null   || getData("cnt" + dailyID) < 0;
	}).forEach(function(dailyID){
		setData("cnt"+ dailyID, 0);
	});
	Arrays.stream(Java.to(weeklyIDs,IntArrayType)).filter(function(weeklyID){
		return getData("cnt" + weeklyID) == null  || getData("cnt" + weeklyID) < 0;
	}).forEach(function(weeklyID){
		setData("cnt"+ weeklyID, 0);
	});
	Arrays.stream(Java.to(monthlyIDs,IntArrayType)).filter(function(monthlyID){
		return getData("cnt" + monthlyID) == null || getData("cnt" + monthlyID) < 0;
	}).forEach(function(monthlyID){
		setData("cnt"+ monthlyID, 0);
	});
	Arrays.stream(Java.to(quarterlyIDs,IntArrayType)).filter(function(quarterlyID){
		return getData("cnt" + quarterlyID) == null || getData("cnt" + quarterlyID) < 0;
	}).forEach(function(quarterlyID){
		setData("cnt"+ quarterlyID, 0);
	});
	//精鋭艦隊演習
	if(getData("cnt311") == null || getData("cnt311") < 0) setData("cnt311", 0);
	//あ号作戦
	if(getData("cntSally214")   == null || getData("cntSally214") < 0)   setData("cntSally214", 0);
	if(getData("cntSWin214")    == null || getData("cntSWin214") < 0)    setData("cntSWin214", 0);
	if(getData("cntBoss214")    == null || getData("cntBoss214") < 0)    setData("cntBoss214", 0);
	if(getData("cntBossWin214") == null || getData("cntBossWin214") < 0) setData("cntBossWin214", 0);
	//精鋭「艦戦」隊の新編成
	if(getData("cntScrapType96Fighter_626") == null       || getData("cntScrapType96Fighter_626") < 0)       setData("cntScrapType96Fighter_626",0);
	if(getData("cntScrapType0FighterModel21_626") == null || getData("cntScrapType0FighterModel21_626") < 0) setData("cntScrapType0FighterModel21_626",0);
	//主力「陸攻」の調達
	if(getData("cntScrapType0FighterModel21_643")      == null || getData("cntScrapType0FighterModel21_643") < 0)      setData("cntScrapType0FighterModel21_643",0);
	if(getData("cntType97TorpedoBomber_643")           == null || getData("cntType97TorpedoBomber_643") < 0)           setData("cntType97TorpedoBomber_643",0);
	if(getData("cntType96LandBasedAttackAircraft_643") == null || getData("cntType96LandBasedAttackAircraft_643") < 0) setData("cntType96LandBasedAttackAircraft_643",0);
	//「洋上補給」物資の調達
	if(getData("cntScrapType3Shell_645") == null || getData("cntScrapType3Shell_645") < 0) setData("cntScrapType3Shell_645",0);
	if(getData("cntFuel_645")            == null || getData("cntFuel_645") < 0)            setData("cntFuel_645",0);
	if(getData("cntAmmo_645")            == null || getData("cntAmmo_645") < 0)            setData("cntAmmo_645",0);
	if(getData("cntType91AP_Shell_645")  == null || getData("cntType91AP_Shell_645") < 0)  setData("cntType91AP_Shell_645",0);
	if(getData("cntDrumCanisters_645")   == null || getData("cntDrumCanisters_645") < 0)   setData("cntDrumCanisters_645",0);
	//戦果拡張任務！「Z作戦」前段作戦
	if(getData("cnt854_2-4") == null || getData("cnt854_2-4") < 0) setData("cnt854_2-4",0);
	if(getData("cnt854_6-1") == null || getData("cnt854_6-1") < 0) setData("cnt854_6-1",0);
	if(getData("cnt854_6-3") == null || getData("cnt854_6-3") < 0) setData("cnt854_6-3",0);
	if(getData("cnt854_6-4") == null || getData("cnt854_6-4") < 0) setData("cnt854_6-4",0);
	//任務クリアに必要な値を更新
	initializeMaxCount();
}

/** 
 * バージョンをチェックします
 * もしバージョンを下回っていた場合は、任務の回数をアップデートします
 */
function versionCheck(){
	if(getData("version") == null || getData("version") < VERSION){
		updateCount();
	}
	setData("version",VERSION);
}

/**
 * 任務がクリア可能状態かを返します(ID:626)
 * @return {boolean} クリア可能状態ならtrue
 */
function canClear626(){
	return getData("flg626") != null && getData("cntScrapType96Fighter_626") >= getData("maxScrapType96Fighter_626") && getData("cntScrapType0FighterModel21_626") >= getData("maxScrapType0FighterModel21_626");
}

/**
 * 任務がクリア可能状態かを返します(ID:628)
 * @return {boolean} クリア可能状態ならtrue
 */
function canClear628(){
	return getData("flg628") != null && getData("cnt628") >= getData("max628");
}

/**
 * 秘書艦が任務(ID:626)の条件と一致しているか
 * 
 * @param secretary 秘書艦
 * @return {boolean} 一致しているならtrue
 */
function isMatchSecretary626(secretary){
	switch(secretary.shipId){
		case SHIP_ID.HOSHO:
		case SHIP_ID.HOSHO_R:
			return secretary.getItem2().stream().filter(function(itemDto){
				return itemDto instanceof ItemDto;
			}).anyMatch(function(itemDto){
				return itemDto.slotitemId == ITEM_ID.TYPE0_FIGHTER_MODEL21 && itemDto.alv == MAX_ALV;
			});
		default:
			return false;
	}
}

/**
 * 秘書艦が任務(ID:628)の条件と一致しているか
 * 
 * @param secretary 秘書艦
 * @return {boolean} 一致しているならtrue
 */
function isMatchSecretary628(secretary){
	switch(secretary.stype){
		case SHIP_TYPE.CVL:
		case SHIP_TYPE.CV:
		case SHIP_TYPE.ACV:
			return secretary.getItem2().stream().filter(function(itemDto){
				return itemDto instanceof ItemDto;
			}).anyMatch(function(itemDto){
				return itemDto.slotitemId == ITEM_ID.TYPE0_FIGHTER_MODEL21_SKILLED && itemDto.alv == MAX_ALV;
			});
		default:
			return false;
	}
}

/**
 * 秘書艦が任務(ID:637)の条件と一致しているか
 * 
 * @param secretary 秘書艦
 * @return {boolean} 一致しているならtrue
 */
function isMatchSecretary637(secretary){
	switch(secretary.shipId){
		case SHIP_ID.HOSHO:
		case SHIP_ID.HOSHO_R:
			return secretary.getItem2().stream().filter(function(itemDto){
				return itemDto instanceof ItemDto;
			}).anyMatch(function(itemDto){
				return itemDto.slotitemId == ITEM_ID.TYPE96_FIGHTER && itemDto.alv == MAX_ALV && itemDto.level == MAX_LV;
			});
		default:
			return false;
	}
}

/**
 * 任務回数の調整例外IDに入っているか
 * 
 * @param questID 任務ID
 * @return {boolean} 例外IDならtrue
 */
function isQuestCountAdjustmentException(questID){
	return Arrays.stream(Java.to(QUEST_ID.ADJUSTMENT_EXCEPTION_LIST,IntArrayType)).anyMatch(function(excetipnQuestID){
		return questID == excetipnQuestID;
	});
}

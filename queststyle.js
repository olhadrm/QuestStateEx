//ver1.7.3β
//Author: Nishisonic
//        Nekopanda

load("script/utils.js");
load("script/ScriptData.js");
data_prefix = "questStateEx_";

IntStream          = Java.type("java.util.stream.IntStream");

Composite          = Java.type("org.eclipse.swt.widgets.Composite");
GridLayout         = Java.type("org.eclipse.swt.layout.GridLayout");
Group              = Java.type("org.eclipse.swt.widgets.Group");
Label              = Java.type("org.eclipse.swt.widgets.Label");
Listener           = Java.type("org.eclipse.swt.widgets.Listener");
RGB                = Java.type("org.eclipse.swt.graphics.RGB");
SelectionAdapter   = Java.type("org.eclipse.swt.events.SelectionAdapter");
Shell              = Java.type("org.eclipse.swt.widgets.Shell");
Slider             = Java.type("org.eclipse.swt.widgets.Slider");
SWT                = Java.type("org.eclipse.swt.SWT");
SWTResourceManager = Java.type("org.eclipse.wb.swt.SWTResourceManager");
TableItem          = Java.type("org.eclipse.swt.widgets.TableItem");

AppConstants       = Java.type("logbook.constants.AppConstants");
ApplicationMain    = Java.type("logbook.gui.ApplicationMain");
ReportUtils        = Java.type("logbook.util.ReportUtils");

var stateIndex = -1;
var categoryIndex = -1;
var progressIndex = -1;
function begin(header) {
    for (var i = 1; i < header.length; ++i) {
        if (header[i].equals("表示位置")) {
            stateIndex = i;
        }
        if (header[i].equals("分類")) {
            categoryIndex = i;
        }
        if (header[i].equals("進捗詳細")) {
            progressIndex = i;
        }
    }
}

function categoryColor(category) {
	switch (category) {
		case 1:		//編成
			return new RGB( 0xAA, 0xFF, 0xAA );
		case 2:		//出撃
			return new RGB( 0xFF, 0xCC, 0xCC );
		case 3:		//演習
			return new RGB( 0xDD, 0xFF, 0xAA );
		case 4:		//遠征
			return new RGB( 0xCC, 0xFF, 0xFF );
		case 5:		//補給/入渠
			return new RGB( 0xFF, 0xFF, 0xCC );
		case 6:		//工廠
			return new RGB( 0xDD, 0xCC, 0xBB );
		case 7:		//改装
			return new RGB( 0xDD, 0xCC, 0xFF );
		case 8:		//出撃
			return new RGB( 0xFF, 0xCC, 0xCC );
		default:
			return new RGB( 0xFF, 0xFF, 0xFF );
	}
}

function progressColor(rate) {
	if ( rate < 0.5 ) {
		return new RGB( 0xFF, 0x88, 0x00 );
	}
	else if ( rate < 0.8 ) {
		return new RGB( 0x00, 0xCC, 0x00 );
	}
	else if ( rate < 1.0 ) {
		return new RGB( 0x00, 0x88, 0x00 );
	}
	else {
		return new RGB( 0x00, 0x88, 0xFF );
	}
}

var paintHandler = new Listener({
	handleEvent: function(event) {
		var gc = event.gc;
		var old = gc.background;
		var d = event.item.data;
		var backcolor = null;
		// 背景を描く
		if(event.index == categoryIndex) {
			backcolor = d.cat;
		}
		else if(event.index == stateIndex) {
			backcolor = d.state;
		}
		if(backcolor == null) {
			backcolor = d.back;
		}
		if(backcolor != null) {
			gc.background = backcolor;
			gc.fillRectangle(event.x, event.y, event.width, event.height);
		}
		// 進捗を描く
		if(event.index == progressIndex) {
			if(d.prog != null) {
				gc.background = d.prog;
				// バーを下 1/5 に表示する
				var y = event.y + event.height * 4 / 5;
				// はみ出した部分はクリッピングされるので高さはそのままでいい
				gc.fillRectangle(event.x, y, event.width * d.rate, event.height);
			}
		}
		gc.background = old;
		event.detail &= ~SWT.BACKGROUND;
	}
});

function setTableListener(table){
	listener = getData("phandler");
	if(listener != null) {
		table.removeListener(SWT.EraseItem, listener);
	}
	table.addListener(SWT.EraseItem, paintHandler);
	setTmpData("phandler", paintHandler);
}

function create(table, data, index) {
	if(index == 0) setTableListener(table);

    var item = new TableItem(table, SWT.NONE);
    item.setText(ReportUtils.toStringArray(data));

    var quest = data[0].get();
	var d = { state: null, back: null, cat: null, prog: null, quest: quest };

    // 偶数行に背景色を付ける
    if ((index % 2) != 0) {
	//	d.back = SWTResourceManager.getColor(AppConstants.ROW_BACKGROUND);
    }

	// 遂行中はハイライト DC
	var state = parseInt(quest.json.api_state);
	if(state == 2 || state == 3) {
		d.state = SWTResourceManager.getColor(new RGB(255, 215, 0));
	}

    // 分類
	var catcolor = categoryColor(parseInt(quest.json.api_category));
    d.cat = SWTResourceManager.getColor(catcolor);

	// 進捗
	d.rate = getData("rate" + quest.no);
	if(d.rate != null && d.rate >= 0) {
		d.prog = SWTResourceManager.getColor(progressColor(d.rate));
	}

	item.setData(d);

	if(!getData("set")){
		table.addSelectionListener(new SelectionAdapter({
			widgetDefaultSelected : function(event){
				var questNo = event.item.data.quest.no;
				if(getData("flg" + questNo) != null){
					var tip = new Shell(table.getShell(), SWT.DIALOG_TRIM | SWT.APPLICATION_MODAL);
					tip.setLayout(new GridLayout(1,false));
					tip.setText("進捗回数変更");
					tip.setBackground(event.item.data.cat);

					switch(questNo){
						case 214: //あ号作戦
							var group = new Group (tip, SWT.NONE);
							group.setLayout(new GridLayout(4,false));
							group.setText(event.item.data.quest.title);
							group.setBackground(event.item.data.cat);

							var infoLabel = new Label(group,SWT.NONE);
							infoLabel.setText("出撃:");
							infoLabel.setLocation(0, 0);
							infoLabel.setBackground(event.item.data.cat);

							var slider = new Slider(group,SWT.NONE);
							slider.setMinimum(0);
							slider.setSelection(getData("cntSally214"));
							slider.setMaximum(getData("maxSally214") + 10); //こうしないと正しい最大値にならない
							slider.setIncrement(1);

							var space = new Label(group,SWT.NONE);
							space.setText(" ");
							space.setBackground(event.item.data.cat);

							var composite = new Composite (group, SWT.BORDER);
							composite.setLayout(new GridLayout(3,false));
							composite.setBackground(event.item.data.cat);

							var cntLabel = new Label(composite,SWT.NONE);
							cntLabel.setAlignment(SWT.RIGHT);
							cntLabel.setText(prefix(getData("cntSally214"),2));
							cntLabel.setBackground(event.item.data.cat);

							var sepLabel = new Label(composite,SWT.NONE);
							sepLabel.setText(" / ");
							sepLabel.setBackground(event.item.data.cat);

							var maxLabel = new Label(composite,SWT.NONE);
							maxLabel.setAlignment(SWT.RIGHT);
							maxLabel.setText(prefix(getData("maxSally214"),2));
							maxLabel.setBackground(event.item.data.cat);

							slider.addSelectionListener(new SelectionAdapter({
								widgetSelected:function(e){
									cntLabel.setText(prefix(slider.getSelection().toString(),2));
								}
							}));

							var infoLabel2 = new Label(group,SWT.NONE);
							infoLabel2.setText("S勝利:");
							infoLabel2.setLocation(0, 0);
							infoLabel2.setBackground(event.item.data.cat);

							var slider2 = new Slider(group,SWT.NONE);
							slider2.setMinimum(0);
							slider2.setSelection(getData("cntSWin214"));
							slider2.setMaximum(getData("maxSWin214") + 10); //こうしないと正しい最大値にならない
							slider2.setIncrement(1);

							var space2 = new Label(group,SWT.NONE);
							space2.setText(" ");
							space2.setBackground(event.item.data.cat);

							var composite2 = new Composite (group, SWT.BORDER);
							composite2.setLayout(new GridLayout(3,false));
							composite2.setBackground(event.item.data.cat);

							var cntLabel2 = new Label(composite2,SWT.NONE);
							cntLabel2.setAlignment(SWT.RIGHT);
							cntLabel2.setText(prefix(getData("cntSWin214"),2));
							cntLabel2.setBackground(event.item.data.cat);

							var sepLabel2 = new Label(composite2,SWT.NONE);
							sepLabel2.setText(" / ");
							sepLabel2.setBackground(event.item.data.cat);

							var maxLabel2 = new Label(composite2,SWT.NONE);
							maxLabel2.setAlignment(SWT.RIGHT);
							maxLabel2.setText(prefix(getData("maxSWin214"),2));
							maxLabel2.setBackground(event.item.data.cat);

							slider2.addSelectionListener(new SelectionAdapter({
								widgetSelected:function(e){
									cntLabel2.setText(prefix(slider2.getSelection().toString(),2));
								}
							}));

							var infoLabel3 = new Label(group,SWT.NONE);
							infoLabel3.setText("ボス戦:");
							infoLabel3.setLocation(0, 0);
							infoLabel3.setBackground(event.item.data.cat);

							var slider3 = new Slider(group,SWT.NONE);
							slider3.setMinimum(0);
							slider3.setSelection(getData("cntBoss214"));
							slider3.setMaximum(getData("maxBoss214") + 10); //こうしないと正しい最大値にならない
							slider3.setIncrement(1);

							var space3 = new Label(group,SWT.NONE);
							space3.setText(" ");
							space3.setBackground(event.item.data.cat);

							var composite3 = new Composite (group, SWT.BORDER);
							composite3.setLayout(new GridLayout(3,false));
							composite3.setBackground(event.item.data.cat);

							var cntLabel3 = new Label(composite3,SWT.NONE);
							cntLabel3.setAlignment(SWT.RIGHT);
							cntLabel3.setText(prefix(getData("cntBoss214"),2));
							cntLabel3.setBackground(event.item.data.cat);

							var sepLabel3 = new Label(composite3,SWT.NONE);
							sepLabel3.setText(" / ");
							sepLabel3.setBackground(event.item.data.cat);

							var maxLabel3 = new Label(composite3,SWT.NONE);
							maxLabel3.setAlignment(SWT.RIGHT);
							maxLabel3.setText(prefix(getData("maxBoss214"),2));
							maxLabel3.setBackground(event.item.data.cat);

							slider3.addSelectionListener(new SelectionAdapter({
								widgetSelected:function(e){
									cntLabel3.setText(prefix(slider3.getSelection().toString(),2));
								}
							}));

							var infoLabel4 = new Label(group,SWT.NONE);
							infoLabel4.setText("ボス勝利:");
							infoLabel4.setLocation(0, 0);
							infoLabel4.setBackground(event.item.data.cat);

							var slider4 = new Slider(group,SWT.NONE);
							slider4.setMinimum(0);
							slider4.setSelection(getData("cntBossWin214"));
							slider4.setMaximum(getData("maxBossWin214") + 10); //こうしないと正しい最大値にならない
							slider4.setIncrement(1);

							var space4 = new Label(group,SWT.NONE);
							space4.setText(" ");
							space4.setBackground(event.item.data.cat);

							var composite4 = new Composite (group, SWT.BORDER);
							composite4.setLayout(new GridLayout(3,false));
							composite4.setBackground(event.item.data.cat);

							var cntLabel4 = new Label(composite4,SWT.NONE);
							cntLabel4.setAlignment(SWT.RIGHT);
							cntLabel4.setText(prefix(getData("cntBossWin214"),2));
							cntLabel4.setBackground(event.item.data.cat);

							var sepLabel4 = new Label(composite4,SWT.NONE);
							sepLabel4.setText(" / ");
							sepLabel4.setBackground(event.item.data.cat);

							var maxLabel4 = new Label(composite4,SWT.NONE);
							maxLabel4.setAlignment(SWT.RIGHT);
							maxLabel4.setText(prefix(getData("maxBossWin214"),2));
							maxLabel4.setBackground(event.item.data.cat);

							slider4.addSelectionListener(new SelectionAdapter({
								widgetSelected:function(e){
									cntLabel4.setText(prefix(slider4.getSelection().toString(),2));
								}
							}));

							tip.addDisposeListener(function(e){
								setData("cntSally214",cntLabel.getText()|0);
								setData("cntSWin214",cntLabel2.getText()|0);
								setData("cntBoss214",cntLabel3.getText()|0);
								setData("cntBossWin214",cntLabel4.getText()|0);
								ApplicationMain.main.getQuestTable().update();
							});
							break;
						case 626: //精鋭「艦戦」隊の新編成
							var group = new Group (tip, SWT.NONE);
							group.setLayout(new GridLayout(4,false));
							group.setText(event.item.data.quest.title);
							group.setBackground(event.item.data.cat);

							var infoLabel = new Label(group,SWT.NONE);
							infoLabel.setText("96式:");
							infoLabel.setLocation(0, 0);
							infoLabel.setBackground(event.item.data.cat);

							var slider = new Slider(group,SWT.NONE);
							slider.setMinimum(0);
							slider.setSelection(getData("cntScrapType96Fighter_626"));
							slider.setMaximum(getData("maxScrapType96Fighter_626") + 10); //こうしないと正しい最大値にならない
							slider.setIncrement(1);

							var space = new Label(group,SWT.NONE);
							space.setText(" ");
							space.setBackground(event.item.data.cat);

							var composite = new Composite (group, SWT.BORDER);
							composite.setLayout(new GridLayout(3,false));
							composite.setBackground(event.item.data.cat);

							var cntLabel = new Label(composite,SWT.NONE);
							cntLabel.setAlignment(SWT.RIGHT);
							cntLabel.setText(prefix(getData("cntScrapType96Fighter_626"),2));
							cntLabel.setBackground(event.item.data.cat);

							var sepLabel = new Label(composite,SWT.NONE);
							sepLabel.setText(" / ");
							sepLabel.setBackground(event.item.data.cat);

							var maxLabel = new Label(composite,SWT.NONE);
							maxLabel.setAlignment(SWT.RIGHT);
							maxLabel.setText(prefix(getData("maxScrapType96Fighter_626"),2));
							maxLabel.setBackground(event.item.data.cat);

							slider.addSelectionListener(new SelectionAdapter({
								widgetSelected:function(e){
									cntLabel.setText(prefix(slider.getSelection().toString(),2));
								}
							}));

							var infoLabel2 = new Label(group,SWT.NONE);
							infoLabel2.setText("21型:");
							infoLabel2.setLocation(0, 0);
							infoLabel2.setBackground(event.item.data.cat);

							var slider2 = new Slider(group,SWT.NONE);
							slider2.setMinimum(0);
							slider2.setSelection(getData("cntScrapType0FighterModel21_626"));
							slider2.setMaximum(getData("maxScrapType0FighterModel21_626") + 10); //こうしないと正しい最大値にならない
							slider2.setIncrement(1);

							var space2 = new Label(group,SWT.NONE);
							space2.setText(" ");
							space2.setBackground(event.item.data.cat);

							var composite2 = new Composite (group, SWT.BORDER);
							composite2.setLayout(new GridLayout(3,false));
							composite2.setBackground(event.item.data.cat);

							var cntLabel2 = new Label(composite2,SWT.NONE);
							cntLabel2.setAlignment(SWT.RIGHT);
							cntLabel2.setText(prefix(getData("cntScrapType0FighterModel21_626"),2));
							cntLabel2.setBackground(event.item.data.cat);

							var sepLabel2 = new Label(composite2,SWT.NONE);
							sepLabel2.setText(" / ");
							sepLabel2.setBackground(event.item.data.cat);

							var maxLabel2 = new Label(composite2,SWT.NONE);
							maxLabel2.setAlignment(SWT.RIGHT);
							maxLabel2.setText(prefix(getData("maxScrapType0FighterModel21_626"),2));
							maxLabel2.setBackground(event.item.data.cat);

							slider2.addSelectionListener(new SelectionAdapter({
								widgetSelected:function(e){
									cntLabel2.setText(prefix(slider2.getSelection().toString(),2));
								}
							}));

							tip.addDisposeListener(function(e){
								setData("cntScrapType96Fighter_626",cntLabel.getText()|0);
								setData("cntScrapType0FighterModel21_626",cntLabel2.getText()|0);
								ApplicationMain.main.getQuestTable().update();
							});
							break;
						case 643: //主力「陸攻」の調達
							var group = new Group (tip, SWT.NONE);
							group.setLayout(new GridLayout(6,false));
							group.setText(event.item.data.quest.title);
							group.setBackground(event.item.data.cat);

							var infoLabel = new Label(group,SWT.NONE);
							infoLabel.setText("21型:");
							infoLabel.setLocation(0, 0);
							infoLabel.setBackground(event.item.data.cat);

							var slider = new Slider(group,SWT.NONE);
							slider.setMinimum(0);
							slider.setSelection(getData("cntScrapType0FighterModel21_643"));
							slider.setMaximum(getData("maxScrapType0FighterModel21_643") + 10); //こうしないと正しい最大値にならない
							slider.setIncrement(1);

							var space = new Label(group,SWT.NONE);
							space.setText(" ");
							space.setBackground(event.item.data.cat);

							var cntLabel = new Label(group,SWT.SINGLE | SWT.BORDER);
							cntLabel.setAlignment(SWT.RIGHT);
							cntLabel.setText(prefix(getData("cntScrapType0FighterModel21_643"),2));
							cntLabel.setBackground(event.item.data.cat);

							var sepLabel = new Label(group,SWT.NONE);
							sepLabel.setText(" / ");
							sepLabel.setBackground(event.item.data.cat);

							var maxLabel = new Label(group,SWT.SINGLE | SWT.BORDER);
							maxLabel.setAlignment(SWT.RIGHT);
							maxLabel.setText(prefix(getData("maxScrapType0FighterModel21_643"),2));
							maxLabel.setBackground(event.item.data.cat);

							slider.addSelectionListener(new SelectionAdapter({
								widgetSelected:function(e){
									cntLabel.setText(prefix(slider.getSelection().toString(),2));
								}
							}));

							tip.addDisposeListener(function(e){
								setData("cntScrapType0FighterModel21_643",cntLabel.getText()|0);
								ApplicationMain.main.getQuestTable().update();
							});
							break;
						case 645: //「洋上補給」物資の調達
							var group = new Group (tip, SWT.NONE);
							group.setLayout( new GridLayout(6,false));
							group.setText(event.item.data.quest.title);
							group.setBackground(event.item.data.cat);

							var infoLabel = new Label(group,SWT.NONE);
							infoLabel.setText("三式:");
							infoLabel.setLocation(0, 0);
							infoLabel.setBackground(event.item.data.cat);

							var slider = new Slider(group,SWT.NONE);
							slider.setMinimum(0);
							slider.setSelection(getData("cntScrapType3Shell_645"));
							slider.setMaximum(getData("maxScrapType3Shell_645") + 10); //こうしないと正しい最大値にならない
							slider.setIncrement(1);

							var space = new Label(group,SWT.NONE);
							space.setText(" ");
							space.setBackground(event.item.data.cat);

							var composite = new Composite (group, SWT.BORDER);
							composite.setLayout(new GridLayout(3,false));
							composite.setBackground(event.item.data.cat);

							var cntLabel = new Label(composite,SWT.NONE);
							cntLabel.setAlignment(SWT.RIGHT);
							cntLabel.setText(prefix(getData("cntScrapType3Shell_645"),2));
							cntLabel.setBackground(event.item.data.cat);

							var sepLabel = new Label(composite,SWT.NONE);
							sepLabel.setText(" / ");
							sepLabel.setBackground(event.item.data.cat);

							var maxLabel = new Label(composite,SWT.NONE);
							maxLabel.setAlignment(SWT.RIGHT);
							maxLabel.setText(prefix(getData("maxScrapType3Shell_645"),2));
							maxLabel.setBackground(event.item.data.cat);

							slider.addSelectionListener(new SelectionAdapter({
								widgetSelected:function(e){
									cntLabel.setText(prefix(slider.getSelection().toString(),2));
								}
							}));

							tip.addDisposeListener(function(e){
								setData("cntScrapType3Shell_645",cntLabel.getText()|0);
								ApplicationMain.main.getQuestTable().update();
							});
							break;
						case 854: //戦果拡張任務！「Z作戦」前段作戦
							var group = new Group (tip, SWT.NONE);
							group.setLayout(new GridLayout(4,false));
							group.setText(event.item.data.quest.title);
							group.setBackground(event.item.data.cat);

							var infoLabel = new Label(group,SWT.NONE);
							infoLabel.setText("2-4:");
							infoLabel.setLocation(0, 0);
							infoLabel.setBackground(event.item.data.cat);

							var slider = new Slider(group,SWT.NONE);
							slider.setMinimum(0);
							slider.setSelection(getData("cnt854_2-4"));
							slider.setMaximum(getData("max854_2-4") + 10); //こうしないと正しい最大値にならない
							slider.setIncrement(1);

							var space = new Label(group,SWT.NONE);
							space.setText(" ");
							space.setBackground(event.item.data.cat);

							var composite = new Composite (group, SWT.BORDER);
							composite.setLayout(new GridLayout(3,false));
							composite.setBackground(event.item.data.cat);

							var cntLabel = new Label(composite,SWT.NONE);
							cntLabel.setAlignment(SWT.RIGHT);
							cntLabel.setText(prefix(getData("cnt854_2-4"),2));
							cntLabel.setBackground(event.item.data.cat);

							var sepLabel = new Label(composite,SWT.NONE);
							sepLabel.setText(" / ");
							sepLabel.setBackground(event.item.data.cat);

							var maxLabel = new Label(composite,SWT.NONE);
							maxLabel.setAlignment(SWT.RIGHT);
							maxLabel.setText(prefix(getData("max854_2-4"),2));
							maxLabel.setBackground(event.item.data.cat);

							slider.addSelectionListener(new SelectionAdapter({
								widgetSelected:function(e){
									cntLabel.setText(prefix(slider.getSelection().toString(),2));
								}
							}));

							var infoLabel2 = new Label(group,SWT.NONE);
							infoLabel2.setText("6-1:");
							infoLabel2.setLocation(0, 0);
							infoLabel2.setBackground(event.item.data.cat);

							var slider2 = new Slider(group,SWT.NONE);
							slider2.setMinimum(0);
							slider2.setSelection(getData("cnt854_6-1"));
							slider2.setMaximum(getData("max854_6-1") + 10); //こうしないと正しい最大値にならない
							slider2.setIncrement(1);

							var space2 = new Label(group,SWT.NONE);
							space2.setText(" ");
							space2.setBackground(event.item.data.cat);

							var composite2 = new Composite (group, SWT.BORDER);
							composite2.setLayout(new GridLayout(3,false));
							composite2.setBackground(event.item.data.cat);

							var cntLabel2 = new Label(composite2,SWT.NONE);
							cntLabel2.setAlignment(SWT.RIGHT);
							cntLabel2.setText(prefix(getData("cnt854_6-1"),2));
							cntLabel2.setBackground(event.item.data.cat);

							var sepLabel2 = new Label(composite2,SWT.NONE);
							sepLabel2.setText(" / ");
							sepLabel2.setBackground(event.item.data.cat);

							var maxLabel2 = new Label(composite2,SWT.NONE);
							maxLabel2.setAlignment(SWT.RIGHT);
							maxLabel2.setText(prefix(getData("max854_6-1"),2));
							maxLabel2.setBackground(event.item.data.cat);

							slider2.addSelectionListener(new SelectionAdapter({
								widgetSelected:function(e){
									cntLabel2.setText(prefix(slider2.getSelection().toString(),2));
								}
							}));

							var infoLabel3 = new Label(group,SWT.NONE);
							infoLabel3.setText("6-3:");
							infoLabel3.setLocation(0, 0);
							infoLabel3.setBackground(event.item.data.cat);

							var slider3 = new Slider(group,SWT.NONE);
							slider3.setMinimum(0);
							slider3.setSelection(getData("cnt854_6-3"));
							slider3.setMaximum(getData("max854_6-3") + 10); //こうしないと正しい最大値にならない
							slider3.setIncrement(1);

							var space3 = new Label(group,SWT.NONE);
							space3.setText(" ");
							space3.setBackground(event.item.data.cat);

							var composite3 = new Composite (group, SWT.BORDER);
							composite3.setLayout(new GridLayout(3,false));
							composite3.setBackground(event.item.data.cat);

							var cntLabel3 = new Label(composite3,SWT.NONE);
							cntLabel3.setAlignment(SWT.RIGHT);
							cntLabel3.setText(prefix(getData("cnt854_6-3"),2));
							cntLabel3.setBackground(event.item.data.cat);

							var sepLabel3 = new Label(composite3,SWT.NONE);
							sepLabel3.setText(" / ");
							sepLabel3.setBackground(event.item.data.cat);

							var maxLabel3 = new Label(composite3,SWT.NONE);
							maxLabel3.setAlignment(SWT.RIGHT);
							maxLabel3.setText(prefix(getData("max854_6-3"),2));
							maxLabel3.setBackground(event.item.data.cat);

							slider3.addSelectionListener(new SelectionAdapter({
								widgetSelected:function(e){
									cntLabel3.setText(prefix(slider3.getSelection().toString(),2));
								}
							}));

							var infoLabel4 = new Label(group,SWT.NONE);
							infoLabel4.setText("6-4:");
							infoLabel4.setLocation(0, 0);
							infoLabel4.setBackground(event.item.data.cat);

							var slider4 = new Slider(group,SWT.NONE);
							slider4.setMinimum(0);
							slider4.setSelection(getData("cnt854_6-4"));
							slider4.setMaximum(getData("max854_6-4") + 10); //こうしないと正しい最大値にならない
							slider4.setIncrement(1);

							var space4 = new Label(group,SWT.NONE);
							space4.setText(" ");
							space4.setBackground(event.item.data.cat);

							var composite4 = new Composite (group, SWT.BORDER);
							composite4.setLayout(new GridLayout(3,false));
							composite4.setBackground(event.item.data.cat);

							var cntLabel4 = new Label(composite4,SWT.NONE);
							cntLabel4.setAlignment(SWT.RIGHT);
							cntLabel4.setText(prefix(getData("cnt854_6-4"),2));
							cntLabel4.setBackground(event.item.data.cat);

							var sepLabel4 = new Label(composite4,SWT.NONE);
							sepLabel4.setText(" / ");
							sepLabel4.setBackground(event.item.data.cat);

							var maxLabel4 = new Label(composite4,SWT.NONE);
							maxLabel4.setAlignment(SWT.RIGHT);
							maxLabel4.setText(prefix(getData("max854_6-4"),2));
							maxLabel4.setBackground(event.item.data.cat);

							slider4.addSelectionListener(new SelectionAdapter({
								widgetSelected:function(e){
									cntLabel4.setText(prefix(slider4.getSelection().toString(),2));
								}
							}));

							tip.addDisposeListener(function(e){
								setData("cnt854_2-4",cntLabel.getText()|0);
								setData("cnt854_6-1",cntLabel2.getText()|0);
								setData("cnt854_6-3",cntLabel3.getText()|0);
								setData("cnt854_6-4",cntLabel4.getText()|0);
								ApplicationMain.main.getQuestTable().update();
							});
							break;
						case 426: // 海上通商航路の警戒を厳とせよ！
							var group = new Group (tip, SWT.NONE);
							group.setLayout(new GridLayout(4,false));
							group.setText(event.item.data.quest.title);
							group.setBackground(event.item.data.cat);

							var infoLabel = new Label(group,SWT.NONE);
							infoLabel.setText("警備任務:");
							infoLabel.setLocation(0, 0);
							infoLabel.setBackground(event.item.data.cat);

							var slider = new Slider(group,SWT.NONE);
							slider.setMinimum(0);
							slider.setSelection(getData("cnt426_keibi"));
							slider.setMaximum(getData("max426_keibi") + 10); //こうしないと正しい最大値にならない
							slider.setIncrement(1);

							var space = new Label(group,SWT.NONE);
							space.setText(" ");
							space.setBackground(event.item.data.cat);

							var composite = new Composite (group, SWT.BORDER);
							composite.setLayout(new GridLayout(3,false));
							composite.setBackground(event.item.data.cat);

							var cntLabel = new Label(composite,SWT.NONE);
							cntLabel.setAlignment(SWT.RIGHT);
							cntLabel.setText(prefix(getData("cnt426_keibi"),2));
							cntLabel.setBackground(event.item.data.cat);

							var sepLabel = new Label(composite,SWT.NONE);
							sepLabel.setText(" / ");
							sepLabel.setBackground(event.item.data.cat);

							var maxLabel = new Label(composite,SWT.NONE);
							maxLabel.setAlignment(SWT.RIGHT);
							maxLabel.setText(prefix(getData("max426_keibi"),2));
							maxLabel.setBackground(event.item.data.cat);

							slider.addSelectionListener(new SelectionAdapter({
								widgetSelected:function(e){
									cntLabel.setText(prefix(slider.getSelection().toString(),2));
								}
							}));

							var infoLabel2 = new Label(group,SWT.NONE);
							infoLabel2.setText("対潜警戒任務:");
							infoLabel2.setLocation(0, 0);
							infoLabel2.setBackground(event.item.data.cat);

							var slider2 = new Slider(group,SWT.NONE);
							slider2.setMinimum(0);
							slider2.setSelection(getData("cnt426_taisen"));
							slider2.setMaximum(getData("max426_taisen") + 10); //こうしないと正しい最大値にならない
							slider2.setIncrement(1);

							var space2 = new Label(group,SWT.NONE);
							space2.setText(" ");
							space2.setBackground(event.item.data.cat);

							var composite2 = new Composite (group, SWT.BORDER);
							composite2.setLayout(new GridLayout(3,false));
							composite2.setBackground(event.item.data.cat);

							var cntLabel2 = new Label(composite2,SWT.NONE);
							cntLabel2.setAlignment(SWT.RIGHT);
							cntLabel2.setText(prefix(getData("cnt426_taisen"),2));
							cntLabel2.setBackground(event.item.data.cat);

							var sepLabel2 = new Label(composite2,SWT.NONE);
							sepLabel2.setText(" / ");
							sepLabel2.setBackground(event.item.data.cat);

							var maxLabel2 = new Label(composite2,SWT.NONE);
							maxLabel2.setAlignment(SWT.RIGHT);
							maxLabel2.setText(prefix(getData("max426_taisen"),2));
							maxLabel2.setBackground(event.item.data.cat);

							slider2.addSelectionListener(new SelectionAdapter({
								widgetSelected:function(e){
									cntLabel2.setText(prefix(slider2.getSelection().toString(),2));
								}
							}));

							var infoLabel3 = new Label(group,SWT.NONE);
							infoLabel3.setText("海上護衛任務:");
							infoLabel3.setLocation(0, 0);
							infoLabel3.setBackground(event.item.data.cat);

							var slider3 = new Slider(group,SWT.NONE);
							slider3.setMinimum(0);
							slider3.setSelection(getData("cnt426_kaijo"));
							slider3.setMaximum(getData("max426_kaijo") + 10); //こうしないと正しい最大値にならない
							slider3.setIncrement(1);

							var space3 = new Label(group,SWT.NONE);
							space3.setText(" ");
							space3.setBackground(event.item.data.cat);

							var composite3 = new Composite (group, SWT.BORDER);
							composite3.setLayout(new GridLayout(3,false));
							composite3.setBackground(event.item.data.cat);

							var cntLabel3 = new Label(composite3,SWT.NONE);
							cntLabel3.setAlignment(SWT.RIGHT);
							cntLabel3.setText(prefix(getData("cnt426_kaijo"),2));
							cntLabel3.setBackground(event.item.data.cat);

							var sepLabel3 = new Label(composite3,SWT.NONE);
							sepLabel3.setText(" / ");
							sepLabel3.setBackground(event.item.data.cat);

							var maxLabel3 = new Label(composite3,SWT.NONE);
							maxLabel3.setAlignment(SWT.RIGHT);
							maxLabel3.setText(prefix(getData("max426_kaijo"),2));
							maxLabel3.setBackground(event.item.data.cat);

							slider3.addSelectionListener(new SelectionAdapter({
								widgetSelected:function(e){
									cntLabel3.setText(prefix(slider3.getSelection().toString(),2));
								}
							}));

							var infoLabel4 = new Label(group,SWT.NONE);
							infoLabel4.setText("強行偵察任務:");
							infoLabel4.setLocation(0, 0);
							infoLabel4.setBackground(event.item.data.cat);

							var slider4 = new Slider(group,SWT.NONE);
							slider4.setMinimum(0);
							slider4.setSelection(getData("cnt426_teisatsu"));
							slider4.setMaximum(getData("max426_teisatsu") + 10); //こうしないと正しい最大値にならない
							slider4.setIncrement(1);

							var space4 = new Label(group,SWT.NONE);
							space4.setText(" ");
							space4.setBackground(event.item.data.cat);

							var composite4 = new Composite (group, SWT.BORDER);
							composite4.setLayout(new GridLayout(3,false));
							composite4.setBackground(event.item.data.cat);

							var cntLabel4 = new Label(composite4,SWT.NONE);
							cntLabel4.setAlignment(SWT.RIGHT);
							cntLabel4.setText(prefix(getData("cnt426_teisatsu"),2));
							cntLabel4.setBackground(event.item.data.cat);

							var sepLabel4 = new Label(composite4,SWT.NONE);
							sepLabel4.setText(" / ");
							sepLabel4.setBackground(event.item.data.cat);

							var maxLabel4 = new Label(composite4,SWT.NONE);
							maxLabel4.setAlignment(SWT.RIGHT);
							maxLabel4.setText(prefix(getData("max426_teisatsu"),2));
							maxLabel4.setBackground(event.item.data.cat);

							slider4.addSelectionListener(new SelectionAdapter({
								widgetSelected:function(e){
									cntLabel4.setText(prefix(slider4.getSelection().toString(),2));
								}
							}));

							tip.addDisposeListener(function(e){
								setData("cnt426_keibi",cntLabel.getText()|0);
								setData("cnt426_taisen",cntLabel2.getText()|0);
								setData("cnt426_kaijo",cntLabel3.getText()|0);
								setData("cnt426_teisatsu",cntLabel4.getText()|0);
								ApplicationMain.main.getQuestTable().update();
							});
							break;
						case 428: // 近海に侵入する敵潜を制圧せよ！
							var group = new Group (tip, SWT.NONE);
							group.setLayout(new GridLayout(4,false));
							group.setText(event.item.data.quest.title);
							group.setBackground(event.item.data.cat);

							var infoLabel = new Label(group,SWT.NONE);
							infoLabel.setText("対潜警戒任務:");
							infoLabel.setLocation(0, 0);
							infoLabel.setBackground(event.item.data.cat);

							var slider = new Slider(group,SWT.NONE);
							slider.setMinimum(0);
							slider.setSelection(getData("cnt428_taisen"));
							slider.setMaximum(getData("max428_taisen") + 10); //こうしないと正しい最大値にならない
							slider.setIncrement(1);

							var space = new Label(group,SWT.NONE);
							space.setText(" ");
							space.setBackground(event.item.data.cat);

							var composite = new Composite (group, SWT.BORDER);
							composite.setLayout(new GridLayout(3,false));
							composite.setBackground(event.item.data.cat);

							var cntLabel = new Label(composite,SWT.NONE);
							cntLabel.setAlignment(SWT.RIGHT);
							cntLabel.setText(prefix(getData("cnt428_taisen"),2));
							cntLabel.setBackground(event.item.data.cat);

							var sepLabel = new Label(composite,SWT.NONE);
							sepLabel.setText(" / ");
							sepLabel.setBackground(event.item.data.cat);

							var maxLabel = new Label(composite,SWT.NONE);
							maxLabel.setAlignment(SWT.RIGHT);
							maxLabel.setText(prefix(getData("max428_taisen"),2));
							maxLabel.setBackground(event.item.data.cat);

							slider.addSelectionListener(new SelectionAdapter({
								widgetSelected:function(e){
									cntLabel.setText(prefix(slider.getSelection().toString(),2));
								}
							}));

							var infoLabel2 = new Label(group,SWT.NONE);
							infoLabel2.setText("海峡警備行動:");
							infoLabel2.setLocation(0, 0);
							infoLabel2.setBackground(event.item.data.cat);

							var slider2 = new Slider(group,SWT.NONE);
							slider2.setMinimum(0);
							slider2.setSelection(getData("cnt428_kaikyo"));
							slider2.setMaximum(getData("max428_kaikyo") + 10); //こうしないと正しい最大値にならない
							slider2.setIncrement(1);

							var space2 = new Label(group,SWT.NONE);
							space2.setText(" ");
							space2.setBackground(event.item.data.cat);

							var composite2 = new Composite (group, SWT.BORDER);
							composite2.setLayout(new GridLayout(3,false));
							composite2.setBackground(event.item.data.cat);

							var cntLabel2 = new Label(composite2,SWT.NONE);
							cntLabel2.setAlignment(SWT.RIGHT);
							cntLabel2.setText(prefix(getData("cnt428_kaikyo"),2));
							cntLabel2.setBackground(event.item.data.cat);

							var sepLabel2 = new Label(composite2,SWT.NONE);
							sepLabel2.setText(" / ");
							sepLabel2.setBackground(event.item.data.cat);

							var maxLabel2 = new Label(composite2,SWT.NONE);
							maxLabel2.setAlignment(SWT.RIGHT);
							maxLabel2.setText(prefix(getData("max428_kaikyo"),2));
							maxLabel2.setBackground(event.item.data.cat);

							slider2.addSelectionListener(new SelectionAdapter({
								widgetSelected:function(e){
									cntLabel2.setText(prefix(slider2.getSelection().toString(),2));
								}
							}));

							var infoLabel3 = new Label(group,SWT.NONE);
							infoLabel3.setText("長距離対潜警戒:");
							infoLabel3.setLocation(0, 0);
							infoLabel3.setBackground(event.item.data.cat);

							var slider3 = new Slider(group,SWT.NONE);
							slider3.setMinimum(0);
							slider3.setSelection(getData("cnt428_keikai"));
							slider3.setMaximum(getData("max428_keikai") + 10); //こうしないと正しい最大値にならない
							slider3.setIncrement(1);

							var space3 = new Label(group,SWT.NONE);
							space3.setText(" ");
							space3.setBackground(event.item.data.cat);

							var composite3 = new Composite (group, SWT.BORDER);
							composite3.setLayout(new GridLayout(3,false));
							composite3.setBackground(event.item.data.cat);

							var cntLabel3 = new Label(composite3,SWT.NONE);
							cntLabel3.setAlignment(SWT.RIGHT);
							cntLabel3.setText(prefix(getData("cnt428_keikai"),2));
							cntLabel3.setBackground(event.item.data.cat);

							var sepLabel3 = new Label(composite3,SWT.NONE);
							sepLabel3.setText(" / ");
							sepLabel3.setBackground(event.item.data.cat);

							var maxLabel3 = new Label(composite3,SWT.NONE);
							maxLabel3.setAlignment(SWT.RIGHT);
							maxLabel3.setText(prefix(getData("max428_keikai"),2));
							maxLabel3.setBackground(event.item.data.cat);

							slider3.addSelectionListener(new SelectionAdapter({
								widgetSelected:function(e){
									cntLabel3.setText(prefix(slider3.getSelection().toString(),2));
								}
							}));

							tip.addDisposeListener(function(e){
								setData("cnt428_taisen",cntLabel.getText()|0);
								setData("cnt428_kaikyo",cntLabel2.getText()|0);
								setData("cnt428_keikai",cntLabel3.getText()|0);
								ApplicationMain.main.getQuestTable().update();
							});
							break;
						case 873: // 北方海域警備を実施せよ！
							var group = new Group (tip, SWT.NONE);
							group.setLayout(new GridLayout(4,false));
							group.setText(event.item.data.quest.title);
							group.setBackground(event.item.data.cat);

							var infoLabel = new Label(group,SWT.NONE);
							infoLabel.setText("モーレイ海(3-1):");
							infoLabel.setLocation(0, 0);
							infoLabel.setBackground(event.item.data.cat);

							var slider = new Slider(group,SWT.NONE);
							slider.setMinimum(0);
							slider.setSelection(getData("cnt873_31"));
							slider.setMaximum(getData("max873_31") + 10); //こうしないと正しい最大値にならない
							slider.setIncrement(1);

							var space = new Label(group,SWT.NONE);
							space.setText(" ");
							space.setBackground(event.item.data.cat);

							var composite = new Composite (group, SWT.BORDER);
							composite.setLayout(new GridLayout(3,false));
							composite.setBackground(event.item.data.cat);

							var cntLabel = new Label(composite,SWT.NONE);
							cntLabel.setAlignment(SWT.RIGHT);
							cntLabel.setText(prefix(getData("cnt873_31"),2));
							cntLabel.setBackground(event.item.data.cat);

							var sepLabel = new Label(composite,SWT.NONE);
							sepLabel.setText(" / ");
							sepLabel.setBackground(event.item.data.cat);

							var maxLabel = new Label(composite,SWT.NONE);
							maxLabel.setAlignment(SWT.RIGHT);
							maxLabel.setText(prefix(getData("max873_31"),2));
							maxLabel.setBackground(event.item.data.cat);

							slider.addSelectionListener(new SelectionAdapter({
								widgetSelected:function(e){
									cntLabel.setText(prefix(slider.getSelection().toString(),2));
								}
							}));

							var infoLabel2 = new Label(group,SWT.NONE);
							infoLabel2.setText("キス島沖(3-2):");
							infoLabel2.setLocation(0, 0);
							infoLabel2.setBackground(event.item.data.cat);

							var slider2 = new Slider(group,SWT.NONE);
							slider2.setMinimum(0);
							slider2.setSelection(getData("cnt873_32"));
							slider2.setMaximum(getData("max873_32") + 10); //こうしないと正しい最大値にならない
							slider2.setIncrement(1);

							var space2 = new Label(group,SWT.NONE);
							space2.setText(" ");
							space2.setBackground(event.item.data.cat);

							var composite2 = new Composite (group, SWT.BORDER);
							composite2.setLayout(new GridLayout(3,false));
							composite2.setBackground(event.item.data.cat);

							var cntLabel2 = new Label(composite2,SWT.NONE);
							cntLabel2.setAlignment(SWT.RIGHT);
							cntLabel2.setText(prefix(getData("cnt873_32"),2));
							cntLabel2.setBackground(event.item.data.cat);

							var sepLabel2 = new Label(composite2,SWT.NONE);
							sepLabel2.setText(" / ");
							sepLabel2.setBackground(event.item.data.cat);

							var maxLabel2 = new Label(composite2,SWT.NONE);
							maxLabel2.setAlignment(SWT.RIGHT);
							maxLabel2.setText(prefix(getData("max873_32"),2));
							maxLabel2.setBackground(event.item.data.cat);

							slider2.addSelectionListener(new SelectionAdapter({
								widgetSelected:function(e){
									cntLabel2.setText(prefix(slider2.getSelection().toString(),2));
								}
							}));

							var infoLabel3 = new Label(group,SWT.NONE);
							infoLabel3.setText("アルフォンシーノ方面(3-3):");
							infoLabel3.setLocation(0, 0);
							infoLabel3.setBackground(event.item.data.cat);

							var slider3 = new Slider(group,SWT.NONE);
							slider3.setMinimum(0);
							slider3.setSelection(getData("cnt873_33"));
							slider3.setMaximum(getData("max873_33") + 10); //こうしないと正しい最大値にならない
							slider3.setIncrement(1);

							var space3 = new Label(group,SWT.NONE);
							space3.setText(" ");
							space3.setBackground(event.item.data.cat);

							var composite3 = new Composite (group, SWT.BORDER);
							composite3.setLayout(new GridLayout(3,false));
							composite3.setBackground(event.item.data.cat);

							var cntLabel3 = new Label(composite3,SWT.NONE);
							cntLabel3.setAlignment(SWT.RIGHT);
							cntLabel3.setText(prefix(getData("cnt873_33"),2));
							cntLabel3.setBackground(event.item.data.cat);

							var sepLabel3 = new Label(composite3,SWT.NONE);
							sepLabel3.setText(" / ");
							sepLabel3.setBackground(event.item.data.cat);

							var maxLabel3 = new Label(composite3,SWT.NONE);
							maxLabel3.setAlignment(SWT.RIGHT);
							maxLabel3.setText(prefix(getData("max873_33"),2));
							maxLabel3.setBackground(event.item.data.cat);

							slider3.addSelectionListener(new SelectionAdapter({
								widgetSelected:function(e){
									cntLabel3.setText(prefix(slider3.getSelection().toString(),2));
								}
							}));

							tip.addDisposeListener(function(e){
								setData("cnt873_31",cntLabel.getText()|0);
								setData("cnt873_32",cntLabel2.getText()|0);
								setData("cnt873_33",cntLabel3.getText()|0);
								ApplicationMain.main.getQuestTable().update();
							});
							break;
						case 675: // 北方海域警備を実施せよ！
							var group = new Group (tip, SWT.NONE);
							group.setLayout(new GridLayout(4,false));
							group.setText(event.item.data.quest.title);
							group.setBackground(event.item.data.cat);

							var infoLabel = new Label(group,SWT.NONE);
							infoLabel.setText("艦上戦闘機:");
							infoLabel.setLocation(0, 0);
							infoLabel.setBackground(event.item.data.cat);

							var slider = new Slider(group,SWT.NONE);
							slider.setMinimum(0);
							slider.setSelection(getData("cnt675_1"));
							slider.setMaximum(getData("max675_1") + 10); //こうしないと正しい最大値にならない
							slider.setIncrement(1);

							var space = new Label(group,SWT.NONE);
							space.setText(" ");
							space.setBackground(event.item.data.cat);

							var composite = new Composite (group, SWT.BORDER);
							composite.setLayout(new GridLayout(3,false));
							composite.setBackground(event.item.data.cat);

							var cntLabel = new Label(composite,SWT.NONE);
							cntLabel.setAlignment(SWT.RIGHT);
							cntLabel.setText(prefix(getData("cnt675_1"),2));
							cntLabel.setBackground(event.item.data.cat);

							var sepLabel = new Label(composite,SWT.NONE);
							sepLabel.setText(" / ");
							sepLabel.setBackground(event.item.data.cat);

							var maxLabel = new Label(composite,SWT.NONE);
							maxLabel.setAlignment(SWT.RIGHT);
							maxLabel.setText(prefix(getData("max675_1"),2));
							maxLabel.setBackground(event.item.data.cat);

							slider.addSelectionListener(new SelectionAdapter({
								widgetSelected:function(e){
									cntLabel.setText(prefix(slider.getSelection().toString(),2));
								}
							}));

							var infoLabel2 = new Label(group,SWT.NONE);
							infoLabel2.setText("機銃:");
							infoLabel2.setLocation(0, 0);
							infoLabel2.setBackground(event.item.data.cat);

							var slider2 = new Slider(group,SWT.NONE);
							slider2.setMinimum(0);
							slider2.setSelection(getData("cnt675_2"));
							slider2.setMaximum(getData("max675_2") + 10); //こうしないと正しい最大値にならない
							slider2.setIncrement(1);

							var space2 = new Label(group,SWT.NONE);
							space2.setText(" ");
							space2.setBackground(event.item.data.cat);

							var composite2 = new Composite (group, SWT.BORDER);
							composite2.setLayout(new GridLayout(3,false));
							composite2.setBackground(event.item.data.cat);

							var cntLabel2 = new Label(composite2,SWT.NONE);
							cntLabel2.setAlignment(SWT.RIGHT);
							cntLabel2.setText(prefix(getData("cnt675_2"),2));
							cntLabel2.setBackground(event.item.data.cat);

							var sepLabel2 = new Label(composite2,SWT.NONE);
							sepLabel2.setText(" / ");
							sepLabel2.setBackground(event.item.data.cat);

							var maxLabel2 = new Label(composite2,SWT.NONE);
							maxLabel2.setAlignment(SWT.RIGHT);
							maxLabel2.setText(prefix(getData("max675_2"),2));
							maxLabel2.setBackground(event.item.data.cat);

							slider2.addSelectionListener(new SelectionAdapter({
								widgetSelected:function(e){
									cntLabel2.setText(prefix(slider2.getSelection().toString(),2));
								}
							}));

							tip.addDisposeListener(function(e){
								setData("cnt675_1",cntLabel.getText()|0);
								setData("cnt675_2",cntLabel2.getText()|0);
								ApplicationMain.main.getQuestTable().update();
							});
							break;
						default: //それ以外
							var group = new Group (tip, SWT.NONE);
							group.setLayout(new GridLayout(4,false));
							group.setText(event.item.data.quest.title);
							group.setBackground(event.item.data.cat);

							var infoLabel = new Label(group,SWT.NONE);
							infoLabel.setText("回数:");
							infoLabel.setLocation(0, 0);
							infoLabel.setBackground(event.item.data.cat);

							var slider = new Slider(group,SWT.NONE);
							slider.setMinimum(0);
							slider.setSelection(getData("cnt" + questNo));
							slider.setMaximum(getData("max" + questNo) + 10); //こうしないと正しい最大値にならない
							slider.setIncrement(1);

							var space = new Label(group,SWT.NONE);
							space.setText(" ");
							space.setBackground(event.item.data.cat);

							var composite = new Composite (group, SWT.BORDER);
							composite.setLayout(new GridLayout(3,false));
							composite.setBackground(event.item.data.cat);

							var cntLabel = new Label(composite,SWT.NONE);
							cntLabel.setAlignment(SWT.RIGHT);
							cntLabel.setText(prefix(getData("cnt" + questNo),2));
							cntLabel.setBackground(event.item.data.cat);

							var sepLabel = new Label(composite,SWT.NONE);
							sepLabel.setText(" / ");
							sepLabel.setBackground(event.item.data.cat);

							var maxLabel = new Label(composite,SWT.NONE);
							maxLabel.setAlignment(SWT.RIGHT);
							maxLabel.setText(prefix(getData("max" + questNo),2));
							maxLabel.setBackground(event.item.data.cat);

							slider.addSelectionListener(new SelectionAdapter({
								widgetSelected:function(e){
									cntLabel.setText(prefix(slider.getSelection().toString(),2));
								}
							}));

							tip.addDisposeListener(function(e){
								setData("cnt" + questNo,cntLabel.getText()|0);
								ApplicationMain.main.getQuestTable().update();
							});
							break;
					}
					tip.pack();

					var size = tip.size;
					var pt = table.toDisplay (event.x, event.y);
					tip.setBounds (pt.x, pt.y - 10, size.x, size.y);
					tip.setVisible (true);
				}
			}
		}));
		setTmpData("set",true);
	}

    return item;
}

function end() { }

function prefix(num,digits){
	var s = String(num);
	if(digits - s.length() > 0){
		s = rept("0",digits - s.length()) + s;
	}
	return s;
}

function rept(str,cnt){
	var result = "";
	IntStream.range(0,cnt).forEach(function(i){
		result += str;
	});
	return result;
}

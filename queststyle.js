//ver1.7.5
//Author: Nishisonic
//        Nekopanda

load("script/utils.js");
load("script/ScriptData.js");
load("script/questinfo.js");
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

					var labels = function(){
						if(QUEST_LABELS[questNo] != null){
							return QUEST_LABELS[questNo];
						} else {
							return [["",questNo]];
						}
					}();

					var group = new Group (tip, SWT.NONE);
					group.setLayout(new GridLayout(3,false));
					group.setText(event.item.data.quest.title);
					group.setBackground(event.item.data.cat);

					var cnts = [];

					labels.filter(function(label){
						return label.length < 3 || label[2]
					}).forEach(function(label){
						var info = new Label(group,SWT.NONE);
						info.setText(label[0]);
						info.setLocation(0, 0);
						info.setBackground(event.item.data.cat);

						var slider = new Slider(group,SWT.NONE);
						slider.setMinimum(0);
						slider.setSelection(getData("cnt" + label[1]));
						slider.setMaximum(getData("max" + label[1]) + 10); //こうしないと正しい最大値にならない
						slider.setIncrement(1);

						var composite = new Composite (group, SWT.BORDER);
						composite.setLayout(new GridLayout(3,false));
						composite.setBackground(event.item.data.cat);

						var cnt = new Label(composite,SWT.NONE);
						cnt.setAlignment(SWT.RIGHT);
						cnt.setText(prefix(getData("cnt" + label[1]),2));
						cnt.setBackground(event.item.data.cat);
						cnts.push(cnt);

						var sep = new Label(composite,SWT.NONE);
						sep.setText(" / ");
						sep.setBackground(event.item.data.cat);

						var max = new Label(composite,SWT.NONE);
						max.setAlignment(SWT.RIGHT);
						max.setText(prefix(getData("max" + label[1]),2));
						max.setBackground(event.item.data.cat);

						slider.addSelectionListener(new SelectionAdapter({
							widgetSelected:function(e){
								cnt.setText(prefix(slider.getSelection().toString(),2));
							}
						}));
					});

					tip.addDisposeListener(function(e){
						labels.filter(function(label){
							return label.length < 3 || label[2]
						}).forEach(function(label,i){
							setData("cnt" + label[1],cnts[i].getText()|0);
						});
						ApplicationMain.main.getQuestTable().update();
					});

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

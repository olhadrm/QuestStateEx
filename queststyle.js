//ver1.6.4β
//Author: Nishisonic
//        Nekopanda

load("script/utils.js");
load("script/ScriptData.js");
data_prefix = "questStateEx_";

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

AppConstants    = Java.type("logbook.constants.AppConstants");
ApplicationMain = Java.type("logbook.gui.ApplicationMain");
ReportUtils     = Java.type("logbook.util.ReportUtils");

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
		case 8:		//その他
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
				if(getData("cnt" + event.item.data.quest.no) != null){
					var tip = new Shell(table.getShell(), SWT.DIALOG_TRIM | SWT.APPLICATION_MODAL);
					tip.setText("進捗回数変更");

					var group = new Group (tip, SWT.NONE);
					group.setLayout(new GridLayout(6,false));
					group.setText(event.item.data.quest.title);
					group.setBackground(event.item.data.cat);

					var infoLabel = new Label(group,SWT.NONE);
					infoLabel.setText("回数:");
					infoLabel.setLocation(0, 0);
					infoLabel.setBackground(event.item.data.cat);

					var slider = new Slider(group,SWT.NONE);
					slider.setMinimum(0);
					slider.setSelection(getData("cnt" + event.item.data.quest.no));
					slider.setMaximum(getData("max" + event.item.data.quest.no) + 10); //こうしないと正しい最大値にならない
					slider.setIncrement(1);
					slider.setBackground(event.item.data.cat);

					var space = new Label(group,SWT.NONE);
					space.setText(" ");
					space.setBackground(event.item.data.cat);

					var cntLabel = new Label(group,SWT.SINGLE | SWT.BORDER);
					cntLabel.setAlignment(SWT.RIGHT);
					cntLabel.setText(getData("cnt" + event.item.data.quest.no));
					cntLabel.setBackground(event.item.data.cat);

					var sepLabel = new Label(group,SWT.NONE);
					sepLabel.setText(" / ");
					sepLabel.setBackground(event.item.data.cat);

					var maxLabel = new Label(group,SWT.SINGLE | SWT.BORDER);
					maxLabel.setAlignment(SWT.RIGHT);
					maxLabel.setText(getData("max" + event.item.data.quest.no));
					maxLabel.setBackground(event.item.data.cat);

					slider.addSelectionListener(new SelectionAdapter({
						widgetSelected:function(e){
							cntLabel.setText(slider.getSelection().toString());
						}
					}));

					tip.addDisposeListener(function(e){
						setData("cnt" + event.item.data.quest.no,cntLabel.getText());
						ApplicationMain.main.getQuestTable().update();
					});
					
					group.pack();
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

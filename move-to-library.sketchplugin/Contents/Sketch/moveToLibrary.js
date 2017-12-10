function moveAllSymbolsToNewLibrary (context) {
		var libraryDoc = createNewSketchFile()
		var localSymbols = context.document.documentData().localSymbols()
		for (var i=0; i < localSymbols.count();i ++)
		{
  		AddSymbolToDoc(localSymbols[i],libraryDoc.documentData())
		}
		//addDocToLibraries(libraryDoc)
}

function moveAllSymbolsToExisitingLibrary (context) {
	userLibraries = getAllLibraries();
	var libraryIndex = getLayoutSettings(context,userLibraries.name)
	if (libraryIndex != -1){
			var localSymbols = context.document.documentData().localSymbols()
			for (var i = 0; i < localSymbols.count(); i++)
			{
				context.document.showMessage("Moving [" + i + "/" + localSymbols.count() + "] 🕗")
				replaceInstance (context,localSymbols[i],userLibraries.Reference[libraryIndex])
			}
			context.document.showMessage( movedSymbolsNumber + " Symbols moved to [" + userLibraries.name[libraryIndex] + "] successfully ✅ 😎 and " + movedInstancesNumber + " Re-attached ✌️")

		}
	}


function moveSelectedSymbolsToExisitingLibrary (context){
	if (validate(context))
	{
		userLibraries = getAllLibraries();
		var libraryIndex = getLayoutSettings(context,userLibraries.name)
		if (libraryIndex != -1){
				var selection = context.selection
				for (var i = 0; i < selection.count(); i++)
				{
					context.document.showMessage("Moving [" + i + "/" + selection.count() + "] 🕗")
					var selectedSymbols = selection[i]
					replaceInstance (context,selectedSymbols,userLibraries.Reference[libraryIndex])
				}
				context.document.showMessage( movedSymbolsNumber + " Symbols moved to [" + userLibraries.name[libraryIndex] + "] successfully ✅ 😎 and " + movedInstancesNumber + " Re-attached ✌️")
			}
		}
}

function createSelect(items,selectedItemIndex,frame) {
	selectedItemIndex = (selectedItemIndex > -1) ? selectedItemIndex : 0;
	var comboBox = [[NSComboBox alloc] initWithFrame:frame];
	[comboBox addItemsWithObjectValues:items];
	[comboBox selectItemAtIndex:selectedItemIndex];

	return comboBox;
}

// create text field
function createField(value,frame) {
	var field = [[NSTextField alloc] initWithFrame:frame];
	[field setStringValue:value];

	return field;
}



// create Label header
function createLabel(text,size,frame) {
	var label = [[NSTextField alloc] initWithFrame:frame];
	[label setStringValue:text];
	[label setFont:[NSFont boldSystemFontOfSize:size]];
	[label setBezeled:false];
	[label setDrawsBackground:false];
	[label setEditable:false];
	[label setSelectable:false];

	return label;
}


// create text description
function createDescription(text,size,frame) {
	var label = [[NSTextField alloc] initWithFrame:frame];
	[label setStringValue:text];
	[label setFont:[NSFont systemFontOfSize:size]];
	[label setTextColor:[NSColor colorWithCalibratedRed:(0/255) green:(0/255) blue:(0/255) alpha:0.6]];
	[label setBezeled:false];
	[label setDrawsBackground:false];
	[label setEditable:false];
	[label setSelectable:false];

	return label;
}



function setKeyOrder(alert,order) {
	for (var i = 0; i < order.length; i++) {
		var thisItem = order[i];
		var nextItem = order[i+1];

		if (nextItem) thisItem.setNextKeyView(nextItem);
	}

	alert.alert().window().setInitialFirstResponder(order[0]);
}


function getLayoutSettings(context,librariesArray) {
		// Document variables
		var page = context.document.currentPage();


		// If type is set and equal to "config", operate in config mode...
			// Establish the alert window
		var alertWindow = COSAlertWindow.new();
    alertWindow.setIcon(NSImage.alloc().initByReferencingFile(context.plugin.urlForResourceNamed("icon.png").path()));
    alertWindow.setMessageText("Move to Library Plugin");

		// Grouping options
		var groupFrame = NSView.alloc().initWithFrame(NSMakeRect(0,0,300,124));
		alertWindow.addAccessoryView(groupFrame);


    var groupGranularityLabel = createLabel('Move Symbols to',12,NSMakeRect(0,108,140,16));
    groupFrame.addSubview(groupGranularityLabel);
    var groupGranularityDescription = createDescription('Select the library to move you symbols',11,NSMakeRect(0,60,300,42));
    groupFrame.addSubview(groupGranularityDescription);
    var groupGranularityValue = createSelect(librariesArray,0,NSMakeRect(0,50,300,28));
    groupFrame.addSubview(groupGranularityValue);
		var groupGranularityDescription = createDescription('Created by Ahmed Genaidy, follow me on twitter @ser_migo',11,NSMakeRect(0,0,300,42));
		groupFrame.addSubview(groupGranularityDescription);
    alertWindow.addButtonWithTitle('select ✅');
    alertWindow.addButtonWithTitle('Cancel');

		// Set key order and first responder
		setKeyOrder(alertWindow,[
			groupGranularityValue

		]);

		var responseCode = alertWindow.runModal();
        log(responseCode)
        if (responseCode == 1000) {
                context.document.showMessage("loading..  🕑 ")
								return [groupGranularityValue indexOfSelectedItem]
				} else {
								context.document.showMessage("bye bye 👋")
								return -1;
				}
}



function validate (context){
    var doc = context.document;
    if (context.selection.count() == 0) {
        doc.showMessage("No layer selected, Please select symbol instance layer 🤔");
		}
    else if (context.selection[0].class() == MSSymbolMaster || context.selection[0].class() == MSSymbolInstance) {
        return true;
    }
    else {
        doc.showMessage("layer selected is not Symbol 🤔");
    }
    return false;
}


/*******************Globle variables************************/
var copiedSymbols = {} //Object for dublicate symbols


/*******************Functions************************/

//create New sketch file and ask user for the location of this file
function createNewSketchFile (){
  var newFile = MSDocument.new();
  newFile.setFileName(context.document.fileName().replace('.sketch','') + " Library.sketch")
  newFile.saveDocumentAs(newFile)
  log(newFile.fileName())
  return newFile
}


//Add new page to document
function AddNewPageToDoc(name,doc){
  var tempPage = MSPage.new();
  doc.addPage(tempPage);
  tempPage.setName(name);
}


//add symbols with it's nest without dubliucate by using copiedSymbolsObject
// Adject the postion on the doc with the same poition in the original file
function AddSymbolToDoc (symbol,doc) {
  if (copiedSymbols[symbol] == null)
  {
    var symbolChildren = symbol.children()
    for (var i = 0; i < symbolChildren.count(); i++)
    {
      if (symbol.children()[i].class() == MSSymbolInstance)
      {
        AddSymbolToDoc(symbol.children()[i].symbolMaster(),doc)
      }
    }
    //var frameX = JSON.parse(JSON.stringify(symbol.frame().x()))
    //var frameY = JSON.parse(JSON.stringify(symbol.frame().y()))
    doc.addSymbolMaster(symbol)
    //symbol.frame().setX(frameX)
    //symbol.frame().setY(frameY)
    copiedSymbols[symbol]=1
  }
}

//add file to libraries
function addDocToLibraries (doc) {
  //AppController.sharedInstance().librariesController().addAssetLibraryAtURL(doc.fileURL())
	doc.saveAndAddLibrary()
}


function getAllLibraries () {
	var userLibraries = AppController.sharedInstance().librariesController().userLibraries();
	var librariesNameAndReference = {}
	librariesNameAndReference.name = []
	librariesNameAndReference.Reference = []
	for (var i = 0; i < userLibraries.count(); i++)
	{
		librariesNameAndReference.name[i] = userLibraries[i].name();
		librariesNameAndReference.Reference[i] = userLibraries[i]
	}
	return librariesNameAndReference;
}

function replaceInstance (context,symbol,library) {
    var symbolID = symbol.symbolID()
    var symbolName = symbol.name()
    var librarySymbols = library.document().localSymbols()
		var i = 0
    for (i = 0; i < librarySymbols.count(); i++) {
        if(librarySymbols[i].name().substring(0,100) == symbolName.substring(0,100)){
				var foriegnSymbols = context.document.localSymbolForSymbol_inLibrary(librarySymbols[i],library)
				reattachAllInstance(context,symbolID,foriegnSymbols)
				break;
      }
    }
		//if symbol not exsit add and reattach instance
		if (i == librarySymbols.count()) {
			if (symbol.class() == MSSymbolMaster) {
				addSymbolTolibrary (symbol,library)
				movedSymbolsNumber++;
				var foriegnSymbols = context.document.localSymbolForSymbol_inLibrary(symbol,library)
				reattachAllInstance(context,symbolID,foriegnSymbols)
			}
			else if (symbol.class() == MSSymbolInstance ){
				addSymbolTolibrary (symbol.symbolMaster(),library)
				movedSymbolsNumber++;
				var foriegnSymbols = context.document.localSymbolForSymbol_inLibrary(symbol,library)
				reattachAllInstance(context,symbolID,foriegnSymbols)
			}
		}
}

function addSymbolTolibrary (symbol,library){
		var fileURL = library.locationOnDisk()
		log(fileURL)

		var document = MSDocument.new();
		document.readDocumentFromURL_ofType_error(fileURL,"sketch", null);
		AddSymbolToDoc(symbol,document.documentData())
		//document.documentData().addSymbolMaster(symbol)
		[document writeToURL:fileURL ofType:"sketch" forSaveOperation:1 originalContentsURL:fileURL error:null]
}

var movedInstancesNumber = 0
var movedSymbolsNumber = 0

function reattachAllInstance (context,symbolID,foreignSymbol) {
    var Instances = context.document.documentData().symbolInstancesBySymbolID()[symbolID]
		if (Instances != null)
		{
			for (var i= 0 ; i < Instances.count(); i++)
	    {
					context.document.showMessage("Reconnecting [" + i + "/" + Instances.count() + "] Instances 🕗")
	        Instances.allObjects()[i].changeInstanceToSymbol(foreignSymbol)
					movedInstancesNumber++;
	    }
		}
}


function matchMasterSymbolwithForeignSymbolID (symbolID) {
  var foreignSymbolsID = context.document.documentData().foreignSymbols()
  for (var i= 0 ; i < Instances.count(); i++)
    {

        Instances.allObjects()[i].changeInstanceToSymbol(foreignSymbolsID)
    }
}

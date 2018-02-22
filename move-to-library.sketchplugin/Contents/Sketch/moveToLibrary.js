function moveAllSymbolsToExisitingLibrary (context) {
	userLibraries = getAllLibraries();
	var libraryIndex = getLayoutSettings(context,userLibraries.name)
	var library = userLibraries.Reference[libraryIndex]
	if (libraryIndex != -1){
			var symbolsInDocByName = getSymbolsInDocByName(library.document())
			var localSymbolsByName = getSymbolsInDocByName(context.document.documentData())
			getIdMap(context,localSymbolsByName,symbolsInDocByName,library)
			var localSymbols = context.document.documentData().localSymbols()
			for (var i = 0; i < localSymbols.count(); i++)
			{
				context.api().message("Moving [" + i + "/" + localSymbols.count() + "] 🕗")
				replaceInstance (context,localSymbols[i],symbolsInDocByName,library)
			}
			context.api().message( movedInstancesNumber + " Re-attached ✌️" + movedSymbolsNumber + " Symbols moved to [" + userLibraries.name[libraryIndex] + "] successfully ✅ 😎 and ")
		}
		else {
			context.api().message( "You don't have any Library yet, Please add library first")
		}
	}


function moveSelectedSymbolsToExisitingLibrary (context){
		userLibraries = getAllLibraries();
		var libraryIndex = getLayoutSettings(context,userLibraries.name)
		if (libraryIndex != -1){
				var selection = context.selection
				for (var i = 0; i < selection.count(); i++)
				{
					if (validate(context,i))
					{
						// context.api().message("Moving [" + i + "/" + selection.count() + "] 🕗")
						var selectedSymbol = selection[i]
						var library = userLibraries.Reference[libraryIndex]
						var symbolsInDocByName = getSymbolsInDocByName(library.document())
						var localSymbolsByName = getSymbolsInDocByName(context.document.documentData())
						getIdMap(context,localSymbolsByName,symbolsInDocByName,library)
						if (selectedSymbol.class() == MSSymbolMaster || selectedSymbol.class() == MSSymbolInstance)
						{
							replaceInstance (context,selectedSymbol,symbolsInDocByName,library)
						}
					}
				}
				context.api().message( movedInstancesNumber + " Re-attached ✌️" + movedSymbolsNumber + " Symbols moved to [" + userLibraries.name[libraryIndex] + "] successfully ✅ 😎 and ")
			}
			else {
				context.api().message( "You don't have any Library yet, Please add library first")
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
        if (responseCode == 1000) {
                // context.api().message("loading..  🕑 ")
								return [groupGranularityValue indexOfSelectedItem]
				} else {
								context.api().message("bye bye 👋")
								return -1;
				}
}



function validate (context,i){
    var doc = context.document;
    if (context.selection.count() == 0) {
        context.api().message("No layer selected, Please select symbol instance layer 🤔");
		}
    else if (context.selection[i].class() == MSSymbolMaster || context.selection[i].class() == MSSymbolInstance) {
        return true;
    }
    else {
        context.api().message("layer selected is not Symbol 🤔");
    }
    return false;
}


/*******************Globle variables************************/
var copiedSymbols = {} //Object for dublicate symbols


/*******************Functions************************/

//create New sketch file and ask user for the location of this file



function getSymbolsInDocByName (doc)
{
	var docSymbols = doc.localSymbols()
	var docSymbolsWithNames = {}
	for (var i = 0; i < docSymbols.count();i++)
	{
			docSymbolsWithNames[docSymbols[i].name()] = docSymbols[i]
	}
	return docSymbolsWithNames
}

var idmap = {}

function getIdMap (context, localSymbolsByName, foreignSymbolsByName,library)
{
	for (key in localSymbolsByName) {
		if(foreignSymbolsByName[key] != undefined) {
			foreignSymbol = context.document.localSymbolForSymbol_inLibrary(foreignSymbolsByName[key],library)
			idmap[localSymbolsByName[key].symbolID()] = foreignSymbol.symbolID()
		}
	}
}


function getMatchSymbolInDoc (symbol,docSymbolsWithNames)
{
		if(docSymbolsWithNames[symbol.name()] != undefined)
		{
			return docSymbolsWithNames[symbol.name()]
		}
	return -1
}

// function getMatchSymbolInDoc (symbol,doc)
// {
// 	var docSymbols = doc.localSymbols()
// 	for (var i = 0; i < docSymbols.count();i++)
// 	{
// 		if(docSymbols[i].name().substring(0,100) == symbol.name().substring(0,100))
// 		{
// 			return docSymbols[i]
// 		}
// 	}
// 	return -1
// }

//add symbols with it's nest without dubliucate by using copiedSymbolsObject
// Adject the postion on the doc with the same poition in the original file

function AddSymbolToDoc (context,symbol,symbolsInDocByName,doc,library,localDoc) {
    var symbolChildren = symbol.children()
		var symbolCopy = symbol.copy()
		localDoc.addSymbolMaster(symbolCopy)
    for (var i = 0; i < symbolChildren.count(); i++)
    {
      if (symbolChildren[i].class() == MSSymbolInstance)
      {
				symbolsInDocByName = replaceInstance (context,symbol.children()[i],symbolsInDocByName,library)
				var childMaster = symbolsInDocByName[symbolChildren[i].symbolMaster().name()]
				symbolCopy.children()[i].changeInstanceToSymbol(childMaster)
      }
    }
		symbolCopy.removeFromParent()
    var frameX = JSON.parse(JSON.stringify(symbol.frame().x()))
    var frameY = JSON.parse(JSON.stringify(symbol.frame().y()))
    doc.addSymbolMaster(symbolCopy)
		symbolsInDocByName[symbolCopy.name()] = symbolCopy;
		movedSymbolsNumber++;
    symbolCopy.frame().setX(frameX)
    symbolCopy.frame().setY(frameY)

		return symbolsInDocByName;
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

function replaceInstance2 (context,symbol,symbolsInDocByName,library) {
			var symbolID = symbol.symbolID()
	    var symbolName = symbol.name()
	    var librarySymbols = library.document().localSymbols()
			var symbolInDoc = symbolsInDocByName[symbolName]
	    if(symbolInDoc != undefined){
			var foriegnSymbols = context.document.localSymbolForSymbol_inLibrary(symbolInDoc,library)
					reattachAllInstance(context,symbolID,foriegnSymbols)
					log ( movedInstancesNumber + " Instance Done 🤘")
					context.api().message(movedInstancesNumber + " Instance Done 🤘"))
	    }
		//if symbol not exsit add and reattach instance
		else {
			if (symbol.class() == MSSymbolMaster && !symbol.isForeign() ) {
				symbolsInDocByName = addSymbolTolibrary (context,symbol,symbolsInDocByName,library,context.document.documentData())
				log ( movedSymbolsNumber + " Symbols moved 🤘")
				context.api().message(movedSymbolsNumber + " Symbols moved 🤘")
				var foriegnSymbols = context.document.localSymbolForSymbol_inLibrary(symbol,library)
				idmap[symbol.symbolID()] = foriegnSymbols.symbolID()
				reattachAllInstance(context,symbolID,foriegnSymbols)
			}
			else if (symbol.class() == MSSymbolInstance && !symbol.symbolMaster().isForeign()){
				symbolsInDocByName = addSymbolTolibrary (context,symbol.symbolMaster(),symbolsInDocByName,library,context.document.documentData())
				var foriegnSymbols = context.document.localSymbolForSymbol_inLibrary(symbol,library)
				idmap[symbol.symbolMaster().symbolID()] = foriegnSymbols.symbolID()
				reattachAllInstance(context,symbolID,foriegnSymbols)
			}
		}
		return symbolsInDocByName
}

function replaceInstance (context,symbol,symbolsInDocByName,library) {
		if (symbol.class() == MSSymbolInstance)
		{
			symbol = symbol.symbolMaster()
		}
		var symbolID = symbol.symbolID()
    var symbolName = symbol.name()
    var librarySymbols = library.document().localSymbols()
		var symbolInDoc = symbolsInDocByName[symbolName]
    if(symbolInDoc != undefined){
				var foriegnSymbol = context.document.localSymbolForSymbol_inLibrary(symbolInDoc,library)
				log("foreignSymbol :" + foriegnSymbol)
				reattachAllInstance(context,symbolID,foriegnSymbol)
				log ( movedInstancesNumber + " Instance Done 🤘")
				context.api().message(movedInstancesNumber + " Instance Done 🤘"))
    }
		//if symbol not exsit add and reattach instance
		else {
				symbolsInDocByName = addSymbolTolibrary (context,symbol,symbolsInDocByName,library,context.document.documentData())
				log ( movedSymbolsNumber + " Symbols moved 🤘")
				symbolInDoc = symbolsInDocByName[symbolName]
				var foriegnSymbol = context.document.localSymbolForSymbol_inLibrary(symbolInDoc,library)
				idmap[symbol.symbolID()] = foriegnSymbol.symbolID()
				reattachAllInstance(context,symbolID,foriegnSymbol)
			}
	return symbolsInDocByName
}



var fileURL = undefined
var foreigndocument = undefined
function addSymbolTolibrary (context,symbol,symbolsInDocByName,library,localDoc){
		if (fileURL == undefined)
		{
			fileURL = library.locationOnDisk()
			foreigndocument = MSDocument.new();
			foreigndocument.readDocumentFromURL_ofType_error(fileURL,"sketch", null);
			foreigndocument.revertToContentsOfURL_ofType_error(fileURL, "sketch", null);
		}
		symbolsInDocByName = AddSymbolToDoc(context,symbol,symbolsInDocByName,foreigndocument.documentData(),library,localDoc)
		[foreigndocument writeToURL:fileURL ofType:"sketch" forSaveOperation:1 originalContentsURL:fileURL error:null]
		return symbolsInDocByName;
}

var movedInstancesNumber = 0
var movedSymbolsNumber = 0

function reattachAllInstance (context,symbolID,foreignSymbol) {
    var Instances = context.document.documentData().symbolInstancesBySymbolID()[symbolID]
		if (Instances != null)
		{
			var instanceArray = Instances.allObjects()
			for (var i= 0 ; i < instanceArray.count(); i++)
	    {
					context.api().message("Reconnecting [" + i + "/" + Instances.count() + "] Instances 🕗")
					log ("Reconnecting [" + i + "/" + Instances.count() + "] Instances 🕗")
	        instanceArray[i].changeInstanceToSymbol(foreignSymbol)
					instanceArray[i].updateOverridesWithObjectIDMap(idmap)
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

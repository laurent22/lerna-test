"use strict";
/**
 * Copyright (c) Tiny Technologies, Inc. All rights reserved.
 * Licensed under the LGPL or a commercial license.
 * For LGPL see License.txt in the project root for license information.
 * For commercial licenses see https://www.tiny.cloud/
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.flattenListSelection = exports.outdentListSelection = exports.indentListSelection = void 0;
const katamari_1 = require("@ephox/katamari");
const sugar_1 = require("@ephox/sugar");
const ListsIndendation_1 = require("../listModel/ListsIndendation");
const DlIndentation_1 = require("../core/DlIndentation");
const Range = require("../core/Range");
const Selection = require("../core/Selection");
const selectionIndentation = (editor, indentation) => {
    const lists = katamari_1.Arr.map(Selection.getSelectedListRoots(editor), sugar_1.Element.fromDom);
    const dlItems = katamari_1.Arr.map(Selection.getSelectedDlItems(editor), sugar_1.Element.fromDom);
    let isHandled = false;
    if (lists.length || dlItems.length) {
        const bookmark = editor.selection.getBookmark();
        ListsIndendation_1.listIndentation(editor, lists, indentation);
        DlIndentation_1.dlIndentation(editor, indentation, dlItems);
        editor.selection.moveToBookmark(bookmark);
        editor.selection.setRng(Range.normalizeRange(editor.selection.getRng()));
        editor.nodeChanged();
        isHandled = true;
    }
    return isHandled;
};
const indentListSelection = (editor) => {
    return selectionIndentation(editor, "Indent" /* Indent */);
};
exports.indentListSelection = indentListSelection;
const outdentListSelection = (editor) => {
    return selectionIndentation(editor, "Outdent" /* Outdent */);
};
exports.outdentListSelection = outdentListSelection;
const flattenListSelection = (editor) => {
    return selectionIndentation(editor, "Flatten" /* Flatten */);
};
exports.flattenListSelection = flattenListSelection;
//# sourceMappingURL=Indendation.js.map
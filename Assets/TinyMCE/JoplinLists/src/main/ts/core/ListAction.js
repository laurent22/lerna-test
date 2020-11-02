"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listToggleActionFromListName = void 0;
exports.listToggleActionFromListName = (listName) => {
    switch (listName) {
        case 'UL': return "ToggleUlList" /* ToggleUlList */;
        case 'OL': return "ToggleOlList" /* ToggleOlList */;
        case 'DL': return "ToggleDLList" /* ToggleDLList */;
    }
};
//# sourceMappingURL=ListAction.js.map
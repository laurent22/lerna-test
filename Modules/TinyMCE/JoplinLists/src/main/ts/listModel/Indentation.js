"use strict";
/**
 * Copyright (c) Tiny Technologies, Inc. All rights reserved.
 * Licensed under the LGPL or a commercial license.
 * For LGPL see License.txt in the project root for license information.
 * For commercial licenses see https://www.tiny.cloud/
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.indentEntry = void 0;
exports.indentEntry = (indentation, entry) => {
    switch (indentation) {
        case "Indent" /* Indent */:
            entry.depth++;
            break;
        case "Outdent" /* Outdent */:
            entry.depth--;
            break;
        case "Flatten" /* Flatten */:
            entry.depth = 0;
    }
};
//# sourceMappingURL=Indentation.js.map
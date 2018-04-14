## eslint-plugin-file-header

Rule to check if file contains specified comment.

### Installation

```bash
yarn add -D eslint-plugin-file-header
```

#### Example:

```js
module.exports = {
  plugins: ["file-header"],
  rules: {
    "file-header/file-header": [
      "error",
      [
        "This Source Code Form is subject to the terms of the Mozilla Public",
        "License, v. 2.0. If a copy of the MPL was not distributed with this",
        "file, You can obtain one at <http://mozilla.org/MPL/2.0/>."
      ],
      "block",
      ["-\\*-(.*)-\\*-", "eslint(.*)", "vim(.*)"]
    ]
  }
};
```

#### Options:

1.  `header` - array of lines of the header (without comment tags).
2.  `commentType` - either `block`, `line` or `null`. Plugin will use this
    option to search for headers and to fix missing header. If `commentType`
    is `null` rule will use both comment types to check for headers (and `line`
    type will be used when fixing).
3.  `ignoredComments` - array of patterns that this rule will ignore (they won't be
    replaced by the rule and new header will be inserted after last ignoredComment if any).

#### Hardcoded rules:

* Header must not be intended.
* Header must start in the 6 first lines of file.

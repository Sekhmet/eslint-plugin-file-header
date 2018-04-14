const RuleTester = require("eslint").RuleTester;
const rule = require("../../../lib/rules/header");

const ruleTester = new RuleTester();

ruleTester.run("header", rule, {
  valid: [
    {
      code: "/* Copyright 2017 */\nconsole.log(1);",
      options: [["Copyright 2017"]]
    },
    {
      code: "// Copyright 2017\nconsole.log(1);",
      options: [["Copyright 2017"], "line"]
    },
    {
      code: "// Copyright 2017\n// Sekhmet\nconsole.log(1);",
      options: [["Copyright 2017", "Sekhmet"], "line"]
    },
    {
      code: "/* vim: some-config */\n/* Copyright 2017 */\nconsole.log(1);",
      options: [["Copyright 2017"], "block", ["vim:(.*)"]],
      errors: [
        "Expected file to contain single comment with a text:\nCopyright 2017\n\n"
      ]
    }
  ],
  invalid: [
    {
      code: "console.log(1);",
      options: [["Copyright 2017"]],
      errors: [
        "Expected file to contain single comment with a text:\nCopyright 2017\n\n"
      ]
    },
    {
      code: "/* vim: some-config */\n/* Copyright 2017 */\nconsole.log(1);",
      options: [["Copyright 2017"], "block"],
      errors: [
        "Expected file to contain single comment with a text:\nCopyright 2017\n\n"
      ]
    },
    {
      code:
        "console.log(1);\nconsole.log(1);\nconsole.log(1);\nconsole.log(1);\nconsole.log(1);\nconsole.log(1);\n/* Copyright 2017 */",
      options: [["Copyright 2017"]],
      errors: [
        "Expected file to contain single comment with a text:\nCopyright 2017\n\n"
      ]
    }
  ]
});

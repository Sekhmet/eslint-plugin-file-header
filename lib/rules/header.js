const desired = [
  "This Source Code Form is subject to the terms of the Mozilla Public",
  "License, v. 2.0. If a copy of the MPL was not distributed with this",
  "file, You can obtain one at <http://mozilla.org/MPL/2.0/>."
];

const strippedCommentRegex = /^[ *]*(.*?)[ ]*$/;

module.exports = {
  meta: {
    meta: {
      docs: {
        description: "Rule to check if file contains specified comment",
        category: "Stylistic Issues"
      }
    },
    messages: {
      missingHeader:
        "Expected file to contain single comment with a text:\n{{ header }}\n"
    }
  },
  create: function create(context) {
    return {
      Program: function Program(node) {
        const sourceCode = context.getSourceCode();
        const comments = sourceCode.getAllComments();

        const matchingComments = comments.filter(comment => {
          const lines = comment.value.split("\n");

          const diff = lines.filter(
            (line, id) => line.match(strippedCommentRegex)[1] !== desired[id]
          );

          return diff.length === 0;
        });

        if (matchingComments.length !== 1) {
          context.report({
            node: node,
            messageId: "missingHeader",
            data: {
              header: desired.join("\n")
            }
          });
        }
      }
    };
  }
};

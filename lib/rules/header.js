const { stripComment } = require("../utils");

module.exports = {
  meta: {
    docs: {
      description: "Rule to check if file contains specified comment",
      category: "Stylistic Issues"
    },
    messages: {
      missingHeader:
        "Expected file to contain single comment with a text:\n{{ header }}\n"
    }
  },
  create: function create(context) {
    const requiredHeader = context.options[0];
    const requiredType = context.options[1] || null;

    return {
      Program: function Program(node) {
        const sourceCode = context.getSourceCode();

        const targetComment = sourceCode
          .getAllComments()
          .find(
            comment =>
              !requiredType || comment.type.toLowerCase() === requiredType
          );

        if (!targetComment) {
          context.report({
            node,
            messageId: "missingHeader",
            data: {
              header: requiredHeader.join("\n")
            }
          });
          return;
        }

        const diff = targetComment.value
          .split("\n")
          .filter((line, id) => stripComment(line) !== requiredHeader[id]);

        if (diff.length !== 0) {
          context.report({
            loc: targetComment.loc,
            messageId: "missingHeader",
            data: {
              header: requiredHeader.join("\n")
            }
          });
        }
      }
    };
  }
};

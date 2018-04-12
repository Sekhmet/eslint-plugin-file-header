const { stripComment, createComment } = require("../utils");

module.exports = {
  meta: {
    docs: {
      description: "Rule to check if file contains specified comment",
      category: "Stylistic Issues"
    },
    messages: {
      missingHeader:
        "Expected file to contain single comment with a text:\n{{ header }}\n"
    },
    fixable: "code"
  },
  create: function create(context) {
    const requiredHeader = context.options[0];
    const requiredType = context.options[1] || null;

    return {
      Program: function Program(node) {
        const sourceCode = context.getSourceCode();
        const comments = sourceCode.getAllComments();

        const matchingComments = comments.filter(comment => {
          if (requiredType && comment.type.toLowerCase() !== requiredType)
            return false;

          const diff = comment.value
            .split("\n")
            .filter((line, id) => stripComment(line) !== requiredHeader[id]);

          return diff.length === 0;
        });

        if (matchingComments.length !== 1) {
          context.report({
            node,
            messageId: "missingHeader",
            data: {
              header: requiredHeader.join("\n")
            },
            fix: function(fixer) {
              return fixer.insertTextAfterRange(
                [0, 0],
                `${createComment(requiredHeader, requiredType)}\n\n`
              );
            }
          });
        }
      }
    };
  }
};

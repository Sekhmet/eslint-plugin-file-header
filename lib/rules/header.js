const { stripComment, createComment } = require("../utils");

const START_LINE = 5;

function createCommentInserter(range, header, type) {
  return function(fixer) {
    return fixer.insertTextAfterRange(
      range,
      `\n${createComment(header, type)}\n\n`
    );
  };
}

function createCommentReplacer(range, header, type) {
  return function(fixer) {
    return fixer.replaceTextRange(range, createComment(header, type));
  };
}

module.exports = {
  meta: {
    docs: {
      description: "Rule to check if file contains specified comment",
      category: "Stylistic Issues"
    },
    messages: {
      missingHeader:
        "Expected file to contain single comment with a text:\n{{ header }}\n\n"
    },
    fixable: "code"
  },
  create: function create(context) {
    const requiredHeader = context.options[0];
    const requiredType = context.options[1] || null;
    let ignoredComments = context.options[2] || [];

    ignoredComments = ignoredComments.map(comment => new RegExp(comment));

    return {
      Program: function Program(node) {
        let targetRange = [0, 0];

        const targetComment = context
          .getSourceCode()
          .getAllComments()
          .find(comment => {
            if (requiredType && comment.type.toLowerCase() !== requiredType) {
              return false;
            }

            if (
              comment.loc.start.column !== 0 ||
              comment.loc.start.line > START_LINE
            ) {
              return false;
            }

            const commentValue = comment.value.trim();
            for (let i = 0; i < ignoredComments.length; i++) {
              if (ignoredComments[i].test(commentValue)) {
                targetRange = comment.range;
                return false;
              }
            }

            return true;
          });

        if (!targetComment) {
          context.report({
            node,
            messageId: "missingHeader",
            data: {
              header: requiredHeader.join("\n")
            },
            fix: createCommentInserter(
              targetRange,
              requiredHeader,
              requiredType
            )
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
            },
            fix: createCommentReplacer(
              targetComment.range,
              requiredHeader,
              requiredType
            )
          });
        }
      }
    };
  }
};

const strippedCommentRegex = /^[ *]*(.*?)[ ]*$/;

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

    return {
      Program: function Program(node) {
        const sourceCode = context.getSourceCode();
        const comments = sourceCode.getAllComments();

        const matchingComments = comments.filter(comment => {
          const lines = comment.value.split("\n");

          const diff = lines.filter(
            (line, id) =>
              line.match(strippedCommentRegex)[1] !== requiredHeader[id]
          );

          return diff.length === 0;
        });

        if (matchingComments.length !== 1) {
          context.report({
            node: node,
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

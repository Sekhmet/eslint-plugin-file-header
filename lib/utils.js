const COMMENT_REGEX = /^[ *]*(.*?)[ ]*$/;

function stripComment(comment) {
  return comment.match(COMMENT_REGEX)[1];
}

function createComment(source, type = "line") {
  if (type === "line") {
    return source.map(line => `// ${line}`).join("\n");
  }

  if (source.length === 1) {
    return `/* ${source[0]} */`;
  }

  return source
    .map((line, i) => {
      let newLine = line;
      if (i === 0) newLine = `/* ${newLine}`;
      if (i === source.length - 1) newLine = `${newLine} */`;
      if (i !== 0) newLine = ` * ${newLine}`;

      return newLine;
    })
    .join("\n");
}

module.exports = {
  stripComment,
  createComment
};

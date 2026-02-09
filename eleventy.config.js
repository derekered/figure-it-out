module.exports = function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy({ "src/assets": "assets" });
  const matter = require("gray-matter");
  const MarkdownIt = require("markdown-it");
  const markdown = new MarkdownIt({ html: true, breaks: true, linkify: true });

  eleventyConfig.addDataExtension("md", (contents) => {
    const parsed = matter(contents);
    return {
      ...parsed.data,
      content: markdown.render(parsed.content)
    };
  });

  return {
    dir: {
      input: "src",
      output: "_site",
      includes: "_includes",
      data: "_data"
    }
  };
};

var ARTIST_HEADER_START = "<!-- artistHeader -->";
var ARTIST_HEADER_END = "<!-- /artistHeader -->";

function splitArtistContent(content) {
  if (typeof content !== "string") {
    return {
      body: "",
      header: ""
    };
  }

  var startIndex = content.indexOf(ARTIST_HEADER_START);
  var endIndex = content.indexOf(ARTIST_HEADER_END);

  if (startIndex === -1 || endIndex === -1 || endIndex < startIndex) {
    return {
      body: content,
      header: ""
    };
  }

  var header = content.slice(startIndex + ARTIST_HEADER_START.length, endIndex).trim();
  var before = content.slice(0, startIndex).trim();
  var after = content.slice(endIndex + ARTIST_HEADER_END.length).trim();
  var body = [before, after].filter(Boolean).join("\n");

  return {
    body: body,
    header: header
  };
}

module.exports = function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy({ "src/assets": "assets" });
  eleventyConfig.addCollection("featuredArtists", function (collectionApi) {
    return collectionApi.getFilteredByTag("featuredArtist").sort(function (a, b) {
      var orderA = typeof a.data.order === "number" ? a.data.order : Number.MAX_SAFE_INTEGER;
      var orderB = typeof b.data.order === "number" ? b.data.order : Number.MAX_SAFE_INTEGER;

      if (orderA !== orderB) {
        return orderA - orderB;
      }

      return a.data.title.localeCompare(b.data.title);
    });
  });
  eleventyConfig.addFilter("artistBodyContent", function (content) {
    return splitArtistContent(content).body;
  });
  eleventyConfig.addFilter("artistHeaderContent", function (content) {
    return splitArtistContent(content).header;
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

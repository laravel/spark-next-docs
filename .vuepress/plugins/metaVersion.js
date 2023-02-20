var versions = ["1.x", "2.x", "3.x", "4.x"];

module.exports = (options = {}, context) => ({
  extendPageData($page) {
    const { regularPath, frontmatter } = $page;

    frontmatter.meta = [];

    versions.forEach(function(version) {
      if ($page.regularPath.includes("/" + version + "/")) {
        frontmatter.meta.push({
          name: "docsearch:version",
          content: version + ".x"
        });
      }
    });
  }
});

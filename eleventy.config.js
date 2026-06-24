import yaml from "js-yaml";

export default function (eleventyConfig) {
  // YAML data file support
  eleventyConfig.addDataExtension("yml", (contents) => yaml.load(contents));

  // Custom filter to sort Hall of Fame by date (newest first)
  eleventyConfig.addFilter("sortHallOfFame", (list) => {
    if (!Array.isArray(list)) return [];
    const parseDate = (dateStr) => {
      if (!dateStr) return new Date(0);
      const parts = dateStr.trim().split(/\s+/);
      if (parts.length < 2) return new Date(0);
      const [monthName, yearStr] = parts;
      const year = parseInt(yearStr, 10);
      const months = {
        january: 0, february: 1, march: 2, april: 3, may: 4, june: 5,
        july: 6, august: 7, september: 8, october: 9, november: 10, december: 11
      };
      const month = months[monthName.toLowerCase()] !== undefined ? months[monthName.toLowerCase()] : 0;
      return new Date(year, month, 1);
    };

    return [...list].sort((a, b) => {
      const dateA = parseDate(a['date-last-completed']);
      const dateB = parseDate(b['date-last-completed']);
      if (dateB.getTime() !== dateA.getTime()) {
        return dateB - dateA;
      }
      return (a.name || "").localeCompare(b.name || "");
    });
  });

  // Pass through static assets
  eleventyConfig.addPassthroughCopy("src/assets");

  return {
    dir: {
      input: "src",
      output: "_site",
      includes: "_includes",
      data: "_data",
    },
  };
}

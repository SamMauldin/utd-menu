import { DateTime } from "luxon";
import titleCaps from "./titlecaps.js";

// Clean up the menu, fixing formatting
// and removing certain fields
function cleanMenu(menu) {
  return menu.filter(section => {
    if (section.name == "Salad Bar") { return false; }
    if (section.name == "Deli Bar") { return false; }
    if (section.name == "Every Day") { return false; }

    return true;
  }).map(section => {
    return {
      name: section.name,
      categories: section.categories.map(category => {
        if (category.name == "Bakery-Dessert") {
          category.name = "Bakery";
        }
  
        if (category.name == "Pizza Pizza") {
          category.name = "Pizza";
        }

        return {
          name: category.name,
          items: category.items.map(item => {
            item.name = titleCaps(item.name);

            item.name = item.name.split(/,(?=[^ ])/).join(", ");
            item.name = item.name.split(/ ,/).join(",");

            item.name = item.name.split(/-(?=[^ ])/).join("- ");
            item.name = item.name.split(/(?=[^ ])-/).join(" -");

            item.name = item.name.split("2ct").join("2 ct");
            item.name = item.name.split("2 Ct").join("2 ct");
            item.name = item.name.split("2Ct").join("2 ct");
    
            item.name = item.name.split("&").join("and");

            return { name: item.name };
          })
        };
      })
    };
  });
}

export function fetch(apiDate, cb) {
  
  const apiStringParts = apiDate.toLocaleString(DateTime.DATE_SHORT).split("/");
	const apiString = [apiStringParts[2], apiStringParts[0], apiStringParts[1]].join("-");

  const cacheKey = `dhw.${apiString}`;
  const cached = checkCache(cacheKey);

  if (cached) {
    cb(undefined, cached);
  } else {
    const apiReq = new XMLHttpRequest();
		apiReq.addEventListener("load", function() {
			const res = cleanMenu(JSON.parse(apiReq.responseText).menu.periods);

      saveToCache(cacheKey, res);
      
      cb(undefined, res);
    });
    
    apiReq.addEventListener("error", function(err) {
      cb(err || true);
    });

		apiReq.open("GET", `https://api.dineoncampus.com/v1/location/menu?site_id=5751fd3790975b60e04893f2&platform=0&location_id=5871478b3191a200db4e6a2b&date=${apiString}`);
		apiReq.send();
  }
}

let cacheVer = 4;

let cache = {
  entries: {},
  version: cacheVer
};

try {
  let loadCache = JSON.parse(localStorage["utd-menu-cache"]);
  if (loadCache.version == cacheVer) {
    cache = loadCache;
  }
} catch (e) {}

function checkCache(key) {
  if (cache.entries[key]) {
    // Refresh used time
    saveToCache(key, cache.entries[key].data);
    return cache.entries[key].data;
  }

  return false;
}

function saveToCache(key, value) {
  cache.entries[key] = {
    data: value,
    lastUsed: DateTime.local().toISO()
  };
  localStorage["utd-menu-cache"] = JSON.stringify(cache);
}

function pruneCache() {

  // Remove all cache entries not used in the past three days
  const pruneBefore = DateTime.local().minus({
    days: 3
  });
  let dirty = false;

  Object.keys(cache.entries).forEach(entryName => {
    const entry = cache.entries[entryName];
    const lastUsed = DateTime.fromISO(entry.lastUsed);

    if (lastUsed < pruneBefore) {
      dirty = true;
      delete cache.entries[entryName];
    }
  });

  if (dirty) {
    localStorage["utd-menu-cache"] = JSON.stringify(cache);
  }
}

pruneCache();
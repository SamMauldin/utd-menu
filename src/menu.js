/*

	Copyright 2019 Sam Mauldin. All rights reserved.

	This file is part of utd-menu.

	utd-menu is free software: you can redistribute it and/or modify
	it under the terms of the GNU Affero General Public License as published by
	the Free Software Foundation, either version 3 of the License, or
	(at your option) any later version.

	utd-menu is distributed in the hope that it will be useful,
	but WITHOUT ANY WARRANTY; without even the implied warranty of
	MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
	GNU Affero General Public License for more details.

	You should have received a copy of the GNU Affero General Public License
	along with utd-menu. If not, see <https://www.gnu.org/licenses/>.

*/

import { DateTime } from "luxon";
import titleCaps from "./titlecaps.js";

// Clean up the menu, fixing formatting
// and removing certain fields
function cleanMenu(menu) {
  // Filter out unwanted sections
  return menu.filter(section => {
    if (section.name == "Salad Bar") { return false; }
    if (section.name == "Deli Bar") { return false; }
    if (section.name == "Every Day") { return false; }
    
    return true;
  }).map(section => {
    // Clean each section
    return {
      name: section.name,
      // Remove unwanted categories
      categories: section.categories.filter(category => {
        if (category.name == "Salad") { return false; }
        if (category.name == "Deli") { return false; }
        if (category.name == "My Pantry") { return false; }

        return true;
      }).map(category => {
        // Stylistic name changes
        if (category.name == "Bakery-Dessert") {
          category.name = "Bakery";
        }
  
        if (category.name == "Pizza Pizza" || category.name == "Pizza, Flatbreads") {
          category.name = "Pizza";
        }

        if (category.name == "Salad Bar Composed Salads") {
          category.name = "Salads";
        }

        if (category.name == "Comfort/Homestyle") {
          category.name = "Comfort / Homestyle";
        }

        if (category.name == "wok") {
          category.name = "Wok";
        }

        if (category.name == "wok") {
          category.name = "Wok";
        }

        return {
          name: category.name,
          items: category.items.map(item => {
            // Item name formatting and changes
            item.name = titleCaps(item.name);

            item.name = item.name.split(/,(?=[^ ])/).join(", ");
            item.name = item.name.split(/ ,/).join(",");

            item.name = item.name.split(/-(?=[^ ])/).join("- ");
            item.name = item.name.split(/(?=[^ ])-/).join(" -");

            item.name = item.name.split("2ct").join("2 ct");
            item.name = item.name.split("2 Ct").join("2 ct");
            item.name = item.name.split("2Ct").join("2 ct");
    
            item.name = item.name.split("&").join("and");

            item.name = item.name.split("MandM").join("M&M");

            return { name: item.name };
          })
        };
      })
    };
  });
}

// Require items for a date
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

// Cache system: fetched items should never change, so we can keep the
// latest entires. Space isn't a huge concern and we don't need to
// use old items, so we can simply evict items after they
// haven't been used in a few days.

let cacheVer = 4;

let cache = {
  entries: {},
  version: cacheVer
};

// Attempt to load the cache, but default to an empty one.
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
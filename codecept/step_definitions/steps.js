const fetch = require("node-fetch");
const flatten = require("array-flatten");
const cheerio = require("cheerio");
const assert = require("assert");

const I = actor();

Given("пользователь открыл страниц {string}", url => {
  I.amOnPage(url);
});

Given("пользователь ввёл в поле поиска {string}", needle => {
  I.fillField("input[name=needle]", needle);
});

When("он нажимает на кнопку поиска", () => {
  I.click("button[type=submit]");
});

Then(
  "он увидит те имена, которые вернутся из API при поиске подстроки {string}",
  async needle => {
    const responseJson = await searchNamesByApi(needle);
    const namesFromApi = flatten(responseJson.groups.map(group => group.names));

    const searchResult = await I.grabTextFrom(".tag");

    assert.deepStrictEqual(searchResult, namesFromApi);
  }
);

Then(
  "имена сгруппированы так, как вернуло API при поиске подстроки {string}",
  async needle => {
    const searchResultGroups = await I.grabHTMLFrom(".search-result-group");

    const searchResult = searchResultGroups.map(groupHtml => {
      const $ = cheerio.load(groupHtml);

      return {
        title: $(".title").text(),
        names: $(".tag")
          .map(function() {
            return $(this).text();
          })
          .get()
      };
    });

    const namesFromApi = await searchNamesByApi(needle);
    const groupsFromApi = stripCounts(namesFromApi);

    assert.deepStrictEqual(searchResult, groupsFromApi.groups);
  }
);

async function searchNamesByApi(needle) {
  const apiResponse = await fetch("http://localhost:3001/api/search", {
    method: "post",
    body: JSON.stringify({
      needle
    }),
    headers: {
      "Content-Type": "application/json"
    }
  });

  return await apiResponse.json();
}

function stripCounts(apiSearchResults) {
  return {
    groups: apiSearchResults.groups.map(group => ({
      title: group.title,
      names: group.names
    }))
  };
}

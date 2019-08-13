<!--

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
	
-->

<script>
  export let section;
</script>

<style>
  * {
    text-align: center;
  }

  h1 {
    margin-bottom: 0.2em;
  }

  hr {
    width: 4em;
    margin-top: 0em;
    margin-bottom: 0.5em;
  }

  ul {
    padding: 0em;
  }

  li {
    list-style-type: none;
  }

  .container {
    width: 100%;
  }

  ul {
    margin: 0em;
    margin-top: 0.1em;
    margin-bottom: 1em;
  }

  li, h2 {
    margin: 0em;
    padding: 0em;
  }
</style>

<div class="container">

  <h1>{section.name}</h1>
  <hr>

  {#each section.categories as category}
    <h2>{category.name}</h2>
    <ul>
      {#each category.items as item}
        <li>{item.name}</li>
      {/each}
    </ul>
  {/each}

</div>
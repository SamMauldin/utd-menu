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
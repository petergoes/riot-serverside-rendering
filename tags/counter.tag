<counter>
  <h1>Press the button</h1>
  <p>You pressed the button { counter } times</p>
  <form action="/" method="GET">
    <input type="hidden" name="counter" value="{ counter + 1 }">

    <button onclick="{ increase }">Click me</button>
  </form>

  <script>
    this.counter = parseInt(this.opts.counter, 10);

    this.increase = (event) => {
      this.counter++;

      event.preventDefault();
    }
  </script>
</counter>

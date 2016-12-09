<todo-overview>
	
	<header data-is="app-header"></header>
	
	<todo-add></todo-add>

	<main>
		<h2>A list of todos</h2>

		<ul>
			<li each="{ todo in opts.todos }">{ todo.name }</li>
		</ul>
	</main>

</todo-overview>

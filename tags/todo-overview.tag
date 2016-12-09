<todo-overview>
	
	<header data-is="app-header"></header>
	
	<todo-add></todo-add>

	<main>
		<h2>A list of todos</h2>
		
		<form action="/" method="POST">
			<ul>
				<li each="{ todo in opts.todos }">
					{ todo.name }
					<label>
						Completed 
						<input 
							type="checkbox" 
							name="completed"
							checked="{ todo.completed }"
							value="{ todo._id }" />
					</label>

					<label>
						Delete
						<input 
							type="checkbox" 
							name="delete"
							value="{ todo._id }" />
					</label>

				</li>
			</ul>

			<button>Save</button>
		</form>
	</main>

</todo-overview>

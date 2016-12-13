<todo-overview>
	
	<header data-is="app-header"></header>
	
	<todo-add ref="todoAdd" add-todo-callback="{ formSubmit }"></todo-add>

	<main>
		<h2>A list of todos</h2>
		
		<form action="/" method="POST" onsubmit="{ formSubmit }">
			<ul>
				<li each="{ todo in opts.todos }">
					{ todo.name }
					-
					<label>
						Completed 
						<input 
							type="checkbox" 
							name="completed"
							checked="{ todo.completed }"
							value="{ todo._id }" />
					</label>
					-
					<label>
						Delete
						<input 
							type="checkbox" 
							name="delete"
							value="{ todo._id }" />
					</label>

				</li>
			</ul>

			<input type="submit" value="save" />
		</form>
	</main>

	<script>
		this.formSubmit = (event) => {
			event.preventDefault();
			const form = event.target;
			const formData = new FormData(form);

			fetch(form.action, {
					method: form.method,
					headers: { 
						"Accept" : "application/json"
					},
					body: formData
				})
				.catch(err => console.log(err));
		}
	</script>

</todo-overview>

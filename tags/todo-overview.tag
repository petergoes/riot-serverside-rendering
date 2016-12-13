<todo-overview>
	
	<header data-is="app-header"></header>
	
	<todo-add ref="todoAdd" add-todo-callback="{ formSubmit }"></todo-add>

	<main>
		<h2>A list of todos</h2>
		
		<form action="/" method="POST" onsubmit="{ formSubmit }" ref="form">
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
							onchange="{ formSubmit }"
							value="{ todo._id }" />
					</label>
					-
					<label>
						Delete
						<input 
							type="checkbox" 
							name="delete"
							onchange="{ formSubmit }"
							value="{ todo._id }" />
					</label>

				</li>
			</ul>
			<input if="{ opts.env === 'server' }" type="submit" value="save" />
		</form>
	</main>

	<script>
		this.formSubmit = (event) => {
			event.preventDefault();
			const form = this.refs.form;
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

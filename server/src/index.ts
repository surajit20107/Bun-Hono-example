import { Hono } from "hono"
import { v4 as uuid } from "uuid"
import test from "./test"

const app = new Hono()

type Todo = {
  id: string
  todo: string
  completed: boolean
}

let todos: Todo[] = []

app.get("/test", (c) => {
  return c.json({
    message: test()
  })
})

// get all todos
app.get("/", (c) => {
  return c.json(todos)
})

// create todo
app.post("/", async (c) => {
  const { todo } = await c.req.json()

  if (!todo) {
    return c.json({
      message: "Todo body is required"
    }, 400)
  }

  const newTodo: Todo = {
    id: uuid(),
    todo,
    completed: false
  }

  if (!newTodo) {
    return c.json({
      message: "Failed to create todo"
    }, 500)
  }

  todos.push(newTodo)

  return c.json(newTodo, 201)
})

// toggle todo
app.put("/:id", (c) => {
  const id = c.req.param("id")
  for (const todo of todos) {
    if (todo.id === id) {
      todo.completed = !todo.completed
      return c.json({
        message: "Todo updated"
      })
    }
  }
  return c.json({
    message: "Todo not found"
  })
})

// update todo
app.patch("/:id", async (c) => {
  const id = c.req.param("id")
  const { todo } = await c.req.json()
  for (const todoItem of todos) {
    if (todoItem.id === id) {
      todoItem.todo = todo
      return c.json({
        message: "Todo updated"
      })
    }
  }
  return c.json({
    message: "Todo not found"
  })
})

//delete todo using filter
app.delete("/:id", async (c) => {
  const id = c.req.param("id")
  for (const todo of todos) {
    if (todo.id === id) {
      todos = todos.filter((todo) => todo.id !== id)
      return c.json({
        message: "Todo deleted"
      })
    }
  }
  return c.json({
    message: "Todo not found"
  })
})

export default {
  port: 5000,
  fetch: app.fetch
}

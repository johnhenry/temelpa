import Head from "next/head";
import React, { useEffect, useState, useCallback } from "react";
import NewTodoInput from "src/components/NewTodoInput";
import TodoFooter from "src/components/TodoFooter";
import TodoList from "src/components/TodoList";
import TodoMarkAll from "src/components/TodoMarkAll";
import { Filter } from "src/models/filter";
const Filters: {
    ACTIVE: Filter;
    COMPLETED: Filter;
} = {
    ACTIVE: "active",
    COMPLETED: "completed",
};
import { Todo } from "src/models/todo";

import { List } from "immutable";
const createTodo = (title: string) => ({
    id: Math.random(),
    title,
    editing: false,
    completed: false,
});

export default function Home() {
    const [todos, setTodos]: [List<Todo>, Function] = useState(List([]));
    const [currentTodos, setCurrentTodos]: [
        List<Todo>,
        (todos: List<Todo>) => void
    ] = useState(todos);
    const [filter, setFilter]: [Filter, Function] = useState("all");
    const completedTodos: List<Todo> = todos.filter(
        ({ completed }: Todo) => completed
    );
    const activeTodos: List<Todo> = todos.filter(
        ({ completed }: Todo) => !completed
    );
    const hashChangeHandler = useCallback(() => {
        setFilter(window.location.hash.split("#/")[1] || "all");
    }, []);

    useEffect(() => {
        hashChangeHandler();
        window.addEventListener("hashchange", hashChangeHandler);
        return () => {
            window.removeEventListener("hashchange", hashChangeHandler);
        };
    }, []);

    useEffect(() => {
        setCurrentTodos(
            filter === Filters.ACTIVE
                ? activeTodos
                : filter === Filters.COMPLETED
                ? completedTodos
                : todos
        );
    }, [todos, filter]);

    return (
        <>
            <Head>
                <title>TodoMVC</title>
            </Head>

            <section className="todoapp">
                <header className="header">
                    <h1>todos</h1>
                    <NewTodoInput
                        onNewTodo={(title) => {
                            if (!title.trim()) {
                                return;
                            }
                            const todo = createTodo(title);
                            setTodos(todos.push(todo));
                        }}
                    />
                </header>

                <section className="main">
                    <TodoMarkAll
                        numCompletedTodos={completedTodos.size}
                        numTodos={todos.size}
                        onMarkAllActive={() =>
                            setTodos(
                                todos.map((x: Todo) => ({
                                    ...x,
                                    completed: false,
                                }))
                            )
                        }
                        onMarkAllCompleted={() =>
                            setTodos(
                                todos.map((x: Todo) => ({
                                    ...x,
                                    completed: true,
                                }))
                            )
                        }
                    />
                    <TodoList
                        todos={currentTodos}
                        onEdit={(id) => {
                            setTodos(
                                todos.map((x: Todo) =>
                                    x.id === id ? { ...x, editing: true } : x
                                )
                            );
                        }}
                        onDelete={(id) => {
                            setTodos(todos.filter((x: Todo) => x.id !== id));
                        }}
                        onToggleComplete={(id) => {
                            setTodos(
                                todos.map((x: Todo) =>
                                    x.id === id
                                        ? { ...x, completed: !x.completed }
                                        : x
                                )
                            );
                        }}
                        onSetTitle={(id, title) => {
                            setTodos(
                                todos.map((x: Todo) =>
                                    x.id === id
                                        ? { ...x, title, editing: false }
                                        : x
                                )
                            );
                        }}
                    />
                </section>

                <TodoFooter
                    filter={filter}
                    numActiveTodos={activeTodos.size}
                    numTodos={todos.size}
                    onClearCompleted={() => {
                        setTodos(todos.filter(({ completed }) => !completed));
                    }}
                />
            </section>

            <footer className="info">
                <p>Double-click to edit a todo</p>
                <p>
                    Part of <a href="http://todomvc.com">TodoMVC</a>
                </p>
            </footer>
        </>
    );
}

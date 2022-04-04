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
    const [todos, setTodosIntermediate]: [List<Todo>, Function] = useState(
        List([])
    );
    const [history, setHistory]: [any, Function] = useState({
        getPrev: null,
        todos,
        getNext: null,
    });

    const setTodos = (todos: List<Todo>) => {
        const current: {
            getPrev: any;
            todos: List<Todo>;
            getNext: any;
        } = {
            getPrev: {
                getPrev: null,
                todos: List([]),
                getNext: null,
            },
            todos,
            getNext: null,
        };
        current.getPrev.getNext = current;
        current.getPrev.todos = history.todos;
        current.getPrev.getPrev = history.getPrev;
        setHistory(current);
        setTodosIntermediate(current.todos);
    };
    const setHistoryPrevious = () => {
        const current = history.getPrev;
        current.getNext = history;
        setHistory(current);
        setTodosIntermediate(current.todos);
    };
    const setHistoryNext = () => {
        const current = history.getNext;
        setHistory(current);
        setTodosIntermediate(current.todos);
    };
    useEffect(() => {
        console.log({ history });
    }, [history]);

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
                <button
                    disabled={!history.getPrev}
                    onClick={setHistoryPrevious}
                >
                    Undo
                </button>
                <button disabled={!history.getNext} onClick={setHistoryNext}>
                    Redo
                </button>
                <p>Double-click to edit a todo</p>
                <p>
                    Part of <a href="http://todomvc.com">TodoMVC</a>
                </p>
            </footer>
        </>
    );
}

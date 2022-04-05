import React, { useEffect, useRef } from "react";

type Props = {
    onUpdateFilterText: (title: string) => void;
};

export default function NewTodoInput({ onUpdateFilterText }: Props) {
    const inputRef = useRef<HTMLInputElement | null>(null);

    const onKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        onUpdateFilterText(inputRef.current.value);
    };

    useEffect(() => {
        inputRef.current?.focus();
    }, []);

    return (
        <input
            className="new-todo"
            ref={inputRef}
            placeholder="Search for text?"
            onKeyPress={onKeyPress}
        />
    );
}

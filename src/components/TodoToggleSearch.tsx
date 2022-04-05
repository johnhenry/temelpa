import { useState } from "react";
type Props = {
    numTodos: number;
    onToggleSearchComplete: () => void;
};

export default function TodoMarkAll({
    numTodos,
    onToggleSearchComplete,
}: Props) {
    if (numTodos == 0) {
        return null;
    }
    const [searchMode, setSearchMode] = useState(false);

    return (
        <button
            onClick={() => {
                const mode = !searchMode;
                setSearchMode(mode);
                onToggleSearchComplete(mode);
            }}
        >
            {searchMode ? "searching" : "click to search"}
        </button>
    );
}

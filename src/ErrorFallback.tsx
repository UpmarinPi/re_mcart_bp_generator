import type {FallbackProps} from "react-error-boundary";

function ErrorFallback({error}: FallbackProps) {
    return (
        <div>
            <h2>ERROR</h2>
            <pre>{error instanceof Error ? error.stack : String(error)}</pre>
        </div>
    );
}

export default ErrorFallback;
import type {FallbackProps} from "react-error-boundary";

function ErrorFallback({error}: FallbackProps) {
    return (
        <div>
            <h2>ERROR</h2>
            <pre>{error.stack}</pre>
        </div>
    );
}

export default ErrorFallback;
import { useRouteError } from "react-router-dom";

export default function ErrorPage() {
  const error: any = useRouteError();
  console.error(error);

  if (error === "forbidden") {
    return (
      <div id="error-page">
        <h1>Unauthorised</h1>
        <p>
          Sorry, you do not have permission to access the requested information.
        </p>
      </div>
    );
  }

  return (
    <div id="error-page">
      <h1>Oops!</h1>
      <p>Sorry, an unexpected error has occurred.</p>
      <p>
        <i>{error?.statusText || error?.message}</i>
      </p>
    </div>
  );
}

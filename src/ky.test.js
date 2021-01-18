import { useState, useEffect } from "react";
import { rest } from "msw";
import { setupServer } from "msw/node";
import ky from "ky";
import { render, screen } from "@testing-library/react";

const server = setupServer(
  rest.get("/api/test", (req, res, ctx) =>
    res(ctx.json({ message: "Hello, world!" }))
  )
);

beforeAll(() => server.listen());
afterAll(() => server.close());

test("ky", async () => {
  const Component = () => {
    const [data, setData] = useState(null);
    useEffect(() => {
      ky.get("/api/test")
        .json()
        .then((response) => setData(response));
    }, []);
    return data?.message || null;
  };
  render(<Component />);
  expect(await screen.findByText("Hello, world!")).toBeInTheDocument();
});

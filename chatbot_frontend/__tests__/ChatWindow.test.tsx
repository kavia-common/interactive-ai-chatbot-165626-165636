import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { ChatWindow } from "../src/components/ChatWindow";

jest.mock("../src/utils/api", () => ({
  sendMessage: jest.fn().mockImplementation(({ content }) =>
    Promise.resolve({
      content: `[MOCKED AI]: ${content}`,
      author: "assistant",
    })
  ),
}));

describe("ChatWindow", () => {
  it("renders intro and sends/receives message", async () => {
    render(<ChatWindow />);
    expect(
      screen.getByText(/ocean professional ai assistant/i)
    ).toBeInTheDocument();

    const input = screen.getByPlaceholderText(/type a message/i);
    fireEvent.change(input, { target: { value: "Hello" } });

    const sendBtn = screen.getByRole("button", { name: /send/i });
    fireEvent.click(sendBtn);

    await waitFor(() =>
      expect(screen.getByText("[MOCKED AI]: Hello")).toBeInTheDocument()
    );
  });
});

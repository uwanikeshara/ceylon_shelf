import { useEffect } from "react";
import { io, Socket } from "socket.io-client";
import toast from "react-hot-toast";

let socket: Socket | null = null;

export const useSocket = (onUpdate?: () => void) => {
  useEffect(() => {
    if (!socket) {
      const backendUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";
      socket = io(backendUrl, {
        autoConnect: true,
        transports: ["websocket", "polling"],
      });
    }

    const handleBookUpdate = (data: any) => {
      if (data.action === "create") toast.success(`New Book Cataloged: "${data.book?.title}"`);
      if (data.action === "update") toast.success("Catalog record updated");
      if (data.action === "delete") toast.error("Book record removed from catalog");
      if (onUpdate) onUpdate();
    };

    const handleLendingUpdate = (data: any) => {
      if (data.action === "create") toast.success("Book issued to member");
      if (data.action === "complete") toast.success("Book returned to circulation");
      if (onUpdate) onUpdate();
    };

    const handleReaderUpdate = (data: any) => {
      if (data.action === "create") toast.success(`New member registered: ${data.reader?.name}`);
      if (onUpdate) onUpdate();
    };

    socket.on("book_updated", handleBookUpdate);
    socket.on("lending_updated", handleLendingUpdate);
    socket.on("reader_updated", handleReaderUpdate);

    return () => {
      if (socket) {
        socket.off("book_updated", handleBookUpdate);
        socket.off("lending_updated", handleLendingUpdate);
        socket.off("reader_updated", handleReaderUpdate);
      }
    };
  }, [onUpdate]);

  return socket;
};
